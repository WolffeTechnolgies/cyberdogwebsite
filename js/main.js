(function () {
  document.getElementById('year').textContent = new Date().getFullYear();

  var header = document.getElementById('site-header');
  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 12);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var toggle = document.getElementById('nav-toggle');
  var nav = document.getElementById('main-nav');
  toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  nav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  function animateCount(el) {
    var target = parseInt(el.dataset.target, 10);
    if (isNaN(target)) return;
    var suffix = el.dataset.suffix || '';
    var duration = 1400;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (entry.isIntersecting) {
          entry.target.style.transitionDelay = (i % 6) * 60 + 'ms';
          entry.target.classList.add('is-visible');
          var counter = entry.target.querySelector('.impact-value[data-target]');
          if (counter) animateCount(counter);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    document.querySelectorAll('.impact-value[data-target]').forEach(function (el) {
      el.textContent = el.dataset.target + (el.dataset.suffix || '');
    });
  }

  var reasonSelect = document.getElementById('reason');
  var reportModal = document.getElementById('report-modal');
  if (reasonSelect && reportModal && typeof reportModal.showModal === 'function') {
    reasonSelect.addEventListener('change', function () {
      if (reasonSelect.value === 'report') {
        reasonSelect.value = '';
        reportModal.showModal();
      }
    });
  }

  var form = document.getElementById('contact-form');
  var status = document.getElementById('form-status');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    status.textContent = 'Thank you. Your message has been received and will be reviewed by our intake team.';
    form.reset();
  });
})();
