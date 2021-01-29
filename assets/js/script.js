function createCityList(citySearchList) {
    $("#city-list").empty();
  
    var keys = Object.keys(citySearchList);
    for (var i = 0; i < keys.length; i++) {
      var cityListEntry = $("<button>");
      cityListEntry.addClass("list-group-item list-group-item-action");
  
      var splitStr = keys[i].toLowerCase().split(" ");
      for (var j = 0; j < splitStr.length; j++) {
        splitStr[j] =
          splitStr[j].charAt(0).toUpperCase() + splitStr[j].substring(1);
      }
      var titleCasedCity = splitStr.join(" ");
      cityListEntry.text(titleCasedCity);
  
      $("#city-list").append(cityListEntry);
    }
  }
  
  function populateCityWeather(city, citySearchList) {
    createCityList(citySearchList);
  
    var queryURL =
      "https://api.openweathermap.org/data/2.5/weather?&units=imperial&&appid=30562882ec7f07e040737c8e9bf783be&q=" +
      city;
  
    var queryURL2 =
      "https://api.openweathermap.org/data/2.5/forecast?&units=imperial&&appid=30562882ec7f07e040737c8e9bf783be&q=" +
      city;
  
    var latitude;
  
    var longitude;
  
    $.ajax({
      url: queryURL,
      method: "GET"
    })
      // Store current weather data
      .then(function(weather) {

        var nowMoment = moment();
  
        var displayMoment = $("<h3>");
        $("#city-name").empty();
        $("#city-name").append(
          displayMoment.text("(" + nowMoment.format("M/D/YYYY") + ")")
        );
  
        var cityName = $("<h3>").text(weather.name);
        $("#city-name").prepend(cityName);
  
        var weatherIcon = $("<img>");
        weatherIcon.attr(
          "src",
          "https://openweathermap.org/img/w/" + weather.weather[0].icon + ".png"
        );
        $("#current-icon").empty();
        $("#current-icon").append(weatherIcon);
  
        $("#current-temp").text("Temperature: " + weather.main.temp + " °F");
        $("#current-humidity").text("Humidity: " + weather.main.humidity + "%");
        $("#current-wind").text("Wind Speed: " + weather.wind.speed + " MPH");
  
        latitude = weather.coord.lat;
        longitude = weather.coord.lon;
  
        var queryURL3 =
          "https://api.openweathermap.org/data/2.5/uvi/forecast?&units=imperial&appid=30562882ec7f07e040737c8e9bf783be&q=" +
          "&lat=" +
          latitude +
          "&lon=" +
          longitude;
  
        $.ajax({
          url: queryURL3,
          method: "GET"
          // Store current uvIndex data
        }).then(function(uvIndex) {
    
            var uvIndexDisplay = $("<button>");
    
            $("#current-uv").text("UV Index: ");
            $("#current-uv").append(uvIndexDisplay.text(uvIndex[0].value));
            
            //colour code UV index value
            if (uvIndex[0].value >= 6){
            uvIndexDisplay.addClass("btn uv-index-high");
            } else if (uvIndex[0].value >= 3 && uvIndex[0].value <6) {
            uvIndexDisplay.addClass("btn uv-index-med")
            } else {
            uvIndexDisplay.addClass("btn uv-index-low")
            }


            $.ajax({
              url: queryURL2,
              method: "GET"
            // Store forecast data
          }).then(function(forecast) {

            // Loop through the forecast list array
            for (var i = 6; i < forecast.list.length; i += 8) {
              var forecastDate = $("<h5>");
  
              var forecastPosition = (i + 2) / 8;
  
              $("#forecast-date" + forecastPosition).empty();
              $("#forecast-date" + forecastPosition).append(
                forecastDate.text(nowMoment.add(1, "days").format("M/D/YYYY"))
              );
  
              var forecastIcon = $("<img>");
              forecastIcon.attr(
                "src",
                "https://openweathermap.org/img/w/" +
                  forecast.list[i].weather[0].icon +
                  ".png"
              );
  
              $("#forecast-icon" + forecastPosition).empty();
              $("#forecast-icon" + forecastPosition).append(forecastIcon);
  
              $("#forecast-temp" + forecastPosition).text(
                "Temp: " + forecast.list[i].main.temp + " °F"
              );
              $("#forecast-humidity" + forecastPosition).text(
                "Humidity: " + forecast.list[i].main.humidity + "%"
              );
  
              $(".forecast").attr(
                "style",
                "background-color:white; color:#6f42c1"
              );
            }
          });
        });
      });
  }
  
  $(document).ready(function() {
    var citySearchListStringified = localStorage.getItem("citySearchList");
  
    var citySearchList = JSON.parse(citySearchListStringified);
  
    if (citySearchList == null) {
      citySearchList = {};
    }
  
    createCityList(citySearchList);
  
    $("#current-weather").hide();
    $("#forecast-weather").hide();
  
  
  
    $("#search-button").on("click", function(event) {
      event.preventDefault();
      var city = $("#city")
        .val()
        .trim()
        .toLowerCase();
  
      if (city != "") {
      
        citySearchList[city] = true;
      localStorage.setItem("citySearchList", JSON.stringify(citySearchList));
  
      populateCityWeather(city, citySearchList);
  
      $("#current-weather").show();
      $("#forecast-weather").show();

      
      }
  
      
    });
  
    $("#city-list").on("click", "button", function(event) {
      event.preventDefault();
      var city = $(this).text();
  
      populateCityWeather(city, citySearchList);
  
      $("#current-weather").show();
      $("#forecast-weather").show();
    });
  });
  