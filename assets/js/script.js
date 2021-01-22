var cityFormEl = document.querySelector("#city-form");
var currentForecastContainerEl = document.querySelector("#today-forecast-container");
var citySearchTerm = document.querySelector("#city-search-term");
var apiKey = "&appid=2bb40ff233444e2f0164a4a01ea608db"
var subheadCity = document.querySelector("#city-search-term")

var date = new Date();

var formSubmitHandler = function(event) {
    event.preventDefault();
    $('current-weather-header').addClass('show')
    
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
            console.log(response);
            console.log(response.name)
            console.log(response.weather[0].icon)

            var temperatureF = (response.main.temp - 273.15) * 1.80 + 32;
            console.log(Math.floor(temperatureF))

            subheadCity.innerText = city;
            
            addToList;
            getCurrentConditions(response);
            getCurrentForecast(response);
          });
        } else {
            alert("Error: " + response.statusText)
        }
      })
      .catch(function(error) {
        alert("Unable to connect to the server.");
      });
}

//add city to recent searches list
function addToList() {
    var listItem = $("<li>").addClass("list-group-item").text(city);
    $(".list").append(listItem);
}


function getCurrentConditions (response) {
    var temperatureF = (response.main.temp - 273.15) * 1.80 + 32;
    temperatureF = Math.floor(temperatureF);

//get the weather details and set content
    var card = $("<div>").addClass("card");
    var cardBody = $("<div>").addClass("card-body");
    var city = $("<h4>").addClass("card-title").text(response.name);
    var cityDate = $("<h4>").addClass("card-title").text(date.toLocaleDateString('en-US'));
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
}

function getCurrentForecast () {
    var apiURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + apiKey;

    fetch(apiURL).then(function(response) {
        if(response.ok) {
        response.json().then(function (response) {

            $('#forecast').empty();

            var results= response.list


            for (let x = 0; x < results.length; x++) {
                var day = Number(results[x].dt_text.split('-')[2].split(' ')[0]);
                var hour = results[x].dt_text.split('-')[2].split(' ')[1];
                
                if(results[x].dt_text.indexOf("12:00:00") !== -1) {
                    var temperature= (results[x].main.temp - 273.15) *1.80 + 32
                    var temperatureF = Math.floor(temperature);

                    var card = $("<div>").addClass("card col-md-2 ml-4 five-day-forecast-header");
                    var cardBody = $("<div>").addClass("card-body p-3 five-day-forecast-body");
                    var cityDate = $("<h4>").addClass("card-title").text(date.toLocaleDateString('en-US'));
                    var temp = $("<p>").addClass("card-text").text("Temperature: " + temperatureF + " °F");
                    var humidity = $("<p>").addClass("card-text").text("Humidity: " + results[x].main.humidity + "%");
                    var weatherImage = $("<img>").attr("src", "https://openweathermap.org/img/w/" + results[x].weather[0].icon + ".png")
                    
                    cardBody.append(cityDate, weatherImage, temp, humidity);
                    card.append(cardBody);
                    $("forecast").append(card);
                }
            }
        })
    } else {
            alert("Error: " + response.statusText)
      } })
      .catch(function(error) { alert("Unable to connect to the server."); })
}

    

cityFormEl.addEventListener("submit", formSubmitHandler)
