$(document).ready(function() {
    var onStarClickHandler = function(event) {
        addToFavoriteList(event);
    }

    function htmlEntities(str) {
        return String(str).replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
    }

    function createListItem(trashBinText, instructions, isFavorited) {
        var trashBin = document.createElement("p");
        trashBin.innerHTML = trashBinText;

        var star = document.createElement("span");
        star.className = "glyphicon glyphicon-star";
        if (isFavorited) star.style.color = "green";
        else star.addEventListener("click", onStarClickHandler);

        var left = document.createElement("div");
        left.className = "left";
        left.appendChild(star);
        left.appendChild(trashBin);

        var right = document.createElement("div");
        right.className = "right";
        right.innerHTML = instructions;

        var item = document.createElement("div");
        item.className = "list-item";
        item.appendChild(left);
        item.appendChild(right);

        listContainer.appendChild(item);
    }

    function search() {        
        clearSearchList();

        if (inputField.value !== "") {
            var matches = getAllMatches(inputField.value);
            matches.forEach(match => {
                var isFavorited = (favoritesData.find(function(element) {
                    return element.firstChild.innerText === match.title;
                }) != undefined);
                createListItem(match.title, match.body, isFavorited);            
            });
        }
    }

    function getAllMatches(keyword) {
        var matches = [];
        wasteData.forEach(data => {
            if (data.keywords.indexOf(keyword) !== -1) {
                matches.push(data);
            }
        });

        return matches;
    }

    function onInputChange() {
        if (inputField.value === "") {
            clearSearchList();
        }
    }

    function clearSearchList() {
        while (listContainer.firstChild) {
            listContainer.removeChild(listContainer.firstChild);
        }
    }

    function addToFavoriteList(e) {
        favoritesContainer.style.display = "block";
        var star = e.target;
        var item = star.parentElement.parentElement;
        star.style.color = "green";
        star.removeEventListener("click", onStarClickHandler);

        var clonedItem = item.cloneNode(true);
        clonedItem.getElementsByClassName("glyphicon")[0].addEventListener("click", function(event) {
            removeFromFavoriteList(event);
        });
        
        favoritesData.push(clonedItem);
        favorites.appendChild(clonedItem);
    }

    function removeFromFavoriteList(e) {
        var star = e.target;
        var item = star.parentElement.parentElement;
        
        var index = favoritesData.indexOf(item);
        favoritesData.splice(index, 1);

        favorites.removeChild(item);

        if (favoritesData.length == 0) {            
            favoritesContainer.style.display = "none";
        }
    }


    

    var listContainer = document.getElementsByClassName("list-container")[0];

    var favoritesContainer = document.getElementsByClassName("favorites-container")[0];
    var favorites = favoritesContainer.getElementsByClassName("favorites-body")[0];

    var inputField = document.getElementsByTagName("input")[0];
    inputField.addEventListener("input", onInputChange);
    inputField.addEventListener("keyup", function(event) {
        event.preventDefault();
        if (event.keyCode === 13) {
            search();
        }
    }); 

    var searchButton = document.getElementsByClassName("btn")[0];
    searchButton.addEventListener("click", search);

    
    var favoritesData = [];
    var wasteData = [];
    $.getJSON("https://secure.toronto.ca/cc_sr_v1/data/swm_waste_wizard_APR?limit=1000", function(data) {
        var jsonData = data;
        for (var i = 0; i < jsonData.length; i++) {
            jsonData[i].body = htmlEntities(jsonData[i].body);
            wasteData.push(jsonData[i]);
        }
    });
});