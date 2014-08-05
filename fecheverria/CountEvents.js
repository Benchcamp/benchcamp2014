var counterOfEvents = function () {
    
    var self = this;
    
    self.listOfevents = [];
    self.count = 0;

    self.showEvents = function(){
        self.loadEvents();
        document.getElementById("historicalEvents").style.display = "inline-block";

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
            document.getElementById("cantOfEvents").innerHTML = self.listOfevents.length;
        }
    };

    self.loadEvents = function(){

        var tableListEvents = document.getElementById("listOfEvents");
        tableListEvents.innerHTML = "";
        for(var i=0; i < listOfevents.length; i++){
            var historicalEvent = self.listOfevents[i];
            var tr = document.createElement("tr");

            tr.innerHTML = "<td>"+ historicalEvent.type +"</td>"+
                            "<td>"+ historicalEvent.element +"</td>"+
                            "<td>"+ historicalEvent.hour +"</td>"; 

            tableListEvents.appendChild(tr);
        }
    };
}


