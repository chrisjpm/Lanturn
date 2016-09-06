var socket = io();

window.onload = function(e){
  socket.emit("getNotifications");
}

socket.on("getNotificationsResult", function(results){
  var html = "";
  for(var i = 0; i < results.length; i++){
    var date = new Date(results[i].not_date);

    html+= '<a href="'+results[i].not_target+'">';
    html += '<div class="notifWrapper">';
    html+='<i class="material-icons small right invite">turned_in</i>';
    html+='<h5 class="notif-title" id="notif-title">'+results[i].not_title+'</h5>';
    html+='<h6 class="notif-date" id="notif-date">'+results[i].not_date+'</h6>';
    html+='<p class="nofic-desc" id="nofic-desc">'+results[i].not_desc+'</p>';
    html += '</div></a>'
  }
  document.getElementById('notif-drawer').innerHTML += html;
});
