// Видео-шапка должна двигаться сразу, без касания.
// 1) Настоящий автозапуск: muted + playsinline, play() повторяем на всех событиях.
// 2) Если iPhone запретил автозапуск (энергосбережение, встроенные окна приложений), быстро меняем
//    кадры в постере (стоп-моушен из media/frames/), пока видео не заиграет по-настоящему.
// 3) Первое касание запускает все видимые видео. Звук никогда не включается сам.
// Проверка запрета: добавьте к адресу ?noautoplay=1
(function () {
  var q = /[?&]noautoplay=1/.test(location.search);
  var src = (document.currentScript && document.currentScript.src) || "";
  var root = src.replace(/assets\/autoplay\.js.*$/, "");
  var N = 16, FPS = 4;
  var armed = false;

  function vids() { return Array.prototype.slice.call(document.querySelectorAll("video")); }
  function inView(v) { var r = v.getBoundingClientRect(); return r.bottom > -50 && r.top < (window.innerHeight || 800) + 50 && r.width > 0; }
  function harden(v) {
    try {
      v.muted = true; v.defaultMuted = true; v.playsInline = true;
      v.setAttribute("muted", ""); v.setAttribute("playsinline", ""); v.setAttribute("webkit-playsinline", "");
    } catch (e) {}
  }
  function tryPlay(v) {
    if (q) return;
    harden(v);
    if (!v.getAttribute("src") && v.getAttribute("data-src")) v.src = v.getAttribute("data-src");
    var p; try { p = v.play(); } catch (e) {}
    if (p && p.catch) p.catch(function () {});
  }

  // ---- стоп-моушен на постере ----
  function frameBase(v) {
    var s = v.currentSrc || v.getAttribute("src") || (v.querySelector("source") && v.querySelector("source").getAttribute("src")) || "";
    var m = s.match(/(hero-dima2?)\.mp4/);
    return m ? root + "media/frames/" + m[1] + "-" : null;
  }
  function startFrames(v) {
    if (v._fm) return;
    var base = frameBase(v); if (!base) return;
    v._fm = true;
    var imgs = [], ready = 0, i = 0, timer = null;
    for (var k = 0; k < N; k++) {
      (function (k) {
        var im = new Image();
        im.onload = function () { ready++; if (ready === 4 && !timer) go(); };
        im.src = base + (k < 10 ? "0" : "") + k + ".jpg";
        imgs.push(im);
      })(k);
    }
    function go() {
      timer = setInterval(function () {
        if (!v.paused && v.currentTime > 0.05 && !q) { stop(); return; }
        var im = imgs[i % N]; i++;
        if (im.complete && im.naturalWidth) v.poster = im.src;
      }, 1000 / FPS);
    }
    function stop() { clearInterval(timer); v._fm = false; }
    v.addEventListener("playing", function () { if (!q) stop(); });
  }

  function heroes() { return vids().filter(function (v) { return v.hasAttribute("autoplay"); }); }

  function init() {
    heroes().forEach(function (v) {
      harden(v);
      if (q) { v.play = function () { return Promise.reject(new Error("NotAllowedError")); }; v.pause(); return; }
      tryPlay(v);
      ["loadedmetadata", "loadeddata", "canplay"].forEach(function (e) { v.addEventListener(e, function () { tryPlay(v); }); });
    });
    ["pageshow", "visibilitychange", "focus"].forEach(function (e) {
      (e === "focus" ? window : document).addEventListener(e, function () { heroes().forEach(tryPlay); });
    });
    setTimeout(function () { heroes().forEach(function (v) { if (v.paused && inView(v)) startFrames(v); }); arm(); }, 1300);
    setTimeout(function () { heroes().forEach(function (v) { if (v.paused && inView(v)) startFrames(v); }); }, 3000);
  }

  // ---- первое касание ----
  function kick() {
    vids().forEach(function (v) {
      if (v.paused && v.hasAttribute("muted") && inView(v)) {
        var p; harden(v);
        if (!v.getAttribute("src") && v.getAttribute("data-src")) v.src = v.getAttribute("data-src");
        try { p = v.play(); } catch (e) {}
        if (p && p.catch) p.catch(function () {});
      }
    });
  }
  function arm() {
    if (armed) return; armed = true;
    var go = function () { kick(); setTimeout(kick, 300); };
    ["touchend", "pointerup", "click", "keydown"].forEach(function (e) { document.addEventListener(e, go, { passive: true, capture: true }); });
  }
  window.addEventListener("scroll", function () { clearTimeout(arm._t); arm._t = setTimeout(arm, 800); }, { passive: true, once: true });

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
