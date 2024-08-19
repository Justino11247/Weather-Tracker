const apiKey = `4ad01f4af0505816eef872ed4383f8fd`; // API Key
let city = "";
let searchedHistory = JSON.parse(localStorage.getItem("searched-history")) || [];
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input"); 
const searchHistory = document.getElementById("search-history");


// function for latitude and longitude data of selected city
function getCityLocation(city, apiKey) {
  fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city},&limit=1&appid=${apiKey}`)
    .then(function (response) {
      return response.json();// convert to JSON
    })
    .then(function (data) { // Checking for data to be returned
      if (data.length === 0) {
        alert(
          "No city  was found! Check for spelling or search for another city."
        );
      } else {
        // latitude and longitude data
        let lat = data[0].lat;
        let lon = data[0].lon;
        console.log(data);
        getForecast(lat, lon, apiKey, city);
      }
    });
}

// function to get forecast data
function getForecast(lat, lon, apiKey) {
  let currentDate = new Date().toLocaleDateString();
  fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`)
    // JSON conversion
    .then(function (response) {
      return response.json();
      
    })
    .then(function (data) {
      console.log(data);
      if (data.length === 0) {
        alert("Oops, no weather information found.");
      }
    })
    .catch(function (error) {
      console.error("Error occured while fetching data:", error);
      alert("Error occured while fetching data.");
    });
    
}


function updateCitySearch(event) {
  event.preventDefault();

  city = searchInput.value.trim();
  if (city) {
    getCityLocation(city, apiKey);
    searchInput.value = "";
    searchedHistory.push(city);
    localStorage.setItem("searched-history", JSON.stringify(searchedHistory));
  }
}


searchForm.addEventListener("submit", updateCitySearch);