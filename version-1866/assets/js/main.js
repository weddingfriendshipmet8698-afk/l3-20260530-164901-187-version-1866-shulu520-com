document.addEventListener('DOMContentLoaded', function () {
    var menuButton = document.querySelector('[data-menu-button]');
    var mobilePanel = document.querySelector('[data-mobile-panel]');

    if (menuButton && mobilePanel) {
        menuButton.addEventListener('click', function () {
            mobilePanel.classList.toggle('open');
        });
    }

    var slides = Array.from(document.querySelectorAll('[data-hero-slide]'));
    var dots = Array.from(document.querySelectorAll('[data-hero-dot]'));
    var activeIndex = 0;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }

        activeIndex = (index + slides.length) % slides.length;

        slides.forEach(function (slide, slideIndex) {
            slide.classList.toggle('is-active', slideIndex === activeIndex);
        });

        dots.forEach(function (dot, dotIndex) {
            dot.classList.toggle('is-active', dotIndex === activeIndex);
        });
    }

    dots.forEach(function (dot, index) {
        dot.addEventListener('click', function () {
            showSlide(index);
        });
    });

    if (slides.length > 1) {
        showSlide(0);
        window.setInterval(function () {
            showSlide(activeIndex + 1);
        }, 5200);
    }

    var searchInput = document.querySelector('[data-movie-search]');
    var cards = Array.from(document.querySelectorAll('[data-movie-card]'));

    if (searchInput && cards.length) {
        searchInput.addEventListener('input', function () {
            var keyword = searchInput.value.trim().toLowerCase();

            cards.forEach(function (card) {
                var text = card.textContent.toLowerCase();
                card.classList.toggle('hidden-by-search', keyword && text.indexOf(keyword) === -1);
            });
        });
    }
});
