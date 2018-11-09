function callGeo(place) {
    $.ajax({

        url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + place + '&key=AIzaSyCUNqCpU6lMg4FNWeTPhOT-fY1u8g2YACk',
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

    $("#results").empty();
    $("#weather").empty();
    $("#searchTextField").val("");
   
    if(response.trails.length === 0) {
        console.log("No Trails Here. Search in a different location.")
    }else {
        var latitude = response.trails[0].latitude;
        var longitude = response.trails[0].longitude;
        callWeather(latitude, longitude)
        for(var i=0; i < response.trails.length; i++) {
            
            if((i % 3) === 0) {
            var row = $('<div class="row">');
            $("#results").append(row);
            var col = $('<div class="col-lg-4">');
            $(row).append(col);
            var cardCon = $(`<div class="card mt-2" style="width: 23rem;">
            <div class="card-body">
            <div class="container">
            <img class="card-img-top" src="${isImageNull(response.trails[i].imgSmallMed)}"
                alt="Card image cap">
                <div class="name-title">${response.trails[i].name}</div>
            </div>
            </div>
            <div>
                <ul class="list-group list-group-flush trailCards">
                    <li class="list-group-item">Status: ${response.trails[i].conditionStatus}</li>
                    <li class="list-group-item">Summary: ${response.trails[i].summary}</li>
                    <li class="list-group-item">Difficulty: ${response.trails[i].difficulty}</li>
                    <li class="list-group-item">Stars: ${response.trails[i].stars}</li>
                </ul>
            </div>
        </div>
            </div>`);
            $(col).append(cardCon)
          
            }else {
            var col = $('<div class="col-lg-4">');
            var cardCon = $(`<div class="card mt-2" style="width: 23rem;">
            <div class="card-body">
            <div class="container">
            <img class="card-img-top" src="${isImageNull(response.trails[i].imgSmallMed)}"
                alt="Card image cap">
                <div class="name-title">${response.trails[i].name}</div>
            </div>
            </div>
            <div>
                <ul class="list-group list-group-flush trailCards">
                    <li class="list-group-item">Status: ${response.trails[i].conditionStatus}</li>
                    <li class="list-group-item">Summary: ${response.trails[i].summary}</li>
                    <li class="list-group-item">Difficulty: ${response.trails[i].difficulty}</li>
                    <li class="list-group-item">Stars: ${response.trails[i].stars}</li>
                </ul>
            </div>
        </div>
            </div>`);
            $(col).append(cardCon)
            $(row).append(col)
            }
            
        }
    }
   

});
}

function isImageNull(img) {
        // console.log("this is img " + img);
        var altImage = 'https://images.pexels.com/photos/775201/pexels-photo-775201.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260';
        if (img === "") {return altImage} // Checks if urltoImg is null otherwise error will occurr with isHttp substr value below
        var isHttp = img.substr(0, 4) //Sometimes this is null which affects below
        console.log(isHttp);
        
        if (img === "") {
            return altImage
        }else if (isHttp !== 'http') {
            return altImage
        }else {
            return img
        }
    }

var days = 7;

function callWeather(latitude, longitude){
    $.ajax({ //api.openweathermap.org/data/2.5/forecast/daily?lat=35&lon=139&cnt=10
    url: "https://api.openweathermap.org/data/2.5/forecast/daily?lat=" + latitude + "&lon=" + longitude + "&units=imperial&cnt=" + days + "&appid=166a433c57516f51dfab1f7edaed8413",
    method: "GET",
    type: "json"

}).then(function (response) {
    console.log(response)
    var resp = response.list// 0 is today. Actual response is reponse of var days.
    // console.log(resp.length)

    for (var i = 0; i < resp.length; i++) {
        var minTemp = (Math.round(resp[i].temp.min))
        var maxTemp = (Math.round(resp[i].temp.max))
        var aveTemp = ((maxTemp + minTemp)/2);
        
        var weatherCon = $(`
                <div class="col text-center">
                    <ul  class="list-group list-group-flush">
                        <li>${aryDates[i]}</li>
                        <li>${aveTemp}F <img class="weatherIcon" src="http://openweathermap.org/img/w/${resp[i].weather[0].icon}.png"></li>
                    </ul>
                </div>`);
        $('#weather').append(weatherCon)
        //TODO reformat

    } //weather icons can be pulled: http://openweathermap.org/img/w/10d.png

    // var quote = $(`
    //         <div id="quote" class="row mb-2 mt-2" style="background-color: yellow;">
    //             <div class="col-lg-12 text-center">
    //                 <h2>The mountains are calling and I must go.</h2>
    //             </div>
    //         </div>`);

    });
}

// callGeo()

function GetDates(startDate, daysToAdd) {
    var aryDates = [];

    for(var i = 0; i <= daysToAdd; i++) {
        var currentDate = new Date();
        currentDate.setDate(startDate.getDate() + i);
        aryDates.push(DayAsString(currentDate.getDay()) + ", " + MonthAsString(currentDate.getMonth()) + " " + currentDate.getDate() );
    }
    
    return aryDates;
}

function MonthAsString(monthIndex) {
    var d=new Date();
    var month=new Array();
    month[0]="Jan";
    month[1]="Feb";
    month[2]="Mar";
    month[3]="Apr";
    month[4]="May";
    month[5]="Jun";
    month[6]="Jul";
    month[7]="Aug";
    month[8]="Sep";
    month[9]="Oct";
    month[10]="Nov";
    month[11]="Dec";
    
    return month[monthIndex];
}

function DayAsString(dayIndex) {
    var weekdays = new Array(7);
    weekdays[0] = "Sun";
    weekdays[1] = "Mon";
    weekdays[2] = "Tue";
    weekdays[3] = "Wed";
    weekdays[4] = "Thu";
    weekdays[5] = "Fri";
    weekdays[6] = "Sat";
    
    return weekdays[dayIndex];
}

var startDate = new Date();
var aryDates = GetDates(startDate, 7);
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


$("#searchTextField").keyup(function(event) {
    if (event.keyCode === 13) {
        consoleMe();
    }
});  


function consoleMe() {
    var inputer = $(input).val().split(" ");
    var secondLast = inputer.indexOf(inputer[inputer.length - 2])
    var last = inputer.indexOf(inputer[inputer.length - 1])
    inputer.splice(last, last)

    var inputer = inputer.join().concat().replace(/,/g, "")

    console.log(inputer)
    callGeo(inputer)
    $('#weather').removeClass('invisible');
}