// Если телефон запретил автозапуск видео (встроенные окна приложений, режим энергосбережения),
// то первое же касание экрана запускает все видимые видео. Звук не включается.
(function () {
  var armed = false;
  function vids() { return Array.prototype.slice.call(document.querySelectorAll("video")); }
  function inView(v) { var r = v.getBoundingClientRect(); return r.bottom > -50 && r.top < (window.innerHeight || 800) + 50 && r.width > 0; }
  function kick() {
    vids().forEach(function (v) {
      if (v.paused && v.hasAttribute("muted") && inView(v)) {
        if (!v.getAttribute("src") && v.getAttribute("data-src")) v.src = v.getAttribute("data-src");
        var p = v.play(); if (p && p.catch) p.catch(function () {});
      }
    });
  }
  function arm() {
    if (armed) return; armed = true;
    var go = function () { kick(); setTimeout(kick, 300); };
    ["touchend", "pointerup", "click", "keydown"].forEach(function (e) { document.addEventListener(e, go, { once: false, passive: true, capture: true }); });
  }
  function check() {
    var blocked = vids().some(function (v) { return v.hasAttribute("autoplay") && v.paused && inView(v); });
    if (blocked) arm();
  }
  setTimeout(check, 1500); setTimeout(check, 4000);
  window.addEventListener("scroll", function () { clearTimeout(check._t); check._t = setTimeout(arm, 800); }, { passive: true, once: true });
})();
