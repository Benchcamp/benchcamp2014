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
        
        
        
        self.pin = document.createElement('span');        
        self.pin.classList.add("buttonProgress");
        
        self.curent = document.createElement('div');
        self.curent.style.float = "left";
        
        self.end = document.createElement('div');
        self.end.style.float = "right";
                
        self.pin.style.position="absolute";
        
        
        self.place.appendChild(self.curent); 
        self.place.appendChild(self.pin); 
        self.place.appendChild(self.end);        
        
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
        
        var currentDate = getTimeFromMilisecond(data.current);                        
        var maxDate =  getTimeFromMilisecond(data.max);
        
        var leftPosition = self.curent.offsetLeft - self.curent.scrollLeft + self.curent.offsetWidth + self.pin.offsetWidth;
        var rightPosition = self.end.offsetLeft - self.end.scrollLeft + self.pin.offsetWidth;
        
        var distance = rightPosition - leftPosition;        
        var newPosition = (percent * distance) / 100;        
        newPosition += leftPosition;
        
        
        self.pin.style.left = newPosition;        
        //self.pin.innerText = percent + " %";        
        
        self.curent.innerText = currentDate;
        self.end.innerText = maxDate;
    };
}