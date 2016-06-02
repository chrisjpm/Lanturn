var socket = io();

$( document ).ready(function() {
  $("#steam-game-searcher").click(function(){
    socket.emit('gameNameUpdate', $('#game-name-input').val());
  });

  $('#game-image-input').on('input',function() {
    console.log("TRIGGERED");
    var val = $.trim( this.value );
    $('#game-image-input').attr('title', "<img style='width:144px;height=54px' src='" +val+ "'>").tooltip('fixTitle');
  });
});




socket.on('gameNameResult', function(result){
    $('#game-name-input').val(result.title);
    $('#game-url-input').val("http://store.steampowered.com/app/"+result.appid);
    $('#game-image-input').val(result.image);
    $('#game-price-input').val(result.price);
    $('#game-rating-input').val(result.rating);

    $('#game-image-input').attr('title', "<img style='width:144px;height=54px' src='" +result.image+ "'>").tooltip('fixTitle');
});
