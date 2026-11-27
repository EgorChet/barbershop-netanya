// "История" section shared by all versions: career story + certificates.
// Themed through the same CSS variables the booking dialog uses (--bk-*).
// Real certificates: put the scans in assets/certs/ and list them in assets/config.js
//   certificates: [{ title: "Сертификат барбера", who: "Дима", src: "assets/certs/dima-1.jpg" }, ...]
// Without `src` an item is drawn as a clearly marked "макет" placeholder.
(function () {
  var host = document.getElementById("ritual");
  if (!host || document.getElementById("story")) return;
  var BASE = (document.currentScript && document.currentScript.src.replace(/assets\/story\.js.*$/, "")) || "../";
  var C = (window.SITE_CONFIG && window.SITE_CONFIG.certificates) || null;
  var certs = (C && C.length) ? C : [
    { title: "Сертификат барбера", who: "Дима" },
    { title: "Диплом курса", who: "Барбер №3" },
    { title: "Повышение квалификации", who: "Команда" }
  ];

  var css =
    ".st-s{background:var(--bk-bg,#111);color:var(--bk-fg,#fff);padding:clamp(60px,8vw,110px) clamp(16px,4vw,40px);font-family:inherit}" +
    ".st-in{max-width:1200px;margin:0 auto}" +
    ".st-k{font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:var(--bk-mut,#999)}" +
    ".st-s h2{font-family:var(--bk-head,inherit);font-weight:700;font-size:clamp(32px,5.4vw,66px);line-height:1.02;letter-spacing:-.01em;margin:12px 0 0;max-width:900px;text-transform:none}" +
    ".st-s h2 em{font-style:normal;color:var(--bk-acc,#ff5a1f)}" +
    ".st-lead{max-width:640px;margin-top:18px;line-height:1.65;color:var(--bk-mut,#aaa);font-size:17px}" +
    ".st-chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:22px}" +
    ".st-chips span{border:1px solid var(--bk-line,#333);border-radius:calc(var(--bk-radius,10px) * 3);padding:9px 16px;font-size:14px;font-weight:600;letter-spacing:.06em;text-transform:uppercase}" +
    ".st-chips span.a{background:var(--bk-acc,#ff5a1f);color:var(--bk-acc-fg,#fff);border-color:var(--bk-acc,#ff5a1f)}" +
    ".st-tl{list-style:none;margin:40px 0 0;border-top:1px solid var(--bk-line,#333);display:grid}" +
    ".st-tl li{display:grid;grid-template-columns:110px 1fr;gap:4px 16px;padding:16px 0;border-bottom:1px solid var(--bk-line,#333)}" +
    ".st-tl .w{font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--bk-acc,#ff5a1f);padding-top:3px}" +
    ".st-tl b{font-family:var(--bk-head,inherit);font-size:20px;font-weight:700;display:block}" +
    ".st-tl span.d{color:var(--bk-mut,#aaa);font-size:15px;line-height:1.5}" +
    ".st-p{display:grid;gap:14px;margin-top:40px}" +
    ".st-c{display:grid;grid-template-columns:110px 1fr;gap:16px;align-items:start;border:1px solid var(--bk-line,#333);border-radius:var(--bk-radius,10px);padding:16px}" +
    ".st-c img{width:110px;aspect-ratio:3/4;object-fit:cover;border-radius:calc(var(--bk-radius,10px) * .6);filter:grayscale(1)}" +
    ".st-c h3{font-family:var(--bk-head,inherit);font-size:24px;font-weight:700;margin:0 0 4px}" +
    ".st-c .r{font-size:13px;color:var(--bk-mut,#aaa);margin-bottom:10px}" +
    ".st-c ul{list-style:none;font-size:15px;line-height:1.5}" +
    ".st-c li{padding:5px 0 5px 18px;position:relative}" +
    ".st-c li:before{content:'';position:absolute;left:0;top:13px;width:8px;height:8px;border-radius:50%;background:var(--bk-acc,#ff5a1f)}" +
    ".st-ch{display:flex;justify-content:space-between;align-items:baseline;gap:12px;margin:50px 0 16px;flex-wrap:wrap}" +
    ".st-ch h3{font-family:var(--bk-head,inherit);font-size:clamp(24px,3.4vw,36px);font-weight:700}" +
    ".st-ch small{color:var(--bk-mut,#aaa);font-size:13px}" +
    ".st-g{display:grid;gap:14px}" +
    ".st-cert{position:relative;aspect-ratio:4/3;border-radius:calc(var(--bk-radius,10px) * .5);overflow:hidden;background:#f5efe0;color:#3a3326;box-shadow:0 14px 30px -14px rgba(0,0,0,.6)}" +
    ".st-cert img{width:100%;height:100%;object-fit:cover}" +
    ".st-cert .fr{position:absolute;inset:9px;border:2px double #b79a55;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;padding:14px;text-align:center}" +
    ".st-cert .t{font-family:Georgia,'Times New Roman',serif;font-size:clamp(15px,2.4vw,22px);letter-spacing:.14em;text-transform:uppercase;font-weight:700}" +
    ".st-cert .n{font-family:Georgia,serif;font-style:italic;font-size:15px}" +
    ".st-cert .ln{width:70%;height:6px;border-radius:3px;background:#d9cfb4}.st-cert .ln.s{width:46%}" +
    ".st-cert .seal{width:44px;height:44px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#e6c874,#a98a3d);display:grid;place-items:center;color:#fff;font-size:20px;box-shadow:0 2px 6px rgba(0,0,0,.3)}" +
    ".st-cert .mk{position:absolute;top:16px;right:-34px;transform:rotate(35deg);background:#c0392b;color:#fff;font:700 11px/1 Arial,sans-serif;letter-spacing:.14em;text-transform:uppercase;padding:6px 40px}" +
    ".st-cap{padding:10px 2px 0;font-size:13px;color:var(--bk-mut,#aaa)}.st-cap b{color:var(--bk-fg,#fff);font-weight:600}" +
    ".st-note{margin-top:18px;font-size:13px;color:var(--bk-mut,#aaa);border:1px dashed var(--bk-line,#333);border-radius:var(--bk-radius,10px);padding:12px 14px;line-height:1.5}" +
    ".st-r{opacity:0;transform:translateY(16px);transition:opacity .8s,transform .8s}.st-r.in{opacity:1;transform:none}" +
    "@media(min-width:760px){.st-g{grid-template-columns:repeat(3,1fr)}.st-p{grid-template-columns:1fr 1fr}.st-tl{grid-template-columns:repeat(2,1fr);column-gap:50px}.st-c{grid-template-columns:150px 1fr}.st-c img{width:150px}}" +
    "@media(max-width:420px){.st-tl li{grid-template-columns:1fr}}" +
    "@media(prefers-reduced-motion:reduce){.st-r{opacity:1;transform:none;transition:none}}";
  var st = document.createElement("style");
  st.textContent = css;
  document.head.appendChild(st);

  function certHtml(c) {
    var body = c.src
      ? '<img src="' + (/^https?:/.test(c.src) ? c.src : BASE + c.src) + '" alt="' + (c.title || "Сертификат") + '" loading="lazy">'
      : '<div class="fr"><div class="seal">★</div><div class="t">' + c.title + '</div><div class="ln"></div><div class="n">' + (c.who || "") + '</div><div class="ln s"></div></div><div class="mk">макет</div>';
    return '<figure class="st-r"><div class="st-cert">' + body + '</div><figcaption class="st-cap"><b>' + (c.title || "") + "</b>" + (c.who ? " · " + c.who : "") + "</figcaption></figure>";
  }

  var sec = document.createElement("section");
  sec.className = "st-s";
  sec.id = "story";
  sec.innerHTML =
    '<div class="st-in">' +
    '<span class="st-k">История</span>' +
    "<h2>Школа Москвы — <em>теперь в Нетании</em></h2>" +
    '<p class="st-lead">Дима и его жена — барберы с большим опытом. Много лет они работали в лучших барбершопах Москвы: стригли в сетях, у которых учился весь русскоязычный рынок. Теперь привозят эту школу и этот стандарт в Нетанию.</p>' +
    '<div class="st-chips"><span class="a">Москва</span><span>Chop-Chop</span><span>TOPGUN</span><span>Нетания</span></div>' +
    '<ul class="st-tl st-r">' +
    '<li><span class="w">Москва</span><div><b>Chop-Chop</b><span class="d">Первая сеть барбершопов России. Дима работал в ней мастером.</span></div></li>' +
    '<li><span class="w">Москва</span><div><b>TOPGUN</b><span class="d">Крупнейшая сеть барбершопов России и СНГ. Работа в команде с жёсткими стандартами сервиса.</span></div></li>' +
    '<li><span class="w">Нетания</span><div><b>Барбершоп в Нетании</b><span class="d">Годы практики, постоянные клиенты и десятки отзывов на пять звёзд.</span></div></li>' +
    '<li><span class="w">Теперь</span><div><b>Свой барбершоп</b><span class="d">Семейная команда плюс Кирилл. Свои правила: время, чай, стрижка.</span></div></li>' +
    "</ul>" +
    '<div class="st-p">' +
    '<div class="st-c st-r"><img src="' + BASE + 'assets/img/dima2.jpg" alt="Дима" loading="lazy"><div><h3>Дима</h3><div class="r">Основатель · барбер</div><ul><li>Работал в Chop-Chop и TOPGUN (Москва)</li><li>Мужские стрижки, fade, усы и борода</li><li>«Лучший барбер в мире», по отзыву клиента</li></ul></div></div>' +
    '<div class="st-c st-r"><img src="' + BASE + 'assets/img/barber3.jpg" alt="Барбер №3" loading="lazy" style="object-position:center 30%"><div><h3>Барбер №3</h3><div class="r">Жена Димы · барбер</div><ul><li>Опыт в лучших барбершопах Москвы</li><li>Мужские, женские и детские стрижки</li><li>Работа с текстурой и формой</li></ul></div></div>' +
    "</div>" +
    '<div class="st-ch"><h3>Сертификаты и дипломы</h3><small>Обучение и работа в лучших школах</small></div>' +
    '<div class="st-g">' + certs.map(certHtml).join("") + "</div>" +
    (C && C.length ? "" : '<p class="st-note">Это макеты. Настоящие сертификаты Димы и его жены загрузим сюда, когда появятся сканы: положить в <code>assets/certs/</code> и добавить в <code>assets/config.js</code>.</p>') +
    "</div>";
  host.parentNode.insertBefore(sec, host);

  var els = sec.querySelectorAll(".st-r");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.08 });
    els.forEach(function (el) { io.observe(el); });
  }
  setTimeout(function () { els.forEach(function (el) { el.classList.add("in"); }); }, 2600);
})();
