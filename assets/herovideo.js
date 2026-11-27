// Живое видео в главном экране полноэкранных версий (1, 2, 6, 7): ролик Димы поверх фона версии.
// Цвет подложки берётся из --bk-bg, так что читаемость текста сохраняется и на светлой, и на тёмной теме.
(function () {
  if (!/\/v[1267]-/.test(location.pathname)) return;
  var hero = document.querySelector("section.hero");
  if (!hero || hero.querySelector(".hv")) return;
  var base = "../";
  var css =
    ".hv{position:absolute;inset:0;z-index:0;overflow:hidden;pointer-events:none}" +
    ".hv video{width:100%;height:100%;object-fit:cover;filter:grayscale(1) contrast(1.2);opacity:var(--hv-o,.55)}" +
    ".hv:after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,var(--bk-bg,#000) -10%,transparent 35%,transparent 55%,var(--bk-bg,#000) 105%)}" +
    "@media(prefers-reduced-motion:reduce){.hv video{display:none}}";
  var st = document.createElement("style");
  st.textContent = css;
  document.head.appendChild(st);

  var wrap = document.createElement("div");
  wrap.className = "hv";
  wrap.setAttribute("aria-hidden", "true");
  var cn = navigator.connection, slow = cn && (cn.saveData || /(^|-)2g$/.test(cn.effectiveType || ""));
  wrap.innerHTML = slow ? "" : '<video autoplay muted loop playsinline preload="auto" poster="' + base + 'media/posters/dima-1.jpg"><source src="' + base + 'media/hero-dima.mp4" type="video/mp4"></video>';
  // Post-punk: в кадре лицо, а горы (ridgeline) и текст стоят внизу, поэтому видео сдвигаем вверх, чтобы лицо оставалось чистым
  if (/\/v7-/.test(location.pathname)) {
    var vv = wrap.querySelector("video");
    if (vv) { vv.style.objectPosition = "50% 12%"; vv.style.transform = "translateY(-20%) scale(1.1)"; vv.style.transformOrigin = "50% 0"; }
    wrap.style.setProperty("--hv-o", ".8");
  }
  var pos = getComputedStyle(hero).position;
  if (pos === "static") hero.style.position = "relative";
  hero.insertBefore(wrap, hero.firstChild);
  // контент героя — над видео
  for (var i = 0; i < hero.children.length; i++) {
    var c = hero.children[i];
    if (c === wrap) continue;
    var cs = getComputedStyle(c);
    if (cs.position === "static") c.style.position = "relative";
    if (cs.zIndex === "auto") c.style.zIndex = "1";
  }
  // статичный портрет заменяется видео
  var old = hero.querySelector(":scope > img, :scope > .who");
  if (old) old.style.display = "none";
  // светлая тема: видео должно быть тише
  var bg = getComputedStyle(document.documentElement).getPropertyValue("--bk-bg").trim().toLowerCase();
  if (/^#(f|e)/.test(bg)) hero.style.setProperty("--hv-o", ".28");
})();
