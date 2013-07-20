var osmUrl= 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
var osmAttrib= '';
var osm = new L.TileLayer(osmUrl, {minZoom: 11, maxZoom: 17, attribution: osmAttrib});

var map;
var arvores;
var recifeCoords = new L.LatLng(-8.05428, -34.8813);

function createMap(){
    map = new L.map('map');
    map.on('resize', function(){
        map.invalidateSize();
    });
    map.addLayer(osm);
    map.setView(recifeCoords, 12);

    $.get('db/arvores-tombadas.csv', function(data){
		data = $.csv.toArrays(data, {separator:";"});
		for(var j = 1; j < data.length; j++){
			var html = "Nome: " + data[j][0];
			html+= "<br>Nome Científico: " + data[j][3];
			html+= "<br>Família: " + data[j][2];
			html+= "<br>Endereço: " + replaceAll(data[j][5], "?", "-");
			html+= "<br><span style='color: #00F; text-decoration: underline;'>Saiba mais...</span>";
			var link = $('<a href="#pageInformation" data-arvore='+data[j][0]+'>'+html+'</a>').click(function() {
				var title = $(this).data('arvore');
				$('#treeName').html(title);
				for(var i = 0; i < arvores.length; i++)
					if(arvores[i].title == title){
						$('#treeDescription').html(arvores[i].description);
						break;
					}
			})[0];
			L.marker(new L.LatLng(parseFloat(data[j][12].replace(",", ".")), parseFloat(data[j][13].replace(",", ".")))).addTo(map).bindPopup(link);
			
		}
		map.invalidateSize();
    });

}


function replaceAll(string, token, newtoken) {
	while (string.indexOf(token) != -1) {
 		string = string.replace(token, newtoken);
	}
	return string;
}

$(document).on('pagebeforecreate', '#pageHome', function(e, data){
    $.mobile.loading('show');
});
$(document).on('pageinit', '#pageHome', function(e, data){
    createMap();
	$.getJSON('db/arvores.json', function(json){
		arvores = json;
	});
});