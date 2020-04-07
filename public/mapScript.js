let first;


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

    await $.getJSON('http://localhost:3000/shops/', (data) => {
        first = data;
    })

    L.geoJSON(first, {
        style: (feature) => {
            return {
                color: "#000000"
            }

        }

    }).addTo(map);



    let lineCoords = [];

    for (let i = 0; i < data.length; i++) {
        const element = data[i];

        lineCoords.push([element.coo])

    }

};