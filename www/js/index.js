function onDeviceReady() {
  removeLoader();
}
document.addEventListener("deviceready", onDeviceReady, false);
//Document is ready
var storage = window.localStorage;
var apiUrl = storage.getItem('apiUrl');
var apiPsw = storage.getItem('apiPsw');
if(apiUrl != undefined && apiUrl != null){
  $("#api_url").val(apiUrl);
}
if(apiPsw != undefined && apiPsw != null){
  $("#api_psw").val(apiPsw);
}

function notify(notificationString, notificationCallback, notificationTitle, notificationButton){
  if(navigator.notification != undefined && navigator.notification != 'undefined'){
    navigator.notification.alert(notificationString, function(){}, notificationTitle, notificationButton);
  }else{
    window.alert(notificationString);
  }
}

function getFormattedDate(date) {
  date = new Date(date);
  var year = date.getFullYear();
  var month = (1 + date.getMonth()).toString();
  month = month.length > 1 ? month : '0' + month;
  var day = date.getDate().toString();
  day = day.length > 1 ? day : '0' + day;
  return day + '/' + month + '/' + year;
}

function saveSettings(){
  var urlInput = $("#api_url").val();
  var pswInput = $("#api_psw").val();
  if(urlInput != undefined && urlInput != null && urlInput != '' && pswInput != undefined && pswInput != null && pswInput != ''){
    if(urlInput == 'delete'){
      storage.removeItem('apiUrl');
      storage.removeItem('apiPsw0');
    }else {
      storage.setItem('apiUrl', urlInput);
      storage.setItem('apiPsw', pswInput);
      apiUrl = urlInput;
      apiPsw = pswInput;
      getOrders();
      changePage("#ordersPage");
    }
  }else{
    notify('Errore nelle impostazioni, assicurati di inserire correttamente URL e password', function(){}, '', 'OK');
  }
}
//Page load
function removeLoader(){
  setTimeout(function(){
    $("#preloader").fadeOut();
  },500);
}
//Change page handler
function changePage(targetPage){
  $("#preloader").show();
  $(".page-container").each(function(){
    $(this).fadeOut();
  });
  $(targetPage).fadeIn();
  removeLoader();
}
//Get Orders request
function getOrders(){
  if(apiUrl != undefined && apiUrl != null && apiUrl != '' && apiPsw != undefined && apiPsw != null && apiPsw != ''){
    $.ajax({
      type: 'POST',
      url: apiUrl+'/appAPI.php',
      data: {
        'action': "getOrders",
        'apiPsw': apiPsw
      },
      error: function(jqXHR, textStatus, errorThrown){
        console.error("The following error occured: " + textStatus);
      },
      success: function(response) {
        var ordersString = '';
        console.log(response);
        if(response != 'error'){
          var orders = JSON.parse(response);
          if(orders.length > 0){
            for(var i=0;i<orders.length;i++){
              orderDate = getFormattedDate(orders[i].date_order);
              ordersString += '<div class="single-order">Ordine #'+orders[i].id +' del '+orderDate+'</div>';
            }
          }
          $(".orders-container").html(ordersString);
        }else{
          $(".orders-container").html('Non è stato possibile trovare ordini, riprovare.');
        }

      }
    });
  }else{
    changePage('#mainPage');
    notify('Errore nelle impostazioni, assicurati di inserire correttamente URL e password', null, 'Attenzione!', 'OK');
  }
}

$("#getOrders").on("click", function(){
  getOrders();
});
