var socket = io();

window.onload = function(e){
  socket.emit("getNotifications");
}

socket.on("getNotificationsResult", function(results){
  console.log("NEW NOTIFICATION(S):"+ results[0].not_title);
});
