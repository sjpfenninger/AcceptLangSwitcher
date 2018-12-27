function greyOutTopBottom(elem) {
    var parent = elem.parentNode;

    if (elem == parent.firstElementChild) {
        elem.className = "datarow first";
    } else if (elem == parent.lastElementChild) {
        elem.className = "datarow last";
    } else {
        elem.className = "datarow";
    }
}

function updateTable() {
    var tableRows = document.getElementById("patternTable").childNodes;
    for (var i = 0; i < tableRows.length; i++) {
        greyOutTopBottom(tableRows[i]);
    }
}

function addRow(e, pattern="", lang="") {
    var tableRow = '<tr class="datarow"><td><input class="pattern" type="text" value="' + pattern + '"></td><td><input class="lang" type="text" value="' + lang + '"></td><td><button class="moveUp" type=button>↑</button><button class="moveDown" type=button>↓</button><button class="removeRow" type=button>❌</button></td></tr>';
    var table = document.getElementById("patternTable");

    table.insertAdjacentHTML('beforeend', tableRow);

    table.lastChild.getElementsByClassName("moveUp")[0].addEventListener('click', moveUp);
    table.lastChild.getElementsByClassName("moveDown")[0].addEventListener('click', moveDown);
    table.lastChild.getElementsByClassName("removeRow")[0].addEventListener('click', removeRow);

    updateTable()
}

function moveUp(e) {
    var elem = e.srcElement.parentNode.parentNode;

    if (elem.previousElementSibling) {
        elem.parentNode.insertBefore(elem, elem.previousElementSibling);
    }

    updateTable();
}

function moveDown(e) {
    var elem = e.srcElement.parentNode.parentNode;

    if (elem.nextElementSibling) {
        elem.parentNode.insertBefore(elem.nextElementSibling, elem);
    }

    updateTable();
}

function removeRow(e) {
    var elem = e.srcElement;
    var toRemove = elem.parentNode.parentNode;
    toRemove.parentNode.removeChild(toRemove);
}

function parseRows() {
    var rows = document.getElementsByClassName("datarow");
    var patterns = [];
    for (var i = 0; i < rows.length; i++) {
        var patt = rows[i].getElementsByClassName("pattern")[0].value;
        var lang = rows[i].getElementsByClassName("lang")[0].value;
        patterns.push([patt, lang]);
    }
    return patterns;
}

function showSuccess() {
    document.getElementById("saveSuccess").innerHTML = "Saved!";

    setTimeout(function(){
        document.getElementById("saveSuccess").innerHTML = '';
    }, 1000);
}

function onError(error) {
    console.log(`Error: ${error}`);
}

function saveOptions(e) {
    var patterns = parseRows();
    var result = browser.storage.sync.set({
        patterns: patterns
    });
    result.then(showSuccess, onError);

}

function restoreOptions() {
    function populateRows(keys) {
        if (Object.keys(keys).length === 0 && keys.constructor === Object) {
            // Empty single row if no patterns in returned keys given
            addRow();
        } else {
            var patterns = keys.patterns;
            // Create table row for each item
            for (var i = 0; i < patterns.length; i++) {
                var patt = patterns[i][0];
                var lang = patterns[i][1];
                addRow(null, patt, lang);
            }
        }
    }

    var patterns = browser.storage.sync.get("patterns");
    patterns.then(populateRows, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);

// Wire up the "add extra row" and "save" buttons
document.getElementById("addRowButton").addEventListener("click", addRow);
document.getElementById("saveButton").addEventListener("click", saveOptions);
