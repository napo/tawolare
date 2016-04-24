jQuery(document).ready(main)
var map;
var lastgeojsonLayer = null; 
var photogeojson = null;
var lastphotoLayer = null;
var lc = null;
var formupload =  $("#uploadfile")
var viewparcel = 0
/*var target
var spinner
*/

function getdescription(data) {
    message = '<p><h4>comune di ' + data["comune"] + ' - codice ' + data["comu"] + '</h4>';
    message += "<h5>comune catastale di " + data["dcat"] + " - codice " + data["codcc"] + "</h5>";
    message += '<h2>particella catastale ' + data["num"] + '</h2>';
    message += '<br/>';
    message += '<table>';
    tipop = "";
    if  (data["tipop"] == "P") {
        tipop = "principale"
    } else if (data["tipop"] == "C") {
        tipop = "pertinenza"
    }
    if (tipop != "") {
        message += '<tr>';
        message += '<td>tipo:</td><td>'+ tipop  + '</td>';
        message += '</tr>';
    }

    fab = ""
    if  (data["fab"] == "S") {
        fab = "sì"
    } else if (data["fab"] == "N") {
        fab = "no"
    }
    if (fab != "") {
        message += '<tr>';
        message += '<td>fabbricato: </td><td>'+ fab  + '</td>'
        message += '</tr>';
    }
    if (data["dsup_sopra"] != "") {
        message += '<tr>';
        message += '<td>numero particelle diritto superficie sopra il suolo:</td><td>'+ data  + '</td>';
        message += '</tr>';
    }

    if (data["dsup_sotto"] != "") {
        message += '<tr>';
        message += '<td>numero particelle diritto superficie sotto il suolo:</td><td>'+ data + '</td>';
        message += '</tr>';
    }

    message += '<tr>';
    message += '<td>area:</td><td>'+ Math.round(data["area"]).toLocaleString()  + ' mq</td>';
    message += '</tr>';
    message += '<tr>';
    message += '<td>perimetro:</td><td>'+ Math.round(data["perimeter"]).toLocaleString()  + ' m</td>';
    message += '</tr>';
    message += '<tr>';
    message += '<td>centroide longitudine</td><td>'+ data["centroidX"].toFixed(6)  + '</td>';
    message += '</tr>';
    message += '<tr>';
    message += '<td>centroide latitudine</td><td>'+ data["centroidY"].toFixed(6)  + '</td>';
    message += '</tr>';
    message += '</table>';
    message += '</p>';
    return message;
}

function downloadPart(ccat,num) {
    var urlapi = "api/trovaparticella?idcomune=" + ccat + "&numparticella=" + num;
    urlapi = encodeURI(urlapi.replace('0.', '.'))
    $.ajax({
        type: "get",
        url: urlapi,
        success: function(data){
            var blob = new Blob([data], {type: "application/json;charset=utf-8"});
            saveAs(blob, "particella.geojson");
		}
    });
  }

function downloadPartKML(ccat,num,format) {
    var urlapi = "api/trovaparticella?idcomune=" + ccat + "&numparticella=" + num;
    urlapi = encodeURI(urlapi.replace('0.', '.'))
    $.ajax({
        type: "get",
        url: urlapi,
        success: function(data){
            var geodata = jQuery.parseJSON(data);
            content = getdescription(data)
            titolo = 'particella ' + data["dcat"] + ' comune catastale' + data['codcc'] + ' - ' + data['dcat'] + ' nel comune di ' + data['comune'];
            var kml = tokml(geodata, {
                name: titolo,
                description: content
            });

            var blobkml = new Blob([kml],{type: "Content-type: application/vnd.google-earth.kml+xml"});
            saveAs(blobkml, "particella.kml");
		}
    });
  }

function popUp(f,l){
    var out = [];
    var message = '';
    if (f.properties){
            if('img' in f.properties) { 
               message += '<img src="www/photos/' + f.properties['img'] + '" style="width:200px"/>';
            } else {
                message = getdescription(f.properties);
                codcc = "" + f.properties["codcc"];
                num =  "" + f.properties["num"];
		        message += '<p><h3>download</h3> <a  href="#" onclick="downloadPart(' + codcc + ',' + num  + '); return false" alt="particella.geojson"><img src="www/images/geojson.png" width="64px"/></a>&nbsp;';
		        message += '<a  href="#" onclick="downloadPartKML(' + codcc + ',' + num  + '); return false" alt="particella.kml"><img src="www/images/kml.png" width="64px"/></a></span></p>'
                }
        l.bindPopup(message);
    }
}



formupload.fileinput({
    uploadUrl: "api/upload", // server upload action
    uploadAsync: true,
    maxFileCount: 1,
    language: "it"
});


formupload.on('fileuploaded', function(event, data, previewId, index) {
    var form = data.form, files = data.files, extra = data.extra, 
    response = data.response, reader = data.reader;
    photogeojson = L.geoJson(null,{onEachFeature:popUp,pointToLayer:drawCircle}).addTo(map);
    $('#uploadphoto').hide();
    $('.modal-backdrop').hide();
    try {
        if (response.features.length > 0) {
            if (lastphotoLayer != null) {
                lastphotoLayer.clearLayers();
            }
            photogeojson.addData(response);                
            photogeojson.openPopup();
            map.fitBounds(photogeojson.getBounds());   
            lastphotoLayer = photogeojson;
        }
    }
    catch(err) {
        $('#errorMessage').modal('show');
    }
});



function drawCircle (feature, latlng) {
	cerchio = L.circleMarker(latlng, {
		radius: 4,
		fillColor: "#ff7800",
		color: "#000",
		weight: 1,
		opacity: 1,
		fillOpacity: 0.8
	});
   return cerchio;
 }

function main() {
	var arcgisurl = 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
	arcgisattrib = 'ArcGIS Online Imagery';

	var mbsatelliteurl = 'https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiaGFzdCIsImEiOiJjaWZlemZzcXgwMGZidGprbnB2cDlhM2ZmIn0.tGGwfSOhjensuUsfMOIY7A';
	mbsatelliteattrib = 'Mapbox Satellite';   
    
	var mapboxUrl = 'http://{s}.tiles.mapbox.com/v3/tmcw.map-7s15q36b/{z}/{x}/{y}.png';
	mapboxAttrib = 'Mapbox - Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors' +
				'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
				'Imagery © <a href="http://mapbox.com">Mapbox</a>';
        var wmfurl = "https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png";
        var wmfattrib = "Wikimedia maps beta | Map data &copy; <a href='http://openstreetmap.org'>OpenStreetMap</a> contributors>";

        var hotosmurl = 'http://tile-{s}.openstreetmap.fr/hot/{z}/{x}/{y}.png';
        var hotosmattrib = '© <A href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>. Tiles courtesy of <a href="http://hot.openstreetmap.org/">Humanitarian OpenStreetMap Team</a>';

        var wmfmap = new L.TileLayer(wmfurl, {attribution: wmfattrib});
        var hotosm = new L.TileLayer(hotosmurl, {attribution: hotosmattrib});
	    var mapboxsatellite = new L.TileLayer(mbsatelliteurl, {attribution: mbsatelliteattrib});
	    var maparcgis = new L.TileLayer(arcgisurl, {attribution: arcgisattrib});
	    var mapbox = new L.TileLayer(mapboxUrl, {attribution: mapboxAttrib});
	    var trento = new L.LatLng(46.0725015,11.1194647); 
        var labelurl = "http://{s}.tile.stamen.com/toner-labels/{z}/{x}/{y}.png"
        var labelattrib = 'label by <a href="http://stamen.com/">Stamen</a> based on <a href="http://www.openstreetmap.org">OpenStreetMap</a> data'
        var labelmap = new L.TileLayer(labelurl, {attribution: labelattrib});
        var labelimagesarcgis = L.layerGroup([maparcgis,labelmap]);
        var labelimagesmapbox = L.layerGroup([mapboxsatellite,labelmap]);
        var catasto = new L.TileLayer("https://mobilekat.provincia.tn.it/Tiles/tileprovider.aspx?service=CATTN&zoom={z}&x={x}&y={y}&format=PNG&STRUCTURE=MBTILES&BACKGR=transparent&BACKGRFORMAT=PNG").setOpacity(0.5) ;

       
	map = L.map('map', {
	    center: [46.0725015,11.1194647],
	    zoom: 9,
	    layers: [hotosm],
            minZoom: 9,
            maxZoom: 18,
            doubleClickZoom: true 
    });   
	     						
    var baseMaps = {
            "foto aerea (esri)": labelimagesarcgis,
            "foto aerea (mapbox)": labelimagesmapbox,
            "mappa openstreetmap": hotosm
     };

     var redStyle = {
            "color": "#ff0000",
            "weight": 4,
            fillOpacity: 0
      };

        var trentinoborder = L.geoJson(trentino, { style: redStyle}).addTo(map)
 	    map.fitBounds(trentinoborder.getBounds());
        map.setMaxBounds(trentinoborder.getBounds());
        var overlayMaps = {
               "provincia autonoma di Trento": trentinoborder,
               "catasto trentino": catasto
        };	  

	L.control.coordinates({
		position:"topright",
		labelTemplateLat:"Latitude: {y}",
		labelTemplateLng:"Longitude: {x}"
	}).addTo(map);

	L.control.layers(baseMaps, overlayMaps).addTo(map); 
    L.control.scale().addTo(map);
/*
    var optspinner = {
      lines: 11 // The number of lines to draw
    , length: 27 // The length of each line
    , width: 10 // The line thickness
    , radius: 22 // The radius of the inner circle
    , scale: 1.25 // Scales overall size of the spinner
    , corners: 1 // Corner roundness (0..1)
    , color: '#000' // #rgb or #rrggbb or array of colors
    , opacity: 0.45 // Opacity of the lines
    , rotate: 39 // The rotation offset
    , direction: -1 // 1: clockwise, -1: counterclockwise
    , speed: 1.3 // Rounds per second
    , trail: 40 // Afterglow percentage
    , fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
    , zIndex: 2e9 // The z-index (defaults to 2000000000)
    , className: 'spinner' // The CSS class to assign to the spinner
    , top: '50%' // Top position relative to parent
    , left: '50%' // Left position relative to parent
    , shadow: true // Whether to render a shadow
    , hwaccel: true // Whether to use hardware acceleration
    , position: 'absolute' // Element positioning
    }
    target = document.getElementById('map');
    spinner = new Spinner(optspinner).spin(target);
    spinner.stop();
*/
    var geojsonLayer = L.geoJson(null,{onEachFeature:popUp}).addTo(map);

    photogeojson = L.geoJson(null,{onEachFeature:popUp,pointToLayer:drawCircle}).addTo(map); 
   
    function onMapClick(e) {
	if (viewparcel == 1) {
                map.spin(true);
        	lat = e.latlng.lat;
        	lon = e.latlng.lng;
        	try {
         	   	map.removeLayer(lastgeojsonLayer);
            		map.removeLayer(photogeojson);
        	}	
        	catch(err) {}
         		/*document.getElementById('map').style.cursor = 'progress';*/
			var geojsonLayer = L.geoJson(null,{onEachFeature:popUp}).addTo(map);
         		geojsonLayer.fire('data:loading');
         		$.getJSON("api/particella/"+lat+"/"+lon, function (data) {
                	geojsonLayer.fire('data:loaded');
                	geojsonLayer.addData(data);
                	map.fitBounds(geojsonLayer.getBounds());
                	geojsonLayer.openPopup();
         		/*document.getElementById('map').style.cursor = '';*/
            	});
                /*spinner.stop();*/
		map.spin(false);
     	   	lastgeojsonLayer = geojsonLayer;
        	lastgeojsonLayer.openPopup();
	}
    }
    var miniMap = new L.Control.MiniMap(mapbox, { toggleDisplay: true, minimized: true }).addTo(map);
	
   /* map.doubleClickZoom.disable(); */
    map.on('click',onMapClick);


    var hash = new L.Hash(map);
    lc = L.control.locate({
        follow: false,
        strings: {
            title: "Mostra dove sono"
        }
    }).addTo(map);

    new L.Control.GeoSearch({
        provider: new L.GeoSearch.Provider.OpenStreetMap(),
        showMarker: true,
        retainZoomLevel: false,
        
    }).addTo(map);

    var landparcel = L.easyButton('fa-binoculars', function(btn, map){
	    $('#findlandparcel').modal('show')
    }).addTo(map);


    var toggle = L.easyButton({
      states: [{
        stateName: 'interroga',
        icon: 'fa-info',
        title: 'selezionando questa icona i clic sulla mappa serviranno ad interrogare le particelle catastali',
        onClick: function(control) {
	    viewparcel = 1	
	    control.state('fine');
        }
      }, {
        icon: 'fa-info-circle',
        stateName: 'fine',
        onClick: function(control) {
	    viewparcel = 0	
	    control.state('interroga');
        },
        title: 'smetti di interrogare le particelle catastali '
      }]
    });
    toggle.addTo(map);
/*
    measureOptions = { 
        position: 'topleft',
        primaryLengthUnit: 'meters', 
        secondaryLengthUnit: 'kilometers',
        primaryAreaUnit: 'acres', 
        secondaryAreaUnit: 'hectares',
        localization: 'it',
        activeColor: '#FF0000',
        completedColor: '#FF6600'      
    }

    var measureControl = L.control.measure(measureOptions);
    measureControl.addTo(map);
*/
    $('#cadastries').typeahead({
            ajax: 'api/comune/catastale/lista',
            display: 'nome',
            val: 'id'
    }); 

    $("#formparcel").submit(function(e){
                idcomune = $('#cadastries').val().split(" -")[0];
                numparticella = $('#numparcel').val();
                var formdata = {};
                formdata["idcomune"] = idcomune;
                formdata["numparticella"] = numparticella;
                var urlapi = "api/trovaparticella";
                $.ajax({
                    type: "get",
                    url: urlapi,
                    data: formdata,
                    success: function(data){
                            var geojsonLayer = L.geoJson(null,{onEachFeature:popUp}).addTo(map);
                            $('#findlandparcel').modal('hide');
                        	try {
                         	   	map.removeLayer(lastgeojsonLayer);
                            		map.removeLayer(photogeojson);
                        	}	
                        	catch(err) {}
				try {
					map.spin(true);
             		            	document.getElementById('map').style.cursor = 'progress';
                                	geodata = jQuery.parseJSON(data);
                                	geojsonLayer = L.geoJson(geodata,{onEachFeature:popUp}).addTo(map);
                                	map.fitBounds(geojsonLayer.getBounds());
                    	        	geojsonLayer.openPopup();
             		            	document.getElementById('map').style.cursor = '';
					map.spin(false);
                         	    	lastgeojsonLayer = geojsonLayer;
                            		lastgeojsonLayer.openPopup();
				}
				catch(err) { 
                        $('#errorMessage').modal('show'); 
                            document.getElementById('map').style.cursor = '';                        
                            
                        }
                },
                        error: function(){
        			$('#errorMessage').modal('show');
                        }
                });

            });

/*
    $(document).ready(function(){
        var margin = 78;
        $('#map').on('mousedown',function(){
            $('#navBar').css('margin-top',margin+'px');
        });  
        $('#map').blur(function(){
            margin = margin+78;
        }); 
    });
*/

}





