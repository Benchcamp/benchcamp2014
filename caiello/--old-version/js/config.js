//Config data
var config = (function(e) {
    //using http://api.lyricsnmusic.com/ with a proxy from http://localhost/api/
    var _lyricsapi="http://localhost:8888/api/songs?api_key=7103d7534425de166eaac87dd37927&q=";
    var _jsonart="assets/json/artistsv2.json";
	var _jsonalb="assets/json/albumsv2.json";
	var _jsonsng="assets/json/songsv2.json";
    

    // Reveal
    return {
        jsonart: _jsonart,
        jsonalb: _jsonalb,
        jsonsng: _jsonsng,
        lyricsapi: _lyricsapi
    };
})();