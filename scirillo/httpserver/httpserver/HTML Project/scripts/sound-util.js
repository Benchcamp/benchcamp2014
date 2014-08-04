 
var playButton, nextButton, lastButton, randomButton, repeatButton;
var instance;
var currentSong;
var songIndex = 0;
var repeat = false;
var manifest = [
    {id:"Music", src:"18-machinae_supremacy-lord_krutors_dominion.ogg"},
    {id:"Thunder", src:"Thunder1.ogg"},
    {id:"Humm", src:"Humm.ogg"}
];
 function init() {
    playButton = document.getElementById("playBtn");
    nextButton = document.getElementById("nextBtn");
    lastButton = document.getElementById("lastBtn");
    randomButton = document.getElementById("randomBtn");
    repeatButton = document.getElementById("repeatBtn");

    if (!createjs.Sound.initializeDefaultPlugins()) {return;}
    var audioPath = "http://localhost:8080/httpserver/httpserver/assets/audio/";

    createjs.Sound.alternateExtensions = ["mp3"];
    createjs.Sound.addEventListener("fileload", handleLoad);
    createjs.Sound.registerManifest(manifest, audioPath);
    var bar = document.getElementById('bar');
    var slider = document.getElementById('slider');
    bar.addEventListener('mousedown', clickSlider, false);
    bar.addEventListener('mouseup', finDeslizar, false);
}

function handleLoad(event) {
    playButton.addEventListener("click", playClick, false);
    nextButton.addEventListener("click", nextClick, false);
    lastButton.addEventListener("click", lastClick, false);
    randomButton.addEventListener("click", randomClick, false);
    repeatButton.addEventListener("click", rapeatClick, false);
    playButton.className = "btn button playBtn";
}

function nextClick(event){
    createjs.Sound.stop(currentSong)
    if(songIndex < manifest.length - 1){
        songIndex++;    
    }    
    playSong();  
}

function lastClick(event){
 createjs.Sound.stop(currentSong)
    if(songIndex > 0){
        songIndex--;    
    }    
    playSong();  
}

function rapeatClick(event){
    if(!repeat){      
        this.style.backgroundColor = '#f3f8aa';
        repeat = true;       
    }else{
        this.style.backgroundColor = 'buttonface';    
        repeat = false;
    }
}

function randomClick(event){
    songIndex = getRandomInt(0, manifest.length);
    playSong();
}

function playSong(){
    setCurrentRow();
    playButton.className = "btn button stopBtn"
    instance = createjs.Sound.play(manifest[songIndex].id);    
    instance.addEventListener("complete", handleComplete);
    currentSong = manifest[songIndex].id;    
    document.getElementById("totalTime").textContent = parseTime(instance.getDuration());   
    trackTime();
}

function handleComplete(event){
    if(repeat){
        playSong();
    }else{
        playButton.className  = "btn button playBtn"
    }
}

function stopSong(){
   playButton.className  = "btn button playBtn"
   createjs.Sound.stop(manifest[songIndex].id);   
}

function parseTime(tmeMs){
    var min = (tmeMs/1000/60) << 0;
    var sec = Math.round((tmeMs/1000) % 60);
    return(min + ':' + sec);
}

function playClick(event) {
    if(playButton.className == "btn button playBtn"){
       playSong();
    }else{
        stopSong();
    }   
}

var positionInterval;
var seeking = false;
var dragOffset;
function trackTime() {
    positionInterval = setInterval(function(event) {
        if(seeking) { return; }
            document.getElementById("actualTime").textContent = parseTime(instance.getPosition());
            slider.style.width = ((instance.getPosition()*100)/instance.getDuration()) + '%';
    }, 30);
}