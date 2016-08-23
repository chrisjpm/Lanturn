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
      map.panTo(marker.getPosition());
      preparePartyInfoSidebar();
  });
}

function preparePartyInfoSidebar(){
  $(".right-sb").trigger("sidebar:open");
  //ADD PARTY INFO LOADING ANIMATION
}

function setCustomAddress(address){
  var geocoder = new google.maps.Geocoder();
  var latlng = new google.maps.LatLng(-34.397, 150.644);
  var myOptions = {
    center: { lat: 0, lng: 0},
    zoom: 15,
    disableDefaultUI: true,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  map = new google.maps.Map(document.getElementById("mapCanvas"), myOptions);

  if (geocoder) {
      geocoder.geocode( { 'address': address}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          if (status != google.maps.GeocoderStatus.ZERO_RESULTS) {
            map.setCenter(results[0].geometry.location);

            var GeoMarker = new GeolocationMarker(map);
            var geoMarkerCircle = new google.maps.Circle({radius: 10});
            geoMarkerCircle.bindTo("center", GeoMarker, "position");

          } else {
            alert("No results found");
          }
        } else {
          alert("Geocode was not successful for the following reason: " + status);
        }
      });
    }
}

function loadPartyInfo(party){
  var partyName = party.name;

  var partyAddressLine1 = party.addressLine1;
  var partyAddressLine2 = party.addressLine2;
  var partyAddressCity = party.addressCity;
  var partyAddressZip = party.addressZip;

  var partyDate = party.date;
  var partyHost = party.owner_username;
  var partyHostPage = "https://www.lanturn.net/user/"+partyHost;
  var partyPage = "https://www.lanturn.net/party/" + party._id;

  var partyGameInfo = party.game_info;
  var partyType = party.type;
  var partyPrize = party.prize;
  var partyPlayerCount = party.attendants.length+"/"+party.maxAttendants;

  var partyMapImage = "https://maps.googleapis.com/maps/api/staticmap?center=55.823896,-4.2753191&zoom=16&size=340x157&maptype=roadmap&markers=icon:http://www.lanturn.net/images/graphics/greenmarker.png%7C55.823896,-4.2753191"
  var partyCustomImage = party.image;
  if(partyCustomImage == ""){partyCustomImage = "https://pbs.twimg.com/media/Ca74zsMXEAAPkoO.png";}

  var partyDescHeader1 = party.descriptionHeader1;
  var partyDescHeader2 = party.descriptionHeader2;
  var partyDescHeader3 = party.descriptionHeader3;

  var partyDescSub1 = party.descriptionSub1;
  var partyDescSub2 = party.descriptionSub2;
  var partyDescSub3 = party.descriptionSub3;

  $("#partyside_name").text(partyName);
  $("#partyside_name2").text(partyName);

  $("#partyside_addressline1").text(partyAddressLine1);
  $("#partyside_addressline2").text(partyAddressLine2);
  $("#partyside_addresszip").text(partyAddressZip);
  $("#partyside_addresscity").text(partyAddressCity);

  $("#partyside_datetime").text(partyDate);
  $("#partyside_host").text(partyHost);
  $("#partyside_host").attr("href",partyHostPage);
  $("#partyside_page").attr("href",partyPage);

  $("#partyside_game").text(partyGameInfo.name);
  $("#partyside_game2").text(partyGameInfo.name);
  $("#partyside_gameImage").attr("src",partyGameInfo.image);
  $("#partyside_gameurl").attr("href",partyGameInfo.url);
  $("#partyside_type").text(partyType);
  $("#partyside_prize").text(partyPrize);
  $("#partyside_playercount").text(partyPlayerCount);

  $("#partyside_customimage").attr("src",partyCustomImage);
  $("#partyside_descheader1").text(partyDescHeader1);
  $("#partyside_descheader2").text(partyDescHeader2);
  $("#partyside_descheader3").text(partyDescHeader3);
  $("#partyside_descsub1").text(partyDescSub1);
  $("#partyside_descsub2").text(partyDescSub2);
  $("#partyside_descsub3").text(partyDescSub3);

  //JUST LINKS TO HOST PROFILE
  $("#partyside_guild").attr("href", partyHostPage);
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
