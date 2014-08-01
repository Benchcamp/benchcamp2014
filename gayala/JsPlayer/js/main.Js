

function init() {
    var self = this;
    self.player = null;

    
    self.onChangeState = function (newState) {
        switch(newState){
                case "Stopped":
                    document.getElementById("play").innerText = "Play";
                break;
                case "Playing":
                    document.getElementById("play").innerText = "Stop";
                break;
        };
    }; 
    
    self.selectRowCallback = function (sender){
            logger.add("click", "Selected Row");
    };
    
    
    self.onChangeConfig = function(sender){
        
        var confDisplay = document.querySelector(".display .config");
        confDisplay.innerText = "";
        
        
        if(sender.loop())
            confDisplay.innerText += " L ";
                
        if(sender.random())
            confDisplay.innerText += " R ";
        
    };
    
	window.onload = function () {
        
        // add logger and popup in document
        logger = new Eventlog(document.querySelector("#eventCounter")); 
        popupEvents = new Popup(document.querySelector("#popDiv"));
        
		self.player = new JSPlayer({            
            contentPlace: document.querySelector("#content"),
            nowPlayPlace: document.querySelector("#nowPlay"),
            progressBarPlace: document.querySelector("#progressBar"),
            selectRowCallback: self.selectRowCallback,
            changeStateCallback: self.onChangeState,
            changeConfigCallback: self.onChangeConfig
        });           

        document.getElementById("eventsButton").onclick = function(){
            //logger.add("click", "Events Button");
            
            var events = logger.getEvents();            
            var table = createTable(events, ["action", "element", "time"], null);
            
            popupEvents.show(table);            
        };
        
        document.getElementById("play").onclick = function(){
            logger.add("click", "Play Button");
            player.onPlayerPlayStop();
        };
        
        function select(obj){        
            var arrayLi = obj.parentNode.querySelectorAll("li")
            
            for(var i=0; i< arrayLi.length; i++)
                 arrayLi[i].classList.remove("sel");
            
            obj.classList.add("sel");
        }
        
        document.getElementById("songFilter").onclick = function(){
            select(this);            
            logger.add("click", "Song Filter Button");
            player.onSongFilter();
        };
        
        document.getElementById("albumFilter").onclick = function () { 
            select(this);
            logger.add("click", "Album Filter Button");
            player.onAlbumFilter();
        };
        
        document.getElementById("artistFilter").onclick = function () { 
            select(this);
            logger.add("click", "Artist Filter Button");
            player.onArtistFilter();
        };        
        
        document.getElementById("prev").onclick = function(){ 
            logger.add("click", "Previous Button");
            player.previous();
            
            if(player.isPlaying())
                player.play();
        };
        
        document.getElementById("next").onclick = function(){ 
            logger.add("click", "Next Button");
            player.next();
            
            if(player.isPlaying())
                player.play();              
        };
        
        document.getElementById("LButton").onclick = function(){ 
            player.loop(!player.loop());
        };
        
        document.getElementById("RButton").onclick = function(){ 
            player.random(!player.random());
        };
        
        
                
        document.body.onkeydown = function (e) {
            switch(e.keyCode){
                    case 40: 
                        player.next();
                        logger.add("KeyDown", "Down Arrow");
                    break;
                    case 38: 
                        player.previous();
                        logger.add("KeyDown", "Up Arrow");
                    break;
                    case 13: 
                        player.play();
                        logger.add("KeyDown", "Enter");
                    break;
                    case 27:                    
                        popupEvents.hide();
                    break;

            }            
        }
        
		player.init();
        
        document.getElementById("songFilter").onclick();
	};
}

