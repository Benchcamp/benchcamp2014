function JSPlayer(config) {
    var self = this;
    self.playerInstance = null;
    self.log = new Eventlog();
	self.library = new SongLibrary();
    self.selectedRow = null;
    self.table = null;
    
    
	self.playButton = config.playButton;
	self.songFilterButton = config.songFilterButton;
	self.albumFilterButton = config.albumFilterButton;
	self.artistFilterButton = config.artistFilterButton;
    self.contentPlace = config.contentPlace;

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
		self.library.getSongs(function (data) {
            self.table = createTable(data,["artist", "album", "time", "track"], self.onSelectedRow);
            self.contentPlace.innerHTML = "";
            self.contentPlace.appendChild(self.table);
        }); 
	};

	self.onAlbumFilter = function () {
        self.library.getAlbum(function (data) {
            self.table = createTable(data,["artist", "album"], null);
            self.contentPlace.innerHTML = "";
            self.contentPlace.appendChild(self.table);
        });
	};

	self.onArtistFilter = function () {
        self.library.getArtists(function (data) {
            self.table = createTable(data,["artist", "album"], null);
            self.contentPlace.innerHTML = "";
            self.contentPlace.appendChild(self.table);
        });
	};
    
    self.onSelectedRow = function () {        
        self.selectedRow = this;

        for(var i=0; i< self.table.children.length; i++)
            self.table.children[i].classList.remove("sel");
        
        self.selectedRow.classList.add("sel");
    };


	self.onPlayerPlayStop = function () {		          
		self.log.add("click", "play/stop");
	
		if (self.playButton.innerText === "Play") {
            var song = self.selectedRow.data;
			self.playButton.innerText = "Stop";
			createjs.Sound.addEventListener("fileload", self.loadHandler);
			createjs.Sound.registerSound(song.url, "sound");
		} else {
			createjs.Sound.stop();
			createjs.Sound.removeAllSounds();
			self.playButton.innerText = "Play";
		}
	};

	self.loadHandler = function () {
	     self.playerInstance = createjs.Sound.play("sound");
	     self.playerInstance.addEventListener("complete", self.onPlayerComplete);
	};

	self.onPlayerComplete = function () {
		self.playButton.innerText = "Stop";
	};
}
