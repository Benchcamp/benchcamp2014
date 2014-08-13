// *** TOGGLER *** //

var Toggler = function (control, activeColor, inactiveColor) {
    this._state = false;
    this._control = control;
    this._activeColor = activeColor;
    this._inactiveColor = inactiveColor;
};

Toggler.prototype.toggleState = function () {
    this._state = !this._state;
    this._control.style.color = this._state ? this._activeColor : this._inactiveColor;
};

Toggler.prototype.getState = function () {
    return this._state;
};

// *** SLIDER *** //

var Slider = (function () {
    var _bar, _slider, _percentage;

    _bar = document.getElementById("bar");
    _slider = document.getElementById("slider");
    _percentage = 0;

    // *** INIT *** //

    function _init() {
        _bar.addEventListener("mousedown", _clickSlider, false);
        _bar.addEventListener("mouseup", _endSlide, false);
    }

    // *** GET/SET *** //

    function _getPercentage() {
        return _percentage;
    }

    function _setPosition(percentage) {
        _slider.style.width = (percentage) + "%";
        _percentage = percentage;
    }

    // *** EVENTS *** //

    function _clickSlider(event) {
        var percentage = ((((event.clientX - bar.offsetLeft) / bar.offsetWidth)).toFixed(2)) * 100;
        _bar.addEventListener("mousemove", _moveSlider, false);
        _slider.style.width = (percentage) + "%";
    }

    function _moveSlider(event) {
        var percentage = ((((event.clientX - bar.offsetLeft) / bar.offsetWidth)).toFixed(2)) * 100;
        _slider.style.width = (percentage) + "%";
    }

    function _endSlide(event) {
        var percentage = ((((event.clientX - bar.offsetLeft) / bar.offsetWidth)).toFixed(2)) * 100;
        _bar.removeEventListener("mousemove", _moveSlider, false);
        _slider.style.width = (percentage) + "%";
        _percentage = percentage;
    }


    return {
        init: _init,
        getPercentage: _getPercentage,
        setPosition: _setPosition
    };
})();

// *** PLAYER *** //

var Player = (function () {

    // *** STATE *** //

    var _musicPath, _playing, _isMusicPlaying;

    _musicPath = "assets/resources/music/";
    _playing = null;
    _isMusicPlaying = false;

    // *** CONTROLS *** //

    var _playPause, _nextTrack, _prevTrack, _mute, _random, _loop, _lblElapsedTime, _lblTotalTime;

    _playPause = document.getElementById("btnPlayPause");
    _nextTrack = document.getElementById("btnNext");
    _prevTrack = document.getElementById("btnPrev");
    _mute = new Toggler(document.getElementById("btnMute"), "red", "black");
    _random = new Toggler(document.getElementById("btnRandom"), "green", "black");
    _loop = new Toggler(document.getElementById("btnLoop"), "green", "black");
    _lblElapsedTime = document.getElementById("lblElapsedTime");
    _lblTotalTime = document.getElementById("lblTotalTime");

    // *** INIT *** //

    function _init() {
        document.addEventListener("DOMContentLoaded", function () {
            Slider.init();
            _mute.addEventListener("click", _toggleMute, false);
            _loop.addEventListener("click", _toggleLoop, false);
            _random.addEventListener("click", _toggleRandom, false);
            _playPause.addEventListener("click", _playSong, false);
            _prevTrack.addEventListener("click", _previousTrack, false);
            _nextTrack.addEventListener("click", _nextTrack, false);
        });
        if (createjs.Sound.initializeDefaultPlugins()) {
            createjs.Sound.alternateExtensions = ["mp3", "ogg"];
            createjs.Sound.addEventListener("fileload", _loadHandler);
        }
        _registerManifest();
    }

    function _loadHandler() {
        _playing = createjs.Sound.play("playing");
        _playing.addEventListener("complete", _playingComplete);
        _displayTimes();
        _playPause.className = "icon-pause";
        _isMusicPlaying = true;
    }

    function _playingComplete() {
        createjs.Sound.stop();
        createjs.Sound.removeAllSounds();
        _playing = null;
        _playPause.className = "icon-play";
        _isMusicPlaying = false;

        if (_random.getState())
            randomTrack();
        else
            nextTrack();
    }

    function _registerManifest() {
        var manifest, song, o;

        manifest = [];
        song = null;
        o = null;

        for (var i = 0; i < MusicLibrary.songs.length; i++) {
            song = MusicLibrary.songs[i];

            o = {
                src: song.getSongTitle() + ".mp3",
                id: song.getSongTitle()
            };

            manifest.push(o);
        }

        createjs.Sound.registerManifest(manifest, _musicPath);
    }

    window.onload = function () {
        _init();
    };

    // *** TOGGLERS *** //

    function _toggleMute() {
        _mute.toggleState();
        createjs.Sound.setMute(_mute.getState());
    }

    function _toggleLoop() {
        _loop.toggleState();
    }

    function _toggleRandom() {
        _random.toggleState();

        if (_random.getState()) {
            document.getElementById("btnPrev").removeEventListener("click", previousTrack, false);
            document.getElementById("btnNext").removeEventListener("click", nextTrack, false);

            document.getElementById("btnPrev").addEventListener("click", randomTrack, false);
            document.getElementById("btnNext").addEventListener("click", randomTrack, false);
        } else {
            document.getElementById("btnPrev").removeEventListener("click", randomTrack, false);
            document.getElementById("btnNext").removeEventListener("click", randomTrack, false);

            document.getElementById("btnPrev").addEventListener("click", previousTrack, false);
            document.getElementById("btnNext").addEventListener("click", nextTrack, false);
        }
    }

    // *** SLIDER *** //

    function _moveSongPosition() {
        if (_playing) {
            var positionMs = _playing.getDuration() * Slider.getPercentage() / 100;
            _playing.setPosition(positionMs);
        }
    }

    // *** TIMES & SLIDER UPDATING *** //

    function _displayTimes() {
        if (_playing) {
            _lblTotalTime.innerHTML = Utils.formatPlayingTime(_playing.getDuration());
            setInterval(_updateTimeAndSlider, 500);
            //requestAnimationFrame(updateTimeAndSlider);
        }
    }

    function resetTimes() {
        _lblTotalTime.innerHTML = "00:00";
        _lblElapsedTime.innerHTML = "00:00";
    }

    function _updateTimeAndSlider() {
        if (_playing) {
            _lblElapsedTime.innerHTML = Utils.formatPlayingTime(_playing.getPosition());

            var elapsedPercentage = _playing.getPosition() * 100 / _playing.getDuration();
            Slider.setPosition(elapsedPercentage);
        }
    }

    // *** PLAYBACK *** //TODO

    function playSong() {
        var selectedSong, songName;
        if (_playing) {
            if (isMusicPlaying) pause(); else resume();
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

    function pause() {
        _playing.pause();
        _playPause.className = "icon-play";
        _isMusicPlaying = false;
    }

    function resume() {
        _playing.resume();
        _playPause.className = "icon-pause";
        _isMusicPlaying = true;
    }

    function changeSong() {
        createjs.Sound.stop();
        _playing = null;
        _isMusicPlaying = false;
        resetTimes();
        _playPause.className = "icon-play";
        playSong();
    }

    function previousTrack() {
        var selectedRow;

        selectedRow = document.querySelector(".selected");

        if (selectedRow && selectedRow.id > 1) {
            selectRowByID(parseInt(selectedRow.id) - 1);
            changeSong();
        }
    }

    function nextTrack() {
        var selectedRow, rowCount;

        rowCount = document.getElementById("table-content").childNodes[1].childNodes.length - 1;
        selectedRow = document.querySelector(".selected");

        if (selectedRow && selectedRow.id < rowCount) {
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

    // *** NOW PLAYING *** //TODO

    function displayPlaying(songName) {
        //TODO: Meter algo adentro de la div para que quede bien...
        document.getElementById("playing-smart").innerHTML = "Suena: " + songName;
        document.getElementById("playing-tab").innerHTML = "Suena: " + songName;
    }
})();