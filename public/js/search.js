const request = require('request');
const dotenv = require('dotenv');
dotenv.load();

const API_KEY = process.env.GOOGLE_KEY;


var activeSearch;


function placeSearch(searchTerm, callback) {
    var placeID;
    request(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?inputtype=textquery&key=${API_KEY}&input=${searchTerm}`,
    function (error, response, body) {
        console.log('error:', error);
        console.log('statusCode:', response && response.statusCode);
        console.log('body:', body);
        var bodyObj = JSON.parse(body);
        placeID = bodyObj.candidates[0].place_id;
        callback(placeID);
    });
};

function getDetails(placeID) {
    request(`https://maps.googleapis.com/maps/api/place/details/json?key=${API_KEY}&placeid=${placeID}&fields=formatted_address,formatted_phone_number,name,website,photos`,
        function(error, response, body) {
            console.log('error:', error);
            console.log('statusCode:', response && response.statusCode);
            console.log('body:', body);
        });
};

module.exports = {
    placeSearch
}


//Test code
var testSearch = "gyoza%20bar";
placeSearch(testSearch, getDetails);
