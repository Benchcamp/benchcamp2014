
var eventSum = 0;
var showEvents = false;
var eventDetail = {
	accio:"", 
	elemento:"", 
	hora:""
};

var eventList = [];
var artist = [
		{id:"Los piojos", genero:"Pop Rock"},
		{id:"Los pericos", genero:"Rock"}];




function clickHandler(event) {
    var eType = event.type;
    /* the following is for compatibility */
    /* Moz populates the target property of the event object */
    /* IE populates the srcElement property */
    var eTarget = event.target || event.srcElement;


  }
 
function handleLoad(event) {
    createjs.Sound.play(event.src);
}

 document.addEventListener("DOMContentLoaded", function(event) {
    console.log("DOM fully loaded and parsed");
   // readTextFile("C:\src\Files\Artist.txt");
    document.getElementById("parent-list").addEventListener("click",function(e) {
	// e.target is the clicked element!
	// If it was a list item
	if(e.target && e.target.nodeName == "LI") {
		// List item found!  Output the ID!
		
		console.log("List item ",e.target.id.replace("post-")," was clicked!");
		var tbl = document.getElementById('tbl');
		 var jsonHtmlTable = ConvertJsonToTable(artist, 'tbl', null);
		 tbl.innerHTML = jsonHtmlTable;
	}
	});
	var testElements = document.getElementsByClassName('bnt');
		var testDivs = Array.prototype.filter.call(testElements, function(testElement){
		
	});
	var buttons = document.getElementsByClassName('btn');
		for(var i =0; i < buttons.length; i++){
			buttons[i].addEventListener("click",function(e) {
			eventSum++;    
			var name = e.type;
			var text = e.currentTarget.id;
			var time = e.timeStamp; 
			var eventDetal = {accion:name, elemnto:text, hora:time};
			eventList.push(eventDetal);
		    console.log(eventSum);
		     document.getElementById('lbl').textContent = eventSum;		     
			});
		}	
  });


    function showEventDetail(event){        
        var tbl = document.getElementById('tbl');
        var jsonHtmlTable = ConvertJsonToTable(eventList, 'tbl', null);
        if(showEvents){
            tbl.innerHTML = "";
            showEvents = false;
        }else{
            tbl.innerHTML = jsonHtmlTable;
            showEvents = true;
        }	
    }

