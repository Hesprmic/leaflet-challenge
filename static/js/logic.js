
let basemap = L.tileLayer(
    'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', 
    {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

let map = L.map("map", {
    center: [50,-100],
    zoom: 4
});

basemap.addTo(map)



d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(data => {
    
    function styleInfo(feature) {
        return {
            opacity: 1,
            color: "#000000",
            fillOpacity: 1,
            fillColor: getColor(feature.geometry.coordinates[2]),
            radius: getMag(feature.properties.mag),
            weight: 0.25
        }
    }

    function getColor(depth) {
        if (depth > 90) {
            return "#ff0000"
        }
        else if (depth > 50) {
            return "#ff9900"
        }
        else if (depth > 20) {
            return "#ffff00"
        }
        return "#66ff33"
    }

    function getMag(mag) {
        if (mag === 0) {
            return 1
        }
        return mag * 3
    }

    L.geoJson(data, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng)
        },
        style: styleInfo,
        onEachFeature: function (feature, layer) {
            layer.bindPopup(
                "Magnitude: "
                + feature.properties.mag
                + "<br>Depth: "
                + feature.geometry.coordinates[2]
                + "<br>Location: "
                + feature.properties.place
            );
            }
    }).addTo(map)

    let legend = L.control({
        position: "bottomright"
    })

    legend.onAdd = function() {
        let div = L.DomUtil.create("div", "info legend");
    
        let colors = ["green", "yellow", "orange", "red"];
        let grades = [-10, 20, 50, 90];

        for (let i = 0; i < grades.length; i++){
            div.innerHTML += "<i style= 'background: " + colors[i] +"'></i>"
            + grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+")
        }
        return div
    }



    legend.addTo(map);
});
