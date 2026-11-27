// Слой данных для записи: мастера, услуги, часы работы, записи, блокировки времени.
// Два режима с одним интерфейсом (все методы возвращают Promise):
//   • демо — данные в localStorage браузера (работает сразу, без сервера);
//   • supabase — настоящая база (включается, когда в assets/config.js заполнен own.supabaseUrl и own.anonKey).
// Время хранится как ISO-строки, "минуты от полуночи" — только внутри расчёта слотов.
(function () {
  var cfg = ((window.SITE_CONFIG || {}).own) || {};
  var LS = "grind-store-v1";
  var STEP = 30;

  var DEFAULT_SERVICES = [
    { id: "cut", title: "Стрижка", minutes: 60, price: 150 },
    { id: "beard", title: "Борода", minutes: 30, price: 100 },
    { id: "combo", title: "Стрижка + борода", minutes: 90, price: 230 },
    { id: "long", title: "Удлинённая ножницами", minutes: 90, price: 180 }
  ];
  var STAFF = [
    { id: "dima", name: "Дима", role: "Основатель · барбер", color: "#ff6a13", img: "assets/img/dima.jpg" },
    { id: "tasha", name: "Таша", role: "Основатель · барбер · дреды", color: "#d7ff1a", img: "assets/img/tasha.jpg" },
    { id: "kirill", name: "Кирилл", role: "Барбер", color: "#5aa9ff", img: "assets/img/kirill.jpg" }
  ];
  // 0 = воскресенье. [начало, конец] в формате "ЧЧ:ММ", null — выходной.
  var DEFAULT_HOURS = [["10:00", "20:00"], ["10:00", "20:00"], ["10:00", "20:00"], ["10:00", "20:00"], ["10:00", "20:00"], ["09:00", "15:00"], null];

  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function ymd(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function hm(d) { return pad(d.getHours()) + ":" + pad(d.getMinutes()); }
  function toMin(t) { var p = t.split(":"); return +p[0] * 60 + +p[1]; }
  function fromMin(m) { return pad(Math.floor(m / 60)) + ":" + pad(m % 60); }
  function at(dateStr, t) { var p = dateStr.split("-"), q = t.split(":"); return new Date(+p[0], +p[1] - 1, +p[2], +q[0], +q[1], 0, 0); }
  function uid() { return "a" + Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4); }

  // ---------- демо-хранилище ----------
  function seed() {
    var base = new Date(); base.setHours(0, 0, 0, 0);
    var names = [["Антон", "050-111-2233"], ["Вася", "052-333-4455"], ["Николай", "054-777-8899"], ["Josh", "053-222-1100"], ["Миша", "050-909-1212"], ["Лёва", "058-444-5566"]];
    var apps = [], n = 0;
    [["dima", 0, "11:00", "cut"], ["dima", 0, "13:30", "combo"], ["dima", 1, "10:00", "cut"], ["dima", 1, "15:00", "beard"], ["dima", 2, "12:00", "long"],
     ["kirill", 0, "10:00", "cut"], ["kirill", 0, "16:00", "beard"], ["kirill", 1, "11:00", "combo"], ["tasha", 0, "12:00", "cut"], ["tasha", 2, "14:00", "cut"]].forEach(function (x) {
      var d = new Date(base); d.setDate(d.getDate() + x[1]);
      var wd = d.getDay(); if (DEFAULT_HOURS[wd] === null) return; // не ставим на выходной
      var svc = DEFAULT_SERVICES.filter(function (s) { return s.id === x[3]; })[0];
      var st = at(ymd(d), x[2]), en = new Date(st.getTime() + svc.minutes * 60000), c = names[n++ % names.length];
      apps.push({ id: uid(), staffId: x[0], serviceId: x[3], start: st.toISOString(), end: en.toISOString(), clientName: c[0], clientPhone: c[1], note: "", status: "booked", source: "demo" });
    });
    return { apps: apps, blocks: [], hours: {}, session: null };
  }
  function load() { try { var s = JSON.parse(localStorage.getItem(LS)); if (s && s.apps) return s; } catch (e) {} var s2 = seed(); save(s2); return s2; }
  function save(s) { try { localStorage.setItem(LS, JSON.stringify(s)); } catch (e) {} }
  function resolve(v) { return Promise.resolve(JSON.parse(JSON.stringify(v === undefined ? null : v))); }

  // ---------- общий расчёт слотов ----------
  function computeSlots(hours, apps, blocks, dateStr, minutes, excludeId) {
    var d = at(dateStr, "00:00"), h = hours[d.getDay()];
    if (!h) return [];
    var open = toMin(h[0]), close = toMin(h[1]), out = [];
    var now = new Date();
    for (var m = open; m + minutes <= close; m += STEP) {
      var s = at(dateStr, fromMin(m)), e = new Date(s.getTime() + minutes * 60000);
      if (s.getTime() < now.getTime() + 15 * 60000) continue;
      var clash = apps.some(function (a) { return a.id !== excludeId && a.status !== "cancelled" && new Date(a.start) < e && new Date(a.end) > s; }) ||
                  blocks.some(function (b) { return new Date(b.start) < e && new Date(b.end) > s; });
      if (!clash) out.push(fromMin(m));
    }
    return out;
  }

  // ---------- демо-реализация ----------
  var demo = {
    mode: "demo",
    listStaff: function () { return resolve(STAFF); },
    listServices: function () { var c = (window.SITE_CONFIG || {}).services; return resolve((c && c.length ? c.map(function (s) { return { id: s.id, title: s.t, minutes: parseInt(s.d, 10) || 60, price: s.p }; }) : DEFAULT_SERVICES)); },
    getHours: function (staffId) { var s = load(); return resolve(s.hours[staffId] || DEFAULT_HOURS); },
    setHours: function (staffId, hours) { var s = load(); s.hours[staffId] = hours; save(s); return resolve(hours); },
    listAppointments: function (staffId, fromISO, toISO) {
      var s = load(), f = new Date(fromISO), t = new Date(toISO);
      return resolve(s.apps.filter(function (a) { return (!staffId || a.staffId === staffId) && new Date(a.start) < t && new Date(a.end) > f; }).sort(function (a, b) { return new Date(a.start) - new Date(b.start); }));
    },
    listBlocks: function (staffId, fromISO, toISO) {
      var s = load(), f = new Date(fromISO), t = new Date(toISO);
      return resolve(s.blocks.filter(function (b) { return b.staffId === staffId && new Date(b.start) < t && new Date(b.end) > f; }));
    },
    slots: function (staffId, dateStr, minutes, excludeId) {
      var s = load();
      return resolve(computeSlots(s.hours[staffId] || DEFAULT_HOURS, s.apps.filter(function (a) { return a.staffId === staffId; }), s.blocks.filter(function (b) { return b.staffId === staffId; }), dateStr, minutes, excludeId));
    },
    createAppointment: function (a) {
      var s = load();
      return demo.listServices().then(function (list) {
        var svc = list.filter(function (x) { return x.id === a.serviceId; })[0] || list[0];
        var st = a.start ? new Date(a.start) : at(a.date, a.time), en = new Date(st.getTime() + (a.minutes || svc.minutes) * 60000);
        var rec = { id: uid(), staffId: a.staffId, serviceId: svc.id, start: st.toISOString(), end: en.toISOString(), clientName: a.clientName || "", clientPhone: a.clientPhone || "", note: a.note || "", status: "booked", source: a.source || "site" };
        s.apps.push(rec); save(s); return rec;
      });
    },
    updateAppointment: function (id, patch) {
      var s = load(), a = s.apps.filter(function (x) { return x.id === id; })[0];
      if (!a) return Promise.reject(new Error("not found"));
      Object.keys(patch).forEach(function (k) { a[k] = patch[k]; });
      save(s); return resolve(a);
    },
    deleteAppointment: function (id) { var s = load(); s.apps = s.apps.filter(function (x) { return x.id !== id; }); save(s); return resolve(true); },
    addBlock: function (b) { var s = load(); var r = { id: uid(), staffId: b.staffId, start: b.start, end: b.end, reason: b.reason || "" }; s.blocks.push(r); save(s); return resolve(r); },
    removeBlock: function (id) { var s = load(); s.blocks = s.blocks.filter(function (x) { return x.id !== id; }); save(s); return resolve(true); },
    // вход мастера. В демо — просто выбор мастера; в реальном режиме — Google.
    staffSession: function () { var s = load(); return resolve(s.session); },
    signInStaff: function (staffId) { var s = load(); s.session = { staffId: staffId }; save(s); return resolve(s.session); },
    signOut: function () { var s = load(); s.session = null; save(s); return resolve(true); },
    googleStatus: function () { return resolve({ connected: false, reason: "Нужны Supabase и Google-проект (см. supabase/README.md)" }); },
    // демо: клиент находит свои записи по телефону (в реальном режиме — вход через Google)
    findByPhone: function (phone) {
      var d = String(phone || "").replace(/\D/g, "").slice(-9), s = load();
      return resolve(d.length < 9 ? [] : s.apps.filter(function (a) { return String(a.clientPhone).replace(/\D/g, "").slice(-9) === d; }).sort(function (a, b) { return new Date(b.start) - new Date(a.start); }));
    },
    resetDemo: function () { var s = seed(); save(s); return resolve(true); }
  };

  window.GrindStore = demo;
  window.GrindStore.helpers = { computeSlots: computeSlots, ymd: ymd, hm: hm, toMin: toMin, fromMin: fromMin, at: at, STEP: STEP, DEFAULT_HOURS: DEFAULT_HOURS };
  // Реальный режим: если в config.js есть own.supabaseUrl и own.anonKey, подгружаем supabase-js и assets/store-supabase.js,
  // и они заменяют window.GrindStore (тот же интерфейс). document.write нужен, чтобы всё загрузилось до booking.js.
  if (cfg.supabaseUrl && cfg.anonKey && document.currentScript) {
    var base = document.currentScript.src.replace(/store\.js.*$/, "");
    document.write('<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js"><\/script><script src="' + base + 'store-supabase.js"><\/script>');
  }
})();
