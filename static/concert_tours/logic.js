// Creating map object
var myMap = L.map("map", {
  center: [40.7, -73.95],
  zoom: 11
});

// Adding tile layer to the map
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(myMap);

// Building API query URL
// var baseURL = "location1.csv";

var markers = L.markerClusterGroup();


d3.csv("location1.csv", function(data) {
  console.log(data);

    if (data.Latitude){
      var latDouble  = parseFloat(data.Latitude);
      var longDouble = parseFloat(data.Longitude);
      // Add a new marker to the cluster group and bind a pop-up
      markers.addLayer(L.marker([latDouble, longDouble])
        .bindPopup(data.City));
    }
});

// Add our marker cluster layer to the map
myMap.addLayer(markers);


// var date = "$where=created_date between'2016-01-10T12:00:00' and '2017-01-01T14:00:00'";
// var complaint = "&complaint_type=Rodent";
// var limit = "&$limit=10000";

// Assembling API query URL
// var url = baseURL + date + complaint + limit;

// // Grabbing the data with d3..
// d3.json(url).then(successHandle, errorHandle);

// function errorHandle(error){
//   console.log(error)
// }

// function successHandle(response) {

//   // Creating a new marker cluster group
//   var markers = L.markerClusterGroup();

//   // Loop through our data...
//   for (var i = 0; i < response.length; i++) {
//     // set the data location property to a variable
//     var location = response[i].location;

//     // If the data has a location property...
//     if (location) {

//       // Add a new marker to the cluster group and bind a pop-up
//       markers.addLayer(L.marker([location.coordinates[1], location.coordinates[0]])
//         .bindPopup(response[i].descriptor));
//     }

//   }

//   // Add our marker cluster layer to the map
//   myMap.addLayer(markers);

// }
