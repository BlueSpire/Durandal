$(function() {
  prettyPrint();

  if(document.location.href.indexOf('merchandise') == -1){
    return;
  }

  $.ajax({
    url: document.location.protocol + '//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=10&callback=?&q=' + encodeURIComponent('http://www.zazzle.com/durandaljs/rss'),
    dataType: 'json',
    success: function(data) {
      var feed = data.responseData.feed;

      if(feed.entries.length < 1){
        $('#comingSoon').show();
      }else{
        var productContainer = $('#productContainer');
        ko.applyBindings(feed);
        productContainer.show();
      }
    }
  });
});