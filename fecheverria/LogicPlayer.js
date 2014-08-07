var logicPlayer = function(){
    
    var self = this;
    self.counterEvents = new counterOfEvents();

    self.playStop = function (event){

        self.counterEvents.countEvents();

        var selectedSong = document.querySelector(".songSelected");
        createjs.Sound.play(selectedSong.id);
        document.getElementById("play").value = "Stop";

    }

    self.back = function(){
        self.counterEvents.countEvents();
    }

    self.next = function(){
        self.counterEvents.countEvents();
    }

    self.repeat = function(){
        self.counterEvents.countEvents();
    }

    self.loop = function(){
        self.counterEvents.countEvents();
    }

    self.sortBy = function(){

    }

}

