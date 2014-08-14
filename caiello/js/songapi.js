
/*
Track
*/
function Track(title, lngth){
	this.title 	= title  || "";
	this.lngth = lngth   || 0;
}
Track.prototype.lyric_cache = '';
Track.prototype.setLyricCache = function (lyric){
	this.lyric_cache=lyric;
}

/*
Album
*/
function Album(title, year, cover){
	this.title	  = title || "";
	this.year     = year  || "";
  this.cover    = cover || "nocover.png";
  this.tracks    = [];
}
Album.prototype.pushTrack = function (track){
    this.albums.push(album);
}
Album.prototype.setTracks = function (tracks){
    this.tracks=tracks;
}

/*
Artist
*/
function Artist(name){
	this.name  = name;
  this.albums=[];
}
//Artist.prototype.albums = [];
Artist.prototype.pushAlbum = function (album){
    this.albums.push(album);
}
Artist.prototype.setAlbums = function (albums){
    this.albums=albums;
}




















var chongo="hola";



//Events Logger Module
var dataLoad = (function () {
  
  var _artists;

  // gets a url creating a promise
  function _get(url) {
    return new Promise(function(resolve, reject) {
      var req = new XMLHttpRequest();
      req.open('GET', url);
      req.onload = function() {
        if (req.status == 200)
          resolve(JSON.parse(req.response));
        else
          reject(Error(req.statusText));
      };
      req.onerror = function() {
        reject(Error("Network Error"));
      };
      req.send();
    });
  }

  function _getArtists(){
    return _artists;
  }

  function _createObjects(art_path, alb_path, sng_path){
    var _promises = [_get(art_path), _get(alb_path), _get(sng_path)];

    Promise.all(_promises).then(function(resultados) {

      return _jsonsToObjects(resultados);
    }, function() {
      console.log("error");
    }).then(function(r){ console.log(_artists===r)  });
  }
  // transforms a parsed json to an array of artists (artists have albums and albums have songs)
  function _jsonsToObjects(jsons){
    _artists = [];
    var artistsjs=jsons[0]["artists"];
    var albumsjs=jsons[1]["albums"];
    var songsjs=jsons[2]["tracks"];
    // using hashtables for performance (3*n)..
    // loading artists
    for (var i=0; i<artistsjs.length; i++)
      //uso una hashtable para mejorar performance
      _artists[artistsjs[i]["artist"]]= new Artist(artistsjs[i]["artist"]);

    // loading albums
    for (var i=0; i<albumsjs.length; i++)
      _artists[ albumsjs[i]["artist"] ].albums[ albumsjs[i]["album"] ] = new Album(albumsjs[i]["album"], albumsjs[i]["year"], albumsjs[i]["cover"]);
    
    // loading tracks
    for (var i=0; i<songsjs.length; i++)
      _artists[ songsjs[i]["artist"] ].albums[ songsjs[i]["album"] ].tracks[ songsjs[i]["song"] ] = new Track(songsjs[i]["song"], songsjs[i]["song"] );

    return _artists;
  }

    // Reveal
    return {
        createObjects: _createObjects,
        getArtists: _getArtists,
        getPromiseJSON: _get
    };
})();








dataLoad.createObjects("assets/json/artistsv2.json","assets/json/albumsv2.json","assets/json/songsv2.json");


// printit("algo",chongo);
// function printit(algo, callback){
//     callback(algo);
// }

// function chongo(otro){
//     console.log(otro);
// }

// var path="http://localhost/api/songs?api_key=7103d7534425de166eaac87dd37927&artist=scorpions&track=wind%20of%20change";
// get(path).then(function(response) {
//   console.log("Success!", response);
// }, function(error) {
//   console.error("Failed!", error);
// });



//http://localhost/api/songs?api_key=7103d7534425de166eaac87dd37927&artist=scorpions&track=wind%20of%20change
