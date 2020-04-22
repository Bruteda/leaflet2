const xml2js = require('xml2js');
const fs = require('fs');
const parser = new xml2js.Parser({ attrkey: "ATTR" });
//const jq = require('jquery')

const proj4 = require('proj4');

proj4.defs([
    ['EPSG:4326', "+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees"],
    ['EPSG:3021', '+ellps=GRS80 +proj=tmerc +lon_0=15.80628 +x_0=1500064.274 +y_0=-667.711 +k=1.00000561024']
]);

// this example reads the file synchronously
// you can read it asynchronously also
let xml_string = fs.readFileSync("shops.xml", "utf8");


const clean = (input) => {

    return input[0].replace(/[\n\r\t]/g, '');
};

const converter = (x, y) => {
    let sourcet = 'EPSG:3021'; //Sveriges EPSG:3006
    let target = 'EPSG:4326'; //'EPSG:4326 är WGS84

    // console.log(x, y)

    try {
        let out = proj4(sourcet, target, [Number(y), Number(x)]);
        return out
    } catch (error) {
        console.log(error)
    }


};





const parsed = parser.parseString(xml_string, (error, result) => {
    if (error === null) {

        //console.log((Array)(result.ButikerOmbud.ButikOmbud).length);

        let list = result.ButikerOmbud.ButikOmbud;


        let out = {
            type: "FeatureCollection",
            features: []
        }

        for (let i = 0; i < list.length; i++) {

            let str = clean(list[i].Oppettider);
            // console.log(str);
            let arr = str.split('_*');
            for (let i = 0; i < arr.length; i++) {
                arr[i] = arr[i].slice(0, 22);

            }

            //console.log(arr)

            let element = {
                type: "Feature",
                properties: {
                    Nr: clean(list[i].Nr),
                    Typ: clean(list[i].Typ),
                    Namn: clean(list[i].Namn),
                    Adress: clean(list[i].Address1),
                    PostNr: clean(list[i].Address3),
                    PostOrt: clean(list[i].Address4),

                    Tider: arr

                },
                geometry: {
                    type: "Point",
                    coordinates: converter(clean(list[i].RT90x), clean(list[i].RT90y))

                }
            }

            if (element.properties.Namn == "") {
                element.properties.Namn = "Systembolaget"
            }
            if (list[i].Telefon != undefined) {
                element.properties.Tel = clean(list[i].Telefon)

            }


            out.features.push(element);
        }

        let data = JSON.stringify(out);
        fs.writeFileSync('shopstmp.json', data);

    } else {
        console.log(error);
    }
});