// GRIND — единый фирменный стиль: логотип (знак + слово), анимированный лоадер.
// Подключается в <head> (лоадер должен появиться до отрисовки страницы). Цвета берутся из
// CSS-переменных версии (--bk-bg, --bk-fg, --bk-acc), поэтому в каждой версии выглядит «своим».
(function () {
  var NS = "http://www.w3.org/2000/svg";
  // Буквы нарисованы линиями, а не шрифтом: логотип одинаков везде, на любом устройстве.
  var G = "M36 4H4V44H36V24H20";
  var R = "M4 44V4H24Q36 4 36 14Q36 24 24 24H4M22 24L36 44";
  var I = "M4 4V44";
  var N = "M4 44V4L36 44V4";
  var D = "M4 4H20Q36 4 36 24Q36 44 20 44H4Z";

  function wordmark(cls) {
    var s = 'stroke="currentColor" stroke-width="8" fill="none" stroke-linejoin="miter" stroke-linecap="butt"';
    return '<svg class="' + (cls || "bl-word") + '" viewBox="0 0 236 48" role="img" aria-label="GRIND" focusable="false" xmlns="' + NS + '">' +
      '<g ' + s + '><path d="' + G + '"/><path transform="translate(52 0)" d="' + R + '"/><path transform="translate(104 0)" d="' + I + '"/>' +
      '<path transform="translate(124 0)" d="' + N + '"/><path transform="translate(176 0)" d="' + D + '"/></g>' +
      '<rect x="224" y="36" width="12" height="12" fill="var(--bk-acc,currentColor)"/></svg>';
  }
  // Знак: квадратная «G» внутри рамки, разрезанной бритвой по диагонали.
  function mark(cls) {
    return '<svg class="' + (cls || "bl-mark") + '" viewBox="0 0 48 48" role="img" aria-label="GRIND" focusable="false" xmlns="' + NS + '">' +
      '<path class="bl-frame" d="M2 9Q2 2 9 2H27L46 21V39Q46 46 39 46H9Q2 46 2 39Z" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>' +
      '<path class="bl-g" d="M34 15H15V35H34V25H25" fill="none" stroke="currentColor" stroke-width="5" stroke-linejoin="miter"/>' +
      '<path class="bl-cut" d="M33 1L47 15" stroke="var(--bk-acc,currentColor)" stroke-width="3.5" stroke-linecap="square" fill="none"/></svg>';
  }
  function lockup() {
    return '<span class="bl" translate="no">' + mark("bl-mark") + wordmark("bl-word") + "</span>";
  }
  // Своя марка: страница может задать window.BRAND_CUSTOM = { name, tag, mark(cls), word(cls) } до подключения этого файла.
  var CU = window.BRAND_CUSTOM;
  if (CU) { mark = CU.mark; wordmark = CU.word; }
  window.GRIND_BRAND = { mark: mark, wordmark: wordmark, lockup: lockup };

  var css =
    ".bl{display:inline-flex;align-items:center;gap:.55em;line-height:0;direction:ltr;vertical-align:middle;font-size:inherit;text-transform:none;letter-spacing:0;font-style:normal}" +
    ".bl svg{display:block;height:auto;overflow:visible}" +
    ".bl-mark{width:1.5em}.bl-word{width:4.6em}" +
    "a.logo .bl-word{height:.95em;width:auto}a.logo .bl-mark{height:1.5em;width:auto}" +
    "@media(max-width:420px){a.logo .bl-mark{height:1.35em}a.logo .bl-word{height:.85em}}" +
    "a.logo small{display:none}" +
    /* loader */
    "#bl-load{position:fixed;inset:0;z-index:2147483000;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:22px;" +
    "background:var(--bk-bg,#0d0d0d);color:var(--bk-fg,#fff);transition:opacity .5s ease,visibility .5s;direction:ltr}" +
    "#bl-load.out{opacity:0;visibility:hidden}" +
    "#bl-load .bl-bigmark{width:86px;height:86px;overflow:visible}" +
    "#bl-load .bl-frame{stroke-dasharray:170;stroke-dashoffset:170;animation:bl-draw .7s .05s cubic-bezier(.6,0,.2,1) forwards}" +
    "#bl-load .bl-g{stroke-dasharray:70;stroke-dashoffset:70;animation:bl-draw .5s .45s cubic-bezier(.6,0,.2,1) forwards}" +
    "#bl-load .bl-cut{stroke-dasharray:24;stroke-dashoffset:24;animation:bl-draw .35s .85s cubic-bezier(.7,0,.2,1) forwards}" +
    "#bl-load .bl-word{width:min(220px,58vw);height:auto;clip-path:inset(0 100% 0 0);animation:bl-wipe .6s 1s cubic-bezier(.7,0,.2,1) forwards}" +
    "#bl-load .bl-tag{font:600 11px/1 'JetBrains Mono',ui-monospace,Menlo,monospace;letter-spacing:.32em;text-transform:uppercase;color:var(--bk-mut,#999);opacity:0;animation:bl-fade .5s 1.35s forwards}" +
    "#bl-load .bl-draw{stroke-dasharray:100;stroke-dashoffset:100;animation:bl-draw .9s .15s cubic-bezier(.6,0,.2,1) forwards}" +
    "#bl-load .bl-draw2{stroke-dasharray:100;stroke-dashoffset:100;animation:bl-draw .5s .85s cubic-bezier(.7,0,.2,1) forwards}" +
    "@keyframes bl-draw{to{stroke-dashoffset:0}}" +
    "@keyframes bl-wipe{to{clip-path:inset(0 0 0 0)}}" +
    "@keyframes bl-fade{to{opacity:1}}" +
    "@media(prefers-reduced-motion:reduce){#bl-load *{animation:none!important;stroke-dashoffset:0!important;clip-path:none!important;opacity:1!important}}" +
    /* маленький спиннер для кнопок и форм */
    ".bl-spin{display:inline-block;width:1.1em;height:1.1em;border-radius:50%;border:2px solid currentColor;border-right-color:transparent;animation:bl-rot .7s linear infinite;vertical-align:-.2em}" +
    "@keyframes bl-rot{to{transform:rotate(360deg)}}";
  var st = document.createElement("style");
  st.id = "bl-style";
  st.textContent = css;
  (document.head || document.documentElement).appendChild(st);

  // ---- лоадер: один раз за сессию ----
  var seen = false;
  try { seen = sessionStorage.getItem("bl-seen") === "1"; } catch (e) {}
  if (/[?&]loader=1\b/.test(location.search)) seen = false;
  var el = null;
  if (!seen && !/[?&]loader=0\b/.test(location.search)) {
    el = document.createElement("div");
    el.id = "bl-load";
    el.setAttribute("aria-hidden", "true");
    el.innerHTML = mark("bl-bigmark") + wordmark("bl-word") + '<div class="bl-tag">' + ((CU && CU.tag) || "Barbershop · Netanya") + '</div>';
    document.documentElement.appendChild(el);
    try { sessionStorage.setItem("bl-seen", "1"); } catch (e) {}
    var t0 = Date.now();
    var reduced = window.matchMedia && matchMedia("(prefers-reduced-motion:reduce)").matches;
    var minMs = reduced ? 250 : 1900;
    var hide = function () {
      var wait = Math.max(0, minMs - (Date.now() - t0));
      setTimeout(function () {
        el.classList.add("out");
        setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 700);
      }, wait);
    };
    if (document.readyState === "complete") hide(); else window.addEventListener("load", hide);
    setTimeout(hide, 4500); // страховка, если что-то не загрузилось
  }

  // ---- единый логотип в шапке каждой версии ----
  function place() {
    var links = document.querySelectorAll("a.logo");
    for (var i = 0; i < links.length; i++) {
      if (links[i].querySelector(".bl")) continue;
      links[i].setAttribute("aria-label", (CU && CU.name) || "GRIND Barbershop");
      links[i].innerHTML = lockup();
    }
  }
  function grain() {
    if (/v8-/.test(location.pathname) || document.getElementById("bl-grain")) return;
    var g = document.createElement("div");
    g.id = "bl-grain";
    g.setAttribute("aria-hidden", "true");
    g.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:45;opacity:.12;mix-blend-mode:overlay;background-image:url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .9 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")";
    document.body.appendChild(g);
  }
  function init() { place(); grain(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
