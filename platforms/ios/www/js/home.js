function init() {
	document.addEventListener("deviceready", onDeviceReady, false);
}


function onDeviceReady() {
//	startRatchet();
	var current_page = "home";
	var div = document.getElementById('map_canvas');
	var map = plugin.google.maps.Map.getMap(div);
	map.on(plugin.google.maps.event.MAP_READY, function() {
	  
	  map.addMarker({
	    'position': new plugin.google.maps.LatLng(0, 0),
	    'title': ["Hello Google Map", "for", "Apache Cordova!"].join("\n"),
	    'snippet': "This plugin is awesome!"
	  }, function(marker) {
	    marker.showInfoWindow();
	  });
	  
	});

	function getPageName(url) {
	    var index = url.lastIndexOf("/") + 1;
	    var filenameWithExtension = url.substr(index);
	    var filename = filenameWithExtension.split(".")[0]; // <-- added this line
	    return filename;                                    // <-- added this line
	}

	function test(){

		var url = window.location.pathname;
		if( getPageName(url) == "home"){
			map.setVisible(true);
		}
		else{
			map.setVisible(false);
		}
		
	}

	window.addEventListener('push', test);

}



