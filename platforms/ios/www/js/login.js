var FirebaseURL = 'https://entertainme.firebaseio.com/';
var entertainmeRef = new Firebase(FirebaseURL);
var usersRef = new Firebase(FirebaseURL+'users/');
var chatRef = new Firebase(FirebaseURL+'chat/room/')
var invitesRef = new Firebase(FirebaseURL+'invitations/')
// Check User Authentication
var auth = new FirebaseSimpleLogin(entertainmeRef, function(error, user) {
  if (error) {
    // an error occurred while attempting login
    console.log(error);
  } else if (user) {
    // user authenticated with Firebase
    // console.log('User ID: ' + user.uid + ', Provider: ' + user.provider);
    // alert("Get Authen "+user.uid)
    if (user.provider != "password") {
    	createSocialUser(user);
    };

    

  } else {
  	alert("Logout")
    // user is logged out or No Authentication.
    // Goto Login page.
    console.log("logout")
  }
});

function loginByFacebook(){
	auth.login('facebook', {
	  scope: 'email,user_likes',
	  rememberMe: true
	});
}

function loginByGoogle(){
	auth.login('google', {
	  rememberMe: true
	});
}
function loginByTwitter(){
	auth.login('twitter', {
		rememberMe: true
	});
}

function loginByPassword(){
	var email = $("#emailInput").val();
	var password = $("#passwordInput").val();
	auth.login('password', {
	  email: email,
	  password: password,
	  rememberMe: true
	});
}

function createEmailUser(username, user){
	var userRef = new Firebase(FirebaseURL+"users/"+user.uid);
	userRef.child('name').set(username);
    userRef.child('startedAt').set(Firebase.ServerValue.TIMESTAMP)
}

function createSocialUser(user){
	usersRef.once('value', function(dataSnaptshot){
		if (!dataSnaptshot.hasChild(user.uid)) {
			var userRef = usersRef.child(user.uid);
			userRef.child('name').set(user.displayName);
		    userRef.child('startedAt').set(Firebase.ServerValue.TIMESTAMP)
			// if(user.provider == "facebook"){

				// userRef.child('name').push(user.displayName);

				// $.getJSON('https://graph.facebook.com/'+ user.id +'/likes?access_token='+user.accessToken+'', function(data) {
			 //        console.log("Data Loaded: " + JSON.stringify(data));
			 //    });
			    
			// }
		}

	})
}

function register(){

	var email = $("#emailRInput").val();
	var password = $("#passwordRInput").val();
	var username = $("#usernameRInput").val();

	if (password.length >= 6) {
		auth.createUser(email, password, function(error, user) {
		  if (!error) {
		  	createEmailUser(username, user);
		    console.log('User Id: ' + user.uid + ', Email: ' + user.email);
		    location.replace("login.html")
		  }
		  else{
		  	console.log(error);
		  }
		});
	};
	
}

function sendFriendRequest(sender_uid, receiver_uid){
	var sender_requestRef = usersRef.child(sender_uid).child("requests").child(receiver_uid);
	sender_requestRef.update({role: "sender"});

	var receiver_requestRef = usersRef.child(receiver_uid).child("requests").child(sender_uid);
	receiver_requestRef.update({role: "receiver"})
}

function acceptFriendRequest(sender_uid, receiver_uid){
	// remove requests for both of them
	var sender_requestRef = usersRef.child(sender_uid).child("requests").child(receiver_uid);
	sender_requestRef.remove();

	var receiver_requestRef = usersRef.child(receiver_uid).child("requests").child(sender_uid);
	receiver_requestRef.remove();

	// create friends data
	var sender_friendRef = usersRef.child(sender_uid).child("friends").child(receiver_uid);
	var receiver_friendRef = usersRef.child(receiver_uid).child("friends").child(sender_uid);
	sender_friendRef.update({startedAt: Firebase.ServerValue.TIMESTAMP});
	receiver_friendRef.update({startedAt: Firebase.ServerValue.TIMESTAMP});

	// add chat_room name for both of them
	// var sender_chat_roomRef = usersRef.child(sender_uid).child("chat_room");
	// var receiver_chat_roomRef = usersRef.child(receiver_uid).child("chat_room");
	// sender_chat_roomRef.update({name: sender_uid+"__"+receiver_uid});
	// receiver_chat_roomRef.update({name: sender_uid+"__"+receiver_uid});

	// create chat_room for them
	var room = chatRef.push({startedAt: Firebase.ServerValue.TIMESTAMP});
	// add people to the chat room
	room.child("people").child(sender_uid).set({name: "test"});
	room.child("people").child(receiver_uid).set({name: "test2"});

	// add room_name to them
	usersRef.child(sender_uid).child("chat_room").push({room_id: room.name()});
	usersRef.child(receiver_uid).child("chat_room").push({room_id: room.name()});

	console.log("add friends success")

}

// input : sender's uid, name, picture and chat_room name

function sendMessage(sender_uid, sender_name, msg, room_id){
	var chat_roomRef = chatRef.child(room_id).child("messages");
	chat_roomRef.push({uid: sender_uid, name: sender_name, message: msg, read: "unread",datetime: Firebase.ServerValue.TIMESTAMP});
}

// 
function getMessages(room_id){
	var chat_roomRef = chatRef.child(room_id).child("messages");
	chat_roomRef.once('value', function(messages){
		messages.forEach(function(message) {

			var uid = message.child('uid').val();
			var name = message.child('name').val();
			var datetime = message.child('datetime').val();
			console.log(uid);
		});
	})
}

function sendInvitation(sender_uid, people, msg, venue_id){
	
	// create invitation
	var invite = invitesRef.push({sender: {uid: sender_uid},
							 sentAt: Firebase.ServerValue.TIMESTAMP,
							 venue: { id: venue_id},
							 message: msg})

	// add people to invitation and send invitation to people.
	for (var i = people.length - 1; i >= 0; i--) {
		var person = people[i];
		invite.child("people").child(person.uid).set({name: person.name, accept: false});
		usersRef.child(person.uid).child("invitations").push({invite_id: invite.name()});
	};

}


// Get users who are not your friends and who you not accept their request yet.
function getUnknownUsers(user_uid){

	usersRef.once('value', function(dataSnaptshot){

		var unknown = dataSnaptshot.exportVal();
		// delete user himself
		delete unknown[user_uid];

		// Get User's Friends
		var user_friendsRef = usersRef.child(user_uid).child('friends');
		user_friendsRef.once('value', function(dataSnaptshot){
			var friends = dataSnaptshot.exportVal();

			var user_requestsRef = usersRef.child(user_uid).child("requests");
			user_requestsRef.once('value', function(dataSnaptshot){
					
				var requests = dataSnaptshot.exportVal();
				// filter by friends and requests.

				// if both friends and requests are null
				if(!friends && !requests){
					for (i in unknown){
						console.log(i);
					}
				}
				// only friends is null
				else if (!friends){
					for (i in unknown){
						if (!(i in requests)){
							console.log(i);
							// return value
						}
					}
				}
				// only requests is null
				else if (!requests){
					for (i in unknown){
						if (!(i in friends)){
							console.log(i);
							// return value
						}
					}
				}
				else{
					for (i in unknown){
						if (!(i in friends) && !(i in requests)){
							console.log(i);
							// return value
						}
					}
				}
			})
		})
	})
}

// For chat
// return friends object
function getFriends(user_uid){
	var user_friendsRef = usersRef.child(user_uid).child("friends");
	user_friendsRef.once('value', function(dataSnaptshot){
			
		var friends = dataSnaptshot.exportVal();
		console.log(friends);
	})	
}

// For profile
// return requests object.
function getFriendRequests(user_uid){
	var user_requestsRef = usersRef.child(user_uid).child("requests");
	user_requestsRef.once('value', function(dataSnaptshot){
			
		var requests = dataSnaptshot.exportVal();
		console.log(requests);
		
	})

}

function logout(){
	auth.logout();
}

/////////////////////////// test area  ////////////////////////////////////

// feay
var test_user = "twitter:491052610"

var fb = {uid: 'facebook:100001609277796', name: "Feay Jarana Manotumruksa"}
var tw = {uid: 'twitter:491052610', name: "feay"}
var pw = {uid: 'simplelogin:10', name: "Coco"}
var gg = {uid: 'google:112204099966131625934', name: "Jarana Manotumruksa"}

var people = [fb, gg];


// getUnknownUsers(test_user);
// getFriendRequests(test_user);
// getFriends(test_user);

// test Friends request
// sendFriendRequest("twitter:491052610", "simplelogin:10")
// acceptFriendRequest('simplelogin:10', "twitter:491052610");

// chatRef.set({s: "df"})


// Test Chat Feature
sendMessage("twitter:491052610", "feay", "msg", "-JS0F8flXQxJfddnRzs7");
getMessages("-JS0F8flXQxJfddnRzs7");


// Test Invitation
// sendInvitation(test_user, people, "Let's go for a pint.", "1");

