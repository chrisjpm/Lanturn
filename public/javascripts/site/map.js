var socket = io();


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

    socket.emit('scanParties', {"lat":20, "lng":-30});
    removeLoadingImage();
}

function removeLoadingImage(){
  $("#mapLoading").remove();
}

function addPartyToMap(party){
  var partyID = party._id;
  var location = party.coords;

  //TODO DO SOMETHING FANCY WITH THIS STUFF
  var attendants = party.attendants;
  var maxAttendants = party.maxAttendants;
  var dateTime = party.date;

  var latLng = new google.maps.LatLng(location[1],location[0]);

  var markerImg = "public/images/graphics/greenmarker.png";


  var marker = new google.maps.Marker({
    icon: {url:markerImg},
    position: latLng,
    map: map,
    animation: google.maps.Animation.DROP,
    party: partyID
  });

  google.maps.event.addListener(marker, 'click', function() {
      socket.emit('getParty', marker["party"]);
      console.log("party id: " +marker["party"]);
      preparePartyInfoSidebar();
  });
}

function preparePartyInfoSidebar(){
  $(".right-sb").trigger("sidebar:open");
  //ADD PARTY INFO LOADING ANIMATION
}

function loadPartyInfo(party){

}

socket.on('partyScanResult', function(results){
  console.log(results);
  for(var i = 0; i < results.length; i++){
    addPartyToMap(results[i]);
  }
});

socket.on('getPartyResult', function(result){
  console.log(result);
  loadPartyInfo(result);
});

google.maps.event.addDomListener(window, 'load', initialize);
