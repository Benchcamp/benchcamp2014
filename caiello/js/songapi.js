
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
}
Album.prototype.tracks  = [];
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
}
Artist.prototype.albums = [];
Artist.prototype.pushAlbum = function (album){
    this.albums.push(album);
}
Artist.prototype.setAlbums = function (albums){
    this.albums=albums;
}




var tracklist=[];
tracklist.push(new Track(1, 4, "Enter Sandman", "Metallica"));
tracklist.push(new Track(2, 3, "The unforgiven", "Metallica"));

var album = new Album(1, 2, 1984, "cover.png");

for (var i=0; i<tracklist.length; i++)
	console.log(tracklist[i].title);



//aca ver de hacer Promise.all, tenndria q pasar un array de urls, 
// y hacer un foreach de los new promises apendeandolas?
function get(url) {
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


// var p1=get(path).then(function(response) {
//     printit(response);
// }, function(error) {
//   console.error("Failed!", error);
// });

function printit(data){
    console.log(data["albums"][0]["artist"]);

}


function logueate(esta)
{
  console.log(esta);
}



var path="assets/json/artistsv2.json";
var path2="assets/json/albumsv2.json";
var path3="assets/json/songsv2.json";
var promises = [get(path),get(path2),get(path3)];


// transforms a parsed json to an array of artists (artists have albums and albums have songs)
function jsonsToObjects(jsons){
  console.log("creating objects...");
  var artists=[];
  var artistsjs=jsons[0]["artists"];
  for (var i=0; i<artistsjs.length; i++){
    artists.push(new Artist(artistsjs[i]["artist"]));
  }
  console.log("...objects created!");
}



Promise.all(promises).then(function(resultados) {
  jsonsToObjects(resultados);
 // console.log(resultados);
 // console.log(resultados[0]["albums"][0]["artist"]+" "+resultados[1]["artists"][0]["artist"]);
}, function() {
  console.log("error");
}).then(function(){logueate("esta")});

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
