const video = document.getElementById("my-video");
const playPauseBtn = document.getElementById("play-pause-btn");
const forwardBtn = document.getElementById("forward-btn");
const backwardBtn = document.getElementById("backward-btn");
const rangeSlider = document.getElementById("range-slider");
const playbackSpeedBtn = document.getElementById("playback-speed-btn");
const qualityBtn = document.getElementById("quality-btn");

// Play/pause functionality
if (video.paused) {
  playPauseBtn.innerHTML = "<i class='fas fa-pause'></i>";
} else {
  playPauseBtn.innerHTML = "<i class='fas fa-play'></i>";
}
playPauseBtn.addEventListener("click", () => {
  if (video.paused) {
    video.play();
    playPauseBtn.innerHTML = "<i class='fas fa-pause'></i>";
  } else {
    video.pause();
    playPauseBtn.innerHTML = "<i class='fas fa-play'></i>";
  }
});
video.addEventListener("click", () => {
  if (video.paused) {
    video.play();
    playPauseBtn.innerHTML = "<i class='fas fa-pause'></i>";
  } else {
    video.pause();
    playPauseBtn.innerHTML = "<i class='fas fa-play'></i>";
  }
});
// Forward/backward functionality
forwardBtn.addEventListener("click", () => {
  video.currentTime += 10;
});

backwardBtn.addEventListener("click", () => {
  video.currentTime -= 10;
});

// Range slider functionality
rangeSlider.addEventListener("input", () => {
  video.currentTime = (video.duration / 100) * rangeSlider.value;
});

video.addEventListener("timeupdate", () => {
  const rangeValue = (100 / video.duration) * video.currentTime;
  rangeSlider.value = rangeValue;
});

// Playback speed functionality
let playbackSpeedIndex = 0;
const playbackSpeeds = [0.5, 1, 1.5, 2];

playbackSpeedBtn.addEventListener("click", () => {
  playbackSpeedIndex = (playbackSpeedIndex + 1) % playbackSpeeds.length;
  video.playbackRate = playbackSpeeds[playbackSpeedIndex];
});

// Quality functionality
const qualities = [
  { label: "1080p", src: "./videoplayback.mp4" },
  { label: "720p", src: "./videoplayback.mp4" },
  { label: "480p", src: "./videoplayback.mp4" },
];

qualityBtn.addEventListener("click", () => {
  const currentSrc = video.currentSrc;
  const currentQualityIndex = qualities.findIndex(
    (quality) => quality.src === currentSrc
  );
  const nextQualityIndex = (currentQualityIndex + 1) % qualities.length;
  const nextQuality = qualities[nextQualityIndex];
  video.src = nextQuality.src;
});

// Resize functionality
window.addEventListener("resize", () => {
  const aspectRatio = 16 / 9;
  const containerWidth = video.parentElement.offsetWidth;
  const containerHeight = containerWidth / aspectRatio;
  video.style.width = `${containerWidth}px`;
  video.style.height = `${containerHeight}px`;
});

// Initialize video size
window.dispatchEvent(new Event("resize"));
