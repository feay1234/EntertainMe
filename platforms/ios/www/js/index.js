/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */



              
                
                
                  
                  
                
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
    var photo = venue.photos.groups[0].items[0].prefix+"64x64"+venue.photos.groups[0].items[0].suffix;

    var tip;
    if(tips.length > 0){
        tip = tips[0].text;
    }
    $("#venues-list").append("<li class='table-view-cell media'>"+
                                "<a class='navigate-right venues'>"+
                                "<img class='media-object pull-left' src='"+photo+"'>"+
                                "<div class='media-body'>"+name+
                                "<p>Lorem ipsum dolor sit amet, consectetur.</p>"+
                                "</div>"+
                                "</a>"+
                             "</li>"   )

    $(".venues").click(function(){
                map.setVisible(false);
                current_page.hide();
                $("#detail-content").show();
                current_page = $("#detail-content");
          })
    // $("#venues-list").append("<div id='"+id+"' venue_category='"+category+"' class='box box-solid card'>"+
    //                         "<ul class='media-list'>"+
    //                           "<li class='media'>"+
    //                             "<a class='pull-left' href='#'>"+
    //                               "<img class='media-object' src='"+photo+"' height='100' width='100'>"+
    //                             "</a>"+
    //                             "<div class='media-body'>"+
    //                               "<h4 class='media-heading'>"+name+"</h4>"+
    //                               "<p>"+category+" "+i+"</p>"+
    //                               "<p> FB score: "+scoreFB+"</p>"+
    //                               "<p> BH score: "+scoreBH+"</p>"+
    //                               // "<p>"+tip+"</p>"+
    //                               "<span class='label label-primary'>Check-in "+checkinsCount+"</span>"+
    //                               "<span class='label label-success'>Rate "+rating+"/10</span>"+
    //                             "</div>"+
    //                           "</li>"+
    //                         "</ul>"+
    //                     "</div>");
    // add marker to the map
    // var myLatlng2 = new google.maps.LatLng(lat,lng);
    // var marker = new google.maps.Marker({
    //                                       position: myLatlng2,
    //                                       map: map,
    //                                       icon: category_icon
    //                                     });

    // var contentString = "<ul class='media-list'>"+
    //                       "<li class='media'>"+
    //                         "<a class='pull-left' href='#'>"+
    //                           "<img class='media-object' src='"+photo+"' height='100' width='100'>"+
    //                         "</a>"+
    //                         "<div class='media-body'>"+
    //                           "<h4 class='media-heading'>"+name+"</h4>"+
    //                           "<p>"+category+"</p>"+
    //                           "<ul class='list-inline'>"+
    //                             "<li>"+"<span class='glyphicon glyphicon-star'></span>"+"</li>"+
    //                             "<li>"+"<span class='glyphicon glyphicon-star'></span>"+"</li>"+
    //                           "</ul>"+
    //                           tip+
    //                           "<span class='label label-primary'>Check-in "+checkinsCount+"</span>"+
    //                         "</div>"+
    //                       "</li>"+
    //                     "</ul>";

    //   var infowindow = new google.maps.InfoWindow({
    //       content: contentString
    //   });

    //   google.maps.event.addListener(marker, 'click', function() {
    //     // Keep track the recently open window
    //     if( prev_infowindow ) {
    //        prev_infowindow.close();
    //     }

    //     prev_infowindow = infowindow;
    //     infowindow.open(map,marker);
      // });s
    
}

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        // app.receivedEvent('deviceready');
        var div = document.getElementById('map_canvas');
        var map = plugin.google.maps.Map.getMap(div);
        map.on(plugin.google.maps.event.MAP_READY, function() {

          // map.addMarker({
          //   'position': new plugin.google.maps.LatLng(0, 0),
          //   'title': ["Hello Google Map", "for", "Apache Cordova!"].join("\n"),
          //   'snippet': "This plugin is awesome!"
          // }, function(marker) {
          //   marker.showInfoWindow();
          // });

          var current_page = $("#home-content");
          var current_btn = $("#homeBtn");


          // onSuccess Callback
          //   This method accepts a `Position` object, which contains
          //   the current GPS coordinates
          //
        var onSuccess = function(position) {
            var user_location = new plugin.google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            map.animateCamera({
              'target': user_location,
              'tilt': 60,
              'bearing': 140
            });

            map.addMarker({
              'position': user_location,
              'title': ["Hello Google Map", "for", "Apache Cordova!"].join("\n"),
              'snippet': "This plugin is awesome!"
            }, function(marker) {
              marker.showInfoWindow();
            });

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

                        for(var i = 0; i < result.length; i++){
                            createVenueCard(result[i].venue, result[i].tips,0, 0, i);
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






          // Events
        $("#homeBtn").click(function(){
            map.setVisible(true);
            $("#home-content").show();
            current_page.hide();
            current_page = $("#home-content");
            $("#homeBtn").addClass("active")
            current_btn.removeClass("active");
            current_btn = $("#homeBtn");
        })
        $("#profileBtn").click(function(){
            map.setVisible(false);
            // $("#home-content").hide();
            current_page.hide();
            $("#profile-content").show();
            current_page = $("#profile-content");
            $("#profileBtn").addClass("active")
            current_btn.removeClass("active");
            current_btn = $("#profileBtn");
        })
          $(".venues").click(function(){
                map.setVisible(false);
                current_page.hide();
                $("#detail-content").show();
                current_page = $("#detail-content");
          })

        // Listen to Card Click event
        // Input: venue's ID
        // Update UI.
        $(document).on('click', '.venues', function(){
            alert("test")
            // var id = $(this).attr("id");
            // var venue_category = $(this).attr("venue_category");
            // insertLogBehaviour(_id, "select venue", venue_category, 1);
            // // getVenueFullDetail(id);
        })

    });




    }

};
