const videos = window.videos;
let index = 0;

const video = document.getElementById("video");
const title = document.getElementById("title");
const progress = document.getElementById("progress");

/* Load video */
function loadVideo(i) {
  video.src = videos[i].mediaUrl;
  title.innerText = "🎬 " + videos[i].title;
  video.load();
  video.play();
}
function togglePlay() {
  video.paused ? video.play() : video.pause();
}
function toggleMute() {
  video.muted = !video.muted;

  if (video.muted) {
    muteBtn.innerText = "🔇";
    muteBtn.classList.add("muted");
  } else {
    muteBtn.innerText = "🔊";
    muteBtn.classList.remove("muted");
  }
}

function changeSpeed(speed) {
  video.playbackRate = speed;
}

function fullscreen() {
  const container = document.querySelector(".video-wrapper-outer");

  if (!document.fullscreenElement) {
    container.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}

/* Next & Previous */
function nextVideo() {
  index = (index + 1) % videos.length;
  loadVideo(index);
}

function prevVideo() {
  index = (index - 1 + videos.length) % videos.length;
  loadVideo(index);
}

/* Progress */
video.addEventListener("timeupdate", () => {
  progress.value = (video.currentTime / video.duration) * 100;
});

progress.addEventListener("input", () => {
  video.currentTime = (progress.value / 100) * video.duration;
});

video.addEventListener("ended", nextVideo);

document.addEventListener("keydown", function (e) {
  if (e.target.tagName === "INPUT" || e.target.tagName === "SELECT") return;

  if (e.code === "Space") {
    e.preventDefault();
    togglePlay();
  }
  if (e.ctrlKey && e.key.toLowerCase() === "m") {
    e.preventDefault();
    toggleMute();
  }

  if (e.key.toLowerCase() === "f") {
    fullscreen();
  }
});

loadVideo(index);
