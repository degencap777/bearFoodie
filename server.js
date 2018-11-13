'use strict';

// const port = process.env.PORT || 8080;

const dotenv = require('dotenv'); // DotEnv library will look for the .env file to set the environment variables
dotenv.load(); // Load our environment variables
const ACCESS_TOKEN = process.env.ACCESS_TOKEN; // Access environment variables

const apiai = require('apiai');
const ai = apiai(ACCESS_TOKEN);

const uuidv1 = require('uuid/v1'); // Generate and return a RFC4122 v1 (timestamp-based) UUID
const AI_SESSION_ID = uuidv1(); // Maintain context and flow of the conversation,if the session id is same, DialogFlow will treat it as the part of same conversation.

const express = require('express');
const app = express();

app.use(express.static(__dirname + '/views')); // HTML
app.use(express.static(__dirname + '/public')); // CSS, JS and Images

var bc_cities="";

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
				bc_cities = response.result.parameters.bc_cities;
				var meal_type = response.result.parameters.meal_type;
				var occasion = response.result.parameters.occasion;
				//console.log('Chat Response: ' + chatResponse);
				socket.emit('ai response', chatResponse); // Send messages
				// console.log('bc_cities: ',bc_cities);
				return console.log(`bc cities: ${bc_cities}`);
				// console.log('meal_type: ', meal_type);
				// console.log('occasion: ', occasion);
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

