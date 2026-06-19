(function () {
    var video = document.getElementById('movie-player');
    var dataNode = document.getElementById('play-data');
    var cover = document.querySelector('[data-play-cover]');
    var box = document.querySelector('[data-video-box]');
    var hlsInstance = null;

    if (!video || !dataNode) {
        return;
    }

    function readSource() {
        try {
            var data = JSON.parse(dataNode.textContent || '{}');
            return data.src || '';
        } catch (error) {
            return '';
        }
    }

    function attachSource(src) {
        if (!src) {
            return;
        }

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = src;
            video.load();
            return;
        }

        if (window.Hls && window.Hls.isSupported()) {
            if (hlsInstance) {
                hlsInstance.destroy();
            }

            hlsInstance = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hlsInstance.loadSource(src);
            hlsInstance.attachMedia(video);
            return;
        }

        video.src = src;
        video.load();
    }

    function startPlayback() {
        var src = readSource();
        attachSource(src);

        if (cover) {
            cover.classList.add('hide');
        }

        var playPromise = video.play();

        if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(function () {
                if (cover) {
                    cover.classList.remove('hide');
                }
            });
        }
    }

    if (cover) {
        cover.addEventListener('click', startPlayback);
    }

    if (box) {
        box.addEventListener('click', function (event) {
            if (event.target === box) {
                startPlayback();
            }
        });
    }

    video.addEventListener('click', function () {
        if (video.paused) {
            startPlayback();
        }
    });
})();
