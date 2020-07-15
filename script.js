/*---------------------------CREDITS------------------------- */
/*
 * ABOUT: Music Player with Vanila Javascript, Html and CSS
 * AUTHOR: SMRUTIKANT NAYAK
 * YEAR:2020
 * smrutigml@gmail.com
 * LinkedIn:https://www.linkedin.com/in/smrutikant-nayak-4a833345/
 */
/*-----------------------------------------------------------*/

/*Defining required constants*/

const themes = ["galaxy1", "galaxy2", "tulip1", "tulip2", "tulip3", "music1"];
const trackPath = "tracks";
const lyricsPath = "lyrics";
const clipartPath = "clipart";

var repeatVal = 0;
var suffleTracks = false;
var volumeDragged = false;
//
var trackList = [
  [
    "The many miles we walk", //Song name
    "The many miles we walk", //The lyrics file name(must be a text file)
    "The many miles we walk", //The Clipart file name(must be a .jpg file)
    "Red Dead Redemption 2: The Killa - Daniel Lanois", //The credit Notes
  ],
  [
    "Some say love",
    "Some say love",
    "Some say love",
    "Phosphorescent - Song For Zula : Phear Creative",
  ],
  [
    "On the train ride home",
    "On the train ride home",
    "On the train ride home",
    "The Paper Kites - On The Train Ride Home (Official Music)",
  ],
  [
    "All we know",
    "All we know",
    "All we know",
    "The Chainsmokers - All We Know (Audio) : Phoebe Ryan",
  ],
];

const fixedTrackList = trackList; // Needed for suffle

var trackPointer = 0;

const currentTheme = "galaxy1"; //Default theme

/*Getting all required element selectors*/
const theBody = document.body;
const navexposer = document.getElementById("nav-exposer-btn");
const leftnavbar = document.getElementById("leftNavBar");
const changetheme = document.getElementById("change-theme");
const searchTrack = document.getElementById("searchtrack");
const trackListContainer = document.getElementById("playlist");
const audiotrack = document.getElementById("track-on-wheel");
const audioPlayPause = document.getElementById("play-pause-btn");
const audioNext = document.getElementById("next");
const audioPrev = document.getElementById("prev");
const lyricsExposer = document.getElementById("lyricsExposer");
const lyricsHolder = document.getElementById("lyricsHolder");
const socialHolder = document.getElementById("social");
const ltext = document.getElementById("ltext");
const lyricsContent = document.getElementById("lyrics-content");
const clipartThumb = document.getElementById("clipart");
const songnameHolder = document.getElementById("songname");
const songInfoHolder = document.getElementById("songinf");
const progressBar = document.getElementById("progress-bar-holder");
const progress = document.getElementById("progress");
const begnTime = document.getElementById("begnTime");
const curTime = document.getElementById("curTime");
const endTime = document.getElementById("endTime");
const thetracks = document.getElementsByClassName("play-list-items");
const repeatTrack = document.getElementById("repeat-song");
const repeatCurrentTxtHolder = document.getElementById("repeatcurrent");
const suffleTrack = document.getElementById("suffle");
const volumeControlHolder = document.getElementById("volumebar-holder");
const songVolumelevel = document.getElementById("volumecontrol");

//Secondary controls

const secondaryPlayPause = document.getElementById("secondary-play");
const secondaryPrev = document.getElementById("secondary-prev");
const secondaryNext = document.getElementById("secondary-next");

var repeatAll = false;
var repeatCurrent = false;

/* Adding all event listners */

navexposer.addEventListener("click", () =>
  leftnavbar.classList.toggle("opened")
);

changetheme.addEventListener("click", () => {
  let themeImg = changeTheme();
  let pathofImg = `url('img/themes/${themeImg}.jpg')`;
  document.body.style.backgroundImage = pathofImg;
});

//Filter tracks

searchTrack.addEventListener("keyup", () => {
  var searchVal = searchTrack.value;
  var filter, ul, li, i, txtValue;
  filter = searchVal.toUpperCase();
  ul = document.getElementById("playlist");
  li = ul.getElementsByTagName("li");
  for (i = 0; i < li.length; i++) {
    txtValue = li[i].innerHTML;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
  }
});

lyricsExposer.addEventListener("click", () => {
  lyricsHolder.classList.toggle("lyrics-expanded");
  lyricsExposer.classList.toggle("expanded");
  setTimeout(() => {
    socialHolder.classList.toggle("lyrics-opened");
  }, 400);

  if (ltext.innerHTML == "Show Lyrics...") {
    ltext.innerHTML = "Hide Lyrics...";
  } else {
    ltext.innerHTML = "Show Lyrics...";
  }
});

//Play/Pause button click

audioPlayPause.addEventListener("click", () => {
  const paused = audioPlayPause.classList.contains("fa-play");
  if (paused) {
    playTrack();
  } else {
    pauseTrack();
  }
});

//Play next song
audioNext.addEventListener("click", () => {
  trackPointer++;
  if (trackPointer >= trackList.length) {
    trackPointer = 0;
  }
  audiSetAll(trackPointer);
});

//Play previous song
audioPrev.addEventListener("click", () => {
  trackPointer--;
  if (trackPointer <= 0) {
    trackPointer = 0;
  }
  audiSetAll(trackPointer);
});

const audiSetAll = (trackPointer, first = false) => {
  songnameHolder.innerHTML = trackList[trackPointer][0];
  songInfoHolder.innerHTML = trackList[trackPointer][3];

  let lyricsP = `${lyricsPath}/${trackList[trackPointer][1]}.txt`;
  getLinesfromLyrics(lyricsP);

  clipartThumbImg = `${clipartPath}/${trackList[trackPointer][2]}.jpg`;
  clipartThumb.src = clipartThumbImg;

  absoluteTrackPath = `${trackPath}/${trackList[trackPointer][0]}.mp3`;
  audiotrack.src = absoluteTrackPath;

  if (!first) {
    removePlayPauseClass();
    playTrack();
  }

  loadAudioTimes();
};

progressBar.addEventListener("click", function (e) {
  var bcr = this.getBoundingClientRect();
  const percentage = (e.clientX - bcr.left) / bcr.width;
  progress.style.width = `${percentage * 100}%`;
  var per = `${percentage * 100}%`;
  const audioDuration = audiotrack.duration;
  audiotrack.currentTime = audioDuration * percentage;
});

progressBar.addEventListener("mousemove", function (e) {
  var bcr = this.getBoundingClientRect();
  const percentage = (e.clientX - bcr.left) / bcr.width;
  var per = `${percentage * 100}%`;
  const audioDuration = audiotrack.duration;
  timeto = audioDuration * percentage;
  var minutes = Math.floor(timeto / 60);
  var seconds = timeto - minutes * 60;
  if (Math.round(seconds) == 60) {
    seconds = "00";
    minutes = ++minutes;
  }

  curTime.innerHTML = pad(minutes, 2) + ":" + pad(Math.round(seconds), 2);
});

const fillProgressBar = () => {
  var currentTime = audiotrack.currentTime;
  const audioDuration = audiotrack.duration;
  progress.style.width = `${(currentTime / audioDuration) * 100}%`;

  var minutes = Math.floor(audiotrack.currentTime / 60);
  var seconds = audiotrack.currentTime - minutes * 60;
  if (Math.round(seconds) == 60) {
    seconds = "00";
    minutes = ++minutes;
  }
  curTime.innerHTML = pad(minutes, 2) + ":" + pad(Math.round(seconds), 2);
};

audiotrack.addEventListener("timeupdate", fillProgressBar);

//Repeat Event Handeller

repeatTrack.addEventListener("click", () => {
  audiotrack.loop = false;
  repeatVal++;
  repeatCurrentTxtHolder.innerHTML = "";

  if (repeatVal == 1) {
    repeatAll = true;
    repeatCurrent = false;
    repeatCurrentTxtHolder.innerHTML = "Repeat all";
  } else if (repeatVal == 2) {
    repeatCurrent = true;
    repeatAll = false;
    repeatCurrentTxtHolder.innerHTML = "Repeat this";
    audiotrack.loop = true; // Set loop to true
  } else if (repeatVal == 3) {
    repeatCurrent = false;
    repeatAll = false;
    repeatVal = 0;
  }
});

//Suffle Handeller

suffleTrack.addEventListener("click", () => {
  if (suffleTracks == false) {
    suffleTracks = true;
  } else {
    suffleTracks = false;
  }

  if (suffleTracks) {
    console.log("suffled");
    sufflePlaylist();
    repeatCurrent = false;
    repeatAll = false;
    audiotrack.loop = false;
  } else {
    trackList = fixedTrackList;
    console.log("desuffled");
  }
  console.log(trackList);
});

const sufflePlaylist = () => {
  var currentIndex = trackList.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = trackList[currentIndex];
    trackList[currentIndex] = trackList[randomIndex];
    trackList[randomIndex] = temporaryValue;
  }
};

//Volume Handeller

volumeControlHolder.addEventListener("mousedown", function (e) {
  volumeDragged = true;
  var cntrl = this.getBoundingClientRect();
  setVolume(cntrl, e);
});

document.addEventListener("mouseup", function (e) {
  if ((e.target = !volumeControlHolder)) volumeDragged = false;
});

volumeControlHolder.addEventListener("mousemove", function (e) {
  if (volumeDragged) {
    var cntrl = this.getBoundingClientRect();
    setVolume(cntrl, e);
  }
});

const setVolume = function (cntrl, theEvent) {
  volPercentage = (cntrl.bottom - theEvent.clientY) / cntrl.height;
  audiotrack.volume = volPercentage;
  songVolumelevel.style.height = volPercentage * 100 + "%";
};

/*
Secondary controls Handellers:
---------------------------------
While Lyrics tab is opened on tablet/mobile Devices, it covers the entire screen. 
We lose control to play/pause the track. 
This will ensure we have a secondary control bar to play/pause, play next/previous songs. 

*/
secondaryPlayPause.addEventListener("click", () => {
  audioPlayPause.click();
});

secondaryPrev.addEventListener("click", () => {
  audioPrev.click();
});
secondaryNext.addEventListener("click", () => {
  audioNext.click();
});

//When a track ends
audiotrack.addEventListener("ended", function () {
  if (trackPointer == trackList.length - 1 && repeatAll == false) {
    audiSetAll(0, true, false);
    pauseTrack();
    return false;
  }
  if (repeatCurrent == false) {
    audioNext.click();
  } else if (repeatAll == true && trackPointer == trackList.length - 1) {
    trackPointer = 0;
    audiSetAll(trackPointer);
  }
});

const playTrack = () => {
  audioPlayPause.classList.remove("fa-play");
  audioPlayPause.classList.add("fa-pause");
  secondaryPlayPause.classList.remove("fa-play");
  secondaryPlayPause.classList.add("fa-pause");
  audiotrack.play();
  clipartThumb.style.animationPlayState = "running";
};
const pauseTrack = () => {
  audioPlayPause.classList.remove("fa-pause");
  audioPlayPause.classList.add("fa-play");
  secondaryPlayPause.classList.remove("fa-pause");
  secondaryPlayPause.classList.add("fa-play");
  audiotrack.pause();
  clipartThumb.style.animationPlayState = "paused";
};
const removePlayPauseClass = () => {
  audioPlayPause.classList.remove("fa-pause");
  audioPlayPause.classList.remove("fa-play");
};
async function loadAudioTimes() {
  setTimeout(() => {
    begnTime.innerHTML = "00:00";
    var minutes = Math.floor(audiotrack.duration / 60);
    var seconds = audiotrack.duration - minutes * 60;
    endTime.innerHTML = pad(minutes, 2) + ":" + pad(Math.round(seconds), 2);
  }, 2000);
}

//functions

const changeTheme = () => themes[Math.floor(Math.random() * themes.length)]; //Get a random image from the themes list array

/*Finding Lyrics*/

async function getLinesfromLyrics(urlOfFile) {
  lyricsContent.innerHTML = "";
  for await (let line of lyricsFinder(urlOfFile)) {
    printLyricsLine(line);
  }
}

async function* lyricsFinder(fileURL) {
  const utf8Decoder = new TextDecoder("utf-8");
  const response = await fetch(fileURL);
  const reader = response.body.getReader();
  let { value: chunk, done: readerDone } = await reader.read();
  chunk = chunk ? utf8Decoder.decode(chunk) : "";

  const re = /\n|\r|\r\n/gm;
  let startIndex = 0;
  let result;

  for (;;) {
    let result = re.exec(chunk);
    if (!result) {
      if (readerDone) {
        break;
      }
      let remainder = chunk.substr(startIndex);
      ({ value: chunk, done: readerDone } = await reader.read());
      chunk = remainder + (chunk ? utf8Decoder.decode(chunk) : "");
      startIndex = re.lastIndex = 0;
      continue;
    }
    yield chunk.substring(startIndex, result.index);
    startIndex = re.lastIndex;
  }
  if (startIndex < chunk.length) {
    // last line didn't end in a newline char
    yield chunk.substr(startIndex);
  }
}

const printLyricsLine = (lyricsLine) => {
  const linetoPrint = `${lyricsLine}<br />`;
  lyricsContent.innerHTML = lyricsContent.innerHTML + linetoPrint;
};

const pad = (n, width, z) => {
  z = z || "0";
  n = n + "";
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
};

const addTrackstoPlayList = () => {
  var tracks = "";
  trackList.map((track, index) => {
    tracks += `<li class="full-width play-list play-list-items" track="${index}"><i class="fa fa-music" aria-hidden="true"></i>${track[0]}</li>`;
  });
  trackListContainer.innerHTML = tracks;
};

const loadTracksInList = () => {
  for (var i = 0; i < thetracks.length; i++) {
    thetracks[i].addEventListener("click", function (e) {
      trackPointer = this.getAttribute("track");
      audiSetAll(trackPointer);
      leftnavbar.classList.toggle("opened");
    });
  }
};

const init = () => {
  console.log(trackList);
  console.log(fixedTrackList);
  addTrackstoPlayList();
  audiSetAll(0, true); //Put the first song in queue
  loadTracksInList();
};

window.onload = function () {
  init();
};
