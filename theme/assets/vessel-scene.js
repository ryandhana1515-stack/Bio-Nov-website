/* ==========================================================================
   BIO N:OV — vessel scene controller
   Owns the three heaviest visual effects on the page:

   M2  Self-drawing NO decline curve            [data-bgx-decline]
   M3  Pinned artery-aging video scrub          [data-bgx-vessel]
   M4  Molecule particle field (canvas)         [data-bgx-particles]

   Plus the shared lazy-video loader used by snippets/bgx-video-bg.liquid.
   Every effect checks BGX.reduced / BGX.allowScrub() and degrades to a
   static poster + plain reveal when the device cannot carry it.
   ========================================================================== */

(function () {
  'use strict';

  var BGX = (window.BGX = window.BGX || {});

  /* ==================================================================== */
  /* Lazy video loader                                                    */
  /* ==================================================================== */

  /**
   * Swap data-src -> src when a video nears the viewport, so nothing below
   * the fold costs bandwidth on first paint. Above-the-fold videos are marked
   * data-bgx-eager and load immediately.
   */
  function initLazyVideo() {
    var videos = document.querySelectorAll('video[data-bgx-video]');
    if (!videos.length) return;

    function load(video) {
      if (video.dataset.bgxLoaded === '1') return;
      video.dataset.bgxLoaded = '1';

      video.querySelectorAll('source[data-src]').forEach(function (source) {
        source.src = source.dataset.src;
      });
      video.load();

      var reveal = function () {
        video.classList.add('is-ready');
      };
      /* A scrubbed video must not autoplay — the scroll drives it. */
      if (video.dataset.bgxScrub === '1') {
        video.addEventListener('loadeddata', reveal, { once: true });
        return;
      }
      var play = video.play();
      if (play && play.catch) {
        play.then(reveal).catch(function () {
          /* iOS Safari refuses autoplay in Low Power Mode. The poster stays,
             which is a perfectly good outcome — do not retry in a loop. */
          video.removeAttribute('autoplay');
        });
      } else {
        reveal();
      }
    }

    /* Reduced motion: never fetch the video at all, the poster is the design. */
    if (BGX.reduced) return;

    if (!('IntersectionObserver' in window)) {
      videos.forEach(load);
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          load(entry.target);
          io.unobserve(entry.target);
        });
      },
      { rootMargin: '300px 0px' }
    );

    videos.forEach(function (video) {
      if (video.dataset.bgxEager === '1') load(video);
      else io.observe(video);
    });
  }

  /* Pause offscreen videos so background loops never burn battery. */
  function initVideoPause() {
    if (!('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var v = entry.target;
          if (v.dataset.bgxScrub === '1') return;
          if (entry.isIntersecting) {
            if (v.dataset.bgxLoaded === '1' && v.paused) v.play().catch(function () {});
          } else if (!v.paused) {
            v.pause();
          }
        });
      },
      { threshold: 0.01 }
    );
    document.querySelectorAll('video[data-bgx-video]').forEach(function (v) {
      io.observe(v);
    });
  }

  /* ==================================================================== */
  /* M2 — NO decline curve                                                */
  /* ==================================================================== */

  function initDeclineCurve() {
    var root = document.querySelector('[data-bgx-decline]');
    if (!root) return;

    var path = root.querySelector('[data-bgx-decline-path]');
    var dots = root.querySelectorAll('[data-bgx-decline-dot]');
    var figures = root.querySelectorAll('[data-bgx-figure]');
    var readout = root.querySelector('[data-bgx-decline-readout]');

    /* Stops mirror the deck: 100% at 20s down to 15% at 60+. */
    var stops = [100, 80, 50, 35, 15];

    if (!path) return;
    var len = path.getTotalLength();
    path.style.strokeDasharray = len;

    function setProgress(p) {
      path.style.strokeDashoffset = len * (1 - p);

      dots.forEach(function (dot, i) {
        var at = i / (dots.length - 1 || 1);
        dot.style.opacity = p >= at - 0.02 ? '1' : '0';
        dot.style.transform = p >= at - 0.02 ? 'scale(1)' : 'scale(0.4)';
      });

      figures.forEach(function (fig, i) {
        var at = i / (figures.length - 1 || 1);
        /* Silhouettes desaturate and settle as the curve falls. */
        var local = Math.max(0, Math.min(1, (p - at * 0.6) * 2));
        fig.style.filter = 'grayscale(' + local * 0.85 + ') brightness(' + (1 - local * 0.35) + ')';
        fig.style.transform = 'translateY(' + local * 8 + 'px) scaleY(' + (1 - local * 0.06) + ')';
      });

      if (readout) {
        var idx = Math.min(stops.length - 1, Math.floor(p * stops.length));
        var val = Math.round(100 - (100 - stops[idx]) * Math.min(1, p * stops.length - idx + 1));
        readout.textContent = Math.max(stops[stops.length - 1], val) + '%';
      }
    }

    /* Reduced motion / no GSAP: show the finished chart. */
    if (BGX.reduced) {
      setProgress(1);
      return;
    }
    setProgress(0);

    BGX.onMotionReady(function () {
      window.ScrollTrigger.create({
        trigger: root,
        start: 'top 78%',
        end: 'bottom 62%',
        scrub: 0.6,
        onUpdate: function (self) {
          setProgress(self.progress);
        },
      });
    });

    /* If GSAP never loads, draw it once on intersection instead. */
    setTimeout(function () {
      if (window.ScrollTrigger) return;
      if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(
          function (entries) {
            if (!entries[0].isIntersecting) return;
            path.style.transition = 'stroke-dashoffset 2.2s cubic-bezier(.16,1,.3,1)';
            setProgress(1);
            io.disconnect();
          },
          { threshold: 0.3 }
        );
        io.observe(root);
      } else {
        setProgress(1);
      }
    }, 2500);
  }

  /* ==================================================================== */
  /* M3 — Pinned artery aging scrub (the centrepiece)                     */
  /* ==================================================================== */

  function initVesselScrub() {
    var root = document.querySelector('[data-bgx-vessel]');
    if (!root) return;

    var agingVideo = root.querySelector('[data-bgx-vessel-aging]');
    var restoreVideo = root.querySelector('[data-bgx-vessel-restore]');
    var stages = root.querySelectorAll('[data-bgx-stage]');
    var counter = root.querySelector('[data-bgx-vessel-counter]');
    var restorePanel = root.querySelector('[data-bgx-vessel-restore-panel]');
    var track = root.querySelector('[data-bgx-vessel-track]');

    /* Decade stops from the deck: 100 -> 80 -> 50 -> 35 -> 15. */
    var noStops = [100, 80, 50, 35, 15];

    /* The pin timeline: first AGE_END of the scroll ages the vessel, the
       remainder reverses it as BIO N:OV floods in. */
    var AGE_END = 0.68;

    function setStage(p) {
      var ageP = Math.min(1, p / AGE_END);
      var restoring = p > AGE_END;
      var restoreP = restoring ? (p - AGE_END) / (1 - AGE_END) : 0;

      /* Decade labels cross-fade through the left rail. */
      var idx = Math.min(stages.length - 1, Math.floor(ageP * stages.length));
      stages.forEach(function (stage, i) {
        var active = i === idx && !restoring;
        stage.classList.toggle('is-active', active);
        stage.setAttribute('aria-current', active ? 'true' : 'false');
      });

      if (track) track.style.setProperty('--bgx-track', (restoring ? 1 : ageP) * 100 + '%');

      /* NO% counter drops with age, then climbs back on the reversal. */
      if (counter) {
        var val;
        if (!restoring) {
          var seg = ageP * (noStops.length - 1);
          var i0 = Math.min(noStops.length - 2, Math.floor(seg));
          var f = seg - i0;
          val = noStops[i0] + (noStops[i0 + 1] - noStops[i0]) * f;
        } else {
          val = 15 + (85 - 15) * restoreP;
        }
        counter.textContent = Math.round(val) + '%';
      }

      if (restorePanel) {
        restorePanel.classList.toggle('is-visible', restoreP > 0.12);
        restorePanel.style.opacity = String(Math.min(1, restoreP * 2.2));
      }

      root.classList.toggle('is-restoring', restoring);

      /* Opacity rides a custom property, not style.opacity — the snippet's CSS
         gates the layer on `.is-ready` so an undecoded video never flashes
         black over the poster. */
      if (agingVideo) {
        agingVideo.style.setProperty(
          '--bgx-scrub-opacity',
          restoring ? String(Math.max(0, 1 - restoreP * 1.4)) : '1'
        );
      }
      if (restoreVideo) {
        restoreVideo.style.setProperty(
          '--bgx-scrub-opacity',
          restoring ? String(Math.min(1, restoreP * 1.6)) : '0'
        );
      }

      return { ageP: ageP, restoring: restoring, restoreP: restoreP };
    }

    /* --- Static fallback: no scrub on mobile, low-power, or reduced motion.
       The section still tells the whole story, just without the pin. */
    if (!BGX.allowScrub()) {
      root.classList.add('bgx-vessel--static');
      setStage(0);
      stages.forEach(function (stage) {
        stage.classList.add('is-active');
      });
      if (counter) counter.textContent = '15%';
      if (restorePanel) {
        restorePanel.classList.add('is-visible');
        restorePanel.style.opacity = '1';
      }
      if (restoreVideo) restoreVideo.style.setProperty('--bgx-scrub-opacity', '1');
      return;
    }

    /* --- Scrubbed path ------------------------------------------------- */

    var targetTime = 0;
    var targetRestore = 0;
    var rafId = null;

    /* video.currentTime is expensive to set; lerp toward the target inside a
       single rAF instead of writing it on every scroll event. */
    function tick() {
      rafId = requestAnimationFrame(tick);

      if (agingVideo && agingVideo.readyState >= 2 && agingVideo.duration) {
        var cur = agingVideo.currentTime;
        var want = targetTime * agingVideo.duration;
        if (Math.abs(cur - want) > 0.02) agingVideo.currentTime = cur + (want - cur) * 0.18;
      }
      if (restoreVideo && restoreVideo.readyState >= 2 && restoreVideo.duration) {
        var rcur = restoreVideo.currentTime;
        var rwant = targetRestore * restoreVideo.duration;
        if (Math.abs(rcur - rwant) > 0.02) restoreVideo.currentTime = rcur + (rwant - rcur) * 0.18;
      }
    }

    function startTick() {
      if (rafId === null) tick();
    }
    function stopTick() {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    }

    setStage(0);

    BGX.onMotionReady(function () {
      window.ScrollTrigger.create({
        trigger: root,
        start: 'top top',
        end: '+=200%',
        pin: root.querySelector('[data-bgx-vessel-pin]') || true,
        scrub: 0.5,
        anticipatePin: 1,
        onEnter: startTick,
        onEnterBack: startTick,
        onLeave: stopTick,
        onLeaveBack: stopTick,
        onUpdate: function (self) {
          var state = setStage(self.progress);
          targetTime = state.ageP;
          targetRestore = state.restoreP;
        },
      });
    });
  }

  /* ==================================================================== */
  /* M4 — Molecule particle field                                         */
  /* ==================================================================== */

  function initParticles() {
    var canvas = document.querySelector('[data-bgx-particles]');
    if (!canvas) return;

    /* Skip entirely on save-data, <4 cores, or reduced motion. */
    if (BGX.reduced || BGX.lowPower) {
      canvas.style.display = 'none';
      return;
    }

    var ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    var COUNT = window.innerWidth < 768 ? 34 : 60;
    var LINK_DIST = 132;
    var FPS = 30;
    var frameGap = 1000 / FPS;

    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var particles = [];
    var w = 0;
    var h = 0;
    var running = false;
    var last = 0;
    var rafId = null;

    function resize() {
      var rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function seed() {
      particles = [];
      for (var i = 0; i < COUNT; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.24,
          vy: (Math.random() - 0.5) * 0.24,
          r: Math.random() * 1.7 + 0.9,
        });
      }
    }

    function draw(ts) {
      rafId = requestAnimationFrame(draw);
      if (ts - last < frameGap) return;
      last = ts;

      ctx.clearRect(0, 0, w, h);

      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        for (var j = i + 1; j < particles.length; j++) {
          var q = particles[j];
          var dx = p.x - q.x;
          var dy = p.y - q.y;
          var d = Math.sqrt(dx * dx + dy * dy);
          if (d < LINK_DIST) {
            ctx.strokeStyle = 'rgba(0,220,255,' + (1 - d / LINK_DIST) * 0.16 + ')';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }

        ctx.fillStyle = 'rgba(0,220,255,0.72)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function start() {
      if (running) return;
      running = true;
      last = 0;
      rafId = requestAnimationFrame(draw);
    }
    function stop() {
      running = false;
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = null;
    }

    resize();
    seed();

    var resizeTimer = null;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        resize();
        seed();
      }, 200);
    });

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(
        function (entries) {
          if (entries[0].isIntersecting) start();
          else stop();
        },
        { threshold: 0.02 }
      );
      io.observe(canvas);
    } else {
      start();
    }

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop();
    });
  }

  /* ==================================================================== */
  /* Boot                                                                 */
  /* ==================================================================== */

  function boot() {
    initLazyVideo();
    initVideoPause();
    initDeclineCurve();
    initVesselScrub();
    initParticles();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
