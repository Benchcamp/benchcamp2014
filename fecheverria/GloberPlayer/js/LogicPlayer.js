var LogicPlayer = function(counterEvents){
    
    var self = this;
    self.selectedSong = { id: "", onPlay: false };

    self.playStop = function (event){

        counterEvents.countEvents();
        
        if(self.selectedSong.onPlay){
            
            createjs.Sound.stop(self.selectedSong.id);
            document.getElementById("play").value = "Play";
            self.selectedSong.id = "";
            self.selectedSong.onPlay = false;
            
        } else {
            self.selectedSong.id = document.querySelector(".selectedItem").id;
            self.selectedSong.onPlay = true;
        
            createjs.Sound.play(self.selectedSong.id);
            document.getElementById("play").value = "Stop";    
        }

    };

    self.back = function(){
        counterEvents.countEvents();
    };

    self.next = function(){
        counterEvents.countEvents();
    };

    self.repeat = function(){
        counterEvents.countEvents();
    };

    self.loop = function(){
        counterEvents.countEvents();
    };

    self.sortBy = function(){

    };

};