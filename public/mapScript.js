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

    let butikLayer = L.layerGroup();
    let ombudLayer = L.layerGroup();

    for (let i = 0; i < data.features.length; i++) {

        const element = data.features[i];


        let marker = L.geoJSON(element, {
            pointToLayer: (feature, latlng) => {

                if (feature.properties.Typ === 'Ombud') {
                    geojsonMarkerOptions.fillColor = '#FFFFFF'
                    return L.circleMarker(latlng, geojsonMarkerOptions);

                }
            }

        })

        // console.log(element.properties.Typ == 'Butik')

        if (element.properties.Typ == 'Butik') {
            //console.log(element)
            marker.addTo(butikLayer)

        } else {
            marker.addTo(ombudLayer)

        }


        marker.bindPopup(createPopup(element));


    }

    //console.log(butikLayer);

    butikLayer.addTo(map);
    ombudLayer.addTo(map);



    //overlay of layergroups
    var overlays = {
        "Butik": butikLayer,
        "Ombud": ombudLayer
    };
    //Creates a layers control with the given layers.  
    // overlays will be switched with checkboxes.
    L.control.layers(overlays).addTo(map);


    /*
    for (let i = 0; i < data.features.length; i++) {
        const element = data.features[i];
    
        let marker = L.geoJSON(element, {
            pointToLayer: (feature, latlng) => {

                if (feature.properties.Typ === 'Ombud') {
                    geojsonMarkerOptions.fillColor = '#FFFFFF'
                    return L.circleMarker(latlng, geojsonMarkerOptions);

                }
            }

        }).addTo(map);


        marker.bindPopup("<h1>" + element.properties.Namn + "</h1>" +
            "<h2>" + element.properties.Typ + "</h2>");


    }

*/




};




const createPopup = (feature) => {

    let container = document.createElement('div');
    container.classList.add('container');

    let header = document.createElement('h1')
    header.innerHTML = feature.properties.Nr


    let img = document.createElement('img');
    img.src = './img/butik.png'



    let namn = document.createElement('p')
    namn.innerHTML = feature.properties.Namn;



    container.appendChild(header)
    container.appendChild(img)
    container.appendChild(namn)
    return container

}


const onEachPoint = () => {

    console.log("jupp   ")

}