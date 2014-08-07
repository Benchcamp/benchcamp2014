var LoadPlayer = function () {
    'use strict';
    
    var self = this;
    
    var refreshView = new RefreshView();
    
    self.listOfArtists = [];
    self.listOfAlbums = [];
    
    self.listOfSongs = [];
    self.listOfTracks = [];
    
    self.musicPath = "";

    self.firstloadInfo = function (loadInfo) {
        
        var listSongs = loadInfo.songs();
        var listAlbums = loadInfo.albums();
        var listartists = loadInfo.artists();
        
        refreshView.selectedItem( "itemTypes", "showSongs");
        
        self.musicPath = "music/";
        
        for(var i=0; i< listSongs.length ; i++){
            self.listOfSongs.push( {id: "song" + (i+1) , 
                                    src: listSongs[i].name 
                                   } );
            self.listOfTracks.push( {id: "song" + (i+1) , 
                                    src: listSongs[i].name , 
                                    artist: listSongs[i].artist,
                                    album: listSongs[i].album,
                                    song: listSongs[i].song
            } );
            self.listOfAlbums.push( { 
                                        artist: listSongs[i].artist,
                                        album: listSongs[i].album
            } );
            self.listOfArtists.push( { 
                                        artist: listSongs[i].artist
            } );
        }
        
    };
    

    self.loadSound = function () {
        
        if (!createjs.Sound.initializeDefaultPlugins()) { 
            alert("the browser can't reproduce music !");
        } else {

            createjs.Sound.alternateExtensions = ["mp3"];
            createjs.Sound.addEventListener("fileload", createjs.proxy(this.handleLoad, this));
            createjs.Sound.registerManifest(self.listOfSongs, self.musicPath);
        }
    };

    self.handleLoad = function (event) {
        
        
        console.log("Preloaded:", event.id, event.src);
        
        var track = self.dataTrack(event.id);
        
        refreshView.showSong(track);

    };
    
    self.dataTrack = function(id){
        var track;
        for(var i=0; i< self.listOfTracks.length ; i++){
            if(self.listOfTracks[i].id == id){
                track = self.listOfTracks[i];
            }
        }
        return track;  
    };
    
    
};