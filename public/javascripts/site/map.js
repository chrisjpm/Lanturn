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

google.maps.event.addDomListener(window, 'load', initialize);
