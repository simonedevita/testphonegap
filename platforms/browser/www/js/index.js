setTimeout(function(){
  $("#preloader").fadeOut();
},500)
$("#test_ajax").on("click", function(){
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
          newHtml += 'Ordine #'+response[i].id +' del '+response[i].date_order+'<br>';
        }
      }
      $("#ajax_container").html(newHtml);
    }
  })
});
