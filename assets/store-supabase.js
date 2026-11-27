// Реальный режим: тот же интерфейс, что у демо-хранилища (assets/store.js), но данные в Supabase.
// Включается автоматически, когда в assets/config.js заполнены own.supabaseUrl и own.anonKey.
// ВАЖНО: anonKey публичный по замыслу Supabase — доступ защищают политики в supabase/schema.sql.
(function () {
  var cfg = ((window.SITE_CONFIG || {}).own) || {};
  if (!cfg.supabaseUrl || !cfg.anonKey || !window.supabase || !window.GrindStore) return;
  var sb = window.supabase.createClient(cfg.supabaseUrl, cfg.anonKey, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } });
  var H = window.GrindStore.helpers;
  var hoursCache = {};

  function fail(r) { if (r.error) throw new Error(r.error.message); return r.data; }
  function app(r) { return { id: r.id, staffId: r.staff_id, serviceId: r.service_id, start: r.start_at, end: r.end_at, clientName: r.client_name, clientPhone: r.client_phone, note: r.note, status: r.status, source: r.source }; }
  function toRow(p) {
    var m = { serviceId: "service_id", start: "start_at", end: "end_at", clientName: "client_name", clientPhone: "client_phone", note: "note", status: "status" }, o = {};
    Object.keys(p).forEach(function (k) { if (m[k]) o[m[k]] = p[k]; });
    return o;
  }

  var store = {
    mode: "supabase",
    helpers: H,
    listStaff: function () { return sb.from("staff").select("id,name,role,color,img").order("name").then(fail); },
    listServices: function () { return sb.from("services").select("id,title,minutes,price").eq("active", true).order("minutes").then(fail); },
    getHours: function (staffId) {
      if (hoursCache[staffId]) return Promise.resolve(hoursCache[staffId]);
      return sb.from("staff").select("hours").eq("id", staffId).single().then(fail).then(function (r) { hoursCache[staffId] = r.hours; return r.hours; });
    },
    setHours: function (staffId, hours) { delete hoursCache[staffId]; return sb.from("staff").update({ hours: hours }).eq("id", staffId).then(fail).then(function () { return hours; }); },
    listAppointments: function (staffId, fromISO, toISO) {
      var q = sb.from("appointments").select("*").lt("start_at", toISO).gt("end_at", fromISO).order("start_at");
      if (staffId) q = q.eq("staff_id", staffId);
      return q.then(fail).then(function (rows) { return rows.map(app); });
    },
    listBlocks: function (staffId, fromISO, toISO) {
      return sb.from("blocks").select("*").eq("staff_id", staffId).lt("start_at", toISO).gt("end_at", fromISO).then(fail).then(function (rows) {
        return rows.map(function (b) { return { id: b.id, staffId: b.staff_id, start: b.start_at, end: b.end_at, reason: b.reason }; });
      });
    },
    // Свободные окна: часы мастера минус занятое время (функция busy отдаёт только интервалы, без имён).
    slots: function (staffId, dateStr, minutes, excludeId) {
      var from = H.at(dateStr, "00:00"), to = new Date(from.getTime() + 86400000);
      return Promise.all([store.getHours(staffId), sb.rpc("busy", { p_staff: staffId, p_from: from.toISOString(), p_to: to.toISOString() }).then(fail)]).then(function (r) {
        var busy = (r[1] || []).map(function (x) { return { id: "b", status: "booked", start: x.start_at, end: x.end_at }; });
        return H.computeSlots(r[0], busy, [], dateStr, minutes, excludeId);
      });
    },
    createAppointment: function (a) {
      var start = a.start ? new Date(a.start) : H.at(a.date, a.time);
      if (a.source === "staff") { // мастер вносит запись сам: обычная вставка под его правами
        var minutes = a.minutes || 60;
        return sb.from("appointments").insert({ staff_id: a.staffId, service_id: a.serviceId, start_at: start.toISOString(), end_at: new Date(start.getTime() + minutes * 60000).toISOString(), client_name: a.clientName || "", client_phone: a.clientPhone || "", note: a.note || "", source: "staff" }).select().single().then(fail).then(app);
      }
      return sb.rpc("book_appointment", { p_staff: a.staffId, p_service: a.serviceId, p_start: start.toISOString(), p_name: a.clientName, p_phone: a.clientPhone, p_note: a.note || "" }).then(fail).then(app);
    },
    updateAppointment: function (id, patch) { return sb.from("appointments").update(toRow(patch)).eq("id", id).select().single().then(fail).then(app); },
    deleteAppointment: function (id) { return sb.from("appointments").delete().eq("id", id).then(fail).then(function () { return true; }); },
    addBlock: function (b) { return sb.from("blocks").insert({ staff_id: b.staffId, start_at: b.start, end_at: b.end, reason: b.reason || "" }).select().single().then(fail); },
    removeBlock: function (id) { return sb.from("blocks").delete().eq("id", id).then(fail).then(function () { return true; }); },

    // ---- вход ----
    authInfo: function () { return sb.auth.getSession().then(function (r) { var u = r.data && r.data.session && r.data.session.user; return { signedIn: !!u, email: u ? u.email : "" }; }); },
    staffSession: function () {
      return sb.auth.getSession().then(function (r) {
        if (!r.data.session) return null;
        return sb.rpc("claim_staff").then(function (x) { return x.data && x.data.id ? { staffId: x.data.id } : null; });
      });
    },
    // Вход мастера: обычный Google-вход (только почта и имя, без доступа к календарю). Календарь синхронизирует сервер.
    signInStaff: function () { return sb.auth.signInWithOAuth({ provider: "google", options: { redirectTo: location.href.split("#")[0] } }); },
    signInClient: function () { return sb.auth.signInWithOAuth({ provider: "google", options: { redirectTo: location.href.split("#")[0] } }); },
    signOut: function () { return sb.auth.signOut().then(function () { return true; }); },
    myAppointments: function () {
      return sb.auth.getSession().then(function (r) {
        if (!r.data.session) return null;
        return sb.from("appointments").select("*").eq("client_user", r.data.session.user.id).order("start_at", { ascending: false }).then(fail).then(function (rows) { return rows.map(app); });
      });
    },
    googleStatus: function () {
      return sb.auth.getSession().then(function (r) {
        var u = r.data.session; if (!u) return { connected: false, reason: "Войдите в кабинет." };
        return sb.from("staff").select("google_calendar_id,gcal_synced").eq("user_id", u.user.id).single().then(function (x) {
          var row = x.data || {};
          return row.gcal_synced ? { connected: true } : { connected: false, reason: "Синхронизация включается так: откройте свой Google Calendar → «Настройки календаря» → «Доступ для отдельных людей» → добавьте почту сервиса из supabase/README.md с правом «Вносить изменения в мероприятия»." };
        });
      });
    },
    resetDemo: function () { return Promise.resolve(true); }
  };
  window.GrindStore = store;
})();
