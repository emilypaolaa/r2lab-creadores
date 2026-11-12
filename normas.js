/* R2LAB · Guía de normas (GSAP + ScrollTrigger) */
(function () {
  "use strict";

  var root = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(pointer: fine)").matches;
  var hasGsap = !!window.gsap && !!window.ScrollTrigger && !reduce;

  /* ---------- Bloqueo de scroll ---------- */
  function lockScroll(on) { root.classList.toggle("scroll-lock", on); }
  function blockTouch(e) { if (root.classList.contains("scroll-lock")) e.preventDefault(); }

  /* ---------- Menú en celular ---------- */
  var menuBtn = document.querySelector(".menu-btn");
  var menu = document.getElementById("mobile-menu");
  var menuLinks = menu ? menu.querySelectorAll("a") : [];
  function setMenu(open) {
    root.classList.toggle("menu-open", open);
    lockScroll(open);
    menuBtn.setAttribute("aria-expanded", open);
    menuBtn.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    menu.setAttribute("aria-hidden", !open);
    if (hasGsap) {
      gsap.killTweensOf([menu, menuLinks]);
      if (open) {
        gsap.to(menu, { autoAlpha: 1, duration: 0.35, ease: "power2.out" });
        gsap.fromTo(menuLinks, { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.06, ease: "expo.out", delay: 0.05 });
      } else {
        gsap.to(menu, { autoAlpha: 0, duration: 0.3, ease: "power2.in" });
      }
    } else {
      menu.style.visibility = open ? "visible" : "hidden";
      menu.style.opacity = open ? "1" : "0";
    }
    updateWa();
  }
  if (menuBtn && menu) {
    menu.addEventListener("touchmove", blockTouch, { passive: false });
    menuBtn.addEventListener("click", function () { setMenu(!root.classList.contains("menu-open")); });
    menuLinks.forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && root.classList.contains("menu-open")) setMenu(false); });
    window.addEventListener("resize", function () { if (window.innerWidth >= 860 && root.classList.contains("menu-open")) setMenu(false); });
  }

  /* ---------- WhatsApp flotante ---------- */
  var wa = document.querySelector(".wa-float");
  var heroEl = document.querySelector(".n-hero");
  function updateWa() {
    if (!wa) return;
    var show = window.scrollY > heroEl.offsetHeight * 0.6 && !root.classList.contains("menu-open");
    wa.classList.toggle("show", show);
  }
  window.addEventListener("scroll", updateWa, { passive: true });

  /* ---------- Progreso de lectura ---------- */
  var bar = document.querySelector(".read-progress span");
  function updateProgress() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
    bar.style.transform = "scaleX(" + p + ")";
  }
  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress(); updateWa();

  /* ---------- Capítulo activo en el índice ---------- */
  var chapterLinks = Array.prototype.slice.call(document.querySelectorAll(".chapters a"));
  var track = document.querySelector(".chapters-track");
  function setActive(id) {
    chapterLinks.forEach(function (a) {
      var on = a.getAttribute("href") === "#" + id;
      a.classList.toggle("active", on);
      if (on && track) {
        var left = a.offsetLeft - track.clientWidth / 2 + a.clientWidth / 2;
        track.scrollTo({ left: left, behavior: "smooth" });
      }
    });
  }
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) setActive(en.target.id); });
    }, { rootMargin: "-45% 0px -50% 0px" });
    document.querySelectorAll(".chapter").forEach(function (s) { io.observe(s); });
  }

  /* ---------- Palabras borrosas: toca para ver ---------- */
  var words = document.querySelectorAll(".words li");
  words.forEach(function (w) {
    w.setAttribute("tabindex", "0");
    w.setAttribute("role", "button");
    w.setAttribute("aria-label", "Palabra oculta, toca para ver");
    function toggle() { w.classList.toggle("on"); w.setAttribute("aria-label", w.classList.contains("on") ? w.textContent : "Palabra oculta, toca para ver"); }
    w.addEventListener("click", toggle);
    w.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); } });
  });
  var allBtn = document.querySelector(".reveal-all");
  if (allBtn) allBtn.addEventListener("click", function () {
    var show = allBtn.getAttribute("aria-pressed") !== "true";
    allBtn.setAttribute("aria-pressed", show);
    allBtn.textContent = show ? "Ocultar todas" : "Mostrar todas";
    words.forEach(function (w, i) {
      setTimeout(function () { w.classList.toggle("on", show); }, hasGsap ? i * 35 : 0);
    });
  });

  /* ---------- Tarjetas que giran ---------- */
  document.querySelectorAll(".flip").forEach(function (f) {
    f.addEventListener("click", function () {
      var on = !f.classList.contains("on");
      f.classList.toggle("on", on);
      f.setAttribute("aria-pressed", on);
    });
  });

  /* ---------- Frases que se intercambian (06) ---------- */
  var swapWord = document.querySelector(".swap-word");
  var swapItems = Array.prototype.slice.call(document.querySelectorAll(".swap-list li"));
  var swapIdx = 0;
  if (swapItems.length) swapItems[0].classList.add("active");
  function nextSwap() {
    swapIdx = (swapIdx + 1) % swapItems.length;
    var text = swapItems[swapIdx].textContent;
    swapItems.forEach(function (li, i) { li.classList.toggle("active", i === swapIdx); });
    if (hasGsap) {
      gsap.killTweensOf(swapWord);
      gsap.timeline()
        .to(swapWord, { yPercent: -110, autoAlpha: 0, duration: 0.45, ease: "power3.in" })
        .add(function () { swapWord.textContent = text; })
        .fromTo(swapWord, { yPercent: 110, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.6, ease: "expo.out" });
    } else {
      swapWord.textContent = text;
    }
  }
  if (swapWord) {
    if (hasGsap) {
      // usa el reloj de GSAP para que el texto y la animación nunca se desincronicen
      (function loop() { gsap.delayedCall(2.6, function () { nextSwap(); loop(); }); })();
    } else {
      setInterval(function () { if (!document.hidden) nextSwap(); }, 2600);
    }
  }

  /* ---------- Sin GSAP: mostrar todo en su estado final ---------- */
  if (!hasGsap) {
    root.classList.remove("js");
    document.querySelectorAll(".tl-line span, .sev-bar span").forEach(function (el) { el.style.transform = "none"; });
    return;
  }

  /* ==================== Animaciones GSAP ==================== */
  gsap.registerPlugin(ScrollTrigger);
  // recalcular posiciones cuando terminen de cargar tipografía e imágenes
  window.addEventListener("load", function () { window.ScrollTrigger.refresh(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { window.ScrollTrigger.refresh(); });
  gsap.defaults({ ease: "power3.out", duration: 1 });

  // separar títulos en palabras
  function splitWords(el) {
    var out = [];
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (p) {
            if (!p) return;
            if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(p)); return; }
            var w = document.createElement("span"); w.className = "w";
            var i = document.createElement("span"); i.textContent = p;
            w.appendChild(i); frag.appendChild(w); out.push(i);
          });
          node.replaceChild(frag, n);
        } else if (n.nodeType === 1) { walk(n); }
      });
    })(el);
    return out;
  }
  var h1 = document.querySelector(".n-hero h1");
  var heroWords = splitWords(h1);
  gsap.set("[data-intro], .n-hero h1", { visibility: "visible" });

  // intro
  gsap.timeline({ delay: 0.1 })
    .from(".nav", { y: -40, autoAlpha: 0, duration: 0.9 })
    .from(".back-link", { x: -20, autoAlpha: 0, duration: 0.6 }, "-=0.5")
    .from(".n-hero .pill-dark", { y: 20, autoAlpha: 0, duration: 0.7 }, "-=0.4")
    .from(heroWords, { yPercent: 115, rotate: 4, duration: 1.1, stagger: 0.07, ease: "expo.out" }, "-=0.4")
    .from(".n-hero .lead", { y: 24, autoAlpha: 0, duration: 0.8 }, "-=0.7")
    .from(".n-hero .chips li", { scale: 0.6, autoAlpha: 0, stagger: 0.08, duration: 0.6, ease: "back.out(2)" }, "-=0.5")
    .from(".n-meta, .scroll-cue", { y: 16, autoAlpha: 0, duration: 0.6, stagger: 0.1 }, "-=0.3")
    .from(".chapters", { y: 20, autoAlpha: 0, duration: 0.7 }, "-=0.4");

  // fondo con parallax
  gsap.utils.toArray(".blob").forEach(function (b) {
    var depth = parseFloat(b.dataset.depth) || 1;
    gsap.to(b, { yPercent: -22 * depth, ease: "none", scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: 1 } });
  });

  // títulos y números de capítulo
  document.querySelectorAll(".chapter .split, .footer .split").forEach(function (el) {
    var ws = splitWords(el);
    gsap.from(ws, { yPercent: 115, rotate: 3, duration: 1, stagger: 0.05, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 88%" } });
  });
  gsap.utils.toArray(".ch-num").forEach(function (n) {
    gsap.from(n, { xPercent: -30, autoAlpha: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: n, start: "top 90%" } });
    gsap.to(n, { yPercent: -18, ease: "none", scrollTrigger: { trigger: n.parentNode, start: "top bottom", end: "bottom top", scrub: true } });
  });
  gsap.utils.toArray(".ch-lead, .chapter .label").forEach(function (el) {
    gsap.from(el, { y: 20, autoAlpha: 0, duration: 0.8, scrollTrigger: { trigger: el, start: "top 90%" } });
  });

  // grupos que entran en cascada
  function cascade(sel, trigger, vars) {
    var items = document.querySelectorAll(sel);
    if (!items.length) return;
    gsap.from(items, Object.assign({ y: 50, autoAlpha: 0, duration: 0.9, stagger: 0.09, clearProps: "transform", scrollTrigger: { trigger: trigger || items[0], start: "top 86%" } }, vars || {}));
  }
  cascade(".pillar", ".pillars", { rotate: function (i) { return [-3, 0, 3][i % 3]; } });
  cascade(".callout");
  cascade(".vocab-card", null, { scale: 0.96 });
  cascade(".words li", ".words", { y: 20, scale: 0.6, stagger: 0.03, duration: 0.6, ease: "back.out(2)" });
  cascade(".sensitive");
  cascade(".dcard", ".duo-cards", { x: function (i) { return i ? 60 : -60; }, y: 0 });
  cascade(".checks li", ".duo-cards", { x: -20, y: 0, stagger: 0.06, duration: 0.6 });
  // listas editoriales: línea que se dibuja + íconos que se trazan
  gsap.utils.toArray(".rk-list").forEach(function (list) {
    var items = list.querySelectorAll(".rk");
    items.forEach(function (rk, i) {
      var shapes = rk.querySelectorAll(".rk-ic path, .rk-ic rect, .rk-ic circle:not([r='.9'])");
      shapes.forEach(function (sh) { sh.setAttribute("pathLength", "1"); });
      var tl = gsap.timeline({ scrollTrigger: { trigger: rk, start: "top 88%" } });
      tl.from(rk.querySelector(".rk-n"), { y: 20, autoAlpha: 0, duration: 0.6 }, 0)
        .from(rk.querySelector("h3"), { y: 30, autoAlpha: 0, duration: 0.8, ease: "expo.out" }, 0.05)
        .from(rk.querySelector("p"), { y: 20, autoAlpha: 0, duration: 0.8 }, 0.15)
        .from(rk.querySelector(".rk-ic"), { scale: 0.4, rotate: -40, autoAlpha: 0, duration: 0.8, ease: "back.out(2)" }, 0.1)
        .fromTo(shapes, { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.1, stagger: 0.08, ease: "power2.inOut" }, 0.25)
        .fromTo(rk, { borderTopColor: "rgba(0,0,0,0)" }, { borderTopColor: "", duration: 0.8, clearProps: "borderTopColor" }, 0);
    });
  });
  gsap.from(".dark-panel", { y: 60, scale: 0.97, autoAlpha: 0, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: ".dark-panel", start: "top 85%" } });
  gsap.from(".dark-foot", { autoAlpha: 0, y: 10, duration: 0.8, scrollTrigger: { trigger: ".dark-foot", start: "top 95%" } });
  cascade(".swap", null, { scale: 0.96 });
  cascade(".tip", ".tips3");
  cascade(".flip", ".flips", { y: 40, rotateY: -50, stagger: 0.06 });
  cascade(".tl-step", ".timeline", { stagger: 0.18 });
  cascade(".tools .tags li", ".tools", { y: 16, scale: 0.8, stagger: 0.05, ease: "back.out(2)" });
  cascade(".severity");
  cascade(".keys li", ".keys", { stagger: 0.08 });
  cascade(".finish", null, { scale: 0.95 });
  gsap.from(".footer img", { scale: 0.5, rotate: -20, autoAlpha: 0, duration: 1.2, ease: "elastic.out(1, .6)", scrollTrigger: { trigger: ".footer", start: "top 85%" } });

  // vocabulario: algunas palabras se revelan solas para enseñar el gesto
  ScrollTrigger.create({
    trigger: ".words", start: "top 70%", once: true,
    onEnter: function () {
      var demo = words[2];
      if (!demo) return;
      gsap.delayedCall(1, function () { demo.classList.add("on"); });
      gsap.delayedCall(2.6, function () { if (allBtn.getAttribute("aria-pressed") !== "true") demo.classList.remove("on"); });
    }
  });

  // frases: la primera tarjeta gira sola una vez
  ScrollTrigger.create({
    trigger: ".flips", start: "top 65%", once: true,
    onEnter: function () {
      var f = document.querySelector(".flip");
      gsap.delayedCall(1.1, function () { f.classList.add("on"); });
      gsap.delayedCall(2.8, function () { f.classList.remove("on"); });
    }
  });

  // línea de tiempo que se dibuja
  var mm = gsap.matchMedia();
  mm.add("(min-width: 860px)", function () {
    gsap.fromTo(".tl-line span", { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: ".timeline", start: "top 75%", end: "top 30%", scrub: 1 } });
  });
  mm.add("(max-width: 859px)", function () {
    gsap.fromTo(".tl-line span", { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: ".timeline", start: "top 70%", end: "bottom 60%", scrub: 1 } });
  });

  // medidor de gravedad
  ScrollTrigger.create({
    trigger: ".severity", start: "top 75%", once: true,
    onEnter: function () {
      gsap.fromTo(".sev-bar span", { scaleX: 0 }, { scaleX: 1, duration: 1.8, ease: "power2.inOut" });
      gsap.from(".sev-list li", { x: -30, autoAlpha: 0, duration: 0.6, stagger: 0.35, delay: 0.2 });
    }
  });

  // botones magnéticos (escritorio)
  if (finePointer) {
    document.querySelectorAll(".magnetic").forEach(function (btn) {
      var mx = gsap.quickTo(btn, "x", { duration: 0.5, ease: "power3" });
      var my = gsap.quickTo(btn, "y", { duration: 0.5, ease: "power3" });
      btn.addEventListener("pointermove", function (e) {
        var r = btn.getBoundingClientRect();
        mx((e.clientX - r.left - r.width / 2) * 0.3);
        my((e.clientY - r.top - r.height / 2) * 0.4);
      });
      btn.addEventListener("pointerleave", function () { mx(0); my(0); });
    });
    var blobs = gsap.utils.toArray(".blob").map(function (b) {
      return { d: parseFloat(b.dataset.depth) || 1, x: gsap.quickTo(b, "x", { duration: 1.6, ease: "power3" }), y: gsap.quickTo(b, "y", { duration: 1.6, ease: "power3" }) };
    });
    window.addEventListener("pointermove", function (e) {
      var nx = e.clientX / window.innerWidth - 0.5, ny = e.clientY / window.innerHeight - 0.5;
      blobs.forEach(function (b) { b.x(nx * 50 * b.d); b.y(ny * 50 * b.d); });
    });
  }
})();
