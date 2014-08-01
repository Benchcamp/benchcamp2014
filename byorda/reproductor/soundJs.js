var bar, slider, musicPath, playing, intervalID, isMusicPlaying, isLoop, isRandom;

musicPath = "assets/resources/music/";
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

function registrarManifest() {
    var httpRequest = new XMLHttpRequest();
    var retorno;
    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState === 4) { //DONE
            if (httpRequest.status === 200) { //SUCCESS
                procesarManifest(JSON.parse(httpRequest.responseText));
            }
        }
    };
    httpRequest.open('GET', jsonCanciones);
    httpRequest.send();
}

function procesarManifest (jsonManifest) {
	var manifest = null;
	createjs.Sound.registerManifest(manifest, musicPath);
}

function init() {
	if (createjs.Sound.initializeDefaultPlugins()) {
		sliderInit();
		//registrarManifest();
		createjs.Sound.alternateExtensions = ["mp3", "ogg"];
		createjs.Sound.addEventListener("fileload", loadHandler);
	}
	
}

// *** SLIDER *** //
function sliderInit (argument) {
	bar = document.getElementById('bar');
	slider = document.getElementById('slider');
	bar.addEventListener('mousedown', clickSlider, false);
	bar.addEventListener('mouseup', finDeslizar, false);
}

function clickSlider(event){
	var porcentaje = ((((event.clientX - bar.offsetLeft) / bar.offsetWidth)).toFixed(2)) * 100;
	bar.addEventListener('mousemove', deslizarSlider, false);	
	slider.style.width = (porcentaje) + '%';	
}

function deslizarSlider(event){
	var porcentaje = ((((event.clientX - bar.offsetLeft) / bar.offsetWidth)).toFixed(2)) * 100;
	slider.style.width = (porcentaje) + '%';
}

function finDeslizar(event){
	var porcentaje = ((((event.clientX - bar.offsetLeft) / bar.offsetWidth)).toFixed(2)) * 100;
	bar.removeEventListener('mousemove', deslizarSlider, false);
	slider.style.width = (porcentaje) + '%';
	moverPosicionCancion(porcentaje);
}

function moverPosicionCancion(porcentaje) {
	if (playing !== null) {
		var posicionMs = playing.getDuration() * porcentaje / 100;
		playing.setPosition(posicionMs);
	}
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
			//TODO: El formato... UPDATE: se arregla con el refactoring de la carga de canciones.
			createjs.Sound.registerSound(musicPath + nombreCancion + ".mp3", "playing", musicPath);
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
	
	if (!isRandom)
		pistaSiguiente();
	else
		pistaRandom();
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
		setInterval(actualizarTiempoYSlider, 500);
	}
}

function actualizarTiempoYSlider() {
	if (playing !== null) {
		var lblActual = document.getElementById("lblTiempoActual");
		lblActual.innerHTML = formatearTiempoReproduccion(playing.getPosition());
		
		var porcentajeAvance = playing.getPosition() * 100 / playing.getDuration();
		slider.style.width = porcentajeAvance + "%";
	}
}

// *** CAMBIO DE PISTA *** //
function pistaAnterior() {
    var filaSeleccionada;
    
    filaSeleccionada = document.querySelector(".selected");
    
    if (filaSeleccionada !== null && filaSeleccionada.id > 1) {
        seleccionarFilaPorID(parseInt(filaSeleccionada.id) - 1);
        cambiarCancion();
    }
}

function pistaSiguiente() {
    var filaSeleccionada, cantFilas;

    cantFilas = document.getElementById("tabla-contenido").childNodes.length - 1;
    filaSeleccionada = document.querySelector(".selected");
    
    if (filaSeleccionada !== null && filaSeleccionada.id < cantFilas) {
        seleccionarFilaPorID(parseInt(filaSeleccionada.id) + 1);
        cambiarCancion();
    }
}

function pistaRandom() {
    var cantFilas, filaActual, filaNueva, filaEsValida;
    
    filaActual = parseInt(document.querySelector(".selected").id);
    cantFilas = document.getElementById("tabla-contenido").childNodes.length - 1;
    
    filaEsValida = false;
    while(!filaEsValida) {
        filaNueva = Math.floor(Math.random() * cantFilas + 1);
        filaEsValida = filaNueva !== filaActual;
    }

    seleccionarFilaPorID(filaNueva);
    cambiarCancion();
}

function resetearTiempos() {
    var lblTotal = document.getElementById("lblTiempoTotal");
    var lblActual = document.getElementById("lblTiempoActual");
    lblTotal.innerHTML = "00:00";
    lblActual.innerHTML = "00:00";
}