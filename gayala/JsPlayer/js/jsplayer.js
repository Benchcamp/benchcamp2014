function JSPlayer(config) {
    var _states = {playing: "Playing", stopped: "Stopped"};
    var self = this;
    
    self.playerInstance = null;    
	self.library = new SongLibrary();
    self.selectedRow = null;
    self.table = null;
    self.currentSong = null;    
    self.changeStateCallback = config.changeStateCallback;	
    self.selectRowCallback = config.selectRowCallback;
    self.contentPlace = config.contentPlace;
    self.nowPlayPlace = config.nowPlayPlace;
    self.progressBarPlace = config.progressBarPlace;
    self.slider = new SliderAnimation(self.progressBarPlace);        

	self.init = function () {
	    if (!createjs.Sound.initializeDefaultPlugins()) {
            alert("Error trying initialize sound plugin");
            return;
	    }
	};


	// filter events
	self.onSongFilter = function () {
        self.table = null;
		self.library.getSongs(function (data) {
            self.table = createTable(data,["artist", "track", "album", "time"], self.onSelectedRow);
            self.contentPlace.innerHTML = "";
            self.contentPlace.appendChild(self.table);
        }); 
	};

	self.onAlbumFilter = function () {
        self.table = null;
        self.library.getAlbum(function (data) {
            self.table = createTable(data,["album", "artist"], null);
            self.contentPlace.innerHTML = "";
            self.contentPlace.appendChild(self.table);
        });
	};

	self.onArtistFilter = function () {
        self.table = null;
        self.library.getArtists(function (data) {
            self.table = createTable(data,["artist", "album"], null);
            self.contentPlace.innerHTML = "";
            self.contentPlace.appendChild(self.table);
        });
	};
    
    self.onSelectedRow = function () {
        if(self.selectRowCallback != null)
            self.selectRowCallback(this);
            
        self.selectRow(this);
    };
    
    self.selectRow = function (row) {
        if(self.selectedRow != null)
            self.selectedRow.classList.remove("sel")
        
        self.selectedRow = row;
        row.classList.add("sel");        
    };    

	self.onPlayerPlayStop = function () {
        self.playStop();
	};
    
    self.display = function (data) {
        if(self.nowPlayPlace != null)
            self.nowPlayPlace.innerText = data;
    };
    
    self.notifyChangeState = function (newState){
        if(self.changeStateCallback != null) 
            self.changeStateCallback(newState);
    };
    
    self.play = function () {
        if(self.selectedRow == null) return;
        
        if(self.isPlaying())
            self.stop();
                        
        
        if(self.currentSong == null || self.selectedRow.data.url != self.currentSong.url)
        {
            createjs.Sound.removeAllSounds();
            self.currentSong = self.selectedRow.data;            
            createjs.Sound.addEventListener("fileload", self.playHandler);
            createjs.Sound.registerSound(self.currentSong.url, "sound");
            self.display("Buffering");
        }else{
            self.playHandler();                
        }
    };
    
    self.playHandler = function () {
	    self.playerInstance = createjs.Sound.play("sound");
	    self.playerInstance.addEventListener("complete", self.onPlayerComplete);                
        self.display(self.currentSong.artist + " - " + self.currentSong.track);   
         
        self.notifyChangeState(_states.playing);        
        self.slider.start(function(){ 
                                        return {current: self.playerInstance.getPosition(), max: self.playerInstance.getDuration()}
                           });
	};
    
    self.stop = function () {
        createjs.Sound.stop();
        self.notifyChangeState(_states.stopped);
        self.display("");
        self.slider.stop();
    };
    
    self.isPlaying = function () {
        return self.playerInstance == null || self.playerInstance.playState != "playSucceeded";
    };
    
    self.playStop = function () {        
        if (self.isPlaying()) {
            self.play();
        }else{
            self.stop()
        }            
    };


	self.onPlayerComplete = function () {
        self.stop();
	};
    
    self.slide = function (positions) {        
        if(self.table != null){
            var length = self.table.rows.length;
            
            var index = positions;
            if(self.selectedRow != null)
                index = self.selectedRow.rowId + 1 + positions;
                                    
            if(index <= 0) 
                index = length - 1;
            else if(index >= length)
                index = 1;
            
            var row = self.table.rows[index];            
            self.selectRow(row);            
        }
    };
    
    self.next = function () {        
        self.slide(1);
    };
    
    self.previous = function () {
        self.slide(-1);
    };    
}
