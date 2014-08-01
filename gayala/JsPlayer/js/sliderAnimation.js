function SliderAnimation(place){
    var self = this;    
    self.place = place;    
    self.place.innerHTML = "";      
    self.interval = null;
    self.callback = null;
    self.pin;
    self.curent;
    self.end;
	

    self.start = function (callback) {
        self.stop();
        self.callback = callback;
        self.interval = window.setInterval(self._refresh, 100);
        

        
        var table = document.createElement('div');
        table.style.display = "table";
        table.style.width = "100%";
        self.place.appendChild(table);
        
        var tableRow = document.createElement('div');
        tableRow.style.display = "table-row";
        table.appendChild(tableRow);
        
        var content = document.createElement('div');
        content.style.display = "table-cell";      
        content.style.paddingRight = 5;
        content.style.paddingTop = "5%";
        content.style.paddingBottom = "5%";
        
        var bar = document.createElement('div');        
        bar.classList.add("bar");
        
        self.pin = document.createElement('span');
        self.pin.classList.add("buttonProgress");
        
        bar.appendChild(self.pin);        
        content.appendChild(bar);
        
        
        self.curent = document.createElement('div');
        self.curent.style.display = "table-cell";
        self.curent.style.width = 50;
        
        
        self.end = document.createElement('div');
        self.end.style.width = 50;
        self.end.style.display = "table-cell";     
        
                  
        
        tableRow.appendChild(self.curent); 
        tableRow.appendChild(content); 
        tableRow.appendChild(self.end);        
        
    };
    
    self.stop = function () {
        if(self.interval != null){
            window.clearInterval(self.interval);
            self.callback = null;
            self.place.innerText = "";
            self.interval = null;
        }
    };
    
    self._refresh = function () {		
        var data = self.callback()
        var percent = Math.round((data.current * 100) /data.max);        
        
        var currentTime = getTimeFromMilisecond(data.current);                        
        var maxTime =  getTimeFromMilisecond(data.max);
              
        
        self.pin.style.marginLeft = percent + "%";
        self.pin.style.marginRight ="10px";
        
        self.curent.innerText = currentTime;
        self.end.innerText = maxTime;
    };
}