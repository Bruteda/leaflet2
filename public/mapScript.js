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


    let butikLayer = L.layerGroup();
    let ombudLayer = L.layerGroup();
    let stopLayer = L.layerGroup();

    for (let i = 0; i < data.features.length; i++) {

        const element = data.features[i];

        let markerIcon;

        if (element.properties.Typ == 'Butik') {
            markerIcon = new L.Icon({
                iconUrl: './img/butikIcon.png',

                iconSize: [30, 50], // size of the icon
                // shadowSize: [50, 64], // size of the shadow
                iconAnchor: [15, 50], // point of the icon which will correspond to marker's location
                //shadowAnchor: [4, 62], // the same for the shadow
                popupAnchor: [0, -50] // point from which the popup should open relative to the iconAnchor

            });


        } else {
            markerIcon = new L.Icon({
                iconUrl: './img/ombudIcon.png',

                iconSize: [30, 50], // size of the icon
                // shadowSize: [50, 64], // size of the shadow
                iconAnchor: [10, 50], // point of the icon which will correspond to marker's location
                //shadowAnchor: [4, 62], // the same for the shadow
                popupAnchor: [0, -50] // point from which the popup should open relative to the iconAnchor

            });

        }


        let marker = L.marker([element.geometry.coordinates[1], element.geometry.coordinates[0]], { icon: markerIcon })

        if (element.properties.Typ == 'Butik') {
            //console.log(marker)
            marker.addTo(butikLayer)

        } else {
            marker.addTo(ombudLayer)

        }


        let popup = createPopup(element);


        marker.on('click', async() => {


            let weather = await getWeather(element.geometry.coordinates[1], element.geometry.coordinates[0])

            //let bing = await getBing(element.geometry.coordinates[1], element.geometry.coordinates[0])

            // console.log(bing);

            let tmp = popup.getElementsByClassName("weatherp")[0]
            tmp.innerHTML = "The temp is " + weather.temp + "&#8451 and " + weather.description;
            console.log(tmp)



        });


        marker.on('dblclick', async(event) => {

            //map.setView([element.geometry.coordinates[0], element.geometry.coordinates[1]]);

            let stops = await getStops(element.geometry.coordinates[1], element.geometry.coordinates[0])

            //console.log(event);
            stopLayer.clearLayers();

            for (let i = 0; i < stops.StopLocation.length; i++) {
                const stop = stops.StopLocation[i];


                let markerIcon = new L.Icon({
                    iconUrl: './img/bussIcon.png',

                    iconSize: [20, 50], // size of the icon
                    // shadowSize: [50, 64], // size of the shadow
                    iconAnchor: [10, 50], // point of the icon which will correspond to marker's location
                    //shadowAnchor: [4, 62], // the same for the shadow
                    popupAnchor: [0, -50] // point from which the popup should open relative to the iconAnchor

                });

                let stopMarker = L.marker([stop.lat, stop.lon], { icon: markerIcon });
                // console.log(stop)
                let tmpPop = await createStopPopUp(stop.name);

                stopMarker.bindPopup(tmpPop);

                stopMarker.on('click', async() => {
                    //console.log(stop.id)
                    let stopTimes = await getStopTimes(stop.id);
                    let tmp = tmpPop.getElementsByClassName("timestable")[0]
                    console.log(tmp)


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
                    //console.log(stopTimes)

                })

                stopMarker.addTo(stopLayer);


            }

            stopLayer.addTo(map);
            map.closePopup(popup)

        })


        marker.bindPopup(popup) //.autoPan = false;


    }
    butikLayer.addTo(map);
    ombudLayer.addTo(map);

    var overlays = {
        "Butik": butikLayer,
        "Ombud": ombudLayer
    };
    L.control.layers(overlays).addTo(map);

};




const createPopup = (feature) => {

    let container = document.createElement('div');

    let header = document.createElement('h4')
    header.innerHTML = feature.properties.Namn
        //  header.classList.add('col-6')

    let img = document.createElement('img');
    // img.classList.add('col-6')

    if (feature.properties.Typ == 'Ombud') {
        img.src = './img/ombud.png'
    } else {

        img.src = './img/butik.png'
    }

    img.width = 200;

    let infoContainer = document.createElement('div');
    infoContainer.classList.add('col-12')
    infoContainer.style.height = "50px";


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
        let temp = element.split(";")
        date.innerHTML = temp[0];
        time.innerHTML = temp[1] + '-' + temp[2];


        row.appendChild(date);
        row.appendChild(time);
        tbody.appendChild(row);
    }
    let wp = document.createElement('p')
    wp.classList.add("weatherp")

    let button = document.createElement('button');
    button.innerHTML = "Hållplatser";
    button.classList.add('btn');
    button.addEventListener('click', (event) => {
        console.log("naskdjnaösjdnö")
    });


    infoContainer.appendChild(namn)

    container.appendChild(img)
    container.appendChild(header)
    container.appendChild(namn)
    container.appendChild(open)
    container.appendChild(timediv)
    container.appendChild(wp)
    container.appendChild(button)
    return container

}


const createStopPopUp = async(stopNamn) => {

    let container = document.createElement('div');

    let rubrik = document.createElement('h4');
    rubrik.innerHTML = stopNamn;

    let table = document.createElement('table');
    table.classList.add("timestable");

    table.innerHTML = "<thead><tr><th>Linje</th><th>Mot</th><th>Kl</th></tr></thead>"

    container.appendChild(rubrik)
    container.appendChild(table);
    //   console.log(container)
    return container;
}