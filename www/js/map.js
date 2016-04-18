jQuery(document).ready(main)
var map;
var lastgeojsonLayer = null; 
var photogeojson = null;
var lastphotoLayer = null;
var lc = null;
var formupload =  $("#uploadfile")
var viewparcel = 0
function popUp(f,l){
    var out = [];
    var message = '';
    if (f.properties){
            if('img' in f.properties) { 
               message += '<img src="www/photos/' + f.properties['img'] + '" style="width:200px"/>';
            } else {
                message = '<p><h4>comune di ' + f.properties["comune"] + ' - codice ' + f.properties["comu"] + '</h4>';
                message += "<h5>comune catastale di " + f.properties["dcat"] + " - codice " + f.properties["codcc"] + "</h5>";
                message += '<h2>particella catastale ' + f.properties["num"] + '</h2>';
                message += '<br/>';
                message += '<table>';
                tipop = "";
                if  (f.properties["tipop"] == "P") {
                    tipop = "principale"
                } else if (f.properties["tipop"] == "C") {
                    tipop = "pertinenza"
                }
                if (tipop != "") {
                    message += '<tr>';
                    message += '<td>tipo:</td><td>'+ tipop  + '</td>';
                    message += '</tr>';
                }

                fab = ""
                if  (f.properties["fab"] == "S") {
                    fab = "sì"
                } else if (f.properties["fab"] == "N") {
                    fab = "no"
                }
                if (fab != "") {
                    message += '<tr>';
                    message += '<td>fabbricabile: </td><td>'+ fab  + '</td>'
                    message += '</tr>';
                }
                if (f.properties["dsup_sopra"] != "") {
                    message += '<tr>';
                    message += '<td>numero particelle diritto superficie sopra il suolo:</td><td>'+ f.properties["dsup_sopra"]  + '</td>';
                    message += '</tr>';
                }

                if (f.properties["dsup_sotto"] != "") {
                    message += '<tr>';
                    message += '<td>numero particelle diritto superficie sotto il suolo:</td><td>'+ f.properties["dsup_sotto"]  + '</td>';
                    message += '</tr>';
                }

                message += '<tr>';
                message += '<td>area:</td><td>'+ Math.round(f.properties["area"]).toLocaleString()  + ' mq</td>';
                message += '</tr>';
                message += '<tr>';
                message += '<td>perimetro:</td><td>'+ Math.round(f.properties["perimeter"]).toLocaleString()  + ' m</td>';
                message += '</tr>';
                message += '</table>';
                message += '</p>';
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
    giacomo = response;
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
        console.log(err)
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
        var wmfurl = "https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png"
        var wmfattrib = "Wikimedia maps beta | Map data &copy; <a href='http://openstreetmap.org'>OpenStreetMap</a> contributors>"

        var hotosmurl = 'http://tile-{s}.openstreetmap.fr/hot/{z}/{x}/{y}.png'
        var hotosmattrib = '© <A href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>. Tiles courtesy of <a href="http://hot.openstreetmap.org/">Humanitarian OpenStreetMap Team</a>'


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

	L.control.layers(baseMaps, overlayMaps).addTo(map); 
    L.control.scale().addTo(map);


    var geojsonLayer = L.geoJson(null,{onEachFeature:popUp}).addTo(map);
    photogeojson = L.geoJson(null,{onEachFeature:popUp,pointToLayer:drawCircle}).addTo(map); 
   
    function onMapClick(e) {
	if (viewparcel == 1) {
        	lat = e.latlng.lat;
        	lon = e.latlng.lng;
        	try {
         	   	map.removeLayer(lastgeojsonLayer);
            		map.removeLayer(photogeojson);
        	}	
        	catch(err) {}
         		document.getElementById('map').style.cursor = 'progress';
			var geojsonLayer = L.geoJson(null,{onEachFeature:popUp}).addTo(map);
         		geojsonLayer.fire('data:loading');
         		$.getJSON("api/particella/"+lat+"/"+lon, function (data) {
                	geojsonLayer.fire('data:loaded');
                	geojsonLayer.addData(data);
                	map.fitBounds(geojsonLayer.getBounds());
                	geojsonLayer.openPopup();
         		document.getElementById('map').style.cursor = '';
            	});

     	   	lastgeojsonLayer = geojsonLayer;
        	lastgeojsonLayer.openPopup();
	}
    }
    var miniMap = new L.Control.MiniMap(mapbox, { toggleDisplay: true }).addTo(map);
	
    map.doubleClickZoom.disable(); 
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

var toggle = L.easyButton({
  states: [{
    stateName: 'interroga',
    icon: 'fa-info',
    title: 'selezioando questa icona i clic sulla mappa serviranno ad interrogare le particelle catastali',
    onClick: function(control) {
	viewparcel = 1	
	control.state('fine');
	console.log('quiiii');
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

}



