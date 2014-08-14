var CounterOfEvents = ( function () {
    
    //Private vars
    var listOfevents = [];
    var count = 0;
    var displayEvents = true;
    
    var loadEvents = function(){

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
    };
    
    //Public vars
    return{
    
        showEvents: function(){
            var historicalEvents = document.getElementById("historicalEvents");
            var showEvents = document.getElementById("showEvents");

            if(displayEvents){
                loadEvents();
                historicalEvents.style.display = "inline-block";
                showEvents.value = "Hide";
            } else {
                historicalEvents.style.display = "none";
                showEvents.value = "Events";
            }
            displayEvents = !displayEvents;


        },

        countEvents: function(){
            if(window.event != null){
                var moment = new Date(window.event.timeStamp);
                var newEvent = {
                    hour: moment.getHours() + ":" + moment.getMinutes(),
                    type: window.event.type,
                    element: window.event.currentTarget.id
                }

                listOfevents.push(newEvent);
                document.getElementById("cantOfEvents").innerHTML = listOfevents.length;
            }
        }

    };
      
}) ();


