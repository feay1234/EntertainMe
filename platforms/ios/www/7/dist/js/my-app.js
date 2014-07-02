document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
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


    // Initialize app and store it to myApp variable for futher access to its methods
    var myApp = new Framework7();
    var map;
    // We need to use custom DOM library, let's save it to $$ variable:
    var $$ = Framework7.$;
     
    // Add view
    var mainView = myApp.addView('.view-main', {
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
        // myApp.alert('Here comes About page');
      }
      else if (page.name == 'home') {

          

          $$('#tab1').on('show', function () {
              map.setVisible(true)
              // myApp.alert('Tab 1 is visible');

          });
           
          $$('#tab2').on('show', function () {
              // myApp.alert('Tab 2 is visible');
              map.setVisible(false)
          });
           
          $$('#tab3').on('show', function () {
              // myApp.alert('Tab 3 is visible');
              map.setVisible(false)
          });   

      }
      else if (page.name === 'profile') {
        // Following code will be executed for page with data-page attribute equal to "about"
        // myApp.alert('Here comes About page');
      }
      else if (page.name === 'register') {
        // Following code will be executed for page with data-page attribute equal to "about"
        // myApp.alert('Here comes About page');
      }
    })




    // // Initialize View          
    // var mainView = myApp.addView('.view-main')          


    myApp.onPageAfterAnimation('home', function(){
        var div = document.getElementById('map_canvas');
        map = plugin.google.maps.Map.getMap(div);
        map.addEventListener(plugin.google.maps.event.MAP_READY, function(map)
        {        
            // The map is initialized, then show a map dialog
            $$('.panel-right').on('opened', function () {
                $(".media-list").hide();
                map.refreshLayout();
            });
            $$('.panel-right').on('close', function () {
                $(".media-list").hide();
                map.setVisible(false)
            });
            $$('.panel-right').on('open', function () {
                $(".media-list").hide();
                map.setVisible(false)
            });
            $$('.panel-right').on('closed', function () {
                // $(".media-list").show();
                map.refreshLayout();
            }); 

        });

        var onSuccess = function(position) {
                // initiate google map
                var user_location = new plugin.google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                map.setMyLocationEnabled(true);

                map.animateCamera({
                  'target': user_location,
                  'bearing': 140,
                  'zoom': 12,
                  'duration': 2000,
                });
                map.setCenter(user_location);

                var lat = position.coords.latitude;
                var lng = position.coords.longitude;
                // Ranking
                $.ajax({ type: "GET",   
                        // &sortByDistance=1&openNow=1
                         url: "https://api.foursquare.com/v2/venues/explore?ll="+lat+","+lng+"&venuePhotos=1"+
                                    "&client_id=5VBHVYNQEJXS1K0MK0YW4NTXBJCCT3VGNMOX0WVCLQZDR1FC&"+
                                    "client_secret=HSL2BVQRIGCUSMZ51EXIP1JXEWITIAI5SPGKQ0GAKGI12RD5&v=20140605",   
                         dataType: "json",
                         success : function(result)
                         {
                            result = result.response.groups[0].items;

                            // alert(JSON.stringify(result[0]));
                            // alert(mode);
                            // createVenueCard(result[0].venue, result[0].tips, 0,0,0)
                            if (mode == "facebook") {
                                // Ranking with Facebook Likes by Levenshtein Distance.
                                for(var i = 0; i < result.length; i++){
                                    var venue_category = result[i].venue.categories[0].name
                                    var min_score = 9007199254740992;
                                    for(var j = 0; j < user_likes.data.length; j++){
                                        var like_category = user_likes.data[j].category;
                                        var score = new Levenshtein(like_category, venue_category);
                                        if(score < min_score){
                                            min_score = score;
                                        }
                                    }
                                    // alert(min_score);
                                    // minimum score / (rate * checkin)
                                    var rating = result[i].venue.rating;
                                    var checkin = result[i].venue.stats.checkinsCount;
                                    var venue = {"object": result[i], "scoreFB": min_score, "scoreBH": 0};
                                    venues.push(venue);
                                    // alert(venues)


                                }

                                // alert(JSON.stringify(venues));
                                // Sort venues by minimum score
                                for(var i = 0; i < venues.length; i++){
                                    createVenueCard(venues[i].object.venue, venues[i].object.tips,venues[i].scoreFB, venues[i].scoreBH, i);
                                }
                                // venues.sort(compareFB);
                                // alert("1")
                                // // Cut off 50% of the result as it is unlikeyly relevant to user interests. 
                                // var half_length = Math.ceil(venues.length / 2);
                                // alert("2")
                                // venues = venues.splice(0,half_length);
                                // alert('check cenue')
                                // alert(venues.length);
                                // rankByBehaviour(_id, venues);

                            }
                            else{

                            }
                            



                         },
                         error: function(XMLHttpRequest, textStatus, errorThrown) { 
                             alert(XMLHttpRequest+" "+textStatus+" "+errorThrown);
                             alert("Foursquare API fails to response");
                         } 
                });

            };

            // onError Callback receives a PositionError object
            //
            function onError(error) {
                alert('code: '    + error.code    + '\n' +
                        'message: ' + error.message + '\n');
            }

            navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }) 


    var fbLoginSuccess = function (userData) {
        alert("UserInfo: " + JSON.stringify(userData));
        facebookConnectPlugin.getAccessToken(function(token) {
            alert("Token: " + token);
        }, function(err) {
            alert("Could not get access token: " + err);
        });
    }

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
                              // getVenues(lat,lng, "facebook");
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
            getUserData();
            
        },
        function (response) { 
            // No Facebook Access Token
            // Do nothing
            gotoLogin();
        }
    );

}


