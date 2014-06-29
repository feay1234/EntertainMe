var map;

function initCardListener(){
	$(".card").click(function(){
		var venue_id = $(this).attr("venue-id");

		// animation
	    map.setVisible(false);
	    $("#main-content").hide(); 
	    $("#backBtn").show();  
	    $("#detail-content").show();

	    // More detail JS
	    $("#name1").text(venue_id);

	})
}
function init() {
	document.addEventListener("deviceready", onDeviceReady, false);

	initCardListener();

	$("#backBtn").click(function(){
		$("#backBtn").hide();
		$("#detail-content").hide();
		$("#main-content").show();   
		map.setVisible(true);
	})

	$("#backBtn").hide();
    $("#detail-content").hide();

	
}




function onDeviceReady() {

	var div = document.getElementById('map_canvas');
	map = plugin.google.maps.Map.getMap(div);
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
			$("#detail-content").show();
			map.setVisible(true);
			$("#main-content").show(); 

		}
		else{
			$("#main-content").hide();
			$("#backBtn").hide();  
			map.setVisible(false);
			// Profile JS here.

		}

		initCardListener();
		
	}

	window.addEventListener('push', test);

	
}



