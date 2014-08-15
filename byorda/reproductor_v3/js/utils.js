var Utils = (function () {

    // *** FORMATTING *** //

    function _twoDigits(number) {
        return number > 9 ? number : "0" + number;
    }

    function _msToSeconds(millis) {
        return Math.floor(millis / 1000);
    }

    function _msToMinutes(millis) {
        return Math.floor(_msToSeconds(millis) / 60);
    }

    function _remainingSeconds(millis) {
        return _msToSeconds(millis) % 60
    }

    function _formatPlayingTime(millis) {
        return _twoDigits(_msToMinutes(millis)) + ":" + _twoDigits(_remainingSeconds(millis));
    }

    // *** JSON *** //

    function _callbackJson(path, callback) {
        var httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = function () {
            if (httpRequest.readyState === 4) { //DONE
                if (httpRequest.status === 200) { //SUCCESS
                    callback(JSON.parse(httpRequest.responseText));
                }
            }
        };
        httpRequest.open('GET', path);
        httpRequest.send();
    }

    return {
        formatPlayingTime : _formatPlayingTime,
        callbackJson : _callbackJson
    };
})();