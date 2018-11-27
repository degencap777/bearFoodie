'use strict';

// const port = process.env.PORT || 8080;

const dotenv = require('dotenv'); // DotEnv library will look for the .env file to set the environment variables
dotenv.load(); // Load qchisq(0.95, 16)our environment variables
const ACCESS_TOKEN = process.env.ACCESS_TOKEN; // Access environment variables

const apiai = require('apiai');
const ai = apiai(ACCESS_TOKEN);

const uuidv1 = require('uuid/v1'); // Generate and return a RFC4122 v1 (timestamp-based) UUID
const AI_SESSION_ID = uuidv1(); // Maintain context and flow of the conversation,if the session id is same, DialogFlow will treat it as the part of same conversation.

const express = require('express');
const fs = require('fs');
const app = express();

const search = require('./search');
const save = require('./request');

var restaurantName;
var address;
var phoneNumber;
var photo;
var website;


app.use(express.static(__dirname + '/views')); // HTML
app.use(express.static(__dirname + '/public')); // CSS, JS and Images

// Create HTTP server
const server = app.listen(8080, function(){
	console.log('Listening on port 8080');
});

// Create a Socket.IO instance, passing it our server
const socketio = require('socket.io')(server);

socketio.on('connection', function(socket){
	console.log('A user is connected');
});

// Get User Interface
app.get('/', (request, response) => {
	res.sendFile(__dirname + '/views/index.html');

});

app.post('/user', (request, response) => {
	saveRestaurant(jsonObj);
});

function getSearchTerm(params) {
	var string = "";
	for (var item in params) {
		string += params[item] + ' ';
	}
	return encodeURI(string);
}


function saveRestaurant(jsonObj) {
	fs.writeFileSync('request-data.json', JSON.stringify(jsonObj));
}


// Listen on every connection
function Listen() {
	socketio.on('connection', function(socket){
		socket.on('chat request', (data) => {
			//console.log('Message: ' + data);

			// Function  whcih returns speech from DialogFlow
			var request = ai.textRequest(data, {
				sessionId: AI_SESSION_ID
			});

			request.on('response', (response) => {
				var chatResponse = response.result.fulfillment.speech;
				var bc_cities = response.result.parameters.bc_cities;
				var meal_type = response.result.parameters.meal_type;
				var occasion = response.result.parameters.occasion;
				socket.emit('ai response', chatResponse); // Send messages
				if(response.result.actionIncomplete == false) {
					search.placeSearch(getSearchTerm(response.result.parameters)).then((data) => {
						console.log(data);
						var restaurantName = data.result.name;
						var address = data.result.formatted_address;
						var phoneNumber = data.result.formatted_phone_number;
						var photo = data.result.photos;
						var website = data.result.website;

						var jsonObj = {
							restaurant_name : restaurantName,
							restaurant_address: address,
							restaurant_phone: phoneNumber,
							restaurant_website: website
						}
						socket.emit('chat complete', {parameters: response.result.parameters, searchData: data}); //Send chatbot parameters
					});
					console.log(`Result: ${response.result.parameters.meal_type} in ${response.result.parameters.bc_cities}`);
				}
				//console.log(response);
			});

			request.on('error', (error) => {
				console.log(error);
			});

			request.end();
		});
	});

}

Listen();

