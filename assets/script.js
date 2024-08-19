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
      } else {
        // calling of the updateForecast function
        updateForecast(data, city, currentDate);
        // calling of the updatedDashboard function
        updatedDashboard(data);
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

// function to update dashboard section's forecast                           //
function updateForecast(data, city, currentDate) {
  // Does any weather data exist and are their any submissions?
  if (data && data.list && data.list.length > 0) {
    const dayData = data.list[0];
    document.getElementById("date").textContent = currentDate; //update date
    document.getElementById("city").textContent = city; //update city name
    
    //Update temp wind and humidity for current date
    document.getElementById("todays-temp").textContent = `${dayData.main.temp}\u00B0`;
    document.getElementById("todays-wind").textContent = `${dayData.wind.speed} mph`;
    document.getElementById("todays-humidity").textContent = `${dayData.main.humidity}%`;
  } else {
    // error if no data is available
    console.error("No weather data is currently available.");
  }
}

// update forecasts
function updatedDashboard(data) {
  if (data && data.list && data.list.length > 0) {
    // Loop through 5 forecast entries
    for (let index = 0; index < 5; index++) {
      const indexDay = index + 1;
      // temp updated
      const tempDayId = "day-" + indexDay + "-temp" ;
      const tempDay = document.getElementById(tempDayId);
      if (tempDay) {
        tempDay.textContent = data.list[index].main.temp + "\u00B0";
      }

      // wind is updated
      const windDayId = "day-" + indexDay + "-wind";
      const windDay = document.getElementById(windDayId);
      if (windDay) {
        windDay.textContent = data.list[index].wind.speed + " mph";
      }

      // humidity is updated
      const humidityDayId = "day-" + indexDay + "-humidity";
      const humidityDay = document.getElementById(humidityDayId);
      if (humidityDay) {
        humidityDay.textContent = data.list[index].main.humidity + "%";
      }
    }
  } else {
    // error if no available data
    console.error("No weather data is currently.");
  }
}


searchForm.addEventListener("submit", updateCitySearch);