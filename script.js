let currentsong = new Audio();
let songs = [];
let currfolder = "";
let currentIndex = 0;

const songMap = {
  desi_songs: [
    "Desi Hood.mp3",
    "Dhaka Sidhu.mp3",
    "VelPunra.mp3"
  ],
  english_songs: [
    "Band4Band CENTRAL Cee - Copy.mp3",
    "Doja Central Cee - Copy.mp3",
    "Shut the fuck up ap dhilon - Copy.mp3",
    "Sprinter Central Cee.mp3"
  ]
};

async function getsongs(folder) {
  currfolder = folder;
  songs = songMap[folder] || [];
  currentIndex = 0;

  let songUl = document.querySelector(".songlist ul");
  songUl.innerHTML = "";

  for (const song of songs) {
    songUl.innerHTML += `<li>
      <img style="width: 20px;" class="invert" src="music.svg" alt="">
      <div class="info">
        <div>${decodeURIComponent(song).replaceAll('_', ' ')}</div>
        <div>Song Artist</div>
      </div>
      <div class="playnow">
        <span>PlayNow</span>
        <img style="width: 20px;" class="invert" src="play.svg" alt="">
      </div>
    </li>`;
  }

  Array.from(document.querySelector(".songlist ul").getElementsByTagName("li")).forEach(
    (e, i) => {
      e.addEventListener("click", () => {
        currentIndex = i;
        playmusic(songs[currentIndex]);
      });
    }
  );
}

const playmusic = (track, pause = false) => {
  currentsong.src = `./songs/${currfolder}/` + track;

  if (!pause) {
    currentsong.play();
    play.src = "pause.svg";
  }

  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.querySelector(".songTime").innerHTML = "00:00 / 00:00";
};

async function main() {
  await getsongs("desi_songs");
  playmusic(songs[currentIndex], true);

  const albums = [
    { folder: "desi_songs", title: "Desi Songs", description: "Sidhu, AP Dhillon & More" },
    { folder: "english_songs", title: "English Rap", description: "Central Cee Collection" }
  ];

  let cardContainer = document.querySelector(".cardContainer");
  cardContainer.innerHTML = "";

  for (let album of albums) {
    cardContainer.innerHTML += `
      <div data-folder="${album.folder}" class="card">
        <div class="play">
          <div class="icon-circle">
            <svg xmlns="http://www.w3.org/2000/svg" fill="black" viewBox="0 0 24 24" stroke-width="1.5" stroke="black" class="icon">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
            </svg>
          </div>
        </div>
        <img src="./songs/${album.folder}/cover.jpg" alt="">
        <h2>${album.title}</h2>
        <p>${album.description}</p>
      </div>`;
  }

  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    e.addEventListener("click", async () => {
      const ifolder = e.dataset.folder;
      await getsongs(ifolder);
      playmusic(songs[currentIndex]);
    });
  });

  // Play / Pause
  play.addEventListener("click", () => {
    if (currentsong.paused) {
      currentsong.play();
      play.src = "pause.svg";
    } else {
      currentsong.pause();
      play.src = "play.svg";
    }
  });

  // Time Update
  currentsong.addEventListener("timeupdate", () => {
    document.querySelector(".songTime").innerHTML = `${Math.floor(currentsong.currentTime / 60)
      .toString()
      .padStart(2, "0")}:${Math.floor(currentsong.currentTime % 60)
      .toString()
      .padStart(2, "0")} / ${Math.floor(currentsong.duration / 60)
      .toString()
      .padStart(2, "0")}:${Math.floor(currentsong.duration % 60)
      .toString()
      .padStart(2, "0")}`;
    document.querySelector(".circle").style.left =
      (currentsong.currentTime / currentsong.duration) * 100 + "%";
  });

  // Seekbar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / document.querySelector(".seekbar").offsetWidth);
    currentsong.currentTime = percent * currentsong.duration;
    document.querySelector(".circle").style.left = percent * 100 + "%";
  });

  // Hamburger & Close
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
  });

  // Previous
  previous.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      playmusic(songs[currentIndex]);
    }
  });

  // Next
  next.addEventListener("click", () => {
    if (currentIndex < songs.length - 1) {
      currentIndex++;
      playmusic(songs[currentIndex]);
    }
  });

  // Volume Range
  document.querySelector(".range input").addEventListener("input", (e) => {
    currentsong.volume = parseInt(e.target.value) / 100;
  });

  // Mute Toggle
  document.querySelector(".volume > img").addEventListener("click", () => {
    if (currentsong.muted) {
      currentsong.muted = false;
      document.querySelector(".volume > img").src = "volume.svg";
      document.querySelector(".range input").value = currentsong.volume * 100;
    } else {
      currentsong.muted = true;
      document.querySelector(".volume > img").src = "mute.svg";
      document.querySelector(".range input").value = 0;
    }
  });
}

main();
