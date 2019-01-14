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
      $("#ajax_container").html(response);
    }
  })
});
