// «Чем мы пользуемся»: каталог косметики для всех версий.
// Список товаров — assets/config.js → products. Фото на светлой плашке, одинаковые карточки, цвета берутся из версии (--bk-*).
(function () {
  var host = document.getElementById("ritual");
  if (!host || document.getElementById("brands") || document.getElementById("shelf") || /v8-/.test(location.pathname)) return;
  var cfg = window.SITE_CONFIG || {};
  var list = cfg.products || [];
  if (!list.length) return;
  var base = /\/v\d-[^\/]*\/?/.test(location.pathname) ? "../" : "";

  var css =
    ".bn-s{background:var(--bk-bg,#111);color:var(--bk-fg,#fff);padding:clamp(54px,7vw,90px) clamp(16px,4vw,40px);font-family:inherit;border-top:1px solid var(--bk-line,#333)}" +
    ".bn-in{max-width:1200px;margin:0 auto}" +
    ".bn-k{font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:var(--bk-mut,#999)}" +
    ".bn-s h2{font-family:var(--bk-head,inherit);font-weight:700;font-size:clamp(28px,4.4vw,52px);line-height:1.05;margin:12px 0 0;text-transform:none}" +
    ".bn-s h2 em{font-style:normal;color:var(--bk-acc,#ff5a1f)}" +
    ".bn-lead{max-width:600px;margin-top:14px;line-height:1.6;color:var(--bk-mut,#aaa)}" +
    ".bn-g{display:grid;gap:12px;margin-top:30px;grid-template-columns:repeat(2,minmax(0,1fr));direction:ltr}" +
    "@media(min-width:700px){.bn-g{grid-template-columns:repeat(3,minmax(0,1fr))}}" +
    "@media(min-width:1000px){.bn-g{grid-template-columns:repeat(5,minmax(0,1fr))}}" +
    ".bn-c{display:flex;flex-direction:column;border:1px solid var(--bk-line,#333);border-radius:var(--bk-radius,8px);overflow:hidden;background:color-mix(in srgb,var(--bk-fg,#fff) 4%,var(--bk-bg,#111));transition:border-color .25s,transform .25s}" +
    ".bn-c:hover{border-color:var(--bk-acc,#ff5a1f);transform:translateY(-3px)}" +
    ".bn-p{aspect-ratio:1;background:#f1ede4;display:grid;place-items:center}" +
    ".bn-p img{width:84%;height:84%;object-fit:contain;mix-blend-mode:multiply}" +
    ".bn-t{padding:12px 14px 16px;display:flex;flex-direction:column;gap:4px;direction:var(--bn-dir,ltr)}" +
    ".bn-b{font:600 10px/1.2 ui-monospace,Menlo,monospace;letter-spacing:.14em;text-transform:uppercase;color:var(--bk-acc,#ff5a1f)}" +
    ".bn-n{font-family:var(--bk-head,inherit);font-weight:700;font-size:17px;line-height:1.15}" +
    ".bn-d{font-size:13px;line-height:1.45;color:var(--bk-mut,#aaa)}" +
    ".bn-f{margin-top:20px;font-size:12px;color:var(--bk-mut,#999);max-width:720px;line-height:1.5}";
  var st = document.createElement("style");
  st.textContent = css;
  document.head.appendChild(st);

  var sec = document.createElement("section");
  sec.className = "bn-s";
  sec.id = "brands";
  sec.innerHTML =
    '<div class="bn-in"><span class="bn-k">Косметика</span>' +
    "<h2>Чем мы <em>пользуемся</em></h2>" +
    '<p class="bn-lead">Классика барбер-культуры. Работаем тем, что проверено годами: укладка, тальк после бритья, уход.</p>' +
    '<div class="bn-g">' +
    list.map(function (p) {
      return '<div class="bn-c"><div class="bn-p"><img loading="lazy" alt="' + p.brand + " " + p.name + '" src="' + base + p.img + '"></div>' +
        '<div class="bn-t"><span class="bn-b">' + p.brand + '</span><b class="bn-n">' + p.name + '</b><span class="bn-d">' + (p.note || "") + "</span></div></div>";
    }).join("") +
    '</div><p class="bn-f">Названия и фото принадлежат их владельцам. Мы пользуемся этой косметикой, но не являемся официальным дилером.</p></div>';
  host.parentNode.insertBefore(sec, host.nextSibling);
  document.addEventListener("i18n:lang", function () { sec.style.setProperty("--bn-dir", document.documentElement.getAttribute("dir") === "rtl" ? "rtl" : "ltr"); });
})();
