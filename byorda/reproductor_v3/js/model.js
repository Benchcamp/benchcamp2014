// *** SONG ** //
var Song = function (number, title, length) {
    this._number = number;
    this._title = title;
    this._length = length;
};

Song.prototype.getNumber = function () {
    return this._number;
};

Song.prototype.getSongTitle = function () {
    return this._title;
};

Song.prototype.getLength = function () {
    return this._length;
};

Song.prototype.setNumber = function (number) {
    this._number = number;
};

Song.prototype.setTitle = function (title) {
    this._title = title;
};

Song.prototype.setLength = function (length) {
    this._length = length;
};

// *** ALBUM *** //
var Album = function (title, year, cover) {
    this._title = title;
    this._year = year;
    this._cover = cover;
    this._songs = [];
};

Album.prototype.getAlbumTitle = function () {
    return this._title;
};

Album.prototype.getAlbumYear = function () {
    return this._year;
};

Album.prototype.getCover = function () {
    return this._cover;
};

Album.prototype.getSongs = function () {
    return this._songs;
};

Album.prototype.setTitle = function (title) {
    this._title = title;
};

Album.prototype.setAlbumYear = function (year) {
    this._year = year;
};

Album.prototype.setCover = function (cover) {
    this._cover = cover;
};

// *** ARTIST *** //
var Artist = function (name) {
    this._name = name;
    this._albums = [];
};

Artist.prototype.getName = function () {
    return this._name;
};

Artist.prototype.getAlbums = function () {
    return this._albums;
};

Artist.prototype.setName = function (name) {
    this._name = name;
};