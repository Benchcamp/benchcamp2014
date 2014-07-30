 
var playButton = null;
 function init() {
    playButton = document.getElementById("playBtn");
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
            }
 
            /*function handleLoad(event) {
                createjs.Sound.play(event.src);*/

function handleLoad(event) {
    playButton.addEventListener("click", handleClick, false);
    playButton.className = "btn button playBtn";
}

function handleClick(event) {
    if(playButton.textContent == "p"){
        playButton.textContent = "s";
        playButton.className = "btn button stopBtn"
        instance = createjs.Sound.play("Music");
        createjs.Sound.play("Thunder");    
    }else{
        playButton.textContent = "p";
        playButton.className  = "btn button playBtn"
        createjs.Sound.stop("Music");
        createjs.Sound.stop("Thunder");
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
      
        //css.innerHTML = "left: "+instance.getPosition()/instance.getDuration() * 16 +"px;";        
        document.getElementById("thumb").innerHTML = "<div id="+"thumb"+" style="+"left: "+instance.getPosition()/instance.getDuration() * 16 +"px;";        
        //var thm = document.getElementById("thumb");
        //.css("left", instance.getPosition()/instance.getDuration() * 16);//document.getElementById("track").width());
    }, 30);
}