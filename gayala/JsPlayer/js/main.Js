
function animation(){
    var self = this;
    
    self.tick = 0;
    
    self.loop = function () {
        window.requestAnimationFrame( self.loop );
        self.draw();
    }
    
    self.draw = function(){
                    
        
        self.tick = (self.tick + 1) % 1500;        

        if(self.tick % 5 == 0){
            var eqs =  document.querySelectorAll("#eq>*");        
            for(var i=0;  i<eqs.length ; i++){
                var eq = eqs[i];            
                var delta = (Math.floor(Math.random() * 3) -1);

                
                if(player.isPlaying()){
                    eq.pathSegList[1].y += delta;
                }else{
                    eq.pathSegList[1].y = -50;
                    
                    if(eq.pathSegList[1].y < -50)
                        eq.pathSegList[1].y += 5;
                    else if(eq.pathSegList[1].y > 0)
                        eq.pathSegList[1].y -= 5;
                }
                
            }
        }

        if(self.tick < 360){
            var logoPlayer = document.getElementById("logoPlayer");        
            logoPlayer.style.webkitTransform =  " rotateX(" + self.tick + "deg)";
            logoPlayer.style.webkitTransform += " rotateY(" + self.tick + "deg)";
        }
                
            
    }
    
    self.loop();
}



function init() {
    var self = window; // se crea globalmente el player
    self.player = null;
            
    self.onChangeState = function (newState) {
        switch(newState){
                case "Stopped":
                    document.getElementById("play").innerHTML = "&#xE602;"; // play
                break;
                case "Playing":
                    document.getElementById("play").innerHTML = "&#xE603;"; //stop
                break;
        };
    }; 
    
    self.selectRowCallback = function (sender){        
      logger.add("click", "Selected Row");
    };
    
	self.onRate = function(tr){		
		
		var table = document.createElement('table');		
		table.appendChild(tr.cloneNode(true));
		
		popupEvents.show(table);		
	}
	
	self.div = null;
	
    self.oncontextmenu = function (e){        
        
		if(self.div != null){self.close();}
		
		
		e.preventDefault();        		
        var td = e.toElement;
        var tr = td.parentNode;  
		var data = td.data;
        self.div = document.createElement('div');
		var contextMenu_play = document.createElement('div');
        var contextMenu_rate = document.createElement('div');
		
		contextMenu_play.onclick = function(){tr.click(); self.player.play(); self.close(); };
		contextMenu_rate.onclick = function(){self.onRate(tr); self.close(); };
					
        contextMenu_play.innerText = "Play";
        contextMenu_rate.innerText = "Rate";        		
		
		self.div.classList.add("contextMenu");		
		self.div.style.top = e.y - 15 + "px";
        self.div.style.left = e.x - 15 + "px";
		
        self.div.appendChild(contextMenu_play);
		self.div.appendChild(contextMenu_rate);
		
		self.div.onmouseout = function(e){
		   	if (div.contains(e.toElement))
			   return;						
			
			self.close();
		};
		        
		self.close = function (){
				self.div.parentNode.removeChild(self.div);
				self.div.style.display = "none";
				self.div=null;
		};
		
        document.body.appendChild(div);
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
        
        var anim = new animation();
        
		self.player = new JSPlayer({            
            contentPlace: document.querySelector("#content"),
            nowPlayPlace: document.querySelector("#nowPlayContent"),
            progressBarPlace: document.querySelector("#progressBar"),
            selectRowCallback: self.selectRowCallback,
            changeStateCallback: self.onChangeState,
            changeConfigCallback: self.onChangeConfig,
            oncontextmenu: self.oncontextmenu
        });           

        document.getElementById("eventsButton").onclick = function(){
            
            var events = logger.getEvents();            
            var table = createTable(events, ["action", "element", "time"], null);
            
            popupEvents.show(table);            
        };
                
        
        document.querySelector("#lateralPannelButton").onclick = function(){
            if(document.body.classList.contains("tablet-slideMenuCollapse")){
                document.body.classList.remove("tablet-slideMenuCollapse");                
            }else{            
                document.body.classList.add("tablet-slideMenuCollapse");
            }
            
        };
                
        document.querySelector("#toggleButton").onclick = function(){            
            player.onSongFilter();
            
            if(document.body.classList.contains("mobile-playlist")){
                document.body.classList.remove("mobile-playlist");                
            }else{            
                document.body.classList.add("mobile-playlist");
            }
            
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
            
            if(player.loop())
                document.getElementById("LButton").classList.add("sel");
            else
                document.getElementById("LButton").classList.remove("sel");
        };
        
        document.getElementById("RButton").onclick = function(){ 
            player.random(!player.random());
            
            if(player.random())
                document.getElementById("RButton").classList.add("sel");
            else
                document.getElementById("RButton").classList.remove("sel");
                        
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

