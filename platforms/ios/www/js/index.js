var map;
var current_page;
var current_btn;
function createVenueCard(venue, tips, scoreFB, scoreBH, i){
    var id = venue.id;
    var name = venue.name;
    var lat = venue.location.lat;
    var lng = venue.location.lng;
    var distance = venue.location.distance;
    var category = venue.categories[0].name
    var category_icon = venue.categories[0].icon.prefix+"bg_32"+venue.categories[0].icon.suffix;
    var rating = venue.rating;
    var checkinsCount = venue.stats.checkinsCount;
    var likes = venue.likes.count;
    var isOpen = venue.isOpen;
    var hereNow = venue.hereNow.count;
    var photo = venue.photos.groups[0].items[0].prefix+"50x50"+venue.photos.groups[0].items[0].suffix;

    var tip;
    if(tips.length > 0){
        tip = tips[0].text;
    }
    var venue_marker;
    $("#venues-list").append("<li class='table-view-cell media'>"+
                                "<a id='"+id+"'class='navigate-right venues'>"+
                                "<img class='media-object pull-left' src='"+photo+"'>"+
                                "<div class='media-body'>"+name+
                                "<p>"+category+" "+scoreFB+" "+scoreBH+"</p>"+
                                "<span class='badge badge-positive'>"+rating+"/10</span>"+
                                "<span class='badge badge-negative'>"+distance+" miles</span>"+
                                "<button class='btn'>"+
                                  "<span class='icon icon-search'></span>"+
                                  "Button"+
                                "</button>"+
                                "</div>"+
                                "</a>"+
                             "</li>"   )

    $("#"+id).click(function(){
        // alert($(this).attr("id"))


        // logging function
        insertLogBehaviour(_id, "select venue", category, 1);


        var venue_location = new plugin.google.maps.LatLng(lat,lng);


        map.animateCamera({
          'target': venue_location,
          'tilt': 60,
          'zoom': 18,
          'bearing': 140,
          'duration': 1000
        }, function() {
          
        });
        venue_marker.showInfoWindow();
    })

    // $(document).on('click', '.venues', function(){
    //     // map.setVisible(false);
    //     // current_page.hide();
    //     // $("#detail-content").show();
    //     // $("#backBtn").show();
    //     // current_page = $("#detail-content");
    //     var venue_location = new plugin.google.maps.LatLng(lat,lng);

    //     map.moveCamera({
    //       'target': venue_location,
    //       'zoom': 17,
    //       'tilt': 30
    //     }, function() {
          
    //     });
    //     // var id = $(this).attr("id");
    //     // var venue_category = $(this).attr("venue_category");
    //     // insertLogBehaviour(_id, "select venue", venue_category, 1);
    //     // // getVenueFullDetail(id);
    // })
    
    map.addMarker({
      'position': new plugin.google.maps.LatLng(lat, lng),
      'title': [distance+" meters away"].join("\n"),
      'snippet': "Click For More Detail",
      'icon': category_icon,
    }, function(marker) {
        venue_marker = marker;
        // venue_marker.showInfoWindow();
        venue_marker.addEventListener(plugin.google.maps.event.INFO_CLICK, function() {
            // alert("InfoWindow is clicked");
            insertLogBehaviour(_id, "select venue", category, 2);
            map.setVisible(false);
            current_page.hide();
            $("#detail-content").show();
            current_page = $("#detail-content");
        });
    });

    
    
}

function compareBH(a,b) {
    var aScore = a.scoreBH;
    var bScore = b.scoreBH;
    var aRate = a.object.venue.rating;
    var bRate = b.object.venue.rating;

    if (aScore < bScore) {
        return -1
    }
    else if(aScore > bScore){
        return 1;
    }
    else{
        if(aRate > bRate){
            return -1
        }
        else if(aRate < bRate){
            return 1;
        }
        else{
            return 0;
        }
    }
    return 0;
}

function compareFB(a,b) {
    var aScore = a.scoreFB;
    var bScore = b.scoreFB;

    if (aScore < bScore) {
        return -1
    }
    else if(aScore > bScore){
        return 1;
    }
    return 0;
}

function rankByBehaviour(){
    //  Ranking Venues by Logging process.
    getLogBehaviour(_id)
    .done(function(result){
        user_behaviour = result.behaviour;
        for (var i = venues.length - 1; i >= 0; i--) {
            var venue_category = venues[i].object.venue.categories[0].name;
            var notMatch = true;
            for (var j = user_behaviour.length - 1; j >= 0; j--) {

                var behaviour_category = user_behaviour[j].venue_category;
                if (behaviour_category == venue_category) {
                    var behaviour_datetime_score = (new Date() - new Date(user_behaviour[j].latest_datetime)) / (1000*60*60*24);
                    var behaviour_count = user_behaviour[j].count;
                    venues[i].scoreBH = behaviour_datetime_score / behaviour_count
                    notMatch = false;
                    
                    break;
                }

            };
            if (notMatch ) {
                
                venues[i].scoreBH = 9007199254740992;
            };
        };
        venues.sort(compareBH);
        // loopVenues(venues);
        for(var i = 0; i < venues.length; i++){
            createVenueCard(venues[i].object.venue, venues[i].object.tips,venues[i].scoreFB, venues[i].scoreBH, i);
        }
        
                        // start Backgroud Service
                        // document.addEventListener('deviceready', function() {
                        //     startService();
                        //     enableTimer();
                        //     setConfig()
                        //     getStatus();
                        // }, true);
    })
    .fail(function(){
        // Ranking with out user behaviour.
        alert("Fail to receive user behaviour from database.")
        loopVenues(venues);
    })
}


var app = {
    // Application Constructor
    initialize: function() {
            // app.receivedEvent('deviceready');
            $("#footer").show();
            var div = document.getElementById('map_canvas');
            map = plugin.google.maps.Map.getMap(div);
            map.on(plugin.google.maps.event.MAP_READY, function() {

              

            current_page = $("#home-content");
            current_btn = $("#homeBtn");

            var onSuccess = function(position) {
                // initiate google map
                var user_location = new plugin.google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                map.setMyLocationEnabled(true);

                map.animateCamera({
                  'target': user_location,
                  'bearing': 140,
                  'zoom': 16,
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
                            // alert(JSON.stringify(result));
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



                                }
                                // alert(JSON.stringify(venues));
                                // Sort venues by minimum score
                                venues.sort(compareFB);
                                // Cut off 50% of the result as it is unlikeyly relevant to user interests. 
                                var half_length = Math.ceil(venues.length / 2);    
                                venues = venues.splice(0,half_length);
                                rankByBehaviour();
                            }
                            else{

                            }
                            // alert(result.length);
                            



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

              // Events

            function change_page(page){
                if (page == "home") {
                    map.setVisible(true);
                }
                else{
                    map.setVisible(false);
                }
                $("#"+page+"-content").show();
                current_page.hide();
                current_page = $("#"+page+"-content");
                $("#"+page+"Btn").addClass("active")
                current_btn.removeClass("active");
                current_btn = $("#"+page+"Btn");
            }  
            $("#homeBtn").click(function(){
                change_page("home");
            })
            $("#profileBtn").click(function(){
                change_page("profile")
            })
            $("#favoriteBtn").click(function(){
                change_page("favorite");
            })
            $("#searchBtn").click(function(){
                change_page("search");
            })
            $("#settingBtn").click(function(){
                change_page("setting");
            })
            $("#backBtn").click(function(){
                $(this).hide();
                map.setVisible(true);
                $("#home-content").show();
                current_page.hide();
                current_page = $("#home-content");
                $("#homeBtn").addClass("active")
                current_btn = $("#homeBtn");

            })



        });

    }

};
