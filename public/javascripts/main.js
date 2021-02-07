
function init(current_user_sharing_locations, location_share_with_me, all_users, current_user_id){
    var container = document.getElementById('popup');
    var content = document.getElementById('popup-content');
    var closer = document.getElementById('popup-closer');

    var saveContainer = document.getElementById('save-popup');
    var saveContent = document.getElementById('save-popup-content');
    var saveCloser = document.getElementById('save-popup-closer');

    var userList = getAllUsersExceptCurrent(all_users, current_user_id);
    /**
     * Create an overlay to anchor the popup to the map.
     */
    var overlay = new ol.Overlay({
        element: container,
        autoPan: true,
        autoPanAnimation: {
            duration: 250,
        },
    });

    var saveOverlay = new ol.Overlay({
        element: saveContainer,
        autoPan: true,
        autoPanAnimation: {
            duration: 250,
        },
    });
    
    /**
     * Add a click handler to hide the popup.
     * @return {boolean} Don't follow the href.
     */
    closer.onclick = function () {
        overlay.setPosition(undefined);
        closer.blur();
        return false;
    };

    saveCloser.onclick = function () {
        saveOverlay.setPosition(undefined);
        saveCloser.blur();
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

    var iconPrivateStyle = new ol.style.Style({
        image: new ol.style.Icon({
            anchor: [0.5, 1],
            anchorXUnits: 'fraction',
            anchorYUnits: 'fraction',
            src: 'images/private_marker.png',
            scale: 0.01
        })
    });

    var iconShareWithMeStyle = new ol.style.Style({
        image: new ol.style.Icon({
            anchor: [0.5, 1],
            anchorXUnits: 'fraction',
            anchorYUnits: 'fraction',
            src: 'images/share_with_me_marker.png',
            scale: 0.01
        })
    });
    
    
    
    var map = new ol.Map({
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
        overlays: [overlay, saveOverlay],
        target: 'js-map'
    });

    var public_location_share = current_user_sharing_locations.publicly;
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
            vectorLayer.set("sharetype", "i_share_publicly");
            vectorLayer.set("hdms", latlon);
            map.addLayer(vectorLayer);
        });
    }

    var private_location_share = current_user_sharing_locations.privately;
    var shared_users = Object.keys(private_location_share);
    if (shared_users.length > 0){
        shared_users.forEach(function (user, i) {
            private_location_share[user].forEach(function(latlon,i){
                let marker = new ol.Feature({
                    geometry: new ol.geom.Point(ol.proj.fromLonLat(latlon))
                });
                marker.setStyle(iconPrivateStyle);
                let vectorLayer = new ol.layer.Vector({
                    source: new ol.source.Vector({
                        features: [marker]
                    })
                });
                var users = getAllShareUser(private_location_share,shared_users,latlon);
                var usernameArr = getUserNameById(users,all_users);
                vectorLayer.set("sharetype", "i_share_privately");
                vectorLayer.set("username", usernameArr);
                vectorLayer.set("hdms", latlon);
                map.addLayer(vectorLayer);
            })
        })
    }

    var user_shared_with_me = Object.keys(location_share_with_me);
    if (user_shared_with_me.length > 0){
        user_shared_with_me.forEach(function (user, i) {
            location_share_with_me[user].forEach(function(latlon,i){
                let marker = new ol.Feature({
                    geometry: new ol.geom.Point(ol.proj.fromLonLat(latlon))
                });
                marker.setStyle(iconShareWithMeStyle);
                let vectorLayer = new ol.layer.Vector({
                    source: new ol.source.Vector({
                        features: [marker]
                    })
                });
                //var users = getAllShareUser(location_share_with_me,shared_users,latlon);
                vectorLayer.set("sharetype", "share_with_me");
                vectorLayer.set("username", user);
                vectorLayer.set("hdms", latlon);
                map.addLayer(vectorLayer);
            })
        })
    }

    
    map.on('click', function(evt){
        var isFeaturePresent = map.hasFeatureAtPixel(evt.pixel);
        if(isFeaturePresent){
            map.forEachFeatureAtPixel(evt.pixel, function(feature, layer) {
                if (feature) {
                    var sharetype = layer.get("sharetype");
                    var username = layer.get("username");
                    var hdms = ol.coordinate.toStringHDMS(layer.get("hdms"),1);
                    if(sharetype == "i_share_publicly"){
                        content.innerHTML = '<p>You have share this location publicly:</p><code>' + hdms + '</code>';
                    }else if (sharetype == "i_share_privately"){
                        content.innerHTML = '<p>You have share this location with '+ username +':</p><code>' + hdms + '</code>';
                    }else if (sharetype == "share_with_me"){
                        content.innerHTML = '<p>' +username+ ' have share this location with you:</p><code>' + hdms + '</code>';
                    }
                    var coordinate = evt.coordinate;
                    $('#save-popup-closer').click();
                    overlay.setPosition(coordinate);
                }
            });
        }else{
            var coordinate = ol.proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326');
            var hdms = ol.coordinate.toStringHDMS( coordinate, 1 );
            var createOptionForUserList = createOptionHtmlStr(userList);
            var htmlStr = '<p>Share the location:</p><code>' +hdms+ '</code><p>with:</p>';
            htmlStr += '<div class="form-check-inline">';
            htmlStr += '<label class="form-check-label">';
            htmlStr += '<input type="radio" id="publicly" class="form-check-input" name="sharetype" value="publicly" onclick="userListVisibility()" checked>Public';
            htmlStr += '</label>';
            htmlStr += '</div>';
            htmlStr += '<div class="form-check-inline">';
            htmlStr += '<label class="form-check-label">';
            htmlStr += '<input type="radio" id="privately" class="form-check-input" name="sharetype" value="privately" onclick="userListVisibility()">Private';
            htmlStr += '</label>';
            htmlStr += '</div>';
            htmlStr += '<select name="users" id="users_list" multiple>';
            htmlStr += createOptionForUserList;
            htmlStr += '</select>';
            htmlStr += '<hr/>';
            htmlStr += '<button class="btn btn-primary float-right" onclick="saveShareLocation([' +coordinate+ '])">Share</button>';
            saveContent.innerHTML = htmlStr;
            initMultiselect();
            var coord = evt.coordinate;
            $('#popup-closer').click();
            saveOverlay.setPosition(coord);
        }
    });
}

function getAllShareUser(private_location_share,shared_users,latlon){
    var users = [];
    shared_users.forEach(function (user, i) {
        if(searchForArray(private_location_share[user],latlon)>-1)
            users.push(user);
    });
    return users;
}

function searchForArray(arr_of_arr, arr){
    var i, j, current;
    for(i = 0; i < arr_of_arr.length; ++i){
        if(arr.length === arr_of_arr[i].length){
        current = arr_of_arr[i];
        for(j = 0; j < arr.length && arr[j] === current[j]; ++j);
        if(j === arr.length)
            return i;
        }
    }
    return -1;
}

function userListVisibility(){
    if($('#privately').is(':checked')){
        $("#users_list").multiselect("enable");
    }else{
        $("#users_list").multiselect("disable");
    } 
}

function saveShareLocation(coordinate){
    var shareType = $('input[name="sharetype"]:checked').val();
    var userToShare = [];
    if(shareType == "privately"){
        userToShare = $('#users_list').val();
        if(userToShare.length == 0){
            alert("Please select atleast a user to share location privately");
            return;
        }
    }
    var coordinateToShare = coordinate;
    $.ajax({
        url: "save_share_location", 
        type: "post",
        beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
        data: "sharetype="+shareType+"&user_to_share="+userToShare+"&coordinate_to_share="+coordinateToShare,
        success: function(msg){
            $('#save-popup-closer').click();
            alert(msg);
            location.reload(); 
        },
        error: function(err){
            alert(err.message);
        }
    });
}

function initMultiselect(){
    $("#users_list").multiselect({
        title: "Select users"
    });
    $("#users_list").multiselect("disable");
    $("#users_list").on("disabled.bs.multiselect", function(event) {
        $("#users_list").val().forEach(function(val){
            $("#users_list").multiselect("deselectOption", val);
        });
    });
}

function getAllUsersExceptCurrent(all_users, current_user_id){
    var user_list_arr = [];
    all_users.forEach(function(userObj){
        if(userObj.id != parseInt(current_user_id)){
            var innerUserObj = {};
            innerUserObj["id"] = userObj.id;
            innerUserObj["username"] = userObj.username;
            user_list_arr.push(innerUserObj);
        }
    });
    return user_list_arr;
}

function createOptionHtmlStr(userList){
    htmlStr = "";
    userList.forEach(function(userObj){
        htmlStr += '<option value="' +userObj.id+ '">' +userObj.username+ '</option>';
    });
    return htmlStr;
}

function getUserNameById(users,all_users){
    var usernameArr = [];
    all_users.forEach(function(userhash){
        if(users.includes(userhash.id.toString())){
            usernameArr.push(userhash.username);
        }
    });
    return usernameArr;
}
