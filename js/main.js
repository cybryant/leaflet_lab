/* Map of GeoJSON data from MegaCities.geojson */

//function to instantiate the Leaflet map
function createMap(){
    //create the map
	var map = L.map('map', {
		center: [20, 0],
		zoom: 2
	});

/*
// access mapbox tiles
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>', 
    maxZoom: 18, 
    id: 'mapbox/streets-v11', 
    tileSize: 512, 
    zoomOffset: -1, 
    accessToken: 'pk.eyJ1IjoiY3licnlhbnQiLCJhIjoiY2p2c3JpOThkMndrcjQ0cGh2Y2Z4bXRkaiJ9.DQF9Z_FoHTZXs-NJdw5vag'
}).addTo(map);
*/

    
//add OSM base tilelayer
 L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
    }).addTo(map);

    //call getData function
    getData(map);
};

//function to calculate the radius of each proportional symbol
function calcPropRadius(attValue) {
    //scale factor to adjust symbol size evenly
    var scaleFactor = 50;
    //area based on attribute value and scale factor
    var area = attValue * scaleFactor;
    //radius calculated based on area
    var radius = Math.sqrt(area/Math.PI);
    
    return radius;
}

//function to add circle markers for point features to the map
function createPropSymbols(data, map){
    //set attribute to visualize with proportional symbols
    var attribute = "60Perc_Urban";
    
    //create marker options
    var geojsonMarkerOptions = {
        radius: 8,
        fillColor: "#ff7800",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };

    
    //create a Leaflet GeoJSON layer and add it to the map
    L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            //for each feature, determine the value for the selected attribute
            var attValue = Number(feature.properties[attribute]);
            
            /*
            //examine the attribute value to check for correctness
            console.log(feature.properties, attValue)
            */
            
            //give each feature's curcle marker a radisu based on its attribute value
            geojsonMarkerOptions.radius = calcPropRadius(attValue);
            
            //create circle markers
            return L.circleMarker(latlng, geojsonMarkerOptions);
        }
    }).addTo(map);
};


//function to retrieve the data and place it on the map
function getData(map){
    //load the data
    $.ajax("data/urb_percent_pop_1960_2017.geojson", {
        dataType: "json",
        success: function(response){
            //cal function to create proportional symbols
            createPropSymbols(response, map);
        }
    });
}
$(document).ready(createMap);