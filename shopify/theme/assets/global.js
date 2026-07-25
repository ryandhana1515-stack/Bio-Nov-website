/* BioExcela Global — theme JS
   Mobile nav, scroll reveal, product gallery, quantity, variant sync, sticky ATC */

(function () {
  'use strict';

  /* Mobile navigation ----------------------------------------------------- */
  var toggle = document.querySelector('[data-menu-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');
  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      var open = mobileNav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  /* Scroll reveal ---------------------------------------------------------- */
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-inview');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(function (el) { observer.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('is-inview'); });
  }

  /* Product gallery --------------------------------------------------------- */
  document.querySelectorAll('[data-thumb]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var main = document.querySelector('[data-main-image]');
      if (!main) return;
      main.src = btn.dataset.src;
      if (btn.dataset.srcset) main.srcset = btn.dataset.srcset;
      document.querySelectorAll('[data-thumb]').forEach(function (b) { b.classList.remove('is-active'); });
      btn.classList.add('is-active');
    });
  });

  /* Quantity steppers --------------------------------------------------------- */
  document.querySelectorAll('[data-qty]').forEach(function (wrap) {
    var input = wrap.querySelector('input');
    wrap.querySelectorAll('button').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var step = btn.dataset.dir === 'up' ? 1 : -1;
        input.value = Math.max(1, parseInt(input.value || '1', 10) + step);
        input.dispatchEvent(new Event('change', { bubbles: true }));
      });
    });
  });

  /* Variant selection → hidden id + price + url ------------------------------ */
  var productForm = document.querySelector('[data-product-form]');
  if (productForm) {
    var variantData = document.querySelector('[data-variant-json]');
    var variants = variantData ? JSON.parse(variantData.textContent) : [];

    var updateVariant = function () {
      var selected = [];
      productForm.querySelectorAll('fieldset').forEach(function (set) {
        var checked = set.querySelector('input:checked');
        if (checked) selected.push(checked.value);
      });
      var match = variants.find(function (v) {
        return selected.every(function (val, i) { return v.options[i] === val; });
      });
      if (!match) return;

      var idInput = productForm.querySelector('input[name="id"]');
      if (idInput) idInput.value = match.id;

      var priceEl = document.querySelector('[data-product-price]');
      if (priceEl && match.price_formatted) priceEl.innerHTML = match.price_formatted;

      var atcBtn = productForm.querySelector('[data-atc]');
      if (atcBtn) {
        atcBtn.disabled = !match.available;
        atcBtn.textContent = match.available ? atcBtn.dataset.labelAvailable : atcBtn.dataset.labelSoldout;
      }

      if (history.replaceState) {
        var url = new URL(window.location.href);
        url.searchParams.set('variant', match.id);
        history.replaceState({}, '', url.toString());
      }
    };

    productForm.querySelectorAll('.variant-selects input').forEach(function (input) {
      input.addEventListener('change', updateVariant);
    });
  }

  /* Sticky add-to-cart --------------------------------------------------------- */
  var sticky = document.querySelector('[data-sticky-atc]');
  var buyBox = document.querySelector('[data-buy-box]');
  if (sticky && buyBox && 'IntersectionObserver' in window) {
    var stickyObserver = new IntersectionObserver(function (entries) {
      sticky.classList.toggle('is-visible', !entries[0].isIntersecting);
    }, { threshold: 0 });
    stickyObserver.observe(buyBox);

    var stickyBtn = sticky.querySelector('[data-sticky-submit]');
    if (stickyBtn && productForm) {
      stickyBtn.addEventListener('click', function () {
        productForm.requestSubmit ? productForm.requestSubmit() : productForm.submit();
      });
    }
  }
})();
