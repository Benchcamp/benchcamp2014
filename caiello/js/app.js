/*
Global vars
*/
var instance;
var timing;
var eventlogcount=0;
var currentsong=1;
var totalsongs=0;
var repeat=false;
var random=false;
var registered=false;
var actualmod;
var playlist=[];
var currentlyplayingname="";
var draggedsong=0;

/*
Functions
*/

// adds a event to the log
function logEvent(e){
	var actualtime=new Date(e.timeStamp);
	var timetolog=actualtime.getHours()+":"+actualtime.getMinutes()+":"+actualtime.getSeconds();
	var eventaction=e.type;
	var eventelement=e.target.innerText;
	if (eventelement=="")
		eventelement=e.target.className;
	addToEventLog(eventaction,eventelement,timetolog);
	//console.log(e);
}

// adds an item to the log
function addToEventLog(actionev,eventelement,eventtime){
	document.getElementById("eventlogcount").innerHTML = ++eventlogcount;
 	var rowstr="";
	if (eventlogcount%2==0)
		rowstr+="<tr class=\"even\">";
	else
		rowstr+="<tr class=\"odd\">";
	rowstr+="<td>"+ actionev +"</td>";
	rowstr+="<td>"+ eventelement +"</td>";
	rowstr+="<td>"+ eventtime +"</td>";
	rowstr+="</tr>"
	document.getElementById("eventlog").innerHTML += rowstr;
};

// a song ends
function songEnds() {
	if (random)
		playSongHandler(Math.floor((Math.random() * totalsongs) + 1));
	else
		if (repeat){
			(currentsong+1 <= totalsongs) ? playSongHandler(++currentsong) : currentsong=1; playSongHandler(currentsong);
		}else{
			stopSong();
		}
};

// plays a song
function playSongHandler(songid) {
	currentsong=songid;
	document.getElementById("song-name").innerText=playlist[currentsong-1];
	if (!(instance && instance.resume())){ //resume pause
		if (instance) //stops current song
			stopSong(); 
		instance = createjs.Sound.play(songid); //plays selected
	}
    instance.addEventListener("complete", songEnds);
    //change btn from play to pause
    playbtn.style.display = "none";
    pausebtn.style.display="";
    timing = setInterval(update,3);//most fluid than 1000
    //have to move this...
    hideDragArea();
};



// pause the current song
function pauseSong() {
	instance.pause();
	clearInterval(timing);
	pausebtn.style.display="none";
	playbtn.style.display="";
};

// stop the song (another song selected)
function stopSong() {
	pauseSong();
	instance.setPosition(0);
};

//taken from http://www.kirupa.com/html5/getting_mouse_click_position.htm
function getPosition(element) {
	var xPosition = 0;
	var yPosition = 0;
	while (element) {
		xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
		yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
		element = element.offsetParent;
	}
	return { x: xPosition, y: yPosition };
};

// moves the player to a position given by an event
function moveToPosition(e){//gets the position from event
	if (instance){
		var parentpos = getPosition(e.currentTarget);
		var posx = e.clientX - parentpos.x;
		var pbwidth = document.getElementById("playing").clientWidth;
	    instance.setPosition( (posx/pbwidth) * instance.getDuration() );
	    update();
	}
};

// update all items (transcurred time, progressbar, circle)
function update(){
	var playedms = instance.getPosition();

	document.getElementById("transcurredtime").innerHTML=parseInt(msToMinutes(playedms))+":"+parseInt(msToSecondsWithoutMinutes(playedms));
	var percentplayed=percent(playedms,instance.getDuration());
	//document.getElementById("progressbar").innerHTML=percentplayed;
	document.getElementById("progressbar").style.width=percentplayed+"%";
};

// register a song
function registerSong(songid) {
	createjs.Sound.registerSound("assets/resources/songs/"+songid+".ogg",songid);
};

// mute the sound
function muteSound(){
	instance.setMute(!instance.getMute());
}

// filters the data "songs", "artists", "albums"
function filter(tofilterid){
	var path="assets/json/"+tofilterid+".json";
	var content=loadJSON(path,
         function(data) { console.log(data); },
         function(xhr) { console.error(xhr); },
         tofilterid);
	console.log("antes");
	return true;
}

// loads a json
// method taken from http://stackoverflow.com/questions/9838812/how-can-i-open-a-json-file-in-javascript-without-jquery
function loadJSON(path, success, error, filterid)
{
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function()
    {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                if (success)
                    displaySounds(JSON.parse(xhr.responseText),filterid);
            } else {
                if (error)
                    error(xhr);
            }
        }
    };
    xhr.open("GET", path, true);
    xhr.send();

}

//converts a json to tables of the reproductor
function displaySounds(content, filterid){/*in json*/
	//maybe a template here? remove the spaggetti code and sanitize
	//creating the header of the table
	var rowstr="<tr class=\"theader\">";
	switch(filterid) {
  		case "artists":
       		rowstr+="<th>Artista</th>";
       	break;
    	case "albums":
       		rowstr+="<th>Artista</th><th>Album</th>";
       	break;
    	default:
    		rowstr+="<th>Pista</th><th>Artista</th><th>Tiempo</th><th>Album</th>";
	}
	rowstr+="</tr>";
	var aresongs=(filterid=="songs");
	for (var i=0; i<content.structure.length; i++){
		//if songs are not registered then register the songs and set the flag to true
		if (aresongs && !registered)
			registerSong(content.structure[i].id);
		//creating the content of the table
		//used even and odd, in the future i have to use only css...
		if (i%2==0)
			rowstr+="<tr class=\"songp even\"";
		else
			rowstr+="<tr class=\"songp odd\"";

		//have to sanitize all this:
		//i have to change playsonghandler and maybe data- here :(
		rowstr+=(filterid=="songs") ? " data-name=\""+content.structure[i].songs+"\" data-id=\""+content.structure[i].id+"\" onclick=\"playSongHandler(" +content.structure[i].id+")\">" : ">";
		if (filterid=="songs") playlist.push(content.structure[i].songs);// adds the name of the song to the playlist... little ugly
		rowstr+= (filterid=="songs") ? "<td>"+ content.structure[i].songs+"</td>" : "";
		rowstr+="<td>"+ content.structure[i].artists+"</td>";
		rowstr+= (filterid=="songs") ? "<td>"+ content.structure[i].time +"</td>" : "";
		rowstr+= (filterid!="artists") ? "<td>"+ content.structure[i].albums+"</td>" : "";
		rowstr+="</tr>"
	}
	registered=true;
	if (aresongs) totalsongs = content.structure.length;
	
	document.getElementById("content").innerHTML = rowstr;
};

//hide or show a element
function showHideElement(element){
	if (document.getElementById(element).style.display == "none")
		document.getElementById(element).style.display = "";
	else 
		document.getElementById(element).style.display = "none";
}




//puts a modal to a given id
function modalThis(idtomod) {
	actualmod=idtomod;
	elem = document.getElementById(idtomod);
	elem.style.visibility = (elem.style.visibility == "visible") ? "hidden" : "visible";
}

//unmodal if something is modaled
function unmodal(){
	modalThis(actualmod);
}

//toggles the sidebar
function toggleMenu(){
	//have to reuse here..
	var elemsec =document.getElementById("section");
	var elemcpl =document.getElementById("currently-playing");
	var elemfil =document.getElementById("filters");

	if (hasClass(elemcpl,"on")){
		removeClass(elemcpl,"on");
		removeClass(elemfil,"on");
		removeClass(elemsec,"full-width");
	}else{
		addClass(elemcpl,"on");
		addClass(elemfil,"on");
		addClass(elemsec,"full-width");
	}


}

//toggles the sidebar
function toggleMenuMob(){
	var elem =document.getElementById("currently-playing");
	if (hasClass(elem,"on"))
		removeClass(elem,"on");
	else
		addClass(elem,"on");
}

function chooseStar(size) {
	return function() {
		var elem;
		for (var xx=1; xx<=5; xx++){
			if (xx<=size){
	 			elem= document.getElementById("star"+xx);
	 			removeClass(elem,"icon-star");
 				addClass(elem,"icon-star2");
			}else{
	 			elem= document.getElementById("star"+xx);
	 			removeClass(elem,"icon-star2");
 				addClass(elem,"icon-star");
			}
			
		}
	};
}




/*
utilities
*/
//hasclass, addclass and remove class taken from http://jaketrent.com/post/addremove-classes-raw-javascript/
function hasClass(ele,cls) {
  return ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
}
function addClass(ele,cls) {
  if (!hasClass(ele,cls)) ele.className += " "+cls;
}
function removeClass(ele,cls) {
  if (hasClass(ele,cls)) {
    var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
    ele.className=ele.className.replace(reg,' ');
  }
}

/*
maths
*/
//miliseconds to seconds
function msToSeconds(mscs){
	return mscs/1000;
}
//miliseconds to minutes
function msToMinutes(mscs){
	return msToSeconds(mscs)/60;
}
//miliseconds to seconds without minutes (ie: 127 ret 7)
function msToSecondsWithoutMinutes(mscs){
	return msToSeconds(mscs)%60;
}
//percent of a part in a total
function percent(part,total){
	return part*100.0/total;
}
// negate the random bool state
function setRandom(){
	random=!random;
	if (random)
		removeClass(document.getElementById("i-shuffle"),"inactive");
	else
		addClass(document.getElementById("i-shuffle"),"inactive");
}

// negates repeat (have to reuse the method setrandom..)
function setRepeat(){
	repeat=!repeat;
	if (repeat)
		removeClass(document.getElementById("i-loop"),"inactive");
	else
		addClass(document.getElementById("i-loop"),"inactive");
}


//returns the song being dragged
function draggingASong(data) {
  return function(event) {
    draggedsong=data;
  }
}


//updates the drag position
function updatedrag() { 
	if (dragging)
		draggable.style.transform="translate3d("+(mouse.x-10)+"px, "+(mouse.y-10)+"px, 0)";
	moving = false;
}

//start the dragging and drag areas
function mousedown(event) {
	dragging=true;
	showDragArea();
}
//stop the dragging and hide dragging rectangle
function mouseup() {
	dragging=false;
	addClass(draggable,"not-dragging");
}

//adds a song to favorites
function addSongToFavorites(){

	if (draggedsong!=0){
		document.getElementById("sidebar-list").innerHTML+="<li><a href=\"#\" onclick=\"playSongHandler("+draggedsong+")\">"+playlist[draggedsong-1]+"</a></li>"
	}
	draggedsong=0;
	hideDragArea();
}

//plays a dragged song
function playDraggedSong(){
	if (draggedsong!=0){
		playSongHandler(draggedsong);
	}
	draggedsong=0;

}

//hides the dropzones
function hideDragArea(){
	addClass(document.getElementById("drop-zone-fav"),"hide");
	removeClass(document.getElementById("player"),"drop-zone");
}

//shows the dropzones
function showDragArea(){
	removeClass(document.getElementById("drop-zone-fav"),"hide");
	addClass(document.getElementById("player"),"drop-zone");
}

var playbtn, pausebtn, backbtn, nextbtn, lbtn, rbtn, playing, eventbtn, volumebtn, filtersongs, filteralbums, filterartists,toggler,modal, rateit, songss;
var dragging;
var draggable;
var mouse = {x: 0, y: 0};

var moving = false;


// when site is loaded, loads the listeners and +
window.onload = function(){

	//have to fix this race condition in a nicer way:

	filter("songs");

	setTimeout(
		function(){
			songss = document.getElementsByClassName("songp");
			for (ll=0; ll<songss.length; ll++)
			{
				songss[ll].addEventListener("mousedown", draggingASong(songss[ll].getAttribute('data-id')));
			}	
		}
	,100);


	
	// event is triggered (for logs)
	document.onclick = function (e) { return logEvent(e); };
	document.ondblclick = function (e) { return logEvent(e); };
	document.onkeyup = function (e) { return logEvent(e); };
	/*
	Other vars and Listeners
	*/
	moving=false;
	dragging=false;
	draggable=document.getElementById("draggable");
	playbtn = document.getElementById("btn-play");
	pausebtn = document.getElementById("btn-pause");
	backbtn = document.getElementById("btn-back");
	nextbtn = document.getElementById("btn-next");
	lbtn = document.getElementById("btn-l");
	rbtn = document.getElementById("btn-r");
	playing = document.getElementById("playing");
	eventbtn = document.getElementById("btn-events");
	volumebtn = document.getElementById("btn-volume");
	filtersongs = document.getElementById("filter-songs");
	filteralbums = document.getElementById("filter-albums");
	filterartists = document.getElementById("filter-artists");
	toggler= document.getElementById("btn-hide-show-side");
	togglermob= document.getElementById("btn-hide-show-side-mobile");
	modal=  document.getElementsByClassName("modal");
	ratebtn = document.getElementById("rate");
	dropzone=document.getElementById("drop-zone-fav");
	dropzoneplay=document.getElementById("player");
	songtables=document.getElementById("content");

	//stars=document.getElementsByClassName("icon-star");

	playbtn.addEventListener("click", function(){playSongHandler(currentsong)} );
	pausebtn.addEventListener("click", pauseSong );
	backbtn.addEventListener("click", function(){ currentsong-1 > 0 ? playSongHandler(--currentsong) : currentsong=totalsongs; playSongHandler(currentsong); } );
	nextbtn.addEventListener("click", function(){currentsong+1 <= totalsongs ? playSongHandler(++currentsong) : currentsong=1; playSongHandler(currentsong);} );
	playing.addEventListener("click", moveToPosition);
	lbtn.addEventListener("click", setRepeat );
	rbtn.addEventListener("click", setRandom );
	volumebtn.addEventListener("click", muteSound );
	volumebtn.addEventListener("mouseover", function(){ showHideElement("volume")} );
	volumebtn.addEventListener("mouseout", function(){ showHideElement("volume")} );
	filtersongs.addEventListener("click", function(){filter("songs")} );
	filteralbums.addEventListener("click", function(){filter("albums")} );
	filterartists.addEventListener("click", function(){filter("artists")} );
	toggler.addEventListener("click", function(){toggleMenu()} );
	togglermob.addEventListener("click", function(){toggleMenuMob()} );

	eventbtn.addEventListener("click", function(){ modalThis("event-log-box")} );
	ratebtn.addEventListener("click", function(){ modalThis("rate-it")} );
	songtables.addEventListener("mousedown", mousedown);
	document.addEventListener("mouseup", mouseup);

	dropzone.addEventListener("mouseover", addSongToFavorites );
	dropzoneplay.addEventListener("mouseover", playDraggedSong );
	for (var i=0; i < modal.length; i++)
		modal[i].addEventListener("click", function(){unmodal()} );


	// have to put all in only one var
	var choose1 = chooseStar(1);
	var choose2 = chooseStar(2);
	var choose3 = chooseStar(3);
	var choose4 = chooseStar(4);
	var choose5 = chooseStar(5);
	document.getElementById('star1').onmouseover = choose1;
	document.getElementById('star2').onmouseover = choose2;
	document.getElementById('star3').onmouseover = choose3;
	document.getElementById('star4').onmouseover = choose4;
	document.getElementById('star5').onmouseover = choose5;



	document.addEventListener('mousemove', function(e){ 
		mouse.x = e.clientX || e.pageX; 
		mouse.y = e.clientY || e.pageY;
		//console.log(mouse.x);
		if (!moving) {
			if (dragging){
				removeClass(draggable,"not-dragging");
			}
			moving = true;
			requestAnimationFrame(updatedrag);
		}
	}, false);


	
}

