var RefreshView = function (counterEvents) {

    var self = this;
    
    self.init = function () {
        self.selectedItem( "itemTypes", "showSongs");
        self.switchItems("Songs");   
    };
    
    self.loadAlbums = function () {
        counterEvents.countEvents();
        self.selectedItem( "itemTypes", "showAlbums");
        self.switchItems("Albums");
    };
    
    self.loadArtists = function () {
        counterEvents.countEvents();
        self.selectedItem( "itemTypes", "showArtists");
        self.switchItems("Artists");
    };
    
    self.loadSongs = function () {
        counterEvents.countEvents();
        self.selectedItem( "itemTypes", "showSongs");
        self.switchItems("Songs");
    };
    
    
    self.selectedItem = function (father, id){
        //Clean
        var unselectItem = document.querySelector("#" + father + " .selectedItem");
        if(unselectItem != null){
            unselectItem.className = "";
        }
        //Mark
        var selectedSong = document.getElementById(id);
        selectedSong.className = "selectedItem";
    
    }
    
    self.showSong = function (track) {
        
        var tbodySongs = document.getElementById("listOfMusic");
        var rowSong = document.createElement("tr");
        
        rowSong.id = track.id;
        rowSong.onclick = function () { self.selectedSong(rowSong.id); };
        //TODO mejorar esto
        rowSong.innerHTML = "<td>" + track.song + "</td>" + "<td>"+ track.artist +
                            "</td><td>"+ "00:00" + "</td><td>"+ track.album + "</td>";

        tbodySongs.appendChild(rowSong);
    }
    
    self.selectedSong = function (id) {
        self.selectedItem( "listOfMusic", id);
    };
    
    self.switchItems = function(active) {
        
        document.getElementById("boxSongs").style.display = "none";
        document.getElementById("boxAlbums").style.display = "none";
        document.getElementById("boxArtists").style.display = "none";
        
        var itemsContainer = document.getElementById("box" + active);
        itemsContainer.style.display = "inline";
        
    };
    
    self.playStop = function(onPlay){
        if(onPlay){
            document.getElementById("play").className = "icon-stop";
        }else{
            document.getElementById("play").className = "icon-play";    
        }
    }
}