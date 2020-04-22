const getStops = async(lat, lng) => {

    let url = "https://api.resrobot.se/v2/location.nearbystops"
    let key = '?key=f9c62a70-febe-4b47-8e9a-f04ad9933cb0'

    // console.log(lat)
    // console.log(lat.toString())

    // console.log(lng)
    // console.log(lng.toString())

    let originlat = '&originCoordLat=' + lat.toString()

    let originlng = '&originCoordLong=' + lng.toString()
    let format = '&format=json'

    let result = await $.getJSON(url + key + originlat + originlng + format);

    return result

}

const getWeather = async(lat, lng) => {

    let key = "734aed7e08090b56e92a8cafc5dc29a0";

    //create weather url base on lat lng    

    let url = "http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lng + "&units=metric&appid=" + key;
    let result;
    let out = {};

    await $.getJSON(url, function(jsondata) {
        result = jsondata
            //console.log(jsondata)
            //        return jsondata.name;// createWeatherPopUp(latLngObj,jsondata);           
    });

    console.log(result.main.temp)
    console.log(result.weather[0].description)
    out.temp = result.main.temp;

    out.description = result.weather[0].description;

    return out;


}

const getBing = async(lat, lng) => {
    let key = "ArQEgHCXdaLDpsAXiFPdAKdNbSPJw7uTSnFRr2wx4apGHstZE8dG2lFjxH3l4xNM"
    let url = "http://dev.virtualearth.net/REST/v1/Routes/LocalInsights?waypoint=" + lat + "," + lng + "&maxTime=10&timeUnit=minutes&type=EatDrink&key=" + key
    let result;

    await $.getJSON(url, function(jsondata) {
        result = jsondata.resourceSets[0].resources[0].categoryTypeResults[0].entities; // createWeatherPopUp(latLngObj,jsondata);           
    });



    return result;

}

const getStopTimes = async(stopid) => {

    console.log(stopid)

    let key = 'f9c62a70-febe-4b47-8e9a-f04ad9933cb0'
    let url = "https://api.resrobot.se/v2/departureBoard?key=16d90b39-6776-480b-8329-937ac64dff54&id=" + stopid + "&maxJourneys=5&format=json";

    let times = await $.getJSON(url)

    let out = [];

    // console.log(times.Departure)

    for (let i = 0; i < times.Departure.length; i++) {
        const dep = times.Departure[i];
        //   console.log(dep)
        let outDep = {
            linje: dep.Product.num,
            mot: dep.direction,
            tid: dep.time
        };

        out.push(outDep);

    }

    return out;
}