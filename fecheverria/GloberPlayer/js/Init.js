document.addEventListener("DOMContentLoaded", function() {
    
    var counterEvents = CounterOfEvents;
    var refreshView = new RefreshView(counterEvents);
    refreshView.init();
    
    var logicPlayer = new LogicPlayer(counterEvents, refreshView);
    var loadPlayer = LoadPlayer;
    //loadPlayer(refreshView);
    var loadInfo = LoadInfo;
    
    loadPlayer.firstloadInfo(loadInfo);
    loadPlayer.loadSound();
    
    document.getElementById("showEvents").addEventListener('click', counterEvents.showEvents, false);

    document.getElementById("back").addEventListener('click', logicPlayer.back, false);
    document.getElementById("play").addEventListener('click', logicPlayer.playStop, false);
    document.getElementById("next").addEventListener('click', logicPlayer.next, false);

    document.getElementById("repeat").addEventListener('click', logicPlayer.repeat, false);
    document.getElementById("loop").addEventListener('click', logicPlayer.loop, false);
    
    document.getElementById("showSongs").addEventListener('click', refreshView.loadSongs, false);
    document.getElementById("showAlbums").addEventListener('click', refreshView.loadAlbums, false);
    document.getElementById("showArtists").addEventListener('click', refreshView.loadArtists, false);

});


//http://addyosmani.com/resources/essentialjsdesignpatterns/book/#mixinpatternjavascript
//http://www.adequatelygood.com/JavaScript-Module-Pattern-In-Depth.html

