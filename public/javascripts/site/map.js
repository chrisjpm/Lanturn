var socket = io();

$( document ).ready(function() {
  setMapHeight();
});

$( window ).resize(function() {
  setMapHeight();
  console.log("changeed")
});

$(function() {
    $('body').mousedown(function(e){if(e.button==1)return false});
});

var map;
function initialize() {
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      console.log("outcome #1");
      var pos = new google.maps.LatLng(position.coords.latitude,
        position.coords.longitude);

        var mapOptions = {
          center: { lat: position.coords.latitude, lng: position.coords.longitude},
          zoom: 15,
          disableDefaultUI: true,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(document.getElementById('mapCanvas'),
        mapOptions);

        //I am an legend
        var legend = document.createElement("div");
        legend.id = "legend";
        var content = [];
        content.push('<img id="legend-icon" src="public/images/graphics/legend-icon.png">');
        content.push('<p><img src="public/images/graphics/greenmarker.png"> Looking for players</p>');
        content.push('<p><img src="public/images/graphics/bluemarker.png"> Starting soon</p>');
        content.push('<p><img src="public/images/graphics/redmarker.png"> Full</p>');

        legend.innerHTML = content.join('');
        legend.index = 1;
        map.controls[google.maps.ControlPosition.LEFT_TOP].push(legend);

        var GeoMarker = new GeolocationMarker(map);
        var geoMarkerCircle = new google.maps.Circle({radius: 10});
        geoMarkerCircle.bindTo("center", GeoMarker, "position");
        socket.emit('scanParties', {"lat":position.coords.latitude, "lng":position.coords.longitude});
        removeLoadingImage();
    }, function() {
      console.log("outcome #2");
      handleNoGeolocation();
    });
  } else {
    // Browser doesn't support Geolocation
    console.log("outcome #3");
    handleNoGeolocation();
  }
}

function handleNoGeolocation(){
    var mapOptions = {
      zoom: 3,
      disableDefaultUI: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      center: {lat:20,lng:-30}
    };
    map = new google.maps.Map(document.getElementById('mapCanvas'),
    mapOptions);

    //I am an legend
    var legend = document.createElement("div");
    legend.id = "legend";
    var content = [];
    content.push('<img id="legend-icon" src="public/images/graphics/legend-icon.png">');
    content.push('<p><img src="public/images/graphics/greenmarker.png"> Looking for players</p>');
    content.push('<p><img src="public/images/graphics/bluemarker.png"> Starting soon</p>');
    content.push('<p><img src="public/images/graphics/redmarker.png"> Full</p>');

    legend.innerHTML = content.join('');
    legend.index = 1;
    map.controls[google.maps.ControlPosition.LEFT_TOP].push(legend);

    socket.emit('scanParties', {"lat":20, "lng":-30});
    removeLoadingImage();
}

function setMapHeight(){
  var headerHeight = $("#headerContainer").height() + parseInt($("#headerContainer").css("border-bottom").split(" ")[0].substr(0, $("#headerContainer").css("border-bottom").indexOf('px')));
  document.getElementById("wrapper").style.height = ($(document).height() - headerHeight) /$(document).height() * 100 + "%";
  document.getElementById("mapCanvas").style.height = "100%";
}

function removeLoadingImage(){
  $("#mapLoading").remove();
}

function addPartyToMap(party){
  var partyID = party._id;
  var host = party.owner_username;
  var gameInfo = party.game_info;
  var gamePrice = gameInfo.price;
  var gameImage = gameInfo.image;
  var gameUrl = gameInfo.url;
  var gameName = gameInfo.name;
  var attendants = party.attendants;
  var maxAttendants = party.maxAttendants;
  var location = party.coords;
  var dateTime = party.date;
  var description = party.description;
  var latLng = new google.maps.LatLng(location[1],location[0]);

  var markerImg = "public/images/graphics/greenmarker.png";

  var contentString = "<a id='hostNameRef' href='/profile/"+host+"'><h1 id='hostName'><b>"+host+"</b></a><b>'s Party</b></h1> \n <a id='gameRef' target='_blank' href='"+gameUrl+"'><h2 id='gameTxt'>"+gameName+"<h2></a> \n <h3>"+dateTime+"</h3> \n <h4>"+attendants.length+"/"+maxAttendants+" players</h4> \n <p>---------------------------------</p> \n <h5>"+description+"</h5> <button type='button' id='joinParty' onclick='joinParty("+partyID+");' class='btn btn-default'>Join Party</button>";

  var infowindow = new google.maps.InfoWindow({
    content: contentString
  });

  var marker = new google.maps.Marker({
    icon: {url:markerImg},
    position: latLng,
    map: map,
    title: host+"'s Party",
    animation: google.maps.Animation.DROP
  });

  google.maps.event.addListener(marker, 'click', function() {
    infowindow.open(map,marker);
  });
}

socket.on('partyScanResult', function(results){
  console.log(results);
  for(var i = 0; i < results.length; i++){
    addPartyToMap(results[i]);
  }
});

google.maps.event.addDomListener(window, 'load', initialize);
