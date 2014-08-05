document.addEventListener("DOMContentLoaded", function() {
    
    var logicPlayer1 = new logicPlayer();
    
    document.getElementById("showEvents").addEventListener('click', logicPlayer1.showEvents, false);

    document.getElementById("back").addEventListener('click', logicPlayer1.back, false);
    document.getElementById("play").addEventListener('click', logicPlayer1.playStop, false);
    document.getElementById("next").addEventListener('click', logicPlayer1.next, false);

    document.getElementById("repeat").addEventListener('click', logicPlayer1.repeat, false);
    document.getElementById("loop").addEventListener('click', logicPlayer1.loop, false);
                    
    var load = new loadPlayer();
    load.loadSongs();
    load.loadSound();

});
