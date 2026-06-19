(function () {
  const video = document.getElementById('movie-player');
  if (!video) {
    return;
  }

  const cover = document.querySelector('.player-cover');
  const stream = video.dataset.stream;
  let hlsInstance = null;
  let attached = false;

  function attachStream() {
    if (!stream || attached) {
      return;
    }
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = stream;
      attached = true;
      return;
    }
    if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({ enableWorker: true });
      hlsInstance.loadSource(stream);
      hlsInstance.attachMedia(video);
      attached = true;
    }
  }

  function startPlayback() {
    attachStream();
    if (cover) {
      cover.classList.add('is-hidden');
    }
    const attempt = video.play();
    if (attempt && typeof attempt.catch === 'function') {
      attempt.catch(function () {});
    }
  }

  if (cover) {
    cover.addEventListener('click', startPlayback);
  }

  video.addEventListener('click', function () {
    if (video.paused) {
      startPlayback();
    }
  });

  video.addEventListener('play', function () {
    if (cover) {
      cover.classList.add('is-hidden');
    }
  });

  window.addEventListener('beforeunload', function () {
    if (hlsInstance) {
      hlsInstance.destroy();
    }
  });
})();
