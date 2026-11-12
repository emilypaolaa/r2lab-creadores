/* R2LAB · Transición de cortina entre páginas internas */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var root = document.documentElement;
  var curtain = document.createElement("div");
  curtain.className = "page-curtain";
  curtain.setAttribute("aria-hidden", "true");
  curtain.innerHTML = '<div class="pc-layer pc-a"><div class="pc-mark"><img src="img/logo-badge.png" alt="" width="64" height="64"><i></i></div></div>';
  document.body.appendChild(curtain);

  function snap(fn) { // cambia de estado sin animación (para no cruzar la pantalla)
    curtain.classList.add("no-anim"); fn(); void curtain.offsetWidth;
    requestAnimationFrame(function () { curtain.classList.remove("no-anim"); });
  }

  // al llegar: las capas se van hacia arriba y revelan la página
  function reveal() {
    curtain.classList.remove("is-covering");
    curtain.classList.add("is-leaving");
    setTimeout(function () { snap(function () { curtain.classList.remove("is-leaving"); }); }, 950);
  }
  if (root.classList.contains("pc-arrive")) {
    sessionStorageSet("r2-curtain", "");
    snap(function () { curtain.classList.add("is-covering"); });
    root.classList.remove("pc-arrive");
    var go = function () { setTimeout(reveal, 120); };
    if (reduce) { snap(function () { curtain.classList.remove("is-covering"); }); }
    else if (document.fonts && document.fonts.ready) { var done = false; var once = function () { if (!done) { done = true; go(); } }; document.fonts.ready.then(once); setTimeout(once, 700); }
    else go();
  }
  // enlaces directos a una sección (p. ej. /#examen): bajar a ella cuando la página ya cargó
  if (location.hash.length > 1) {
    window.addEventListener("load", function () {
      var target = null;
      try { target = document.querySelector(decodeURIComponent(location.hash)); } catch (err) { /* hash inválido */ }
      if (!target) return;
      setTimeout(function () {
        target.scrollIntoView({ block: "start" }); // respeta scroll-margin-top de cada sección
        if (window.ScrollTrigger) window.ScrollTrigger.refresh();
      }, 120);
    });
  }

  // al volver con el botón "atrás" (caché del navegador)
  window.addEventListener("pageshow", function (e) {
    if (e.persisted) { root.classList.remove("pc-arrive"); snap(function () { curtain.classList.remove("is-covering", "is-leaving"); }); }
  });

  // al salir hacia otra página interna: la cortina cubre y luego navega
  document.addEventListener("click", function (e) {
    if (reduce || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest && e.target.closest("a[href]");
    if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
    var url = new URL(a.href, location.href);
    if (url.origin !== location.origin) return;
    var samePage = url.pathname.replace(/\.html$/, "").replace(/\/index$/, "/") === location.pathname.replace(/\.html$/, "").replace(/\/index$/, "/");
    if (samePage) return; // anclas dentro de la misma página: scroll normal
    e.preventDefault();
    sessionStorageSet("r2-curtain", "1");
    curtain.classList.add("is-covering");
    setTimeout(function () { location.href = url.href; }, 820);
  });

  function sessionStorageGet(k) { try { return sessionStorage.getItem(k); } catch (err) { return null; } }
  function sessionStorageSet(k, v) { try { sessionStorage.setItem(k, v); } catch (err) { /* sin almacenamiento: sin cortina */ } }
})();
