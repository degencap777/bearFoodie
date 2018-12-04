'use strict'; //Defines that JavaScript code should be executed in "strict mode".

// const port = process.env.PORT || 8080;

const dotenv = require('dotenv'); // DotEnv library will look for the .env file to set the environment variables
dotenv.load(); // Load qchisq(0.95, 16)our environment variables
const ACCESS_TOKEN = process.env.ACCESS_TOKEN; // Access environment variables
const API_KEY = process.env.GOOGLE_KEY;

const apiai = require('apiai');
const ai = apiai(ACCESS_TOKEN);

const uuidv1 = require('uuid/v1'); // Generate and return a RFC4122 v1 (timestamp-based) UUID
const AI_SESSION_ID = uuidv1(); // Maintain context and flow of the conversation,if the session id is same, DialogFlow will treat it as the part of same conversation.

const express = require('express');
const fs = require('fs');
const app = express();

const search = require('./search');


var lastSearch;
var savedRestaurants;
var restaurant_name;
// var restaurantName;
// var address;
// var phoneNumber;
// var photo;
// var website;


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

// Parse json data for search terms and Return URI encoded string
function getSearchTerm(params) {
	var string = "";
	for (var item in params) {
		string += params[item] + ' ';
	}
	return encodeURI(string);
};

// Save Restaurant into saveData.json file
function saveRestaurant(jsonObj) {
	var requests = loadRestaurants();

	requests.push(jsonObj);
	fs.writeFileSync('saveData.json', JSON.stringify(requests, undefined, 1));
};


// Load a user's saved restaurant data from saveData.json
function loadRestaurants() {
	try {
		var loadString = fs.readFileSync('saveData.json');
		console.log('Loading Restaurants');
		return JSON.parse(loadString);
	}catch(error) {
		return [];
	}
};


// Socket io Listener - Listen on every connection
function Listen() {
	socketio.on('connection', function(socket){

		socket.on('save request', () => {
			console.log("Save request received!");
			saveRestaurant(lastSearch);
		});

		socket.on('load request', () => {
			savedRestaurants = loadRestaurants();
			//console.log(savedRestaurants);
			socket.emit('load response', savedRestaurants);
			});

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
				var cuisine = response.result.parameters.cuisine;
				socket.emit('bot response', chatResponse); // Send messages
				if(response.result.actionIncomplete == false) {
					search.placeSearch(getSearchTerm(response.result.parameters)).then((data) => {

						console.log(data);
						var photoLink = `https://maps.googleapis.com/maps/api/place/photo?maxheight=200&key=${API_KEY}&photoreference=${data.result.photos[0].photo_reference}`
						lastSearch = {
							restaurant_name: data.result.name,
							restaurant_address: data.result.formatted_address,
							restaurant_phone: data.result.formatted_phone_number,
							restaurant_website: data.result.website,
							restaurant_photo: photoLink
						}
						socket.emit('chat complete', {parameters: response.result.parameters, searchData: data, photoUrl: photoLink}); //Send chatbot parameters

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