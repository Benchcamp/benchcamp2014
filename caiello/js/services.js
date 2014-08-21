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

	//registers a track to soundjs given by a name and a filename
	//returns a promise
	function _registerTrack(trackname, file){
		var _res=function (){
			defer.resolve();
			_registeredTracks[trackname]=true;

		}
		var defer=$q.defer();
		if (!_registeredTracks[trackname]){
			createjs.Sound.registerSound("assets/resources/songs/"+file, trackname);
			createjs.Sound.addEventListener("fileload", _res);
		}else{
			defer.resolve();
		}
		return defer.promise;
	}

	//play something by a given artist, artist+album or artist+album+track
	//first it create the queue then it play it
	function _play(artist, album, track){
		_queueThis(artist,album,track);
		_nextTrack();
	}

	//queue something by a given artist, artist+album or artist+album+track
	function _queueThis(artist, album, track){
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
	}

	//pauses the current song
	function _pause(){
		_instance.pause();
	}

	//stops the current song (pausing it and setting position to 0)
	function _stop(){
		_pause();
		_instance.setPosition(0);
	}

	//plays the next track in the playlist
	function _nextTrack(){
		if (!_actualTrack)
			_actualTrack=-1;
		
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


	//plays a given track
	//if not registered yet, it will register the track and then play it
	function _playTrack(track){

		_registerTrack(track.song , track.file).then(
			function(){
				if (_instance)
					_stop();
				_instance = createjs.Sound.play(track.song);
				_instance.addEventListener("complete", _trackEnds);
				_instance.volume = 1.0;
			}
		)
	}

	//function triggered when a song ends
	function _trackEnds(){
		_nextTrack();
	}

	// loads a json of a type (albums, artists, tracks) and returns a promise
	function _load(type){
		return $http.get("data/"+type+".json")
	}

	//load all the tracks
	function _loadTracks(){
		this.load("tracks").
		then( function (res){
			_tracks=res.data.tracks;
		});
	}

	// negate the repeat status
	function _changeRepeat(){
		_repeat=!_repeat;
	}

	// negate the shuffle status
	function _changeShuffle(){
		_shuffle=!_shuffle;
	}


	return {
		play: _play, //play something by a given artist, artist+album or artist+album+track
		load: _load, //load data (tracks, albums or artists)
		loadTracks: _loadTracks, //load tracks
		changeRepeat: _changeRepeat, //negate the actual value
		changeShuffle: _changeShuffle //negate the actual value
	}
});



