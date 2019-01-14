var storage = window.localStorage;
var url = storage.getItem('ordersUrl');
if(url != 'undefined' && url != null){
  $("#orders_url").val(url);
}

function notify(notificationString, notificationCallback, notificationTitle, notificationButton){
  if(navigator.notification != undefined && navigator.notification != 'undefined'){
    navigator.notification.alert(notificationString, function(){}, notificationTitle, notificationButton);
  }else{
    window.alert(notificationString);
  }
}

function alertDismissed() {
  $("#orders_url").focus();
}

function saveSettings(){
  var urlInput = $("#orders_url").val();
  if(urlInput != 'undefined' && urlInput != null && urlInput != ''){
    if(urlInput == 'delete'){
      storage.removeItem('ordersUrl');
    } else{
      storage.setItem('ordersUrl', urlInput);
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
  $.ajax({
    type: 'POST',
    url: 'http://fuoriserie.altervista.org/appAPI.php',
    dataType: 'jsonp',
    data: {
      'action': "getOrders"
    },
    error: function(jqXHR, textStatus, errorThrown){
      console.error("The following error occured: " + textStatus);
    },
    success: function(response) {
      var newHtml = '';
      if(response.length > 0){
        for(var i=0;i<response.length;i++){
          newHtml += '<div class="single-order">Ordine #'+response[i].id +' del '+response[i].date_order+'</div>';
        }
      }
      $(".orders-container").html(newHtml);
    }
  })
});
removeLoader();
