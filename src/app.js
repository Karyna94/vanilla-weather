function formatTime(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  return `${day} ${hours}:${minutes}`;
}
function formatDate(timestamp) {
  let now = new Date(timestamp);
  let date = now.getDate();
  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let month = months[now.getMonth()];
  let year = now.getFullYear();
  return `${date} ${month}, ${year}`;
}
function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}

let iconConvert = {
  "01d": "clearsky",
  "01n": "night",
  "02d": "fewclouds",
  "02n": "fewclouds",
  "03d": "scatteredclouds",
  "03n": "scatteredclouds",
  "04d": "brokenclouds",
  "04n": "brokenclouds",
  "09d": "showerrain",
  "09n": "showerrain",
  "10d": "rain",
  "10n": "rain",
  "11d": "thunderstorm",
  "11n": "thunderstorm",
  "13d": "snow",
  "13n": "snow",
  "50d": "haze",
  "50n": "mist",
};
function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");
  forecastHTML = `<div class="row">`;
  let days = ["Thu", "Fri", "Sat", "Sun"];
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      let iconName = iconConvert[forecastDay.weather[0].icon];
      forecastHTML =
        forecastHTML +
        `
    <div class="col">
      <div class="day">${formatDay(forecastDay.dt)}</div>
      
      <img
        src="icons/${iconName}.png"
        alt="Sunny cloud"
      />
      <div>
        <span class="temp-day">${Math.round(forecastDay.temp.max)}°</span>
        <span class="temp-night">${Math.round(forecastDay.temp.min)}°</span>
      </div>
    </div>
  `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  console.log(coordinates);
  let apiKey = "b2d9fa1f2b35557e4615dd5fab218834";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function displayTemperature(response) {
  console.log(response.data);
  let temperatureElement = document.querySelector("#temp");
  temperatureElement.innerHTML = Math.round(response.data.main.temp);
  let cityElement = document.querySelector("#city");
  cityElement.innerHTML = response.data.name;
  let descriptionElement = document.querySelector("#description");
  descriptionElement.innerHTML = response.data.weather[0].description;
  let humidityElement = document.querySelector("#humidity");
  humidityElement.innerHTML = response.data.main.humidity;
  let windElement = document.querySelector("#wind");
  windElement.innerHTML = Math.round(response.data.wind.speed);
  let timeElement = document.querySelector("#date");
  timeElement.innerHTML = formatTime(response.data.dt * 1000);
  let iconElement = document.querySelector("#icon");
  let iconPath = iconConvert[response.data.weather[0].icon];
  iconElement.setAttribute("src", `icons/${iconPath}.png`);
  iconElement.setAttribute("alt", response.data.weather[0].description);
  let dateElement = document.querySelector("#current-date");
  dateElement.innerHTML = formatDate(response.data.dt * 1000);

  celsiusTemperature = response.data.main.temp;

  getForecast(response.data.coord);
}
function search(city) {
  let apiKey = "b2d9fa1f2b35557e4615dd5fab218834";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayTemperature);
}

function handleSubmit(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#city-input");
  search(cityInputElement.value);
}
function displayFahrenheitTemperature(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temp");
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
}
function displayCelsiusTemperature(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temp");
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
}
let celsiusTemperature = null;

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsiusTemperature);

search("New York");
displayForecast();
