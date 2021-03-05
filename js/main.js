/* Map of GeoJSON data from MegaCities.geojson */

//function to instantiate the Leaflet map
function createMap(){
    //create the map
	var map = L.map('map', {
		center: [20, 0],
		zoom: 3
	});


    // access mapbox tiles
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>', 
        maxZoom: 18, 
        id: 'mapbox/streets-v11', 
        tileSize: 512, 
        zoomOffset: -1, 
        accessToken: 'pk.eyJ1IjoiY3licnlhbnQiLCJhIjoiY2p2c3JpOThkMndrcjQ0cGh2Y2Z4bXRkaiJ9.DQF9Z_FoHTZXs-NJdw5vag'
    }).addTo(map);

    //call getData function
    getData(map);
    
    

	function searchByAjax(text, callResponse)//callback for 3rd party ajax requests
	{
		return $.ajax({
			url: 'data/urb_percent_pop_1960_2017.geojson',	//read comments in search.php for more information usage
			type: 'GET',
			data: {q: text},
			dataType: 'json',
			success: function(json) {
				callResponse(json);
			}
		});
	}
    
	map.addControl( new L.Control.Search({sourceData: searchByAjax, text:'Entity', markerLocation: true}) );
    
    
    
    /*
    //add search box
    //... adding data in searchLayer ...
    var searchLayer = L.layerGroup(L.geoJSON("data/urb_percent_pop_1960_2017.geojson")).addTo(map);
    //searchLayer is a L.LayerGroup contains searched markers
    map.addControl(new L.Control.Search({layer: searchLayer}) ); 

    
    var data = "data/urb_percent_pop_1960_2017.geojson";
    //add search box
    //... adding data in searchLayer ...
    var searchLayer = L.geoJSON(data);
    //searchLayer is a L.LayerGroup contains searched markers
    map.addControl(new L.Control.Search({layer: searchLayer}) );      
    

    
/*	var featuresLayer = new L.GeoJSON(data, {
			style: function(feature) {
				return {color: feature.properties.color };
			},
			onEachFeature: function(feature, marker) {
				marker.bindPopup('<h4 style="color:'+feature.properties.color+'">'+ feature.properties.name +'</h4>');
			}
		});

	map.addLayer(featuresLayer);

	var searchControl = new L.Control.Search({
		layer: featuresLayer,
		propertyName: 'name',
		marker: false,
		moveToLocation: function(latlng, title, map) {
			//map.fitBounds( latlng.layer.getBounds() );
			var zoom = map.getBoundsZoom(latlng.layer.getBounds());
  			map.setView(latlng, zoom); // access the zoom
		}
	});

	searchControl.on('search:locationfound', function(e) {
		
		//console.log('search:locationfound', );

		//map.removeLayer(this._markerSearch)

		e.layer.setStyle({fillColor: '#3f0', color: '#0f0'});
		if(e.layer._popup)
			e.layer.openPopup();

	}).on('search:collapsed', function(e) {

		featuresLayer.eachLayer(function(layer) {	//restore feature color
			featuresLayer.resetStyle(layer);
		});	
	});
	
	map.addControl( searchControl );  //inizialize search control    
*/
    
}

//Add circle markers for point features to the map + overlay for most and least urbanized
function createPropSymbols(data, map, years_array){
    //create a Leaflet GeoJSON layer and add it to the map
    L.geoJson(data, {
        pointToLayer: function(feature, latlng){
            return pointToLayer(feature, latlng, years_array);
        }
    }).addTo(map);  
}
    
//Create overlay for most and least urbanized countries
function createOverlays(map){
    //variables for top ten urbanized countries
    var gabon               = L.marker([-0.803689, 11.609444]).bindPopup('Gabon: 71.58%'),
        oman                = L.marker([21.512583, 55.923255]).bindPopup('Oman: 67.16%'),
        botswana            = L.marker([-22.328474, 24.684866]).bindPopup('Botswana: 65.64%'),
        saoTome             = L.marker([0.18636, 6.613081]).bindPopup('Sao Tome and Principe: 55.90%'),
        angola	            = L.marker([-11.202692,17.873887]).bindPopup('Angola:	54.40%'),
        southKorea	        = L.marker([35.907757, 127.766922]).bindPopup('South Korea: 53.79%'),
        libya	            = L.marker([26.3351, 17.228331]).bindPopup('Libya:	52.49%'),
        saudiArabia         = L.marker([23.885942, 45.079162]).bindPopup('Saudi Arabia:	52.37%'),
        dominicanRepublic	= L.marker([18.735693, -70.162651]).bindPopup('Dominican Republic: 50.09%'),
        puertoRico	        = L.marker([18.220833, -66.590149]).bindPopup('Puerto Rico: 49.04%');
    
    //variables for negative urbanized countries
    var samoa           = L.marker([-13.759029, -172.104629]).bindPopup('Samoa: -0.47%'),
        guyana          = L.marker([4.860416, -58.93018]).bindPopup('Guyana: -2.47%'),
        isleOfMan       = L.marker([54.236107, -4.548056]).bindPopup('Isle of Man: -2.67%'),
        stLucia         = L.marker([13.909444, -60.978893]).bindPopup('St. Lucia: -2.85%'),
        barbados	    = L.marker([13.193887, -59.543198]).bindPopup('Barbados:	-5.62%'),
        liechtenstein	= L.marker([47.166, 9.555373]).bindPopup('Liechtenstein: -6.12%'),
        tajikistan	    = L.marker([38.861034, 71.276093]).bindPopup('Tajikistan: -6.19%'),
        austria         = L.marker([47.516231, 14.550072]).bindPopup('Austria: -6.63%'),
        aruba	        = L.marker([12.52111, -69.968338]).bindPopup('Aruba: -7.48%'),
        belize	        = L.marker([17.189877, -88.49765]).bindPopup('Belize: - 8.43%'),
        antiguaBarbuda	= L.marker([17.060816, -61.796428]).bindPopup('Antigua and Barbuda: -14.94%');    

        //create layer group to hold the top ten countries
        var top10 = L.layerGroup([gabon, oman, botswana, saoTome, angola, southKorea, libya, saudiArabia, dominicanRepublic, puertoRico]);
    
        //create layer group to hold the negative countries
        var negativeUrban = L.layerGroup([samoa, guyana, isleOfMan, stLucia, barbados, liechtenstein, tajikistan, austria, aruba, belize, antiguaBarbuda]);

        //create overlay controls
        var overlayMaps = {
            "Top 10 Most Urbanized Countries, 1960 to 2017": top10,
            "Countries with Negative Urbanization, 1960 to 2017": negativeUrban
        };

        L.control.layers(null, overlayMaps).addTo(map);
}


//function to calculate the radius of each proportional symbol
function calcPropRadius(attValue) {
    //scale factor to adjust symbol size evenlyS
    var scaleFactor = 10;
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


//build an array of data for each year to pass to sequence controls
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
  
    //check result
    console.log(years_array);
    
    return years_array;
}


//create sequence controls
function createSequenceControls(map, years_array){
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
    
    /*WORK ON BUTTONS - ADD SVG INSTEAD OF TEXT; CORRECT HORIZONTAL ALIGNMENT
    //replace button content with images
    $('#reverse').html('<img src="img/backward_noun_Skip_559097b.svg">');
    $('#forward').html('<img src="img/forward_noun_Skip_559098.png">');  
    */
        
    //click listener for buttons
    $('.skip').click(function(){
        //get the old index value
        var index = $('.range-slider').val();
        
        //increment or decrement depending on button clickec
        if ($(this).attr('id') == 'forward'){
            index++;
            //if past the last attribute, wrap around to first attribute
            index = index > 6 ? 0 : index;
        } else if ($(this).attr('id') == 'reverse'){
            index--;
            //if past the first attribut, wrap around to the last attribute
            index = index < 0 ? 6 : index;
        }
        
        //update slider
        $('.range-slider').val(index); 

        //pass new attibute to update symbols
        updatePropSymbols(map, years_array[index]);
    });
    
    //input listener for slider
    $('.range-slider').on('input', function(){
        //get the new index value
        var index = $(this).val();
        
        /*
        //check
        console.log(index);
        */
        
        //pass new attibute to update symbols
        updatePropSymbols(map, years_array[index]);     
    });   
}


//function to resize proportional symbols according to new attribute values
function updatePropSymbols(map, attribute){
    map.eachLayer(function(layer){
        if (layer.feature && layer.feature.properties[attribute]){

            //access feature properties
            var props = layer.feature.properties;

            //update each feature's radius based on new attribute values
            var radius = calcPropRadius(props[attribute]);
            layer.setRadius(radius);

            //add city to popup content string
            var popupContent = "<p><b>Country:</b> " + props.Entity + "</p>";

            //add formatted attribute to panel content string
            var year = attribute.split("P")[0]; 
            popupContent += "<p><b>Urban Population in " + year + ": </b>" + props[attribute] + "%</p>";

            //replace the layer popup
            layer.bindPopup(popupContent, {offset: new L.Point(0,-radius)
            });
        }
    });
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

    //call function to create overlays
    createOverlays(map);
}

$(document).ready(createMap);