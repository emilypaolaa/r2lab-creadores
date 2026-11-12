/* R2LAB · Examen final */
(function () {
  "use strict";

  var PASS = 70;            // % mínimo para aprobar
  var MAX_ATTEMPTS = 2;     // intentos por usuario (en este dispositivo)
  var WA_NUMBER = "51998227861";
  var TIME_LIMIT = 4 * 60;  // segundos para todo el examen
  var PER_EXAM = 10;        // preguntas por intento (se eligen al azar del banco)

  // Banco de preguntas basado en la guía de normas y en la meta del portal.
  // Situaciones reales con respuestas parecidas: hay que haber leído la guía.
  // "a" = índice de la respuesta correcta dentro de "o".
  var BANK = [
    { t: "Tu meta", q: "Este mes hiciste 14 días de LIVE de 2 horas y 3 días de 40 minutos. ¿Cumpliste la meta?", o: ["Sí, sumas 17 días de LIVE", "No: solo 14 días cumplen la hora continua", "Sí, porque superas las horas totales", "Depende de los diamantes que hiciste"], a: 1 },
    { t: "Tu meta", q: "Un día haces dos LIVE de 35 minutos cada uno. ¿Ese día cuenta para tu meta?", o: ["Sí, suman 70 minutos", "Sí, si el segundo empieza antes de 10 minutos", "No: se necesita 1 hora continua", "Solo si es fin de semana"], a: 2 },
    { t: "Vocabulario", q: "Usas un apodo despectivo que no aparece en la lista de palabras a evitar. ¿Qué pasa?", o: ["Nada, porque no está en la lista", "Solo cuenta si lo repites tres veces", "Puede sancionarse igual: cualquier expresión para ofender cuenta", "Solo se sanciona si lo escribe un espectador"], a: 2 },
    { t: "Vocabulario", q: "¿Cuál de estas frases va contra las normas aunque se diga en broma?", o: ["«¡No lo puedo creer! ¡Qué locura!»", "«Si sigues así, te voy a buscar»", "«No voy a discutir. Sigamos con el LIVE»", "«Aquí venimos a pasarla bien»"], a: 1 },
    { t: "Conductas de riesgo", q: "Transmites desde el asiento del copiloto de un auto en movimiento. ¿Está permitido?", o: ["Sí, porque no estás manejando", "Sí, si el auto va despacio", "No: tampoco se transmite desde un vehículo en movimiento", "Solo si llevas cinturón y lo muestras"], a: 2 },
    { t: "Conductas de riesgo", q: "Dejas un video en bucle 10 minutos mientras sales un momento. ¿Qué es?", o: ["Una pausa permitida si avisas al chat", "Contenido estático que puede sancionarse", "Permitido si dura menos de 15 minutos", "Permitido si el video es tuyo"], a: 1 },
    { t: "Conductas de riesgo", q: "Un seguidor te reta a aguantar la respiración 2 minutos en vivo. ¿Qué haces?", o: ["Lo haces si el chat llega a 500 likes", "Lo haces con alguien a tu lado", "No lo haces: es un reto peligroso", "Lo haces sin mostrar la cara"], a: 2 },
    { t: "Conductas de riesgo", q: "Una casa de apuestas te ofrece pago por promocionarla en tu LIVE. ¿Qué haces?", o: ["La promocionas si es publicidad pagada", "La mencionas solo al final del LIVE", "No: no se promocionan apuestas ni casinos con dinero real", "Solo si son apuestas deportivas"], a: 2 },
    { t: "Imagen y dinámica", q: "¿Cuál de estas acciones va contra las normas de imagen?", o: ["Usar ropa deportiva", "Cambiarte de ropa frente a la cámara", "Usar maquillaje llamativo", "Transmitir con gorra"], a: 1 },
    { t: "Imagen y dinámica", q: "¿Cuál es la mejor forma de generar interacción?", o: ["«Si llegamos a 1.000 toques, sigo el LIVE»", "«Denle like o me voy»", "«¿Desde dónde nos ven hoy?»", "«Toquen la pantalla para que no se corte»"], a: 2 },
    { t: "Moderación", q: "Un espectador insulta a otro en tu chat. ¿Qué es lo más adecuado?", o: ["Responderle en vivo para que aprenda", "Silenciarlo o bloquearlo y reportar, sin discutir", "Pedirle al chat que lo ignore y seguir", "Leer el insulto en voz alta y pedir disculpas"], a: 1 },
    { t: "Moderación", q: "¿Cuál de estos pasos corresponde a ANTES de iniciar tu LIVE?", o: ["Silenciar a quien provoca", "Revisar los reportes del día", "Activar el filtro de palabras clave", "Agradecer a tu comunidad"], a: 2 },
    { t: "Moderación", q: "Recibiste una advertencia de TikTok. ¿Qué haces primero?", o: ["Abrir otra cuenta por si acaso", "Ignorarla: se borra sola", "Revisar el motivo y avisar a R2LAB", "Transmitir más horas para compensar"], a: 2 },
    { t: "Temas sensibles", q: "Alguien en tu LIVE escribe que quiere hacerse daño. ¿Qué haces?", o: ["Lo ignoras para no darle visibilidad", "Respondes con respeto e invitas a buscar apoyo profesional", "Haces una broma para cambiar el ánimo", "Lo bloqueas sin decir nada"], a: 1 },
    { t: "Otros temas", q: "Haces un «chiste» sobre la religión de un espectador. ¿Qué puede pasar?", o: ["Nada, si es humor", "Solo es problema si alguien se queja", "Puede considerarse discriminación y sancionarse", "Solo aplica si el LIVE dura más de 1 hora"], a: 2 },
    { t: "Otros temas", q: "Un seguidor te pide mostrar el número de teléfono de otro creador. ¿Qué haces?", o: ["Lo muestras si es tu amigo", "Lo muestras solo unos segundos", "Lo escribes en el chat en vez de mostrarlo", "No lo compartes: son datos personales de otros"], a: 3 },
    { t: "Otros temas", q: "¿Cuál de estas situaciones va contra las normas?", o: ["Tomar agua en cámara", "Mostrar el consumo de alcohol como algo atractivo", "Hablar de tu día", "Recomendar una canción"], a: 1 },
    { t: "Consecuencias", q: "De estas sanciones, ¿cuál es la más grave?", o: ["Menor alcance de tus transmisiones", "Advertencia", "Pérdida de la monetización", "Suspensión o bloqueo de la cuenta"], a: 3 },
    { t: "Consecuencias", q: "¿Cuál de estas NO es una consecuencia de infringir las normas?", o: ["Menor alcance", "Pérdida de la monetización", "Recibir más regalos", "Suspensión temporal"], a: 2 },
    { t: "Expresarte", q: "Algo te sale mal en el LIVE y te frustras. ¿Qué es lo más adecuado decir?", o: ["«Esto es una porquería, me voy»", "«La culpa es del chat»", "«Respiro un segundo y seguimos»", "«¡Qué mierda!», si es solo una vez"], a: 2 }
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

  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function newState(user, mail, k) {
    return { user: user, mail: mail, key: k, rec: load(k), i: 0, picks: [], done: false, timedOut: false,
      order: shuffle(BANK.map(function (_, i) { return i; })).slice(0, PER_EXAM) };
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
    state = newState(user, mail, k);
    $("q-total").textContent = PER_EXAM;
    $("q-user").textContent = "@" + user;
    renderQuestion();
    show($("s-quiz"));
    startTimer();
  });

  /* ---------- Preguntas (sin pistas: no se revela si acertaste) ---------- */
  var LETTERS = ["A", "B", "C", "D"];
  function renderQuestion() {
    var Q = BANK[state.order[state.i]];
    $("q-num").textContent = state.i + 1;
    $("q-bar").style.transform = "scaleX(" + (state.i / PER_EXAM) + ")";
    $("q-topic").textContent = Q.t;
    $("q-text").textContent = Q.q;
    var next = $("q-next");
    next.disabled = true;
    next.innerHTML = (state.i === PER_EXAM - 1 ? "Terminar examen" : "Siguiente") + " <span>→</span>";
    $("q-hint").textContent = "Elige una respuesta";
    var box = $("q-opts"); box.innerHTML = "";
    shuffle(Q.o.map(function (txt, idx) { return { txt: txt, idx: idx }; })).forEach(function (o, n) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "opt"; b.dataset.idx = o.idx;
      b.setAttribute("aria-pressed", "false");
      b.innerHTML = '<span class="key">' + LETTERS[n] + '</span><span class="txt"></span>';
      b.querySelector(".txt").textContent = o.txt;
      b.addEventListener("click", function () { pick(b); });
      box.appendChild(b);
    });
    if (hasGsap) {
      gsap.fromTo([$("q-topic"), $("q-text")], { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.08, ease: "expo.out" });
      gsap.fromTo(box.children, { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.06, delay: 0.15, ease: "power3.out" });
    }
  }
  function pick(btn) {
    if (state.done) return;
    state.picks[state.i] = +btn.dataset.idx;
    $("q-opts").querySelectorAll(".opt").forEach(function (b) {
      var on = b === btn;
      b.classList.toggle("is-picked", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });
    $("q-next").disabled = false;
    $("q-hint").textContent = "Puedes cambiarla antes de seguir";
    if (hasGsap) gsap.fromTo(btn, { scale: 0.97 }, { scale: 1, duration: 0.5, ease: "elastic.out(1, .4)" });
  }
  $("q-next").addEventListener("click", function () {
    if (state.done || state.picks[state.i] === undefined) return;
    state.i++;
    $("q-bar").style.transform = "scaleX(" + (state.i / PER_EXAM) + ")";
    if (state.i < PER_EXAM) {
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
      if (left <= 0) { stopTimer(); if (!state.done) { state.timedOut = true; finish(); } }
    }, 250);
  }
  function stopTimer() { if (timerId) { clearInterval(timerId); timerId = null; } }

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
    // calificar: las preguntas sin responder cuentan como incorrectas
    var correct = 0, weakTopics = [];
    state.order.forEach(function (qi, n) {
      var Q = BANK[qi];
      if (state.picks[n] === Q.a) correct++;
      else if (weakTopics.indexOf(Q.t) === -1) weakTopics.push(Q.t);
    });
    var score = Math.round(correct / PER_EXAM * 100);
    var passed = score >= PASS;
    var rec = state.rec;
    rec.attempts += 1; rec.best = Math.max(rec.best, score);
    rec.history.push({ score: score, date: new Date().toISOString(), timedOut: state.timedOut });
    save(state.key, rec);
    var left = MAX_ATTEMPTS - rec.attempts;

    var card = document.querySelector("#s-result .result");
    card.classList.toggle("pass", passed);
    $("r-correct").textContent = correct + " de " + PER_EXAM + " correctas";
    $("r-badge").textContent = passed ? "Aprobado" : "No aprobado";
    $("r-title").textContent = passed ? "¡Felicidades, @" + state.user + "!" : (score >= 50 ? "Casi lo logras" : "Sigue practicando");
    $("r-msg").textContent = (state.timedOut ? "Se acabó el tiempo. " : "") + (passed
      ? "Aprobaste el examen final. Envíanos tu resultado para activar tu acceso a las capacitaciones."
      : rec.best >= PASS ? "Esta vez no alcanzaste el " + PASS + "%, pero ya aprobaste antes con " + rec.best + "%. Envíanos tu resultado."
      : left > 0 ? "Necesitas " + PASS + "% para aprobar. Repasa la guía y vuelve a intentarlo: te queda " + left + " intento con preguntas distintas."
      : "Necesitas " + PASS + "% para aprobar. Ya usaste tus intentos: escríbenos y te ayudamos.");

    var msg = "Hola R2LAB, terminé el examen final.\nUsuario: @" + state.user + "\nCorreo: " + state.mail + "\nResultado: " + score + "% (" + (passed ? "Aprobado" : "No aprobado") + ")" + (state.timedOut ? " · tiempo agotado" : "") + "\nIntento " + rec.attempts + " de " + MAX_ATTEMPTS + (rec.attempts > 1 ? "\nMejor resultado: " + rec.best + "%" : "");
    var actions = $("r-actions"); actions.innerHTML = "";
    actions.appendChild(btn("Enviar mi resultado por WhatsApp <span>→</span>", waLink(msg), "btn-wa", true));
    if (!passed && left > 0) {
      var retry = document.createElement("button"); retry.type = "button"; retry.className = "btn btn-line"; retry.textContent = "Intentar de nuevo";
      retry.addEventListener("click", function () {
        state = newState(state.user, state.mail, state.key);
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

    // solo los temas a repasar (sin revelar respuestas)
    var rl = $("review-list"); rl.innerHTML = "";
    weakTopics.forEach(function (t) { var li = document.createElement("li"); li.textContent = t; rl.appendChild(li); });
    $("review").hidden = weakTopics.length === 0;

    show($("s-result"));
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
