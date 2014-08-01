var listOfevents = [];
var count = 0;

function countEvents(){
    if(window.event != null){
        var moment = new Date(window.event.timeStamp);
        var newEvent = {
            hour: moment.getHours() + ":" + moment.getMinutes(),
            type: window.event.type,
            element: window.event.currentTarget.defaultValue
        }

        listOfevents.push(newEvent);
        document.getElementById("cantOfEvents").innerHTML = listOfevents.length;
    }
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