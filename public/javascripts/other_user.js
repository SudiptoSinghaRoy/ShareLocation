function mapinit(this_user_sharing_locations, username){
    var otherContainer = document.getElementById('other-popup');
    var otherContent = document.getElementById('other-popup-content');
    var otherCloser = document.getElementById('other-popup-closer');

    var otherOverlay = new ol.Overlay({
        element: otherContainer,
        autoPan: true,
        autoPanAnimation: {
            duration: 250,
        },
    });

    otherCloser.onclick = function () {
        otherOverlay.setPosition(undefined);
        otherCloser.blur();
        return false;
    };

    var iconPublicStyle = new ol.style.Style({
        image: new ol.style.Icon({
            anchor: [0.5, 1],
            anchorXUnits: 'fraction',
            anchorYUnits: 'fraction',
            src: 'images/public_marker.png',
            scale: 0.01
        })
    });

    var other_map = new ol.Map({
        view: new ol.View({
            center: ol.proj.fromLonLat([88.35339843750025, 22.58946741614342]),
            zoom: 7,
            maxZoom: 10,
            minZoom: 4
        }),
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            })
        ],
        overlays: [otherOverlay],
        target: 'other-js-map'
    });

    var public_location_share = this_user_sharing_locations.publicly;
    if (public_location_share.length > 0){
        public_location_share.forEach(function (latlon, i) {
            let marker = new ol.Feature({
                geometry: new ol.geom.Point(ol.proj.fromLonLat(latlon))
            });
            marker.setStyle(iconPublicStyle);
            let vectorLayer = new ol.layer.Vector({
                source: new ol.source.Vector({
                    features: [marker]
                })
            });
            vectorLayer.set("hdms", latlon);
            other_map.addLayer(vectorLayer);
        });
    }

    other_map.on('click', function(evt){
        var isFeaturePresent = other_map.hasFeatureAtPixel(evt.pixel);
        if(isFeaturePresent){
            other_map.forEachFeatureAtPixel(evt.pixel, function(feature, layer) {
                if (feature) {
                    var hdms = ol.coordinate.toStringHDMS(layer.get("hdms"),1);
                    otherContent.innerHTML = '<p>' + username +' have share this location publicly:</p><code>' + hdms + '</code>';
                    var coordinate = evt.coordinate;
                    otherOverlay.setPosition(coordinate);
                }
            });
        }
    });

}