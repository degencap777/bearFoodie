'use strict';

const request = require('request');
const axios = require('axios');
const dotenv = require('dotenv');
const result = dotenv.load();

const API_KEY = process.env.GOOGLE_KEY;

/*
function placeSearch(searchTerm) {
    var placeID;
    request(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?inputtype=textquery&key=${API_KEY}&input=${searchTerm}`,
    function (error, response, body) {
        // console.log('error:', error);
        // console.log('statusCode:', response && response.statusCode);
        console.log('body:', body);
        var bodyObj = JSON.parse(body);
        placeID = bodyObj.candidates[0].place_id;
        getDetails(placeID);
    });
};


function getDetails(placeID) {
    request(`https://maps.googleapis.com/maps/api/place/details/json?key=${API_KEY}&placeid=${placeID}&fields=formatted_address,formatted_phone_number,name,website,photos`,
        function(error, response, body) {
            // console.log('error:', error);
            // console.log('statusCode:', response && response.statusCode);
            // console.log('body:', body);
        });
};
*/

const findID = async (searchTerm) => {
    console.log(searchTerm);
    const placeData = await axios.get(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?inputtype=textquery&key=${API_KEY}&input=${searchTerm}`);
    return placeData.data.candidates[0].place_id
};

const getDetails = async (placeID) => {
    const response = await axios.get(`https://maps.googleapis.com/maps/api/place/details/json?key=${API_KEY}&placeid=${placeID}&fields=formatted_address,formatted_phone_number,name,website,photos`);
    return response.data;
};

const placeSearch = async (searchTerm) => {
    var placeID = await findID(searchTerm);
    var placeDetails = getDetails(placeID);
    return placeDetails
}

module.exports = {
    placeSearch
}


//Test code
// var testSearch = "gyoza%20bar";
// placeSearch(testSearch).then((data) =>{
//     console.log(data);
// });

// findID(testSearch).then((data) => {
//     console.log(data);
// })

// setTimeout(() => {
//     console.log(getDetails('ChIJXRdmW4ZxhlQRbAaIjTqi1Ms'));
// }, 5000)


// getDetails('ChIJXRdmW4ZxhlQRbAaIjTqi1Ms').then((data) => {
//     return data;
// })