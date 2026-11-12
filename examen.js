/* R2LAB · Examen final */
(function () {
  "use strict";

  var PASS = 70;          // % mínimo para aprobar
  var MAX_ATTEMPTS = 2;   // intentos por usuario (en este dispositivo)
  var WA_NUMBER = "51998227861";
  var TIME_LIMIT = 4 * 60;  // segundos para todo el examen

  // Preguntas basadas en la guía de normas y en la meta del portal.
  // "a" = índice de la respuesta correcta dentro de "o".
  var QUESTIONS = [
    { t: "Tu meta", q: "¿Cuántos días al mes debes transmitir como mínimo?", o: ["10 días", "15 días", "20 días", "Los que pueda"], a: 1,
      e: "La meta es <b>mínimo 15 días al mes</b>." },
    { t: "Tu meta", q: "¿Cuánto debe durar cada LIVE para que el día cuente?", o: ["30 minutos", "Mínimo 1 hora continua", "2 horas en partes", "No importa la duración"], a: 1,
      e: "Cada día cuenta con <b>mínimo 1 hora de LIVE continua</b>." },
    { t: "Moderación", q: "Un espectador te provoca en el chat. ¿Qué haces?", o: ["Le respondo igual de fuerte", "Lo silencio o bloqueo sin discutir", "Termino el LIVE", "Leo su comentario en voz alta"], a: 1,
      e: "No respondas a provocaciones: <b>silencia o bloquea sin discutir</b>." },
    { t: "Conductas de riesgo", q: "¿Cuál de estas es una conducta de alto riesgo?", o: ["Hacer preguntas al chat", "Transmitir mientras conduces", "Saludar a quien entra", "Agradecer los regalos"], a: 1,
      e: "<b>Nunca transmitas manejando</b>: tu seguridad y la de otros va primero." },
    { t: "Vocabulario", q: "¿Cuál es una forma respetuosa de mostrar desacuerdo?", o: ["«No estoy de acuerdo»", "Un apodo despectivo", "Un insulto «suave»", "Burlarte en grupo"], a: 0,
      e: "Puedes ser auténtico sin insultar: <b>«No estoy de acuerdo»</b> funciona." },
    { t: "Imagen y dinámica", q: "¿Puedes condicionar tu LIVE a recibir likes o toques?", o: ["Sí, siempre", "No, conversa y haz preguntas", "Solo al inicio", "Solo con seguidores nuevos"], a: 1,
      e: "No pidas likes ni toques. <b>Mejor conversa y haz preguntas</b>." },
    { t: "Conductas de riesgo", q: "Mostrar una imagen fija o un video en bucle durante tu LIVE es…", o: ["Recomendado para descansar", "Contenido estático que debes evitar", "Obligatorio", "Indiferente"], a: 1,
      e: "Es <b>contenido estático</b>: tu LIVE debe ser en vivo e interactivo." },
    { t: "Moderación", q: "¿Qué conviene hacer antes de empezar tu LIVE?", o: ["Desactivar los comentarios", "Activar el filtro de palabras y elegir moderadores", "Pedir regalos de bienvenida", "Nada, se improvisa"], a: 1,
      e: "Prepara el terreno: <b>filtro de palabras clave y moderadores de confianza</b>." },
    { t: "Temas sensibles", q: "Si alguien de tu comunidad habla de hacerse daño, ¿qué haces?", o: ["Lo ignoro", "Cambio de tema sin decir nada", "Lo invito a buscar apoyo profesional", "Hago una broma para aliviar"], a: 2,
      e: "Con cuidado y respeto: <b>invítalo a buscar apoyo profesional</b>." },
    { t: "Consecuencias", q: "¿Qué puede pasar si infringes las normas de forma grave?", o: ["Nada", "Ganas más alcance", "Perder la monetización o la suspensión de tu cuenta", "Solo te llega un aviso"], a: 2,
      e: "Las sanciones pueden llegar a <b>perder la monetización o suspender tu cuenta</b>." }
  ];

  var root = document.documentElement;
  var hasGsap = !!window.gsap && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (id) { return document.getElementById(id); };

  /* ---------- Intentos guardados en este dispositivo ---------- */
  function keyFor(user, mail) { return "r2lab-examen:" + user.toLowerCase() + "|" + mail.toLowerCase(); }
  function load(k) { try { return JSON.parse(localStorage.getItem(k)) || { attempts: 0, best: 0, history: [] }; } catch (e) { return { attempts: 0, best: 0, history: [] }; } }
  function save(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* sin almacenamiento */ } }

  /* ---------- Cambio de pantalla ---------- */
  var current = $("s-intro");
  function show(next) {
    if (next === current) return;
    var prev = current; current = next;
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (!hasGsap) { prev.hidden = true; next.hidden = false; return; }
    gsap.to(prev, { autoAlpha: 0, y: -24, duration: 0.35, ease: "power2.in", onComplete: function () {
      prev.hidden = true; gsap.set(prev, { clearProps: "all" });
      next.hidden = false;
      gsap.fromTo(next, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: "expo.out" });
    } });
  }

  /* ---------- Registro ---------- */
  var state = null;
  var form = $("start-form");
  function setErr(id, msg) {
    var e = $(id); e.textContent = msg || "";
    var f = e.closest(".field"); if (f) f.classList.toggle("bad", !!msg);
  }
  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    var user = $("f-user").value.trim().replace(/^@+/, "");
    var mail = $("f-mail").value.trim();
    var ok = true;
    if (!/^[A-Za-z0-9._]{2,30}$/.test(user)) { setErr("e-user", "Escribe tu usuario de TikTok (letras, números, punto o guion bajo)."); ok = false; } else setErr("e-user");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mail)) { setErr("e-mail", "Escribe un correo válido."); ok = false; } else setErr("e-mail");
    if (!$("f-ok").checked) { $("e-ok").textContent = "Marca la casilla para continuar."; ok = false; } else $("e-ok").textContent = "";
    if (!ok) { if (hasGsap) gsap.fromTo(form, { x: -8 }, { x: 0, duration: 0.5, ease: "elastic.out(1, .3)" }); return; }

    var k = keyFor(user, mail);
    var rec = load(k);
    if (rec.attempts >= MAX_ATTEMPTS) { return showBlocked(user, mail, rec); }
    state = { user: user, mail: mail, key: k, rec: rec, i: 0, correct: 0, wrong: [], order: shuffle(QUESTIONS.map(function (_, i) { return i; })) };
    $("q-total").textContent = QUESTIONS.length;
    $("q-user").textContent = "@" + user;
    renderQuestion();
    show($("s-quiz"));
    startTimer();
  });

  /* ---------- Preguntas ---------- */
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  var LETTERS = ["A", "B", "C", "D"];
  function renderQuestion() {
    state.answered = false;
    var Q = QUESTIONS[state.order[state.i]];
    $("q-num").textContent = state.i + 1;
    $("q-bar").style.transform = "scaleX(" + (state.i / QUESTIONS.length) + ")";
    $("q-topic").textContent = Q.t;
    $("q-text").textContent = Q.q;
    $("q-feedback").hidden = true;
    var box = $("q-opts"); box.innerHTML = "";
    shuffle(Q.o.map(function (txt, idx) { return { txt: txt, idx: idx }; })).forEach(function (o, n) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "opt"; b.dataset.idx = o.idx;
      b.innerHTML = '<span class="key">' + LETTERS[n] + '</span><span class="txt"></span>';
      b.querySelector(".txt").textContent = o.txt;
      b.addEventListener("click", function () { answer(b, Q); });
      box.appendChild(b);
    });
    if (hasGsap) {
      gsap.fromTo([$("q-topic"), $("q-text")], { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.08, ease: "expo.out" });
      gsap.fromTo(box.children, { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.06, delay: 0.15, ease: "power3.out" });
    }
  }
  function answer(btn, Q) {
    var chosen = +btn.dataset.idx;
    var right = chosen === Q.a;
    var opts = $("q-opts").querySelectorAll(".opt");
    opts.forEach(function (b) {
      b.disabled = true;
      var idx = +b.dataset.idx;
      if (idx === Q.a) b.classList.add("is-right");
      else if (b === btn) b.classList.add("is-wrong");
      else b.classList.add("dim");
    });
    if (state.done) return;
    state.answered = true;
    if (right) state.correct++; else state.wrong.push({ q: Q.q, a: Q.o[Q.a] });
    $("q-explain").innerHTML = (right ? "<b>¡Correcto!</b> " : "<b>No exactamente.</b> ") + Q.e;
    $("q-next").innerHTML = (state.i === QUESTIONS.length - 1 ? "Ver mi resultado" : "Siguiente") + " <span>→</span>";
    $("q-feedback").hidden = false;
    if (hasGsap) {
      gsap.fromTo(btn, { scale: 0.97 }, { scale: 1, duration: 0.5, ease: "elastic.out(1, .4)" });
      gsap.fromTo($("q-feedback"), { y: 12, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5 });
    }
    $("q-next").focus({ preventScroll: true });
  }
  $("q-next").addEventListener("click", function () {
    state.i++;
    $("q-bar").style.transform = "scaleX(" + (state.i / QUESTIONS.length) + ")";
    if (state.i < QUESTIONS.length) {
      if (hasGsap) gsap.to($("q-card"), { x: -30, autoAlpha: 0, duration: 0.25, ease: "power2.in", onComplete: function () { renderQuestion(); gsap.fromTo($("q-card"), { x: 30, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.45, ease: "expo.out" }); } });
      else renderQuestion();
    } else finish();
  });

  /* ---------- Temporizador (4 minutos para todo el examen) ---------- */
  var timerId = null;
  function fmtTime(s) { s = Math.max(0, Math.ceil(s)); return Math.floor(s / 60) + ":" + ("0" + (s % 60)).slice(-2); }
  function startTimer() {
    stopTimer();
    var el = $("q-timer");
    state.deadline = Date.now() + TIME_LIMIT * 1000;
    el.classList.remove("low"); el.textContent = fmtTime(TIME_LIMIT);
    timerId = setInterval(function () {
      var left = (state.deadline - Date.now()) / 1000;
      el.textContent = fmtTime(left);
      el.classList.toggle("low", left <= 30);
      if (left <= 0) timeUp();
    }, 250);
  }
  function stopTimer() { if (timerId) { clearInterval(timerId); timerId = null; } }
  function timeUp() {
    stopTimer();
    if (state.done) return;
    state.timedOut = true;
    // las preguntas sin responder cuentan como incorrectas
    var from = state.answered ? state.i + 1 : state.i;
    for (var k = from; k < QUESTIONS.length; k++) {
      var Q = QUESTIONS[state.order[k]];
      state.wrong.push({ q: Q.q, a: Q.o[Q.a] });
    }
    finish();
  }

  /* ---------- Resultado ---------- */
  function waLink(text) { return "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(text); }
  function btn(html, href, cls, blank) {
    var a = document.createElement("a"); a.className = "btn " + cls; a.href = href; a.innerHTML = html;
    if (blank) { a.target = "_blank"; a.rel = "noopener"; }
    return a;
  }
  function finish() {
    if (state.done) return;
    state.done = true;
    stopTimer();
    var score = Math.round(state.correct / QUESTIONS.length * 100);
    var passed = score >= PASS;
    var rec = state.rec;
    rec.attempts += 1; rec.best = Math.max(rec.best, score);
    rec.history.push({ score: score, date: new Date().toISOString() });
    save(state.key, rec);
    var left = MAX_ATTEMPTS - rec.attempts;

    var card = document.querySelector("#s-result .result");
    card.classList.toggle("pass", passed);
    $("r-correct").textContent = state.correct + " de " + QUESTIONS.length + " correctas";
    $("r-badge").textContent = passed ? "Aprobado" : "No aprobado";
    $("r-title").textContent = passed ? "¡Felicidades, @" + state.user + "!" : (score >= 50 ? "Casi lo logras" : "Sigue practicando");
    $("r-msg").textContent = (state.timedOut ? "Se acabó el tiempo. " : "") + (passed
      ? "Aprobaste el examen final. Envíanos tu resultado para activar tu acceso a las capacitaciones."
      : rec.best >= PASS ? "Esta vez no alcanzaste el " + PASS + "%, pero ya aprobaste antes con " + rec.best + "%. Envíanos tu resultado."
      : left > 0 ? "Necesitas " + PASS + "% para aprobar. Repasa la guía y vuelve a intentarlo: te queda " + left + " intento."
      : "Necesitas " + PASS + "% para aprobar. Ya usaste tus intentos: escríbenos y te ayudamos.");

    var msg = "Hola R2LAB, terminé el examen final.\nUsuario: @" + state.user + "\nCorreo: " + state.mail + "\nResultado: " + score + "% (" + (passed ? "Aprobado" : "No aprobado") + ")" + (state.timedOut ? " · tiempo agotado" : "") + "\nIntento " + rec.attempts + " de " + MAX_ATTEMPTS + (rec.attempts > 1 ? "\nMejor resultado: " + rec.best + "%" : "");
    var actions = $("r-actions"); actions.innerHTML = "";
    actions.appendChild(btn("Enviar mi resultado por WhatsApp <span>→</span>", waLink(msg), "btn-wa", true));
    if (!passed && left > 0) {
      var retry = document.createElement("button"); retry.type = "button"; retry.className = "btn btn-line"; retry.textContent = "Intentar de nuevo";
      retry.addEventListener("click", function () {
        state = { user: state.user, mail: state.mail, key: state.key, rec: load(state.key), i: 0, correct: 0, wrong: [], order: shuffle(QUESTIONS.map(function (_, i) { return i; })) };
        renderQuestion(); show($("s-quiz")); startTimer();
      });
      actions.appendChild(retry);
      actions.appendChild(btn("Repasar la guía", "normas.html", "btn-line"));
    } else if (!passed) {
      actions.appendChild(btn("Repasar la guía", "normas.html", "btn-line"));
    } else {
      actions.appendChild(btn("Volver al portal", "index.html", "btn-line"));
    }
    $("r-meta").textContent = "Intento " + rec.attempts + " de " + MAX_ATTEMPTS + (rec.attempts > 1 ? " · Mejor resultado: " + rec.best + "%" : "");

    var rl = $("review-list"); rl.innerHTML = "";
    state.wrong.forEach(function (w) {
      var li = document.createElement("li");
      li.innerHTML = "<b></b><span>Respuesta correcta: <em></em></span>";
      li.querySelector("b").textContent = w.q; li.querySelector("em").textContent = w.a;
      rl.appendChild(li);
    });
    $("review").hidden = state.wrong.length === 0;

    show($("s-result"));
    // medidor y contador animados
    var C = 2 * Math.PI * 84, bar = $("r-bar"), out = $("r-score");
    bar.style.strokeDasharray = C; bar.style.strokeDashoffset = C; out.textContent = "0";
    var target = C * (1 - score / 100);
    if (hasGsap) {
      var o = { v: 0 };
      gsap.to(bar, { strokeDashoffset: target, duration: 1.6, delay: 0.5, ease: "power3.inOut" });
      gsap.to(o, { v: score, duration: 1.6, delay: 0.5, ease: "power3.inOut", onUpdate: function () { out.textContent = Math.round(o.v); } });
      gsap.from(".r-copy > *", { y: 20, autoAlpha: 0, duration: 0.6, stagger: 0.08, delay: 0.6 });
      if (passed) confetti();
    } else { bar.style.strokeDashoffset = target; out.textContent = score; }
  }

  function showBlocked(user, mail, rec) {
    $("b-msg").textContent = "Este usuario ya presentó el examen " + MAX_ATTEMPTS + " veces en este dispositivo. Tu mejor resultado fue " + rec.best + "%. Si necesitas ayuda, escríbenos.";
    var msg = "Hola R2LAB, ya usé mis 2 intentos del examen final.\nUsuario: @" + user + "\nCorreo: " + mail + "\nMejor resultado: " + rec.best + "%";
    var a = $("b-actions"); a.innerHTML = "";
    a.appendChild(btn("Escribir por WhatsApp <span>→</span>", waLink(msg), "btn-wa", true));
    a.appendChild(btn("Volver al portal", "index.html", "btn-line"));
    show($("s-blocked"));
  }

  /* ---------- Confeti sutil en los colores de la marca ---------- */
  function confetti() {
    var colors = ["#2FC4A4", "#F0476B", "#B9AEF0", "#F6C76A", "#15151B"];
    var host = document.querySelector("#s-result .result");
    var r = host.getBoundingClientRect();
    for (var i = 0; i < 46; i++) {
      var p = document.createElement("i");
      p.style.cssText = "position:fixed;z-index:120;pointer-events:none;width:8px;height:12px;border-radius:2px;background:" + colors[i % colors.length] + ";left:" + (r.left + r.width / 2) + "px;top:" + (r.top + 120) + "px";
      document.body.appendChild(p);
      gsap.to(p, {
        x: gsap.utils.random(-260, 260), y: gsap.utils.random(-220, 260), rotation: gsap.utils.random(-540, 540),
        opacity: 0, duration: gsap.utils.random(1.2, 2), delay: 1.4 + Math.random() * 0.2, ease: "power2.out",
        onComplete: (function (el) { return function () { el.remove(); }; })(p)
      });
    }
  }

  /* ---------- Entrada de la presentación ---------- */
  if (hasGsap) {
    gsap.from(".nav", { y: -40, autoAlpha: 0, duration: 0.9, ease: "power3.out" });
    gsap.from(".intro-copy > *", { y: 30, autoAlpha: 0, duration: 0.8, stagger: 0.08, ease: "power3.out", delay: 0.1 });
    gsap.from(".facts dd", { y: 20, autoAlpha: 0, duration: 0.7, stagger: 0.08, delay: 0.5, ease: "back.out(2)" });
    gsap.from(".start-form", { y: 50, autoAlpha: 0, duration: 1, delay: 0.3, ease: "expo.out" });
  } else { root.classList.remove("js"); }
})();
