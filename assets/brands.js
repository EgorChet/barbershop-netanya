// "Чем мы пользуемся" — strip of the brands the barbers actually work with.
// Names only (no logos): edit the list in assets/config.js → brands.
// Themed through the same CSS variables as booking/story (--bk-*).
(function () {
  var host = document.getElementById("ritual");
  if (!host || document.getElementById("brands") || document.getElementById("shelf")) return;
  var cfg = window.SITE_CONFIG || {};
  var base = /\/v\d-[^\/]*\/?/.test(location.pathname) ? "../" : "";
  var list = (cfg.brands && cfg.brands.length) ? cfg.brands : [
    { name: "Reuzel", note: "помады и матовая глина для укладки" },
    { name: "Clubman Pinaud", note: "классический тальк и средства после бритья" }
  ];

  var css =
    ".bn-s{background:var(--bk-bg,#111);color:var(--bk-fg,#fff);padding:clamp(54px,7vw,90px) clamp(16px,4vw,40px);font-family:inherit;border-top:1px solid var(--bk-line,#333)}" +
    ".bn-in{max-width:1200px;margin:0 auto}" +
    ".bn-k{font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:var(--bk-mut,#999)}" +
    ".bn-s h2{font-family:var(--bk-head,inherit);font-weight:700;font-size:clamp(28px,4.4vw,52px);line-height:1.05;margin:12px 0 0;text-transform:none}" +
    ".bn-s h2 em{font-style:normal;color:var(--bk-acc,#ff5a1f)}" +
    ".bn-lead{max-width:600px;margin-top:14px;line-height:1.6;color:var(--bk-mut,#aaa)}" +
    ".bn-g{display:grid;gap:12px;margin-top:30px}" +
    ".bn-b{border:1px solid var(--bk-line,#333);border-radius:var(--bk-radius,8px);padding:22px;display:flex;flex-direction:column;gap:8px;transition:border-color .3s}" +
    ".bn-b:hover{border-color:var(--bk-acc,#ff5a1f)}" +
    ".bn-b b{font-family:var(--bk-head,inherit);font-size:clamp(26px,4vw,40px);font-weight:700;letter-spacing:.02em;text-transform:uppercase;line-height:1}" +
    ".bn-b span{color:var(--bk-mut,#aaa);font-size:15px;line-height:1.5}" +
    ".bn-i{display:flex;gap:10px;margin-bottom:8px}.bn-i i{flex:1;max-width:150px;aspect-ratio:1;background:#f3eee4;border-radius:calc(var(--bk-radius,8px) * .6);display:grid;place-items:center;overflow:hidden}.bn-i img{width:88%;height:88%;object-fit:contain;mix-blend-mode:multiply}" +
    ".bn-f{margin-top:18px;font-size:12px;color:var(--bk-mut,#999)}" +
    "@media(min-width:700px){.bn-g{grid-template-columns:repeat(2,1fr)}}" +
    "@media(min-width:1000px){.bn-g{grid-template-columns:repeat(3,1fr)}}";
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
    list.map(function (b) { var im = (b.imgs || []).map(function (u) { return "<i><img loading=\"lazy\" alt=\"" + b.name + "\" src=\"" + base + u + "\"></i>"; }).join(""); return '<div class="bn-b">' + (im ? '<div class="bn-i">' + im + "</div>" : "") + '<b>' + b.name + "</b><span>" + (b.note || "") + "</span></div>"; }).join("") +
    '</div><p class="bn-f">Названия и фото принадлежат их владельцам. Мы пользуемся этой косметикой, но не являемся официальным дилером.</p></div>';
  host.parentNode.insertBefore(sec, host.nextSibling);
})();
