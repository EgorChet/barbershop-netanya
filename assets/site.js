// Fills contact details from assets/config.js into the page.
//   [data-cfg="address|phone|city|name|instagram"]  -> text (keeps the text already there when the value is empty)
//   [data-cfg-hours]                                 -> <li><span>day</span><b>time</b></li> list
//   [data-cfg-map]                                   -> iframe src for the map
//   [data-cfg-call]                                  -> tel: link, or WhatsApp, or hidden
//   [data-cfg-wa]                                    -> WhatsApp link (hidden if empty)
//   [data-cfg-ig]                                    -> Instagram link
//   [data-cfg-route]                                 -> Google Maps directions link
(function () {
  var C = (window.SITE_CONFIG && window.SITE_CONFIG.contacts) || {};
  function each(sel, fn) { document.querySelectorAll(sel).forEach(fn); }
  var q = encodeURIComponent(C.address ? C.address + ", " + (C.city || "") : C.mapQuery || "Netanya");

  each("[data-cfg]", function (el) {
    var v = C[el.getAttribute("data-cfg")];
    if (v) el.textContent = el.getAttribute("data-cfg") === "instagram" ? "@" + v : v;
  });
  each("[data-cfg-hours]", function (el) {
    el.innerHTML = (C.hours || []).map(function (h) { return "<li><span>" + h[0] + "</span><b>" + h[1] + "</b></li>"; }).join("");
  });
  each("[data-cfg-map]", function (el) {
    el.src = "https://maps.google.com/maps?q=" + q + "&z=15&output=embed";
  });
  each("[data-cfg-route]", function (el) {
    el.href = "https://www.google.com/maps/dir/?api=1&destination=" + q;
    el.target = "_blank"; el.rel = "noopener";
  });
  each("[data-cfg-ig]", function (el) {
    if (!C.instagram) { el.hidden = true; return; }
    el.href = "https://www.instagram.com/" + C.instagram + "/";
    el.target = "_blank"; el.rel = "noopener";
  });
  each("[data-cfg-wa]", function (el) {
    if (!C.whatsapp) { el.hidden = true; return; }
    el.href = "https://wa.me/" + C.whatsapp;
    el.target = "_blank"; el.rel = "noopener";
  });
  each("[data-cfg-call]", function (el) {
    if (C.phone) el.href = "tel:" + C.phone.replace(/[^\d+]/g, "");
    else if (C.whatsapp) { el.href = "https://wa.me/" + C.whatsapp; el.target = "_blank"; el.rel = "noopener"; }
    else if (C.instagram) { el.href = "https://www.instagram.com/" + C.instagram + "/"; el.target = "_blank"; el.rel = "noopener"; var l = el.querySelector("[data-call-label]"); if (l) l.textContent = "Instagram"; }
  });

  // Reveal-on-scroll, with a safety net so content never stays hidden.
  var els = document.querySelectorAll("[data-rv]");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.08, rootMargin: "0px 0px -5% 0px" });
    els.forEach(function (el) { io.observe(el); });
  }
  setTimeout(function () { els.forEach(function (el) { el.classList.add("in"); }); }, 2600);
})();
