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
}

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

//function to convert markers to circle markers
function pointToLayer(feature, latlng, years_array){
     //assign the current attribute based on the first index of years_array
    var attribute = years_array[0];   
    //check
    console.log(attribute);

    //create marker options
    var options = {
        fillColor: "#ff7800",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };  
    
    //for each feature, determine the value for the selected attribute
    var attValue = Number(feature.properties[attribute]);
    
    //give each feature's circle marker a radius based on its attribute value
    options.radius = calcPropRadius(attValue);    
    
    //create circle marker layer
    var layer = L.circleMarker(latlng, options);  
    
    //build popup content string to identify the country
    var popupContent = "<p><b>Country: </b>" + feature.properties.Entity + "</p>";
    
    //add formatted popup string for percent urban
    var year = attribute.split("P")[0]; 
    popupContent += "<p><b>Urban Population in " + year + ": </b>" + feature.properties[attribute] + "%</p>";
    
    //bind the popup to the circle marker
    layer.bindPopup(popupContent, {
        offset: new L.Point(0,-options.radius)
    });
    
    //event listeners to open popup on hover
    layer.on({
        mouseover: function(){
            this.openPopup();
        },
        mouseout: function(){
            this.closePopup();
        }
    });
    
    //return the circle marker to the L/geoJson pointToLayer option
    return layer;
}
    
//Add circle markers for point features to the map
function createPropSymbols(data, map, years_array){
    //create a Leaflet GeoJSON layer and add it to the map
    L.geoJson(data, {
        pointToLayer: function(feature, latlng){
            return pointToLayer(feature, latlng, years_array);
        }
    }).addTo(map);
}


//function to create sequence controls
function createSequenceControls(map){
    //create range input element (slider)
    $('#sequence-controls').append('<input class="range-slider" type="range">');
    
    //set slider attributes
    $('.range-slider').attr({
      max: 6,
      min: 0,
      value: 0,
      step: 1
    });
    
    //add reverse & skip buttons
    $('#sequence-controls').append('<button class="skip" id="reverse">Reverse</button>');
    $('#sequence-controls').append('<button class="skip" id="forward">Skip</button>');
    
    /*WORK ON BUTTONS
    //replace button content with images
    $('#reverse').html('<img src="img/backward_noun_Skip_559097b.svg">');
    $('#forward').html('<img src="img/forward_noun_Skip_559098.png">');  
    */
    
}

//function to build an array of the data for each year
function processData(data){
    //empty array to hold attributes
    var years_array = [];
    
    //properties of the first feature in the dataset
    var properties = data.features[0].properties;
    
    //push each attribute name into years_array
    for (var attribute in properties){
        //only take attributes with population values
        if (attribute.indexOf("Perc") > -1){
            years_array.push(attribute); 
        } 

    }
 
    /*
    //check result
    console.log(years_array);
    */
    
    return years_array;
}

//function to retrieve the GeoJSON data and place it on the map
function getData(map){
    //load the data
    $.ajax("data/urb_percent_pop_1960_2017.geojson", {
        dataType: "json",
        success: function(response){
            //create an attributes array
            var years_array = processData(response);
            
            //call function to create proportional symbols
            createPropSymbols(response, map, years_array);
            //call function to create slider
            createSequenceControls(map, years_array);
        }
    });
}
$(document).ready(createMap);