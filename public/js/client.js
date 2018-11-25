'use strict';

$(function(){

});

const socket = io();
const query = document.querySelector('#comment');
const html = document.querySelector('#conversation');
var submitButton = document.getElementById("submitButton");


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


socket.on('chat complete', function(parameters) {
    document.getElementById("details").innerHTML = `This is a ${parameters.meal_type} restaurant in ${parameters.bc_cities}!`;
});



document.getElementById("fav-open").addEventListener("click", function() {
	document.getElementById("chat-screen").style.display = "none";
	document.getElementById("favorites").style.display = "block";
	document.getElementById("home-open").style.color = "grey";
	document.getElementById("fav-open").style.color = "#F07869";
});

