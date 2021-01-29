var cityFormEl = document.querySelector("#city-form");
var currentForecastContainerEl = document.querySelector("#today-forecast-container");
var citySearchTerm = document.querySelector("#city-search-term");
var apiKey = "&appid=30562882ec7f07e040737c8e9bf783be"
var subheadCity = document.querySelector("#city-search-term")
var cityForList = $("#city").val();


var date = new Date();

var formSubmitHandler = function(event) {
    event.preventDefault();

    //show the headlines for the city weather
    $("#current-weather-header").removeClass("hide")
    $("#current-weather-header").addClass("show")
    
    $("#5-day-forecast-header").removeClass("hide")
    $("#5-day-forecast-header").addClass("show")

    
    
    //grab city and clear search box
    var city = $("#city").val();
    $("#city").val("");

    //call api function or pop up error
    if (city) {
        getWeather(city);
    } else {
        alert("Please enter a valid city.")
    }
}

var getWeather = function(city) {
    var apiURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + apiKey;

    fetch(apiURL).then(function(response) {
        if(response.ok) {
            response.json().then(function (response) {
            //console.log(response);
            //console.log(response.name)
            //console.log(response.weather[0].icon)

            var temperatureF = (response.main.temp - 273.15) * 1.80 + 32;
            //console.log(Math.floor(temperatureF))

            subheadCity.innerText = city;
            
            //addToList(response);
            getCurrentConditions(response);
            getCurrentForecast(response.name);
            });
        } else {
            alert("Error: in get weather function " + response.statusText)
        }
      })
      .catch(function(error) {
        alert("Unable to connect to the server.");
      });
}

//add city to recent searches list
//function addToList(response) {
    //console.log("in add to list function")
    //var listItem = $("<li>").addClass("list-group-item")
    //var buttonItem = document.createElement("button")
    //buttonItem.setAttribute("prev-city-button")
    //buttonItem.name = "prevCityBtn";
    //buttonItem.textContent = response.name
    
    //listItem.appendChild(buttonItem);
    //$("#list").append(listItem);
//}

//function listButtonHandler() {
   // if(target.matches("[name='prevCityBtn']"))
   // {
   //     getWeather(response.name)
   // }
//}


function getCurrentConditions (response) {
    var temperatureF = (response.main.temp - 273.15) * 1.80 + 32;
    temperatureF = Math.floor(temperatureF);

    //get the weather details and set content
    var card = $("<div>").addClass("card");
    var cardBody = $("<div>").addClass("card-body");
    var city = $("<h4>").addClass("card-title current-weather-city").text(response.name);
    var cityDate = $("<h5>").addClass("card-title").text(date.toLocaleDateString('en-US'));
    var temperature = $("<p>").addClass("card-text current-temp").text("Temperature: " + temperatureF + " °F");
    var humidity = $("<p>").addClass("card-text current-humidity").text("Humidity: " + response.main.humidity + "%");
    var wind = $("<p>").addClass("card-text current-wind").text("Wind Speed: " + response.wind.speed + " MPH");
    var image = $("<img>").attr("src", "https://openweathermap.org/img/w/" + response.weather[0].icon + ".png")


    $('#current-weather').empty();
    
    //add the details to the page
    city.append(cityDate, image)
    cardBody.append(city, temperature, humidity, wind);
    card.append(cardBody);
    $("#current-weather").append(card)

    //get uv index
    var latitude = (response.coord.lat);
    var longitude = (response.coord.lon);

    fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + apiKey).then(function (response){
        if(response.ok){
           // console.log(response)
            response.json().then(function (response) {
                var uvIndexValue = (response.current.uvi)
                var uvIndex = $("<p>").addClass("card-text current-uv").text("UV Index: " + (uvIndexValue))
            
                if (uvIndexValue >= 6) {
                    uvIndex.addClass("uv-index-high")
                } else if (uvIndexValue >= 3 && uvIndexValue <6) {
                    uvIndex.addClass("uv-index-med")
                } else {
                    uvIndex.addClass("uv-index-low")
                }

                cardBody.append(uvIndex)
            })
        }

    })
}


function getCurrentForecast(response) {

    var latitude = (response.coord.lat);
    var longitude = (response.coord.lon);

    fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + apiKey).then(function (response){
        if(response.ok){
           // console.log(response)
            response.json().then(function (response) {

            $('#forecast').empty();

            var results= response.list


            for (let x = 0; x < 5; x++) {
                var day = Number(results[x].dt.split('-')[2].split(' ')[0]);
                var hour = results[x].dt.split('-')[2].split(' ')[1];
                
                if(results[x].dt.indexOf("12:00:00") !== -1) {
                    var temperature= (results[x].daily.temp.max - 273.15) *1.80 + 32
                    var temperatureF = Math.floor(temperature);

                    var card = $("<div>").addClass("card col-md-2 ml-4 five-day-forecast-header");
                    var cardBody = $("<div>").addClass("card-body p-3 five-day-forecast-body");
                    var cityDate = $("<h4>").addClass("card-title").text(date.toLocaleDateString('en-US'));
                    var temp = $("<p>").addClass("card-text").text("Temperature: " + temperatureF + " °F");
                    var humidity = $("<p>").addClass("card-text").text("Humidity: " + results[x].daily.humidity + "%");
                    var weatherImage = $("<img>").attr("src", "https://openweathermap.org/img/w/" + results[x].daily.weather[0].icon + ".png")
                    
                    cardBody.append(cityDate, weatherImage, temp, humidity);
                    card.append(cardBody);
                    $("forecast").append(card);
                }
            }
        })
    } else {
            alert("Error: in get current forecast " + response.statusText)
      } })
      .catch(function(error) { alert("Unable to connect to the server."); })
}

    

cityFormEl.addEventListener("submit", formSubmitHandler)
