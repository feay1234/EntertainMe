// Initial variables
var key = "b4YbDG1AmDjaOGJbt2EdAS8kbziufur0";
var database = "entertainme";
var user_collection = "User";
var log_collection = "Log";

// Register.html
// Login.html << Facebook
function validateUsername(unique, mode){
	var query = ""
	if(mode == "facebook"){
		query = "q={'id': '"+unique+"'}&"
	}
	else{
		query = "q={'username': '"+unique+"'}&"
	}
	
	return $.ajax( { url: "https://api.mongolab.com/api/1/databases/"+database+"/collections/"+user_collection+"?"+query+"apiKey="+key,
			  type: "GET",
			  contentType: "application/json"
            });  

}
// Login.html
function login(username, password){
	var query = "q={'username': '"+username+"', 'password': '"+password+"'}&"
	return $.ajax( { url: "https://api.mongolab.com/api/1/databases/"+database+"/collections/"+user_collection+"?"+query+"apiKey="+key,
			  type: "GET",
			  contentType: "application/json"
            });  
}

// get mongodb id
function getID(username){
 	 var query = "q={'$or':[{'username': '"+username+"'},{'id': '"+username+"'}]}&,"
 	return 	$.ajax( { url: "https://api.mongolab.com/api/1/databases/"+database+"/collections/"+user_collection+"?"+query+"&fo=true&f={'_id': 1}&apiKey="+key,
 	 			  type: "GET",
 	 			  contentType: "application/json"
 	             }); 
 	 }

// Register.html
function createNewUser(username, email, password){
	return $.ajax( { url: "https://api.mongolab.com/api/1/databases/"+database+"/collections/"+user_collection+"?apiKey="+key,
			  data: JSON.stringify( { 	"username" : username,
			  							"email" : email,
			  							"password" : password,
			  							"favorite" : [],
			  							"facebook_account" : "false",
			  							"first_time" : "true" } ),
			  type: "POST",
			  contentType: "application/json"
            });             

 }


// Login << Facebook
function createNewFBUser(id, username){
	return $.ajax( { url: "https://api.mongolab.com/api/1/databases/"+database+"/collections/"+user_collection+"?apiKey="+key,
			  data: JSON.stringify( { 	"username" : username,
			  							"id" : id,
			  							"favorite" : [],
			  							"facebook_account" : "yes",
			  							"first_time" : "false" } ),
			  type: "POST",
			  contentType: "application/json"
            });             

 }

 function createUserLog(id){
	$.ajax( { url: "https://api.mongolab.com/api/1/databases/"+database+"/collections/"+log_collection+"?apiKey="+key,
				  data: JSON.stringify( { 	"user_id" : id,
				  							"behaviour" : [] }),
				  type: "POST",
				  contentType: "application/json"
	            });   
}

function checkFirstTime(username){
 	var query = "q={'username': '"+username+"'}&"
	return $.ajax( { url: "https://api.mongolab.com/api/1/databases/"+database+"/collections/"+user_collection+"?"+query+"apiKey="+key,
			  type: "GET",
			  contentType: "application/json",
			  success: function (result) {
                return result;
             }
            }); 
 }

function addFavorite(list, id){
 	var input = JSON.parse('{"favorite": []}');
 	for (var i = 0; i < list.length; i++) {
 	    input.favorite.push({category: list[i], priority: 5});
 	}
 	query = "q={'username': '"+id+"'}";
 	$.ajax( { url: "https://api.mongolab.com/api/1/databases/"+database+"/collections/"+user_collection+"?"+query+"&apiKey="+key,
			  data: JSON.stringify( { "$set" : { "favorite" : input.favorite } } ),
			  type: "PUT",
			  contentType: "application/json",
			  success: function (result) {
			  	// redirect to index.html
			  	window.location.replace("index.html");

             }
            });    
}

// add user behaviour to the database
// click event increments 1 point, more detail event increament 2 points
function insertLogBehaviour(user_id, action, venue_category, weight){
	
  	query = "q={'behaviour.venue_category': '"+venue_category+"'}";
  	$.ajax( { url: "https://api.mongolab.com/api/1/databases/"+database+"/collections/"+log_collection+"?"+query+"&apiKey="+key,
 			  data: JSON.stringify({ "$inc" : {"behaviour.$.count" : weight}, "$set" :{"behaviour.$.latest_datetimed" : new Date}}),
 			  type: "PUT",
 			  contentType: "application/json",
 			  success: function (result) {
 			  	// the venue category has not been registered yet.
 			  	if(result.n == 0){
 			  			// add new venue category
 			  		 	query = "q={'user_id': '"+user_id+"'}";
 			  		 	$.ajax( { url: "https://api.mongolab.com/api/1/databases/"+database+"/collections/"+log_collection+"?"+query+"&apiKey="+key,
 			  					  data: JSON.stringify( { "$push" : { "behaviour" : {
 			  					  														"action": action,
 			  					  														"venue_category": venue_category,
 			  					  														"latest_datetime": new Date(),
 			  					  														"count": 1} } } ),
 			  					  type: "PUT",
 			  					  contentType: "application/json",
 			  					  success: function (result) {
 			  					  	// redirect to index.html

 			  		             }
 			  		            }); 
 			  	}
              }
     }); 
}	

function getLogBehaviour(_id){
	var query = "q={'user_id' : '"+_id+"'}&"
	return $.ajax( { url: "https://api.mongolab.com/api/1/databases/"+database+"/collections/"+log_collection+"?"+query+"fo=true&apiKey="+key,
			  type: "GET",
			  contentType: "application/json"
	        }); 
}

function getUserFavorite(username){
	var query = "q={'username' : '"+username+"'}&"
	return $.ajax( { url: "https://api.mongolab.com/api/1/databases/"+database+"/collections/"+user_collection+"?"+query+"fo=true&apiKey="+key,
			  type: "GET",
			  contentType: "application/json"
	        }); 
}


