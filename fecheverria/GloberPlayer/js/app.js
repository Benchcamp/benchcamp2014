(function() {
    var app = angular.module('globerPlayer', []);

    app.controller('musicForTypes', function(){

        this.selectedType = 1;

        this.setType = function setType(newValue){
            this.selectedType = newValue;
        };

        this.isSet = function isSet(tabName){
            return this.selectedType === tabName;
        };


    });
    
    app.directive('tableOfTraks', function(){
        return {
            restrict: 'E',
            templateUrl: 'table-of-traks.html',
            controller: function(){
                
            },
            controllerAs: 'traks'
        };
        
    });
    
})();

/*  //var counterEvents = CounterOfEvents;
    //var refreshView = new RefreshView(counterEvents);
    //refreshView.init();
    

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
*/
