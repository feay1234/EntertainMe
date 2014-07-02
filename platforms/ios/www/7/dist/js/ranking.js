function createVenueCard(venue, tips, scoreFB, scoreBH, i){
    var id = venue.id;
    var name = venue.name;
    var lat = venue.location.lat;
    var lng = venue.location.lng;
    var distance = venue.location.distance;
    var category = venue.categories[0].name;
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
    
    $("#venues_list").append("<li>"+
                                  "<a id="+id+" href='detail.html' class='item-link item-content'>"+
                                    "<div class='item-media'><img src='"+photo+"' width='50'></div>"+
                                    "<div class='item-inner'>"+
                                        "<div class='item-title-row'>"+
                                                    "<div class='item-title'>"+name+"</div>"+
                                                  "</div>"+
                                                  "<div class='item-subtitle'>"+category+"</div>"+
                                    "</div>"+
                                  "</a>"+
                            "</li>"  );


    

    // $("#"+id).click(function(){
    //     // alert($(this).attr("id"))


    //     // logging function
    //     insertLogBehaviour(_id, "select venue", category, 1);


    //     var venue_location = new plugin.google.maps.LatLng(lat,lng);


    //     map.animateCamera({
    //       'target': venue_location,
    //       'tilt': 60,
    //       'zoom': 18,
    //       'bearing': 140,
    //       'duration': 1000
    //     }, function() {
          
    //     });
    //     venue_marker.showInfoWindow();
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

function rankByBehaviour(_id, venues){
    //  Ranking Venues by Logging process.
    getLogBehaviour(_id)
    .done(function(result){
        
        user_behaviour = result.behaviour;
        alert(user_behaviour);
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
        alert("1")
        venues.sort(compareBH);
        alert("2")
        // loopVenues(venues);
        for(var i = 0; i < venues.length; i++){
            createVenueCard(venues[i].object.venue, venues[i].object.tips,venues[i].scoreFB, venues[i].scoreBH, i);
        }
        alert("3")
        
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
        // loopVenues(venues);
    })
}