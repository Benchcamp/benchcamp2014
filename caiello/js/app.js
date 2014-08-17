/*
Track
*/
function Track(title, lngth, filename) {
    this.title = title || "";
    this.lngth = lngth || 0;
    this.file = filename || "";
}
Track.prototype.lyric_cache = '';
Track.prototype.setLyricCache = function(lyric) {
    this.lyric_cache = lyric;
}

/*
Album
*/
function Album(title, year, cover) {
    this.title = title || "";
    this.year = year || "";
    this.cover = cover || "nocover.png";
    this.tracks = [];
}
Album.prototype.pushTrack = function(track) {
    this.albums.push(album);
}
Album.prototype.setTracks = function(tracks) {
    this.tracks = tracks;
}

/*
Artist
*/
function Artist(name) {
        this.name = name;
        this.albums = [];
    }
    //Artist.prototype.albums = [];
Artist.prototype.pushAlbum = function(album) {
    this.albums.push(album);
}
Artist.prototype.setAlbums = function(albums) {
    this.albums = albums;
}



//this class will represent the context to play (an entire artist?, an album? a track?)
function PlayContext(reproductiontype, artist, album, track) {
    this.reproductiontype = reproductiontype || "";
    this.artist = artist || "";
    this.album = album || "";
    this.track = track || "";
}



/*
Here i use the pattern observer in the player to show the lyrics
*/

//the observable class (player)
var PlayerObservable = function() {
    this.subscribers = [];// will be only one :)
}
 
PlayerObservable.prototype = {
    subscribe: function(callback) {
        this.subscribers.push(callback);
    },
    unsubscribe: function(callback) {
        for (var i=0 ; i < this.subscribers.length; i++) {
            if (this.subscribers[i] === callback) {
                this.subscribers.splice(i, 1);//removing the suscriber..
                return;//stop the iteration
            }
        }
    },
    publish: function(data) {
        // call all the suscribers
        for (var i=0 ; i < this.subscribers.length; i++) {
            this.subscribers[i](data);
        }        
    }
};

//the lyrics observer
var LyricsObserver = function (data) {
    
    var promises = [dataLoad.getPromiseJSON(config.lyricsapi+""+data)];

    Promise.all(promises).then(function(resultados) {    
        //i'm not caching the lyrics yet...
        document.getElementById("lyrics").innerText=resultados[0][0].snippet;
    });


}
 
var observable = new PlayerObservable();
observable.subscribe(LyricsObserver);







//Player
var player = (function() {
    var _instance;
    var _timing;
    var _draggedthing;
    var _currentartist;
    var _currentalbum;
    var _currentsong;
    var _registeredsong=[];
    var _playingcontext;
    var _repeat = false;
    var _random = false;
    var _registered = false;
    var _artists = []; //artists has all the data (artists, albums, and tracks)
    var _playing;
    var _endofreproduction=false;


    // instantiate the context to play and start playing it
    function _play(playingcontext) {
        _endofreproduction=false;
        _playingcontext = playingcontext;
        _playNextSong(true);
    }



    // plays a song. It requires the artist and album for performance (because im using a hashtable)
    function _playSong(artist, album, songname) {
        if (artist) { //if not artist provided plays the current song 
            _currentsong = player.artists[artist].albums[album].tracks[songname];
            _currentalbum = album;
            _currentartist = artist;
        }
        observable.publish(_currentsong.title+" "+_currentartist);
        document.getElementById("song-name").innerText = _currentsong.title;

        if (!(_instance && _instance.resume())) { //resume pause
            if (_instance) //stops current song
                _stopSong();
            _instance = createjs.Sound.play(_currentsong.title); //plays selected
        }
        _instance.addEventListener("complete", _songEnds);
        //change btn from play to pause
        elements.playbtn.style.display = "none";
        elements.pausebtn.style.display = "";
        _timing = setInterval(_update, 3); //most fluid than 1000
        view.hideDragArea();
    }


    // handle what happens when a song ends
    // if is repeating or random or the reproduction list didn't end, then plays the next song
    function _songEnds() {
        if ((_repeat)||(_random)){
            if (_endofreproduction)
                _play(_playingcontext);//if is repeat or random and end of reproduction, start again the playingcontext
            
            else
                _playNextSong();//if is repeat or random and is not the last song play the next..       
        }else{
            if (_endofreproduction)
                _stopSong(); // is not repeat, not random and is the end of reproduction, then stop
            else
                _playNextSong();//is not repeat or random, but it's more to play, then play it
        }
    }

    // pause the current song
    function _pauseSong() {
        _instance.pause();
        clearInterval(_timing);
        elements.pausebtn.style.display = "none";
        elements.playbtn.style.display = "";
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
            return {
                x: xPosition,
                y: yPosition
            };
        }
    
    // moves the player to a position given by an event
    function _moveToPosition(e) { //gets the position from event
            if (_instance) {
                var parentpos = _getPosition(e.currentTarget);
                var posx = e.clientX - parentpos.x;
                var pbwidth = document.getElementById("playing").clientWidth;
                _instance.setPosition((posx / pbwidth) * _instance.getDuration());
                _update();
            }
        }
    
    // update all items (transcurred time, progressbar, circle)
    function _update() {
        var playedms = _instance.getPosition();
        document.getElementById("transcurredtime").innerHTML = parseInt(utilities.msToMinutes(playedms)) + ":" + parseInt(utilities.msToSecondsWithoutMinutes(playedms));
        var percentplayed = utilities.percent(playedms, _instance.getDuration());
        document.getElementById("progressbar").style.width = percentplayed + "%";
    }

    // register a song
    function _registerSong(filename, title) {
    	if (!_registeredsong[title]){
    		createjs.Sound.registerSound("assets/resources/songs/" + filename, title);
    		_registeredsong[title]=true;	
    	}
        
    }

    //registers all the songs in the structure
    function _registerAllSongs() {
            for (var artist in player.artists)
                if (player.artists.hasOwnProperty(artist))
                    for (var album in player.artists[artist].albums)
                        if (player.artists[artist].albums.hasOwnProperty(album))
                            for (var track in player.artists[artist].albums[album].tracks)
                                if (player.artists[artist].albums[album].tracks.hasOwnProperty(track)){
                                    _registerSong(player.artists[artist].albums[album].tracks[track].file, player.artists[artist].albums[album].tracks[track].title);
                                }

    }

    // mute the sound
    function _muteSound() {
        if (_instance)
            _instance.setMute(!_instance.getMute());
        if (_instance.getMute())
            utilities.removeClass(document.getElementById("i-shuffle"), "inactive");
        else
            utilities.addClass(document.getElementById("i-shuffle"), "inactive");
    }

    function _getCurrentSong() {
        return _currentsong;
    }

    function _setCurrentSong(currentsong) {
        this._currentsong = currentsong;
    }

    function _registered() {
        return _currentsong;
    }

    function _changeSong(q) {
        _currentsong += q;
    }

    function _playlistPush(songname) {
        _playlist.push(songname);
    }

    function _getTotalSongs() {
        return _playlist.length;
    }

    function _getSongName(id) {
        return _playlist[id];
    }

    //plays the previous song
    //this is absolutely not optimum, i was planifying to use a yield but is not working properly in chrome...
    function _playPrevSong() {

        var tempart="";var tempalb="";var tempsong="";
        for (var album in player.artists[_playingcontext.artist].albums)
            if (player.artists[_playingcontext.artist].albums.hasOwnProperty(album))
                for (var track in player.artists[_playingcontext.artist].albums[album].tracks)
                    if (player.artists[_playingcontext.artist].albums[album].tracks.hasOwnProperty(track)) {

                        if (_currentsong.title == track){
                        	return _playSong(tempart, tempalb, tempsong);
                        }
                        tempart=_playingcontext.artist; tempalb=album; tempsong=track;
                            
                    }
    }
    
    //plays the next song, if it's playing for first time choose a first song to play
    //this is absolutely not optimum, i was planifying to use a yield but is not working properly in chrome...
    function _playNextSong(firstplay) {
        iscurrent = false;
        if (_playingcontext.reproductiontype=="song"){
            _endofreproduction=true;
            return _playSong(_playingcontext.artist, _playingcontext.album, _playingcontext.track);
        }
        if (_playingcontext.reproductiontype=="album"){
            for (var track in player.artists[_playingcontext.artist].albums[_playingcontext.album].tracks)
                if (player.artists[_playingcontext.artist].albums[_playingcontext.album].tracks.hasOwnProperty(track)) {
                    if ((iscurrent)||(firstplay)) //is the next
                        return _playSong(_playingcontext.artist, _playingcontext.album, track);
                    if (_currentsong.title == track)
                        iscurrent = true;
                }
            _endofreproduction=true;
            if (_repeat)
                _play(_playingcontext);
        }


        if (_playingcontext.reproductiontype=="artist"){

            for (var album in player.artists[_playingcontext.artist].albums)
                if (player.artists[_playingcontext.artist].albums.hasOwnProperty(album))
                    for (var track in player.artists[_playingcontext.artist].albums[album].tracks)
                        if (player.artists[_playingcontext.artist].albums[album].tracks.hasOwnProperty(track)) {

                            if ((iscurrent)||(firstplay))
                                return _playSong(_playingcontext.artist, album, track);
                            if (_currentsong.title == track)
                                iscurrent = true;
                        } 
            _endofreproduction=true;
            if (_repeat)
                _play(_playingcontext);
        }


    }

    // negate the random bool state
    function _setRandom() {
        _random = !_random;
        if (_random)
            utilities.removeClass(document.getElementById("i-shuffle"), "inactive");
        else
            utilities.addClass(document.getElementById("i-shuffle"), "inactive");
    }

    // negates repeat (have to reuse the method setrandom..)
    function _setRepeat() {
        _repeat = !_repeat;
        if (_repeat)
            utilities.removeClass(document.getElementById("i-loop"), "inactive");
        else
            utilities.addClass(document.getElementById("i-loop"), "inactive");
    }

    // set the array of artists with the albums and tracks
    function _setArtists(artists) {
        _artists = artists;
    }
    //plays a song from the context menu
    function _playSongContext(id) {
        view.hideContextMenu();
        _playSong(id);
    }

    //plays a dragged song
    function _playDraggedThing() {

        if (player.draggedthing) {

            player.play(player.draggedthing);
        }
        player.draggedthing = null;
        view.hideDragArea();
    }

    function _playFromTable(data) {
        return function() {
            player.play(data);
        }
    }

 



    // Reveal
    return {
        playSong: _playSong,
        songEnds: _songEnds,
        pauseSong: _pauseSong,
        stopSong: _stopSong,
        getPosition: _getPosition,
        moveToPosition: _moveToPosition,
        update: _update,
        registerAllSongs: _registerAllSongs,
        muteSound: _muteSound,
        getCurrentSong: _getCurrentSong,
        setCurrentSong: _setCurrentSong,
        registered: _registered,
        changeSong: _changeSong,
        playlistPush: _playlistPush,
        getTotalSongs: _getTotalSongs,
        getSongName: _getSongName,
        playPrevSong: _playPrevSong,
        playNextSong: _playNextSong,
        setRepeat: _setRepeat,
        setRandom: _setRandom,
        setArtists: _setArtists,
        artists: _artists,
        playSongContext: _playSongContext,
        playDraggedThing: _playDraggedThing,
        playFromTable: _playFromTable,
        draggedthing: _draggedthing,
        play: _play
    };
})();




//View module
var view = (function() {


    var _dragging;
    var _moving;
    var _mouse = {
        x: 0,
        y: 0
    };

    // creates the song, albums and artists tables
    function _fillTables(filterid) {
    		var rowstr ="<table class=\"t-filters\" id=\"t-artists\">";
    		rowstr += "<tr class=\"theader\">";
        	rowstr += "<th>Artista</th>";
        	rowstr += "</tr>";
        	// create the table of artists
            for (var artist in player.artists)
                if (player.artists.hasOwnProperty(artist)) // hasOwnProperty gets only custom prototyped :)
                    rowstr += "<tr class=\"artist-type playable\" data-type=\"artist\" data-artist=" + player.artists[artist].name + "><td>" + player.artists[artist].name + "</td></tr>";
            rowstr +="</table>";


            rowstr +="<table class=\"t-filters hide\" id=\"t-albums\">";
            rowstr += "<tr class=\"theader\">";
 			rowstr += "<th>Artista</th><th>Album</th><th>A&ntilde;o</th><th>Cover</th>";
 			rowstr += "</tr>";
            //create the table of albums
            for (var artist in player.artists)
                if (player.artists.hasOwnProperty(artist))
                    for (var album in player.artists[artist].albums)
                        if (player.artists[artist].albums.hasOwnProperty(album)) {
                            rowstr += "<tr class=\"album-type playable\" data-type=\"album\" data-artist=" + player.artists[artist].name + " data-album=\"" + player.artists[artist].albums[album].title + "\" ><td>" + player.artists[artist].name + "</td>";
                            rowstr += "<td>" + player.artists[artist].albums[album].title + " </td>";
                            rowstr += "<td>" + player.artists[artist].albums[album].year + "</td>";
                            rowstr += "<td> <img class=\"cover\" src=\"assets/resources/albums/covers/" + player.artists[artist].albums[album].cover + "\"/> </td></tr>";
                        }
            rowstr +="</table>";

            rowstr +="<table class=\"t-filters hide\" id=\"t-songs\">";
		    rowstr += "<tr class=\"theader\">";
            rowstr += "<th>Pista</th><th>Artista</th><th>Tiempo</th><th>Album</th>";    
            rowstr += "</tr>";    
            //create the table of tracks
            for (var artist in player.artists)
                if (player.artists.hasOwnProperty(artist))
                    for (var album in player.artists[artist].albums)
                        if (player.artists[artist].albums.hasOwnProperty(album))
                            for (var track in player.artists[artist].albums[album].tracks)
                                if (player.artists[artist].albums[album].tracks.hasOwnProperty(track)) {
                                    rowstr += "<tr class=\"song-type playable\" data-type=\"song\" data-artist=" + player.artists[artist].name + " data-album=\"" + player.artists[artist].albums[album].title + "\" data-song=\""+player.artists[artist].albums[album].tracks[track].title +"\" ><td>" + player.artists[artist].albums[album].tracks[track].title + "</td>";
                                    rowstr += "<td>" + player.artists[artist].name + "</td>";
                                    rowstr += "<td>" + player.artists[artist].albums[album].tracks[track].lngth + "</td>";
                                    rowstr += "<td>" + player.artists[artist].albums[album].title + "</td></tr>";
                                }
            rowstr +="</table>";

        document.getElementById("content").innerHTML = rowstr;

    }



    //hide or show a element
    function _showHideElement(element) {
        if (document.getElementById(element).style.display == "none")
            document.getElementById(element).style.display = "";
        else
            document.getElementById(element).style.display = "none";
    }

    //toggles the sidebar
    function _toggleMenu() {
        //have to reuse here..
        var elemsec = document.getElementById("section");
        var elemcpl = document.getElementById("currently-playing");
        var elemfil = document.getElementById("filters");

        if (utilities.hasClass(elemcpl, "on")) {
            utilities.removeClass(elemcpl, "on");
            utilities.removeClass(elemfil, "on");
            utilities.removeClass(elemsec, "full-width");
        } else {
            utilities.addClass(elemcpl, "on");
            utilities.addClass(elemfil, "on");
            utilities.addClass(elemsec, "full-width");
        }


    }

    //toggles the sidebar
    function _toggleMenuMob() {
        var elem = document.getElementById("currently-playing");
        if (utilities.hasClass(elem, "on"))
            utilities.removeClass(elem, "on");
        else
            utilities.addClass(elem, "on");
    }

    //show or hide stars 1,2,3,4 or 5 stars ("size")
    function _chooseStar(size) {
        return function() {
            var elem;
            for (var xx = 1; xx <= 5; xx++) {
                if (xx <= size) {
                    elem = document.getElementById("star" + xx);
                    utilities.removeClass(elem, "icon-star");
                    utilities.addClass(elem, "icon-star2");
                } else {
                    elem = document.getElementById("star" + xx);
                    utilities.removeClass(elem, "icon-star2");
                    utilities.addClass(elem, "icon-star");
                }

            }
        };
    }

    //hides the dropzones
    function _hideDragArea() {
        //i have to hide with a time out, because if drop area disappears first
        //i cant drop on the drop zone, race condition
        setTimeout(function() {
            utilities.addClass(document.getElementById("drop-zone-fav"), "hide");
            utilities.removeClass(document.getElementById("player"), "drop-zone");
        }, 200);
    }

    //shows the dropzones
    function _showDragArea() {
        utilities.removeClass(document.getElementById("drop-zone-fav"), "hide");
        utilities.addClass(document.getElementById("player"), "drop-zone");
    }



    //shows the context menu (play and addtofav)
    function _showContextMenu(data) {
        return function(event) {

        
            var contextmenu = document.getElementById("context-menu");
            var placetext = document.getElementById("context-menu-list");
    
            utilities.removeClass(contextmenu, "hide");
            contextmenu.style.transform = "translate3d(" + (view.mouse.x) + "px, " + (view.mouse.y) + "px, 0)";
            contextmenu.style.webkitTransform= "translate3d(" + (view.mouse.x) + "px, " + (view.mouse.y) + "px, 0)";
            contextmenu.style.mozTransform= "translate3d(" + (view.mouse.x) + "px, " + (view.mouse.y) + "px, 0)";
           

        
            if (player.draggedthing) {
                if (player.draggedthing.reproductiontype=="song"){
                    placetext.innerHTML = "<li><a href=\"#\" class=\"playable\" data-type=\"" + player.draggedthing.reproductiontype + "\" data-artist=\"" + player.draggedthing.artist + "\" data-album=\"" + player.draggedthing.album + "\" data-track=\"" + player.draggedthing.track + "\">Play this</a></li>"
                    
                }
                    
                if (player.draggedthing.reproductiontype=="album"){
                    placetext.innerHTML =  "<li><a href=\"#\" class=\"playable\" data-type=\"" + player.draggedthing.reproductiontype + "\" data-artist=\"" + player.draggedthing.artist + "\" data-album=\"" + player.draggedthing.album + "\">Play this</a></li>"
                    
                }
                    
                if (player.draggedthing.reproductiontype=="artist"){
                    placetext.innerHTML =  "<li><a href=\"#\" class=\"playable\" data-type=\"" + player.draggedthing.reproductiontype + "\" data-artist=\"" + player.draggedthing.artist + "\">Play this</a></li>"
                    
                }
                    
 
            }

            player.draggedthing = null;
            view.hideDragArea();
            elements.songsListeners();



        }
    }




    //adds a song to favorites
    function _addToFavorites() {
        if (player.draggedthing) {
            if (player.draggedthing.reproductiontype=="song")
                document.getElementById("sidebar-fav").innerHTML += "<li><a href=\"#\" class=\"playable\" data-type=\"" + player.draggedthing.reproductiontype + "\" data-artist=\"" + player.draggedthing.artist + "\" data-album=\"" + player.draggedthing.album + "\" data-track=\"" + player.draggedthing.track + "\">" + player.draggedthing.track + "</a></li>"
            if (player.draggedthing.reproductiontype=="album")
                document.getElementById("sidebar-fav").innerHTML += "<li><a href=\"#\" class=\"playable\" data-type=\"" + player.draggedthing.reproductiontype + "\" data-artist=\"" + player.draggedthing.artist + "\" data-album=\"" + player.draggedthing.album + "\">" + player.draggedthing.album + "</a></li>"
            if (player.draggedthing.reproductiontype=="artist")
                document.getElementById("sidebar-fav").innerHTML += "<li><a href=\"#\" class=\"playable\" data-type=\"" + player.draggedthing.reproductiontype + "\" data-artist=\"" + player.draggedthing.artist + "\">" + player.draggedthing.artist + "</a></li>"
        }

        player.draggedthing = null;
        view.hideDragArea();
        elements.songsListeners();
    }




    //hide context menu (not inmediately)
    function _hideContextMenu() {
        setTimeout(
            function() {
                utilities.addClass(document.getElementById("context-menu"), "hide");
            }, 200);

    }


    // shows the table "songs", "artists" or "albums"
    function _filter(tofilterid) {
    	var alb=document.getElementById("t-albums");
    	var art=document.getElementById("t-artists");
    	var tra=document.getElementById("t-songs");

    	utilities.addClass(alb,"hide");
    	utilities.addClass(art,"hide");
    	utilities.addClass(tra,"hide");
    	utilities.removeClass(document.getElementById("t-"+tofilterid),"hide");

    }

    //adds a song to favorites from the context menu
    function _addToFavoritesContext(id) {
            view.hideContextMenu();
            document.getElementById("sidebar-list").innerHTML += "<li><a href=\"#\" onclick=\"player.play(" + id + ")\">" + id + "</a></li>"
    }




    //returns the song being dragged
    function _draggingASong(data) {
        return function(event) {
            player.draggedthing = data;
        }
    }

    //updates the drag position
    function _updatedrag() {
        if (view.dragging){
            draggable.style.transform = "translate3d(" + (view.mouse.x - 60) + "px, " + (view.mouse.y - 20) + "px, 0)";
            draggable.style.webkitTransform = "translate3d(" + (view.mouse.x - 60) + "px, " + (view.mouse.y - 20) + "px, 0)";
            draggable.style.MozTransform = "translate3d(" + (view.mouse.x - 60) + "px, " + (view.mouse.y - 20) + "px, 0)";
        }
        view.moving = false;
    }

    //start the dragging and drag areas
    function _mousedown(event) {
            view.dragging = true;

    }
        
    //stop the dragging and hide dragging rectangle
    function _mouseup() {
        view.dragging = false;
        setTimeout(function() {
            player.draggedthing = null
        }, 1000); //removes the dragged thing in a sec. have to solve this in a better way
        utilities.addClass(draggable, "hide");
        view.hideDragArea();
    }


    //stop the dragging and hide dragging rectangle
    function _mousemove() {
        if (view.dragging) {
            view.showDragArea();
        }
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
        fillTables: _fillTables,
        filter: _filter,
        addToFavorites: _addToFavorites,
        addToFavoritesContext: _addToFavoritesContext,
        draggingASong: _draggingASong,
        updatedrag:_updatedrag,
        mousedown:_mousedown,
        mouseup:_mouseup,
        mousemove:_mousemove,
        dragging:_dragging,
        moving:_moving,
        mouse:_mouse


    };
})();




//loads data from jsons with promises
var dataLoad = (function() {
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
    function _createObjects(art_path, alb_path, sng_path, filter) {
        var _promises = [_get(art_path), _get(alb_path), _get(sng_path)];

        Promise.all(_promises).then(function(resultados) {

            return _jsonsToObjects(resultados);
        }, function() {
            console.log("error");
        }).then(function(r) {
            view.fillTables(filter);
        }).then(function() {
            elements.songsListeners();
        }).then(function() {
            player.registerAllSongs();
        });
    }
    
    // transforms a parsed json to an array of artists (artists have albums and albums have songs)
    function _jsonsToObjects(jsons) {
        player.artists = [];
        var artistsjs = jsons[0]["artists"];
        var albumsjs = jsons[1]["albums"];
        var songsjs = jsons[2]["tracks"];
        // using hashtables for performance (3*n)..
        // loading artists
        for (var i = 0; i < artistsjs.length; i++)
            player.artists[artistsjs[i]["artist"]] = new Artist(artistsjs[i]["artist"]);

        // loading albums
        for (var i = 0; i < albumsjs.length; i++)
            player.artists[albumsjs[i]["artist"]].albums[albumsjs[i]["album"]] = new Album(albumsjs[i]["album"], albumsjs[i]["year"], albumsjs[i]["cover"]);

        // loading tracks
        for (var i = 0; i < songsjs.length; i++)
            player.artists[songsjs[i]["artist"]].albums[songsjs[i]["album"]].tracks[songsjs[i]["song"]] = new Track(songsjs[i]["song"], songsjs[i]["time"], songsjs[i]["file"]);

        return player.artists;
    }

    // Reveal
    return {
        createObjects: _createObjects,
        getPromiseJSON: _get
    };
})();












//This class represents all elements in the DOM and listeners
function Elements() {

    /*
    Other vars and Listeners
    */

    //i have to improve the performance of this not calling directly to the document everytime...
    this.draggable = document.getElementById("draggable");
    this.playbtn = document.getElementById("btn-play");
    this.pausebtn = document.getElementById("btn-pause");
    this.backbtn = document.getElementById("btn-back");
    this.nextbtn = document.getElementById("btn-next");
    this.lbtn = document.getElementById("btn-l");
    this.rbtn = document.getElementById("btn-r");
    this.playing = document.getElementById("playing");
    this.eventbtn = document.getElementById("btn-events");
    this.volumebtn = document.getElementById("btn-volume");
    this.filtersongs = document.getElementById("filter-songs");
    this.filteralbums = document.getElementById("filter-albums");
    this.filterartists = document.getElementById("filter-artists");
    this.toggler = document.getElementById("btn-hide-show-side");
    this.togglermob = document.getElementById("btn-hide-show-side-mobile");
    this.modalel = document.getElementsByClassName("modal");
    this.ratebtn = document.getElementById("rate");
    this.dropzone = document.getElementById("drop-zone-fav");
    this.dropzoneplay = document.getElementById("player");
    this.songtables = document.getElementById("content");

}

//This function is used to listen in everything playable, for example the tables of songs, albums, artists, or the favorites or context menus
Elements.prototype.songsListeners = function() {
    //listeners in everything playable
    songss = document.getElementsByClassName("playable");
    for (ll = 0; ll < songss.length; ll++) {
        //play
        songss[ll].addEventListener("click", player.playFromTable(new PlayContext(songss[ll].getAttribute('data-type'), songss[ll].getAttribute('data-artist'), songss[ll].getAttribute('data-album'), songss[ll].getAttribute('data-song') )));

        //drag
        songss[ll].addEventListener("mousedown", view.draggingASong(new PlayContext(songss[ll].getAttribute('data-type'), songss[ll].getAttribute('data-artist'), songss[ll].getAttribute('data-album'), songss[ll].getAttribute('data-song'))));

        //contextmenu
        songss[ll].addEventListener("contextmenu", view.showContextMenu(new PlayContext(songss[ll].getAttribute('data-type'), songss[ll].getAttribute('data-artist'), songss[ll].getAttribute('data-album'), songss[ll].getAttribute('data-song'))));
    }
}



Elements.prototype.executeListeners = function() {
    // event is triggered (for logs)
    document.onclick = function(e) {
        return eventsLogger.logEvent(e);
    };
    document.ondblclick = function(e) {
        return eventsLogger.logEvent(e);
    };
    document.onkeyup = function(e) {
        return eventsLogger.logEvent(e);
    };


    this.playbtn.addEventListener("click", function() {
        player.playSong()
    });
    this.pausebtn.addEventListener("click", player.pauseSong);
    this.backbtn.addEventListener("click", player.playPrevSong);
    this.nextbtn.addEventListener("click", function() {
        player.playSong(player.playNextSong())
    });
    this.playing.addEventListener("click", player.moveToPosition);
    this.lbtn.addEventListener("click", player.setRepeat);
    this.rbtn.addEventListener("click", player.setRandom);
    this.volumebtn.addEventListener("click", player.muteSound);
    this.volumebtn.addEventListener("mouseover", function() {
        view.showHideElement("volume")
    });
    this.volumebtn.addEventListener("mouseout", function() {
        view.showHideElement("volume")
    });
    this.filtersongs.addEventListener("click", function() {
        view.filter("songs")
    });
    this.filteralbums.addEventListener("click", function() {
        view.filter("albums")
    });
    this.filterartists.addEventListener("click", function() {
        view.filter("artists")
    });
    this.toggler.addEventListener("click", function() {
        view.toggleMenu()
    });
    this.togglermob.addEventListener("click", function() {
        view.toggleMenuMob()
    });

    this.eventbtn.addEventListener("click", function() {
        modal.modalThis("event-log-box")
    });
    this.ratebtn.addEventListener("click", function() {
        modal.modalThis("rate-it")
    });
    this.songtables.addEventListener("mousedown", view.mousedown);
    document.addEventListener("mouseup", view.mouseup);
    document.addEventListener("mousemove", view.mousemove);

    document.addEventListener("click", view.hideContextMenu); //hide the menu fix
    this.dropzone.addEventListener("mouseover", view.addToFavorites);
    this.dropzoneplay.addEventListener("mouseover", player.playDraggedThing);
    for (var i = 0; i < this.modalel.length; i++)
        this.modalel[i].addEventListener("click", modal.unmodal);
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
    document.addEventListener('mousemove', function(e) {
        view.mouse.x = e.clientX || e.pageX;
        view.mouse.y = e.clientY || e.pageY;
        if (!view.moving) {
            if (view.dragging) {
                utilities.removeClass(draggable, "hide");
            }
            view.moving = true;
            requestAnimationFrame(view.updatedrag);
        }
    }, false);
    

    //hide the default menu
    document.addEventListener('contextmenu', function(ev) {
        ev.preventDefault();
        return false;
    }, false);

}




var elements;

// i have to move this global vars to a module or something else..
// when site is loaded, loads the listeners and +, ill try to put all this as a module..
window.onload = function() {

    elements=new Elements();
    elements.executeListeners();
	dataLoad.createObjects(config.jsonart, config.jsonalb, config.jsonsng);

}