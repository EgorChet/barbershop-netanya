// Shared booking flow: any link/button with [data-book] (or href="#book") opens it.
// Optional data-master="dima|kirill|b3" preselects a barber.
// Theming per version via CSS variables on :root:
//   --bk-bg, --bk-fg, --bk-mut, --bk-line, --bk-acc, --bk-acc-fg, --bk-radius, --bk-head
(function () {
  var BASE = (document.currentScript && document.currentScript.src.replace(/assets\/booking\.js.*$/, "")) || "../";
  var SERVICES = (window.SITE_CONFIG && window.SITE_CONFIG.services) || [
    { id: "cut", t: "Стрижка", d: "60 мин", p: 120 },
    { id: "fade", t: "Fade / машинка", d: "45 мин", p: 100 },
    { id: "beard", t: "Борода", d: "30 мин", p: 70 },
    { id: "combo", t: "Стрижка + борода", d: "90 мин", p: 170 },
    { id: "shave", t: "Бритьё опасной бритвой", d: "40 мин", p: 90 },
    { id: "women", t: "Женская стрижка", d: "60 мин", p: 150 },
    { id: "kids", t: "Детская стрижка", d: "40 мин", p: 80 }
  ];
  var MASTERS = [
    { id: "any", n: "Любой свободный", r: "ближайшее время", img: null },
    { id: "dima", n: "Дима", r: "основатель · барбер", img: "assets/img/dima2.jpg" },
    { id: "kirill", n: "Кирилл", r: "барбер", img: "assets/img/kirill.jpg" },
    { id: "b3", n: "Таша", r: "основатель · с 2017 года", img: "assets/img/tasha.jpg" }
  ];
  function T(x) { return window.T ? window.T(x) : x; }
  function LOC() { return window.I18N ? window.I18N.locale() : "ru-RU"; }
  var SLOTS = ["10:00", "11:00", "12:00", "13:30", "15:00", "16:00", "17:30", "19:00"];
  var DAYS = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
  // Режим "own": настоящие свободные окна из assets/store.js (мастера, часы работы, уже занятые записи).
  var OWN = !!(window.SITE_CONFIG && window.SITE_CONFIG.booking && window.SITE_CONFIG.booking.provider === "own" && window.GrindStore);
  var OWN_MAP = { b3: "tasha" };
  var hoursBy = {};
  function ownLoad() {
    var G = window.GrindStore;
    return Promise.all([G.listServices(), G.listStaff()]).then(function (r) {
      SERVICES = r[0].map(function (x) { return { id: x.id, t: x.title, d: x.minutes + " мин", p: x.price, min: x.minutes }; });
      MASTERS = [{ id: "any", n: "Любой свободный", r: "ближайшее время", img: null }].concat(r[1].map(function (x) { return { id: x.id, n: x.name, r: x.role.toLowerCase().replace(" · ", " · "), img: x.img }; }));
      return Promise.all(r[1].map(function (m) { return G.getHours(m.id).then(function (h) { hoursBy[m.id] = h; }); }));
    });
  }
  // сразу показываем ближайший день со свободными окнами, а не пустое «сегодня»
  function ownFirstDay() {
    var i = 0;
    (function next() {
      s.day = i;
      if (isOff(dayDate(i)) && i < 13) { i++; return next(); }
      ownRefresh(function () { if (!(s.times && s.times.length) && i < 13) { i++; return next(); } if (!(s.times && s.times.length)) s.day = 0; render(); });
    })();
  }
  function ownStaffIds() { return s.m === "any" ? MASTERS.filter(function (x) { return x.id !== "any"; }).map(function (x) { return x.id; }) : [s.m]; }
  function ownRefresh(cb) {
    var G = window.GrindStore, ds = G.helpers.ymd(dayDate(s.day)), mins = (svc() && svc().min) || 60, ids = ownStaffIds();
    Promise.all(ids.map(function (id) { return G.slots(id, ds, mins); })).then(function (res) {
      s.map = {}; var all = [];
      res.forEach(function (list, i) { list.forEach(function (t) { if (!s.map[t]) { s.map[t] = ids[i]; all.push(t); } }); });
      all.sort(); s.times = all; cb();
    });
  }

  var css =
    ".bk-ov{position:fixed;inset:0;z-index:10000;background:rgba(0,0,0,.6);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);display:flex;align-items:flex-end;justify-content:center;opacity:0;pointer-events:none;transition:opacity .3s}" +
    ".bk-ov.open{opacity:1;pointer-events:auto}" +
    ".bk-sheet{--r:var(--bk-radius,18px);width:min(560px,100%);max-height:92vh;overflow:auto;background:var(--bk-bg,#fff);color:var(--bk-fg,#141414);border-radius:var(--r) var(--r) 0 0;padding:22px 20px 26px;transform:translateY(40px);transition:transform .35s cubic-bezier(.2,.7,.2,1);font-family:inherit}" +
    ".bk-ov.open .bk-sheet{transform:none}" +
    "@media(min-width:640px){.bk-ov{align-items:center}.bk-sheet{border-radius:var(--r);padding:28px}}" +
    ".bk-h{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:6px}" +
    ".bk-h b{font-family:var(--bk-head,inherit);font-size:24px;font-weight:700;line-height:1.1}" +
    ".bk-x{border:0;background:transparent;color:inherit;font-size:26px;line-height:1;cursor:pointer;padding:4px 8px;opacity:.7}" +
    ".bk-steps{display:flex;gap:6px;margin:10px 0 18px}" +
    ".bk-steps i{flex:1;height:3px;border-radius:3px;background:var(--bk-line,#e5e5e5)}" +
    ".bk-steps i.on{background:var(--bk-acc,#ff5a1f)}" +
    ".bk-l{font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:var(--bk-mut,#777);margin:16px 0 10px}" +
    ".bk-o{display:flex;align-items:center;gap:12px;width:100%;text-align:left;border:1px solid var(--bk-line,#e5e5e5);background:transparent;color:inherit;padding:13px 14px;border-radius:calc(var(--r) * .6);margin-bottom:8px;cursor:pointer;font:inherit;font-size:15px;transition:border-color .2s,background .2s}" +
    ".bk-o:hover{border-color:var(--bk-acc,#ff5a1f)}" +
    ".bk-o.sel{border-color:var(--bk-acc,#ff5a1f);background:color-mix(in srgb,var(--bk-acc,#ff5a1f) 12%,transparent)}" +
    ".bk-o .g{flex:1}.bk-o small{display:block;color:var(--bk-mut,#777);font-size:13px;margin-top:2px}" +
    ".bk-o .pr{font-weight:700}" +
    ".bk-o img,.bk-o .av{width:46px;height:46px;border-radius:50%;object-fit:cover;flex:none;background:var(--bk-line,#e5e5e5);display:grid;place-items:center;font-size:20px}" +
    ".bk-days{display:flex;gap:8px;overflow-x:auto;padding-bottom:4px}" +
    ".bk-d{flex:none;width:58px;padding:10px 0;text-align:center;border:1px solid var(--bk-line,#e5e5e5);border-radius:calc(var(--r) * .6);background:transparent;color:inherit;cursor:pointer;font:inherit}" +
    ".bk-d small{display:block;font-size:11px;color:var(--bk-mut,#777)}.bk-d b{font-size:18px}" +
    ".bk-d.sel{border-color:var(--bk-acc,#ff5a1f);background:var(--bk-acc,#ff5a1f);color:var(--bk-acc-fg,#fff)}.bk-d.sel small{color:inherit;opacity:.8}" +
    ".bk-d.off{opacity:.35;pointer-events:none}" +
    ".bk-t{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}" +
    ".bk-t button{padding:11px 0;border:1px solid var(--bk-line,#e5e5e5);border-radius:calc(var(--r) * .6);background:transparent;color:inherit;cursor:pointer;font:inherit;font-size:14px}" +
    ".bk-t button.sel{border-color:var(--bk-acc,#ff5a1f);background:var(--bk-acc,#ff5a1f);color:var(--bk-acc-fg,#fff)}" +
    ".bk-t button:disabled{opacity:.3;text-decoration:line-through;cursor:default}" +
    ".bk-sheet input{width:100%;padding:14px;border:1px solid var(--bk-line,#e5e5e5);border-radius:calc(var(--r) * .6);background:transparent;color:inherit;font:inherit;font-size:16px;margin-bottom:10px}" +
    ".bk-sheet input:focus{outline:2px solid var(--bk-acc,#ff5a1f);outline-offset:1px}" +
    ".bk-sum{border:1px dashed var(--bk-line,#ddd);border-radius:calc(var(--r) * .6);padding:14px;font-size:14px;line-height:1.8;margin-bottom:14px}" +
    ".bk-sum b{float:right}" +
    ".bk-f{display:flex;gap:10px;margin-top:18px}" +
    ".bk-btn{flex:1;padding:15px;border:0;border-radius:calc(var(--r) * .6);background:var(--bk-acc,#ff5a1f);color:var(--bk-acc-fg,#fff);font:inherit;font-weight:700;font-size:16px;cursor:pointer;transition:opacity .2s}" +
    ".bk-btn:disabled{opacity:.35;cursor:default}" +
    ".bk-btn.sec{flex:none;background:transparent;color:inherit;border:1px solid var(--bk-line,#e5e5e5)}" +
    ".bk-ok{text-align:center;padding:20px 0}.bk-ok .ic{font-size:54px}.bk-ok p{color:var(--bk-mut,#777);line-height:1.6;margin-top:8px}" +
    ".bk-demo{font-size:12px;color:var(--bk-mut,#777);text-align:center;margin-top:12px}";
  var st = document.createElement("style");
  st.textContent = css;
  document.head.appendChild(st);

  var ov = document.createElement("div");
  ov.className = "bk-ov";
  ov.innerHTML = '<div class="bk-sheet" role="dialog" aria-modal="true" aria-label="' + T("Онлайн-запись") + '"></div>';
  document.body.appendChild(ov);
  var box = ov.firstChild;
  var s;

  function reset(master) {
    var d = new Date();
    s = { step: 0, svc: null, m: master || null, day: 0, time: null, name: "", phone: "", base: d };
  }
  function dayDate(i) { var d = new Date(s.base); d.setDate(d.getDate() + i); return d; }
  function isOff(d) { if (OWN && s.m) return ownStaffIds().every(function (id) { return !(hoursBy[id] && hoursBy[id][d.getDay()]); }); return d.getDay() === 6; } // Saturday closed
  function busy(i, t) { var h = (i * 7 + t.charCodeAt(1) * 3 + (s.m ? s.m.length : 1)) % 5; return h === 0; }
  function svc() { return SERVICES.filter(function (x) { return x.id === s.svc; })[0]; }
  function mst() { return MASTERS.filter(function (x) { return x.id === s.m; })[0]; }

  function head(title) {
    var bars = "";
    for (var i = 0; i < 4; i++) bars += "<i" + (i <= s.step ? ' class="on"' : "") + "></i>";
    return '<div class="bk-h"><b>' + title + '</b><button class="bk-x" data-x aria-label="' + T("Закрыть") + '">×</button></div><div class="bk-steps">' + bars + "</div>";
  }
  function foot(canNext, label) {
    return '<div class="bk-f">' + (s.step > 0 ? '<button class="bk-btn sec" data-back>←</button>' : "") +
      '<button class="bk-btn" data-next ' + (canNext ? "" : "disabled") + ">" + (label || T("Дальше")) + "</button></div>";
  }
  function render() {
    var h = "";
    if (s.step === 0) {
      h = head(T("Выберите услугу"));
      SERVICES.forEach(function (x) {
        h += '<button class="bk-o' + (s.svc === x.id ? " sel" : "") + '" data-svc="' + x.id + '"><span class="g">' + T(x.t) + "<small>" + T(x.d) + '</small></span><span class="pr">₪' + x.p + "</span></button>";
      });
      h += foot(!!s.svc);
    } else if (s.step === 1) {
      h = head(T("Выберите мастера"));
      MASTERS.forEach(function (x) {
        h += '<button class="bk-o' + (s.m === x.id ? " sel" : "") + '" data-m="' + x.id + '">' +
          (x.img ? '<img src="' + BASE + x.img + '" alt="">' : '<span class="av">✂</span>') +
          '<span class="g">' + T(x.n) + "<small>" + T(x.r) + "</small></span></button>";
      });
      h += foot(!!s.m);
    } else if (s.step === 2) {
      h = head(T("Дата и время"));
      h += '<div class="bk-l">' + T("День") + '</div><div class="bk-days">';
      for (var i = 0; i < 14; i++) {
        var d = dayDate(i);
        h += '<button class="bk-d' + (i === s.day ? " sel" : "") + (isOff(d) ? " off" : "") + '" data-day="' + i + '"><small>' + (i === 0 ? T("Сегодня") : T(DAYS[d.getDay()])) + "</small><b>" + d.getDate() + "</b></button>";
      }
      h += '</div><div class="bk-l">' + T("Время") + '</div><div class="bk-t">';
      var day = dayDate(s.day);
      var slots = OWN ? (s.times || []) : (day.getDay() === 5 ? SLOTS.slice(0, 4) : SLOTS);
      if (OWN && !slots.length) h += '<p style="grid-column:1/-1;text-align:center;color:var(--bk-mut,#777);padding:18px 8px;line-height:1.5">' + T("На этот день нет свободных окон. Попробуйте другой день.") + "</p>";
      slots.forEach(function (t) {
        var dis = OWN ? false : busy(s.day, t);
        h += "<button " + (dis ? "disabled" : "") + (s.time === t ? ' class="sel"' : "") + ' data-t="' + t + '">' + t + "</button>";
      });
      h += "</div>" + foot(!!s.time);
    } else if (s.step === 3) {
      h = head(T("Ваши контакты"));
      var d2 = dayDate(s.day);
      h += '<div class="bk-sum">' + T(svc().t) + "<b>₪" + svc().p + "</b><br>" + T("Мастер") + "<b>" + T(mst().n) + "</b><br>" + T("Когда") + "<b>" +
        d2.toLocaleDateString(LOC(), { day: "numeric", month: "long" }) + ", " + s.time + "</b></div>";
      h += '<input data-in="name" placeholder="' + T("Имя") + '" autocomplete="name" value="' + s.name.replace(/"/g, "&quot;") + '">';
      h += '<input data-in="phone" placeholder="' + T("Телефон (+972…)") + '" type="tel" autocomplete="tel" value="' + s.phone.replace(/"/g, "&quot;") + '">';
      h += foot(s.name.trim().length > 1 && s.phone.replace(/\D/g, "").length >= 9, T("Записаться"));
    } else {
      h = '<div class="bk-h"><b></b><button class="bk-x" data-x aria-label="' + T("Закрыть") + '">×</button></div>' +
        '<div class="bk-ok"><div class="ic">✓</div><b style="font-size:24px;font-family:var(--bk-head,inherit)">' + T("Вы записаны!") + '</b>' +
        "<p>" + T("{n} ждёт вас {d} в {t}.").replace("{n}", T(mst().n)).replace("{d}", dayDate(s.day).toLocaleDateString(LOC(), { day: "numeric", month: "long" })).replace("{t}", s.time) +
        (OWN ? "" : "<br>" + T("Напомним в WhatsApp за 2 часа до визита.")) + "</p></div>" +
        '<div class="bk-f"><button class="bk-btn" data-x>' + T("Готово") + '</button></div>';
    }
    if (!OWN || window.GrindStore.mode === "demo") h += '<div class="bk-demo">' + T("Демо записи — на реальном сайте подключим онлайн-запись") + '</div>';
    box.innerHTML = h;
  }

  box.addEventListener("click", function (e) {
    var b = e.target.closest("button");
    if (!b) return;
    if (b.hasAttribute("data-x")) return close();
    if (b.hasAttribute("data-back")) { s.step--; return render(); }
    if (b.hasAttribute("data-next")) {
      if (s.step === 1 && s.m === null) return;
      if (OWN && s.step === 1) { s.step = 2; return ownFirstDay(); }
      if (OWN && s.step === 3) {
        var G = window.GrindStore, sid = s.map && s.map[s.time], ds = G.helpers.ymd(dayDate(s.day));
        b.disabled = true;
        return G.slots(sid, ds, svc().min || 60).then(function (free) {
          if (free.indexOf(s.time) < 0) { s.time = null; s.step = 2; return ownRefresh(function () { render(); }); }
          return G.createAppointment({ staffId: sid, serviceId: s.svc, date: ds, time: s.time, clientName: s.name.trim(), clientPhone: s.phone.trim(), source: "site" }).then(function () {
            s.m = sid; s.step = 4; render();
          });
        });
      }
      s.step++;
      return render();
    }
    if (b.dataset.svc) { s.svc = b.dataset.svc; s.time = null; render(); }
    if (b.dataset.m) { s.m = b.dataset.m; s.time = null; render(); }
    if (b.dataset.day) { s.day = +b.dataset.day; s.time = null; if (OWN) return ownRefresh(render); render(); }
    if (b.dataset.t) { s.time = b.dataset.t; render(); }
  });
  box.addEventListener("input", function (e) {
    var k = e.target.dataset.in;
    if (!k) return;
    s[k] = e.target.value;
    var nb = box.querySelector("[data-next]");
    if (nb) nb.disabled = !(s.name.trim().length > 1 && s.phone.replace(/\D/g, "").length >= 9);
  });
  ov.addEventListener("click", function (e) { if (e.target === ov) close(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && ov.classList.contains("open")) close(); });

  function open(master) {
    reset(master);
    if (OWN) {
      if (master && OWN_MAP[master]) master = OWN_MAP[master];
      return ownLoad().then(function () {
        reset(master && MASTERS.some(function (x) { return x.id === master; }) ? master : null);
        render(); ov.classList.add("open"); document.documentElement.style.overflow = "hidden";
      });
    }
    if (master) s.step = 0;
    render();
    ov.classList.add("open");
    document.documentElement.style.overflow = "hidden";
  }
  function close() {
    ov.classList.remove("open");
    document.documentElement.style.overflow = "";
  }
  // ---- Provider integration (assets/config.js) ----------------------------
  var CFG = (window.SITE_CONFIG && window.SITE_CONFIG.booking) || { provider: "demo" };
  var P = CFG.provider || "demo";
  var hosts = { altegio: "alteg.io", yclients: "yclients.com" };
  var widgetOn = !!(hosts[P] && CFG.widgetId);

  function providerUrl(master) {
    var base = "https://b" + CFG.widgetId + "." + hosts[P];
    var sid = master && CFG.staff && CFG.staff[master];
    if (CFG.companyId && sid) return base + "/company/" + CFG.companyId + "/personal/select-master?o=m" + sid;
    if (CFG.companyId) return base + "/company/" + CFG.companyId + "/personal/menu";
    return base;
  }

  if (widgetOn) {
    window.yWidgetSettings = {
      buttonAutoShow: !!CFG.showFloatingButton,
      buttonColor: CFG.buttonColor || "#111111",
      buttonPosition: "bottom right"
    };
    var tag = function () {
      document.querySelectorAll("[data-book]").forEach(function (el) {
        el.classList.add("ms_booking");
        el.setAttribute("data-url", providerUrl(el.getAttribute("data-master")));
      });
    };
    tag();
    var w = document.createElement("script");
    w.src = "https://w" + CFG.widgetId + "." + hosts[P] + "/widgetJS";
    w.charset = "UTF-8";
    w.async = true;
    document.body.appendChild(w);
  }

  document.addEventListener("click", function (e) {
    var a = e.target.closest("[data-book]");
    if (!a) return;
    if (widgetOn) return; // the Altegio/YCLIENTS widget handles .ms_booking clicks
    e.preventDefault();
    if (P === "link" && CFG.link) { window.open(CFG.link, "_blank", "noopener"); return; }
    open(a.getAttribute("data-master"));
  });
  window.openBooking = function (m) {
    if (widgetOn) { window.open(providerUrl(m), "_blank", "noopener"); return; }
    if (P === "link" && CFG.link) { window.open(CFG.link, "_blank", "noopener"); return; }
    open(m);
  };
  document.addEventListener("i18n:lang", function () { if (ov && ov.classList.contains("open")) render(); });
})();
