// Карта и маршрут в каждой версии. Если в вёрстке уже есть [data-cfg-map] (версии 5–7), ничего не добавляется.
// Адрес берётся из assets/config.js → contacts (mapQuery, пока адрес не известен: «Netanya, Israel»).
(function () {
  if (document.querySelector("[data-cfg-map]") || document.getElementById("mapsec")) return;
  var C = (window.SITE_CONFIG && window.SITE_CONFIG.contacts) || {};
  var q = encodeURIComponent(C.mapQuery || [C.address, C.city, "Israel"].filter(Boolean).join(", ") || "Netanya, Israel");
  var host = document.getElementById("visit") || document.getElementById("contact") || document.getElementById("how");
  var T = {
    ru: { k: "Адрес", t: "Как <em>найти</em>", a: "Адрес скоро", r: "Маршрут" },
    en: { k: "Location", t: "How to <em>find us</em>", a: "Address coming soon", r: "Directions" },
    he: { k: "כתובת", t: "איך <em>מגיעים</em>", a: "הכתובת בקרוב", r: "ניווט" },
    fr: { k: "Adresse", t: "Comment <em>nous trouver</em>", a: "Adresse bientôt", r: "Itinéraire" }
  };
  var css =
    ".mp-s{background:var(--bk-bg,#111);color:var(--bk-fg,#fff);padding:clamp(54px,7vw,96px) clamp(16px,4vw,40px);border-top:1px solid var(--bk-line,#333);font-family:inherit}" +
    ".mp-in{max-width:1200px;margin:0 auto}" +
    ".mp-k{font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:var(--bk-mut,#999)}" +
    ".mp-s h2{font-family:var(--bk-head,inherit);font-weight:700;font-size:clamp(28px,4.4vw,52px);line-height:1.05;margin:12px 0 0;text-transform:none}" +
    ".mp-s h2 em{font-style:normal;color:var(--bk-acc,#ff5a1f)}" +
    ".mp-row{display:flex;gap:14px;align-items:center;justify-content:space-between;flex-wrap:wrap;margin-top:16px}" +
    ".mp-a{font-size:18px}" +
    ".mp-b{display:inline-block;background:var(--bk-acc,#fff);color:var(--bk-acc-fg,#000);padding:13px 20px;border-radius:var(--bk-radius,6px);font:700 13px/1 system-ui,sans-serif;letter-spacing:.06em;text-transform:uppercase;text-decoration:none}" +
    ".mp-m{margin-top:20px;border:1px solid var(--bk-line,#333);border-radius:var(--bk-radius,8px);overflow:hidden;height:clamp(280px,46vw,440px);background:#222}" +
    ".mp-m iframe{display:block;width:100%;height:100%;border:0;filter:grayscale(1) contrast(1.05) brightness(.92)}";
  var st = document.createElement("style");
  st.textContent = css;
  document.head.appendChild(st);

  var sec = document.createElement("section");
  sec.className = "mp-s";
  sec.id = "mapsec";
  if (host) host.parentNode.insertBefore(sec, host.nextSibling);
  else { var f = document.querySelector("footer"); (f ? f.parentNode : document.body).insertBefore(sec, f || null); }

  function render() {
    var lg = (window.I18N && window.I18N.lang) || "ru", L = T[lg] || T.ru;
    var hl = { ru: "ru", en: "en", he: "iw", fr: "fr" }[lg] || "ru";
    sec.innerHTML = '<div class="mp-in"><span class="mp-k">' + L.k + "</span><h2>" + L.t + '</h2><div class="mp-row"><span class="mp-a">' +
      (C.address || L.a) + (C.city ? ", " + (lg === "ru" ? C.city : lg === "en" ? "Netanya" : lg === "he" ? "נתניה" : "Netanya") : "") +
      '</span><a class="mp-b" target="_blank" rel="noopener" href="https://www.google.com/maps/dir/?api=1&destination=' + q + '">' + L.r + "</a></div>" +
      '<div class="mp-m"><iframe title="Map" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://maps.google.com/maps?q=' + q + "&z=14&hl=" + hl + '&output=embed"></iframe></div></div>';
    sec.setAttribute("lang", lg);
  }
  render();
  document.addEventListener("i18n:lang", render);
  setTimeout(render, 400);
})();
