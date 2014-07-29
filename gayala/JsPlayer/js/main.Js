function init() {
	window.onload = function () {
		var player = new JSPlayer({
            playButton : document.getElementById("play"),
            songFilterButton :  document.getElementById("songFilter"),
            albumFilterButton : document.getElementById("albumFilter"),
            artistFilterButton :  document.getElementById("artistFilter"),
            contentPlace: document.querySelector("#content")
        });
		player.init();
	};
}

