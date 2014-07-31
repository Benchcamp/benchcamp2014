
var eventSum = 0;
var showEvents = false;
var eventDetail = {};
var eventList = [];
var artist =  [
        {Artista:"La renga"},
        {Artista:"Los piojos"},
        {Artista:"Metallica"},
        {Artista:"Oasis"},
        {Artista:"Hermetica"},
        {id:"Enanitos verdes"},
        {Artista:"ACDC"},
        {Artista:"Mecano"},
        {Artista:"Marea"},
        {Artista:"NTVG"},
        {Artista:"Las pastillas del abuelo"},
        {Artista:"Los redonditos de ricota"},
        {Artista:"Cosplay"},
        {Artista:"U2"}
    ];
var album =[
        {Artista:"La renga", Album:"Bailando en una pata"},
        {Artista:"La renga", Album:"Insoportablemente vivo"},
        {Artista:"Metallica", Album:"One"},
        {Artista:"La vela puerca", Album:"Normalemnte anormal"}
    ];
var songs =  [
        {Pista: "Bicho de ciudad", Artista:"Los pijos", Duracion:"5.20", Album:"Folers"},
        {Pista: "El juicio del ganzo", Artista:"La renga",Duracion:"4.10", Album:"Bailando en una pata"},
        {Pista: "Nothing else matters", Artista:"Metallica", Duracion:"5.40", Album:"Black album"},
        {Pista: "One", Artista:"Metallica", Duracion:"7.00 ", Album:"Black album"},
        {Pista: "gil trabajador", Artista:"Hermetica", Duracion:"4.10", Album:"Acido argentino"},
        {Pista: "Mariposas", Artista:"Enanitos verdes", Duracion:"4.50", Album:"xxx"}
    ];

var data =  [
        {Pista: "Bicho de ciudad", Artista:"Los piojos", Album:" XXX"},
        {Pista: "El juicio del ganzo", Artista:"La renga", Album:"Bailando en una pata"},
        {Pista: "Hijo de la luna", Artista:"Mecano", Album:"Lui"}
    ];




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
     var tbl = document.getElementById('tbl');
         var jsonHtmlTable = ConvertJsonToTable(data, 'tbl', null);
         tbl.innerHTML = jsonHtmlTable;
         var rows = tbl.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
         for (i = 0; i < rows.length; i++) {
            rows[i].onclick = function() {
                alert(this.rowIndex + 1);
            }
            rows[i].onmouseover = function(){
                 this.style.backgroundColor = '#f3f8aa';
             };
               rows[i].onmouseout = function() {
                 this.style.backgroundColor = 'transparent';
            };
    }
   // readTextFile("C:\src\Files\Artist.txt");
    document.getElementById("parent-list").addEventListener("click",function(e) {
	// e.target is the clicked element!
	// If it was a list item
	/*if(e.target && e.target.nodeName == "LI") {
		// List item found!  Output the ID!
		
		console.log("List item ",e.target.id.replace("post-")," was clicked!");

		var tbl = document.getElementById('tbl');
		 var jsonHtmlTable = ConvertJsonToTable(artist, 'tbl', null);
		 tbl.innerHTML = jsonHtmlTable;
	}*/
        
	});
    document.getElementById("artista").addEventListener("click",function(e) {
         var tbl = document.getElementById('tbl');
          readFile("ART");  
         var jsonHtmlTable = ConvertJsonToTable(artist, 'tbl', null);
         tbl.innerHTML = jsonHtmlTable;
    });
    document.getElementById("album").addEventListener("click",function(e) {
         var tbl = document.getElementById('tbl');
          readFile("ALB");  
         var jsonHtmlTable = ConvertJsonToTable(album, 'tbl', null);
         tbl.innerHTML = jsonHtmlTable;
    });
    document.getElementById("cancion").addEventListener("click",function(e) {
         var tbl = document.getElementById('tbl');
          readFile("SNG");  
         var jsonHtmlTable = ConvertJsonToTable(songs, 'tbl', null);
         tbl.innerHTML = jsonHtmlTable;
    });
      document.getElementById("muteBtn").addEventListener("click",function(e){
            var muted = !createjs.Sound.getMute();
            createjs.Sound.setMute(muted);
            //$("#muteAllSoundsBtn").attr("value", muted ? "Unmute All Sounds" : "Mute All Sounds");
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

