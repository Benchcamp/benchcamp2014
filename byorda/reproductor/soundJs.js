var audioPath, playing;

audioPath = "assets/resources/music/";
playing = null;

document.addEventListener("DOMContentLoaded", function(e) {
	document.getElementById("btnMute").addEventListener("click", toggleMute, false);
	document.getElementById("btnPlayPausa").addEventListener("click", reproducirCancion, false);
});

function init() {
	if (!createjs.Sound.initializeDefaultPlugins()) { return; }

	createjs.Sound.alternateExtensions = ["ogg"];
	createjs.Sound.addEventListener("fileload", loadHandler);
}

function reproducirCancion () {
	var btnPlayPausa, nombreCancion;

	btnPlayPausa = document.getElementById("btnPlayPausa");

	if (playing !== null) {
		if (btnPlayPausa.value == ">") {
			playing.resume();
			btnPlayPausa.value = "||";
		} else {
			playing.pause();
			btnPlayPausa.value = ">";
		}
		return;
	} else {
		nombreCancion = document.querySelectorAll("tr.selected td")[0].innerHTML;
		
		if (btnPlayPausa.value == ">") {
			if (playing === null) {
				createjs.Sound.addEventListener("fileload", loadHandler);
				createjs.Sound.registerSound(audioPath + nombreCancion + ".mp3", "playing", audioPath);
			} else {
				playing.resume();
			}
			btnPlayPausa.value = "||";
		}	
	}
}

function loadHandler() {
	playing = createjs.Sound.play("playing");
	playing.addEventListener("complete", playingComplete);
}

function playingComplete () {
	playing = null;
	createjs.Sound.stop();
	createjs.Sound.removeAllSounds();
	btnPlayPausa.value = ">";
}

function toggleMute(){
	var mute, btnMute;
	
	mute = createjs.Sound.getMute();
	btnMute = document.getElementById("btnMute");

	createjs.Sound.setMute(!mute);
	btnMute.style.color = mute ? btnMute.style.color = "black" : btnMute.style.color = "red";
}

function cambiarPista() {
    
}

