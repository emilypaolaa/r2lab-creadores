/* R2LAB · Personas reales en los celulares del manual
   Cada .gl-person se reemplaza por un video corto (sin sonido, en bucle) de una
   persona hablando a cámara, como en un LIVE. Videos gratuitos de Pexels. */
(function () {
  "use strict";
  var CLIPS = ["host", "sofi", "marco", "ana", "rival"];
  var FX = ["sparkle", "hearts", "stars", "flowers"];
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function effect(kind) {
    var NS = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", "0 0 100 100");
    svg.setAttribute("preserveAspectRatio", "none");
    svg.setAttribute("class", "pp-fx");
    svg.setAttribute("aria-hidden", "true");
    var star = function (x, y, s, d) { return '<path transform="translate(' + x + ' ' + y + ') scale(' + s + ')" d="M0 -5 L1.2 -1.2 L5 0 L1.2 1.2 L0 5 L-1.2 1.2 L-5 0 L-1.2 -1.2Z" fill="#fff"><animate attributeName="opacity" values="1;.15;1" dur="' + d + 's" repeatCount="indefinite"/></path>'; };
    var heart = function (x, y, s, c, d) { return '<path transform="translate(' + x + ' ' + y + ') scale(' + s + ')" d="M0 3 C -5 -1 -4 -5 -1.6 -5 C -.6 -5 0 -4 0 -3.4 C 0 -4 .6 -5 1.6 -5 C 4 -5 5 -1 0 3Z" fill="' + c + '"><animate attributeName="opacity" values=".95;.4;.95" dur="' + d + 's" repeatCount="indefinite"/></path>'; };
    var html = "";
    if (kind === "sparkle") html = star(18, 22, 1.1, 1.6) + star(82, 16, 1.4, 1.3) + star(86, 58, .9, 1.9) + star(12, 64, .8, 1.5);
    if (kind === "hearts") html = heart(16, 18, 1.4, "#ff6b9a", 1.5) + heart(84, 24, 1.1, "#ff9fc0", 1.8) + heart(88, 70, 1.3, "#FE2C55", 1.3) + heart(10, 72, 1, "#ffb6c9", 2);
    if (kind === "stars") html = star(50, 10, 1.6, 1.4) + star(20, 30, 1, 1.9) + star(80, 34, 1.1, 1.6) + '<rect x="0" y="0" width="100" height="100" fill="url(#pp-glow)"/>';
    if (kind === "flowers") html = [[8, 10, "#ff8ac2"], [92, 10, "#ffd34d"], [8, 90, "#9be7d3"], [92, 90, "#ff8ac2"], [50, 6, "#ffd34d"]].map(function (p) {
      return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="4" fill="' + p[2] + '"/><circle cx="' + p[0] + '" cy="' + p[1] + '" r="1.5" fill="#fff6c9"/>';
    }).join("");
    svg.innerHTML = '<defs><radialGradient id="pp-glow" cx=".5" cy=".4" r=".6"><stop offset="0" stop-color="#fff" stop-opacity=".18"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>' + html;
    return svg;
  }

  function pick(el) {
    var tile = el.closest(".bm-tile");
    if (tile) { var n = +(tile.className.match(/\bt(\d)/) || [0, 1])[1]; return { v: n - 1, fx: FX[n - 1] }; }
    if (el.closest(".pk-r, .bb-r")) return { v: 4 };
    return { v: 0 };
  }

  var videos = [];
  Array.prototype.forEach.call(document.querySelectorAll(".gl-person"), function (el) {
    var p = pick(el), name = CLIPS[p.v];
    el.classList.add("pp");
    var v = document.createElement("video");
    v.className = "pp-video";
    v.muted = true; v.loop = true; v.playsInline = true;
    v.setAttribute("muted", ""); v.setAttribute("playsinline", ""); v.setAttribute("aria-hidden", "true");
    v.preload = "none";
    v.poster = "img/live/" + name + ".jpg";
    v.src = "img/live/" + name + ".mp4";
    el.appendChild(v);
    if (p.fx) el.appendChild(effect(p.fx));
    videos.push(v);
  });

  // solo se reproducen los que están en pantalla (ahorra datos y batería)
  if (reduce) return;
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var v = en.target;
        if (en.isIntersecting) { var pr = v.play(); if (pr && pr.catch) pr.catch(function () {}); }
        else v.pause();
      });
    }, { threshold: 0.15 });
    videos.forEach(function (v) { io.observe(v); });
  } else {
    videos.forEach(function (v) { v.autoplay = true; });
  }
})();
