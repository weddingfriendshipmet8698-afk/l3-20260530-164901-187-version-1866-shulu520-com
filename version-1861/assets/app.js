(function () {
  const header = document.querySelector('[data-site-header]');
  const menuToggle = document.querySelector('[data-menu-toggle]');

  function updateHeader() {
    if (!header) {
      return;
    }
    if (window.scrollY > 16) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }

  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  if (menuToggle && header) {
    menuToggle.addEventListener('click', function () {
      header.classList.toggle('is-open');
      document.body.classList.toggle('menu-open', header.classList.contains('is-open'));
    });
  }

  const searchInputs = Array.from(document.querySelectorAll('.site-search-input'));
  const searchMovies = Array.isArray(window.SEARCH_MOVIES) ? window.SEARCH_MOVIES : [];

  function renderSearch(input) {
    const wrap = input.parentElement;
    const results = wrap ? wrap.querySelector('[data-search-results]') : null;
    if (!results) {
      return;
    }
    const query = input.value.trim().toLowerCase();
    results.innerHTML = '';
    if (query.length < 1) {
      results.classList.remove('is-visible');
      return;
    }
    const matches = searchMovies.filter(function (movie) {
      const haystack = [movie.title, movie.region, movie.year, movie.genre, movie.tags].join(' ').toLowerCase();
      return haystack.indexOf(query) !== -1;
    }).slice(0, 12);
    if (matches.length === 0) {
      const empty = document.createElement('span');
      empty.textContent = '没有找到匹配影片';
      empty.style.padding = '12px';
      results.appendChild(empty);
      results.classList.add('is-visible');
      return;
    }
    matches.forEach(function (movie) {
      const link = document.createElement('a');
      link.href = movie.url;
      link.innerHTML = '<img src="' + movie.cover + '" alt="' + movie.title.replace(/"/g, '&quot;') + '"><span><strong>' + movie.title + '</strong><span>' + movie.region + ' · ' + movie.year + ' · ' + movie.genre + '</span></span>';
      results.appendChild(link);
    });
    results.classList.add('is-visible');
  }

  searchInputs.forEach(function (input) {
    input.addEventListener('input', function () {
      renderSearch(input);
    });
    input.addEventListener('focus', function () {
      renderSearch(input);
    });
  });

  document.addEventListener('click', function (event) {
    searchInputs.forEach(function (input) {
      const wrap = input.parentElement;
      const results = wrap ? wrap.querySelector('[data-search-results]') : null;
      if (wrap && results && !wrap.contains(event.target)) {
        results.classList.remove('is-visible');
      }
    });
  });

  const slider = document.querySelector('[data-hero-slider]');
  if (slider) {
    const slides = Array.from(slider.querySelectorAll('.hero-slide'));
    const dots = Array.from(slider.querySelectorAll('[data-hero-dot]'));
    let current = 0;

    function showSlide(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === current);
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        showSlide(index);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }
  }

  const filterAreas = Array.from(document.querySelectorAll('[data-filter-area]'));
  filterAreas.forEach(function (area) {
    const input = area.querySelector('.category-filter-input');
    const chips = Array.from(area.querySelectorAll('.filter-chip'));
    const sort = area.querySelector('.sort-select');
    const list = area.querySelector('[data-card-list]');
    const empty = area.querySelector('[data-empty-state]');
    if (!list) {
      return;
    }
    const cards = Array.from(list.querySelectorAll('[data-card]'));
    let chipValue = '全部';

    function cardText(card) {
      return [card.dataset.title, card.dataset.region, card.dataset.year, card.dataset.genre, card.textContent].join(' ').toLowerCase();
    }

    function applyFilters() {
      const query = input ? input.value.trim().toLowerCase() : '';
      let visibleCount = 0;
      cards.forEach(function (card) {
        const text = cardText(card);
        const matchQuery = !query || text.indexOf(query) !== -1;
        const matchChip = chipValue === '全部' || text.indexOf(chipValue.toLowerCase()) !== -1;
        const visible = matchQuery && matchChip;
        card.style.display = visible ? '' : 'none';
        if (visible) {
          visibleCount += 1;
        }
      });
      if (empty) {
        empty.classList.toggle('is-visible', visibleCount === 0);
      }
    }

    function applySort() {
      if (!sort) {
        return;
      }
      const mode = sort.value;
      const sorted = cards.slice().sort(function (a, b) {
        if (mode === 'views') {
          return Number(b.dataset.views || 0) - Number(a.dataset.views || 0);
        }
        if (mode === 'score') {
          return Number(b.dataset.score || 0) - Number(a.dataset.score || 0);
        }
        if (mode === 'year') {
          return Number(b.dataset.year || 0) - Number(a.dataset.year || 0);
        }
        return 0;
      });
      sorted.forEach(function (card) {
        list.appendChild(card);
      });
      applyFilters();
    }

    if (input) {
      input.addEventListener('input', applyFilters);
    }

    chips.forEach(function (chip, index) {
      if (index === 0) {
        chip.classList.add('active');
      }
      chip.addEventListener('click', function () {
        chipValue = chip.dataset.filter || '全部';
        chips.forEach(function (item) {
          item.classList.toggle('active', item === chip);
        });
        applyFilters();
      });
    });

    if (sort) {
      sort.addEventListener('change', applySort);
    }
  });
})();
