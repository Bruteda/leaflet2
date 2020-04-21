const getStops = async (lat, lng) => {

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

    // console.log(result)



    // console.log(url + key + originlat + originlng + format);

    return result

}

const getWeather = async (lat, lng) => {


    //create weather url base on lat lng    
    let url = "http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lng + "&units=metric&appid=25f4530d6bd98eb444ce6b94f8db1ef8";
    let result;

    await $.getJSON(url, function (jsondata) {
        result = jsondata
        console.log(jsondata)
        //        return jsondata.name;// createWeatherPopUp(latLngObj,jsondata);           
    });

    return result


}

const getBing = async (lat, lng) => {
    let key = "ArQEgHCXdaLDpsAXiFPdAKdNbSPJw7uTSnFRr2wx4apGHstZE8dG2lFjxH3l4xNM"
    let url = "http://dev.virtualearth.net/REST/v1/Routes/LocalInsights?waypoint=" + lat + "," + lng + "&maxTime=10&timeUnit=minutes&type=EatDrink&key=" + key
    let result;

   await $.getJSON(url, function (jsondata) {
        result= jsondata.resourceSets[0].resources[0].categoryTypeResults[0].entities;// createWeatherPopUp(latLngObj,jsondata);           
    });



   return result;

}