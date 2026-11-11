/* R2LAB · animaciones (GSAP + ScrollTrigger) */
(function () {
  "use strict";

  var root = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(pointer: fine)").matches;

  /* ---------- Calendario: 30 días, 15 marcados ---------- */
  var ON_DAYS = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29];
  var cal = document.getElementById("cal");
  if (cal) {
    for (var d = 1; d <= 30; d++) {
      var c = document.createElement("span");
      c.className = "day" + (ON_DAYS.indexOf(d) > -1 ? " on" : "");
      c.textContent = d;
      cal.appendChild(c);
    }
  }

  /* ---------- Separar títulos en palabras ---------- */
  function splitWords(el) {
    var out = [];
    (function walk(node, parent) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var parts = n.textContent.split(/(\s+)/);
          var frag = document.createDocumentFragment();
          parts.forEach(function (p) {
            if (!p) return;
            if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(p)); return; }
            var w = document.createElement("span"); w.className = "w";
            var i = document.createElement("span"); i.textContent = p;
            w.appendChild(i); frag.appendChild(w); out.push(i);
          });
          node.replaceChild(frag, n);
        } else if (n.nodeType === 1) {
          walk(n);
        }
      });
    })(el);
    return out;
  }

  // Si GSAP no cargó o el usuario prefiere menos movimiento: mostrar todo tal cual.
  if (reduce || !window.gsap || !window.ScrollTrigger) {
    root.classList.remove("js");
    return;
  }

  var gsap = window.gsap;
  gsap.registerPlugin(window.ScrollTrigger);
  gsap.defaults({ ease: "power3.out", duration: 1 });

  var splits = {};
  document.querySelectorAll(".split").forEach(function (el, i) { splits[i] = { el: el, words: splitWords(el) }; });

  /* ---------- Intro del hero ---------- */
  var heroH1 = document.querySelector(".hero h1");
  var heroWords = heroH1.querySelectorAll(".w > span");
  gsap.set("[data-intro], .hero-visual, .hero h1", { visibility: "visible" });

  var intro = gsap.timeline({ delay: 0.15 });
  intro
    .from(".nav", { y: -40, autoAlpha: 0, duration: 0.9 })
    .from(".pill-dark", { y: 20, autoAlpha: 0, duration: 0.7 }, "-=0.5")
    .from(heroWords, { yPercent: 115, rotate: 4, duration: 1.1, stagger: 0.07, ease: "expo.out" }, "-=0.4")
    .from(".lead", { y: 24, autoAlpha: 0, duration: 0.8 }, "-=0.7")
    .from(".ctas .btn", { y: 24, autoAlpha: 0, stagger: 0.08, duration: 0.7 }, "-=0.6")
    .from(".phone", { y: 120, rotateX: 25, rotateY: -12, scale: 0.85, autoAlpha: 0, duration: 1.4, ease: "expo.out" }, 0.35)
    .from(".float-chip", { scale: 0, autoAlpha: 0, stagger: 0.12, duration: 0.8, ease: "back.out(2)" }, "-=0.6")
    .from(".msg", { x: -30, autoAlpha: 0, stagger: 0.25, duration: 0.6 }, "-=0.4");

  // chips flotando
  gsap.utils.toArray(".float-chip").forEach(function (chip, i) {
    gsap.to(chip, { y: i % 2 ? 12 : -12, duration: 2.6 + i * 0.4, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 1.6 });
  });

  // anillos del live
  gsap.to(".ring", { scale: 1.12, opacity: 0.55, duration: 1.8, stagger: 0.3, repeat: -1, yoyo: true, ease: "sine.inOut" });

  /* ---------- Corazones del live ---------- */
  var hearts = document.querySelector(".hearts");
  var EMOJIS = ["💖", "💚", "💜", "🌹", "✨", "💗"];
  function spawnHeart() {
    if (document.hidden) return;
    var h = document.createElement("span");
    h.className = "heart";
    h.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    hearts.appendChild(h);
    var dur = gsap.utils.random(2.2, 3.2);
    gsap.fromTo(h,
      { y: 0, x: 0, scale: 0.4 },
      {
        y: -gsap.utils.random(180, 280), x: gsap.utils.random(-30, 20),
        scale: gsap.utils.random(0.9, 1.3), rotate: gsap.utils.random(-25, 25),
        duration: dur, ease: "sine.out",
        onComplete: function () { h.remove(); }
      });
    gsap.timeline()
      .fromTo(h, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 })
      .to(h, { autoAlpha: 0, duration: 0.6 }, dur - 0.6);
  }
  gsap.delayedCall(1.8, function loop() { spawnHeart(); gsap.delayedCall(gsap.utils.random(0.35, 0.8), loop); });

  // chat que rota
  var CHAT = [
    ["ana", "¡Hola! Qué buen live 💜"], ["leo.mx", "envió una rosa 🌹"], ["sofi", "¡Te sigo desde hoy! ✨"],
    ["marce", "Saludos desde Lima 👋"], ["dani.r", "envió un regalo 🎁"], ["vale", "Me encanta tu energía 💚"]
  ];
  var chatBox = document.querySelector(".ph-chat");
  var chatIdx = 3;
  gsap.delayedCall(4, function rotateChat() {
    var first = chatBox.firstElementChild;
    var next = CHAT[chatIdx++ % CHAT.length];
    var p = document.createElement("p");
    p.className = "msg";
    p.innerHTML = "<b></b>";
    p.firstChild.textContent = next[0];
    p.appendChild(document.createTextNode(" " + next[1]));
    gsap.to(first, { autoAlpha: 0, y: -10, height: 0, marginBottom: -6, paddingTop: 0, paddingBottom: 0, duration: 0.4, onComplete: function () { first.remove(); } });
    chatBox.appendChild(p);
    gsap.from(p, { x: -24, autoAlpha: 0, duration: 0.5 });
    gsap.delayedCall(2.4, rotateChat);
  });

  // espectadores
  var viewers = document.querySelector(".viewers");
  var vObj = { v: 1248 };
  (function tick() {
    gsap.to(vObj, {
      v: vObj.v + gsap.utils.random(-20, 45, 1), duration: 1.2, ease: "none",
      onUpdate: function () { viewers.textContent = Math.round(vObj.v).toLocaleString("es"); },
      onComplete: function () { gsap.delayedCall(0.8, tick); }
    });
  })();

  /* ---------- Parallax de fondo ---------- */
  gsap.utils.toArray(".blob").forEach(function (b) {
    var depth = parseFloat(b.dataset.depth) || 1;
    gsap.to(b, { yPercent: -18 * depth, ease: "none", scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: 1 } });
  });
  gsap.to(".hero-visual", { yPercent: -12, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1 } });

  /* ---------- Interacción con el mouse (solo escritorio) ---------- */
  if (finePointer) {
    var phone = document.querySelector(".phone");
    var rx = gsap.quickTo(phone, "rotateX", { duration: 0.8, ease: "power3" });
    var ry = gsap.quickTo(phone, "rotateY", { duration: 0.8, ease: "power3" });
    var blobs = gsap.utils.toArray(".blob").map(function (b) {
      return { d: parseFloat(b.dataset.depth) || 1, x: gsap.quickTo(b, "x", { duration: 1.6, ease: "power3" }), y: gsap.quickTo(b, "y", { duration: 1.6, ease: "power3" }) };
    });
    window.addEventListener("pointermove", function (e) {
      var nx = e.clientX / window.innerWidth - 0.5;
      var ny = e.clientY / window.innerHeight - 0.5;
      rx(-ny * 14); ry(nx * 18);
      blobs.forEach(function (b) { b.x(nx * 50 * b.d); b.y(ny * 50 * b.d); });
    });

    // botones magnéticos
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

  /* ---------- Títulos de sección ---------- */
  Object.keys(splits).forEach(function (k) {
    var s = splits[k];
    if (s.el === heroH1) return;
    gsap.from(s.words, {
      yPercent: 115, rotate: 3, duration: 1, stagger: 0.06, ease: "expo.out",
      scrollTrigger: { trigger: s.el, start: "top 88%" }
    });
  });
  gsap.utils.toArray(".label").forEach(function (l) {
    gsap.from(l, { x: -20, autoAlpha: 0, duration: 0.8, scrollTrigger: { trigger: l, start: "top 90%" } });
  });

  /* ---------- Marquee: velocidad según scroll ---------- */
  gsap.from(".marquee", { scaleX: 0.6, autoAlpha: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: ".marquee", start: "top 95%" } });

  /* ---------- Contadores ---------- */
  function countUp(el, delay) {
    var to = parseFloat(el.dataset.to);
    var o = { v: 0 };
    el.textContent = "0";
    return gsap.to(o, { v: to, duration: 1.6, delay: delay || 0, ease: "power2.out", onUpdate: function () { el.textContent = Math.round(o.v); } });
  }

  /* ---------- Meta: calendario + stats ---------- */
  var days = gsap.utils.toArray(".day");
  var onDays = gsap.utils.toArray(".day.on");
  gsap.set(onDays, { backgroundColor: "rgba(21,21,27,.04)", color: "#a5a5ae" });
  gsap.from([".cal-card", ".stat"], {
    y: 60, autoAlpha: 0, stagger: 0.12, duration: 1,
    scrollTrigger: { trigger: ".meta-grid", start: "top 82%" }
  });
  ScrollTrigger.create({
    trigger: ".meta-grid", start: "top 70%", once: true,
    onEnter: function () {
      gsap.from(days, { scale: 0.4, autoAlpha: 0, duration: 0.5, stagger: { each: 0.018, from: "start" }, ease: "back.out(2)" });
      gsap.to(onDays, { backgroundColor: "#2FC4A4", color: "#fff", duration: 0.35, stagger: 0.08, delay: 0.5, ease: "power2.out" });
      document.querySelectorAll("#meta .count").forEach(function (c, i) { countUp(c, 0.4 + i * 0.1); });
    }
  });

  /* ---------- Recursos ---------- */
  gsap.from(".res", {
    y: 50, autoAlpha: 0, duration: 0.9, stagger: 0.1,
    scrollTrigger: { trigger: ".res-list", start: "top 85%" }
  });

  /* ---------- Examen: medidor ---------- */
  var bar = document.querySelector(".g-bar");
  var C = 2 * Math.PI * 84;
  gsap.set(bar, { strokeDasharray: C, strokeDashoffset: C });
  gsap.from(".exam", { y: 60, autoAlpha: 0, duration: 1, scrollTrigger: { trigger: ".exam", start: "top 85%" } });
  ScrollTrigger.create({
    trigger: ".gauge", start: "top 80%", once: true,
    onEnter: function () {
      gsap.to(bar, { strokeDashoffset: C * 0.3, duration: 1.8, ease: "power3.inOut" });
      countUp(document.querySelector(".gauge .count"), 0);
    }
  });

  /* ---------- Soporte: chat ---------- */
  gsap.from(".support", { y: 60, autoAlpha: 0, duration: 1, scrollTrigger: { trigger: ".support", start: "top 85%" } });
  gsap.from(".bubble", {
    y: 30, scale: 0.9, autoAlpha: 0, duration: 0.6, stagger: 0.5, ease: "back.out(1.6)",
    scrollTrigger: { trigger: ".bubbles", start: "top 85%" }
  });

  /* ---------- Footer ---------- */
  gsap.from(".footer img", { scale: 0.5, rotate: -20, autoAlpha: 0, duration: 1.2, ease: "elastic.out(1, .6)", scrollTrigger: { trigger: ".footer", start: "top 85%" } });
})();
