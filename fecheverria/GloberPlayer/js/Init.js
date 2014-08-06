document.addEventListener("DOMContentLoaded", function() {
    
    var counterEvents = new CounterOfEvents();
    var logicPlayer = new LogicPlayer(counterEvents);
    var loadPlayer = new LoadPlayer();
    
    document.getElementById("showEvents").addEventListener('click', counterEvents.showEvents, false);

    document.getElementById("back").addEventListener('click', logicPlayer.back, false);
    document.getElementById("play").addEventListener('click', logicPlayer.playStop, false);
    document.getElementById("next").addEventListener('click', logicPlayer.next, false);

    document.getElementById("repeat").addEventListener('click', logicPlayer.repeat, false);
    document.getElementById("loop").addEventListener('click', logicPlayer.loop, false);
                    
    
    loadPlayer.loadSongs();
    loadPlayer.loadSound();

});
