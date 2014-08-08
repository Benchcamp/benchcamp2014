function displayJSONContent(path) {
    var httpRequest = new XMLHttpRequest();
    var retorno;
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState === 4) { //DONE
            if (httpRequest.status === 200) { //SUCCESS
                displayContent(JSON.parse(httpRequest.responseText));
            }
        }
    };
    httpRequest.open('GET', path);
    httpRequest.send();
}

function displayContent(jsonData) {
    var divContent, tableContent;

    tableContent = createTable(jsonData);
    divContent = document.getElementById("content");

    tableContent.id = "table-content";
    divContent.innerHTML = "";
    divContent.appendChild(tableContent);
}

function createTable(jsonData) {
    var table, thead, tbody, tr;

    table = document.createElement("table");
    thead = document.createElement("thead");
    tbody = document.createElement("tbody");
    tr = document.createElement("tr");

    for (var name in jsonData.items[0]) {
        var th = document.createElement("th");
        th.innerHTML = name;
        tr.appendChild(th);
    }

    thead.appendChild(tr);
    table.appendChild(thead);

    for (var i = 0; i < jsonData.items.length; ++i) {
        tr = document.createElement("tr");
        tr.addEventListener("click", selectRow, false);
        tr.id = i + 1;

        for (var name in jsonData.items[i]) {
            var td = document.createElement("td");
            td.innerHTML = jsonData.items[i][name];
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }
    table.appendChild(tbody)

    return table;
}

// *** SELECCION *** //
function selectRow() {
    deselectAll();
    this.className = "selected";
}

function selectRowByID(id) {
    deselectAll();
    document.getElementById(id).className = "selected";
}

function deselectAll() {
    var rows = document.querySelectorAll("#table-content tr");
    for (var i = 1; i < rows.length; i++) {
        rows[i].className = "";
    }
}

// *** FORMATEOS *** //
function twoDigits(numero) {
    return numero > 9 ? numero : "0" + numero;
}

function msToSeconds(milis) {
    return Math.floor(milis / 1000);
}

function msToMinutes(milis) {
    return Math.floor(msToSeconds(milis) / 60);
}

function remainingSeconds(milis) {
    return msToSeconds(milis) % 60
}

function formatPlayingTime(milis) {
    return twoDigits(msToMinutes(milis)) + ":" + twoDigits(remainingSeconds(milis));
}