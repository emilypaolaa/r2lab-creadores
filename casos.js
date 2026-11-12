/* R2LAB · Casos de éxito (GSAP + ScrollTrigger) */
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
  var heroEl = document.querySelector(".c-hero");
  function updateWa() {
    if (!wa) return;
    wa.classList.toggle("show", window.scrollY > heroEl.offsetHeight * 0.6 && !root.classList.contains("menu-open"));
  }
  window.addEventListener("scroll", updateWa, { passive: true });
  updateWa();

  /* ---------- Formato de números ---------- */
  function fmt(v, el) {
    if (el.dataset.dec) return v.toFixed(+el.dataset.dec).replace(".", ",");
    var n = Math.round(v).toString();
    return el.dataset.sep ? n.replace(/\B(?=(\d{3})+(?!\d))/g, ".") : n;
  }

  /* ---------- Sin GSAP: mostrar todo en su estado final ---------- */
  if (!hasGsap) { root.classList.remove("js"); return; }

  /* ==================== Animaciones GSAP ==================== */
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: "power3.out", duration: 1 });
  window.addEventListener("load", function () { ScrollTrigger.refresh(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ScrollTrigger.refresh(); });

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
  function splitChars(el) {
    var text = el.textContent; el.textContent = "";
    return Array.prototype.map.call(text, function (c) {
      var s = document.createElement("span"); s.className = "ch"; s.textContent = c;
      s.setAttribute("aria-hidden", "true"); el.appendChild(s); return s;
    });
  }

  /* ---------- Intro ---------- */
  var h1 = document.querySelector(".c-hero h1");
  var heroWords = splitWords(h1);
  gsap.set("[data-intro], .c-hero h1, .fan", { visibility: "visible" });

  var cards = gsap.utils.toArray(".fan-card");
  // posiciones del abanico controladas por GSAP (el CSS queda como respaldo sin JS)
  var FAN = [{ xPercent: -98, yPercent: -46, rotate: -10 }, { xPercent: -50, yPercent: -54, rotate: 0 }, { xPercent: -2, yPercent: -46, rotate: 10 }];
  cards.forEach(function (c, i) { gsap.set(c, FAN[i]); });
  gsap.timeline({ delay: 0.1 })
    .from(".nav", { y: -40, autoAlpha: 0, duration: 0.9 })
    .from(".back-link", { x: -20, autoAlpha: 0, duration: 0.6 }, "-=0.5")
    .from(".c-hero .pill-dark", { y: 20, autoAlpha: 0, duration: 0.7 }, "-=0.4")
    .from(heroWords, { yPercent: 115, rotate: 4, duration: 1.1, stagger: 0.06, ease: "expo.out" }, "-=0.4")
    .from(".c-hero .lead, .scroll-cue", { y: 24, autoAlpha: 0, duration: 0.8, stagger: 0.1 }, "-=0.7")
    // las tarjetas llegan apiladas y se abren en abanico
    .from(cards, { y: 260, rotate: 0, xPercent: -50, yPercent: -50, scale: 0.7, autoAlpha: 0, duration: 1.3, stagger: 0.12, ease: "expo.out" }, 0.4)
    .from(".fan-card figcaption", { y: 12, autoAlpha: 0, duration: 0.5, stagger: 0.1 }, "-=0.4");

  // el abanico se abre más al hacer scroll
  gsap.to(".f1", { rotate: -16, xPercent: -110, ease: "none", scrollTrigger: { trigger: ".c-hero", start: "top top", end: "bottom top", scrub: 1 } });
  gsap.to(".f3", { rotate: 16, xPercent: 10, ease: "none", scrollTrigger: { trigger: ".c-hero", start: "top top", end: "bottom top", scrub: 1 } });
  gsap.to(".f2", { yPercent: -62, scale: 1.06, ease: "none", scrollTrigger: { trigger: ".c-hero", start: "top top", end: "bottom top", scrub: 1 } });

  /* ---------- Fondo ---------- */
  gsap.utils.toArray(".blob").forEach(function (b) {
    var depth = parseFloat(b.dataset.depth) || 1;
    gsap.to(b, { yPercent: -22 * depth, ease: "none", scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: 1 } });
  });

  /* ---------- Manifiesto: el texto se "llena" al leer ---------- */
  var scrubWords = splitWords(document.querySelector(".scrub"));
  gsap.fromTo(scrubWords, { opacity: 0.12 }, {
    opacity: 1, ease: "none", stagger: 0.1,
    scrollTrigger: { trigger: ".scrub", start: "top 80%", end: "bottom 45%", scrub: 1 }
  });
  gsap.from(".manifesto .label, .manifesto-sub", { y: 24, autoAlpha: 0, duration: 0.8, stagger: 0.2, scrollTrigger: { trigger: ".manifesto", start: "top 80%" } });

  /* ---------- Historias ---------- */
  var tint = document.querySelector(".tint");
  gsap.utils.toArray(".story").forEach(function (story, idx) {
    var photo = story.querySelector(".photo");
    var img = photo.querySelector("img");
    var name = story.querySelector(".s-name");
    var chars = splitChars(name);

    // el fondo toma el color de cada historia
    ScrollTrigger.create({
      trigger: story, start: "top 55%", end: "bottom 45%",
      onToggle: function (self) { if (self.isActive) gsap.to(tint, { backgroundColor: story.dataset.tint, duration: 0.8, ease: "power2.out" }); },
      onLeaveBack: function () { if (idx === 0) gsap.to(tint, { backgroundColor: "rgba(0,0,0,0)", duration: 0.8 }); }
    });

    // foto: se revela como una cortina y hace parallax
    gsap.fromTo(photo, { clipPath: "inset(100% 0% 0% 0% round 30px)" }, {
      clipPath: "inset(0% 0% 0% 0% round 30px)", duration: 1.4, ease: "expo.inOut",
      scrollTrigger: { trigger: story, start: "top 75%" }
    });
    gsap.fromTo(img, { scale: 1.35 }, { scale: 1, duration: 1.8, ease: "expo.out", scrollTrigger: { trigger: story, start: "top 75%" } });
    gsap.fromTo(img, { yPercent: 0 }, { yPercent: -12, ease: "none", scrollTrigger: { trigger: story, start: "top bottom", end: "bottom top", scrub: true } });
    gsap.from(photo.querySelectorAll(".ph-tag, .ph-num"), { y: 20, autoAlpha: 0, duration: 0.8, stagger: 0.15, delay: 0.8, scrollTrigger: { trigger: story, start: "top 75%" } });

    // nombre letra por letra
    gsap.from(chars, { yPercent: 110, rotate: 12, autoAlpha: 0, duration: 1, stagger: 0.04, ease: "expo.out", scrollTrigger: { trigger: name, start: "top 88%" } });

    // contenido en cascada
    var parts = story.querySelectorAll(".s-kicker, .s-handle, .s-tag, .s-block, .s-stats > div, .growth, .s-quote");
    gsap.from(parts, { y: 40, autoAlpha: 0, duration: 0.9, stagger: 0.09, scrollTrigger: { trigger: story.querySelector(".story-body"), start: "top 80%" } });

    // contadores y barras de crecimiento
    ScrollTrigger.create({
      trigger: story.querySelector(".s-stats"), start: "top 85%", once: true,
      onEnter: function () {
        story.querySelectorAll(".s-stats .num").forEach(function (el) {
          var o = { v: 0 }, to = parseFloat(el.dataset.to);
          gsap.to(o, { v: to, duration: 1.8, ease: "power2.out", onUpdate: function () { el.textContent = fmt(o.v, el); } });
        });
      }
    });
    ScrollTrigger.create({
      trigger: story.querySelector(".growth"), start: "top 85%", once: true,
      onEnter: function () {
        var bars = story.querySelectorAll(".g-bar");
        gsap.fromTo(bars, { scaleX: 0 }, { scaleX: 1, duration: 1.6, stagger: 0.35, ease: "power3.inOut" });
        story.querySelectorAll(".growth .num").forEach(function (el, i) {
          var o = { v: 0 }, to = parseFloat(el.dataset.to);
          gsap.to(o, { v: to, duration: 1.6, delay: i * 0.35, ease: "power3.inOut", onUpdate: function () { el.textContent = fmt(o.v, el); } });
        });
        gsap.from(story.querySelector(".g-x"), { scale: 0, rotate: -30, duration: 0.8, delay: 1.4, ease: "back.out(3)" });
      }
    });
  });

  // al salir de la última historia, el fondo vuelve a su color
  ScrollTrigger.create({ trigger: ".path", start: "top 60%", onEnter: function () { gsap.to(tint, { backgroundColor: "rgba(0,0,0,0)", duration: 0.8 }); } });

  /* ---------- Camino ---------- */
  document.querySelectorAll(".path .split, .turn .split, .footer .split").forEach(function (el) {
    var ws = splitWords(el);
    gsap.from(ws, { yPercent: 115, rotate: 3, duration: 1, stagger: 0.05, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 88%" } });
  });
  gsap.from(".pstep", { y: 60, autoAlpha: 0, duration: 1, stagger: 0.15, ease: "expo.out", scrollTrigger: { trigger: ".path-steps", start: "top 85%" } });
  gsap.fromTo(".path-line span", { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: ".path-steps", start: "top 85%", end: "top 45%", scrub: 1 } });
  gsap.from(".disclaimer", { autoAlpha: 0, duration: 1, scrollTrigger: { trigger: ".disclaimer", start: "top 95%" } });

  /* ---------- Tu turno ---------- */
  gsap.from(".turn-card", { y: 80, scale: 0.94, autoAlpha: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: ".turn", start: "top 85%" } });
  gsap.from(".turn-card .vip-tag, .turn-card p, .turn-ctas .btn", { y: 24, autoAlpha: 0, duration: 0.8, stagger: 0.12, delay: 0.3, scrollTrigger: { trigger: ".turn", start: "top 80%" } });
  gsap.from(".footer img", { scale: 0.5, rotate: -20, autoAlpha: 0, duration: 1.2, ease: "elastic.out(1, .6)", scrollTrigger: { trigger: ".footer", start: "top 85%" } });

  /* ---------- Interacción con el mouse (escritorio) ---------- */
  if (finePointer) {
    var fan = document.querySelector(".fan");
    var rx = gsap.quickTo(fan, "rotateX", { duration: 0.9, ease: "power3" });
    var ry = gsap.quickTo(fan, "rotateY", { duration: 0.9, ease: "power3" });
    gsap.set(fan, { transformStyle: "preserve-3d" });
    var blobs = gsap.utils.toArray(".blob").map(function (b) {
      return { d: parseFloat(b.dataset.depth) || 1, x: gsap.quickTo(b, "x", { duration: 1.6, ease: "power3" }), y: gsap.quickTo(b, "y", { duration: 1.6, ease: "power3" }) };
    });
    window.addEventListener("pointermove", function (e) {
      var nx = e.clientX / window.innerWidth - 0.5, ny = e.clientY / window.innerHeight - 0.5;
      rx(-ny * 12); ry(nx * 16);
      blobs.forEach(function (b) { b.x(nx * 50 * b.d); b.y(ny * 50 * b.d); });
    });
    // las fotos del abanico se levantan al pasar el mouse
    cards.forEach(function (c) {
      c.addEventListener("pointerenter", function () { gsap.to(c, { y: -18, scale: 1.04, zIndex: 5, duration: 0.5, ease: "power3.out" }); });
      c.addEventListener("pointerleave", function () { gsap.to(c, { y: 0, scale: 1, zIndex: "", duration: 0.6, ease: "power3.out" }); });
    });
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
  }
})();
