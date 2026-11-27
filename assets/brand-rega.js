// Марка «Рега» (רגע — «секунду»): жест «щепотка», знакомый каждому в Израиле. Загружается до brand.js.
(function () {
  var NS = "http://www.w3.org/2000/svg";
  function mark(cls) {
    var G = 'fill="none" stroke="var(--bk-bg,#fff)" stroke-width="13" stroke-linecap="round"';
    var F = 'class="bl-draw" fill="none" stroke="currentColor" stroke-width="8.4" stroke-linecap="round" pathLength="100"';
    function finger(d) { return '<path ' + G + ' d="' + d + '"/><path ' + F + ' d="' + d + '"/>'; }
    return '<svg class="' + (cls || "bl-mark") + '" viewBox="0 0 64 76" role="img" aria-label="Rega" focusable="false" xmlns="' + NS + '">' +
      '<path d="M13 44Q8 68 28 71H40Q56 68 52 44Q40 52 22 47Z" fill="currentColor"/>' +
      finger("M49 42L37.5 14") + finger("M41 45L35 11") + finger("M32 46L32.5 10") + finger("M23 45L29.5 12") +
      finger("M13 56Q4 36 27.5 17") +
      '<g class="bl-draw2" fill="none" stroke="var(--bk-acc,currentColor)" stroke-width="3.6" stroke-linecap="round" pathLength="100"><path pathLength="100" d="M11 8L16 13"/><path pathLength="100" d="M53 8L48 13"/><path pathLength="100" d="M32 0V4"/></g></svg>';
  }
  function word(cls) {
    return '<svg class="' + (cls || "bl-word") + '" viewBox="0 0 132 56" role="img" aria-label="Rega" focusable="false" xmlns="' + NS + '">' +
      '<text x="62" y="46" text-anchor="middle" font-family="Rubik,Heebo,Arial,sans-serif" font-weight="900" font-size="58" fill="currentColor">רגע</text>' +
      '<rect x="116" y="38" width="12" height="12" rx="6" fill="var(--bk-acc,currentColor)"/></svg>';
  }
  window.BRAND_CUSTOM = { name: "Rega Barbershop", tag: "Rega · Netanya", mark: mark, word: word };
})();
