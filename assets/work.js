// «Наши работы»: сетка видео барберов для всех версий (как в v8).
// Видео грузятся и играют только когда видны на экране; нажатие включает звук.
// Файлы лежат в media/, постеры в media/posters/.
(function () {
  var host = document.getElementById("guide") || document.getElementById("visit") || document.querySelector("footer");
  if (!host || document.getElementById("work") || /v8-/.test(location.pathname)) return;
  var base = /\/v\d-[^\/]*\/?/.test(location.pathname) ? "../" : "";
  var T = {
    ru: { k: "Видео без фильтров", t: "Наши <em>работы</em>", lead: "Ролики самих барберов: Димы и Кирилла. Нажмите на видео, чтобы включить звук.", note: "Видео принадлежат барберам и опубликованы с их согласия.", tags: { cut: "стрижка", long: "длинные", beard: "борода", care: "косметика" } },
    en: { k: "Unfiltered videos", t: "Our <em>work</em>", lead: "Clips by the barbers themselves: Dima and Kirill. Tap a video to turn on sound.", note: "The videos belong to the barbers and are published with their consent.", tags: { cut: "haircut", long: "long", beard: "beard", care: "products" } },
    he: { k: "סרטונים בלי פילטרים", t: "ה<em>עבודות</em> שלנו", lead: "סרטונים של הספרים עצמם: דימה וקיריל. הקישו על סרטון כדי להפעיל קול.", note: "הסרטונים שייכים לספרים ומפורסמים בהסכמתם.", tags: { cut: "תספורת", long: "ארוך", beard: "זקן", care: "קוסמטיקה" } },
    fr: { k: "Vidéos sans filtre", t: "Nos <em>réalisations</em>", lead: "Des vidéos des barbiers eux-mêmes : Dima et Kirill. Touchez une vidéo pour activer le son.", note: "Les vidéos appartiennent aux barbiers et sont publiées avec leur accord.", tags: { cut: "coupe", long: "longs", beard: "barbe", care: "produits" } }
  };
  var V = [
    { n: "dima-2", ar: "9/16", who: "@combpunk" },
    { n: "kirill-3", ar: "1", who: "@kirill.barber.il", tag: "cut" },
    { n: "kirill-7", ar: "9/16", who: "@kirill.barber.il" },
    { n: "kirill-4", ar: "1", who: "@kirill.barber.il", tag: "long" },
    { n: "dima-1", ar: "9/16", who: "@combpunk" },
    { n: "kirill-5", ar: "1", who: "@kirill.barber.il", tag: "beard" },
    { n: "kirill-6", ar: "1", who: "@kirill.barber.il" },
    { n: "kirill-2", ar: "1", who: "@kirill.barber.il", tag: "care" }
  ];

  var css =
    ".wk-s{background:var(--bk-bg,#111);color:var(--bk-fg,#fff);padding:clamp(54px,7vw,96px) clamp(16px,4vw,40px);font-family:inherit;border-top:1px solid var(--bk-line,#333)}" +
    ".wk-in{max-width:1200px;margin:0 auto}" +
    ".wk-k{font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:var(--bk-mut,#999)}" +
    ".wk-s h2{font-family:var(--bk-head,inherit);font-weight:700;font-size:clamp(28px,4.4vw,52px);line-height:1.05;margin:12px 0 0;text-transform:none}" +
    ".wk-s h2 em{font-style:normal;color:var(--bk-acc,#ff5a1f)}" +
    ".wk-lead{max-width:620px;margin-top:14px;line-height:1.6;color:var(--bk-mut,#aaa)}" +
    ".wk-g{columns:2;column-gap:10px;margin-top:28px;direction:ltr}" +
    "@media(min-width:760px){.wk-g{columns:4;column-gap:14px}}" +
    ".wk-v{position:relative;margin:0 0 10px;break-inside:avoid;background:#161616;overflow:hidden;border:1px solid var(--bk-line,#333);border-radius:var(--bk-radius,6px);cursor:pointer}" +
    "@media(min-width:760px){.wk-v{margin-bottom:14px}}" +
    ".wk-v video{display:block;width:100%;height:auto;aspect-ratio:var(--ar,9/16);object-fit:cover;filter:grayscale(1) contrast(1.15);transition:filter .4s}" +
    ".wk-v.on video{filter:none}" +
    ".wk-v .who{position:absolute;left:0;bottom:0;background:rgba(0,0,0,.78);color:#fff;font:500 10px ui-monospace,Menlo,monospace;letter-spacing:.08em;text-transform:uppercase;padding:6px 8px}" +
    ".wk-v .tp{position:absolute;right:6px;top:6px;font:600 10px ui-monospace,Menlo,monospace;background:var(--bk-acc,#fff);color:var(--bk-acc-fg,#000);padding:3px 6px;text-transform:uppercase;letter-spacing:.06em}" +
    ".wk-note{margin-top:14px;font-size:12px;color:var(--bk-mut,#999)}";
  var st = document.createElement("style");
  st.textContent = css;
  document.head.appendChild(st);

  var sec = document.createElement("section");
  sec.className = "wk-s";
  sec.id = "work";
  host.parentNode.insertBefore(sec, host);

  var io = "IntersectionObserver" in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      var v = e.target;
      if (e.isIntersecting) {
        if (!v.getAttribute("src") && v.getAttribute("data-src")) v.src = v.getAttribute("data-src");
        var p = v.play(); if (p && p.catch) p.catch(function () {});
      } else v.pause();
    });
  }, { threshold: .35 }) : null;

  // постеры подгружаем только когда блок близко к экрану
  var pio = "IntersectionObserver" in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { var v = e.target; if (v.getAttribute("data-poster")) { v.poster = v.getAttribute("data-poster"); v.removeAttribute("data-poster"); } pio.unobserve(v); } });
  }, { rootMargin: "500px 0px" }) : null;

  function render() {
    var lg = (window.I18N && window.I18N.lang) || "ru", L = T[lg] || T.ru;
    sec.innerHTML = '<div class="wk-in"><span class="wk-k">' + L.k + "</span><h2>" + L.t + '</h2><p class="wk-lead">' + L.lead + '</p><div class="wk-g">' +
      V.map(function (x, i) {
        return '<div class="wk-v" style="--ar:' + x.ar + ';transform:rotate(' + ((i % 3) - 1) * .5 + 'deg)"><video muted loop playsinline preload="none" data-poster="' + base + "media/posters/" + x.n + '.jpg" data-src="' + base + "media/" + x.n + '.mp4"></video><span class="who">' + x.who + "</span>" +
          (x.tag ? '<span class="tp">' + L.tags[x.tag] + "</span>" : "") + "</div>";
      }).join("") + '</div><p class="wk-note">' + L.note + "</p></div>";
    sec.setAttribute("lang", lg);
    var vs = sec.querySelectorAll("video");
    for (var i = 0; i < vs.length; i++) (function (v) {
      if (io) io.observe(v);
      if (pio) pio.observe(v); else if (v.getAttribute("data-poster")) v.poster = v.getAttribute("data-poster");
      v.parentNode.addEventListener("click", function () { v.muted = !v.muted; v.parentNode.classList.toggle("on", !v.muted); });
    })(vs[i]);
  }
  render();
  document.addEventListener("i18n:lang", render);
  setTimeout(render, 400);
})();
