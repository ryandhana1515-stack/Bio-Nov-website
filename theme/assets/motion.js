/* ==========================================================================
   BIO N:OV — motion engine
   Lenis smooth scroll + GSAP/ScrollTrigger, with a full no-motion path.

   Design rules baked in here:
   - Nothing is required. If the GSAP/Lenis CDN is blocked or slow, every
     effect degrades to an IntersectionObserver reveal and the page still works.
   - prefers-reduced-motion renders the FINAL state instantly, never a
     half-animated one.
   - Scrub/pin effects are disabled below 768px and on low-power devices;
     those sections fall back to plain reveals.
   ========================================================================== */

(function () {
  'use strict';

  var reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  var conn = navigator.connection || {};

  var BGX = (window.BGX = window.BGX || {});

  BGX.reduced = reduceQuery.matches;

  /* Low-power heuristic: used to decide whether the expensive pinned scrub and
     the particle canvas are worth running at all. */
  BGX.lowPower =
    conn.saveData === true ||
    (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) ||
    /2g/.test(conn.effectiveType || '');

  BGX.isDesktop = function () {
    return window.matchMedia('(min-width: 768px)').matches;
  };

  /* Scrub + pin only where it will actually hold 60fps. */
  BGX.allowScrub = function () {
    return !BGX.reduced && !BGX.lowPower && BGX.isDesktop();
  };

  if (BGX.reduced) document.documentElement.classList.add('bgx-no-motion');

  /* ------------------------------------------------------------------ */
  /* Ready queue — sections register work that needs GSAP.               */
  /* ------------------------------------------------------------------ */

  var queue = [];
  var libsReady = false;

  /**
   * Register a callback to run once GSAP + ScrollTrigger are available.
   * If the libraries never arrive, the callback is simply never run and the
   * IntersectionObserver fallback below has already shown the content.
   */
  BGX.onMotionReady = function (fn) {
    if (libsReady) fn();
    else queue.push(fn);
  };

  /* ------------------------------------------------------------------ */
  /* Word splitter — 15 lines, no SplitText dependency.                  */
  /* ------------------------------------------------------------------ */

  /**
   * Wrap each word of an element in <span class="bgx-word"> inside a masking
   * span, so words can rise out of a clipped box. Safe to call twice.
   */
  BGX.splitWords = function (el) {
    if (!el || el.dataset.bgxSplit === 'done') return [];
    var words = (el.textContent || '').trim().split(/\s+/);
    el.textContent = '';
    var out = [];
    words.forEach(function (word, i) {
      var mask = document.createElement('span');
      mask.className = 'bgx-word-mask';
      var inner = document.createElement('span');
      inner.className = 'bgx-word';
      inner.textContent = word;
      mask.appendChild(inner);
      el.appendChild(mask);
      if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
      out.push(inner);
    });
    el.dataset.bgxSplit = 'done';
    return out;
  };

  /* ------------------------------------------------------------------ */
  /* Fallback reveal — always runs first so content is never stuck at 0. */
  /* ------------------------------------------------------------------ */

  function fallbackReveal() {
    var els = document.querySelectorAll('.bgx-reveal');
    if (!els.length) return;

    if (BGX.reduced || !('IntersectionObserver' in window)) {
      els.forEach(function (el) {
        el.classList.add('bgx-revealed');
      });
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          var delay = parseFloat(el.dataset.bgxDelay || 0);
          el.style.transition =
            'opacity .9s cubic-bezier(.16,1,.3,1) ' +
            delay +
            's, transform .9s cubic-bezier(.16,1,.3,1) ' +
            delay +
            's';
          el.classList.add('bgx-revealed');
          io.unobserve(el);
        });
      },
      { rootMargin: '0px 0px -18% 0px', threshold: 0.01 }
    );

    els.forEach(function (el) {
      io.observe(el);
    });
  }

  /* ------------------------------------------------------------------ */
  /* Animated counters (snippets/bgx-counter.liquid)                     */
  /* ------------------------------------------------------------------ */

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  /**
   * Count an element from data-bgx-from to data-bgx-to.
   * Honours decimals, prefix/suffix, and counts DOWN as happily as up.
   */
  BGX.runCounter = function (el) {
    if (el.dataset.bgxCounted === '1') return;
    el.dataset.bgxCounted = '1';

    var from = parseFloat(el.dataset.bgxFrom || 0);
    var to = parseFloat(el.dataset.bgxTo || 0);
    var dec = parseInt(el.dataset.bgxDecimals || 0, 10);
    var prefix = el.dataset.bgxPrefix || '';
    var suffix = el.dataset.bgxSuffix || '';
    var dur = parseFloat(el.dataset.bgxDuration || 1.8) * 1000;

    var write = function (v) {
      el.textContent = prefix + v.toFixed(dec) + suffix;
    };

    if (BGX.reduced) {
      write(to);
      return;
    }

    var start = null;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      write(from + (to - from) * easeOutCubic(p));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  };

  function initCounters() {
    var els = document.querySelectorAll('[data-bgx-counter]');
    if (!els.length) return;

    if (BGX.reduced || !('IntersectionObserver' in window)) {
      els.forEach(BGX.runCounter);
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          BGX.runCounter(entry.target);
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.35 }
    );
    els.forEach(function (el) {
      io.observe(el);
    });
  }

  /* Circular progress rings around the proof numbers (M5). */
  function initRings() {
    var rings = document.querySelectorAll('[data-bgx-ring]');
    if (!rings.length) return;

    rings.forEach(function (ring) {
      var len = ring.getTotalLength();
      ring.style.strokeDasharray = len;
      ring.style.strokeDashoffset = BGX.reduced ? len * 0.12 : len;
    });

    if (BGX.reduced || !('IntersectionObserver' in window)) return;

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var ring = entry.target;
          var len = ring.getTotalLength();
          var pct = parseFloat(ring.dataset.bgxRing || 70) / 100;
          ring.style.transition = 'stroke-dashoffset 1.8s cubic-bezier(.16,1,.3,1)';
          ring.style.strokeDashoffset = len * (1 - pct);
          io.unobserve(ring);
        });
      },
      { threshold: 0.35 }
    );
    rings.forEach(function (r) {
      io.observe(r);
    });
  }

  /* ------------------------------------------------------------------ */
  /* Magnetic CTAs — desktop pointer only, capped at 12px.               */
  /* ------------------------------------------------------------------ */

  function initMagnetic() {
    if (BGX.reduced) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    document.querySelectorAll('[data-bgx-magnetic]').forEach(function (btn) {
      var raf = null;
      function move(e) {
        if (raf) return;
        raf = requestAnimationFrame(function () {
          raf = null;
          var r = btn.getBoundingClientRect();
          var dx = e.clientX - (r.left + r.width / 2);
          var dy = e.clientY - (r.top + r.height / 2);
          var max = 12;
          var x = Math.max(-max, Math.min(max, dx * 0.3));
          var y = Math.max(-max, Math.min(max, dy * 0.3));
          btn.style.transform = 'translate(' + x + 'px,' + y + 'px)';
        });
      }
      btn.addEventListener('mousemove', move);
      btn.addEventListener('mouseleave', function () {
        btn.style.transform = '';
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /* Header: transparent over hero, frosted once scrolled.               */
  /* ------------------------------------------------------------------ */

  function initHeader() {
    var header = document.querySelector('[data-bgx-header]');
    if (!header) return;
    var ticking = false;
    function update() {
      ticking = false;
      header.classList.toggle('is-scrolled', window.scrollY > 40);
    }
    window.addEventListener(
      'scroll',
      function () {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(update);
      },
      { passive: true }
    );
    update();
  }

  /* Sticky mobile buy-bar — appears once the hero has left the viewport. */
  function initBuyBar() {
    var bar = document.querySelector('[data-bgx-buybar]');
    var hero = document.querySelector('[data-bgx-hero]');
    if (!bar) return;
    if (!hero) {
      bar.classList.add('is-visible');
      return;
    }
    if (!('IntersectionObserver' in window)) {
      bar.classList.add('is-visible');
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        bar.classList.toggle('is-visible', !entries[0].isIntersecting);
      },
      { threshold: 0 }
    );
    io.observe(hero);
  }

  /* Auto-rotating announcement bar. */
  function initAnnouncement() {
    var bar = document.querySelector('[data-bgx-announce]');
    if (!bar) return;
    var items = bar.querySelectorAll('[data-bgx-announce-item]');
    if (items.length < 2) return;

    var i = 0;
    items[0].classList.add('is-active');

    /* Reduced motion still rotates — it is information, not decoration — but
       cross-fades instantly via the CSS transition override. */
    setInterval(function () {
      items[i].classList.remove('is-active');
      i = (i + 1) % items.length;
      items[i].classList.add('is-active');
    }, 4800);
  }

  /* Accordions with animated height (benefits + FAQ). */
  function initAccordions() {
    document.querySelectorAll('[data-bgx-accordion]').forEach(function (root) {
      var triggers = root.querySelectorAll('[data-bgx-acc-trigger]');
      triggers.forEach(function (trigger) {
        trigger.addEventListener('click', function () {
          var panel = document.getElementById(trigger.getAttribute('aria-controls'));
          if (!panel) return;
          var open = trigger.getAttribute('aria-expanded') === 'true';

          if (root.dataset.bgxAccordion === 'single' && !open) {
            triggers.forEach(function (other) {
              if (other === trigger) return;
              other.setAttribute('aria-expanded', 'false');
              var p = document.getElementById(other.getAttribute('aria-controls'));
              if (p) p.style.height = '0px';
            });
          }

          trigger.setAttribute('aria-expanded', String(!open));
          if (BGX.reduced) {
            panel.style.height = open ? '0px' : 'auto';
          } else {
            panel.style.height = open ? '0px' : panel.scrollHeight + 'px';
          }

          if (!open) {
            panel.querySelectorAll('[data-bgx-counter]').forEach(BGX.runCounter);
          }
        });
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /* GSAP-powered layer                                                  */
  /* ------------------------------------------------------------------ */

  function initGsap() {
    if (BGX.reduced) return;
    if (!window.gsap || !window.ScrollTrigger) return;

    var gsap = window.gsap;
    gsap.registerPlugin(window.ScrollTrigger);
    var ST = window.ScrollTrigger;

    /* Lenis smooth scroll, synced to ScrollTrigger. */
    if (window.Lenis) {
      var lenis = new window.Lenis({ lerp: 0.09, smoothWheel: true });
      BGX.lenis = lenis;
      lenis.on('scroll', ST.update);
      gsap.ticker.add(function (time) {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    }

    /* Pinned sections misbehave with normalizeScroll on touch. */
    ST.normalizeScroll(false);

    /* Headline word entrance. */
    document.querySelectorAll('[data-bgx-split]').forEach(function (el) {
      var words = BGX.splitWords(el);
      if (!words.length) return;
      gsap.set(words, { yPercent: 110, opacity: 0 });
      gsap.to(words, {
        yPercent: 0,
        opacity: 1,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.055,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    });

    libsReady = true;
    queue.forEach(function (fn) {
      try {
        fn();
      } catch (e) {
        /* One broken section must never take the rest of the page down. */
        console.warn('[bgx] section motion failed', e);
      }
    });
    queue.length = 0;

    ST.refresh();
  }

  /* ------------------------------------------------------------------ */
  /* Boot                                                                */
  /* ------------------------------------------------------------------ */

  function boot() {
    fallbackReveal();
    initCounters();
    initRings();
    initMagnetic();
    initHeader();
    initBuyBar();
    initAnnouncement();
    initAccordions();
    initGsap();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }

  /* GSAP is deferred and may land after DOMContentLoaded — retry once on load
     so the enhanced layer still attaches. */
  window.addEventListener(
    'load',
    function () {
      if (!libsReady) initGsap();
    },
    { once: true }
  );

  /* React to a live change of the reduced-motion preference. */
  var onPrefChange = function () {
    BGX.reduced = reduceQuery.matches;
    document.documentElement.classList.toggle('bgx-no-motion', BGX.reduced);
  };
  if (reduceQuery.addEventListener) reduceQuery.addEventListener('change', onPrefChange);
})();
