var storage = window.localStorage;
var apiUrl = storage.getItem('apiUrl');
if(apiUrl != 'undefined' && apiUrl != null){
  $("#api_url").val(apiUrl);
}

function notify(notificationString, notificationCallback, notificationTitle, notificationButton){
  if(navigator.notification != undefined && navigator.notification != 'undefined'){
    navigator.notification.alert(notificationString, function(){}, notificationTitle, notificationButton);
  }else{
    window.alert(notificationString);
  }
}

function alertDismissed() {
  $("#api_url").focus();
}

function saveSettings(){
  var urlInput = $("#api_url").val();
  if(urlInput != 'undefined' && urlInput != null && urlInput != ''){
    if(urlInput == 'delete'){
      storage.removeItem('apiUrl');
    } else{
      storage.setItem('apiUrl', urlInput);
      apiUrl = urlInput;
      changePage("#ordersPage");
    }
  } else{
    notify('Url non valido', alertDismissed(), '', 'OK');
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
  $("#preloader").fadeIn();
  $(".page-container").each(function(){
    $(this).fadeOut();
  });
  $(targetPage).fadeIn();
  removeLoader();
}
//Get Orders request
$("#getOrders").on("click", function(){
  if(apiUrl != undefined && apiUrl != null && apiUrl != ''){
    $.ajax({
      type: 'POST',
      url: apiUrl+'/appAPI.php',
      data: {
        'action': "getOrders"
      },
      error: function(jqXHR, textStatus, errorThrown){
        console.error("The following error occured: " + textStatus);
      },
      success: function(response) {
        var newHtml = '';
        console.log(response);
        if(response != 'error'){
          var orders = JSON.parse(response);
          if(orders.length > 0){
            for(var i=0;i<orders.length;i++){
              newHtml += '<div class="single-order">Ordine #'+orders[i].id +' del '+orders[i].date_order+'</div>';
            }
          }
          $(".orders-container").html(newHtml);
        }else{
          $(".orders-container").html('Non è stato possibile trovare ordini, riprovare.');
        }

      }
    });
  }else{
    changePage('mainPage');
    notify('Url non valido', alertDismissed(), '', 'OK');
  }

});
removeLoader();
