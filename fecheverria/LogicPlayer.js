var listOfevents = [];
var count = 0;
var onPlay = false;

createjs.Sound.alternateExtensions = ["mp3"];
createjs.Sound.addEventListener("fileload", createjs.proxy(this.loadHandler, this));

function loadSongs(){
   
}


function countEvents(){

    var moment = new Date(window.event.timeStamp);
    var newEvent = {
        hour: moment.getHours() + ":" + moment.getMinutes(),
        type: window.event.type,
        element: window.event.currentTarget.defaultValue
    }
    
    listOfevents.push(newEvent);
    document.getElementById("cantOfEvents").innerHTML = listOfevents.length;
}

function showEvents(){
    loadEvents();
    document.getElementById("historicalEvents").style.display = "inline-block";
    
}

function loadEvents(){
    
    var tableListEvents = document.getElementById("listOfEvents");
    tableListEvents.innerHTML = "";
    for(var i=0; i < listOfevents.length; i++){
        var historicalEvent = listOfevents[i];
        var tr = document.createElement("tr");
        
        tr.innerHTML = "<td>"+ historicalEvent.type +"</td>"+
                        "<td>"+ historicalEvent.element +"</td>"+
                        "<td>"+ historicalEvent.hour +"</td>"; 
        
        tableListEvents.appendChild(tr);
    }
}

function back(){
    countEvents();
}

function playStop(){
    countEvents();
    
    if(!onPlay){
        createjs.Sound.registerSound("Counting Stars - One Republic.mp3", "sound");
        loadHandler(window.event);
        onPlay = true;
    }
    else{
        onPlay = false;
        createjs.Sound.stop();
    }
}


function loadHandler(event) {
     // This is fired for each sound that is registered.
     var instance = createjs.Sound.play("sound");  // play using id.  Could also use full sourcepath or event.src.
     instance.addEventListener("complete", createjs.proxy(this.handleComplete, this));
     instance.volume = 0.5;
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