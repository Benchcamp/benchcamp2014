var loadPlayer = function(){
    
    var self = this; 
    
    self.listOfSongs = [];
    self.musicPath = "";
    self.numSong = 0;

    self.loadSongs = function(){

        self.musicPath = "music/";
        self.listOfSongs = [
                {id:"song1", src:"Counting Stars - One Republic.mp3"},
                {id:"song2", src:"William ft Miley Cyrus Feeleng myself.mp3"}

        ];
    };

    self.loadSound = function(){
        
        if (!createjs.Sound.initializeDefaultPlugins()) { 
            alert("the browser can't reproduce music !");    
        }else{

            createjs.Sound.alternateExtensions = ["mp3"];
            createjs.Sound.addEventListener("fileload", createjs.proxy(this.handleLoad, this));
            createjs.Sound.registerManifest(self.listOfSongs, self.musicPath);
        }
    };

    self.handleLoad = function(event){
        console.log("Preloaded:", event.id, event.src);

        var tbodySongs = document.getElementById("listOfMusic");
        var rowSong = document.createElement("tr");
        self.numSong++;
        rowSong.id = "song" + self.numSong;
        rowSong.onclick = function() { self.selectedSong(rowSong.id);};
        var name = (event.src.split("/"))[1];
        rowSong.innerHTML = "<td>" + name + "</td>" + "<td></td><td></td><td></td>";

        tbodySongs.appendChild(rowSong);
    };
    
    self.selectedSong = function(id){
        var selectedSong = document.getElementById(id);
        selectedSong.className = "songSelected";
    }
}