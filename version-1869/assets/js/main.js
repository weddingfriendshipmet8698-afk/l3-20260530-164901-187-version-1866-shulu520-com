(function () {
    function qs(selector, root) {
        return (root || document).querySelector(selector);
    }

    function qsa(selector, root) {
        return Array.from((root || document).querySelectorAll(selector));
    }

    qsa('[data-mobile-toggle]').forEach(function (button) {
        button.addEventListener('click', function () {
            var target = qs('[data-mobile-nav]');
            if (target) {
                target.classList.toggle('is-open');
            }
        });
    });

    var hero = qs('[data-hero]');
    if (hero) {
        var slides = qsa('[data-hero-slide]', hero);
        var dots = qsa('[data-hero-dot]', hero);
        var index = 0;
        var timer = null;

        function show(next) {
            if (!slides.length) {
                return;
            }
            index = (next + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === index);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === index);
            });
        }

        function start() {
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5200);
        }

        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener('click', function () {
                if (timer) {
                    window.clearInterval(timer);
                }
                show(dotIndex);
                start();
            });
        });

        show(0);
        start();
    }

    var searchPage = qs('[data-search-page]');
    if (searchPage) {
        var input = qs('[data-search-input]', searchPage);
        var category = qs('[data-search-category]', searchPage);
        var year = qs('[data-search-year]', searchPage);
        var count = qs('[data-search-count]', searchPage);
        var cards = qsa('[data-movie-card]', searchPage);
        var noResults = qs('[data-no-results]', searchPage);
        var params = new URLSearchParams(window.location.search);
        var initialQuery = params.get('q') || '';
        if (input) {
            input.value = initialQuery;
        }

        function normalize(value) {
            return String(value || '').toLowerCase().trim();
        }

        function applyFilter() {
            var query = normalize(input && input.value);
            var categoryValue = normalize(category && category.value);
            var yearValue = normalize(year && year.value);
            var visible = 0;
            cards.forEach(function (card) {
                var haystack = normalize(card.getAttribute('data-title') + ' ' + card.getAttribute('data-tags') + ' ' + card.getAttribute('data-desc'));
                var cardCategory = normalize(card.getAttribute('data-category'));
                var cardYear = normalize(card.getAttribute('data-year'));
                var matched = true;
                if (query && haystack.indexOf(query) === -1) {
                    matched = false;
                }
                if (categoryValue && cardCategory !== categoryValue) {
                    matched = false;
                }
                if (yearValue && cardYear !== yearValue) {
                    matched = false;
                }
                card.style.display = matched ? '' : 'none';
                if (matched) {
                    visible += 1;
                }
            });
            if (count) {
                count.textContent = '已匹配 ' + visible + ' 部影片';
            }
            if (noResults) {
                noResults.classList.toggle('is-visible', visible === 0);
            }
        }

        [input, category, year].forEach(function (control) {
            if (control) {
                control.addEventListener('input', applyFilter);
                control.addEventListener('change', applyFilter);
            }
        });
        applyFilter();
    }
})();
