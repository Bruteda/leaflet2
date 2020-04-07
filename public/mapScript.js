const onLoad = async() => {

    let map = L.map('mapid').setView([60.487, 15.409], 13); //create the map layer 
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
            '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1
    }).addTo(map);

    let data = [];

    await $.getJSON('http://localhost:3000/shops/', (json) => {

        // console.log(json.features)
        data = json;
    });

    console.log(data)

    var geojsonMarkerOptions = {
        radius: 20,
        fillColor: "#ff7800",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };

    // L.geoJSON(data).addTo(map)

    for (let i = 0; i < data.features.length; i++) {
        const element = data.features[i];
        console.log()
        let marker = L.geoJSON(element, {
            pointToLayer: (feature, latlng) => {


                if (feature.properties.Typ === 'Ombud') {
                    geojsonMarkerOptions.fillColor = '#FFFFFF'

                }
                //return L.marker(latlng, geojsonMarkerOptions).addTo(map);
                return L.circleMarker(latlng, geojsonMarkerOptions);
            }

        }).addTo(map);

        marker.bindPopup(element.properties.Namn);


    }




};

const onEachPoint = () => {

    console.log("jupp   ")

}