var APIKey = '4aa2ade8ddc7722d2367edfc46e4715c';
var city = "";
var prevCity = "";
const cities = [];
var cityExists = false;

//CITY SEARCH FUNCTION CALLS getCurrentWeather() and getForecastWeather() AND ALSO INITIATES AN API FETCH TO ENSURE PROPER VALUES ARE ENTERED
function citySearch() {

  event.preventDefault();
  city = document.getElementById('searchCity').value;
  queryURLcurrentWeather = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;
  queryURLforecastWeather = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=metric&appid=" + APIKey;


  //CHECK TO MAKE SURE THAT A) USER ENTERED A "REAL" CITY OR IF IT ALREADY EXISTS IN THEIR LIST OF PREVIOUSLY SEARCHED CITIES 
  fetch(queryURLcurrentWeather)
    .then(response => response.json())
    .then(response => {

      if (response.cod === '404' || response.name === undefined) {
        alert("Please enter a real city!");
      } else if (prevCity.toLowerCase() === response.name.toLowerCase()) {
        alert("This city has already been saved to your list, please enter a new one.");

      } else {
        prevCity = city;
        for (var i = 0; i < cities.length; i++) {
          if (city.toLowerCase() === cities[i].toLowerCase()) {
            cityExists = true;
            console.log("cityExists = TRUE");
          }
        }
        if (cityExists) {
          alert("This city has already been saved to your list, please enter a new one.");
          console.log("cityExists = TRUE");
          cityExists = false;
        } else {
          cities.push(city);
          //SAVE CITIES ARRAY IN LOCALSTORAGE
          localStorage.setItem("cities", JSON.stringify(cities));
          getCurrentWeather();
          getForecastWeather();
        }
      }

    })
    .catch(err => console.error(err));
}
//THIS FUNCTION GENERATES NEW CITY BUTTONS AND HANDLES CLICKS TO REFRESH WEATHER DATA BASED ON CLICKED SAVED CITY
function saveCity() {

  const btn = document.createElement("button");
  btn.style.background = 'darkgray';
  btn.setAttribute('id', city);
  btn.innerHTML = city;
  btn.type = "submit";
  //FOLLOWING CODE WILL DISPLAY SAVED CITIES UPON CLICKING THE RESPECTIVE BUTTON
  btn.onclick = function () {
    city = btn.id;
    event.preventDefault();
    cityExists = true;
    queryURLforecastWeather = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=metric&appid=" + APIKey;
    queryURLcurrentWeather = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;
    getCurrentWeather();
    getForecastWeather();

  }

  document.getElementById("cityList").appendChild(btn);
}

function getCurrentWeather() {
  fetch(queryURLcurrentWeather)
    .then(response => response.json())
    .then(response => {

      if (!cityExists) {
        saveCity();
      }
      console.log(response);
      console.log("City is: " + response.name);
      console.log("Icon ID is: " + response.weather[0].icon) //RETRIEVES ICON AND WORKS
      console.log("Temp in Kelvin is: " + response.main.temp);
      console.log("Humidity is: " + response.main.humidity);
      console.log("Windspeed is: " + response.wind.speed);
      console.log("2City is: " + city);
      var rightNow = moment().format('MM/DD/YYYY');
      console.log("Today is: " + rightNow);
      var temp = response.main.temp - 273.15; //SCALE TO CELSIUS
      var humidity = response.main.humidity;
      var wind = response.wind.speed * 1.6; //SCALE TO km/h
      document.getElementById("currentWeather").innerHTML = response.name + " (" + rightNow + ")";
      document.getElementById('icon').src = `http://openweathermap.org/img/w/${response.weather[0].icon}.png`;
      document.getElementById("currentTemp").innerHTML = "Temp: " + Math.round(temp) + " \u00B0C";
      document.getElementById("currentHumidity").innerHTML = "Humidity: " + humidity + "%";
      document.getElementById("currentWind").innerHTML = "Wind: " + Math.round(wind) + " km/h";
    })
    .catch(err => console.error(err));
}

function getForecastWeather() {

  //CLEAR PREVIOUS FORECAST
  day1.textContent = '';
  day2.textContent = '';
  day3.textContent = '';
  day4.textContent = '';
  day5.textContent = '';

  fetch(queryURLforecastWeather)
    .then(response => response.json())
    .then(response => {

      var day1 = moment().add(1, 'days');
      day1.format('MM/DD/YYYY');
      var day2 = moment().add(2, 'days');
      day2.format('MM/DD/YYYY');
      var day3 = moment().add(3, 'days');
      day3.format('MM/DD/YYYY');
      var day4 = moment().add(4, 'days');
      day4.format('MM/DD/YYYY');
      var day5 = moment().add(5, 'days');
      day5.format('MM/DD/YYYY');

      console.log(response);
      console.log(day1.format('MM/DD/YYYY'));
      console.log(day2.format('MM/DD/YYYY'));
      console.log(day3.format('MM/DD/YYYY'));
      console.log(day4.format('MM/DD/YYYY'));
      console.log(day5.format('MM/DD/YYYY'));


      //THE FOLLOWING GENERATES RELEVANT FORECAST INFO FOR EACH DAY
      //--------------DAY 1---------------------------------------------------------------
      var day1Date = document.createElement("h5");
      var day1Heading = document.createTextNode(day1.format('MM/DD/YYYY'));
      day1Date.appendChild(day1Heading);
      document.getElementById("day1").appendChild(day1Date);

      //FETCH WEATHER ICON
      var day1Icon = document.createElement("img");
      day1Icon.src = `http://openweathermap.org/img/w/${response.list[8].weather[0].icon}.png`;
      document.getElementById("day1").appendChild(day1Icon);

      var tempDay1 = Math.round(response.list[8].main.temp);
      var windDay1 = Math.round(response.list[8].wind.speed * 1.6); //SCALE TO km/h
      var humDay1 = response.list[8].main.humidity;

      var day1TempElement = document.createElement("p");
      var day1Temp = document.createTextNode("Temp: " + tempDay1 + "\u00B0C");
      day1TempElement.appendChild(day1Temp);
      document.getElementById("day1").appendChild(day1TempElement);

      var day1WindElement = document.createElement("p");
      var day1Wind = document.createTextNode("Wind: " + windDay1 + " km/h");
      day1WindElement.appendChild(day1Wind);
      document.getElementById("day1").appendChild(day1WindElement);

      var day1HumElement = document.createElement("p");
      var day1Hum = document.createTextNode("Humidity: " + humDay1 + "%");
      day1HumElement.appendChild(day1Hum);
      document.getElementById("day1").appendChild(day1HumElement);

      //--------------DAY 2---------------------------------------------------------------

      var day2Date = document.createElement("h5");
      var day2Heading = document.createTextNode(day2.format('MM/DD/YYYY'));
      day2Date.appendChild(day2Heading);
      document.getElementById("day2").appendChild(day2Date);

      //FETCH WEATHER ICON
      var day2Icon = document.createElement("img");
      day2Icon.src = `http://openweathermap.org/img/w/${response.list[16].weather[0].icon}.png`;
      document.getElementById("day2").appendChild(day2Icon);

      var tempDay2 = Math.round(response.list[16].main.temp);
      var windDay2 = Math.round(response.list[16].wind.speed * 1.6); //SCALE TO km/h
      var humDay2 = response.list[16].main.humidity;

      var day2TempElement = document.createElement("p");
      var day2Temp = document.createTextNode("Temp: " + tempDay2 + "\u00B0C");
      day2TempElement.appendChild(day2Temp);
      document.getElementById("day2").appendChild(day2TempElement);

      var day2WindElement = document.createElement("p");
      var day2Wind = document.createTextNode("Wind: " + windDay2 + " km/h");
      day2WindElement.appendChild(day2Wind);
      document.getElementById("day2").appendChild(day2WindElement);

      var day2HumElement = document.createElement("p");
      var day2Hum = document.createTextNode("Humidity: " + humDay2 + "%");
      day2HumElement.appendChild(day2Hum);
      document.getElementById("day2").appendChild(day2HumElement);

      //--------------DAY 3---------------------------------------------------------------

      var day3Date = document.createElement("h5");
      var day3Heading = document.createTextNode(day3.format('MM/DD/YYYY'));
      day3Date.appendChild(day3Heading);
      document.getElementById("day3").appendChild(day3Date);

      //FETCH WEATHER ICON
      var day3Icon = document.createElement("img");
      day3Icon.src = `http://openweathermap.org/img/w/${response.list[24].weather[0].icon}.png`;
      document.getElementById("day3").appendChild(day3Icon);

      var tempDay3 = Math.round(response.list[24].main.temp);
      var windDay3 = Math.round(response.list[24].wind.speed * 1.6); //SCALE TO km/h
      var humDay3 = response.list[24].main.humidity;

      var day3TempElement = document.createElement("p");
      var day3Temp = document.createTextNode("Temp: " + tempDay3 + "\u00B0C");
      day3TempElement.appendChild(day3Temp);
      document.getElementById("day3").appendChild(day3TempElement);

      var day3WindElement = document.createElement("p");
      var day3Wind = document.createTextNode("Wind: " + windDay3 + " km/h");
      day3WindElement.appendChild(day3Wind);
      document.getElementById("day3").appendChild(day3WindElement);

      var day3HumElement = document.createElement("p");
      var day3Hum = document.createTextNode("Humidity: " + humDay3 + "%");
      day3HumElement.appendChild(day3Hum);
      document.getElementById("day3").appendChild(day3HumElement);

      //--------------DAY 4---------------------------------------------------------------

      var day4Date = document.createElement("h5");
      var day4Heading = document.createTextNode(day4.format('MM/DD/YYYY'));
      day4Date.appendChild(day4Heading);
      document.getElementById("day4").appendChild(day4Date);

      //FETCH WEATHER ICON
      var day4Icon = document.createElement("img");
      day4Icon.src = `http://openweathermap.org/img/w/${response.list[32].weather[0].icon}.png`;
      document.getElementById("day4").appendChild(day4Icon);

      var tempDay4 = Math.round(response.list[32].main.temp);
      var windDay4 = Math.round(response.list[32].wind.speed * 1.6); //SCALE TO km/h
      var humDay4 = response.list[32].main.humidity;

      var day4TempElement = document.createElement("p");
      var day4Temp = document.createTextNode("Temp: " + tempDay4 + "\u00B0C");
      day4TempElement.appendChild(day4Temp);
      document.getElementById("day4").appendChild(day4TempElement);

      var day4WindElement = document.createElement("p");
      var day4Wind = document.createTextNode("Wind: " + windDay4 + " km/h");
      day4WindElement.appendChild(day4Wind);
      document.getElementById("day4").appendChild(day4WindElement);

      var day4HumElement = document.createElement("p");
      var day4Hum = document.createTextNode("Humidity: " + humDay4 + "%");
      day4HumElement.appendChild(day4Hum);
      document.getElementById("day4").appendChild(day4HumElement);

      //--------------DAY 5---------------------------------------------------------------

      var day5Date = document.createElement("h5");
      var day5Heading = document.createTextNode(day5.format('MM/DD/YYYY'));
      day5Date.appendChild(day5Heading);
      document.getElementById("day5").appendChild(day5Date);

      //FETCH WEATHER ICON
      var day5Icon = document.createElement("img");
      day5Icon.src = `http://openweathermap.org/img/w/${response.list[39].weather[0].icon}.png`;
      document.getElementById("day5").appendChild(day5Icon);

      var tempDay5 = Math.round(response.list[39].main.temp);
      var windDay5 = Math.round(response.list[39].wind.speed * 1.6); //SCALE TO km/h
      var humDay5 = response.list[39].main.humidity;

      var day5TempElement = document.createElement("p");
      var day5Temp = document.createTextNode("Temp: " + tempDay5 + "\u00B0C");
      day5TempElement.appendChild(day5Temp);
      document.getElementById("day5").appendChild(day5TempElement);

      var day5WindElement = document.createElement("p");
      var day5Wind = document.createTextNode("Wind: " + windDay5 + " km/h");
      day5WindElement.appendChild(day5Wind);
      document.getElementById("day5").appendChild(day5WindElement);

      var day5HumElement = document.createElement("p");
      var day5Hum = document.createTextNode("Humidity: " + humDay5 + "%");
      day5HumElement.appendChild(day5Hum);
      document.getElementById("day5").appendChild(day5HumElement);

    })

    .catch(err => console.error(err));
}

    
  
    
  
   
