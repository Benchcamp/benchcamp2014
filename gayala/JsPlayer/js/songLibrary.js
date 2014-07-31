// http://www.vorbis.com/music/

function SongLibrary() {
    var self = this;
    self.artist = null;
    self.songs = null;
    self.album = null;
    
    self.getArtists = function (callback) {
        if (self.artist == null)
            fetchJSONFile("assets/json/artists.txt",function (data){
                self.artist = JSON.parse(data);
                callback(self.artist)
            });
        else
            callback(self.artist);
    };
    
    self.getSongs = function (callback) {
        if (self.songs == null)
            fetchJSONFile("assets/json/songs.txt",function (data){
                self.songs = JSON.parse(data);
                callback(self.songs)
            });
        else
            callback(self.songs);        
    };
    
    self.getAlbum = function (callback) {
        if (self.album == null)
            fetchJSONFile("assets/json/albums.txt",function (data){
                self.album = JSON.parse(data);
                callback(self.album)
            });
        else
            callback(self.album);        
    };
    
    self.refresh = function () {
        self.artist = null;
        self.songs = null;
        self.album = null;
    };
}