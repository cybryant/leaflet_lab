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

//Add circle markers for point features to the map
function createPropSymbols(data, map, years_array){
    //create a Leaflet GeoJSON layer and add it to the map
    L.geoJson(data, {
        pointToLayer: function(feature, latlng){
            return pointToLayer(feature, latlng, years_array);
        }
    }).addTo(map);  
    
    //create an overlay
    var gabon       = L.marker([0.416198, 9.467268]).bindPopup('Gabon: 71.58%'),
        oman        = L.marker([23.58589, 58.405923]).bindPopup('Oman: 67.16%'),
        botswana    = L.marker([-24.628208, 25.923147]).bindPopup('Botswana: 65.64%'),
        saoTome     = L.marker([0.330192, 6.733343]).bindPopup('Sao Tome and Principe: 55.90%');
/*
Angola	-8.839988	13.289437	54.40
South Korea	37.566535	126.977969	53.79
Libya	32.887209	13.191338	52.49
Saudi Arabia	24.749403	46.902838	52.37
Dominican Republic	18.486058	-69.931212	50.09
Puerto Rico	18.466334	-66.105722	49.04
Malaysia	3.139003	101.686855	48.85
Cape Verde	14.93305	-23.513327	48.58
Gambia	13.454876	-16.579032	48.47
San Marino	43.935591	12.447281	48.17
Montenegro	42.43042	19.259364	47.69
Equatorial Guinea	3.750412	8.737104	46.11
Lebanon	33.888629	35.495479	46.09
Mauritania	18.07353	-15.958237	45.94
Belarus	53.90454	27.561524	45.73
Tuvalu	-8.520066	179.198128	45.63
Turks and Caicos Islands	21.467458	-71.13891	45.14
Guam	13.470891	144.751278	44.55
Costa Rica	9.928069	-84.090725	44.31
Turkey	39.933364	32.859742	43.13
Cameroon	3.848033	11.502075	41.84
China	39.904211	116.407395	41.76
Algeria	36.752887	3.042048	41.54
Marshall Islands	7.116421	171.185774	41.05
Iran	35.689198	51.388974	40.66
Northern Mariana Islands	15.177801	145.750967	40.31
*/  
    
    

        var top30 = L.layerGroup([gabon, oman, botswana, saoTome]);

        var overlayMaps = {
            "Top 30 Most Urbanized Countries": top30
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
}
$(document).ready(createMap);