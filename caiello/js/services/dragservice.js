'use strict';

/*
Drag Services
*/


//Drag Service
services.factory("DragService", function ( Utilities)  {

    var _mdown = false;
    var _dragging = false;
    var _initialcoords;

    function _mouseDown($event){
      _mdown = true;
      _initialcoords = Utilities.getMouseEventResult($event, "Mouse move");
    };
    
    function _mouseMove($event) {
        var res = Utilities.getMouseEventResult($event, "Mouse move");
        //i have to verify if initial coords are diferent to final coords, because ng-mousemove detects a mouse down like one movement and mouse up like another ...
        if ((_mdown)&&(res.x!=_initialcoords.x)&&(res.y!=_initialcoords.y)){
            return res;
        }else{
            return null;
        }
    }

    function _mouseUp() {
        _mdown = false;
        _dragging=false;
    }



    return {
        mouseDown: _mouseDown, // handle what happens when mouse is down
        mouseMove : _mouseMove, //handle what happens when mouse is moving
        mouseUp : _mouseUp //handle what happens when mouse is up
    }



})




