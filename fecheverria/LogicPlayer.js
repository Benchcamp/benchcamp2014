
var listOfSongs = [];
var musicPath = "";
var numSong = 0;
var onPlay = false;
var instance;
var dragOffset;


function loadSongs(){

    musicPath = "music/";
    listOfSongs = [
            {id:"song1", src:"Counting Stars - One Republic.mp3"},
            {id:"song2", src:"William ft Miley Cyrus Feeleng myself.mp3"},
            
    ];
}
   
function loadSound(){
        
            
    //if initializeDefaultPlugins returns false, we cannot play sound in this browser
    if (!createjs.Sound.initializeDefaultPlugins()) { 
        alert("the browser can't reproduce music !");    
    }else{
        
        createjs.Sound.alternateExtensions = ["mp3"];
        createjs.Sound.addEventListener("fileload", createjs.proxy(this.handleLoad, this));
        createjs.Sound.registerManifest(listOfSongs, musicPath);
    }
}

function handleLoad(event){
    console.log("Preloaded:", event.id, event.src);
    
    var tbodySongs = document.getElementById("listOfMusic");
    var rowSong = document.createElement("tr");
    numSong++;
    rowSong.id = "song" + numSong;
    rowSong.onclick = function() { selectedSong(rowSong.id);};
    var name = (event.src.split("/"))[1];
    rowSong.innerHTML = "<td>" + name + "</td>" + "<td></td><td></td><td></td>";
    
    tbodySongs.appendChild(rowSong);
}

function selectedSong(id){
    var selectedSong = document.getElementById(id);
    selectedSong.className = "songSelected";
}
        
function playStop(event){
    
    countEvents();
    var selectedSong = document.querySelector(".songSelected");
    createjs.Sound.play(selectedSong.id);
    document.getElementById("play").value = "Stop";
    
}


function back(){
    countEvents();
}

function next(){
    countEvents();
}

function repeat(){
    countEvents();
}

function loop(){
    countEvents();
}

function sortBy(){
    
}



