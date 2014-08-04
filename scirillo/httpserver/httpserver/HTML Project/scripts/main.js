
var eventSum = 0;
var showEvents = false;
var eventDetail = {};
var eventList = [];

 
function handleLoad(event) {
    createjs.Sound.play(event.src);
}

 document.addEventListener("DOMContentLoaded", function(event) {
    console.log("DOM fully loaded and parsed");
    loadInitialData();
    document.getElementById("artista").addEventListener("click",function(e) {
         var tbl = document.getElementById('content');
         artist =  readFile("ART");  
    });
    document.getElementById("album").addEventListener("click",function(e) {
         var tbl = document.getElementById('content');
          readFile("ALB");  
    });
    document.getElementById("cancion").addEventListener("click",function(e) {
         var tbl = document.getElementById('content');
          readFile("SNG");  
    });
    document.getElementById("muteBtn").addEventListener("click",function(e){
        var muted = !createjs.Sound.getMute();
        createjs.Sound.setMute(muted);
    });

	var testElements = document.getElementsByClassName('bnt');
		var testDivs = Array.prototype.filter.call(testElements, function(testElement){
		
	});
    document.getElementById("")    

	var buttons = document.getElementsByClassName('btn');
		for(var i =0; i < buttons.length; i++){
			buttons[i].addEventListener("click",function(e) {
			eventSum++;    
			var name = e.type;
			var text = e.currentTarget.id;
      var date = new Date(e.timeStamp);
      date.toString("MMM dd"); 
		  var eventDetal = {accion:name, elemento:text, hora: date.toString("MMM dd")};
		  eventList.push(eventDetal);
	    console.log(eventSum);
	    document.getElementById('lbl').textContent = eventSum;		     
			});
		}	
  });


function loadInitialData(){
    var tbl = document.getElementById('content');
         var jsonHtmlTable = ConvertJsonToTable(manifest, 'content', null);
         tbl.innerHTML = jsonHtmlTable;
         var rows = tbl.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
         for (i = 0; i < rows.length; i++) {
            rows[i].onclick = function() {
                songIndex = this.rowIndex -1;
                playSong();
            };
            rows[i].onmouseover = function(){
                 this.style.backgroundColor = '#f3f8aa';
            };
            rows[i].onmouseout = function() {
                 this.style.backgroundColor = 'transparent';
            };
    }
}

function setCurrentRow(){
    var tbl = document.getElementById('content');
    var jsonHtmlTable = ConvertJsonToTable(manifest, 'content', null);
    tbl.innerHTML = jsonHtmlTable;
    var rows = tbl.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    rows[songIndex].style.backgroundColor = '#f3f8aa';         
}

function showEventDetail(event){        
    var tbl = document.getElementById('content');
    var jsonHtmlTable = ConvertJsonToTable(eventList, 'content', null);
    if(showEvents){
        loadInitialData();
        showEvents = false;
    }else{
        tbl.innerHTML = jsonHtmlTable;
        showEvents = true;
    }	
}

