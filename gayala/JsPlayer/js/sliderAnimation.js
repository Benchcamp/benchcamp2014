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
        
        
        var tableRow = document.createElement('div');
        self.place.appendChild(tableRow);        
        
        var content = document.createElement('div');
        
        var bar = document.createElement('div');        
        bar.classList.add("bar");
        
        self.pin = document.createElement('span');
        self.pin.classList.add("buttonProgress");
        
        bar.appendChild(self.pin);        
        content.appendChild(bar);
        
        
        self.curent = document.createElement('span');
        self.curent.classList.add("time");
        
        
        self.end = document.createElement('span');
        self.end.classList.add("time");
                          
        
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
              
        
        if(percent > 50)
            self.pin.style.marginLeft = "calc(" + percent + "% - 10px)";
        else
            self.pin.style.marginLeft =  percent + "%";
        
        self.curent.innerText = currentTime;
        self.end.innerText = maxTime;
    };
}