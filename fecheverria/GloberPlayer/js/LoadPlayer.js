var LoadPlayer = function () {
    'use strict';
    
    var self = this;
    
    self.listOfSongs = [];
    self.listOfTracks = [];
    self.musicPath = "";


    self.loadSongs = function () {
        
        var loadInfo = new LoadInfo();
        loadInfo.artists();
        loadInfo.albums();
        
        var listSongs = loadInfo.songs();
        
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
        
        var name = "";
        var tbodySongs = document.getElementById("listOfMusic");
        var rowSong = document.createElement("tr");
        var track = self.dataTrack(event.id);
        
        rowSong.id = track.id;
        rowSong.onclick = function () { self.selectedSong(rowSong.id); };
        //name = (event.src.split("/"))[1];
        rowSong.innerHTML = "<td>" + track.song + "</td>" + "<td>"+ track.artist +
                            "</td><td>"+ "00:00" + "</td><td>"+ track.album + "</td>";

        tbodySongs.appendChild(rowSong);
        
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
    
    
    self.selectedSong = function (id) {
        //Clean
        var unselectSong = document.querySelector(".songSelected");
        if(unselectSong != null){
            unselectSong.className = "";
        }
        //Mark
        var selectedSong = document.getElementById(id);
        selectedSong.className = "songSelected";
    };
};