// initial variables

var _id; // mongolab id
var id; // facebook id
var username; // normal id
var name; // real name
var user_likes = "";
var user_behaviour = "";
var user_favorite = "";
var user_type;
var picture;
var is_FB_User;
var venues = [];
var mode = "facebook";
var map;
var mainView;

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    


    // Initialize app and store it to myApp variable for futher access to its methods
    var myApp = new Framework7();
    
    // We need to use custom DOM library, let's save it to $$ variable:
    var $$ = Framework7.$;
     
    // Add view
    mainView = myApp.addView('.view-main', {
      // Because we want to use dynamic navbar, we need to enable it for this view:
      dynamicNavbar: true
    });
     
    // Now we need to run the code that will be executed only for About page.
    // For this case we need to add event listener for "pageInit" event
     
    // Option 1. Using one 'pageInit' event handler for all pages (recommended way):
    $$(document).on('pageInit', function (e) {
      // Get page data from event data
      var page = e.detail.page;
      
      if (page.name === 'detail') {
        map.setVisible(false)
        $(".media-list").hide();
        $(".back").click(function(){
              map.setVisible(true);
              $(".media-list").show();

        }) 
        // Following code will be executed for page with data-page attribute equal to "about"
      }
      else if (page.name == 'home') {
          $$('.open-about').on('click', function () {
            // map.setVisible(false);
            myApp.popup('.popup-about');
          });

          $$('.close-popup').on('click', function() {
            map.setVisible(true);

          })

          $$('.popup-about').on('open', function () {
            map.setVisible(false);
          });
          // $$('.popup-about').on('close', function () {
          // });

          $$('#mapTab').on('show', function () {
              map.setVisible(true)

          });
           
          $$('#profileTab').on('show', function () {
              map.setVisible(false)
          });
           
          $$('#friendTab').on('show', function () {
              map.setVisible(false)

          });   

          $$('.popup-about').on('opened', function () {
              
          });

      }
      else if (page.name === 'profile') {
        // Following code will be executed for page with data-page attribute equal to "about"
      }
      else if (page.name === 'register') {
        // Following code will be executed for page with data-page attribute equal to "about"
      }
      else if (page.name == 'chat'){
          var page = e.detail.page;
          $("#name").text(page.query.name);
      }
      else if (page.name == 'invite'){
        map.setVisible(false);
        // alert(page.query.venue_id);
      }
    })

    



    // // Initialize View          
    // var mainView = myApp.addView('.view-main')          

    var first_time = true;

    myApp.onPageAfterAnimation('home', function(){
        if(first_time){
            first_time = false;
            var div = document.getElementById('map_canvas');
            map = plugin.google.maps.Map.getMap(div);
            map.addEventListener(plugin.google.maps.event.MAP_READY, function(map)
            {        
                // The map is initialized, then show a map dialog
                // $$('.panel-right').on('opened', function () {
                //     $(".media-list").hide();
                //     map.refreshLayout();
                // });
                // $$('.panel-right').on('close', function () {
                //     $(".media-list").hide();
                //     map.setVisible(false)
                // });
                // $$('.panel-right').on('open', function () {
                //     $(".media-list").hide();
                //     map.setVisible(false)
                // });
                // $$('.panel-right').on('closed', function () {
                //     map.refreshLayout();
                // }); 

            });

            var onSuccess = function(position) {
                    // initiate google map
                    var lat = position.coords.latitude;
                    var lng = position.coords.longitude;
                    var user_location = new plugin.google.maps.LatLng(lat, lng);
                    map.setMyLocationEnabled(true);

                    map.animateCamera({
                      'target': user_location,
                      'bearing': 140,
                      'zoom': 12,
                      'duration': 2000,
                    });
                    map.setCenter(user_location);

                    getVenues(lat, lng);
                    

                };

                // onError Callback receives a PositionError object
                //
                function onError(error) {
                    alert('code: '    + error.code    + '\n' +
                            'message: ' + error.message + '\n');
                }

                navigator.geolocation.getCurrentPosition(onSuccess, onError);
      }
      else{
        map.setVisible(true);
      }
    }) 


    function getAuthentication(){
        mainView.loadPage('home.html');
        
    }

    function gotoLogin(){
        mainView.loadPage('login.html')
    }

    function getUserData(){
          // If Facebook User
          // get user likes
          facebookConnectPlugin.api( "me/likes?fields=category", ["user_likes"],
              function (response) { 
                  user_likes = response;
                  // get user info
                  facebookConnectPlugin.api( "me", ["basic_info"],
                      function (response) { 
                          
                          id = response.id;
                          name = response.name;

                          // MongoLabConnection.js
                          getID(id)
                          .done(function(result){
                              _id = result._id.$oid;
                              getAuthentication();
                          })
                          .fail(function(x){

                          })
                          
                          
                          
                          // get user picture
                          facebookConnectPlugin.api( "me/picture?type=large&redirect=false", ["basic_info"],
                              function (response) { 
                                  picture = response.data.url;
                              },
                              function (response) { 
                                  alert("Facebook Graph API fails") 
                              }); 
                      },
                      function (response) { 

                          alert("Facebook Graph API fails") 
                      }); 

              },
              function (response) { 
                  // Not Facebook User
                  // TODO add normal ranking system here.
                  // User Info Initiation is done at CheckCookie.js.
                  // getUserInfo();

                  // getLocation().then(
                  //     function (location) {

                  //          getVenues(location.lat, location.lng, "normal");
                  //     }, 
                  //     function (errorMessage) {
                  //     }); 
                  
              }); 
    }

    facebookConnectPlugin.getLoginStatus( 
        function (response) { 
            // Got Facebook Access Token
            // mainView.loadPage('home.html');
            getUserData();
            
        },
        function (response) { 
            // No Facebook Access Token
            // Do nothing
            gotoLogin();
        }
    );

}


