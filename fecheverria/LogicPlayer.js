var listOfevents = [];
var count = 0;

function countEvents(){

    var moment = new Date(window.event.timeStamp);
    var newEvent = {
        hour: moment.getHours() + ":" + moment.getMinutes(),
        type: window.event.type,
        element: window.event.currentTarget.defaultValue
    }
    
    listOfevents.push(newEvent);
    
    //count += 1;
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

function play(){
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