// «Закрытый режим»: пока сайт не опубликован окончательно, посетителю открывается только основная версия (MAIN),
// а остальные версии и общий список перекидывают на неё. Хозяин открывает всё скрытой ссылкой: <сайт>/?unlock=<секрет>
// (один раз на устройство). В коде лежит только хэш секрета, сам секрет знает только владелец.
// Это ширма от случайных посетителей, а не защита: репозиторий публичный. Выключить закрытый режим: GATE_ON = false.
(function () {
  var GATE_ON = true;
  var MAIN = "v8-underground/";
  var HASH = "8e41094caf14893105ebbf53af49b9e380385eb661879a835ffe1492740ac459";
  var KEY = "grind-preview";
  var src = document.currentScript && document.currentScript.src || "";
  var base = src.replace(/assets\/gate\.js.*$/, "");
  var q = new URLSearchParams(location.search);
  var open = !GATE_ON;
  try { if (q.get("lock") === "1") localStorage.removeItem(KEY); open = open || localStorage.getItem(KEY) === "1"; } catch (e) {}
  window.GRIND_PREVIEW = open;

  var onMain = location.pathname.indexOf("/" + MAIN.replace("/", "")) !== -1;
  function toMain() { location.replace(base + MAIN); }

  var secret = q.get("unlock");
  if (!open && secret) {
    // проверяем секрет по хэшу; пока идёт проверка, страницу не перекидываем и скрываем, чтобы не мигала
    document.documentElement.style.visibility = "hidden";
    var ok = function () { try { localStorage.setItem(KEY, "1"); } catch (e) {} location.replace(base); };
    if (window.crypto && crypto.subtle) {
      crypto.subtle.digest("SHA-256", new TextEncoder().encode(secret)).then(function (buf) {
        var hex = Array.prototype.map.call(new Uint8Array(buf), function (b) { return ("0" + b.toString(16)).slice(-2); }).join("");
        if (hex === HASH) ok(); else toMain();
      }, toMain);
    } else toMain();
    return;
  }
  if (!open && !onMain) toMain();
})();
