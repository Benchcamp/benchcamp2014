'use strict';

/*
Services
*/

var services=angular.module("player.services", []);

//using factory matchs a key with a value func w/ret?
services.factory("SoundService", function ($q, $http) {

	var _instance;
	var _registeredTracks = [];
	var _tracksQueue = [];
	var _actualTrack;
	var _tracks;
	var _repeat=false;
	var _shuffle=false;

	function _registerTrack(trackname, file){
		console.log("voy a playear: "+trackname+", arch: "+file);
		var _res=function (){
			defer.resolve();
			_registeredTracks[trackname]=true;
			console.log("resuelto vieja");
		}
		var defer=$q.defer();
		if (!_registeredTracks[trackname]){
			createjs.Sound.registerSound("assets/resources/songs/"+file, trackname);
			createjs.Sound.addEventListener("fileload", _res);
			console.log("shii");
		}else{
			defer.resolve();
		}
		return defer.promise;
	}

	function _play(artist, album, track){
		console.log("A PLAYEAR: "+artist+", "+album+", "+track);
		_queueThis(artist,album,track);
		_nextTrack();
	}

	function _queueThis(artist, album, track){

		console.log("A QUEUEAR: "+artist+", "+album+", "+track);
		_tracksQueue=[];
		for (var i=0; i<_tracks.length; i++){

			if (track){
				if (_tracks[i].song==track)
					_tracksQueue.push(_tracks[i]);
			}else if (album){
				if (_tracks[i].album==album)
					_tracksQueue.push(_tracks[i]);
			}else if (artist){
				if (_tracks[i].artist==artist)
					_tracksQueue.push(_tracks[i]);
			}



		}
		console.log("tracks en queue: ");
		console.log(_tracksQueue);
	}

	function _pause(){
		_instance.pause();
	}

	function _stop(){
		_pause();
		_instance.setPosition(0);
	}


	function _nextTrack(){
		
		if (!_actualTrack)
			_actualTrack=-1;
		
		console.log("Tracks Queue: "+_tracksQueue.length);

		_shuffle=true;
		
		if (_actualTrack+1 <= _tracksQueue.length)
			_actualTrack++;
		else 
			if (_repeat)
				_actualTrack=0;
		
		if (_shuffle)
			_actualTrack=Math.floor(Math.random()*_tracksQueue.length);

		if (_actualTrack!=-1)
			_playTrack(_tracksQueue[_actualTrack]);

	}



	function _playTrack(track){
		//if not registered yet, it will register the track and then play it
		console.log("registrando");

		_registerTrack(track.song , track.file).then(
			function(){
				if (_instance)
					_stop();
				_instance = createjs.Sound.play(track.song);
				_instance.volume = 1.0;
			}
		)
	}

	function _trackEnds(){
		console.log("song ends");
	}

	// loads a json of a type (albums, artists, tracks) and returns a promise
	function _load(type){
		return $http.get("data/"+type+".json")
	}

	function _loadTracks(){
		console.log("loading fckn tracks");
		this.load("tracks").
		then( function (res){
			_tracks=res.data.tracks;
			console.log(_tracks);
		});
	}


	return {
		play: _play,
		playTrack: _playTrack,
		trackEnds: _trackEnds,
		registerTrack: _registerTrack,
		load: _load,
		loadTracks: _loadTracks
	}
});



