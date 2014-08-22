'use strict';

/*
Services
*/

var services=angular.module("player.services", []);

//Sound service
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


	//give the transcurred time of an isntance
	function _getPosition(){
		if (_instance)
			return _instance.getPosition();
		else
			return 0;
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
			}else if ((!artist)&&(!album)&&(!track))
				_tracksQueue.push(_tracks[i])

			_actualTrack=undefined;

		}
	}

	//pauses the current song or resumes it if paused
	function _pause(){
		if (_instance){
			if (!_instance.pause())
				_instance.resume();
		}
		else{
			_play() //if there is no instance, and i want to play, Ill play everything
		}	
	}



	//stops the current song (pausing it and setting position to 0)
	function _stop(){
		_pause();
		_instance.setPosition(0);
	}

	//plays the next track in the playlist
	function _nextTrack(){

		if (_actualTrack==undefined)
			_actualTrack=-1;
		if (_actualTrack+1 <= _tracksQueue.length-1)
			_actualTrack++;
		else 
			if (_repeat)
				_actualTrack=0;

		if (_shuffle)
			_actualTrack=Math.floor(Math.random()*_tracksQueue.length);

		if (_actualTrack!=-1)
			_playTrack(_tracksQueue[_actualTrack]);
	}

	//plays the prev track in the playlist
	function _prevTrack(){

		if (_actualTrack==undefined)
			_actualTrack = _tracksQueue.length;

		if (_actualTrack-1 >= 0)
			_actualTrack--;
		else
			if (_repeat)
				_actualTrack=_tracksQueue.length-1;

		if (_shuffle){
			_nextTrack();//if its random doesn't care to go next or prev..
		}

		if (_actualTrack!=_tracksQueue.length){
			_playTrack(_tracksQueue[_actualTrack]);
		}
	
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

	//mute
	function _mute(){
		if (_instance)
        	_instance.setMute(!_instance.getMute());
	}

	// negate the repeat status
	function _changeRepeat(){
		_repeat=!_repeat;
	}

	// negate the shuffle status
	function _changeShuffle(){
		_shuffle=!_shuffle;
	}

	function _currentlyPlaying(){

		if (_instance){
			if ((_tracksQueue.length-1<=_actualTrack)&&(_actualTrack>=0)){
				return _tracksQueue[_actualTrack].song;
			}
		}
	}


	return {
		play: _play, //play something by a given artist, artist+album or artist+album+track
		pause: _pause, //pauses or resume if paused
		load: _load, //load data (tracks, albums or artists)
		mute: _mute, //load data (tracks, albums or artists)
		loadTracks: _loadTracks, //load tracks
		nextTrack: _nextTrack, //play the next tracks
		prevTrack: _prevTrack, //play the prev
		changeRepeat: _changeRepeat, //negate the actual value
		changeShuffle: _changeShuffle, //negate the actual value
		getPosition:_getPosition,//gets the current position
		currentlyPlaying:_currentlyPlaying//get the name of the currently playing track
	}
});



