/*---------------------------CREDITS------------------------- */
/*
 * ABOUT: Music Player with Vanila Javascript, Html and CSS
 * AUTHOR: SMRUTIKANT NAYAK
 * YEAR:2020
 * smrutigml@gmail.com
 * LinkedIn:https://www.linkedin.com/in/smrutikant-nayak-4a833345/
 */

 /*-----------------------------------------------------------*/

/*Defining all required constants*/

const themes = ["galaxy1","galaxy2","tulip1","tulip2","tulip3","music1"];
const trackPath = "tracks";
const lyricsPath = "lyrics";
const clipartPath = "clipart";

const trackList = ["The many miles we walk","Some say love","On the train ride home","All we know"];
const lyricsFiles = ["The many miles we walk","Some say love","On the train ride home","All we know"];
const cliparts = ["The many miles we walk","Some say love","default","All we know"];
const creditds = [
                    "Red Dead Redemption 2: The Killa - Daniel Lanois",
                    "Phosphorescent - Song For Zula : Phear Creative",
                    "The Paper Kites - On The Train Ride Home (Official Music)",
                    "The Chainsmokers - All We Know (Audio) : Phoebe Ryan"
                 ]
var trackPointer = 0;

const currentTheme = "galaxy1";//Default theme

/*Getting all required element selectors*/

const navexposer            =       document.getElementById('nav-exposer-btn');
const leftnavbar            =       document.getElementById('leftNavBar');
const changetheme           =       document.getElementById('change-theme');
const searchTrack           =       document.getElementById('searchtrack');
const audiotrack            =       document.getElementById('track-on-wheel');
const audioPlayPause        =       document.getElementById('play-pause-btn');
const audioNext             =       document.getElementById('next');
const audioPrev             =       document.getElementById('prev');
const lyricsExposer         =       document.getElementById('lyricsExposer');
const lyricsHolder          =       document.getElementById('lyricsHolder');
const socialHolder          =       document.getElementById('social');
const ltext                 =       document.getElementById('ltext');
const lyricsContent         =       document.getElementById('lyrics-content');
const clipartThumb          =       document.getElementById('clipart');
const songnameHolder        =       document.getElementById('songname');
const songInfoHolder        =       document.getElementById('songinf');


/* Adding all event listners */

navexposer.addEventListener("click",()=> leftnavbar.classList.toggle('opened'));

changetheme.addEventListener("click",()=>{
  let themeImg = changeTheme();
  let pathofImg = `url('img/themes/${themeImg}.jpg')`;
  document.body.style.backgroundImage = pathofImg;
});


//Filter tracks

searchTrack.addEventListener("keyup", ()=>{
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
  lyricsHolder.classList.toggle('lyrics-expanded');
  lyricsExposer.classList.toggle('expanded');
  setTimeout(()=>{
    socialHolder.classList.toggle('lyrics-opened');
  },400);

  if(ltext.innerHTML == "Show lyrics..."){
    ltext.innerHTML = "Hide lyrics...";
  }else{
    ltext.innerHTML = "Show lyrics...";
  }

});

//Play/Pause button click

audioPlayPause.addEventListener("click", () => {
  const paused = audioPlayPause.classList.contains("fa-play");
  if(paused){
    playTrack();
  }else{
    pauseTrack();
  }
});

//Next Button Click
audioNext.addEventListener("click", ()=>{
  trackPointer++;
  if(trackPointer >= trackList.length){
    trackPointer = 0;
  }
  audiSetAll(trackPointer);
});

//Previous Button Click
audioPrev.addEventListener("click", ()=>{
  trackPointer--;
  if(trackPointer <= 0){
    trackPointer = 0;
  }
  audiSetAll(trackPointer);
});

const audiSetAll = (trackPointer,first=false) => {
  
  songnameHolder.innerHTML = trackList[trackPointer];
  songInfoHolder.innerHTML = creditds[trackPointer];

  let lyricsP = `${lyricsPath}/${trackList[trackPointer]}.txt`;
  getLinesfromLyrics(lyricsP);

  
  clipartThumbImg = `${clipartPath}/${cliparts[trackPointer]}.jpg`;
  clipartThumb.src = clipartThumbImg;

  absoluteTrackPath = `${trackPath}/${trackList[trackPointer]}.mp3`;
  audiotrack.src = absoluteTrackPath;

  if(!first){
    removePlayPauseClass();
    playTrack();
  }

};

audiotrack.addEventListener("ended", function(){
  audioNext.click();
});

const playTrack = () => {
  audioPlayPause.classList.remove("fa-play");
  audioPlayPause.classList.add("fa-pause");
  audiotrack.play();
}
const pauseTrack = () => {
  audioPlayPause.classList.remove("fa-pause");
  audioPlayPause.classList.add("fa-play");
  audiotrack.pause();
}
const removePlayPauseClass = () => {
  audioPlayPause.classList.remove("fa-pause");
  audioPlayPause.classList.remove("fa-play");
}

//functions

const changeTheme = () => themes[Math.floor(Math.random() * themes.length)]; //Get a random image from the themes list array

/*Finding Lyrics*/

async function getLinesfromLyrics(urlOfFile) {
  lyricsContent.innerHTML = '';
  for await (let line of lyricsFinder(urlOfFile)) {
    printLyricsLine(line);
  }
}

async function* lyricsFinder(fileURL) {
  const utf8Decoder = new TextDecoder('utf-8');
  const response = await fetch(fileURL);
  const reader = response.body.getReader();
  let { value: chunk, done: readerDone } = await reader.read();
  chunk = chunk ? utf8Decoder.decode(chunk) : '';

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
      chunk = remainder + (chunk ? utf8Decoder.decode(chunk) : '');
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


const printLyricsLine = lyricsLine => {
  const linetoPrint = `${lyricsLine}<br />`;
  lyricsContent.innerHTML = lyricsContent.innerHTML + linetoPrint;
}


audiSetAll(0,true); //Put the first song in queue 