var audioPath, playing, intervalID, isMusicPlaying, isLoop, isRandom;

audioPath = "assets/resources/music/";
playing = null;
isMusicPlaying = false;

document.addEventListener("DOMContentLoaded", function(e) {
	document.getElementById("btnMute").addEventListener("click", toggleMute, false);
	document.getElementById("btnRepetir").addEventListener("click", toggleLoop, false);
	document.getElementById("btnRandom").addEventListener("click", toggleRandom, false);
	document.getElementById("btnPlayPausa").addEventListener("click", reproducirCancion, false);
	document.getElementById("btnAtras").addEventListener("click", pistaAnterior, false);
	document.getElementById("btnSiguiente").addEventListener("click", pistaSiguiente, false);
});

function init() {
	if (!createjs.Sound.initializeDefaultPlugins()) { return; }

	createjs.Sound.alternateExtensions = ["mp3", "ogg"];
	createjs.Sound.addEventListener("fileload", loadHandler);
}

// *** REPRODUCCION *** //
function reproducirCancion () {
	var btnPlayPausa, cancionSeleccionada, nombreCancion;

	btnPlayPausa = document.getElementById("btnPlayPausa");

	if (playing !== null) {
		if (isMusicPlaying) pausar(); else continuar();
	} else {
		cancionSeleccionada = document.querySelectorAll("tr.selected td");
		if (cancionSeleccionada[0] !== null) {
			nombreCancion = cancionSeleccionada[0].innerHTML
			//TODO: El formato...
			createjs.Sound.registerSound(audioPath + nombreCancion + ".mp3", "playing", audioPath);
		}
	}
}

function pausar() {
	playing.pause();
	btnPlayPausa.value = ">";
	isMusicPlaying = false;
}

function continuar() {
	playing.resume();
	btnPlayPausa.value = "||";
	isMusicPlaying = true;
}

function loadHandler() {
	playing = createjs.Sound.play("playing");
	playing.addEventListener("complete", playingComplete);
	mostrarTiempos();
	document.getElementById("btnPlayPausa").value = "||";
	isMusicPlaying = true;
}

function playingComplete () {
	createjs.Sound.stop();
	createjs.Sound.removeAllSounds();
	playing = null;
	btnPlayPausa.value = ">";
	isMusicPlaying = false;
}

// *** TOGGLE *** //
function toggleMute(){
	var mute, btnMute;
	
	mute = createjs.Sound.getMute();
	btnMute = document.getElementById("btnMute");

	createjs.Sound.setMute(!mute);
	btnMute.style.color = mute ? "black" : "red";
}

function toggleLoop(){
	var btnLoop = document.getElementById("btnRepetir");
	isLoop = !isLoop;
	btnLoop.style.color = isLoop ? "red" : "black";
}

function toggleRandom(){
	var btnRandom = document.getElementById("btnRandom");
	isRandom = !isRandom;

	if (isRandom) {
		btnRandom.style.color = "red";
		document.getElementById("btnAtras").removeEventListener("click", pistaAnterior, false);
		document.getElementById("btnSiguiente").removeEventListener("click", pistaSiguiente, false);

		document.getElementById("btnAtras").addEventListener("click", pistaRandom, false);
		document.getElementById("btnSiguiente").addEventListener("click", pistaRandom, false);
	} else {
		btnRandom.style.color = "black";
		document.getElementById("btnAtras").removeEventListener("click", pistaRandom, false);
		document.getElementById("btnSiguiente").removeEventListener("click", pistaRandom, false);

		document.getElementById("btnAtras").addEventListener("click", pistaAnterior, false);
		document.getElementById("btnSiguiente").addEventListener("click", pistaSiguiente, false);
	}
}

function cambiarCancion() {
	createjs.Sound.stop();
	playing = null;
	isMusicPlaying = false;
	resetearTiempos();
	btnPlayPausa.value = ">";
	reproducirCancion();
}

// *** TIEMPOS Y SLIDER *** //
function mostrarTiempos() {
	if (playing !== null) {
		var lblTotal = document.getElementById("lblTiempoTotal");

		lblTotal.innerHTML = formatearTiempoReproduccion(playing.getDuration());
		setInterval(actualizarTiempoActual, 500);
	}
}

function actualizarTiempoActual() {
	if (playing !== null) {
		var lblActual = document.getElementById("lblTiempoActual");
		lblActual.innerHTML = formatearTiempoReproduccion(playing.getPosition());	
	}
}