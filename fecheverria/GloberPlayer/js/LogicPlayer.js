var LogicPlayer = function(counterEvents, refreshView){
    
    var self = this;
    self.selectedSong = { id: "", onPlay: false };

    self.playStop = function (event){

        counterEvents.countEvents();
        
        if(self.selectedSong.onPlay){
            
            createjs.Sound.stop(self.selectedSong.id);
            document.getElementById("play").value = "Play";
            self.selectedSong.id = "";
            self.selectedSong.onPlay = false;
            refreshView.playStop(false);
            
        } else {
            var selectedSong = document.querySelector("#listOfMusic").querySelector(".selectedItem");
            if(selectedSong != null){
                self.selectedSong.id = selectedSong.id;
                
                self.selectedSong.onPlay = true;

                createjs.Sound.play(self.selectedSong.id);
                refreshView.playStop(true);    
            }
                
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