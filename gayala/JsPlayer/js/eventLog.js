
var Eventlog = function() {    
    var self = this;
    self._events = [];
    self._eventCounters = [];
    
    self._getEvents = function () {
        return self._events;
    };
    
    self._add = function (action, element) {
		var now = (new Date()).toLocaleString();
		self._events.push({action: action, element: element, time: now}); // use self by Closure
        
        for(var i=0; i< self._eventCounters.length; i++)
            self._eventCounters[i].innerText = self._events.length;        
	};
    
    
    
    self._addEventCounterListener = function (eventCounter){
        self._eventCounters.push(eventCounter);
    }
    
    self._removeEventCounterListener = function (eventCounter){
        Utility.removeFromArray(self._eventCounters,eventCounter);
    }
    
    return {
                add: _add,
                addEventCounterListener: _addEventCounterListener,
                removeEventCounterListener: _removeEventCounterListener,
                getEvents: _getEvents
            }
    
 }();