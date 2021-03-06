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
    notify('Errore nelle impostazioni, assicurati di inserire correttamente URL e password', null, '', 'OK');
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
  if(targetPage == '#ordersPage'){
    getOrders();
  }
  $(".page-container").each(function(){
    $(this).fadeOut();
  });
  $(targetPage).fadeIn();
  removeLoader();
}
function showAlert(type='success',message=''){
  $("#alert").removeClass("success").removeClass("danger");
  $("#alert").html(message).addClass(type).fadeIn().delay(2000).fadeOut();
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
              ordersString += '<div data-order="'+orders[i].id+'" class="single-order">Ordine #'+orders[i].id +' del '+orderDate+'</div>';
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
//Get single order
function getOrder(orderId){
  if(apiUrl != undefined && apiUrl != null && apiUrl != '' && apiPsw != undefined && apiPsw != null && apiPsw != ''){
    $.ajax({
      type: 'POST',
      url: apiUrl+'/appAPI.php',
      data: {
        'action': "getOrder",
        'apiPsw': apiPsw,
        'orderId': orderId
      },
      error: function(jqXHR, textStatus, errorThrown){
        console.error("The following error occured: " + textStatus);
      },
      success: function(response) {
        var orderForm = '';
        if(response != 'error'){
          var order = JSON.parse(response);
          if(order.status == 'Pagato'){
            var toPay = '';
            var paid = 'selected';
          }else{
            var toPay = 'selected';
            var paid = '';
          }
          orderDate = getFormattedDate(order.date_order);
          orderForm += '<div class="order-detail"><span>Subtotale:</span> '+order.subtotal+'€</div>';
          orderForm += '<div class="order-detail"><span>Sconto:</span> '+order.discount+'€</div>';
          orderForm += '<div class="order-detail"><span>Totale:</span> '+order.total+'€</div>';
          orderForm += '<div class="order-detail"><span>Data:</span> '+orderDate+'</div>';
          orderForm += '<hr>';
          if(order.products.length > 0){
            orderForm += '<div class="order-detail"><span>Prodotto</span> QTA</div>';
            for(var i=0;i<order.products.length;i++){
              orderForm += '<div class="order-detail product-detail"><span>'+order.products[i].product.title+' - '+order.products[i].size+'</span> '+order.products[i].qta+'</div>';
            }
          }

          orderForm += '<label for="orderStatus">Stato:</label>';
          orderForm += '<select id="orderStatus">';
            orderForm += '<option '+toPay+' value="Da pagare">Da pagare</option><option '+paid+' value="Pagato">Pagato</option></select>';
          orderForm += '<button data-order="'+order.id+'" class="btn-default" id="saveOrder">AGGIORNA STATO</button>';
          $(".order-container").html(orderForm);
        }else{
          $(".order-container").html('Non è stato possibile trovare l\'ordine, riprovare.');
        }
        changePage('#orderPage');
      }
    });
  }else{
    changePage('#mainPage');
    notify('Errore nelle impostazioni, assicurati di inserire correttamente URL e password', null, 'Attenzione!', 'OK');
  }
}
function saveOrder(orderId,orderStatus){
  if(apiUrl != undefined && apiUrl != null && apiUrl != '' && apiPsw != undefined && apiPsw != null && apiPsw != ''){
    $.ajax({
      type: 'POST',
      url: apiUrl+'/appAPI.php',
      data: {
        'action': "saveOrder",
        'apiPsw': apiPsw,
        'orderId': orderId,
        'orderStatus': orderStatus
      },
      error: function(jqXHR, textStatus, errorThrown){
        console.error("The following error occured: " + textStatus);
      },
      success: function(response) {
        showAlert('success', 'Ordine salvato correttamente');
      }
    });
  }else{
    notify('Errore nelle impostazioni, assicurati di inserire correttamente URL e password', null, 'Attenzione!', 'OK');
  }
}
$(".orders-container").on("click",".single-order", function(){
  var orderId = $(this).data("order");
  getOrder(orderId);
});
$(".order-container").on("click","#saveOrder", function(){
  var orderStatus = $("#orderStatus").val();
  var orderId = $(this).data("order");
  saveOrder(orderId,orderStatus);
});
