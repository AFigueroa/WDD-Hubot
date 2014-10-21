// Description:
//   Enter a valid zipcode to get the current weather report
//
// Dependencies:
//   Request
//
// Configuration:
//   None
//
// Commands:
//   Hubot show weather <zipcode> - Shows current Weather for a location
//
// Author:
//   Eddie Gemayel

//store the required request into a variable for easy access
var request = require('request');

// Function to find the weather of the location entered
function getWeather(msg){

	//get zipcode the user entered
	var zipcode = msg.match[1];
	
	// Conditional statement to check if user entered an integer or not
	if (isNaN(zipcode)) {

		//tell them they messed up if they entered a string
		msg.send("The location you entered is invalid. Be sure you are entering a valid zipcode and try again.");

	}else {
		
		//url for the API stored in a variable
		apiURL = 'http://api.wunderground.com/api/00bacbd3046f5248/conditions/q/'+zipcode+'.json';
		
		// make the request to the api
		request(apiURL, function (error, response, body) {

				// This conditional makes sure the connection goes thru successfully
				if (!error && response.statusCode < 300){

					// Parse the incoming json
					var json = JSON.parse(response.body);

					//if there is no errors in retrieving location
					if(!json.response.error){

						//spit back out the information to the user
						msg.send("The city of " + json.current_observation.display_location.city + 
						" in " + json.current_observation.display_location.state_name + 
						" is currently "+ json.current_observation.weather + 
						" with " + json.current_observation.wind_mph + 
						" mph winds. It's now "+ json.current_observation.temp_f + 
						" degrees farenheit." );

					//if there is an error
					}else{
						//display that specific error message from the json
						var error = json.response.error.description;
						//spit back out the error to the user
						msg.send(error);
					}
				}
		});
	}
}//end of function

// Listens for the exact match of show weather and calls the getWeather function.
module.exports = function(robot) {
	return robot.respond(/show weather (.*)/i, function(msg) {
		//call the function above
		getWeather(msg);
	});
}