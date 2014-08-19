
//Utilities
var utilities = (function() {

    //hasclass, addclass and remove class taken from http://jaketrent.com/post/addremove-classes-raw-javascript/
    function _hasClass(ele, cls) {
        return ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
    }

    function _addClass(ele, cls) {
        if (!_hasClass(ele, cls)) ele.className += " " + cls;
    }

    function _removeClass(ele, cls) {
        if (_hasClass(ele, cls)) {
            var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
            ele.className = ele.className.replace(reg, ' ');
        }
    }
    /*
	maths
	*/
        
    //miliseconds to seconds
    function _msToSeconds(mscs) {
        return mscs / 1000;
    }

    //miliseconds to minutes
    function _msToMinutes(mscs) {
        return _msToSeconds(mscs) / 60;
    }

    //miliseconds to seconds without minutes (ie: 127 ret 7)
    function _msToSecondsWithoutMinutes(mscs) {
        return _msToSeconds(mscs) % 60;
    }

    //percent of a part in a total
    function _percent(part, total) {
        return part * 100.0 / total;
    }
    

    // Reveal
    return {
        hasClass: _hasClass,
        addClass: _addClass,
        removeClass: _removeClass,
        msToSeconds: _msToSeconds,
        msToMinutes: _msToMinutes,
        msToSecondsWithoutMinutes: _msToSecondsWithoutMinutes,
        percent: _percent
    };
})();
