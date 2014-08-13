var CounterOfEvents = function () {
    
    var self = this;
    
    self.listOfevents = [];
    self.count = 0;
    self.displayEvents = true;
    
    self.showEvents = function(){

        var historicalEvents = document.getElementById("historicalEvents");
        
        if(self.displayEvents){
            self.loadEvents();
            historicalEvents.style.display = "inline-block";
            historicalEvents.value = "Hide";
        } else {
            historicalEvents.style.display = "none";
            historicalEvents.value = "Events";
        }
        self.displayEvents = !self.displayEvents;
        

    };

    self.countEvents = function(){
        if(window.event != null){
            var moment = new Date(window.event.timeStamp);
            var newEvent = {
                hour: moment.getHours() + ":" + moment.getMinutes(),
                type: window.event.type,
                element: window.event.currentTarget.defaultValue
            }

            self.listOfevents.push(newEvent);
            //document.getElementById("cantOfEvents").innerHTML = self.listOfevents.length;
        }
    };

    self.loadEvents = function(){

        var tableListEvents = document.getElementById("listOfEvents");
        tableListEvents.innerHTML = "";
        for(var i=0; i < self.listOfevents.length; i++){
            var historicalEvent = self.listOfevents[i];
            var tr = document.createElement("tr");

            tr.innerHTML = "<td>"+ historicalEvent.type +"</td>"+
                            "<td>"+ historicalEvent.element +"</td>"+
                            "<td>"+ historicalEvent.hour +"</td>"; 

            tableListEvents.appendChild(tr);
        }
    };
};


