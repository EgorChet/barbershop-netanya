// Floating version switcher shared by all sample versions.
(function () {
  if (window.GRIND_PREVIEW === false) return; // закрытый режим: переключатель версий только для владельца (см. assets/gate.js)
  // Порядок в панели: любимые первыми. Номера идут подряд по этому порядку.
  var versions = [
    { id: "v8-underground", name: "Underground" },
    { id: "v7-pleasures", name: "Post-punk" },
    { id: "v10-xerox", name: "Xerox" },
    { id: "v11-vhs", name: "VHS" },
    { id: "v12-concrete", name: "Concrete" },
    { id: "v9-rega", name: "Rega" },
    { id: "v6-frant", name: "Dandy" },
    { id: "v2-bold", name: "Bold" },
    { id: "v3-club", name: "Club" }
  ];
  versions.forEach(function (v, i) { v.n = (i < 9 ? "0" : "") + (i + 1); }); // номер = место в списке
  var here = location.pathname.split("/").filter(Boolean);
  var current = here[here.length - 1] === "index.html" ? here[here.length - 2] : here[here.length - 1];

  var css =
    ".vsw{position:fixed;left:50%;bottom:calc(var(--vsw-bottom,16px) + env(safe-area-inset-bottom,0px));transform:translateX(-50%);z-index:9999;display:flex;align-items:center;gap:4px;" +
    "padding:5px;border-radius:999px;background:rgba(17,17,17,.88);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);" +
    "box-shadow:0 10px 30px rgba(0,0,0,.35);font:600 12px/1 -apple-system,'Segoe UI',Roboto,Arial,sans-serif;max-width:calc(100vw - 20px);overflow-x:auto;scrollbar-width:none}" +
    ".vsw::-webkit-scrollbar{display:none}" +
    ".vsw a{color:#cfcfcf;text-decoration:none;padding:9px 12px;border-radius:999px;white-space:nowrap;letter-spacing:.04em;transition:background .2s,color .2s}" +
    ".vsw a:hover{color:#fff;background:rgba(255,255,255,.1)}" +
    ".vsw a[aria-current]{background:#fff;color:#111}" +
    ".vsw .home{opacity:.75}" +
    ".vsw b{font-weight:600;opacity:.55;margin-right:4px}" +
    "@media(max-width:760px){.vsw a span{display:none}.vsw a{padding:8px 8px}.vsw{gap:0;font-size:11px}}@media(max-width:420px){.vsw a{padding:8px 6px}.vsw b{margin-right:0}}";
  var st = document.createElement("style");
  st.textContent = css;
  document.head.appendChild(st);

  var nav = document.createElement("nav");
  nav.className = "vsw";
  nav.setAttribute("aria-label", "Выбор версии");
  var html = '<a class="home" href="../" title="Все версии">←<span>&nbsp;Все</span></a>';
  versions.forEach(function (v) {
    html +=
      '<a href="../' + v.id + '/"' + (v.id === current ? ' aria-current="page"' : "") +
      "><b>" + v.n + "</b><span>" + v.name + "</span></a>";
  });
  nav.innerHTML = html;
  document.body.appendChild(nav);
})();
