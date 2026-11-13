/* R2LAB · Manual: tutorial animado "Cómo iniciar un LIVE" */
(function () {
  "use strict";
  /* ---------- Checklist rápido ---------- */
  var qcItems = Array.prototype.slice.call(document.querySelectorAll(".qc-item"));
  if (qcItems.length) {
    var qcN = document.querySelector(".qc-n"), qcBar = document.querySelector(".qc-bar"), qcDone = document.querySelector(".qc-done");
    var qcUpdate = function () {
      var n = qcItems.filter(function (b) { return b.getAttribute("aria-pressed") === "true"; }).length;
      qcN.textContent = n + "/" + qcItems.length;
      qcBar.style.strokeDashoffset = 100.53 * (1 - n / qcItems.length);
      qcDone.textContent = n === qcItems.length ? "¡Listo para salir en vivo!" : "";
    };
    qcItems.forEach(function (b) {
      b.addEventListener("click", function () { b.setAttribute("aria-pressed", b.getAttribute("aria-pressed") === "true" ? "false" : "true"); qcUpdate(); });
    });
  }

  var screen = document.querySelector("#inicio .gl-screen");
  if (!screen) return;
  var g = window.gsap;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var animated = !!g && !reduce;

  var btns = Array.prototype.slice.call(document.querySelectorAll("#inicio .gl-steps button"));
  var cap = document.querySelector("#inicio .gl-cap");
  var TITLE = "Hoy respondemos tus preguntas";
  var CAPS = {
    1: "Toca “Agrega un título” y escribe de qué tratará tu LIVE.",
    2: "Toca tu foto junto al título y elige una portada nítida.",
    3: "Toca “Girar” y ubica la cámara a la altura de tus ojos.",
    4: "Toca “Mejorar” y elige un look natural.",
    5: "En Ajustes, activa comentarios, invitados y micrófono.",
    6: "Pulsa “Iniciar LIVE” y saluda a tu comunidad."
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

/* R2LAB · Manual: comunidad en un LIVE (Quiéreme, Campanita, Bienvenida, Rutina) */
(function () {
  "use strict";
  var scr = document.querySelector(".cm-screen");
  var g = window.gsap;
  if (!scr || !g || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  function q(x) { return scr.querySelector(x); }
  var btns = Array.prototype.slice.call(document.querySelectorAll(".cm-tiles button"));
  var cap = document.querySelector(".cm-cap");
  var CAPS = {
    1: "Invita con naturalidad a dejar su Quiéreme y agradece cada apoyo.",
    2: "Pide que te sigan y activen la campanita para enterarse de tu próximo LIVE.",
    3: "Saluda a quien llega y pregunta desde dónde se conecta.",
    4: "Fija tu horario y cúmplelo: así tu comunidad sabe cuándo volver."
  };
  var el = {
    chat: q(".cm-chat"), bar: q(".cg-bar i"), n: q(".cg-n"), goal: q(".cm-goal"), pop: q(".cm-pop"),
    follow: q(".cm-follow"), fbtn: q(".cf-btn"), bell: q(".cf-bell"), fsub: q(".cf-sub"), pin: q(".cm-pin"),
    hearts: scr.querySelectorAll(".rm-hearts svg"), finger: q(".gl-finger"), like: q(".rm-bar .lk")
  };
  var AV = ["a1", "a2", "a3"];
  function msg(tl, who, text, opt) {
    opt = opt || {};
    tl.add(function () {
      var sp = document.createElement("span");
      if (opt.host) sp.className = "host";
      sp.innerHTML = '<i class="av ' + (opt.host ? "a0" : AV[who.length % 3]) + '"></i>' + (opt.host ? "<em>HOST</em>" : "") + "<b></b> ";
      sp.querySelector("b").textContent = who;
      sp.appendChild(document.createTextNode(text));
      el.chat.appendChild(sp);
      while (el.chat.children.length > 4) el.chat.removeChild(el.chat.firstChild);
      g.from(sp, { opacity: 0, y: 12, duration: 0.35 });
    });
    tl.to({}, { duration: opt.wait || 0.8 });
  }
  function pos(t) { var r = t.getBoundingClientRect(), s = scr.getBoundingClientRect(); return { x: r.left - s.left + r.width / 2, y: r.top - s.top + r.height / 2 }; }
  function tap(tl, t) {
    tl.to(el.finger, { x: function () { return pos(t).x; }, y: function () { return pos(t).y; }, opacity: 1, duration: 0.55, ease: "power2.inOut" })
      .to(el.finger, { scale: 0.7, duration: 0.12 }).to(el.finger, { scale: 1, duration: 0.2, ease: "back.out(3)" });
  }
  function hearts(tl, at) {
    Array.prototype.forEach.call(el.hearts, function (h, i) {
      tl.fromTo(h, { opacity: 0, y: 0, x: 0, scale: 0.6 }, { keyframes: [{ opacity: 1, scale: 1, duration: 0.2 }, { y: -170 - Math.random() * 60, x: (Math.random() - 0.5) * 50, rotate: (Math.random() - 0.5) * 40, opacity: 0, duration: 1.5, ease: "power1.out" }] }, i === 0 ? at : "<0.15");
    });
  }
  function setGoal(v) { el.bar.style.width = (v / 50 * 100) + "%"; el.n.textContent = Math.round(v) + "/50"; }
  function base() {
    el.chat.innerHTML = "";
    setGoal(32);
    el.fbtn.textContent = "Seguir"; el.fbtn.classList.remove("done");
    el.bell.classList.remove("on"); el.fsub.textContent = "Síguenos para no perderte nada";
    g.set([el.pop, el.follow, el.pin, el.finger, el.hearts], { opacity: 0 });
    g.set(el.goal, { scale: 1 });
  }
  function mark(k) {
    btns.forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.k == k); });
    if (cap) cap.textContent = CAPS[k];
  }
  var STEPS = {
    1: function (tl) {
      msg(tl, "sofi.rx", "¡Hola a todos!", { wait: 0.5 });
      msg(tl, "tu.usuario", "Si te gusta el LIVE, deja tu Quiéreme", { host: true, wait: 0.6 });
      tap(tl, el.like);
      tl.to(el.finger, { opacity: 0, duration: 0.2 });
      tl.fromTo(el.pop, { opacity: 0, y: 20, scale: 0.6 }, { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "back.out(2)" });
      hearts(tl, "<");
      var o = { v: 32 };
      tl.to(o, { v: 50, duration: 1.4, ease: "power2.out", onUpdate: function () { setGoal(o.v); } }, "<");
      tl.to(el.goal, { scale: 1.06, duration: 0.2, yoyo: true, repeat: 1 });
      tl.to(el.pop, { opacity: 0, y: -20, duration: 0.4 }, "-=0.2");
      msg(tl, "tu.usuario", "¡Meta cumplida! Gracias, sofi", { host: true, wait: 1.2 });
    },
    2: function (tl) {
      msg(tl, "tu.usuario", "Síguenos y activa la campanita", { host: true, wait: 0.5 });
      tl.fromTo(el.follow, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.45, ease: "back.out(1.6)" });
      tap(tl, el.fbtn);
      tl.add(function () { el.fbtn.textContent = "Siguiendo"; el.fbtn.classList.add("done"); });
      tl.to({}, { duration: 0.3 });
      tap(tl, el.bell);
      tl.add(function () { el.bell.classList.add("on"); el.fsub.textContent = "Notificaciones activadas"; });
      tl.fromTo(el.bell, { rotate: -18 }, { rotate: 0, duration: 0.6, ease: "elastic.out(1.2, .3)" });
      tl.to(el.finger, { opacity: 0, duration: 0.2 });
      msg(tl, "marco_22", "¡Listo, campanita activada!", { wait: 1.2 });
      tl.to(el.follow, { opacity: 0, y: 20, duration: 0.35 });
    },
    3: function (tl) {
      msg(tl, "ana.live", "se unió", { wait: 0.6 });
      msg(tl, "tu.usuario", "¡Bienvenida, ana! ¿Desde dónde te conectas?", { host: true, wait: 1 });
      msg(tl, "ana.live", "Desde Quito", { wait: 0.7 });
      msg(tl, "marco_22", "Yo desde Lima", { wait: 0.7 });
      msg(tl, "tu.usuario", "¡Qué bonito! Saludos a Quito y Lima", { host: true, wait: 1.2 });
    },
    4: function (tl) {
      msg(tl, "tu.usuario", "Mañana a la misma hora, ¡no falten!", { host: true, wait: 0.5 });
      tl.fromTo(el.pin, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.5, ease: "back.out(1.6)" });
      msg(tl, "sofi.rx", "¡Aquí estaré!", { wait: 0.7 });
      msg(tl, "ana.live", "Ya lo tengo en mi agenda", { wait: 1.4 });
    }
  };
  var tl = null, next = null, run = 0, visible = true;
  function play(k) {
    if (tl) tl.kill(); if (next) next.kill();
    var id = ++run;
    base(); mark(k);
    tl = g.timeline({ delay: 0.3, paused: !visible, onComplete: function () { next = g.delayedCall(1.2, function () { if (id === run) play(k % 4 + 1); }); } });
    STEPS[k](tl);
  }
  btns.forEach(function (b) {
    b.addEventListener("click", function () {
      play(+b.dataset.k);
      var r = scr.getBoundingClientRect();
      if (r.top < 0 || r.bottom > window.innerHeight) scr.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  });
  if ("IntersectionObserver" in window) {
    visible = false;
    new IntersectionObserver(function (en) { visible = en[0].isIntersecting; if (tl) { if (visible) tl.play(); else tl.pause(); } }, { threshold: 0.35 }).observe(scr);
  }
  play(1);
})();

/* R2LAB · Manual: juego "¿Qué haría tu moderador?" */
(function () {
  "use strict";
  var game = document.querySelector(".mod-game");
  if (!game) return;
  var g = window.gsap;
  var Q = [
    { who: "ana.live", av: "a1", text: "se unió al LIVE", a: "hola", ok: "¡Bien! Saludar a quien llega hace que se quede.", no: "Aquí tocaba dar la bienvenida: es alguien nuevo." },
    { who: "promo_777", av: "a3", text: "Gana dinero fácil, escríbeme al privado", a: "ocultar", ok: "¡Exacto! Es spam: se oculta y se filtra la palabra.", no: "Es spam: lo correcto es ocultarlo." },
    { who: "troll_99", av: "a2", text: "Eres lo peor, ****** (insulto)", a: "silenciar", ok: "¡Correcto! Se silencia sin discutir en vivo.", no: "Es un insulto: se silencia, sin responderle." },
    { who: "sofi.rx", av: "a1", text: "Me siento muy mal hoy, ¿alguien me ayuda?", a: "avisar", ok: "¡Muy bien! Es delicado: el host debe enterarse.", no: "Es un tema delicado: hay que avisar al host." }
  ];
  var i = 0, score = 0, locked = false;
  var el = {
    i: game.querySelector(".mg-i"), score: game.querySelector(".mg-score b"), msg: game.querySelector(".mg-msg"),
    av: game.querySelector(".mg-msg .av"), who: game.querySelector(".mg-who"), text: game.querySelector(".mg-text"),
    feed: game.querySelector(".mg-feed"), btns: Array.prototype.slice.call(game.querySelectorAll(".mg-actions button")),
    end: game.querySelector(".mg-end"), final: game.querySelector(".mg-final"), again: game.querySelector(".mg-again"),
    stage: game.querySelector(".mg-stage"), acts: game.querySelector(".mg-actions"), top: game.querySelector(".mg-top")
  };
  function show() {
    var q = Q[i];
    el.i.textContent = i + 1;
    el.av.className = "av " + q.av; el.who.textContent = q.who; el.text.textContent = q.text;
    el.msg.className = "mg-msg"; el.feed.textContent = ""; el.feed.className = "mg-feed";
    el.btns.forEach(function (b) { b.className = ""; b.disabled = false; });
    locked = false;
    if (g) g.fromTo(el.msg, { y: 24, opacity: 0, scale: 0.96 }, { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.6)" });
  }
  function pick(b) {
    if (locked) return; locked = true;
    var q = Q[i], right = b.dataset.a === q.a;
    if (right) score++;
    el.score.textContent = score;
    el.btns.forEach(function (x) { x.disabled = true; if (x.dataset.a === q.a) x.className = "right"; });
    if (!right) b.className = "wrong";
    el.msg.className = "mg-msg " + (q.a === "hola" ? "is-hola" : q.a === "avisar" ? "is-avisar" : "is-hidden");
    el.feed.textContent = right ? q.ok : q.no;
    el.feed.className = "mg-feed " + (right ? "good" : "bad");
    if (g) g.fromTo(el.feed, { y: 8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35 });
    setTimeout(function () {
      i++;
      if (i < Q.length) show(); else finish();
    }, 2200);
  }
  function finish() {
    el.stage.hidden = true; el.acts.hidden = true; el.feed.textContent = ""; el.top.hidden = true;
    el.final.textContent = score + " de " + Q.length + (score === Q.length ? " · ¡Eres un gran moderador!" : " · ¡Sigue practicando!");
    el.end.hidden = false;
    if (g) g.from(el.end, { y: 20, opacity: 0, duration: 0.5 });
  }
  el.btns.forEach(function (b) { b.addEventListener("click", function () { pick(b); }); });
  el.again.addEventListener("click", function () {
    i = 0; score = 0; el.score.textContent = 0;
    el.end.hidden = true; el.stage.hidden = false; el.acts.hidden = false; el.top.hidden = false;
    show();
  });
})();

/* R2LAB · Manual: batalla PK con potenciadores */
(function () {
  "use strict";
  var pk = document.querySelector(".pk");
  if (!pk) return;
  var g = window.gsap;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var chips = Array.prototype.slice.call(document.querySelectorAll(".pw-chip"));
  var infos = Array.prototype.slice.call(document.querySelectorAll(".pw-info"));
  function q(x) { return pk.querySelector(x); }
  var el = { me: q(".pk-me"), sme: q(".pk-sme"), sthem: q(".pk-sthem"), t: q(".pk-t"), plus: q(".pk-plus"),
    mybadge: q(".pk-mybadge"), rbadge: q(".pk-rbadge"), gifts: q(".pk-gifts"), pop: q(".pk-pop"), popImg: q(".pk-pop img"), clouds: q(".pk-clouds") };
  function info(p) {
    chips.forEach(function (c) { c.setAttribute("aria-pressed", c.dataset.p === p); });
    infos.forEach(function (x) { x.hidden = x.dataset.p !== p; });
  }
  if (!g || reduce) {
    chips.forEach(function (c) { c.addEventListener("click", function () { info(c.dataset.p); }); });
    info("guante");
    return;
  }
  var me = 1200, them = 1350, time = 60, mult = 1, timers = [];
  function render() {
    el.sme.textContent = me.toLocaleString("es");
    el.sthem.textContent = them.toLocaleString("es");
    el.me.style.width = Math.max(18, Math.min(82, me / (me + them) * 100)) + "%";
    var m = Math.floor(time / 60), s = time % 60;
    el.t.textContent = m + ":" + (s < 10 ? "0" : "") + s;
  }
  function giftFx(v) {
    var sp = document.createElement("span");
    sp.textContent = "+" + v;
    if (mult > 1) sp.className = "big";
    sp.style.left = (15 + Math.random() * 60) + "%";
    el.gifts.appendChild(sp);
    g.fromTo(sp, { y: 0, opacity: 0, scale: .6 }, { y: -90 - Math.random() * 40, opacity: 1, scale: 1, duration: 1.1, ease: "power2.out", onComplete: function () { g.to(sp, { opacity: 0, duration: .3, onComplete: function () { sp.remove(); } }); } });
  }
  var visible = true;
  // regalos y reloj
  setInterval(function () {
    if (!visible || document.hidden) return;
    var mine = [1, 5, 10, 20][Math.floor(Math.random() * 4)];
    me += mine * mult; giftFx(mine * mult);
    if (Math.random() < .7) them += [1, 5, 10, 30][Math.floor(Math.random() * 4)];
    render();
  }, 700);
  setInterval(function () {
    if (!visible || document.hidden) return;
    time = time > 1 ? time - 1 : 60;
    if (time === 60) { me = 1200; them = 1350; }
    render();
  }, 1000);
  function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
  function reset() {
    timers.forEach(clearTimeout); timers = [];
    mult = 1; pk.classList.remove("fog");
    g.killTweensOf([el.pop, el.mybadge, el.clouds, el.plus, el.rbadge]);
    g.set([el.pop, el.mybadge, el.clouds, el.plus], { opacity: 0 });
    g.set(el.rbadge, { opacity: 0, rotate: 0, scale: 1 }); el.rbadge.classList.remove("broken");
  }
  function pop(p) {
    el.popImg.src = "img/manual/" + p + ".jpg";
    el.pop.style.left = p === "martillo" ? "75%" : "25%"; // el martillo cae sobre el rival
    g.fromTo(el.pop, { opacity: 0, scale: .3, rotate: -12 }, { opacity: 1, scale: 1, rotate: 0, duration: .5, ease: "back.out(2)" });
    g.to(el.pop, { opacity: 0, scale: .8, duration: .35, delay: 2 });
  }
  function badge(text) {
    el.mybadge.textContent = text;
    g.fromTo(el.mybadge, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: .4, delay: .5 });
  }
  var FX = {
    guante: function () { pop("guante"); badge("×5 · 30 s"); later(function () { mult = 5; }, 500); later(function () { mult = 1; g.to(el.mybadge, { opacity: 0 }); }, 5200); },
    rayo: function () { pop("rayo"); badge("×2"); later(function () { mult = 2; me += 300; render(); giftFx(300); }, 500); later(function () { mult = 1; g.to(el.mybadge, { opacity: 0 }); }, 4200); },
    neblina: function () {
      pop("neblina");
      later(function () { pk.classList.add("fog"); g.fromTo(el.clouds, { opacity: 0 }, { opacity: 1, duration: .6 }); }, 600);
      later(function () { pk.classList.remove("fog"); g.to(el.clouds, { opacity: 0, duration: .6 }); }, 5200);
    },
    martillo: function () {
      g.fromTo(el.rbadge, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: .4 });
      later(function () { pop("martillo"); }, 900);
      later(function () {
        el.rbadge.classList.add("broken");
        g.fromTo(el.rbadge, { rotate: -14, scale: 1.3 }, { rotate: 6, scale: 1, duration: .5, ease: "elastic.out(1, .4)" });
        g.fromTo(pk, { x: -6 }, { x: 0, duration: .5, ease: "elastic.out(1.2, .2)" });
      }, 1500);
      later(function () { g.to(el.rbadge, { opacity: 0 }); }, 4600);
    },
    cronometro: function () {
      pop("cronometro");
      later(function () {
        time += 10; render();
        g.fromTo(el.plus, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: .35 });
        g.to(el.plus, { opacity: 0, duration: .4, delay: 1.6 });
        g.fromTo(q(".pk-timer"), { scale: 1.25 }, { scale: 1, duration: .5, ease: "back.out(2)" });
      }, 700);
    }
  };
  var order = ["guante", "rayo", "neblina", "martillo", "cronometro"], idx = 0, auto = null;
  // pantalla LIVE: aviso del potenciador y chat
  var rl = document.querySelector(".rl"), capT = [];
  var BOOST = { guante: ["×5 puntos de regalo", "30 s"], rayo: ["×2 puntos", "20 s"], neblina: ["Puntaje oculto al rival", "30 s"], martillo: ["Potenciador del rival bloqueado", ""], cronometro: ["+10 s de batalla", ""] };
  var CHAT = {
    guante: [["sofi.rx", "activó Guante 🥊"], ["ana.live", "¡ahora valen ×5!"], ["marco_22", "envió Rosa", "×10"]],
    rayo: [["sofi.rx", "activó Rayo ⚡"], ["luz.v", "¡vamos que se puede!"], ["ana.live", "envió Corona", "×1"]],
    neblina: [["sofi.rx", "activó Neblina ☁️"], ["marco_22", "el rival no ve el puntaje"], ["luz.v", "envió Rosa", "×5"]],
    martillo: [["ana.live", "activó Martillo 🔨"], ["sofi.rx", "¡le quitamos el ×2!"], ["marco_22", "envió Rosa", "×3"]],
    cronometro: [["luz.v", "activó Cronómetro ⏱️"], ["ana.live", "¡+10 segundos!"], ["sofi.rx", "envió Corona", "×2"]]
  };
  function captions(p) {
    if (!rl) return;
    capT.forEach(clearTimeout); capT = [];
    var boost = rl.querySelector(".rl-boost"), chat = rl.querySelector(".rl-chat");
    boost.querySelector("img").src = "img/manual/" + p + ".jpg";
    boost.querySelector(".rl-bd").textContent = BOOST[p][0];
    var bs = boost.querySelector(".rl-bs"); bs.textContent = BOOST[p][1]; bs.hidden = !BOOST[p][1];
    g.fromTo(boost, { opacity: 0, y: 10, scale: .8 }, { opacity: 1, y: 0, scale: 1, duration: .45, ease: "back.out(2)", delay: .5 });
    chat.innerHTML = "";
    CHAT[p].forEach(function (m, i) {
      capT.push(setTimeout(function () {
        var sp = document.createElement("span");
        sp.innerHTML = '<i class="av a' + (i % 3 + 1) + '"></i><b>' + m[0] + "</b> " + m[1] + (m[2] ? ' <em>' + m[2] + "</em>" : "");
        chat.appendChild(sp);
        g.fromTo(sp, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .35, ease: "power2.out" });
      }, 700 + i * 1300));
    });
  }
  function run(p) { reset(); info(p); FX[p](); captions(p); idx = order.indexOf(p); }
  function cycle() { clearTimeout(auto); auto = setTimeout(function () { if (visible) run(order[(idx + 1) % order.length]); cycle(); }, 6500); }
  chips.forEach(function (c) { c.addEventListener("click", function () { run(c.dataset.p); cycle(); }); });
  if ("IntersectionObserver" in window) {
    visible = false;
    new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }, { threshold: .3 }).observe(pk);
  }
  render(); run("guante"); cycle();
})();

/* R2LAB · Manual: tutorial "Inicia tu batalla" */
(function () {
  "use strict";
  var scr = document.querySelector(".bt-screen");
  var g = window.gsap;
  if (!scr) return;
  var btns = Array.prototype.slice.call(document.querySelectorAll(".bt-steps button"));
  var cap = document.querySelector(".bt-cap");
  var CAPS = {
    1: "Entra a tu LIVE como siempre.",
    2: "Toca Multi-invitado (el ícono de personas).",
    3: "En Invitaciones rápidas, toca “Invitar” y espera unos segundos.",
    4: "Cuando aparezca la batalla, toca “Aceptar”.",
    5: "¡Listo! Ya estás en tu batalla de TikTok LIVE."
  };
  function mark(n) {
    btns.forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.step == n); });
    if (cap) cap.textContent = CAPS[n];
  }
  if (!g || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    btns.forEach(function (b) { b.addEventListener("click", function () { mark(+b.dataset.step); }); });
    mark(1); return;
  }
  function q(x) { return scr.querySelector(x); }
  var el = { room: q(".bt-room"), multi: q(".bt-multi"), sheet: q(".bt-sheet"), quick: q(".bt-quick"), qbtn: q(".bq-btn"), qs: q(".bq-s"),
    dialog: q(".bt-dialog"), ok: q(".bd-ok"), battle: q(".bt-battle"), me: q(".bb-me"), them: q(".bb-them"), done: q(".bb-done"), finger: q(".gl-finger") };
  function pos(t) { var r = t.getBoundingClientRect(), s = scr.getBoundingClientRect(); return { x: r.left - s.left + r.width / 2, y: r.top - s.top + r.height / 2 }; }
  function tap(tl, t) {
    tl.to(el.finger, { x: function () { return pos(t).x; }, y: function () { return pos(t).y; }, opacity: 1, duration: 0.6, ease: "power2.inOut" })
      .to(el.finger, { scale: 0.7, duration: 0.12 }).to(el.finger, { scale: 1, duration: 0.2, ease: "back.out(3)" });
  }
  function base(n) {
    el.multi.classList.remove("on"); el.quick.classList.remove("waiting"); el.qs.textContent = "15";
    el.me.textContent = "0"; el.them.textContent = "0"; el.me.style.width = "50%";
    g.set(el.sheet, { yPercent: n === 3 ? 0 : 105, visibility: n === 3 ? "visible" : "hidden" });
    g.set(el.dialog, { opacity: n === 4 ? 1 : 0, visibility: n === 4 ? "visible" : "hidden", scale: 1 });
    g.set(el.battle, { opacity: n === 5 ? 1 : 0, visibility: n === 5 ? "visible" : "hidden" });
    g.set([el.finger, el.done], { opacity: 0 });
    g.set(el.room, { opacity: 1 });
  }
  var STEPS = {
    1: function (tl) {
      tl.fromTo(el.room, { opacity: 0 }, { opacity: 1, duration: 0.5 })
        .fromTo(q(".rm-chips .hot"), { scale: 1 }, { scale: 1.25, duration: 0.25, yoyo: true, repeat: 3 })
        .to({}, { duration: 0.8 });
    },
    2: function (tl) {
      tap(tl, el.multi);
      tl.add(function () { el.multi.classList.add("on"); })
        .to(el.sheet, { yPercent: 0, visibility: "visible", duration: 0.5, ease: "expo.out" })
        .to(el.finger, { opacity: 0, duration: 0.2 })
        .to({}, { duration: 1 });
    },
    3: function (tl) {
      tap(tl, el.qbtn);
      tl.add(function () { el.quick.classList.add("waiting"); }).to(el.finger, { opacity: 0, duration: 0.2 });
      var o = { v: 15 };
      tl.to(o, { v: 3, duration: 2.2, ease: "none", onUpdate: function () { el.qs.textContent = Math.round(o.v); } });
    },
    4: function (tl) {
      tl.to(el.sheet, { yPercent: 105, duration: 0.35, ease: "power2.in" }).set(el.sheet, { visibility: "hidden" })
        .fromTo(el.dialog, { opacity: 0, scale: 0.8, visibility: "visible" }, { opacity: 1, scale: 1, duration: 0.45, ease: "back.out(1.8)" })
        .to({}, { duration: 0.9 });
      tap(tl, el.ok);
      tl.to(el.ok, { scale: 0.92, duration: 0.1, yoyo: true, repeat: 1 }).to({}, { duration: 0.4 });
      tl.to(el.dialog, { opacity: 0, scale: 0.9, duration: 0.3 }).set(el.dialog, { visibility: "hidden" }).to(el.finger, { opacity: 0, duration: 0.2 }, "<");
    },
    5: function (tl) {
      tl.fromTo(el.battle, { opacity: 0, visibility: "visible" }, { opacity: 1, duration: 0.5 })
        .fromTo(q(".bb-l"), { xPercent: -100 }, { xPercent: 0, duration: 0.5, ease: "expo.out" }, "<")
        .fromTo(q(".bb-r"), { xPercent: 100 }, { xPercent: 0, duration: 0.5, ease: "expo.out" }, "<");
      var o = { a: 0, b: 0 };
      tl.to(o, { a: 640, b: 420, duration: 2, ease: "power1.out", onUpdate: function () {
        el.me.textContent = Math.round(o.a); el.them.textContent = Math.round(o.b);
        el.me.style.width = (o.a + o.b ? Math.max(20, Math.min(80, o.a / (o.a + o.b) * 100)) : 50) + "%";
      } });
      tl.fromTo(el.done, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(2)" }, "-=1.2")
        .fromTo(q(".bb-trophy"), { rotate: -15 }, { rotate: 0, duration: 0.8, ease: "elastic.out(1.2, .3)" }, "<0.2")
        .to({}, { duration: 1 });
    }
  };
  var tl = null, next = null, run = 0, visible = true;
  function play(n) {
    if (tl) tl.kill(); if (next) next.kill();
    var id = ++run;
    base(n); mark(n);
    tl = g.timeline({ delay: 0.3, paused: !visible, onComplete: function () { next = g.delayedCall(n === 5 ? 2 : 0.6, function () { if (id === run) play(n % 5 + 1); }); } });
    STEPS[n](tl);
  }
  btns.forEach(function (b) {
    b.addEventListener("click", function () {
      play(+b.dataset.step);
      var r = scr.getBoundingClientRect();
      if (r.top < 0 || r.bottom > window.innerHeight) scr.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  });
  if ("IntersectionObserver" in window) {
    visible = false;
    new IntersectionObserver(function (en) { visible = en[0].isIntersecting; if (tl) { if (visible) tl.play(); else tl.pause(); } }, { threshold: 0.35 }).observe(scr);
  }
  play(1);
})();

/* R2LAB · Manual: tutorial de tipos de batalla (1 vs 1, 3, cuarteto, 4 individual) */
(function () {
  "use strict";
  var scr = document.querySelector(".bm-screen");
  if (!scr) return;
  var g = window.gsap;
  var tabs = Array.prototype.slice.call(document.querySelectorAll(".bm-tabs .tab"));
  var panels = Array.prototype.slice.call(document.querySelectorAll(".bm-panel"));
  var cap = document.querySelector(".bm-cap");
  function q(x) { return scr.querySelector(x); }
  function qa(x) { return Array.prototype.slice.call(scr.querySelectorAll(x)); }
  var grid = q(".bm-grid"), tiles = qa(".bm-tile");
  var el = { barA: q(".bb-a"), barB: q(".bb-b"), timer: q(".bm-t"), result: q(".bm-result"), resB: q(".bm-result b"),
    multi: q(".bm-multi"), sheet: q(".bm-sheet"), start: q(".bm-start"), modes: q(".bm-modes"), ind: q(".md-ind"), team: q(".md-team"),
    finger: q(".gl-finger"), lbMe: q(".lb-me"), lbTime: q(".lb-time"), lbBar: q(".lb-bar"),
    spark: q(".bb-spark"), boost: q(".bm-boost"), feed: q(".bm-feed"), hearts: qa(".bm-hearts i") };
  var GIFTS = [["sofi.rx", "a1", "envió Rosa", "×5"], ["marco_22", "a2", "envió Rosa", "×10"], ["ana.live", "a3", "se unió", ""], ["luz.v", "a1", "envió Corona", "×1"], ["kev_77", "a2", "envió Rosa", "×20"]];
  function feedMsg(k) {
    var gi = GIFTS[k % GIFTS.length], sp = document.createElement("span");
    sp.className = gi[2] === "se unió" ? "join" : "";
    sp.innerHTML = '<i class="av ' + gi[1] + '"></i><b></b> ' + gi[2] + (gi[3] ? ' <i class="rose"></i> ' + gi[3] : "");
    sp.querySelector("b").textContent = gi[0];
    el.feed.appendChild(sp);
    while (el.feed.children.length > 3) el.feed.removeChild(el.feed.firstChild);
    g.from(sp, { opacity: 0, x: -16, duration: 0.35 });
  }
  function heartsUp(tl, at) {
    el.hearts.forEach(function (h, i) {
      tl.fromTo(h, { opacity: 0, y: 0, x: 0, scale: 0.6 }, { keyframes: [{ opacity: 1, scale: 1, duration: 0.2 }, { y: -150 - Math.random() * 50, x: (Math.random() - 0.5) * 40, opacity: 0, duration: 1.4, ease: "power1.out" }] }, i === 0 ? at : "<0.22");
    });
  }
  var MODES = ["1", "3", "q", "4"];
  var N = { "1": 2, "3": 3, "q": 4, "4": 4 };
  var LAYOUT = { "1": "1", "3": "3", "q": "4", "4": "4" };
  var FINAL = { "1": [820, 610], "3": [540, 910, 380], "q": [520, 430, 380, 300], "4": [260, 720, 450, 590] };
  var CAPS = {
    "1": ["Abre Multi-invitado y elige el diseño de 2.", "Invita a un creador. Espera a que acepte.", "Toca “Iniciar batalla”.", "Rojo eres tú, azul el rival. El reloj marca el tiempo.", "Cuando termina el tiempo, gana quien sumó más."],
    "3": ["Abre Multi-invitado y elige el diseño de 3.", "Invita a 2 creadores. Cada uno debe aceptar.", "Toca “Iniciar batalla” y elige “Individual”.", "Cada recuadro suma solo los regalos que recibe.", "Al final se ordenan del 1.º al 3.º lugar."],
    "q": ["Abre Multi-invitado y elige el diseño de 4.", "Invita a 3 creadores. Cada uno debe aceptar.", "Toca “Iniciar batalla” y elige “Por equipos”.", "Los de arriba son el equipo rojo y los de abajo el azul: la barra suma a cada equipo.", "Gana el equipo que sumó más puntos."],
    "4": ["Abre Multi-invitado y elige el diseño de 4.", "Invita a 3 creadores. Cada uno debe aceptar.", "Toca “Iniciar batalla” y elige “Individual”.", "No hay equipos: cada uno suma sus propios regalos.", "Al final se ordenan del 1.º al 4.º lugar."]
  };
  function select(m) {
    tabs.forEach(function (t) { var on = t.dataset.mode === m; t.setAttribute("aria-selected", on); t.tabIndex = on ? 0 : -1; });
    panels.forEach(function (p) { p.hidden = p.dataset.mode !== m; });
  }
  function lis(m) { return Array.prototype.slice.call(document.querySelectorAll('.bm-panel[data-mode="' + m + '"] .bm-steps li')); }
  if (!g || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    tabs.forEach(function (t) { t.addEventListener("click", function () { select(t.dataset.mode); grid.dataset.mode = t.dataset.mode; }); });
    grid.dataset.mode = "1"; return;
  }
  function fmt(n) { return Math.round(n).toLocaleString("es"); }
  function pos(t) { var r = t.getBoundingClientRect(), s = scr.getBoundingClientRect(); return { x: r.left - s.left + r.width / 2, y: r.top - s.top + r.height / 2 }; }
  function tap(tl, t) {
    tl.to(el.finger, { x: function () { return pos(t).x; }, y: function () { return pos(t).y; }, opacity: 1, duration: 0.55, ease: "power2.inOut" })
      .to(el.finger, { scale: 0.7, duration: 0.12 }).to(el.finger, { scale: 1, duration: 0.2, ease: "back.out(3)" });
  }
  function hideFinger(tl) { tl.to(el.finger, { opacity: 0, duration: 0.2 }); }
  var cur = "1";
  function step(tl, i) {
    tl.add(function () {
      lis(cur).forEach(function (li, k) { li.classList.toggle("on", k === i); li.classList.toggle("done", k < i); });
      if (cap) cap.textContent = CAPS[cur][i];
    });
  }
  function reset(m) {
    cur = m; select(m);
    grid.dataset.mode = "solo"; scr.classList.add("pre"); scr.classList.remove("no-bar");
    tiles.forEach(function (t) { t.classList.remove("waiting"); t.querySelector(".bm-sc").textContent = "0"; t.querySelector(".bm-rank").textContent = ""; });
    qa(".bs-layouts .lo").forEach(function (x) { x.classList.remove("sel"); });
    qa(".bs-row").forEach(function (r) { var em = r.querySelector("em"); em.textContent = "Invitar"; em.classList.remove("done"); r.classList.toggle("off", +r.dataset.k > N[m]); });
    el.ind.classList.remove("sel"); el.team.classList.remove("sel"); el.multi.classList.remove("on");
    g.set(el.sheet, { yPercent: 105, visibility: "hidden" });
    g.set([el.start, el.modes], { opacity: 0, visibility: "hidden" });
    g.set([el.result, el.finger, el.lbMe, el.lbTime, el.lbBar, el.boost].concat(qa(".bm-rank, .bm-crown"), el.hearts), { opacity: 0 });
    el.feed.innerHTML = ""; el.spark.style.left = "50%";
    g.set(tiles, { opacity: 1, scale: 1 });
    el.barA.textContent = "0"; el.barB.textContent = "0"; el.barA.style.width = "50%"; el.timer.textContent = "1:00";
    lis(m).forEach(function (li) { li.classList.remove("on", "done"); });
  }
  var tl = null, next = null, run = 0, visible = true;
  function play(m) {
    if (tl) tl.kill(); if (next) next.kill();
    var id = ++run;
    reset(m);
    var n = N[m], fin = FINAL[m];
    tl = g.timeline({ delay: 0.3, paused: !visible, onComplete: function () { next = g.delayedCall(2.4, function () { if (id === run) play(MODES[(MODES.indexOf(m) + 1) % MODES.length]); }); } });
    // 1 · Multi-invitado y diseño
    step(tl, 0);
    tap(tl, el.multi);
    tl.add(function () { el.multi.classList.add("on"); })
      .to(el.sheet, { yPercent: 0, visibility: "visible", duration: 0.45, ease: "expo.out" });
    var lo = q('.bs-layouts .lo[data-n="' + LAYOUT[m] + '"]');
    tap(tl, lo);
    tl.add(function () { lo.classList.add("sel"); }).to({}, { duration: 0.6 });
    // 2 · invitar
    step(tl, 1);
    for (var k = 2; k <= n; k++) {
      (function (k) {
        var em = q('.bs-row[data-k="' + k + '"] em');
        tap(tl, em);
        tl.add(function () { em.textContent = "Invitado"; em.classList.add("done"); });
      })(k);
    }
    hideFinger(tl);
    tl.to(el.sheet, { yPercent: 105, duration: 0.35, ease: "power2.in" }).set(el.sheet, { visibility: "hidden" })
      .add(function () {
        grid.dataset.mode = m;
        tiles.forEach(function (t, i) { if (i > 0 && i < n) t.classList.add("waiting"); });
      })
      .to({}, { duration: 0.7 });
    for (var j = 1; j < n; j++) {
      (function (j) {
        tl.add(function () { tiles[j].classList.remove("waiting"); })
          .fromTo(tiles[j], { opacity: 0.4, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(2)" })
          .to({}, { duration: 0.25 });
      })(j);
    }
    // 3 · iniciar batalla
    step(tl, 2);
    tl.fromTo(el.start, { opacity: 0, visibility: "visible", y: 10 }, { opacity: 1, y: 0, duration: 0.35 });
    tap(tl, el.start);
    tl.to(el.start, { opacity: 0, duration: 0.2 }).set(el.start, { visibility: "hidden" });
    if (m !== "1") {
      var opt = m === "q" ? el.team : el.ind;
      tl.fromTo(el.modes, { opacity: 0, scale: 0.85, visibility: "visible" }, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.8)" }).to({}, { duration: 0.4 });
      tap(tl, opt);
      tl.add(function () { opt.classList.add("sel"); }).to({}, { duration: 0.4 })
        .to(el.modes, { opacity: 0, duration: 0.25 }).set(el.modes, { visibility: "hidden" });
    }
    hideFinger(tl);
    tl.add(function () { scr.classList.remove("pre"); scr.classList.toggle("no-bar", m === "3" || m === "4"); });
    // 4 · cómo leer el marcador
    step(tl, 3);
    var o = { p: 0 }, lastFeed = -1;
    tl.to(o, { p: 1, duration: 3.6, ease: "power1.inOut", onUpdate: function () {
      var vals = fin.slice(0, n).map(function (v) { return v * o.p; });
      tiles.forEach(function (t, i) { if (i < n) t.querySelector(".bm-sc").textContent = fmt(vals[i]); });
      var a = m === "q" ? vals[0] + vals[1] : vals[0], b = m === "q" ? vals[2] + vals[3] : (vals[1] || 0);
      el.barA.textContent = fmt(a); el.barB.textContent = fmt(b);
      var pct = (a + b ? Math.max(20, Math.min(80, a / (a + b) * 100)) : 50);
      el.barA.style.width = pct + "%"; el.spark.style.left = pct + "%";
      var sec = Math.round(60 - 58 * o.p); el.timer.textContent = sec >= 60 ? "1:00" : "0:" + (sec < 10 ? "0" : "") + sec;
      var f = Math.floor(o.p * 5); if (f !== lastFeed) { lastFeed = f; if (f < 5) feedMsg(f); }
    } });
    tl.fromTo(el.boost, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.35 }, "<1.2").to(el.boost, { opacity: 0, duration: 0.3 }, "<1.6");
    heartsUp(tl, "<-0.8");
    tl.fromTo(el.lbMe, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.3 }, "<0.3")
      .fromTo(el.lbTime, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.3 }, "<0.6");
    if (m === "1" || m === "q") tl.fromTo(el.lbBar, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.3 }, "<0.6");
    tl.to([el.lbMe, el.lbTime, el.lbBar], { opacity: 0, duration: 0.3 }, ">0.6");
    // 5 · resultado
    step(tl, 4);
    tl.add(function () {
      lis(m).forEach(function (li) { li.classList.remove("on"); li.classList.add("done"); });
      var order = fin.slice(0, n).map(function (v, i) { return { v: v, i: i }; }).sort(function (x, y) { return y.v - x.v; });
      if (m === "q") el.resB.textContent = "¡Gana el equipo rojo!";
      else {
        order.forEach(function (o2, p2) {
          var r = tiles[o2.i].querySelector(".bm-rank");
          r.textContent = n === 2 ? (p2 === 0 ? "WIN" : "") : (p2 + 1) + ".º";
          r.className = "bm-rank" + (p2 === 0 ? " r1" : "");
        });
        el.resB.textContent = n === 2 ? "¡Ganaste la batalla!" : "Gana el 1.º lugar";
        g.to(qa(".bm-rank"), { opacity: function (i, x) { return x.textContent ? 1 : 0; }, duration: 0.4, stagger: 0.08 });
      }
      var w = m === "q" ? [tiles[0], tiles[1]] : [tiles[order[0].i]];
      w.forEach(function (t) { g.fromTo(t.querySelector(".bm-crown"), { opacity: 0, y: -10, scale: 0.5 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(2)" }); });
    });
    tl.fromTo(el.result, { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.45, ease: "back.out(2)" }, "+=0.3")
      .to({}, { duration: 1.6 })
      .to(el.result, { opacity: 0, duration: 0.3 });
  }
  tabs.forEach(function (t) {
    t.addEventListener("click", function () {
      play(t.dataset.mode);
      var r = scr.getBoundingClientRect();
      if (r.top < 0 || r.bottom > window.innerHeight) scr.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  });
  if ("IntersectionObserver" in window) {
    visible = false;
    new IntersectionObserver(function (en) { visible = en[0].isIntersecting; if (tl) { if (visible) tl.play(); else tl.pause(); } }, { threshold: 0.35 }).observe(scr);
  }
  play("1");
})();
