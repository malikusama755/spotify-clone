let currentsong=new Audio();
let songs;
let currfolder;
async function getsongs(folder){
currfolder=folder;
let a =await fetch(`http://127.0.0.1:3000/${folder}/`)
let response = await a.text();
let div = document.createElement('div');
div.innerHTML = response;
let as =div.getElementsByTagName('a');
songs = [];
for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if(element.href.endsWith('.mp3')){
        songs.push(element.href.split(`/${folder}/`)[1]);
        }
    }

let songUl =document.querySelector('.songlist').getElementsByTagName('ul')[0];
songUl.innerHTML = '';
   for (const song of songs) {
    songUl.innerHTML=songUl.innerHTML+ `<li>
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
   Array.from(document.querySelector('.songlist').getElementsByTagName('li')).forEach(e => {
    e.addEventListener('click',element => {
        playmusic(e.querySelector('.info').firstElementChild.innerHTML);
    })
   })

}
const playmusic = (track,pause=false) => {
    currentsong.src=`/${currfolder}/` + track;
    if(!pause){
        currentsong.play();
        play.src='pause.svg';
    }
    document.querySelector('.songinfo').innerHTML=decodeURI(track);
    document.querySelector('.songTime').innerHTML='00:00 / 00:00';
    
    return songs;
    
}
async function displayalbums(){
let a =await fetch(`http://127.0.0.1:3000/songs/`)
let response = await a.text();
let div = document.createElement('div');
div.innerHTML = response;
let anchors=div.getElementsByTagName('a');
let array = Array.from(anchors);
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
  if (e.href.includes('/songs/') && !e.href.endsWith('.jpg') && !e.href.endsWith('.mp3') && !e.href.endsWith('.svg')) {


    let parts = e.href.split('/').filter(part => part); // removes empty strings
let folder = parts[parts.length - 1]; // last part

// If the last part is empty (like in `/songs/`), fallback to the second last
if (folder === '') {
  folder = parts[parts.length - 2];
}

// Skip if it's just "songs"
if (folder === 'songs') continue;

console.log("✅ Folder:", folder);

    // console.log(e.href);
    // let folder =e.href.split('/').slice(-2)[0];
    // console.log(folder);
    let a =await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`)
    let response = await a.json();
    cardcontainer = document.querySelector('.cardContainer');
    cardcontainer.innerHTML+=`<div data-folder="${folder}" class="card">
                        <div class="play">
                           <div class="icon-circle">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="black"
                                    viewBox="0 0 24 24" stroke-width="1.5" stroke="black"
                                  class="icon">
                                 <path stroke-linecap="round" stroke-linejoin="round"
                                 d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
                             </svg>
                            </div>
                        </div>
                        <img src="/songs/${folder}/cover.jpg" alt="">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>`;

  }

}
 Array.from( document.getElementsByClassName('card')).forEach(e => {
        e.addEventListener('click',async() =>{
            const ifolder = e.dataset.folder;
            await getsongs(`songs/${ifolder}`);
            playmusic(songs[0]);
        })
    })
}

async function main(){
    await getsongs('songs/english_songs');
    playmusic(songs[0],true);
    displayalbums();




   
  
  
  
  
    play.addEventListener('click', () => {
    if(currentsong.paused){
        currentsong.play();
        play.src='pause.svg';
    }else{
        currentsong.pause();
        play.src='play.svg';
    }
   })
   currentsong.addEventListener('timeupdate', () => {
    document.querySelector('.songTime').innerHTML = 
    `${Math.floor(currentsong.currentTime/60).toString().padStart(2, '0')}:${Math.floor(currentsong.currentTime%60).toString().padStart(2, '0')} / ${Math.floor(currentsong.duration/60).toString().padStart(2, '0')}:${Math.floor(currentsong.duration%60).toString().padStart(2, '0')}`;
    document.querySelector('.circle').style.left=(currentsong.currentTime/currentsong.duration)*100+'%';
   }
    );
    document.querySelector('.seekbar').addEventListener('click', (e) => {
        document.querySelector('.circle').style.left=(e.offsetX/document.querySelector('.seekbar').offsetWidth)*100+'%';
        currentsong.currentTime = (e.offsetX/document.querySelector('.seekbar').offsetWidth)*currentsong.duration;
        currentsong.pause();
        play.src='play.svg';

    });
    document.querySelector('.hamburger').addEventListener('click',()=>{
        document.querySelector('.left').style.left='0';
    })
    document.querySelector('.close').addEventListener('click',()=>{
        document.querySelector('.left').style.left='-120%';
    })
    previous.addEventListener('click',()=>{
    let index= songs.indexOf(currentsong.src.split('/').slice(-1)[0])
    if((index-1) >= 0){
        playmusic(songs[index-1])
    }
    })
    next.addEventListener('click',()=>{
    let index= songs.indexOf(currentsong.src.split('/').slice(-1)[0])
    if((index+1) < songs.length){
        playmusic(songs[index+1])
    }
  
    })
    document.querySelector('.range').getElementsByTagName('input')[0].addEventListener('click',(e)=>{
        currentsong.volume=parseInt(e.target.value)/100;

    })
    document.querySelector('.volume>img').addEventListener('click',()=>{
        if(currentsong.muted){
            currentsong.muted=false;
            document.querySelector('.volume>img').src='volume.svg';
            document.querySelector('.range').getElementsByTagName('input')[0].value=currentsong.volume*50;
        }else{
            currentsong.muted=true;
            document.querySelector('.volume>img').src='mute.svg';
            document.querySelector('.range').getElementsByTagName('input')[0].value=0;
        }
    })
  
}
main();