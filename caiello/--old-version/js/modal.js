// Modal module
var modal = (function() {
    var _actualmod;
    // adds a event to the log

    //puts a modal to a given id
    function _modalThis(idtomod) {
        _actualmod = idtomod;
        elem = document.getElementById(idtomod);
        elem.style.visibility = (elem.style.visibility == "visible") ? "hidden" : "visible";
    }

    //unmodal if something is modaled
    function _unmodal() {
            _modalThis(_actualmod);
        }
        // Reveal
    return {
        modalThis: _modalThis,
        unmodal: _unmodal
    };
})();
