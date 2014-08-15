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

Toggler.prototype.getControl = function () {
    return this._control;
};

// *** SLIDER *** //

var Slider = (function () {
    var _bar, _slider, _percentage;

    _percentage = 0;

    // *** INIT *** //

    function _init() {
        _bar = document.getElementById("bar");
        _slider = document.getElementById("slider");
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
        Player.getPlaying().setPosition(_percentage);
        _slider.style.width = (percentage) + "%";
    }

    function _endSlide(event) {
        _percentage = ((((event.clientX - bar.offsetLeft) / bar.offsetWidth)).toFixed(2)) * 100;
        _bar.removeEventListener("mousemove", _moveSlider, false);
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
    var _musicPath, _playing, _playingIndex, _isMusicPlaying, _playList, _loadedCount;

    _musicPath = "assets/resources/music/";
    _playing = null;
    _isMusicPlaying = false;
    _playList = [];
    _loadedCount = 0;
    _playingIndex = 0;

    // *** CONTROLS *** //
    var _playPause, _nextTrack, _prevTrack, _lblElapsedTime, _lblTotalTime;

    // *** TOGGLERS *** //
    var _mute, _random, _loop;

    // *** INIT *** //
    function _init() {
        _playPause = document.getElementById("btnPlayPause");
        _nextTrack = document.getElementById("btnNext");
        _prevTrack = document.getElementById("btnPrev");
        _mute = new Toggler(document.getElementById("btnMute"), "red", "black");
        _random = new Toggler(document.getElementById("btnRandom"), "green", "black");
        _loop = new Toggler(document.getElementById("btnLoop"), "green", "black");
        _lblElapsedTime = document.getElementById("lblElapsedTime");
        _lblTotalTime = document.getElementById("lblTotalTime");

        _playPause.disabled = true;
        _prevTrack.disabled = true;
        _nextTrack.disabled = true;

        _mute.getControl().addEventListener("click", _toggleMute, false);
        _loop.getControl().addEventListener("click", _toggleLoop, false);
        _random.getControl().addEventListener("click", _toggleRandom, false);
        _playPause.addEventListener("click", _playPauseSong, false);
        _prevTrack.addEventListener("click", _playPreviousTrack, false);
        _nextTrack.addEventListener("click", _playNextTrack, false);

        if (createjs.Sound.initializeDefaultPlugins()) {
            createjs.Sound.alternateExtensions = ["mp3", "ogg"];
            createjs.Sound.addEventListener("fileload", _loadHandler);
            _registerManifest();
        }
    }

    function _loadHandler() {
        _loadedCount++;
        if (_loadedCount === MusicLibrary.songs.length) {
            _playPause.disabled = false;
            _prevTrack.disabled = false;
            _nextTrack.disabled = false;
        }
    }

    function _registerManifest() {
        var manifest, song, o;

        manifest = [];
        song = null;
        o = null;

        for (var i = 0; i < MusicLibrary.songs.length; i++) {
            song = MusicLibrary.songs[i];

            o = {
                //TODO Extension...
                src: song.getSongTitle() + ".mp3",
                id: song.getSongTitle()
            };

            manifest.push(o);
        }

        createjs.Sound.registerManifest(manifest, _musicPath);
    }

    // *** GET/SET *** //

    function _getPlaying() {
        return _playing;
    }

    // *** TOGGLERS *** //

    function _toggleMute() {
        _mute.toggleState();
        createjs.Sound.setMute(_mute.getState());
    }

    function _toggleLoop() { //TODO
        _loop.toggleState();
    }

    function _toggleRandom() {
        _random.toggleState();

        if (_random.getState()) {
            document.getElementById("btnPrev").removeEventListener("click", _playPreviousTrack, false);
            document.getElementById("btnNext").removeEventListener("click", _playNextTrack, false);

            document.getElementById("btnPrev").addEventListener("click", _randomTrack, false);
            document.getElementById("btnNext").addEventListener("click", _randomTrack, false);
        } else {
            document.getElementById("btnPrev").removeEventListener("click", _randomTrack, false);
            document.getElementById("btnNext").removeEventListener("click", _randomTrack, false);

            document.getElementById("btnPrev").addEventListener("click", _playPreviousTrack, false);
            document.getElementById("btnNext").addEventListener("click", _playNextTrack, false);
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

    function _resetTimes() {
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
    //LA FUNCIÓN PLAY, LOCO!
    function _play(param) {
        //TODO Para refrescar la playlist hay que setearla como [].
        if (_playList.length === 0) {
            if (param.hasOwnProperty("_albums")) { //Artist
                for (var i = 0; i < param.getAlbums().length; i++) {
                    _playList = _playList.concat(param.getAlbums()[i].getSongs());
                }
            } else if (param.hasOwnProperty("_songs")) { //Album
                _playList = param.getSongs();

            } else { //Song
                _playList = MusicLibrary.songs;
            }
        }

        _playing = createjs.Sound.play(_playList[_playingIndex].getSongTitle());
        if (_playing.playState !== "playFailed") {
            _playPause.className = "icon-pause";
            _isMusicPlaying = true;

            _displayTimes();
            _displayPlaying(_playList[_playingIndex]);

            _playing.addEventListener("complete", _playingComplete);
        } else {
            alert("Play failed!");
        }
    }

    function _playingComplete() {
        createjs.Sound.stop();
        _playPause.className = "icon-play";
        _isMusicPlaying = false;

        if (_random.getState())
            _randomTrack();
        else
            _playNextTrack();
    }

    function _playPauseSong() {
        if (!_isMusicPlaying) {
            _play(ContentTable.getSelectedItem());
        } else {
            if (_playPause.className === "icon-pause")
                _pause();
            else
                _resume();
        }
    }

    function _pause() {
        _playing.pause();
        _playPause.className = "icon-play";
    }

    function _resume() {
        _playing.resume();
        _playPause.className = "icon-pause";
    }

    function _playNextTrack() {
        createjs.Sound.stop();
        if (_playingIndex < _playList.length)
        {
            _playingIndex++;
            var song = _playList[_playingIndex];
            if (song) ContentTable.selectRowByData(song.getSongTitle());
            _play(_playList[_playingIndex]);
        } else {
            _playing = null;
            _playList = [];
            _isMusicPlaying = false;
        }
    }

    function _playPreviousTrack() {
        createjs.Sound.stop();
        if(_playingIndex > 0) {
            _playingIndex--;
            var song = _playList[_playingIndex];
            if (song) ContentTable.selectRowByData(song.getSongTitle());
            _play(song);
        } else {
            _playing = null;
            _playList = [];
            _isMusicPlaying = false;
        }
    }

    function _randomTrack() {
        createjs.Sound.stop();
        _playingIndex = Math.floor(Math.random() * _playList.length);

        var song = _playList[_playingIndex];
        ContentTable.selectRowByData(song.getSongTitle());

        _play(_playList[_playingIndex]);
    }

    // *** NOW PLAYING *** //TODO

    function _displayPlaying(song) {
        document.getElementById("playing-smart").innerHTML = "Suena: " + song.getSongTitle();
        document.getElementById("playing-tab").innerHTML = "Suena: " + song.getSongTitle();
    }

    // *** RETURN *** //

    return {
        init: _init,
        play: _play,
        getPlaying: _getPlaying
    }
})();

// *** CONTENT TABLE *** //

var ContentTable = (function () {
    var contentTable, selectedItem;

    // *** INIT *** //

    function _init() {
        contentTable = document.getElementById("table-content");
    }

    // *** GET/SET *** //

    function _getSelectedItem() {
        return selectedItem;
    }

    function _setSelectedItem(item) {
        selectedItem = item;
    }

    // *** DISPLAY INFO *** //

    function _displaySongs() {
        var headers, thead, tbody, tr, td, attr, song;

        _resetTable();

        headers = ["Number", "Title", "Length"];
        thead = document.createElement("thead");
        tr = document.createElement("tr");

        for (var i = 0; i < headers.length; i++) {
            td = document.createElement("td");
            td.innerHTML = headers[i];
            tr.appendChild(td);
        }

        thead.appendChild(tr);
        contentTable.appendChild(thead);

        tbody = document.createElement("tbody");

        for (var j = 0; j < MusicLibrary.songs.length; j++) {
            song = MusicLibrary.songs[j];

            tr = document.createElement("tr");

            td = document.createElement("td");
            td.innerHTML = song.getNumber();
            tr.appendChild(td);

            td = document.createElement("td");
            td.innerHTML = song.getSongTitle();
            tr.appendChild(td);

            td = document.createElement("td");
            td.innerHTML = song.getLength();
            tr.appendChild(td);

            attr = document.createAttribute("data-song");
            attr.value = song.getSongTitle();
            tr.setAttributeNode(attr);

            tr.addEventListener("click", _selectRow, false);
            tbody.appendChild(tr);
        }
        contentTable.appendChild(tbody);
    }

    function _displayAlbums() {
        var headers, thead, tbody, tr, td, attr, album;

        _resetTable();

        headers = ["Title", "Year"];
        thead = document.createElement("thead");
        tr = document.createElement("tr");

        for (var i = 0; i < headers.length; i++) {
            td = document.createElement("td");
            td.innerHTML = headers[i];
            tr.appendChild(td);
        }

        thead.appendChild(tr);
        contentTable.appendChild(thead);

        tbody = document.createElement("tbody");
        for (var j = 0; j < MusicLibrary.albums.length; j++) {
            album = MusicLibrary.albums[j];

            tr = document.createElement("tr");

            td = document.createElement("td");
            td.innerHTML = album.getAlbumTitle();
            tr.appendChild(td);

            td = document.createElement("td");
            td.innerHTML = album.getAlbumYear();
            tr.appendChild(td);

            attr = document.createAttribute("data-album");
            attr.value = album.getAlbumTitle();
            tr.setAttributeNode(attr);

            tr.addEventListener("click", _selectRow, false);
            tbody.appendChild(tr);
        }
        contentTable.appendChild(tbody);
    }

    function _displayArtists() {
        var thead, tbody, tr, td, attr, artist;

        _resetTable();

        thead = document.createElement("thead");
        tr = document.createElement("tr");

        td = document.createElement("td");
        td.innerHTML = "Name";

        tr.appendChild(td);
        thead.appendChild(tr);
        contentTable.appendChild(thead);

        tbody = document.createElement("tbody");
        for (var i = 0; i < MusicLibrary.artists.length; i++) {
            artist = MusicLibrary.artists[i];

            tr = document.createElement("tr");

            td = document.createElement("td");
            td.innerHTML = artist.getName();
            tr.appendChild(td);

            attr = document.createAttribute("data-artist");
            attr.value = artist.getName();
            tr.setAttributeNode(attr);

            tr.addEventListener("click", _selectRow, false);
            tbody.appendChild(tr);
        }
        contentTable.appendChild(tbody);
    }

    // *** UTIL *** //

    function _resetTable() {
        contentTable.innerHTML = "";
    }

    function _selectRow() {
        _deselectAllRows();
        this.className = "selected";

        if (Filters.getSelectedFilter() === "Songs") {
            _setSelectedItem(MusicLibrary.getSongByTitle(this.attributes["data-song"].value));
        } else if (Filters.getSelectedFilter() === "Albums") {
            _setSelectedItem(MusicLibrary.getAlbumByTitle(this.attributes["data-album"].value));
        } else {
            _setSelectedItem(MusicLibrary.getArtistByName(this.attributes["data-artist"].value));
        }
    }

    function _selectRowByData(data) {
        var rows = contentTable.rows;

        var attrName = "data-";

        if (Filters.getSelectedFilter() === "Songs") {
            attrName += "song";
        } else if (Filters.getSelectedFilter() === "Albums") {
            attrName += "album";
        } else {
            attrName += "artist";
        }

        for (var i = 1; i < rows.length; i++) {
            if (rows[i].attributes[attrName].value === data) {
                if (!rows[i].classList.contains("selected")) {
                    _deselectAllRows()
                    rows[i].classList.add("selected");
                    _setSelectedItem(data);
                }
            }
        }
    }

    function _deselectAllRows() {
        var rows = document.querySelectorAll("#table-content tr");
        for (var i = 0; i < rows.length; i++) {
            rows[i].classList.remove("selected");
        }
    }

    // *** RETURN *** //

    return {
        init: _init,
        displaySongs: _displaySongs,
        displayAlbums: _displayAlbums,
        displayArtists: _displayArtists,
        getSelectedItem: _getSelectedItem,
        selectRowByData: _selectRowByData
    }
})();

// *** FILTERS *** //

var Filters = (function () {
    var _selectedFilter = null;

    // *** INIT *** //

    function _init() {
        document.getElementById("btnFilterSongs").addEventListener("click", ContentTable.displaySongs, false);
        document.getElementById("btnFilterAlbums").addEventListener("click", ContentTable.displayAlbums, false);
        document.getElementById("btnFilterArtists").addEventListener("click", ContentTable.displayArtists, false);
        document.getElementById("btnToggleFilters").addEventListener("click", _toggleFilters, false);

        document.getElementById("btnFilterSongs").addEventListener("click", function () {
            _selectedFilter = "Songs";
        });
        document.getElementById("btnFilterAlbums").addEventListener("click", function () {
            _selectedFilter = "Albums";
        });
        document.getElementById("btnFilterArtists").addEventListener("click", function () {
            _selectedFilter = "Artists";
        });
    }

    function _toggleFilters() {
        document.getElementById("panel-filters").classList.toggle("panel-hidden");
        document.getElementById("panel-filters").classList.toggle("panel-visible");
        document.getElementById("playing-smart").classList.toggle("panel-visible");
        document.getElementById("playing-smart").classList.toggle("panel-hidden");
        document.getElementById("wrapper-top").classList.toggle("full-size");
        document.getElementById("wrapper-bot").classList.toggle("full-size");
    }

    function _getSelectedFilter() {
        return _selectedFilter;
    }

    // *** RETURN *** //

    return {
        init: _init,
        getSelectedFilter: _getSelectedFilter
    }
})();

// *** NOW PLAYING *** //

var NowPlaying = (function () {

    // *** INIT *** //

    function _init() {
        document.getElementById("btnFavSmart").addEventListener("click", _addFavorite, false);
        document.getElementById("btnFavTab").addEventListener("click", _addFavorite, false);
        document.getElementById("btnTogglePlaying").addEventListener("click", _togglePlaying, false);
    }

    function _addFavorite() {

    }

    function _togglePlaying() {
        var divContent, tableContent;
        document.getElementById("playing-smart").classList.toggle("panel-hidden");
        document.getElementById("playing-smart").classList.toggle("panel-visible");

        divContent = document.getElementById("content");
        tableContent = document.getElementById("table-content");

        divContent.classList.toggle("full-size");

        if (divContent.classList.contains("full-size") && tableContent.childNodes.length === 0) {
            displaySongs();
        }
    }

    return {
        init: _init,
        addFavorite: _addFavorite
    };
})();

window.onload = function () {
    Slider.init();
    Player.init();
    Filters.init();
    ContentTable.init();
    NowPlaying.init();
};