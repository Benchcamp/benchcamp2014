function Popup(div){
    self = this;
    self.div = div;
    
    self.show = function (content) {
        
        var eventPlace =  self.div.querySelector("#eventPlace");
        eventPlace.innerHTML = "";
        eventPlace.appendChild(content);  
        
        self.div.querySelector("#popupCloseButton").onclick = self.hide;
        self.div.querySelector(".ontop").onclick = self.hide;
        
        self.div.style.display = 'block';                
    }
    
    self.hide = function () {        
        self.div.style.display = 'none';
    }
};