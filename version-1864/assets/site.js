(function () {
  function all(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function initMenu() {
    var toggle = document.querySelector('[data-menu-toggle]');
    var nav = document.querySelector('[data-mobile-nav]');
    if (!toggle || !nav) return;
    toggle.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
  }

  function initCarousel() {
    all('[data-carousel]').forEach(function (carousel) {
      var slides = all('.hero-slide', carousel);
      var dots = all('[data-carousel-dot]', carousel);
      var prev = carousel.querySelector('[data-carousel-prev]');
      var next = carousel.querySelector('[data-carousel-next]');
      if (!slides.length) return;
      var index = 0;
      var timer = null;
      function show(nextIndex) {
        index = (nextIndex + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
          slide.classList.toggle('is-active', i === index);
        });
        dots.forEach(function (dot, i) {
          dot.classList.toggle('active', i === index);
        });
      }
      function restart() {
        if (timer) clearInterval(timer);
        timer = setInterval(function () {
          show(index + 1);
        }, 5000);
      }
      if (prev) prev.addEventListener('click', function () { show(index - 1); restart(); });
      if (next) next.addEventListener('click', function () { show(index + 1); restart(); });
      dots.forEach(function (dot, i) {
        dot.addEventListener('click', function () { show(i); restart(); });
      });
      restart();
    });
  }

  function initFilters() {
    all('[data-filter-scope]').forEach(function (scope) {
      var input = scope.querySelector('[data-filter-input]');
      var region = scope.querySelector('[data-filter-region]');
      var type = scope.querySelector('[data-filter-type]');
      var year = scope.querySelector('[data-filter-year]');
      var cards = all('[data-card]', scope);
      if (!cards.length) return;
      function value(el) {
        return el ? (el.value || '').toLowerCase().trim() : '';
      }
      function apply() {
        var q = value(input);
        var r = value(region);
        var t = value(type);
        var y = value(year);
        cards.forEach(function (card) {
          var hay = [card.dataset.title, card.dataset.tags, card.dataset.region, card.dataset.type, card.dataset.year].join(' ').toLowerCase();
          var ok = (!q || hay.indexOf(q) !== -1) && (!r || (card.dataset.region || '').toLowerCase() === r) && (!t || (card.dataset.type || '').toLowerCase() === t) && (!y || (card.dataset.year || '').toLowerCase() === y);
          card.classList.toggle('is-hidden', !ok);
        });
      }
      [input, region, type, year].forEach(function (el) {
        if (el) el.addEventListener('input', apply);
        if (el) el.addEventListener('change', apply);
      });
    });
  }

  function initBackTop() {
    var button = document.querySelector('[data-back-top]');
    if (!button) return;
    function update() {
      button.classList.toggle('is-visible', window.scrollY > 360);
    }
    button.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  window.SitePlayer = {
    setup: function (videoId, overlayId, source) {
      var video = document.getElementById(videoId);
      var overlay = document.getElementById(overlayId);
      if (!video || !overlay || !source) return;
      var hls = null;
      var attached = false;
      function attach() {
        if (attached) return;
        attached = true;
        if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
          hls.loadSource(source);
          hls.attachMedia(video);
          if (window.Hls.Events && window.Hls.ErrorTypes) {
            hls.on(window.Hls.Events.ERROR, function (_, data) {
              if (!data || !data.fatal || !hls) return;
              if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
                hls.startLoad();
              } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
                hls.recoverMediaError();
              } else {
                hls.destroy();
                hls = null;
                video.src = source;
                video.load();
              }
            });
          }
        } else {
          video.src = source;
          video.load();
        }
      }
      function start() {
        attach();
        overlay.classList.add('is-hidden');
        var play = video.play();
        if (play && typeof play.catch === 'function') {
          play.catch(function () {
            overlay.classList.remove('is-hidden');
          });
        }
      }
      overlay.addEventListener('click', start);
      video.addEventListener('click', function () {
        if (video.paused) {
          start();
        }
      });
      video.addEventListener('play', function () {
        overlay.classList.add('is-hidden');
      });
      video.addEventListener('pause', function () {
        if (!video.ended) overlay.classList.remove('is-hidden');
      });
      video.addEventListener('ended', function () {
        overlay.classList.remove('is-hidden');
      });
    }
  };

  document.addEventListener('DOMContentLoaded', function () {
    initMenu();
    initCarousel();
    initFilters();
    initBackTop();
  });
})();
