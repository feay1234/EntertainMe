// var map;
// function initialize() {
//   var mapOptions = {
//     zoom: 12,
//   }
//   map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
// }
// google.maps.event.addDomListener(window, 'load', initialize);
var map;
var lat;
var lng;
function initialize() {
  var mapOptions = {
    zoom: 14
  };
  map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);

  // Try HTML5 geolocation
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {

      lat = position.coords.latitude;
      lng = position.coords.longitude;
      var pos = new google.maps.LatLng(lat, lng);
      
      var infowindow = new google.maps.InfoWindow({
        map: map,
        position: pos,
        content: 'You are here!'
      });

      map.setCenter(pos);
    }, function() {

      getVenues(55.8333,-4.2500);
      var infowindow = new google.maps.InfoWindow({
        map: map,
        position: pos,
        content: 'You are here!'
      });

      map.setCenter(pos);
      
      handleNoGeolocation(true);
    });
  } else {
    // Browser doesn't support Geolocation

    handleNoGeolocation(false);
  }
}

function handleNoGeolocation(errorFlag) {
  if (errorFlag) {
    var content = 'Error: The Geolocation service failed.';
  } else {
    var content = 'Error: Your browser doesn\'t support geolocation.';
  }

  var options = {
    map: map,
    position: new google.maps.LatLng(60, 105),
    content: content
  };

  var infowindow = new google.maps.InfoWindow(options);
  map.setCenter(options.position);
}

google.maps.event.addDomListener(window, 'load', initialize);
