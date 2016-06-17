function validateForm(){
  var password1 = document.getElementById("password");
  var password2 = document.getElementById("conf_password");

  if(password1.value != password2.value){
    password1.setCustomValidity("Passwords do not match!");
  }else{
    password1.setCustomValidity("");
  }

  $("#submiter").click();
}
