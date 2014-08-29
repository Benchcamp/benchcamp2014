'use strict';

/*
Services Utils (mouse, maths, etc.)
*/


//Utilities Service
services.factory("Utilities", function () {


    // Use a mouse event to return x and y coords.
    var _getCrossBrowserElementCoords = function (mouseEvent)
    {
      var result = {
        x: 0,
        y: 0
      };

      if (!mouseEvent)
      {
        mouseEvent = window.event;
      }

     if (mouseEvent.clientX || mouseEvent.clientY)
      {
        result.x = mouseEvent.clientX + document.body.scrollLeft +
          document.documentElement.scrollLeft;
        result.y = mouseEvent.clientY + document.body.scrollTop +
          document.documentElement.scrollTop;
      }

      if (mouseEvent.target)
      {
        var offEl = mouseEvent.target;
        var offX = 0;
        var offY = 0;

        if (typeof(offEl.offsetParent) != "undefined")
        {
          while (offEl)
          {
            offX += offEl.offsetLeft;
            offY += offEl.offsetTop;
            offEl = offEl.offsetParent;
          }
        }
        else
        {
          offX = offEl.x;
          offY = offEl.y;
        }

        result.x -= offX;
        result.y -= offY;
      }

      return result;
    };

    //returns the coordinates of a given mouse event
    var _getMouseEventResult = function (mouseEvent, mouseEventDesc)
    {

      var coords = _getCrossBrowserElementCoords(mouseEvent);
      return coords;
    };

	return {
		getMouseEventResult: _getMouseEventResult, //returns coords in a mouse event
	 	getCrossBrowserElementCoords : _getCrossBrowserElementCoords //gets coords in various browsers
	}
});



