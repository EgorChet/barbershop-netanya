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
    { kind: "dk", t: "Сертификат", course: "Мужские стрижки. Fade", cap: "Курс по мужской стрижке" },
    { kind: "lt", t: "Диплом", course: "Барбер: классика, борода и бритьё", cap: "Барбер-курс" },
    { kind: "dk", t: "Свидетельство", course: "Повышение квалификации", cap: "Повышение квалификации" }
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
    ".st-g{display:grid;gap:18px;max-width:1000px}.st-g figure{max-width:340px;width:100%}" +
    ".st-cert{position:relative;aspect-ratio:3/4;overflow:hidden;box-shadow:0 18px 34px -16px rgba(0,0,0,.7);font-family:'Inter Tight','Helvetica Neue',Arial,sans-serif}" +
    ".st-cert img{width:100%;height:100%;object-fit:cover}" +
    ".st-cert.dk{background:#101010;color:#f2f2f0;border:1px solid #2a2a2a;border-radius:3px}" +
    ".st-cert.dk:before{content:'';position:absolute;inset:10px;border:1px solid #3a3a3a;pointer-events:none}" +
    ".st-cert.lt{background:#f6f5f1;color:#161616;border:9px solid #2b1f16;box-shadow:inset 0 0 0 2px #8a6b45,0 18px 34px -16px rgba(0,0,0,.7)}" +
    ".st-cert .ct{position:absolute;inset:0;padding:8% 9% 7%;display:flex;flex-direction:column;align-items:center;text-align:center}" +
    ".st-cert .em{width:34%;aspect-ratio:1;border:2px solid currentColor;border-radius:50%;display:grid;place-items:center;opacity:.9}" +
    ".st-cert .em svg{width:62%;height:62%}" +
    ".st-cert .is{margin-top:6%;font-size:clamp(8px,1.5vw,11px);letter-spacing:.3em;text-transform:uppercase;opacity:.6}" +
    ".st-cert .ti{margin-top:9%;font-size:clamp(14px,2.3vw,21px);font-weight:800;letter-spacing:.12em;text-transform:uppercase}" +
    ".st-cert .sb{margin-top:7%;font-size:clamp(9px,1.6vw,12px);opacity:.65}" +
    ".st-cert .nm{margin-top:3%;font-size:clamp(14px,2.6vw,21px);font-weight:700;letter-spacing:.1em;text-transform:uppercase}" +
    ".st-cert .cr{margin-top:6%;font-size:clamp(9px,1.6vw,12px);opacity:.65}" +
    ".st-cert .co{margin-top:2%;font-size:clamp(12px,2.2vw,17px);font-weight:600;font-style:italic;line-height:1.3}" +
    ".st-cert .ft{margin-top:auto;width:100%;display:flex;justify-content:space-between;align-items:flex-end;gap:10px;font-size:clamp(8px,1.4vw,10px);opacity:.7}" +
    ".st-cert .ft i{display:block;height:1px;background:currentColor;opacity:.6;margin-bottom:4px}.st-cert .ft div{flex:1;text-align:center}" +
    ".st-cert .bar{position:absolute;left:0;right:0;bottom:0;height:7px;background:repeating-linear-gradient(135deg,#c0392b 0 8px,#f6f5f1 8px 16px,#1f4fa3 16px 24px,#f6f5f1 24px 32px)}" +
    ".st-cert .mk{position:absolute;top:22px;right:-38px;transform:rotate(38deg);background:#c0392b;color:#fff;font:700 10px/1 Arial,sans-serif;letter-spacing:.16em;text-transform:uppercase;padding:6px 44px;z-index:2}" +
    ".st-cap{padding:10px 2px 0;font-size:13px;color:var(--bk-mut,#aaa)}.st-cap b{color:var(--bk-fg,#fff);font-weight:600}" +
    ".st-note{margin-top:18px;font-size:13px;color:var(--bk-mut,#aaa);border:1px dashed var(--bk-line,#333);border-radius:var(--bk-radius,10px);padding:12px 14px;line-height:1.5}" +
    ".st-r{opacity:0;transform:translateY(16px);transition:opacity .8s,transform .8s}.st-r.in{opacity:1;transform:none}" +
    "@media(min-width:760px){.st-g{grid-template-columns:repeat(3,1fr);gap:22px}.st-p{grid-template-columns:1fr 1fr}.st-tl{grid-template-columns:repeat(2,1fr);column-gap:50px}.st-c{grid-template-columns:150px 1fr}.st-c img{width:150px}}" +
    "@media(max-width:420px){.st-tl li{grid-template-columns:1fr}}" +
    "@media(prefers-reduced-motion:reduce){.st-r{opacity:1;transform:none;transition:none}}";
  var st = document.createElement("style");
  st.textContent = css;
  document.head.appendChild(st);

  var EM = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><circle cx="6.5" cy="17.5" r="2.6"/><circle cx="17.5" cy="17.5" r="2.6"/><path d="M8.2 15.4 17 3M15.8 15.4 7 3"/></svg>';
  function certHtml(c) {
    var body;
    if (c.src) {
      body = '<div class="st-cert"><img src="' + (/^https?:/.test(c.src) ? c.src : BASE + c.src) + '" alt="' + (c.title || "Сертификат") + '" loading="lazy"></div>';
    } else {
      body = '<div class="st-cert ' + (c.kind || "dk") + '"><div class="ct">' +
        '<div class="em">' + EM + '</div><div class="is">Название школы</div>' +
        '<div class="ti">' + c.t + '</div><div class="sb">подтверждает, что</div><div class="nm">Имя Фамилия</div>' +
        '<div class="cr">успешно прошёл(а) курс</div><div class="co">«' + c.course + '»</div>' +
        '<div class="ft"><div><i></i>дата</div><div><i></i>подпись</div></div></div>' +
        (c.kind === "lt" ? '<div class="bar"></div>' : "") + '<div class="mk">макет</div></div>';
    }
    return '<figure class="st-r">' + body + '<figcaption class="st-cap"><b>' + (c.src ? (c.title || "") : c.cap) + "</b>" + (c.src ? (c.who ? " · " + c.who : "") : " · макет") + "</figcaption></figure>";
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
    (C && C.length ? "" : '<p class="st-note">Это макеты в стиле сертификатов барбер-школ (без чужих логотипов). Настоящие сертификаты Димы и его жены загрузим сюда, когда появятся сканы: положить в <code>assets/certs/</code> и добавить в <code>assets/config.js</code>.</p>') +
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
