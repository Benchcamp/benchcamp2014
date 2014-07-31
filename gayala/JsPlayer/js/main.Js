function init() {
	window.onload = function () {
		var player = new JSPlayer({
            playButton : document.getElementById("play"),
            songFilterButton :  document.getElementById("songFilter"),
            albumFilterButton : document.getElementById("albumFilter"),
            artistFilterButton :  document.getElementById("artistFilter"),
            contentPlace: document.querySelector("#content"),
            nowPlayPlace: document.querySelector("#nowPlay"),
            progressBarPlace: document.querySelector("#progressBar")
        });
            
        document.getElementById("prev").onclick = player.previous;
        document.getElementById("next").onclick = player.next;        
        
                
        document.body.onkeydown = function (e) {
            switch(e.keyCode){
                    case 40: player.next();break;
                    case 38: player.previous();break;
                    case 13: player.play();break;
            }
        }
		player.init();
	};
}

