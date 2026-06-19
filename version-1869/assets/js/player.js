import { H as Hls } from './hls-vendor-dru42stk.js';

function initMoviePlayer() {
    const video = document.querySelector('[data-hls-player]');
    const button = document.querySelector('[data-player-start]');
    if (!video) {
        return;
    }
    const source = video.getAttribute('data-video-src');
    if (!source) {
        return;
    }
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
    } else if (Hls && Hls.isSupported()) {
        const hls = new Hls({
            enableWorker: true,
            lowLatencyMode: true
        });
        hls.loadSource(source);
        hls.attachMedia(video);
    } else {
        video.src = source;
    }
    if (button) {
        button.addEventListener('click', function () {
            button.classList.add('is-hidden');
            video.play().catch(function () {
                button.classList.remove('is-hidden');
            });
        });
        video.addEventListener('play', function () {
            button.classList.add('is-hidden');
        });
        video.addEventListener('pause', function () {
            if (video.currentTime === 0 || video.ended) {
                button.classList.remove('is-hidden');
            }
        });
    }
}

initMoviePlayer();
