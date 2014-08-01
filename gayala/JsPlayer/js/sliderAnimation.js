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
        self.curent.style.borderRight = "1px solid #0070A8";
        self.curent.style.textAlign = "right";
        
        self.end = document.createElement('div');
        self.end.style.float = "right";
        self.end.style.borderLeft = "1px solid #0070A8";
        self.end.style.textAlign = "left";
        
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
        
        var currentTime = getTimeFromMilisecond(data.current);                        
        var maxTime =  getTimeFromMilisecond(data.max);
        
        var leftPosition = self.curent.offsetLeft - self.curent.scrollLeft + self.curent.offsetWidth + self.pin.offsetWidth;
        var rightPosition = self.end.offsetLeft - self.end.scrollLeft + self.pin.offsetWidth;
        
        var distance = rightPosition - leftPosition;        
        var newPosition = (percent * distance) / 100;        
        newPosition += leftPosition;
        
        
        self.pin.style.left = newPosition;        
        //self.pin.innerText = percent + " %";        
        
        self.curent.innerText = currentTime;
        self.end.innerText = maxTime;
    };
}