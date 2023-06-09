//This function add class to an element on the html
function addClassList(elementId) {
  let link = document.querySelector(`#${elementId}`);
  link.classList.add("unclickable-link");
}
// this function  calls the API
function apiCallForCitySearching(city) {
  let apiKey = "b7c86efaac7c13373o4d08b12f9t3f33";
  let shecodesurl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;
  axios.get(shecodesurl).then(getApiData);
}
// function to search for the current location of user on the api
function apiCallForCurrentLocation(lat, long) {
  let apiKey = "b7c86efaac7c13373o4d08b12f9t3f33";
  let url = `https://api.shecodes.io/weather/v1/current?lon=${long}&lat=${lat}&key=${apiKey}&units=metric`;
  axios.get(url).then(recieveCoordApiData); //api calls the function to recieve data
}
//THIS function handles the conversion of fahrenheit to celsius
function celsiusUnit(event) {
  event.preventDefault();
  let farenhietValue = document.querySelector("#temperature-value");
  farenhietValue = farenhietValue.innerHTML;
  let celsiusValue = Math.round(((farenhietValue - 32) * 5) / 9);
  htmlReplace("temperature-value", celsiusValue);
  addClassList("celsius-unit");
  removeClassList("farenheit-unit");
}
//function to get temperature value from API
function CityTemp(data) {
  let temp = Math.round(data.temperature.current);
  htmlReplace("temperature-value", temp);
}

///function to get city name from the API
function CityName(data) {
  let cityName = data.city;
  let country = data.country;
  htmlReplace("currentCity", `${cityName},${country}`);
}

//function to get humidity value from API
function CityHumidity(data) {
  let cityHumidity = data.temperature.humidity;
  htmlReplace("humidity-value", cityHumidity);
}
// function to get windspeed from API
function CityWind(data) {
  let cityWind = Math.round(data.wind.speed);
  htmlReplace("wind-value", cityWind);
}
//function to get weather discription from API
function CityDescription(data) {
  let CityDescription = data.condition.description;
  htmlReplace("description", CityDescription);
}
//for current location from user location
function currentLocation(position) {
  let lat = position.coords.latitude;
  let long = position.coords.longitude;
  apiCallForCurrentLocation(lat, long);
}
//Function to call for a default city.
function defaultCity(defaultCity) {
  apiCallForCitySearching(defaultCity);
}
// This function handles the conversion of celsius to farenhiet
function farenheitUnit(event) {
  event.preventDefault();
  let currentValue = document.querySelector("#temperature-value");
  currentValue = Math.round(currentValue.innerHTML * 1.8 + 32);
  htmlReplace("temperature-value", currentValue);
  addClassList("farenheit-unit");
  removeClassList("celsius-unit");
}
// this function is in charge of calling the forecast API
function forecastApiCall(data) {
  let query = data;
  let key = "b7c86efaac7c13373o4d08b12f9t3f33";
  let url = `https://api.shecodes.io/weather/v1/forecast?query=${query}&key=${key}&units=metric`;
  //console.log(url);
  axios.get(url).then(weatherForcastSorting);
}
//this function gets the response from the Api and distribute it accordingly
function getApiData(response) {
  //it gives the forcastapicall the name of the city searched by user
  forecastApiCall(response.data.city);
  let data = response.data;
  weatherIcon(data);
  CityTemp(data);
  CityName(data);
  CityHumidity(data);
  CityWind(data);
  CityDescription(data);
  getDate(data);
}
// this function is in charge of getting the day of the forcast
function forcastDay(timestamp) {
  let daysOfForcast = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let date = new Date(timestamp * 1000);
  let forcastDay = daysOfForcast[date.getDay()];
  return forcastDay;
}
// function to get the city searched by user and get the weather from the API
function getFormInput(event) {
  event.preventDefault();
  let city = document.querySelector("#city-input");
  let cityInput = city.value;
  cityInput = cityInput.toUpperCase().replace(".", " ").trim();
  apiCallForCitySearching(cityInput);
  //console.log(cityInput);
}
//Function for last updated time
function getDate(data) {
  let daysOfTheWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let timeStamp = data.time;
  let date = new Date(timeStamp * 1000);
  let day = daysOfTheWeek[date.getDay()];
  let hours = date.getHours().toString().padStart(2, "0");
  let minutes = date.getMinutes().toString().padStart(2, "0");
  let lastUpdated = `Updated ${day} ${hours}:${minutes}`;
  htmlReplace("day-and-time", lastUpdated);
}
//function to get current location of user
function getUserGeoLocation(event) {
  //event.preventDefault();
  navigator.geolocation.getCurrentPosition(currentLocation);
}
//recieve the response from the API and distribute the data
function recieveCoordApiData(response) {
  let data = response.data;
  weatherIcon(data);
  CityTemp(data);
  CityName(data);
  CityHumidity(data);
  CityWind(data);
  CityDescription(data);
  getDate(data);
}
// This function removes class from an element on the html
function removeClassList(elementId) {
  let link = document.querySelector(`#${elementId}`);
  link.classList.remove("unclickable-link");
}
//this function handles the replacement of innerHTML on the html page
function htmlReplace(id, yourReplacement) {
  let cityReplacement = document.querySelector(`#${id}`);
  cityReplacement.innerHTML = `${yourReplacement}`;
}
//this function is in charge of changing the icon weather to the corresponding weather
function weatherIcon(data) {
  let weatherIcon = data.condition.icon_url;
  let weatherIconChange = document.querySelector("#weather-icon");
  weatherIconChange.src = `${weatherIcon}`;
}
// This function handles the daily forcast
function weatherForcastSorting(response) {
  let dailyForcast = response.data.daily;
  let sentence = "";
  let forcastDetails = {};
  dailyForcast.forEach(function (daysForcast, index) {
    if (index < 6) {
      let day = forcastDay(daysForcast.time);
      let forcastIcon = daysForcast.condition.icon_url;
      let maxTemp = Math.round(daysForcast.temperature.maximum);
      let minTemp = Math.round(daysForcast.temperature.minimum);
      let humidity = daysForcast.temperature.humidity;
      let wind = daysForcast.wind.speed;
      let description = daysForcast.condition.description;
      forcastDetails[index] = {
        indexex: index,
        days: day,
        icon: forcastIcon,
        max: maxTemp,
        min: minTemp,
        humi: humidity,
        win: wind,
        descriptin: description,
      };

      sentence += `<div class="shadow col-2 day" id="day${index}">
            <h6>${day}</h6>
            <strong
              ><img
                src=${forcastIcon}
                alt=""
            /></strong>
            <p id= "min-max"><span>${maxTemp}°</span><span id="min"> ${minTemp}°</span></p>
          </div>`;
    }
  });
  let forcastSection = document.querySelector("#forcast-section");
  forcastSection.innerHTML = sentence;
  handleDaysOfForcastClicking(forcastDetails);
}

function handleDaysOfForcastClicking(response) {
  let day0 = document.querySelector("#day0");
  day0.addEventListener("click", function () {
    daysForcast(response[0]);
  });
  let day1 = document.querySelector("#day1");
  day1.addEventListener("click", function () {
    daysForcast(response[1]);
  });
  let day2 = document.querySelector("#day2");
  day2.addEventListener("click", function () {
    daysForcast(response[2]);
  });
  let day3 = document.querySelector("#day3");
  day3.addEventListener("click", function () {
    daysForcast(response[3]);
  });
  let day4 = document.querySelector("#day4");
  day4.addEventListener("click", function () {
    daysForcast(response[4]);
  });
  let day5 = document.querySelector("#day5");
  day5.addEventListener("click", function () {
    daysForcast(response[5]);
  });
}
function daysForcast(forecast) {
  let weatherIcon = forecast.icon;
  let weatherIconChange = document.querySelector("#weather-icon");
  weatherIconChange.src = `${weatherIcon}`;
  htmlReplace("temperature-value", forecast.max);
  htmlReplace("humidity-value", forecast.humi);
  htmlReplace("wind-value", Math.round(forecast.win));
  htmlReplace("description", forecast.descriptin);
}
// For form submission
let form = document.querySelector("form");
form.addEventListener("submit", getFormInput);

let currentLocationIcon = document.querySelector(".location-icon");
currentLocationIcon.addEventListener("click", getUserGeoLocation);

let farenheit = document.querySelector("#farenheit-unit");
farenheit.addEventListener("click", farenheitUnit);

let celsius = document.querySelector("#celsius-unit");
celsius.addEventListener("click", celsiusUnit);
// this function gets the ip address of user
function getIPAddress() {
  let url = "https://ipapi.co/json";
  axios.get(url).then(recieveIP);
}

// get the city of the ip address and use it as the default city
function recieveIP(response) {
  let userIPCity = response.data.city;
  defaultCity(userIPCity);
}
getIPAddress();
