/* R2LAB · Manual: tutorial animado "Cómo iniciar un LIVE" */
(function () {
  "use strict";
  var screen = document.querySelector(".gl-screen");
  if (!screen) return;
  var g = window.gsap;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var animated = !!g && !reduce;

  var btns = Array.prototype.slice.call(document.querySelectorAll(".gl-steps button"));
  var cap = document.querySelector(".gl-cap");
  var TITLE = "Hoy respondemos tus preguntas";
  var CAPS = {
    1: "Toca el título y escribe de qué tratará tu LIVE.",
    2: "Toca la portada y elige una foto nítida.",
    3: "Voltea la cámara y ubícala a la altura de tus ojos.",
    4: "Abre Filtros y elige uno natural.",
    5: "En Ajustes, activa comentarios, invitados y micrófono.",
    6: "Pulsa “Emitir LIVE” y saluda a tu comunidad."
  };
  function q(s) { return screen.querySelector(s); }
  var el = {
    t: q(".gl-t"), title: q(".gl-title"), cover: q(".gl-cover"), cam: q(".gl-cam"), person: q(".gl-person"),
    ui: q(".gl-ui"), kbd: q(".gl-kbd"), gal: q(".gl-gal"), fil: q(".gl-filters"), set: q(".gl-settings"),
    flash: q(".gl-flash"), count: q(".gl-count"), room: q(".gl-room"), vw: q(".gl-room .vw"),
    chat: screen.querySelectorAll(".rm-chat span"), gift: q(".rm-gift"), hearts: screen.querySelectorAll(".rm-hearts svg"),
    roomTop: screen.querySelectorAll(".rm-top, .rm-chips, .rm-bar"), finger: q(".gl-finger"),
    go: q(".gl-go"), flip: q(".gl-flip"), filBtn: q(".gl-fil"), setBtn: q(".gl-set"),
    photo: q(".gal-grid .pick"), filPick: q(".fil-row .pick"), ok: q(".kb-row .ok"),
    keys: screen.querySelectorAll(".kb-row i:not(.w2):not(.sp)"), tgs: screen.querySelectorAll(".tg")
  };
  var sheets = [el.kbd, el.gal, el.fil, el.set];

  function mark(n) {
    btns.forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.step == n); });
    screen.querySelectorAll("[data-s]").forEach(function (x) { x.classList.toggle("on", x.dataset.s == n); });
    if (cap) cap.textContent = CAPS[n];
  }

  // estado de la pantalla justo antes del paso n (los anteriores ya hechos)
  function base(n) {
    el.t.textContent = n > 1 ? TITLE : "";
    el.title.classList.remove("typing");
    el.cover.classList.toggle("has-photo", n > 2);
    el.cam.classList.toggle("f-natural", n > 4);
    el.tgs.forEach(function (t) { t.classList.toggle("on", n > 5); });
    el.photo.classList.remove("sel"); el.filPick.classList.remove("sel");
    if (!animated) return;
    g.set(sheets, { yPercent: 105, visibility: "hidden" });
    g.set(el.ui, { autoAlpha: 1 });
    g.set([el.flash, el.count, el.room, el.chat, el.gift, el.hearts, el.finger], { opacity: 0 });
    g.set(el.person, { scaleX: 1, y: 0 });
    el.vw.textContent = "0";
  }

  // ----- sin animación: solo resaltar el paso -----
  if (!animated) {
    btns.forEach(function (b) { b.addEventListener("click", function () { var n = +b.dataset.step; base(n + 1); mark(n); }); });
    base(1); mark(1);
    return;
  }

  function pos(target) {
    var r = target.getBoundingClientRect(), s = screen.getBoundingClientRect();
    return { x: r.left - s.left + r.width / 2, y: r.top - s.top + r.height / 2 };
  }
  function tap(tl, target) {
    tl.to(el.finger, { x: function () { return pos(target).x; }, y: function () { return pos(target).y; }, opacity: 1, duration: 0.6, ease: "power2.inOut" })
      .to(el.finger, { scale: 0.7, duration: 0.12, ease: "power1.in" })
      .to(el.finger, { scale: 1, duration: 0.22, ease: "back.out(3)" });
    return tl;
  }
  function sheetIn(tl, sh) { return tl.to(sh, { yPercent: 0, visibility: "visible", duration: 0.45, ease: "expo.out" }); }
  function sheetOut(tl, sh) { return tl.to(sh, { yPercent: 105, duration: 0.35, ease: "power2.in" }).set(sh, { visibility: "hidden" }); }
  function fingerOff(tl) { return tl.to(el.finger, { opacity: 0, duration: 0.25 }); }

  var STEPS = {
    1: function (tl) {
      tap(tl, el.title);
      tl.add(function () { el.title.classList.add("typing"); });
      sheetIn(tl, el.kbd);
      fingerOff(tl);
      var o = { n: 0 }, last = -1;
      tl.to(o, { n: TITLE.length, duration: 1.9, ease: "none", onUpdate: function () {
        var k = Math.round(o.n);
        if (k === last) return; last = k;
        el.t.textContent = TITLE.slice(0, k);
        var key = el.keys[Math.floor(Math.random() * el.keys.length)];
        key.classList.add("hit"); setTimeout(function () { key.classList.remove("hit"); }, 120);
      } });
      tap(tl, el.ok);
      tl.add(function () { el.title.classList.remove("typing"); });
      sheetOut(tl, el.kbd);
      fingerOff(tl);
    },
    2: function (tl) {
      tap(tl, el.cover);
      sheetIn(tl, el.gal);
      tap(tl, el.photo);
      tl.add(function () { el.photo.classList.add("sel"); }).to({}, { duration: 0.35 });
      sheetOut(tl, el.gal);
      tl.add(function () { el.cover.classList.add("has-photo"); });
      tl.fromTo(el.cover, { scale: 0.6 }, { scale: 1, duration: 0.5, ease: "back.out(2)", immediateRender: false }, "<");
      fingerOff(tl);
    },
    3: function (tl) {
      tap(tl, el.flip);
      tl.to(el.flash, { opacity: 0.85, duration: 0.12 })
        .to(el.person, { scaleX: -1, duration: 0.2 }, "<")
        .to(el.person, { scaleX: 1, duration: 0.2 })
        .to(el.flash, { opacity: 0, duration: 0.35 }, "<");
      fingerOff(tl);
      tl.fromTo(el.person, { y: 40 }, { y: 0, duration: 0.9, ease: "power2.inOut" });
    },
    4: function (tl) {
      tap(tl, el.filBtn);
      sheetIn(tl, el.fil);
      tap(tl, el.filPick);
      tl.add(function () { el.filPick.classList.add("sel"); el.cam.classList.add("f-natural"); }).to({}, { duration: 0.6 });
      sheetOut(tl, el.fil);
      fingerOff(tl);
    },
    5: function (tl) {
      tap(tl, el.setBtn);
      sheetIn(tl, el.set);
      Array.prototype.forEach.call(el.tgs, function (t) {
        tap(tl, t);
        tl.add(function () { t.classList.add("on"); });
      });
      tl.to({}, { duration: 0.4 });
      sheetOut(tl, el.set);
      fingerOff(tl);
    },
    6: function (tl) {
      tap(tl, el.go);
      fingerOff(tl);
      tl.to(el.ui, { autoAlpha: 0, duration: 0.3 });
      ["3", "2", "1"].forEach(function (n) {
        tl.add(function () { el.count.textContent = n; })
          .fromTo(el.count, { opacity: 0, scale: 1.6 }, { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(2)" })
          .to(el.count, { opacity: 0, duration: 0.25, delay: 0.3 });
      });
      // sala de TikTok LIVE
      tl.set(el.room, { opacity: 1 })
        .from(el.roomTop, { opacity: 0, y: function (i) { return i === 2 ? 20 : -14; }, duration: 0.45, stagger: 0.08 });
      var v = { n: 0 };
      tl.to(v, { n: 128, duration: 1.6, ease: "power2.out", onUpdate: function () { el.vw.textContent = Math.round(v.n); } }, "<");
      tl.fromTo(el.chat, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.55 }, "<0.3");
      tl.fromTo(el.gift, { opacity: 0, x: -120 }, { opacity: 1, x: 0, duration: 0.5, ease: "back.out(1.6)" }, "-=0.6");
      Array.prototype.forEach.call(el.hearts, function (h, i) {
        tl.fromTo(h, { opacity: 0, y: 0, x: 0, scale: 0.6, rotate: 0 },
          { keyframes: [{ opacity: 1, scale: 1, duration: 0.2 }, { y: -170 - Math.random() * 60, x: (Math.random() - 0.5) * 50, rotate: (Math.random() - 0.5) * 40, opacity: 0, duration: 1.6, ease: "power1.out" }] },
          (i === 0 ? "<" : "<0.18"));
      });
    }
  };

  var tl = null, visible = true, run = 0, next = null;
  function play(n) {
    if (tl) tl.kill();
    if (next) next.kill();
    var id = ++run;
    base(n); mark(n);
    tl = g.timeline({ delay: 0.3, paused: !visible, onComplete: function () {
      next = g.delayedCall(n === 6 ? 2.4 : 1, function () { if (id === run) play(n % 6 + 1); });
    } });
    STEPS[n](tl);
  }
  btns.forEach(function (b) {
    b.addEventListener("click", function () {
      play(+b.dataset.step);
      // en celular el teléfono queda arriba: lo traemos a la vista para ver el paso
      var r = screen.getBoundingClientRect();
      if (r.top < 0 || r.bottom > window.innerHeight) screen.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  });

  // solo corre cuando el celular está en pantalla
  if ("IntersectionObserver" in window) {
    visible = false;
    new IntersectionObserver(function (en) {
      visible = en[0].isIntersecting;
      if (tl) { if (visible) tl.play(); else tl.pause(); }
    }, { threshold: 0.35 }).observe(screen);
  }
  play(1);
})();
