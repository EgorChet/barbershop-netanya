// Языки сайта: RU (исходный), EN, HE (справа налево), FR.
// Тексты в вёрстке написаны по-русски; здесь они переводятся по словарю из i18n-dict.js
// (ключ — русский HTML элемента). Новые тексты добавляйте в словарь — остальное подхватится само.
(function () {
  var LANGS = [["ru", "RU"], ["en", "EN"], ["he", "עב"], ["fr", "FR"]];
  var IDX = { en: 0, he: 1, fr: 2 };
  var LOCALE = { ru: "ru-RU", en: "en-GB", he: "he-IL", fr: "fr-FR" };
  var D = window.I18N_DICT || {};
  var INL = { I: 1, EM: 1, B: 1, STRONG: 1, SPAN: 1, BR: 1, SMALL: 1, SUB: 1, SUP: 1, U: 1, MARK: 1, A: 1, S: 1, CODE: 1 };
  var CYR = /[А-Яа-яЁё]/;
  var ATTRS = ["alt", "title", "placeholder", "aria-label"];
  var root = document.documentElement;

  function norm(h) { return h.replace(/\s+/g, " ").trim(); }

  function pick() {
    var m = location.search.match(/[?&]lang=(ru|en|he|fr)\b/);
    if (m) return m[1];
    try { var s = localStorage.getItem("bk-lang"); if (s && IDX[s] !== undefined || s === "ru") return s; } catch (e) {}
    if (window.I18N_DEFAULT) return window.I18N_DEFAULT;
    var n = (navigator.language || "ru").slice(0, 2).toLowerCase();
    if (n === "he" || n === "iw") return "he";
    if (n === "fr") return "fr";
    if (n === "ru" || n === "uk" || n === "be") return "ru";
    return "en";
  }
  var lang = pick();

  function tr(key, l) {
    if (l === "ru") return key;
    var r = D[key];
    if (r && r[IDX[l]]) return r[IDX[l]];
    return key;
  }
  window.T = function (s) { return tr(s, lang); };
  window.I18N = {
    get lang() { return lang; },
    locale: function () { return LOCALE[lang]; },
    setLang: setLang
  };

  // ---- Hebrew fonts + RTL fixes ----
  var rtl = document.createElement("style");
  rtl.textContent =
    "html[lang=he]:not([data-own-font]) body,html[lang=he]:not([data-own-font]) body *{font-family:Heebo,'Arial Hebrew',Arial,sans-serif!important}html[lang=he] body,html[lang=he] body *{letter-spacing:normal!important}" +
    "html[lang=he] .fire,html[lang=he] [class*=ttl],html[lang=he] h1,html[lang=he] h2,html[lang=he] h3{font-weight:800}" +
    "html[dir=rtl] body{text-align:start}" +
    "html[dir=rtl] .vsw,html[dir=rtl] .lg-pill{direction:ltr}" +
    "html[dir=rtl] input[type=tel]{direction:ltr;text-align:right}" +
    ".lg-pill{position:fixed;left:50%;transform:translateX(-50%);bottom:calc(var(--lg-bottom,calc(var(--vsw-bottom,16px) + 54px)) + env(safe-area-inset-bottom,0px));z-index:9998;display:flex;gap:2px;padding:4px;border-radius:999px;" +
    "background:rgba(17,17,17,.88);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);box-shadow:0 8px 24px rgba(0,0,0,.35);font:700 12px/1 -apple-system,'Segoe UI',Roboto,Arial,sans-serif}" +
    ".lg-pill button{all:unset;cursor:pointer;color:#cfcfcf;padding:8px 11px;border-radius:999px;letter-spacing:.04em;min-width:34px;text-align:center;box-sizing:border-box}" +
    ".lg-pill button:hover{color:#fff;background:rgba(255,255,255,.1)}" +
    ".lg-pill button[aria-pressed=true]{background:#fff;color:#111}" +
    "html[lang=he] .lg-pill button{font-family:Heebo,Arial,sans-serif!important}";
  document.head.appendChild(rtl);

  var hf = null;
  function ensureHebrewFont() {
    if (hf) return;
    hf = document.createElement("link");
    hf.rel = "stylesheet";
    hf.href = "https://fonts.googleapis.com/css2?family=Heebo:wght@400;600;800&display=swap";
    document.head.appendChild(hf);
  }

  // ---- translate DOM ----
  var mo = null, timer = 0;
  function walk(el) {
    var tag = el.tagName;
    if (tag === "SCRIPT" || tag === "STYLE" || tag === "NOSCRIPT" || tag === "IFRAME") return false;
    if (el.closest && (el.closest("svg") || el.closest(".lg-pill"))) return false;
    return true;
  }
  function hasOwnText(el) {
    for (var i = 0; i < el.childNodes.length; i++) { var n = el.childNodes[i]; if (n.nodeType === 3 && n.textContent.trim()) return true; }
    return false;
  }
  function textEl(el) {
    var own = false, i, n;
    for (i = 0; i < el.childNodes.length; i++) {
      n = el.childNodes[i];
      if (n.nodeType === 3 && n.textContent.trim()) { own = true; break; }
    }
    if (!own) return false;
    for (i = 0; i < el.children.length; i++) {
      var k = el.children[i];
      if (!INL[k.tagName] || k.hasAttribute("data-cfg")) return false;
    }
    return true;
  }
  function apply() {
    if (mo) mo.disconnect();
    var els = document.body.querySelectorAll("*");
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      if (!walk(el)) continue;
      if (textEl(el)) {
        var cur = norm(el.innerHTML), key;
        if (el._ik !== undefined && cur === el._iv) key = el._ik; else { key = cur; el._ik = undefined; }
        if (el._ik !== undefined || CYR.test(key)) {
          var out = tr(key, lang);
          if (out !== key || el._ik !== undefined) {
            if (norm(el.innerHTML) !== norm(out)) el.innerHTML = out;
            el._ik = key; el._iv = norm(el.innerHTML);
          }
        }
      }
      else if (hasOwnText(el)) {
        for (var c = 0; c < el.childNodes.length; c++) {
          var tn = el.childNodes[c];
          if (tn.nodeType !== 3 || !tn.nodeValue.trim()) continue;
          var tcur = tn.nodeValue, tk = (tn._ik !== undefined && tcur === tn._iv) ? tn._ik : tcur.trim();
          if (tn._ik === undefined && !CYR.test(tk)) continue;
          var tt2 = tr(norm(tk), lang);
          var lead = tcur.match(/^\s*/)[0], trail = tcur.match(/\s*$/)[0];
          tn._ik = norm(tk); tn._iv = lead + tt2 + trail; tn.nodeValue = tn._iv;
        }
      }
      for (var a = 0; a < ATTRS.length; a++) {
        var at = ATTRS[a], v = el.getAttribute(at);
        if (v === null) continue;
        el._ia = el._ia || {};
        var rec = el._ia[at];
        if (rec && v === rec[1]) v = rec[0]; else rec = null;
        if (rec || CYR.test(v)) {
          var t = tr("@" + v, lang);
          if (t === "@" + v) t = v;
          if (t !== v || rec) { el.setAttribute(at, t); el._ia[at] = [v, t]; }
        }
      }
    }
    // title + meta description
    var ti = document.title;
    if (document._it && ti === document._it[1]) ti = document._it[0];
    if (document._it || CYR.test(ti)) {
      var tt = tr("@" + ti, lang); if (tt === "@" + ti) tt = ti;
      document._it = [ti, tt]; document.title = tt;
    }
    var md = document.querySelector("meta[name=description]");
    if (md) {
      var mv = md.getAttribute("content") || "";
      if (md._it && mv === md._it[1]) mv = md._it[0];
      if (md._it || CYR.test(mv)) {
        var mt = tr("@" + mv, lang); if (mt === "@" + mv) mt = mv;
        md._it = [mv, mt]; md.setAttribute("content", mt);
      }
    }
    observe();
  }
  function observe() {
    if (!mo) {
      mo = new MutationObserver(function () {
        clearTimeout(timer);
        timer = setTimeout(apply, 60);
      });
    }
    mo.observe(document.body, { childList: true, subtree: true, characterData: true });
  }

  function setDir() {
    root.setAttribute("lang", lang);
    root.setAttribute("dir", lang === "he" ? "rtl" : "ltr");
    if (lang === "he") ensureHebrewFont();
  }
  function setLang(l) {
    if (!LOCALE[l]) return;
    lang = l;
    try { localStorage.setItem("bk-lang", l); } catch (e) {}
    setDir();
    apply();
    paint();
    document.dispatchEvent(new CustomEvent("i18n:lang", { detail: l }));
  }

  // ---- language pill ----
  var pill;
  function paint() {
    if (!pill) return;
    var bs = pill.querySelectorAll("button");
    for (var i = 0; i < bs.length; i++) bs[i].setAttribute("aria-pressed", bs[i].getAttribute("data-l") === lang ? "true" : "false");
  }
  function build() {
    pill = document.createElement("div");
    pill.className = "lg-pill";
    pill.setAttribute("role", "group");
    pill.setAttribute("aria-label", "Language");
    pill.setAttribute("translate", "no");
    pill.innerHTML = LANGS.map(function (x) { return '<button type="button" data-l="' + x[0] + '" lang="' + x[0] + '">' + x[1] + "</button>"; }).join("");
    pill.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-l]");
      if (b) setLang(b.getAttribute("data-l"));
    });
    document.body.appendChild(pill);
    paint();
  }

  function start() {
    setDir();
    build();
    apply();
    // scripts that inject sections (history, brands, hours, map) run after us
    setTimeout(apply, 300);
    setTimeout(apply, 1200);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
