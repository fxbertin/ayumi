/* PWA do Ayumi: registra o service worker, oferece "Instalar" e avisa quando falta voz japonesa. */
(function () {
  "use strict";
  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    window.addEventListener("load", function () { navigator.serviceWorker.register("sw.js").catch(function () {}); });
  }

  // Botão "Instalar como app" (Chrome/Edge/Android) e dica para iPhone/iPad (só na página inicial, se existir o #pwa-box)
  var box = document.getElementById("pwa-box"), btn = document.getElementById("pwa-install"), ios = document.getElementById("pwa-ios"), ev = null;
  var standalone = (window.matchMedia && matchMedia("(display-mode: standalone)").matches) || navigator.standalone === true;
  if (box && !standalone) {
    window.addEventListener("beforeinstallprompt", function (e) { e.preventDefault(); ev = e; box.hidden = false; if (ios) ios.hidden = true; });
    if (btn) btn.addEventListener("click", function () { if (!ev) return; ev.prompt(); ev.userChoice.finally(function () { ev = null; box.hidden = true; }); });
    if (ios && /iphone|ipad|ipod/i.test(navigator.userAgent) && !/crios|fxios/i.test(navigator.userAgent)) { box.hidden = false; ios.hidden = false; if (btn) btn.hidden = true; }
  }
})();
