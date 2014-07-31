 
var playButton, nextButton, lastButton;
var instance;
 function init() {
    playButton = document.getElementById("playBtn");
    nextButton = document.getElementById("nextBtn");
    lastButton = document.getElementById("lastBtn");
    // if initializeDefaultPlugins returns false, we cannot play sound in this browser
    if (!createjs.Sound.initializeDefaultPlugins()) {return;}

    var audioPath = "http://localhost:8080/assets/audio/";
    var manifest = [
        {id:"Music", src:"18-machinae_supremacy-lord_krutors_dominion.ogg"},
        {id:"Thunder", src:"Thunder1.ogg"}
    ];

    createjs.Sound.alternateExtensions = ["mp3"];
    createjs.Sound.addEventListener("fileload", handleLoad);
    createjs.Sound.registerManifest(manifest, audioPath);
 //   instance = createjs.Sound.play("Music");
}

function handleLoad(event) {
    playButton.addEventListener("click", handleClick, false);
    nextButton.addEventListener("click", nextClick, false);
    lastButton.addEventListener("click", lastClick, false);
    playButton.className = "btn button playBtn";
}

function nextClick(event){
    createjs.Sound.play("Thunder");
}

function lastClick(event){
    createjs.Sound.play("Music");
}

function repeat(event){

}

function handleClick(event) {
    if(playButton.className == "btn button playBtn"){
        playButton.className = "btn button stopBtn"
        instance = createjs.Sound.play("Music");    
        var soundDur = instance.getDuration();
        document.getElementById("totalTime").textContent = soundDur;
    }else{
        playButton.className  = "btn button playBtn"
        createjs.Sound.stop("Music");
    }
    trackTime();
}

var instance;
var positionInterval;
var seeking = false;
var dragOffset;
var css = document.createElement("style");
css.type = "text/css";
function trackTime() {
    positionInterval = setInterval(function(event) {
        if(seeking) { return; }
      
       // css.innerHTML = "left: "+        

//        document.getElementById("thumb").style.left = instance.getPosition()/instance.getDuration() * 16 +"px;";// = "<div id="+"thumb"+" style="+"left: "+instance.getPosition()/instance.getDuration() * 16 +"px;";        
        //var thm = document.getElementById("thumb");
    }, 30);
}