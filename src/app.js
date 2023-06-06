//function to replace values on html page
function htmlReplace(id, yourReplacement) {
  let cityReplacement = document.querySelector(`#${id}`);
  cityReplacement.innerHTML = `${yourReplacement}`;
}

function apiCallForCitySearching(city) {
  let apiKey = "50c2acd53349fabd54f52b93c8650d37";
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  //console.log(url);
  axios.get(url).then(getApiData);
}
function getApiData(response) {
  //console.log(response);
  let data = response.data;
  console.log(data);
  CityTemp(data);
  CityName(data);
  CityHumidity(data);
  CityWind(data);
  CityDescription(data);
  getDate(data);
}
//function to get temperature value from API
function CityTemp(data) {
  let temp = Math.round(data.main.temp);
  htmlReplace("temperature-value", temp);
  //console.log(temp);
}
///function to get city name from the API
function CityName(data) {
  let cityName = data.name.toUpperCase();
  htmlReplace("currentCity", cityName);
}
//function to get humidity value from API
function CityHumidity(data) {
  let cityHumidity = data.main.humidity;
  htmlReplace("humidity-value", cityHumidity);
}
// function to get windspeed from API
function CityWind(data) {
  let cityWind = Math.round(data.wind.speed);
  htmlReplace("wind-value", cityWind);
}
//function to get weather discription from API
function CityDescription(data) {
  let CityDescription = data.weather[0].description;
  htmlReplace("description", CityDescription);
}
//Function to call for a default city.
function defaultCity(defaultCity) {
  apiCallForCitySearching(defaultCity);
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
// For form submission
let form = document.querySelector("form");
form.addEventListener("submit", getFormInput);

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
  let timeStamp = data.dt;
  let date = new Date(timeStamp * 1000);
  let day = daysOfTheWeek[date.getDay()];
  let hours = date.getHours().toString().padStart(2, "0");
  let minutes = date.getMinutes().toString().padStart(2, "0");
  let lastUpdated = `Updated ${day} ${hours}:${minutes}`;
  htmlReplace("day-and-time", lastUpdated);
}

defaultCity("paris");
