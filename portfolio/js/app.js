/**
 * app.js
 * main application script
 */
"use strict";

/************************************************************/
// Generate map for the "about the farm" page
// OpenStreetMap tile server http://wiki.openstreetmap.org/wiki/Tile_servers
/************************************************************/
var osmTiles = {
    url: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
};

//latitude and longitude of farm
var farmLat = '47.777557';
var farmLon = '-122.356687';

//default zoom level (0-18 for street maps)
//other map styles may have different zoom ranges
var defaultZoom = 13;

//create Leaflet map and add the OSM tile layer
var map = L.map("map").setView([farmLat, farmLon], defaultZoom);
L.tileLayer(osmTiles.url, {
    attribution: osmTiles.attribution
}).addTo(map);

//create a popup marker for the farm
var box = L.popup({keepInView: true, closeButton: false, className: 'popupMsgBox', maxwidth: 100}).setLatLng([farmLat, farmLon]).openOn(map);
box.setContent('FARM');

/************************************************************/
// Generate chicken mdl-cards
/************************************************************/
function chickenCard (chicken) {

    //create cell and card divs
    var cellDiv = document.createElement("div");
    cellDiv.setAttribute("class", "mdl-cell mdl-cell--3-col mdl-cell--4-col-tablet mdl-cell--4-col-phone");
    var cardDiv = document.createElement("div");
    cardDiv.setAttribute("class", "mdl-card mdl-shadow--2dp");

    // create media div and append to card div
    var mediaDiv = document.createElement("div");
    mediaDiv.setAttribute("class", "mdl-card__media");
    mediaDiv.innerHTML = '<img src="img/' + chicken.photo + '" alt="' + chicken.name + '">';
    cardDiv.appendChild(mediaDiv);

    // create title div and append to card div
    var titleDiv = document.createElement("div");
    titleDiv.setAttribute("class", "mdl-card__title");
    titleDiv.innerHTML = '<h2 class="mdl-card__title-text">' + chicken.name + '</h2>';
    cardDiv.appendChild(titleDiv);

    // create supporting text div and append to card div
    var textDiv = document.createElement("div");
    textDiv.setAttribute("class", "mdl-card__supporting-text");
    textDiv.innerHTML = chicken.desc;
    cardDiv.appendChild(textDiv);

    // create action div and append to card div
    var actionDiv = document.createElement("div");
    actionDiv.setAttribute("class", "mdl-card__actions mdl-card--border");
    actionDiv.innerHTML = '<span class="mdl-js-ripple-effect mdl-color-text--primary mdl-badge" data-badge="' +
                          chicken.eggs + '">Breed: ' + chicken.breed + '</span>';
    cardDiv.appendChild(actionDiv);

    // append card to cell
    cellDiv.appendChild(cardDiv);

    return cellDiv;
} 

// collect a hash of chicken breeds to populate the select boxes in the next section
var chickenBreeds = {};
function buildChickenCards (chickens) {
    for (var i=0; i < chickens.length; i++) {
        // append new chicken div to "chickens" div placeholder in original HTML
        document.getElementById("chickens").appendChild(chickenCard(chickens[i]));
        //add chicken breed and number of eggs to the hash
        chickenBreeds[chickens[i].breed] = chickens[i].eggs;
    }
}

buildChickenCards(CHICKENS);


/************************************************************/
// Populate chicken breed select boxes & setup egg calculator
/************************************************************/
//there are four select boxes to be populated with the same options
for (var i=0; i < 4; i++) {
    var selectID = 'breed-select' + (i+1);
    var select = document.getElementById(selectID);
    var opt = document.createElement("option");
    opt.value = '';
    opt.innerHTML = 'Select Breed';
    select.appendChild(opt);
    for (var b in chickenBreeds) {
        if (chickenBreeds.hasOwnProperty(b)) {
            var opt = document.createElement("option");
            opt.value = chickenBreeds[b];
            opt.innerHTML = b;
            select.appendChild(opt);
        }
    }
}

//listen for the user to click the calculate button
var calcButton = document.querySelector("#calculate-button");
calcButton.addEventListener("click", function(){
    var eggTotal = 0;
    for (var i=0; i < 4; i++) {
        //get number of eggs by the breed selected
        var selectID = 'breed-select' + (i+1);
        var breedSelect = document.getElementById(selectID);
        var eggNum = breedSelect.options[breedSelect.selectedIndex].value;
        if (eggNum) {
            //get number of hens of this breed
            var henNumID = 'number-select' + (i+1);
            var henNumSelect = document.getElementById(henNumID);
            eggTotal += (+eggNum * henNumSelect.options[henNumSelect.selectedIndex].value);
        }
    }
    if (eggTotal) {
        document.getElementById("eggTotal-month").textContent = eggTotal;
        document.getElementById("eggTotal-year").textContent = eggTotal * 12;
    }
});
