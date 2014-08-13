document.addEventListener("DOMContentLoaded", function() {
    
    var counterEvents = new CounterOfEvents();
    var refreshView = new RefreshView(counterEvents);
    refreshView.init();
    var logicPlayer = new LogicPlayer(counterEvents, refreshView);
    var loadPlayer = new LoadPlayer();
    var loadInfo = new LoadInfo();
    
    document.getElementById("showEvents").addEventListener('click', counterEvents.showEvents, false);

    document.getElementById("back").addEventListener('click', logicPlayer.back, false);
    document.getElementById("play").addEventListener('click', logicPlayer.playStop, false);
    document.getElementById("next").addEventListener('click', logicPlayer.next, false);

    document.getElementById("repeat").addEventListener('click', logicPlayer.repeat, false);
    document.getElementById("loop").addEventListener('click', logicPlayer.loop, false);
    
    
    loadPlayer.firstloadInfo(loadInfo);
    loadPlayer.loadSound();
    
    document.getElementById("showSongs").addEventListener('click', refreshView.loadSongs, false);
    document.getElementById("showAlbums").addEventListener('click', refreshView.loadAlbums, false);
    document.getElementById("showArtists").addEventListener('click', refreshView.loadArtists, false);
    
    /*loadInfo.artists();
    loadInfo.albums();*/
});
