document.addEventListener("DOMContentLoaded", function(e) {
	document.getElementById("btnMute").addEventListener("click", muteAll, false);
});

function init() {
	if (!createjs.Sound.initializeDefaultPlugins()) {return;}

	var audioPath = "http://localhost:8080/assets/";
	var manifest = [
		{id:"Music", src:"05-Binrpilot-Underground.mp3"}
	];

	createjs.Sound.alternateExtensions = ["mp3"];
	createjs.Sound.addEventListener("fileload", handleLoad);
	createjs.Sound.registerManifest(manifest, audioPath);
}

function handleLoad(event) {
	createjs.Sound.play(event.src);
}

function muteAll(){
	var mute = createjs.Sound.getMute();
	createjs.Sound.setMute(!mute);
}