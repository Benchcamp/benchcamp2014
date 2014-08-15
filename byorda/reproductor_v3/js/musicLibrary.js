var MusicLibrary = (function () {
    var _songs, _albums, _artists, _jsonSongs, _jsonAlbums, _jsonArtists;

    _songs = [];
    _albums = [];
    _artists = [];
    _jsonSongs = "../assets/resources/songs.json";
    _jsonAlbums = "../assets/resources/albums.json";
    _jsonArtists = "../assets/resources/artists.json";

    // *** SEARCHING *** //

    function getSongByTitle(title) {
        for (var i = 0; i < _songs.length; i++) {
            if (_songs[i].getSongTitle() === title) {
                return _songs[i];
            }
        }
        return null;
    }

    function getAlbumByTitle(title) {
        for (var i = 0; i < _albums.length; i++) {
            if (_albums[i].getAlbumTitle() === title) {
                return _albums[i];
            }
        }
        return null;
    }

    // *** LOADING *** //

    function _loadSongs(json) {
        var song = null;
        for (var i = 0; i < json.items.length; i++) {
            var aux = json.items[i];
            song = new Song(aux["Number"], aux["Title"], aux["Length"]);
            _songs.push(song);
        }
    }

    function _loadAlbums(json) {
        var aux, album, albumSongs;

        aux = null;
        album = null;
        albumSongs = null;

        for (var i = 0; i < json.items.length; i++) {
            aux = json.items[i];
            album = new Album(aux["Title"], aux["Year"], aux["Cover"]);
            albumSongs = aux["Tracks"];

            for (var j = 0; j < albumSongs.length; j++) {
                var song = getSongByTitle(albumSongs[j]);
                if (song) album.getSongs().push(song);
            }
            _albums.push(album);
        }
    }

    function _loadArtists(json) {
        var aux, artist, artistAlbums;

        aux = null;
        artist = null;
        artistAlbums = null;

        for (var i = 0; i < json.items.length; i++) {
            aux = json.items[i];
            artist = new Artist(aux["Name"]);
            artistAlbums = aux["Albums"];

            for (var j = 0; j < artistAlbums.length; j++) {
                var album = _getAlbumByTitle(artistAlbums[j]);
                if (album) artist.getAlbums().push(album);
            }
            _artists.push(artist);
        }
    }

    Utils.callbackJson(_jsonSongs, function (json) {
        _loadSongs(json);
        Utils.callbackJson(_jsonAlbums, function (json) {
            _loadAlbums(json);
            Utils.callbackJson(_jsonArtists, function (json) {
                _loadArtists(json)
            });
        });
    });

    // *** SEARCHING *** //

    function _searchSong(title) {
        for (var song in _songs) {
            if (song.getSongTitle() === title) return song;
        }
    }

    function _searchAlbum(title) {
        for (var album in _albums) {
            if (album.getSongTitle() === title) return album;
        }
    }

    function _searchArtist(name) {
        for (var artist in _artists) {
            if (artist.getName() === name) return artist;
        }
    }

    function _getAlbumCover(songTitle) {
        for (var i = 0; i < _albums.length; i++) {
            var album = _albums[i];

            if (album.getSongByTitle(songTitle)) {
                return album.getCover();
            }
        }
        return null;
    }

    function _getSongByTitle(title) {
        for (var i = 0; i < _songs.length; i++) {
            if (_songs[i].getSongTitle() === title) {
                return _songs[i];
            }
        }
        return null;
    }

    function _getAlbumByTitle(title) {
        for (var i = 0; i < _albums.length; i++) {
            if (_albums[i].getAlbumTitle() === title) {
                return _albums[i];
            }
        }
        return null;
    }

    function _getArtistByName(name) {
        for (var i = 0; i < _artists.length; i++) {
            if (_artists[i].getName() === name) {
                return _artists[i];
            }
        }
        return null;
    }

    // *** RETURN *** //

    return {
        songs: _songs,
        albums: _albums,
        artists: _artists,
        getSongByTitle: _getSongByTitle,
        getAlbumByTitle: _getAlbumByTitle,
        getArtistByName: _getArtistByName
    };
})();