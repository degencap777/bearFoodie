var fetchRequest = () => {
	try {
		var requestString = fs.readFileSync('request-data.json');
		return JSON.parse(requestString);
	}catch (error) {
		return [];
	}
};

var saveRequests = (requests) => {
	fs.writeFileSync('request-data.json', JSON.stringify(requests));
}

var addRequest = (restaurant_name,hours,address, phone_number) => {
	var requests = fetchRequests();
	var request = {
		restaurant_name,
		hours,
		address,
		phone_number
	};

	var duplicateRequests = requests.filter((request) => request.restaurant_name === restaurant_name);

	if (duplicateRequests.length === 0) {
		requests.push(request);
		saveRequests(requests);
		return request;
	}
};

var displayAll = () => {
	console.log('Getting all requests');
	return fetchRequests();
};

var getRequest  = (restaurant_name) => {
	console.log('Getting request', restaurant_name);
	var requests = fetchRequests();
	var filteredRequests = requests.filter((request) => request.restaurant_name === restaurant_name);
	return filteredRequests[0];
};

var logRequest = (request) => {
	console.log('------');
	console.log(`restaurant name: ${request.restaurant_name}`);
	console.log(`hours: ${hours}`);
	console.log(`address: ${address}`);
	console.log(`phone number: ${phone_number}`);
};

module.exports = {
	addRequest,
	displayAll,
	getRequest,
	logRequest
}