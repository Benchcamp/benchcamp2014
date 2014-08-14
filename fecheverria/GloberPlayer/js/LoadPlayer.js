var LoadPlayer =( function (refreshView) {
    'use strict';
    
    var listOfArtists = [];
    var listOfAlbums = [];
    var listOfSongs = [];
    var listOfTracks = [];
    
    var musicPath = "music/";
    
    var handleLoad = function (event) {
        
        
        console.log("Preloaded:", event.id, event.src);
        
        var track = dataTrack(event.id);
        
        refreshView.showSong(track);

    };
    
    var dataTrack = function(id){
        var track;
        for(var i=0; i< listOfTracks.length ; i++){
            if(listOfTracks[i].id == id){
                track = listOfTracks[i];
            }
        }
        return track;  
    };

    return{
        firstloadInfo: function (loadInfo) {

            var listSongs = loadInfo.songs();
            var listAlbums = loadInfo.albums();
            var listartists = loadInfo.artists();

            refreshView.selectedItem( "itemTypes", "showSongs");

            for(var i=0; i< listSongs.length ; i++){
                listOfSongs.push( {id: "song" + (i+1) , 
                                        src: listSongs[i].name 
                                       } );
                listOfTracks.push( {id: "song" + (i+1) , 
                                        src: listSongs[i].name , 
                                        artist: listSongs[i].artist,
                                        album: listSongs[i].album,
                                        song: listSongs[i].song
                } );
                listOfAlbums.push( { 
                                            artist: listSongs[i].artist,
                                            album: listSongs[i].album
                } );
                listOfArtists.push( { 
                                            artist: listSongs[i].artist
                } );
            }

        },

        loadSound: function () {

            if (!createjs.Sound.initializeDefaultPlugins()) { 
                alert("the browser can't reproduce music !");
            } else {

                createjs.Sound.alternateExtensions = ["mp3"];
                createjs.Sound.addEventListener("fileload", createjs.proxy(this.handleLoad, this));
                createjs.Sound.registerManifest(listOfSongs, musicPath);
            }
        }

    };
    
}(RefreshView));