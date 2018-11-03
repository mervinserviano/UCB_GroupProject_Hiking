
    var lat;
    var long;

    // function getLocation() {
    //     if (navigator.geolocation) {
    //         navigator.geolocation.getCurrentPosition(showPosition);
    //     } else {
    //         console.log("Geolocation is not supported by this browser.");
    //     }
    // }
    // function showPosition(position) {
    //     // console.log("Latitude: " + position.coords.latitude +
    //     //     "Longitude: " + position.coords.longitude);

    //     lat = position.coords.latitude;
    //     long = position.coords.longitude;
    //     console.log(long,lat)
    //     makeCall(long, lat)
    // }

    // getLocation()

    // var APIKey = "166a433c57516f51dfab1f7edaed8413";
    // var locationZip = zip=94102,us
    // var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + locationZip + "&appid=" + APIKey;

    // var place = prompt('Enter a City or Town: ').toLowerCase().trim();
    // var country = prompt('Enter a Country or State Initials: ').toLowerCase().trim();



    function callGeo(place) {
        $.ajax({

            url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + place + '&key=AIzaSyCd001KkrxyfVaMHMnO9UUbZYHN6ZTU3RQ',
            method: "GET",
            type: "json"
        }).then(function (response) {
            console.log(response)
            // console.log(response.results[0].geometry.location)
            // console.log(response.results[0].geometry.location.lng)
            var latGeo = response.results[0].geometry.location.lat
            var longGeo = response.results[0].geometry.location.lng
            callHiking(latGeo, longGeo)
        });
    }


    function callHiking(latGeo, longGeo) {
        $.ajax({
        // url: 'https://data.sfgov.org/api/views/u2ac-gv9v/rows.xml',
        url: 'https://www.hikingproject.com/data/get-trails?lat=' + latGeo + '&' + 'lon=' + longGeo + '&maxDistance=10&key=200381349-b66dbdd97d00ee3c460e33b5beb94b9f',
        method: "GET",
        type: "json"
    }).then(function (response) {
        console.log('Trails')
        console.log(response)

    // var trails = response.trails[0]
    // var name = trails.name
    // var difficulty = trails.difficulty

    // console.log("Name: " + name)
    // console.log("Difficulty: " + difficulty)

    // for (var i = 0; i < trails.length; i++) {//loop through data for needed responses
    //   var rating = response[i].rating;//rating
    //   var stillURL = response[i].images.fixed_height_still.url;//image
    //   var animateURL = response[i].images.fixed_height.url;//Animate
    //   var content = $("<div class='content'>");
    //   var ratingP = $("<p>").text("Rating: " + rating);
    //   var image = $("<img class='image'>").attr({
    //     "src" : stillURL,
    //     "data-still" : stillURL,
    //     "data-animate" : animateURL
    //   });
      

       
        if(response.trails.length === 0) {
            console.log("No Trails Here. Search in a different location.")
        }else {
            var latitude = response.trails[0].latitude;
            var longitude = response.trails[0].longitude;
            callWeather(latitude, longitude)
            for(var i=0; i < response.trails.length; i++) {
                
                if((i % 3) === 0) {
                var row = $('<div class="row justify-content-center">');
                $("#results").append(row);
                var col = $('<div class="col-lg-4">');
                $(row).append(col);
                var cardBody = $('<div class="card mt-5" style="width: 18rem;">');
                $(col).append(cardBody)
                var cardImg = $('<img class="card-img-top">');
                cardImg.attr('src', response.trails[i].imgSmallMed)
                $(cardBody).append(cardImg);
                }else {
                  
                var col = $('<div class="col-lg-4">');
                $(row).append(col);
                var cardBody = $('<div class="card mt-5" style="width: 18rem;">');
                $(col).append(cardBody)
                var cardImg = $('<img class="card-img-top">');
                cardImg.attr('src', response.trails[i].imgSmallMed)
                $(cardBody).append(cardImg);
                }
                
            }
        }
        
    });
    }

    var days = 16;

    function callWeather(lat, lon){
        $.ajax({ //api.openweathermap.org/data/2.5/forecast/daily?lat=35&lon=139&cnt=10
        url: "https://api.openweathermap.org/data/2.5/forecast/daily?lat=" + lat + "&lon=" + lon + "&units=imperial&cnt=" + days + "&appid=166a433c57516f51dfab1f7edaed8413",
        method: "GET",
        type: "json"

    }).then(function (response) {
        console.log(response)
        var resp = response.list// 0 is today. Actual response is reponse of var days.
        console.log(resp.length)

        //TODO return next xx days of weather
        for (var i = 0; i < resp.length; i++) {
            console.log("Date: " + aryDates[i])
            console.log("min temp: " + resp[i].temp.min) //return the daily min or use max
            console.log("max temp: " + resp[i].temp.max) //return the daily min or use max
            console.log("icon: " + resp[i].weather[0].icon) //will return weather description eg "light rain"
            console.log("Description: " + resp[i].weather[0].description) //will return weather description eg "light rain"
        }
        
        // Weather returns 0-xx days, where day 0 is today. 
        // Return min/max temp
//TODO icon reference to our own icons

//TODO getDay() eg Saturday = 6. Use arry of the week 


        });
    }

    // callGeo()

    function GetDates(startDate, daysToAdd) {
    var aryDates = [];

    for(var i = 0; i <= daysToAdd; i++) {
        var currentDate = new Date();
        currentDate.setDate(startDate.getDate() + i);
        aryDates.push(DayAsString(currentDate.getDay()) + ", " + currentDate.getDate() + " " + MonthAsString(currentDate.getMonth()) + " " + currentDate.getFullYear());
    }
    
    return aryDates;
}

function MonthAsString(monthIndex) {
    var d=new Date();
    var month=new Array();
    month[0]="January";
    month[1]="February";
    month[2]="March";
    month[3]="April";
    month[4]="May";
    month[5]="June";
    month[6]="July";
    month[7]="August";
    month[8]="September";
    month[9]="October";
    month[10]="November";
    month[11]="December";
    
    return month[monthIndex];
}

function DayAsString(dayIndex) {
    var weekdays = new Array(7);
    weekdays[0] = "Sunday";
    weekdays[1] = "Monday";
    weekdays[2] = "Tuesday";
    weekdays[3] = "Wednesday";
    weekdays[4] = "Thursday";
    weekdays[5] = "Friday";
    weekdays[6] = "Saturday";
    
    return weekdays[dayIndex];
}

var startDate = new Date();
var aryDates = GetDates(startDate, 15);
var aryLen = aryDates.length
console.log(aryDates);


    var input;
    function initialize() {
        input = document.getElementById('searchTextField');
        var options = {
            types: ['geocode']
        };
        var autocomplete = new google.maps.places.Autocomplete(input, options);

    }
    google.maps.event.addDomListener(window, 'load', initialize);

    function consoleMe() {
        var inputer = $(input).val().split(" ");
        var secondLast = inputer.indexOf(inputer[inputer.length - 2])
        var last = inputer.indexOf(inputer[inputer.length - 1])
        inputer.splice(last, last)

        var inputer = inputer.join().concat().replace(/,/g, "")

        console.log(inputer)
        callGeo(inputer)
    }