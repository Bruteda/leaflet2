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

    // console.log(result)



    // console.log(url + key + originlat + originlng + format);

}