(function () {
  var body = document.body;
  var toggle = document.querySelector('.menu-toggle');

  if (toggle) {
    toggle.addEventListener('click', function () {
      var open = body.classList.toggle('menu-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dot'));
    var active = 0;
    var timer = null;

    function show(index) {
      if (!slides.length) {
        return;
      }

      active = (index + slides.length) % slides.length;

      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === active);
      });

      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === active);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(active + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        show(index);
        start();
      });
    });

    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  var params = new URLSearchParams(window.location.search);
  var query = params.get('q') || '';
  var searchInput = document.getElementById('siteSearch');
  var cards = Array.prototype.slice.call(document.querySelectorAll('.movie-card'));
  var status = document.querySelector('[data-filter-status]');

  if (searchInput) {
    searchInput.value = query;
  }

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function filterCards(value) {
    var keyword = normalize(value);
    var shown = 0;

    cards.forEach(function (card) {
      var text = [
        card.dataset.title,
        card.dataset.region,
        card.dataset.type,
        card.dataset.year,
        card.dataset.genre,
        card.dataset.tags,
        card.textContent
      ].join(' ').toLowerCase();
      var matched = !keyword || text.indexOf(keyword) !== -1;

      card.classList.toggle('is-hidden', !matched);

      if (matched) {
        shown += 1;
      }
    });

    if (status) {
      status.textContent = keyword ? (shown ? '正在显示匹配内容' : '暂无匹配内容') : '输入关键词后将显示匹配内容';
    }
  }

  if (searchInput && cards.length) {
    searchInput.addEventListener('input', function () {
      filterCards(searchInput.value);
    });
    filterCards(query);
  }
})();
