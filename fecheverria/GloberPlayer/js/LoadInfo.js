var LoadInfo = function () {

    var self = this;
    var urlArtists = "assets/json/artists.txt";
    var urlAlbums = "assets/json/albums.txt";
    var urlSongs = "assets/json/songs.txt";
    
    
    self.artists = function () {
        
        var artists;

        artists = self.fetchJSONFile(urlArtists);
        return artists;
    };
    
    self.albums = function () {
        
        var albums;
 
        albums = self.fetchJSONFile(urlAlbums);
        return albums;
    };
    
    self.songs = function () {
        
        var songs;

        songs = self.fetchJSONFile(urlSongs);
        return songs;
    };

    
    self.fetchJSONFile = function(theUrl){
        var xmlHttp = null;

        xmlHttp = new XMLHttpRequest();
        xmlHttp.open( "GET", theUrl, false );
        xmlHttp.send( null );
        return JSON.parse(xmlHttp.responseText);
    };

};