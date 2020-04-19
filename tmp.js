<
html > < body >
    <
    h1 > Sveriges alla Systembolagsombud och - butiker < /h1> <
    div id = "mapdiv" > < /div> <
    script src = "http://www.openlayers.org/api/OpenLayers.js" > < /script> <
    script src = "https://ajax.googleapis.com/ajax/libs/jquery/3.2.0/jquery.min.js" > < /script> <
    script src = "https://cdnjs.cloudflare.com/ajax/libs/proj4js/2.4.3/proj4.js" > < /script> <
    script > < /script>

//läs mer om jquery xml vs xpath https://www.ibm.com/developerworks/library/x-xpathjquery/
map = new OpenLayers.Map("mapdiv");
map.addLayer(new OpenLayers.Layer.OSM());
//60.451910
//16.031998
// -0.1279688 ,51.5077286
//initierar kartan runt Säter
var lonLat = new OpenLayers.LonLat(16.031998, 60.451910)
    .transform(
        new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
        map.getProjectionObject() // to Spherical Mercator Projection
    );

var zoom = 8;
//skapar ett lager av markers som jag kan lägga enskilda markers på
var markers = new OpenLayers.Layer.Markers("Markers");
var antal = 0; //hur många butiker och ombud det finns. 
//läser in xml data
$.get("butiker.xml", function(xmldata) {
    //hämtar in alla ombud/butiker
    $ombud = xmldata.getElementsByTagName("ButikOmbud");
    antal = $ombud.length;
    //sätter projektioner kolla omräking här https://geosupportsystem.wordpress.com/2016/05/24/omvandla-koordinater-med-javaskript/	
    proj4.defs([
        ['EPSG:4326', "+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees"],
        ['EPSG:3021', '+ellps=GRS80 +proj=tmerc +lon_0=15.80628 +x_0=1500064.274 +y_0=-667.711 +k=1.00000561024']
    ]);
    //+proj=tmerc +lat_0=0 +lon_0=15.80827777777778 +k=1 +x_0=1500000 +y_0=0 +ellps=bessel +units=m +no_defs
    //+ellps=GRS80 +proj=tmerc +lon_0=15.80628 +x_0=1500064.274 +y_0=-667.711 +k=1.00000561024
    //läste detta om detta här http://www.geocaching.se/forum/viewtopic.php?f=4&t=1530
    let sourcet = 'EPSG:3021'; //Sveriges EPSG:3006
    let target = 'EPSG:4326'; //'EPSG:4326 är WGS84
    //EPSG:2400+proj=tmerc +lat_0=0 +lon_0=15.80827777777778 +k=1 +x_0=1500000 +y_0=0 +ellps=bessel +units=m +no_defs
    //'EPSG:3021','+proj=tmerc +lat_0=0 +lon_0=15.80827777777778 +k=1 +x_0=1500000 +y_0=0 +ellps=bessel +units=m +no_defs'
    //hämt projektsiton string här i från
    //http://spatialreference.org/ref/epsg/3006/
    //loopar alla ombud/butiker

    $.each($ombud, function(idx, element) {
        //hämtar in koordinat för ombudet/butiken

        let RT90x = element.getElementsByTagName("RT90x")[0].textContent;
        let RT90y = element.getElementsByTagName("RT90y")[0].textContent;
        //gör beräkning från rt90 till wgs84 eg till latlon som openmapkartan stödjer
        let result = proj4(sourcet, target, [RT90y, RT90x]);
        //Skapar ett latlon objekt baserat på omräkning från rt90 till wgs80
        let LATLNG = new OpenLayers.LonLat(result[0], result[1]).transform(
            new OpenLayers.Projection("EPSG:4326"), //EPSG:4326 är WGS84
            map.getProjectionObject() // to Spherical Mercator Projection
        );
        //skapar en marker på/med denna latlong      		
        let marker = new OpenLayers.Marker(LATLNG);

        //marker.icon="https://svn.openstreetmap.org/applications/share/map-icons/svg/shopping/beverages.svg";  
        //skapar klickhändelse för marken
        marker.events.register('mouseover', marker, function(e) {
            //läser in olika data om ombudet/butiken
            let telefon = element.getElementsByTagName("Telefon")[0].textContent;
            let namn = element.getElementsByTagName("Namn")[0].textContent;
            let adress = element.getElementsByTagName("Address1")[0].textContent;
            let typ = element.getElementsByTagName("Typ")[0].textContent;
            //skapar det som ska stå i popuppen
            let popuptextinfo = "Typ: " + typ;
            popuptextinfo += "<br>Namn: " + namn;
            popuptextinfo += "<br>Adress: " + adress;
            popuptextinfo += "<br>Telefon:" + telefon;
            //skapar en popup som ligger på samma latlong som markern, 
            //vilket ger ett visuellt intryck av att popuppen tillhör
            //marken eftersom de ligger på samma latlong.
            var popup = new OpenLayers.Popup.FramedCloud("Popup", LATLNG, null, popuptextinfo, null, true);
            //lägger till popuppen på kartan 
            //true=stänger popupen när jag trycker på en annan
            map.addPopup(popup, true);
        }); //end register

        //lägger den skapade marken på marker lagret			
        markers.addMarker(marker);
        if (element.getElementsByTagName("Typ")[0].textContent == "Butik") {
            marker.setUrl('store1.png');
        }

    }); //end each

    $("h1").text("Sveriges alla " + (antal) + " st Systembolagsombud och -butiker");

}); //end get
//lägger markerlagret på kartan
map.addLayer(markers);
//centrerar och zommar kartan
map.setCenter(lonLat, zoom);


<
/script> <
/body></html >