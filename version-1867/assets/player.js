import { H as Hls } from './hls-vendor.js';

(function () {
  var video = document.getElementById('movieVideo');
  var button = document.getElementById('playButton');
  var wrap = video ? video.closest('.player-wrap') : null;

  if (!video || !button || !wrap) {
    return;
  }

  var streamUrl = video.getAttribute('data-stream');
  var hls = null;
  var ready = false;

  function prepare() {
    if (ready || !streamUrl) {
      return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl;
      ready = true;
      return;
    }

    if (Hls && Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
      ready = true;
    }
  }

  function play() {
    prepare();
    wrap.classList.add('is-playing');
    var promise = video.play();

    if (promise && typeof promise.catch === 'function') {
      promise.catch(function () {
        wrap.classList.remove('is-playing');
      });
    }
  }

  button.addEventListener('click', play);

  video.addEventListener('click', function () {
    if (video.paused) {
      play();
    }
  });

  video.addEventListener('play', function () {
    wrap.classList.add('is-playing');
  });

  video.addEventListener('pause', function () {
    if (!video.ended) {
      wrap.classList.remove('is-playing');
    }
  });

  video.addEventListener('ended', function () {
    wrap.classList.remove('is-playing');
  });

  window.addEventListener('beforeunload', function () {
    if (hls) {
      hls.destroy();
    }
  });
})();
