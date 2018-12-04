'use strict';

$(function(){

});

const socket = io();
const query = document.querySelector('#comment');
const html = document.querySelector('#conversation');
var restaurants = document.getElementById("restaurants");
var currentPage = "home";


// Get the first element in the docuent with id="chat-send"
document.querySelector('#chat-send').addEventListener('click', () => {
	var date = new Date();
	var htmlResponse	=	"<div class=\"row message-body\">\
	<div class=\"col-sm-12 message-main-sender\">\
	<div class=\"sender\">\
	<div class=\"message-text\">" +
	query.value +
	"</div>\
	<span class=\"message-time-sender\">"
	+ date.getHours() + ":" + date.getMinutes() +
	"</span>\
	</div>\
	</div>\
	</div>";
	query.value = '';
	console.log(query.value);
	html.innerHTML = html.innerHTML + htmlResponse;
});

function replyMain(e){
	var key = e.which || e.keyCode; //Use either which or keyCode
    if (key === 13 && query.value != "") { // Enter is 13
    	var date = new Date();
    	var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    	var htmlResponse	=	"<div class=\"row message-body\">\
    	<div class=\"col-sm-12 message-main-sender\">\
    	<div class=\"sender\">\
    	<div class=\"message-text\">" +
    	query.value +
    	"</div></div>\ <div class=\"time-sender\">\
    	\<span class=\"message-date-sender\">"
		+ months[date.getMonth()] + " " + date.getDate() +
		"</span>\
    	\<span class=\"message-time-sender\">"
    	+ date.getHours() + ":" + date.getMinutes() +
    	"</span>\
    	</div>\
    	</div>\
    	</div>";
    	html.innerHTML = html.innerHTML + htmlResponse;
    	socket.emit('chat request', query.value);
    	query.value = '';
    	console.log(query.value);
    	}
};


socket.on('ai response', function(response) {
	var date = new Date();
	var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	if(response == '') response = '(No answer...)';
	var htmlResponse = "<div class=\"row message-body\">\
	<div class=\"col-sm-12 message-main-receiver\">\
	<img src=\"images/avatar.jpg\" class=\"bot-icon\">\
	<div class=\"receiver\">\
	<div class=\"message-text\">" +
	response +
	"</div></div>\ <div class=\"time-receiver\">\
	\<span class=\"message-date-receiver\">"
	+ months[date.getMonth()] + " " + date.getDate() +
	"</span>\
	\<span class=\"message-time-receiver\">"
	 + date.getHours() + ":" + date.getMinutes() +
	"</span>\
	</div>\
	</div>\
	</div>";
	html.innerHTML = html.innerHTML + htmlResponse;
});


socket.on('chat complete', function(searchData) {
    document.getElementById("details").innerHTML = "<i class=\"fa fa-cutlery\" aria-hidden=\"true\"></i>" +`This is a ${searchData.parameters.meal_type} restaurant that serves ${searchData.parameters.cuisine} in ${searchData.parameters.bc_cities}!`;
    document.getElementById("restaurantName").innerHTML = searchData.searchData.result.name;
    document.getElementById("address").innerHTML = "<i class=\"fa fa-map-marker\" aria-hidden=\"true\"></i>" + searchData.searchData.result.formatted_address;
    document.getElementById("phoneNum").innerHTML = "<i class=\"fa fa-phone\" aria-hidden=\"true\"></i>" + searchData.searchData.result.formatted_phone_number;
    document.getElementById("restaurant-image").style.backgroundImage = `url("${searchData.photoUrl}")`;
    console.log(searchData);
});


 document.getElementById("saveButton").addEventListener("click", function() {
    console.log('Save button clicked!');
    socket.emit('save request');
});

document.getElementById("fav-open").addEventListener("click", function() {
  document.getElementById("chat-screen").style.display = "none";
  document.getElementById("favorites").style.display = "block";
  document.getElementById("home-open").style.color = "grey";
  document.getElementById("fav-open").style.color = "#F07869";

  console.log('Loading...');

});



socket.on('load response', function(savedRestaurants){
    for (var i=0; i<savedRestaurants.length; i++) {
      console.log('Loading',savedRestaurants[i]);
      var div = document.createElement("div");
      div.className = "col-sm-12 savedRestaurant";

      var favImage = document.createElement("div");
      favImage.id = "fav-image";
      favImage.style.backgroundImage = `url("${savedRestaurants[i].restaurant_photo}")`

      var favName = document.createElement("div");
      favName.id = "fav-name";
      favName.innerHTML = `${savedRestaurants[i].restaurant_name}`;

      var favAction = document.createElement("div");
      favAction.id = "fav-action";
      favAction.innerHTML = "<i class=\"fa fa-trash\" aria-hidden=\"true\"></i>\
                  Remove" + "<i class=\"fa fa-share-alt\" aria-hidden=\"true\"></i>\
                  Share";

      var favInfo = document.createElement("div");
      favInfo.id="fav-info";
      favInfo.innerHTML = "";

      var favAddress = document.createElement("div");
      favAddress.id="fav-address";
      favAddress.innerHTML = "<i class=\"fa fa-map-marker\" aria-hidden=\"true\"></i>" + `${savedRestaurants[i].restaurant_address}`;

      var favPhone = document.createElement("div");
      favPhone.id = "fav-phone";
      favPhone.innerHTML = "<i class=\"fa fa-phone\" aria-hidden=\"true\"></i>" + `${savedRestaurants[i].restaurant_phone}`;

      favInfo.appendChild(favAddress);
      favInfo.appendChild(favPhone);

      div.appendChild(favImage);
      div.appendChild(favName);
      div.appendChild(favAction);
      div.appendChild(favInfo);

      restaurants.appendChild(div);
    }
});

document.getElementById("fav-open").addEventListener("click", function() {
    if (currentPage != "favs") {
        socket.emit('load request');
    }
    currentPage = "favs";
	document.getElementById("chat-screen").style.display = "none";
	document.getElementById("favorites").style.display = "block";
	document.getElementById("home-open").style.color = "grey";
	document.getElementById("fav-open").style.color = "#F07869";
});

document.getElementById("home-open").addEventListener("click", function() {
    currentPage = "home";
})