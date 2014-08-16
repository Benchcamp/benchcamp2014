/*
Global vars
*/



/*
Track
*/
function Track(title, lngth, filename){
	this.title 	= title  || "";
	this.lngth  = lngth   || 0;
	this.file  = filename   || "";
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
  	this.tracks   = [];
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



//this class will represent the context to play
function PlayContext(reproductiontype, artist, album, track){
	this.reproductiontype = reproductiontype || "";
	this.artist    	 	  = artist || "";
  	this.album       	  = album  || "";
  	this.track       	  = track  || "";
}



var draggedthing;

/*
Functions
*/

//Events Logger Module
var eventsLogger = (function (e) {
    var _eventlogcount=0
	// adds a event to the log
	function _logEvent(e){
		var actualtime=new Date(e.timeStamp);
		var timetolog=actualtime.getHours()+":"+actualtime.getMinutes()+":"+actualtime.getSeconds();
		var eventaction=e.type;
		var eventelement=e.target.innerText;
		if (eventelement=="")
			eventelement=e.target.className;
		_addToEventLog(eventaction,eventelement,timetolog);
	}
	// adds an item to the log
	function _addToEventLog(actionev,eventelement,eventtime){
		document.getElementById("eventlogcount").innerHTML = ++_eventlogcount;
	 	var rowstr="";
		if (_eventlogcount%2==0) //have to use nth styles here
			rowstr+="<tr class=\"even\">";
		else
			rowstr+="<tr class=\"odd\">";
		rowstr+="<td>"+ actionev +"</td>";
		rowstr+="<td>"+ eventelement +"</td>";
		rowstr+="<td>"+ eventtime +"</td>";
		rowstr+="</tr>"
		document.getElementById("eventlog").innerHTML += rowstr;
	};
    // Reveal
    return {
        logEvent: _logEvent
    };
})();


//Utilities
var utilities = (function () {
   
	//hasclass, addclass and remove class taken from http://jaketrent.com/post/addremove-classes-raw-javascript/
	function _hasClass(ele,cls) {
	  return ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
	}
	function _addClass(ele,cls) {
	  if (!_hasClass(ele,cls)) ele.className += " "+cls;
	}
	function _removeClass(ele,cls) {
	  if (_hasClass(ele,cls)) {
	    var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
	    ele.className=ele.className.replace(reg,' ');
	  }
	}
	/*
	maths
	*/
	//miliseconds to seconds
	function _msToSeconds(mscs){
		return mscs/1000;
	}
	//miliseconds to minutes
	function _msToMinutes(mscs){
		return _msToSeconds(mscs)/60;
	}
	//miliseconds to seconds without minutes (ie: 127 ret 7)
	function _msToSecondsWithoutMinutes(mscs){
		return _msToSeconds(mscs)%60;
	}
	//percent of a part in a total
	function _percent(part,total){
		return part*100.0/total;
	}

    // Reveal
    return {
        hasClass: _hasClass,
        addClass: _addClass,
        removeClass: _removeClass,
        msToSeconds: _msToSeconds,
        msToMinutes: _msToMinutes,
        msToSecondsWithoutMinutes: _msToSecondsWithoutMinutes,
        percent: _percent
    };
})();



//Player
var player = (function () {
	var _instance;
	var _timing;

	var _currentartist;
	var _currentalbum;
	var _currentsong;

	var _playingcontext;

	var _repeat=false;
	var _random=false;
	var _registered=false;
	var _artists=[]; //artists has all the data (artists, albums, and tracks)
	var _playing;



	// instantiate the context to play and start playing it
	function _play(playingcontext){
		
		_playingcontext = playingcontext;
		console.log("playing: "+_playingcontext.reproductiontype+", artist: "+_playingcontext.artist);
	}
	//FALTA:
	// Tengo que hacer un metodo que una los play y playsong (que elija cual playear)
	// tengo que hacer un metodo que registre las canciones en la parte de promesas
	// plays a song. It requires the artist and album for performance (because im using a hashtable)
	function _playSong(artist,album,songname) {
		_currentsong=_artists[artist].albums[album].tracks[songname];
	    console.log(artist);
		document.getElementById("song-name").innerText=_currentsong.name;

		if (!(_instance && _instance.resume())){ //resume pause
			if (_instance) //stops current song
				_stopSong(); 
			_instance = createjs.Sound.play(_currentsong.name); //plays selected
		}
	    _instance.addEventListener("complete", _songEnds);
	    //change btn from play to pause
	    playbtn.style.display = "none";
	    pausebtn.style.display= "";
	    _timing = setInterval(_update,3);//most fluid than 1000
	    //have to move this...
	    view.hideDragArea();
	}


	// handle what happens when a song ends
	function _songEnds() {
		if (_random)
			_playSong(Math.floor((Math.random() * _getTotalSongs()) + 1));
		else
			if (_repeat){
				(_currentsong+1 <= _totalsongs) ? _playSong(++_currentsong) : _currentsong=1; _playSong(_currentsong);
			}else{
				_stopSong();
			}
	}

	// plays a song
	// function _playSong(songid) {
	// 	_currentsong=songid;
	// 	document.getElementById("song-name").innerText=_playlist[_currentsong-1];
	// 	if (!(_instance && _instance.resume())){ //resume pause
	// 		if (_instance) //stops current song
	// 			_stopSong(); 
	// 		_instance = createjs.Sound.play(songid); //plays selected
	// 	}
	//     _instance.addEventListener("complete", _songEnds);
	//     //change btn from play to pause
	//     playbtn.style.display = "none";
	//     pausebtn.style.display="";
	//     _timing = setInterval(_update,3);//most fluid than 1000
	//     //have to move this...
	//     view.hideDragArea();
	// }
	// pause the current song
	function _pauseSong() {
		_instance.pause();
		clearInterval(_timing);
		pausebtn.style.display="none";
		playbtn.style.display="";
	}
	// stop the song (another song selected)
	function _stopSong() {
		_pauseSong();
		_instance.setPosition(0);
	}
	//taken from http://www.kirupa.com/html5/getting_mouse_click_position.htm
	function _getPosition(element) {
		var xPosition = 0;
		var yPosition = 0;
		while (element) {
			xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
			yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
			element = element.offsetParent;
		}
		return { x: xPosition, y: yPosition };
	}
	// moves the player to a position given by an event
	function _moveToPosition(e){//gets the position from event
		if (_instance){
			var parentpos = player.getPosition(e.currentTarget);
			var posx = e.clientX - parentpos.x;
			var pbwidth = document.getElementById("playing").clientWidth;
		    _instance.setPosition( (posx/pbwidth) * _instance.getDuration() );
		    _update();
		}
	}
	// update all items (transcurred time, progressbar, circle)
	function _update(){
		var playedms = _instance.getPosition();
		document.getElementById("transcurredtime").innerHTML=parseInt(utilities.msToMinutes(playedms))+":"+parseInt(utilities.msToSecondsWithoutMinutes(playedms));
		var percentplayed=utilities.percent(playedms,_instance.getDuration());
		document.getElementById("progressbar").style.width=percentplayed+"%";
	}
	// register a song
	function _registerSong(songid) {
		createjs.Sound.registerSound("assets/resources/songs/"+songid+".ogg",songid);
	}
	// mute the sound
	function _muteSound(){
		if (_instance)
			_instance.setMute(!_instance.getMute());
		if (_instance.getMute())
			utilities.removeClass(document.getElementById("i-shuffle"),"inactive");
		else
			utilities.addClass(document.getElementById("i-shuffle"),"inactive");
	}

	function _getCurrentSong(){
		return _currentsong;
	}

	function _setCurrentSong(currentsong){
		this._currentsong=currentsong;
	}
	function _registered(){
		return _currentsong;
	}
	function _changeSong(q){
		_currentsong+=q;
	}
	function _playlistPush(songname){
		 _playlist.push(songname);
	}
	function _getTotalSongs(){
		 return _playlist.length;
	}
	function _getSongName(id){
		 return _playlist[id];
	}

	function _playPrevSong(){
        _currentsong-1 > 0 ? _playSong(--_currentSong) : _currentsong = _getTotalSongs(); _playSong(_currentsong);
	}
	function _playNextSong(){
		_currentsong+1 <= _getTotalSongs() ? _playSong(++_currentsong) : _currentsong=1; _playSong(_currentsong);	

	}
	// negate the random bool state
	function _setRandom(){
		_random=!_random;
		if (_random)
			utilities.removeClass(document.getElementById("i-shuffle"),"inactive");
		else
			utilities.addClass(document.getElementById("i-shuffle"),"inactive");
	}

	// negates repeat (have to reuse the method setrandom..)
	function _setRepeat(){
		_repeat=!_repeat;
		if (_repeat)
			utilities.removeClass(document.getElementById("i-loop"),"inactive");
		else
			utilities.addClass(document.getElementById("i-loop"),"inactive");
	}

	// set the array of artists with the albums and tracks
	function _setArtists(artists){
		_artists=artists;
	}	

    // Reveal
    return {
        playSong:       _playSong,
        songEnds:       _songEnds,
		pauseSong:      _pauseSong,
		stopSong:       _stopSong,
		getPosition:    _getPosition,
		moveToPosition: _moveToPosition,
		update: 		_update,
		registerSong: 	_registerSong,
		muteSound: 		_muteSound,
		getCurrentSong: _getCurrentSong,
		setCurrentSong: _setCurrentSong,
		registered: 	_registered,
		changeSong: 	_changeSong,
		playlistPush: 	_playlistPush,
		getTotalSongs:  _getTotalSongs,
		getSongName:    _getSongName,
		playPrevSong: 	_playPrevSong,
		playNextSong: 	_playNextSong,
		setRepeat: 		_setRepeat,
		setRandom: 		_setRandom,
		setArtists: 	_setArtists,
		artists:        _artists,
		play: 			_play
    };
})();
 






//View module
var view = (function () {

	// show a table
	function _fillTables(){
		var filterid="artists";
		//creates the headers of the playlist
		var rowstr="<tr class=\"theader\">";
		switch(filterid) {
	  		case "artists":
	       		rowstr+="<th>Artista</th>";
	       	break;
	    	case "albums":
	       		rowstr+="<th>Artista</th><th>Album</th><th>A&ntilde;o</th><th>Cover</th>";
	       	break;
	    	default:
	    		rowstr+="<th>Pista</th><th>Artista</th><th>Tiempo</th><th>Album</th>";
		}
		rowstr+="</tr>";

		// create the table of artists
		if (filterid=="artists")
			for (var artist in player.artists)
				if (player.artists.hasOwnProperty(artist)) // hasOwnProperty gets only custom prototyped :)
					rowstr += "<tr class=\"artist-type playable\" data-type=\"album\" data-artist="+player.artists[artist].name+"><td>"+player.artists[artist].name+"</td></tr>";

		//create the table of albums
		if (filterid=="albums")
			for (var artist in player.artists)
				if (player.artists.hasOwnProperty(artist))
					for (var album in player.artists[artist].albums)
						if (player.artists[artist].albums.hasOwnProperty(album)){
							rowstr += "<tr><td>"+player.artists[artist].name+"</td>";
							rowstr += "<td>"+ player.artists[artist].albums[album].title +" </td>";
							rowstr += "<td>"+ player.artists[artist].albums[album].year+"</td>";
							rowstr += "<td> <img class=\"cover\" src=\"assets/resources/albums/covers/"+player.artists[artist].albums[album].cover +"\"/> </td></tr>";
						}

		//create the table of tracks
		if (filterid=="songs")
			for (var artist in player.artists)
				if (player.artists.hasOwnProperty(artist))
					for (var album in player.artists[artist].albums)
						if (player.artists[artist].albums.hasOwnProperty(album))
							for (var track in player.artists[artist].albums[album].tracks)
								if (player.artists[artist].albums[album].tracks.hasOwnProperty(track)){
									rowstr += "<tr><td>"+player.artists[artist].albums[album].tracks[track].title+"</td>";
									rowstr += "<td>"+player.artists[artist].name+"</td>";
									rowstr += "<td>"+player.artists[artist].albums[album].tracks[track].lngth+"</td>";
									rowstr += "<td>"+player.artists[artist].albums[album].title+"</td></tr>";
								}
									



		document.getElementById("content").innerHTML = rowstr;
		// var aresongs=(filterid=="songs");
		// for (var i=0; i<content.structure.length; i++){
		// 	//if songs are not registered then register the songs and set the flag to true
		// 	if (aresongs && !player.registered)
		// 		player.registerSong(content.structure[i].id);
		// 	//creating the content of the table
		// 	//used even and odd, in the future i have to use only css...
		// 	if (i%2==0)
		// 		rowstr+="<tr class=\"songp even\"";
		// 	else
		// 		rowstr+="<tr class=\"songp odd\"";

		// 	//have to sanitize all this:
		// 	//i have to change player.playSong and maybe data- here :(
		// 	rowstr+=(filterid=="songs") ? " data-name=\""+content.structure[i].songs+"\" data-id=\""+content.structure[i].id+"\" onclick=\"player.playSong(" +content.structure[i].id+")\">" : ">";
		// 	if (filterid=="songs") player.playlistPush(content.structure[i].songs);// adds the name of the song to the playlist... little ugly
		// 	rowstr+= (filterid=="songs") ? "<td>"+ content.structure[i].songs+"</td>" : "";
		// 	rowstr+="<td>"+ content.structure[i].artists+"</td>";
		// 	rowstr+= (filterid=="songs") ? "<td>"+ content.structure[i].time +"</td>" : "";
		// 	rowstr+= (filterid!="artists") ? "<td>"+ content.structure[i].albums+"</td>" : "";
		// 	rowstr+="</tr>"
		// }
		// registered=true;
		// if (aresongs) totalsongs = content.structure.length;
		
		// document.getElementById("content").innerHTML = rowstr;


	}


 
	//hide or show a element
	function _showHideElement(element){
		if (document.getElementById(element).style.display == "none")
			document.getElementById(element).style.display = "";
		else 
			document.getElementById(element).style.display = "none";
	}

	//toggles the sidebar
	function _toggleMenu(){
		//have to reuse here..
		var elemsec =document.getElementById("section");
		var elemcpl =document.getElementById("currently-playing");
		var elemfil =document.getElementById("filters");

		if (utilities.hasClass(elemcpl,"on")){
			utilities.removeClass(elemcpl,"on");
			utilities.removeClass(elemfil,"on");
			utilities.removeClass(elemsec,"full-width");
		}else{
			utilities.addClass(elemcpl,"on");
			utilities.addClass(elemfil,"on");
			utilities.addClass(elemsec,"full-width");
		}


	}

	//toggles the sidebar
	function _toggleMenuMob(){
		var elem =document.getElementById("currently-playing");
		if (utilities.hasClass(elem,"on"))
			utilities.removeClass(elem,"on");
		else
			utilities.addClass(elem,"on");
	}

	function _chooseStar(size) {
		return function() {
			var elem;
			for (var xx=1; xx<=5; xx++){
				if (xx<=size){
		 			elem= document.getElementById("star"+xx);
		 			utilities.removeClass(elem,"icon-star");
	 				utilities.addClass(elem,"icon-star2");
				}else{
		 			elem= document.getElementById("star"+xx);
		 			utilities.removeClass(elem,"icon-star2");
	 				utilities.addClass(elem,"icon-star");
				}
				
			}
		};
	}

	//hides the dropzones
	function _hideDragArea(){
		//i have to hide with a time out, because if drop area disappears first
		//i cant drop on the drop zone, race condition
		setTimeout( function(){
			utilities.addClass(document.getElementById("drop-zone-fav"),"hide");
			utilities.removeClass(document.getElementById("player"),"drop-zone");
		},200);
	}

	//shows the dropzones
	function _showDragArea(){
		
		utilities.removeClass(document.getElementById("drop-zone-fav"),"hide");
		utilities.addClass(document.getElementById("player"),"drop-zone");
		
	
	}



	//shows the context menu (play and addtofav)
	function _showContextMenu(data){
		return function(event){
			draggedthing=null;
			var contextmenu=document.getElementById("context-menu");
			var placetext=document.getElementById("context-menu-list");
			placetext.innerHTML="<li><a href=\"#\" onclick=\"playSongContext("+data+")\">Play song</li>";
			placetext.innerHTML+="<li><hr></li>";
			placetext.innerHTML+="<li><a href=\"#\" onclick=\"addToFavoritesContext("+data+")\">Add to favorite</li>";
			utilities.removeClass(contextmenu,"hide");
			contextmenu.style.transform="translate3d("+(mouse.x)+"px, "+(mouse.y)+"px, 0)";
			_hideDragArea();	
		}
	}

	//hide context menu (not inmediately)
	function _hideContextMenu(){
		setTimeout(
			function(){
				utilities.addClass(document.getElementById("context-menu"),"hide");	
			}
		,200);

	}


    // Reveal
    return {
        showHideElement: _showHideElement,
        toggleMenu: _toggleMenu,
        toggleMenuMob: _toggleMenuMob,
        chooseStar: _chooseStar,
        hideDragArea: _hideDragArea,
        showDragArea: _showDragArea,
        showContextMenu: _showContextMenu,
        hideContextMenu: _hideContextMenu,
        fillTables: _fillTables
    };
})();








//Events Logger Module
var dataLoad = (function () {
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

  //create a promise for each json (.all), then fill the tables, then add the listeners to those tables
  function _createObjects(art_path, alb_path, sng_path){
    var _promises = [_get(art_path), _get(alb_path), _get(sng_path)];

    Promise.all(_promises).then(function(resultados) {

      return _jsonsToObjects(resultados);
    }, function() {
      console.log("error");
    }).then(function(r){ view.fillTables();  }).then(function(){songsListeners();});
  }
  // transforms a parsed json to an array of artists (artists have albums and albums have songs)
  function _jsonsToObjects(jsons){
    player.artists = [];
    var artistsjs=jsons[0]["artists"];
    var albumsjs=jsons[1]["albums"];
    var songsjs=jsons[2]["tracks"];
    // using hashtables for performance (3*n)..
    // loading artists
    for (var i=0; i<artistsjs.length; i++)
      //uso una hashtable para mejorar performance
      player.artists[artistsjs[i]["artist"]]= new Artist(artistsjs[i]["artist"]);

    // loading albums
    for (var i=0; i<albumsjs.length; i++)
      player.artists[ albumsjs[i]["artist"] ].albums[ albumsjs[i]["album"] ] = new Album(albumsjs[i]["album"], albumsjs[i]["year"], albumsjs[i]["cover"]);
    
    // loading tracks
    for (var i=0; i<songsjs.length; i++)
      player.artists[ songsjs[i]["artist"] ].albums[ songsjs[i]["album"] ].tracks[ songsjs[i]["song"] ] = new Track(songsjs[i]["song"], songsjs[i]["song"] );

    return player.artists;
  }

    // Reveal
    return {
        createObjects: _createObjects,
        getPromiseJSON: _get
    };
})();





dataLoad.createObjects("assets/json/artistsv2.json","assets/json/albumsv2.json","assets/json/songsv2.json");

















// Modal module
var modal = (function () {
    var _actualmod;
	// adds a event to the log

	//puts a modal to a given id
	function _modalThis(idtomod) {
		_actualmod=idtomod;
		elem = document.getElementById(idtomod);
		elem.style.visibility = (elem.style.visibility == "visible") ? "hidden" : "visible";
	}

	//unmodal if something is modaled
	function _unmodal(){
		_modalThis(_actualmod);
	}
    // Reveal
    return {
        modalThis: _modalThis,
        unmodal:   _unmodal
    };
})();




// filters the data "songs", "artists", "albums"
function filter(tofilterid){
	console.log("ye");
	var path="assets/json/"+tofilterid+".json";
	var content=loadJSON(path,
         function(data) { console.log(data); },
         function(xhr) { console.error(xhr); },
         tofilterid);
	
	return true;
}

// loads a json
// method taken from http://stackoverflow.com/questions/9838812/how-can-i-open-a-json-file-in-javascript-without-jquery
function loadJSON(path, success, error, filterid)
{
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function()
    {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                if (success)
                    displaySounds(JSON.parse(xhr.responseText),filterid);
            } else {
                if (error)
                    error(xhr);
            }
        }
    };
    xhr.open("GET", path, true);
    xhr.send();

}

//converts a json to tables of the reproductor
function displaySounds(content, filterid){/*in json*/
	//maybe a template here? remove the spaggetti code and sanitize
	//creating the header of the table
	var rowstr="<tr class=\"theader\">";
	switch(filterid) {
  		case "artists":
       		rowstr+="<th>Artista</th>";
       	break;
    	case "albums":
       		rowstr+="<th>Artista</th><th>Album</th>";
       	break;
    	default:
    		rowstr+="<th>Pista</th><th>Artista</th><th>Tiempo</th><th>Album</th>";
	}
	rowstr+="</tr>";
	var aresongs=(filterid=="songs");
	for (var i=0; i<content.structure.length; i++){
		//if songs are not registered then register the songs and set the flag to true
		if (aresongs && !player.registered)
			player.registerSong(content.structure[i].id);
		//creating the content of the table
		//used even and odd, in the future i have to use only css...
		if (i%2==0)
			rowstr+="<tr class=\"songp even\"";
		else
			rowstr+="<tr class=\"songp odd\"";

		//have to sanitize all this:
		//i have to change player.playSong and maybe data- here :(
		rowstr+=(filterid=="songs") ? " data-name=\""+content.structure[i].songs+"\" data-id=\""+content.structure[i].id+"\" onclick=\"player.playSong(" +content.structure[i].id+")\">" : ">";
		if (filterid=="songs") player.playlistPush(content.structure[i].songs);// adds the name of the song to the playlist... little ugly
		rowstr+= (filterid=="songs") ? "<td>"+ content.structure[i].songs+"</td>" : "";
		rowstr+="<td>"+ content.structure[i].artists+"</td>";
		rowstr+= (filterid=="songs") ? "<td>"+ content.structure[i].time +"</td>" : "";
		rowstr+= (filterid!="artists") ? "<td>"+ content.structure[i].albums+"</td>" : "";
		rowstr+="</tr>"
	}
	registered=true;
	if (aresongs){
		totalsongs = content.structure.length;
		songsListeners();
	}
	
	document.getElementById("content").innerHTML = rowstr;
};









//adds a song to favorites
function addToFavorites(){
	if (draggedthing){
		document.getElementById("sidebar-list").innerHTML+="<li><a href=\"#\" class=\"playable\" data-type="+draggedthing.reproductiontype+" data-artist="+draggedthing.artist+">"+draggedthing.artist+"</a></li>"
	}

	draggedthing=null;
	view.hideDragArea();
	songsListeners();
}

//adds a song to favorites from the context menu
function addToFavoritesContext(id){
	view.hideContextMenu();
	document.getElementById("sidebar-list").innerHTML+="<li><a href=\"#\" onclick=\"player.play("+id+")\">"+id+"</a></li>"
}
//plays a song from the context menu
function playSongContext(id){
	view.hideContextMenu();
	player.playSong(id);
}

//plays a dragged song
function playdraggedthing(){
	if (draggedthing){
		console.log("draggd "+draggedthing.artist);
		player.play(draggedthing);
	}
	draggedthing=null;
}

function playFromTable(data){
  return function(){
      player.play(data);
  }
}



//returns the song being dragged
function draggingASong(data) {
  return function(event) {
  	console.log("dragging this shit: "+data);
    draggedthing=data;
  }
}




//listeners in everything playable
function songsListeners(){
	songss = document.getElementsByClassName("playable");
	for (ll=0; ll<songss.length; ll++)
	{
		//play
		songss[ll].addEventListener("click", playFromTable( new PlayContext(songss[ll].getAttribute('data-type'), songss[ll].getAttribute('data-artist')))  );

		//drag
		songss[ll].addEventListener("mousedown",  draggingASong(new PlayContext(songss[ll].getAttribute('data-type'), songss[ll].getAttribute('data-artist')))  );

		//contextmenu
		songss[ll].addEventListener("contextmenu", view.showContextMenu(songss[ll].getAttribute('data-artist')));
	}

}





//updates the drag position
function updatedrag() { 
	if (dragging)
		draggable.style.transform="translate3d("+(mouse.x-60)+"px, "+(mouse.y-20)+"px, 0)";
	moving = false;
}

//start the dragging and drag areas
function mousedown(event) {
	dragging=true;


}
//stop the dragging and hide dragging rectangle
function mouseup() {
	dragging=false;
	utilities.addClass(draggable,"hide");
	view.hideDragArea();
}


//stop the dragging and hide dragging rectangle
function mousemove() {
	if (dragging){
		view.showDragArea();
	}
}






var playbtn, pausebtn, backbtn, nextbtn, lbtn, rbtn, playing, eventbtn, volumebtn, filtersongs, filteralbums, filterartists,toggler,modalel, rateit, songss;
var dragging;
var moving;
var draggable;
var mouse = {x: 0, y: 0};

var moving = false;
function estrellas(num){
	console.log(num);
}
function estrellasD(num){
  return function(){
      estrellas(num);
  }
}
// when site is loaded, loads the listeners and +
window.onload = function(){

	//have to fix this race condition in a nicer way:

	//filter("songs");

	//songsListeners();



	
	// event is triggered (for logs)
	document.onclick = function (e) { return eventsLogger.logEvent(e); };
	document.ondblclick = function (e) { return eventsLogger.logEvent(e); };
	document.onkeyup = function (e) { return eventsLogger.logEvent(e); };
	/*
	Other vars and Listeners
	*/
	moving=false;
	dragging=false;
	moving=false;
	draggable=document.getElementById("draggable");
	playbtn = document.getElementById("btn-play");
	pausebtn = document.getElementById("btn-pause");
	backbtn = document.getElementById("btn-back");
	nextbtn = document.getElementById("btn-next");
	lbtn = document.getElementById("btn-l");
	rbtn = document.getElementById("btn-r");
	playing = document.getElementById("playing");
	eventbtn = document.getElementById("btn-events");
	volumebtn = document.getElementById("btn-volume");
	filtersongs = document.getElementById("filter-songs");
	filteralbums = document.getElementById("filter-albums");
	filterartists = document.getElementById("filter-artists");
	toggler= document.getElementById("btn-hide-show-side");
	togglermob= document.getElementById("btn-hide-show-side-mobile");
	modalel=  document.getElementsByClassName("modal");
	ratebtn = document.getElementById("rate");
	dropzone=document.getElementById("drop-zone-fav");
	dropzoneplay=document.getElementById("player");
	songtables=document.getElementById("content");
	
	//stars=document.getElementsByClassName("icon-star");

	playbtn.addEventListener("click", function(){player.playSong(player.getCurrentSong())} );
	pausebtn.addEventListener("click", player.pauseSong );
	backbtn.addEventListener("click", player.playPrevSong );
	nextbtn.addEventListener("click", player.playNextSong );
	playing.addEventListener("click", player.moveToPosition);
	lbtn.addEventListener("click", player.setRepeat );
	rbtn.addEventListener("click", player.setRandom );
	volumebtn.addEventListener("click", player.muteSound );
	volumebtn.addEventListener("mouseover", function(){ view.showHideElement("volume")} );
	volumebtn.addEventListener("mouseout", function(){ view.showHideElement("volume")} );
	filtersongs.addEventListener("click", function(){filter("songs")} );
	filteralbums.addEventListener("click", function(){filter("albums")} );
	filterartists.addEventListener("click", function(){filter("artists")} );
	toggler.addEventListener("click", function(){view.toggleMenu()} );
	togglermob.addEventListener("click", function(){view.toggleMenuMob()} );

	eventbtn.addEventListener("click", function(){ modal.modalThis("event-log-box")} );
	ratebtn.addEventListener("click", function(){ modal.modalThis("rate-it")} );
	songtables.addEventListener("mousedown", mousedown);
	document.addEventListener("mouseup", mouseup);
	document.addEventListener("mousemove", mousemove);

	songtables.addEventListener("click",view.hideContextMenu);//hide the menu fix
	dropzone.addEventListener("mouseover", addToFavorites );
	dropzoneplay.addEventListener("mouseover", playdraggedthing );
	for (var i=0; i < modalel.length; i++)
		modalel[i].addEventListener("click", modal.unmodal );





	//rating
	// have to put all in only one var
	var choose1 = view.chooseStar(1);
	var choose2 = view.chooseStar(2);
	var choose3 = view.chooseStar(3);
	var choose4 = view.chooseStar(4);
	var choose5 = view.chooseStar(5);
	document.getElementById('star1').onmouseover = choose1;
	document.getElementById('star2').onmouseover = choose2;
	document.getElementById('star3').onmouseover = choose3;
	document.getElementById('star4').onmouseover = choose4;
	document.getElementById('star5').onmouseover = choose5;


	

	//drag listeners
	document.addEventListener('mousemove', function(e){ 
		mouse.x = e.clientX || e.pageX; 
		mouse.y = e.clientY || e.pageY;
		//console.log(mouse.x);
		if (!moving) {
			if (dragging){
				utilities.removeClass(draggable,"hide");
			}
			moving = true;
			requestAnimationFrame(updatedrag);
		}
	}, false);

	//hide the default menu


	//para q no joda esto x ahora	
	// document.addEventListener('contextmenu', function(ev) {
	//     ev.preventDefault();
	//     return false;
	// }, false);


	
}

