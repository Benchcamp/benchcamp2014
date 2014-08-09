function JSPlayer(config) {
    var _states = {playing: "Playing", stopped: "Stopped"};
    var self = this;
    self._currentState;
    self._loop = false;
    self._random = false;
    self.playerInstance = null;
	self.library = new SongLibrary();
    self.selectedRow = null;
    self.table = null;
    self.currentSong = null;
    self.currentDragggedRow = null;
    self.changeStateCallback = config.changeStateCallback;	
    self.changeConfigCallback = config.changeConfigCallback;	
    self.selectRowCallback = config.selectRowCallback;
    self.contentPlace = config.contentPlace;
    self.nowPlayPlace = config.nowPlayPlace;
    self.progressBarPlace = config.progressBarPlace;
    self.slider = new SliderAnimation(self.progressBarPlace);
    self.oncontextmenu = config.oncontextmenu;
     
    
    self.loop = function(value){
        if(arguments.length == 0)
            return self._loop;
        
        self._loop = value;
        self.notifyChangeConfig();
        return self;
    }
    
    self.random = function(value){        
        if(arguments.length == 0)
            return self._random;
        
        self._random = value;
        self.notifyChangeConfig();
        return self;
    }
    
    
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
            self.table = createTable(data,["artist", "track", "album", "time"], 
                                     {onSelectedRow: self.onSelectedRow, 
                                      onDragStart: self.onDragStart,
                                      onDragEnd: self.onDragEnd,
                                      oncontextmenu: self.oncontextmenu
                                     });
            
            if(self.isPlaying()){
                var allTR = self.table.querySelectorAll("tr");
                for(var i=0; i<allTR.length; i++){
                    var TR = allTR[i];
                    if(TR.data != null && TR.data.url == self.currentSong.url){
                         self.selectRow(TR);                        
                    }
                }
            }
            
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
    
    
    self.onDragStart = function (event) {        
        event.dataTransfer.effectAllowed = "move"; 
        self.currentDragggedRow = event.currentTarget;
    }
    
    self.onDragEnd = function (event) {
        self.currentDragggedRow = null;        
    }
    
    self.onDrop = function(event){
        if(self.currentDragggedRow != null){
            self.selectRow(self.currentDragggedRow);
            self.play();
        }        
    }
    
    
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
        if(self.nowPlayPlace != null){
            self.nowPlayPlace.innerText = data;
        }
    };
    
    self.notifyChangeState = function (newState){
        self._currentState = newState;
        
        if(self.changeStateCallback != null) 
            self.changeStateCallback(newState);
    };
    
    self.notifyChangeConfig = function (){
        if(self.changeConfigCallback != null) 
            self.changeConfigCallback(self);
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
        return self._currentState != null && self._currentState == _states.playing;
    };
    
    self.playStop = function () {        
        if (!self.isPlaying()) {
            self.play();
        }else{
            self.stop()
        }            
    };


	self.onPlayerComplete = function () {
        
        if(self._loop){
            self.next();
            self.play();
        }
        else
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
        if(self._random)
             self._nextRandom();
        else
            self.slide(1);    
        
    };
    
    self.previous = function () {
        if(self._random)
             self._nextRandom();
        else
            self.slide(-1);        
    };
    
    self._nextRandom = function () {        
        var length = self.table.rows.length;        
        var next = Math.floor(Math.random() * length) - 1;        
        
        if(next == 0) next++;// grant change sound
        
        self.slide(next);
    };
        
    
    self.nowPlayPlace.setAttribute("ondrop", "event.preventDefault()");
    self.nowPlayPlace.setAttribute("ondragover", "event.preventDefault()");    
    self.nowPlayPlace.addEventListener('drop', self.onDrop);    
    
    
    self.notifyChangeConfig();
}
