var bar, slider, musicPath, playing, isMusicPlaying, isLoop, isRandom;

musicPath = "assets/resources/music/";
playing = null;
isMusicPlaying = false;

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("btnMute").addEventListener("click", toggleMute, false);
    document.getElementById("btnLoop").addEventListener("click", toggleLoop, false);
    document.getElementById("btnRandom").addEventListener("click", toggleRandom, false);
    document.getElementById("btnPlayPause").addEventListener("click", playSong, false);
    document.getElementById("btnPrev").addEventListener("click", previousTrack, false);
    document.getElementById("btnNext").addEventListener("click", nextTrack, false);
});

window.onload = function () {
    init();
}

/*
 function registrarManifest() {
 var httpRequest = new XMLHttpRequest();
 httpRequest.onreadystatechange = function () {
 if (httpRequest.readyState === 4) { //DONE
 if (httpRequest.status === 200) { //SUCCESS
 procesarManifest(JSON.parse(httpRequest.responseText));
 }
 }
 };
 httpRequest.open('GET', jsonSongs);
 httpRequest.send();
 }

 function procesarManifest(jsonManifest) {
 var manifest = null;
 createjs.Sound.registerManifest(manifest, musicPath);
 }
 */

function init() {
    if (createjs.Sound.initializeDefaultPlugins()) {
        sliderInit();
        //registrarManifest();
        createjs.Sound.alternateExtensions = ["mp3", "ogg"];
        createjs.Sound.addEventListener("fileload", loadHandler);
    }

}

// *** SLIDER *** //
function sliderInit() {
    bar = document.getElementById('bar');
    slider = document.getElementById('slider');
    bar.addEventListener('mousedown', clickSlider, false);
    bar.addEventListener('mouseup', endSlide, false);
}

function clickSlider(event) {
    var percentage = ((((event.clientX - bar.offsetLeft) / bar.offsetWidth)).toFixed(2)) * 100;
    bar.addEventListener('mousemove', moveSlider, false);
    slider.style.width = (percentage) + '%';
}

function moveSlider(event) {
    var percentage = ((((event.clientX - bar.offsetLeft) / bar.offsetWidth)).toFixed(2)) * 100;
    slider.style.width = (percentage) + '%';
}

function endSlide(event) {
    var percentage = ((((event.clientX - bar.offsetLeft) / bar.offsetWidth)).toFixed(2)) * 100;
    bar.removeEventListener('mousemove', moveSlider, false);
    slider.style.width = (percentage) + '%';
    moveSongPosition(percentage);
}

function moveSongPosition(porcentaje) {
    if (playing !== null) {
        var positionMs = playing.getDuration() * porcentaje / 100;
        playing.setPosition(positionMs);
    }
}

// *** REPRODUCCION *** //
function playSong() {
    var selectedSong, songName;
    if (playing !== null) {
        if (isMusicPlaying) pause(); else continuePlaying();
    } else {
        selectedSong = document.querySelectorAll("tr.selected td");
        if (selectedSong[0] !== undefined) {
            songName = selectedSong[0].innerHTML;
            displayPlaying(songName);
            createjs.Sound.removeAllSounds();
            //TODO: Formato...
            //UPDATE: se arregla con el refactoring de la carga de canciones
            createjs.Sound.registerSound(musicPath + songName + ".mp3", "playing", musicPath);
        }
    }
}

function displayPlaying(songName) {
    //TODO: Meter algo adentro de la div para que quede bien...
    document.getElementById("playing-smart").innerHTML = "Suena: " + songName;
    document.getElementById("playing-tab").innerHTML = "Suena: " + songName;
}

function pause() {
    playing.pause();
    document.getElementById("btnPlayPause").className = "icon-play";
    isMusicPlaying = false;
}

function continuePlaying() {
    playing.resume();
    document.getElementById("btnPlayPause").className = "icon-pause";
    isMusicPlaying = true;
}

function loadHandler() {
    playing = createjs.Sound.play("playing");
    playing.addEventListener("complete", playingComplete);
    displayTimes();
    document.getElementById("btnPlayPause").className = "icon-pause";
    isMusicPlaying = true;
}

function playingComplete() {
    createjs.Sound.stop();
    createjs.Sound.removeAllSounds();
    playing = null;
    document.getElementById("btnPlayPause").className = "icon-play";
    isMusicPlaying = false;

    if (!isRandom)
        nextTrack();
    else
        randomTrack();
}

// *** TOGGLE *** //
function toggleMute() {
    var mute, btnMute;

    mute = createjs.Sound.getMute();
    btnMute = document.getElementById("btnMute");

    createjs.Sound.setMute(!mute);
    btnMute.style.color = mute ? "#000000" : "#CC0000";
}

function toggleLoop() {
    var btnLoop = document.getElementById("btnLoop");
    isLoop = !isLoop;
    btnLoop.style.color = isLoop ? "green" : "black";
}

function toggleRandom() {
    var btnRandom = document.getElementById("btnRandom");
    isRandom = !isRandom;

    if (isRandom) {
        btnRandom.style.color = "green";
        document.getElementById("btnPrev").removeEventListener("click", previousTrack, false);
        document.getElementById("btnNext").removeEventListener("click", nextTrack, false);

        document.getElementById("btnPrev").addEventListener("click", randomTrack, false);
        document.getElementById("btnNext").addEventListener("click", randomTrack, false);
    } else {
        btnRandom.style.color = "black";
        document.getElementById("btnPrev").removeEventListener("click", randomTrack, false);
        document.getElementById("btnNext").removeEventListener("click", randomTrack, false);

        document.getElementById("btnPrev").addEventListener("click", previousTrack, false);
        document.getElementById("btnNext").addEventListener("click", nextTrack, false);
    }
}

function changeSong() {
    createjs.Sound.stop();
    playing = null;
    isMusicPlaying = false;
    resetTimes();
    document.getElementById("btnPlayPause").className = "icon-play";
    playSong();
}

// *** TIEMPOS Y SLIDER *** //
function displayTimes() {
    if (playing !== null) {
        var lblTotal = document.getElementById("lblTotalTime");

        lblTotal.innerHTML = formatPlayingTime(playing.getDuration());
        setInterval(updateTimeAndSlider, 500);
    }
}

function updateTimeAndSlider() {
    if (playing !== null) {
        var lblActual = document.getElementById("lblElapsedTime");
        lblActual.innerHTML = formatPlayingTime(playing.getPosition());

        var elapsedPercentage = playing.getPosition() * 100 / playing.getDuration();
        slider.style.width = elapsedPercentage + "%";
    }
}

// *** CAMBIO DE PISTA *** //
function previousTrack() {
    var selectedRow;

    selectedRow = document.querySelector(".selected");

    if (selectedRow !== null && selectedRow.id > 1) {
        selectRowByID(parseInt(selectedRow.id) - 1);
        changeSong();
    }
}

function nextTrack() {
    var selectedRow, rowCount;

    rowCount = document.getElementById("table-content").childNodes[1].childNodes.length - 1;
    selectedRow = document.querySelector(".selected");

    if (selectedRow !== null && selectedRow.id < rowCount) {
        selectRowByID(parseInt(selectedRow.id) + 1);
        changeSong();
    }
}

function randomTrack() {
    var rowCount, currentRow, newRow, isRowValid;

    currentRow = parseInt(document.querySelector(".selected").id);
    rowCount = document.getElementById("table-content").childNodes[1].childNodes.length - 1;

    isRowValid = false;
    while (!isRowValid) {
        newRow = Math.floor(Math.random() * rowCount + 1);
        isRowValid = newRow !== currentRow;
    }

    selectRowByID(newRow);
    changeSong();
}

function resetTimes() {
    var lblTotal = document.getElementById("lblTotalTime");
    var lblActual = document.getElementById("lblElapsedTime");
    lblTotal.innerHTML = "00:00";
    lblActual.innerHTML = "00:00";
}