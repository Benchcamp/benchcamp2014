'use strict';

/*
Drag Services
*/


//Drag Service
services.factory("DragService", function ( Utilities, $rootScope)  {

    var _mdown = false;
    var _dragging = false;
    var _initialcoords;
    var _draggedThing;

    //when a mouse is down I save the thing to drag
    function _mouseDown($event, thingtodrag){
      _mdown = true;
      _initialcoords = Utilities.getMouseEventResult($event, "Mouse move");
      _draggedThing=thingtodrag;
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

    //detects if a mouse is up, then destroy the thing in 1/10 seconds..
    function _mouseUp() {
        _mdown = false;
        _dragging=false;
        //the dragged thing will be autodestroyed in 1/10 seconds...
        setTimeout(function() {_draggedThing=null;}, 100);
    }
    
    //if a mouse is up on the dropzone, and is something dragging, then i return the dragged thing
    function _droppedSomething(){
        return _draggedThing;
    }


    // handle what to do with a dropped thing in a dropzone with a message of broadcast
    function _handleDroppedThing(handletype, droppedthing){
        $rootScope.$broadcast(handletype, droppedthing);
    };
    


    return {
        mouseDown: _mouseDown, // handle what happens when mouse is down
        mouseMove : _mouseMove, //handle what happens when mouse is moving
        mouseUp : _mouseUp, //handle what happens when mouse is up
        draggedThing: _draggedThing, //the thing being dragged
        droppedSomething : _droppedSomething, //return the dropped thing
        handleDroppedThing:_handleDroppedThing // handle what to do with a dropped thing in a dropzone with a broadcast
    }



})




