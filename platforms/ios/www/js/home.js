var map;

function initCardListener(){
	$(".card").click(function(){
		alert($(this).attr("venue-id"))
	    map.setVisible(false);
	    $("#main-content").hide(); 
	    $("#backBtn").show();  

	    // More detail JS

	})
}
function init() {
	document.addEventListener("deviceready", onDeviceReady, false);

	initCardListener();

	$("#backBtn").click(function(){
		$("#backBtn").hide();
		$("#main-content").show();   
		map.setVisible(true);
		$(".name").text("dlkjf")
	})

	$("#backBtn").hide();
	
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



