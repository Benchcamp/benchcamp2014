
//Module Library
var Library = function(){
    
    // SongsLibrary module get Data Form backend
    var SongLibrary = function() {
        // music from: http://www.vorbis.com/music/
        var self = this;
        self._artist = null;
        self._songs = null;
        self._album = null;

        self._getArtists = function (callback) {
            if (self._artist == null)
                Utility.fetchJSONFile("assets/json/artists.txt",function (data){
                    self._artist = JSON.parse(data);
                    callback(self._artist)
                });
            else
                callback(self._artist);
        };

        self._getSongs = function (callback) {
            if (self._songs == null)
                Utility.fetchJSONFile("assets/json/songs.txt",function (data){
                    self._songs = JSON.parse(data);
                    callback(self._songs)
                });
            else
                callback(self._songs);        
        };

        self._getAlbum = function (callback) {
            if (self._album == null)
                Utility.fetchJSONFile("assets/json/albums.txt",function (data){
                    self._album = JSON.parse(data);
                    callback(self._album)
                });
            else
                callback(self._album);        
        };

        self._refresh = function () {
            self._artist = null;
            self._songs = null;
            self._album = null;
        };

        return {
            getSongs : self._getSongs,
            getArtists : self._getArtists,
            getAlbum : self._getAlbum,
            refresh : self._refresh    
        };

    }();// SongLibrary

    
    var self = this;

    var _artists = null;
    var _songs = null;
    var _album = null;
    
    // load library whit defferd data
    self._loadLibrary = function(callback){
        _artists = null;
        _songs = null;
        _album = null;
        
        var artistsData = null;
        var songsData = null;
        var albumData = null;
        
        SongLibrary.refresh();
        
        SongLibrary.getArtists(function(artist){ // deffered
            artistsData = artist;
            SongLibrary.getSongs(function(songs){ //then
                songsData = songs;
                SongLibrary.getAlbum(function (albums){ //then
                    albumData = albums;
                    self._buildObjects(artistsData, songsData, albumData);
                    callback();
                });
            });
        });
    };
    
    self._buildObjects = function(artistsData, songsData, albumData){
        _artists = []; 
        _songs = [];
        _album = [];

        artistsData.forEach(function(a){
            var artist = new Artist();
            artist.name(a.artist);            
            _artists.push(artist);
        });

        albumData.forEach(function(a){
            var album = new Album();
            
            var artist = _artists.filter(function(element){ return element.name() == a.artist});
            artist = (artist.length > 0)? artist[0] : null;            
            
            if(artist != null)
                artist.albums().push(album);
                        
            album.cover(a.cover)
                 .title(a.album)
                 .year(a.year)
                 .artist(artist);
            
            _album.push(album);
        });
        
        songsData.forEach(function(s){
            var track = new Track();
            
            var album = _album.filter(function(element){ return element.title() == s.album && element.artist().name() == s.artist });
            album = (album.length > 0)? album[0] : null;
            
            if(album != null)
                album.tracks().push(album);
            
            track.title(s.track)
                 .number(s.number)
                 .length(s.time)
                 .url(s.url)
                 .album(album);
            
            _songs.push(track);
        });
    }


    self._getSongs = function(callback){        
        if(_songs == null){
            self._loadLibrary(function(){callback(_songs)});
        }else{
            callback(_songs);
        }
    };
    
    self._getArtists = function(callback){
        if(_artists == null){
            self._loadLibrary(function(){callback(_artists)});
        }else{
            callback(_artists);
        }        
    };
    
    self._getAlbum = function(callback){
        if(_album == null){
            self._loadLibrary(function(){callback(_album)});
        }else{
            callback(_album);
        }
    };


    
    return {
//            getSongs : SongLibrary.getSongs,
//            getArtists : SongLibrary.getArtists,
//            getAlbum : SongLibrary.getAlbum,
        
            getSongs : self._getSongs,
            getArtists : self._getArtists,
            getAlbum : self._getAlbum,
                
            refresh : SongLibrary.refresh  
    };    
    
}();


function Artist(){
    Observable.call(this);
    this.albums([]);
}

Artist.prototype = new Observable();

Artist.prototype.name = function (){    
    return Utility.propertyBehavior(this, "name", arguments);
};

Artist.prototype.albums = function (){    
    return Utility.propertyBehavior(this, "albums", arguments);
};


Artist.prototype.constructor = Artist;



function Album(){    
    Observable.call(this);
    this.tracks([]);
}

Album.prototype = new Observable();

Album.prototype.title = function (){    
    return Utility.propertyBehavior(this, "title", arguments);
};

Album.prototype.year = function (){  
        return Utility.propertyBehavior(this, "year", arguments);
};

Album.prototype.cover = function (){    
        return Utility.propertyBehavior(this, "cover", arguments);
};

Album.prototype.artist = function (){    
        return Utility.propertyBehavior(this, "artist", arguments);
};

Album.prototype.tracks = function (){    
        return Utility.propertyBehavior(this, "tracks", arguments);
};


Album.prototype.constructor = Album;



function Track(){
    Observable.call(this);
}

Track.prototype = new Observable();

Track.prototype.number = function (){    
        return Utility.propertyBehavior(this, "number", arguments);
};

Track.prototype.length = function (){    
        return Utility.propertyBehavior(this, "length", arguments);
};

Track.prototype.title = function (){    
        return Utility.propertyBehavior(this, "title", arguments);
};

Track.prototype.url = function (){    
        return Utility.propertyBehavior(this, "url", arguments);
};

Track.prototype.album = function (){    
        return Utility.propertyBehavior(this, "album", arguments);
};


Track.prototype.constructor = Track;
