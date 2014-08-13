var ContentTable = (function () {
    var contentTable = document.getElementById("content-table");

    function _displaySongs() {
        var headers, thead, tbody, tr, td;

        headers = ["Number", "Title", "Length"];
        thead = document.createElement("thead");
        tr = document.createElement("tr");
        for (var header in headers) {
            td = document.createElement("td");
            td.innerHTML = header;
            tr.appendChild(td);
        }
        thead.appendChild(tr);
        contentTable.appendChild(thead);

        tbody = document.createElement("tbody");

        for (var song in MusicLibrary.songs) {
            tr = document.createElement("tr");
            for (var prop in Object.keys(song)) {
                td = document.createElement("td");
                td.innerHTML = song[prop];
                tr.appendChild(td);
            }
        }
        contentTable.appendChild(tbody);
    }

    function _displayAlbums() {
        var headers, thead, tbody, tr, td;

        headers = ["Title", "Year"];
        thead = document.createElement("thead");
        tr = document.createElement("tr");

        for (var header in headers) {
            td = document.createElement("td");
            td.innerHTML = header;
            tr.appendChild(td);
        }

        thead.appendChild(tr);
        contentTable.appendChild(thead);

        tbody = document.createElement("tbody");
        for (var album in MusicLibrary.albums) {
            tr = document.createElement("tr");

            td = document.createElement("td");
            td.innerHTML = album["Title"];
            tr.appendChild(td);

            td = document.createElement("td");
            td.innerHTML = album["Year"];
            tr.appendChild(td);
        }
        contentTable.appendChild(tbody);
    }

    function _displayArtists() {
        var thead, tbody, tr, td, artist;

        thead = document.createElement("thead");
        tr = document.createElement("tr");

        td = document.createElement("td");
        td.innerHTML = "Name";

        tr.appendChild(td);
        thead.appendChild(tr);
        contentTable.appendChild(thead);

        tbody = document.createElement("tbody");
        for (var i = 0; i < MusicLibrary.artists; i++) {
            artist = MusicLibrary.artists[i];

            tr = document.createElement("tr");

            td = document.createElement("td");
            td.innerHTML = artist["Name"];
            tr.appendChild(td);
        }
        contentTable.appendChild(tbody);
    }

    return {
        displaySongs: _displaySongs,
        displayAlbums: _displayAlbums,
        displayArtists: _displayArtists
    }
})();

var Filters = (function () {

    document.addEventListener("DOMContentLoaded", function () {
        document.getElementById("btnFilterSongs").addEventListener("click", ContentTable.displaySongs, false);
        document.getElementById("btnFilterAlbums").addEventListener("click", ContentTable.displayAlbums, false);
        document.getElementById("btnFilterArtists").addEventListener("click", ContentTable.displayArtists, false);
        document.getElementById("btnToggleFilters").addEventListener("click", _toggleFilters, false);
    });

    function _toggleFilters() {
        document.getElementById("panel-filters").classList.toggle("panel-hidden");
        document.getElementById("panel-filters").classList.toggle("panel-visible");
        document.getElementById("playing-smart").classList.toggle("panel-visible");
        document.getElementById("playing-smart").classList.toggle("panel-hidden");
        document.getElementById("wrapper-top").classList.toggle("full-size");
        document.getElementById("wrapper-bot").classList.toggle("full-size");
    }
})();

var NowPlaying = (function () {
    document.addEventListener("DOMContentLoaded", function () {
        document.getElementById("btnFavSmart").addEventListener("click", _addFavorite, false);
        document.getElementById("btnFavTab").addEventListener("click", _addFavorite, false);
        document.getElementById("btnTogglePlaying").addEventListener("click", _togglePlaying, false);
    });

    function _addFavorite() {

    }

    function _togglePlaying() {
        var divContent, tableContent;
        document.getElementById("playing-smart").classList.toggle("panel-hidden");
        document.getElementById("playing-smart").classList.toggle("panel-visible");

        divContent = document.getElementById("content");
        tableContent = document.getElementById("table-content");

        divContent.classList.toggle("full-size");

        if (divContent.classList.contains("full-size") && tableContent.childNodes.length === 0) {
            displaySongs();
        }
    }
})();