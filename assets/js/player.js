import { H as Hls } from './hls-vendor-dru42stk.js';

document.addEventListener('DOMContentLoaded', function () {
    var video = document.querySelector('[data-hls-player]');

    if (!video) {
        return;
    }

    var source = video.getAttribute('data-src');

    if (!source) {
        return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
        return;
    }

    if (Hls && Hls.isSupported()) {
        var hls = new Hls({
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 90
        });

        hls.loadSource(source);
        hls.attachMedia(video);
    }
});
