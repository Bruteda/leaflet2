/*
    Script som hanterar kartan, kartans lager med markers och popups.

*/


//Skapa upp kartan med center på borlänge.
let map = L.map('mapid').setView([60.60811, 15.628738], 13);


// De olika lagren
let butikLayer = L.layerGroup();
let ombudLayer = L.layerGroup();
let stopLayer = L.layerGroup();
let barLayer = L.layerGroup();


//Körfunktion
const onLoad = async() => {

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


    //Hämtar data från json
    await $.getJSON('shops.json', (json) => {

        data = json;
    });


    //Sätter ut markers
    for (let i = 0; i < data.features.length; i++) {

        const element = data.features[i];

        let markerIcon;

        //Marker efter Butik/Ombud
        if (element.properties.Typ == 'Butik') {
            markerIcon = new L.Icon({
                iconUrl: './img/butikIcon.png', //sökväg

                iconSize: [30, 50], //Storlek
                iconAnchor: [15, 50], //vart på bilden koordinaten ska vara
                popupAnchor: [0, -50] //vart på bilen popupen ska sitta 
            });


        } else {
            markerIcon = new L.Icon({
                iconUrl: './img/ombudIcon.png',

                iconSize: [30, 50],
                iconAnchor: [10, 50],
                popupAnchor: [0, -50]
            });

        }


        let marker = L.marker([element.geometry.coordinates[1], element.geometry.coordinates[0]], { icon: markerIcon })

        if (element.properties.Typ == 'Butik') {

            marker.addTo(butikLayer)

        } else {
            marker.addTo(ombudLayer)

        }


        let popup = createPopup(element);

        //EventListener för att uppdatera väder och bing.
        marker.on('click', async() => {


            let weather = await getWeather(element.geometry.coordinates[1], element.geometry.coordinates[0])


            let tmp = popup.getElementsByClassName("weatherp")[0]
            tmp.innerHTML = "<strong>Väder</strong><br>The temp is " + weather.temp + "&#8451 and " + weather.description;

            let bing = await getBing(element.geometry.coordinates[1], element.geometry.coordinates[0])

            let div = document.getElementById('bingContainer');
            div.innerHTML = "";
            tmpH = document.createElement('h4')
            tmpH.innerHTML = "Barer i närheten";
            div.appendChild(tmpH);

            for (let i = 0; i < bing.length; i++) {
                const bar = bing[i];
                let row = document.createElement("h5");


                // Eventlistener för att visa marker för bar.
                row.addEventListener('click', (event) => {

                    barLayer.clearLayers();
                    let barMarker = L.marker([bar.latitude, bar.longitude])
                    barMarker.addTo(barLayer);

                })

                // Skriver ut bar med listpunkt före
                row.innerHTML = "&#8226 " + bar.entityName;
                div.appendChild(row);

            }

        });
        marker.bindPopup(popup)
    }
    butikLayer.addTo(map);
    ombudLayer.addTo(map);
    barLayer.addTo(map);

    // Lagerhantering
    var overlays = {
        "Butik": butikLayer,
        "Ombud": ombudLayer
    };
    L.control.layers(overlays).addTo(map);

};

/*
    Funktion  för att skapa huvud-popup
*/

const createPopup = (feature) => {

    let container = document.createElement('div');

    let header = document.createElement('h4')
    header.innerHTML = feature.properties.Namn

    let img = document.createElement('img');

    if (feature.properties.Typ == 'Ombud') {
        img.src = './img/ombud.png'
    } else {
        img.src = './img/butik.png'
    }

    img.width = 200;

    let infoContainer = document.createElement('div');
    infoContainer.classList.add('col-12')
    infoContainer.style.maxHeight = "50px";


    let namn = document.createElement('p')
    namn.innerHTML = "<strong>Adress</strong><br>" + feature.properties.Adress + "<br> " + feature.properties.PostNr + " " + feature.properties.PostOrt + "<br> Tel: " + feature.properties.Tel;

    let tider = document.createElement('table')
    let open = document.createElement('p')
    open.style.margin = "0px";
    open.innerHTML = "<strong>Öppettider</strong><br>"
    tider.classList.add('table')
    let timediv = document.createElement('div')
    timediv.classList.add('overflow-auto')
    timediv.appendChild(tider)
    timediv.style.height = "100px";
    let tbody = document.createElement('tbody')
    tider.appendChild(tbody)

    for (let i = 0; i < feature.properties.Tider.length; i++) {
        const element = feature.properties.Tider[i];
        let row = document.createElement('tr')
        let date = document.createElement('td')
        let time = document.createElement('td')
        let tmp = element.split(";")
        date.innerHTML = tmp[0];

        //Hanterar stängda dagar
        if (tmp[1] != '00:00') {
            time.innerHTML = tmp[1] + '-' + tmp[2];

        } else {
            time.innerHTML = 'Stängt';

        }


        row.appendChild(date);
        row.appendChild(time);
        tbody.appendChild(row);

    }


    let wp = document.createElement('p')
    wp.classList.add("weatherp")

    let button = document.createElement('button');
    button.innerHTML = "Hållplatser i närheten";
    button.classList.add('btn');

    button.classList.add('btn-outline-secondary');

    // Eventlistener som visar hållpatser
    button.addEventListener('click', (event) => {

        createStops(feature.geometry.coordinates[1], feature.geometry.coordinates[0]);
        map.closePopup();
        map.setView([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], zoom = 15)

    });


    infoContainer.appendChild(namn)
    container.appendChild(img)
    container.appendChild(header)
    container.appendChild(namn)

    // Finns inga öppettider på ombud.
    if (feature.properties.Typ != "Ombud") {
        container.appendChild(open)
        container.appendChild(timediv)
    }
    container.appendChild(wp)
    container.appendChild(button)
    return container

}

/*
    Funktion som skapar popup för hållplatser
*/
const createStopPopUp = async(stopNamn) => {

    let container = document.createElement('div');
    container.style.minWidth = "50px";
    let rubrik = document.createElement('h4');
    rubrik.innerHTML = stopNamn;

    let table = document.createElement('table');
    table.classList.add("timestable");

    table.innerHTML = "<thead><tr><th>Linje</th><th>Mot</th><th>Kl</th></tr></thead>"


    container.appendChild(rubrik)
    container.appendChild(table);

    return container;
}

/*
    Funktion som skapar markers för hållplatser.
*/

const createStops = async(lat, lng) => {

    let stops = await getStops(lat, lng)

    stopLayer.clearLayers();

    for (let i = 0; i < stops.StopLocation.length; i++) {
        const stop = stops.StopLocation[i];


        let markerIcon = new L.Icon({
            iconUrl: './img/bussIcon.png',

            iconSize: [20, 50],
            iconAnchor: [10, 50],
            popupAnchor: [0, -50]
        });

        let stopMarker = L.marker([stop.lat, stop.lon], { icon: markerIcon });
        let tmpPop = await createStopPopUp(stop.name);

        stopMarker.bindPopup(tmpPop);


        //Eventlistener för hållpats popup
        stopMarker.on('click', async() => {
            let stopTimes = await getStopTimes(stop.id);
            let tmp = tmpPop.getElementsByClassName("timestable")[0]

            for (let i = 0; i < stopTimes.length; i++) {
                const stop = stopTimes[i];
                let row = document.createElement('tr');

                let lcell = document.createElement('td')
                lcell.innerHTML = stop.linje;
                let mcell = document.createElement('td')
                mcell.innerHTML = stop.mot;
                let tcell = document.createElement('td')
                tcell.innerHTML = stop.tid;

                row.appendChild(lcell);
                row.appendChild(mcell);

                row.appendChild(tcell);
                tmp.appendChild(row);
            }

        })

        stopMarker.addTo(stopLayer);

    }

    stopLayer.addTo(map);

};