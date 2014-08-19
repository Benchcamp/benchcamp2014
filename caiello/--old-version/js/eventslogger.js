//Events Logger Module
var eventsLogger = (function(e) {
    var _eventlogcount = 0
    // adds a event to the log
    function _logEvent(e) {
            var actualtime = new Date(e.timeStamp);
            var timetolog = actualtime.getHours() + ":" + actualtime.getMinutes() + ":" + actualtime.getSeconds();
            var eventaction = e.type;
            var eventelement = e.target.innerText;
            if (eventelement == "")
                eventelement = e.target.className;
            _addToEventLog(eventaction, eventelement, timetolog);
        }
       
    // adds an item to the log
    function _addToEventLog(actionev, eventelement, eventtime) {
        document.getElementById("eventlogcount").innerHTML = ++_eventlogcount;
        var rowstr = "";
        if (_eventlogcount % 2 == 0) //have to use nth styles here
            rowstr += "<tr class=\"even\">";
        else
            rowstr += "<tr class=\"odd\">";
        rowstr += "<td>" + actionev + "</td>";
        rowstr += "<td>" + eventelement + "</td>";
        rowstr += "<td>" + eventtime + "</td>";
        rowstr += "</tr>"
        document.getElementById("eventlog").innerHTML += rowstr;
    };
    // Reveal
    return {
        logEvent: _logEvent
    };
})();
