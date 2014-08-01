function fetchJSONFile(path, callback) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState === 4) {
            if (httpRequest.status === 200) {
                var data = httpRequest.responseText;
                if (callback) callback(data);
            }
        }
    };
    httpRequest.open('GET', path);
    httpRequest.send(); 
}

function getTimeFromMilisecond(miliseconds){    
    var date = new Date(0, 0, 0, 0, 0, 0, miliseconds);    
    return ("0" + date.getMinutes()).slice (-2) + ":" + ("0" +  date.getSeconds()).slice (-2);
};

function createTable(data,columns, rowCallback){
    var table = document.createElement('table');
    
    // add headers
    var tr = document.createElement('tr');
    table.appendChild(tr);
    for (var i = 0; i < columns.length; i++) {
        var th = document.createElement('th');
        th.appendChild(document.createTextNode(columns[i]));
        tr.appendChild(th);        
    }
    
    // add data    
    for (var i = 0; i < data.length; i++) {   
        var row = data[i];
        var tr = document.createElement('tr');
        tr.onclick = rowCallback;
        tr.data = data[i];
        tr.rowId = i;
                
        table.appendChild(tr);
        for (var j = 0; j < columns.length; j++) {
            var td = document.createElement('td');
            td.appendChild(document.createTextNode(data[i][columns[j]]));
            tr.appendChild(td);
        }
    }
    
    return table;
}


function Eventlog(eventCounter) {
    var self = this;
    self.events = [];
    
    self.getEvents = function () {
        return self.events;
    };
    
    self.add = function (action, element) {
		var now = (new Date()).toLocaleString();
		self.events.push({action: action, element: element, time: now}); // use self by Closure
        
        if(eventCounter != null)
            eventCounter.innerText = self.events.length;
        
	};    
    
}