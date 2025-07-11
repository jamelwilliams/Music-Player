// Music data
const songs = [
  {
    title: "Nothing even Matters",
    artist: "Lauryn Hill",
    cover: "imgs/download.jpeg",
    src: "audio/Nothing Even Matters.mp3",
  },
  {
    title: "Didn't Cha Know",
    artist: "Erykah Badu",
    cover: "imgs/Sleeve-for-Mamas-Gun-by-E-007.avif",
    src: "audio/Erykah Badu - Didn't Cha Know.mp3",
  },
  {
    title: "Through The Wire",
    artist: "Kanye West",
    cover: "imgs/Kanyewest_collegedropout.jpg",
    src: "audio/Through the Wire (Clean) - Kanye West.mp3",
  },
];

// DOM elements
const audio = document.getElementById("audio");
const coverImage = document.getElementById("cover-image");
const songTitle = document.getElementById("song-title");
const songArtist = document.getElementById("song-artist");
const progress = document.getElementById("progress");
const progressContainer = document.getElementById("progress-container");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");
const playBtn = document.getElementById("play-btn");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const shuffleBtn = document.getElementById("shuffle-btn");
const playlistEl = document.getElementById("playlist");

const volumeSlider = document.getElementById("volume-slider");

// Set default volume
audio.volume = 1;

// Change audio volume when slider is used
volumeSlider.addEventListener("input", () => {
  audio.volume = volumeSlider.value;
});
// Current song index
let currentSongIndex = 0;
let isShuffle = false;

// Initialize the player
function initPlayer() {
  loadSong(songs[currentSongIndex]);
}

// Load song
function loadSong(song) {
  songTitle.textContent = song.title;
  songArtist.textContent = song.artist;
  coverImage.src = song.cover;
  audio.src = song.src;

  // Reset progress bar (start of song)
  progress.style.width = "0%";
  currentTimeEl.textContent = "0:00";

  // Wait for metadata to load before displaying duration
  audio.addEventListener("loadedmetadata", () => {
    durationEl.textContent = formatTime(audio.duration);
  });
}

// Format time (seconds to mm:ss)
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
}

// Play song
function playSong() {
  playBtn.innerHTML = "<i>⏸</i>";
  playBtn.title = "Pause";
  audio.play();
}

// Pause song
function pauseSong() {
  playBtn.innerHTML = "<i>▶</i>";
  playBtn.title = "Play";
  audio.pause();
}

// Previous song
function prevSong() {
  currentSongIndex--;
  if (currentSongIndex < 0) {
    currentSongIndex = songs.length - 1;
  }
  loadSong(songs[currentSongIndex]);
  playSong();
  updateActivePlaylistItem();
}

// Next song
function nextSong() {
  if (isShuffle) {
    shuffleSong();
    return;
  }

  currentSongIndex++;
  if (currentSongIndex > songs.length - 1) {
    pauseSong();
    currentSongIndex--;
    return;
  }
  loadSong(songs[currentSongIndex]);
  playSong();
  updateActivePlaylistItem();
}

// Shuffle songs
function shuffleSong() {
  let newIndex;
  do {
    newIndex = Math.floor(Math.random() * songs.length);
  } while (newIndex === currentSongIndex && songs.length > 1);

  currentSongIndex = newIndex;
  loadSong(songs[currentSongIndex]);
  playSong();
  updateActivePlaylistItem();
}

// Update progress bar
function updateProgress(e) {
  const { duration, currentTime } = e.srcElement;
  const progressPercent = (currentTime / duration) * 100;
  progress.style.width = `${progressPercent}%`;
  currentTimeEl.textContent = formatTime(currentTime);
}

// Set progress bar when clicked
function setProgress(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;
  audio.currentTime = (clickX / width) * duration;
}

// Update active playlist item
function updateActivePlaylistItem() {
  const playlistItems = document.querySelectorAll(".playlist-item");
  playlistItems.forEach((item, index) => {
    if (index === currentSongIndex) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });
}

// Event listeners
playBtn.addEventListener("click", () => {
  const isPlaying = playBtn.innerHTML.includes("⏸");
  if (isPlaying) {
    pauseSong();
  } else {
    playSong();
  }
});

prevBtn.addEventListener("click", prevSong);
nextBtn.addEventListener("click", nextSong);

shuffleBtn.addEventListener("click", () => {
  isShuffle = !isShuffle;
  shuffleBtn.style.color = isShuffle ? "#1db954" : "white";
});

audio.addEventListener("timeupdate", updateProgress);
audio.addEventListener("ended", nextSong);
progressContainer.addEventListener("click", setProgress);

// Initialize
initPlayer();
