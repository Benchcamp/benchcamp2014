
function SliderAnimation(place){
    var self = this;    
    self.place = place;    
    self.place.innerHTML = "";      
    self.interval = null;
    self.callback = null;
    self.pin;
    self.curent;
    self.end;
	
	
    self.start = function (callback) {
        self.stop();
        self.callback = callback;
        self.interval = window.setInterval(self._refresh, 100);
        
        self.pin = document.createElement('div');
        
        
        self.curent = document.createElement('div');
        self.curent.style.float = "left";
        self.end = document.createElement('div');
        self.end.style.float = "right";
        
        self.pin.innerText = "0";
        self.pin.style.position="absolute";
        self.pin.style.left = 0;
        
        self.place.appendChild(self.curent); 
        self.place.appendChild(self.pin); 
        self.place.appendChild(self.end);        
        
    };
    
    self.stop = function () {
        if(self.interval != null){
            window.clearInterval(self.interval);
            self.callback = null;
            self.place.innerText = "";
            self.interval = null;
        }
    };
    
    self._refresh = function () {		
        var data = self.callback()
        var percent = Math.round((data.current * 100) /data.max);        
        
        var currentDate = getTimeFromMilisecond(data.current);                        
        var maxDate =  getTimeFromMilisecond(data.max);
        
        self.pin.style.left = percent;
        
        self.place.innerText = currentDate + "  " + percent + "% " + maxDate;
    };
}


function JSPlayer(config) {
    var self = this;
    self.playerInstance = null;
    self.log = new Eventlog();
	self.library = new SongLibrary();
    self.selectedRow = null;
    self.table = null;
    self.currentSong = null;
    
    
	self.playButton = config.playButton;
	self.songFilterButton = config.songFilterButton;
	self.albumFilterButton = config.albumFilterButton;
	self.artistFilterButton = config.artistFilterButton;
    self.contentPlace = config.contentPlace;
    self.nowPlayPlace = config.nowPlayPlace;
    self.progressBarPlace = config.progressBarPlace;
    self.slider = new SliderAnimation(self.progressBarPlace);        

	self.init = function () {
	    if (!createjs.Sound.initializeDefaultPlugins()) {
            alert("Error trying initialize sound plugin");
            return;
	    }

	    self.registerEvents();
	};

	self.registerEvents = function () {
		self.playButton.onclick = self.onPlayerPlayStop;
		self.songFilterButton.onclick = self.onSongFilter;
		self.albumFilterButton.onclick = self.onAlbumFilter;
		self.artistFilterButton.onclick = self.onArtistFilter;
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
        self.selectRow(this);
    };
    
    self.selectRow = function (row) {
        if(self.selectedRow != null)
            self.selectedRow.classList.remove("sel")
        
        self.selectedRow = row;
        row.classList.add("sel");        
    };    

	self.onPlayerPlayStop = function () {		                  
		self.log.add("click", "play/stop");
        self.playStop();
	};
    
    self.display = function (data) {
        if(self.nowPlayPlace != null)
            self.nowPlayPlace.innerText = data;
    };
    
    
    self.play = function () {
        if(self.selectedRow == null) return;
            
        self.playButton.innerText = "Stop";        
        
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
         self.slider.start(function(){ 
                                        return {current: self.playerInstance.getPosition(), max: self.playerInstance.getDuration()}
                           });
	};
    
    self.stop = function () {
        createjs.Sound.stop();
        self.playButton.innerText = "Play";
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
        self.log.add("click", "next");
        self.slide(1);
    };
    
    self.previous = function () {
        self.log.add("click", "previous");
        self.slide(-1);
    };
    
    
    self.onSongFilter();
}
