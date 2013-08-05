(function() {
  var socket = io.connect();
  socket.on('page',       reloadPage)
        .on('css',        reloadCss)
        .on('reconnect',  reloadPage);

  function reloadPage() {
    location.reload();
  }

  function reloadCss() {
    var links = document.getElementsByTagName("link");
    for (var i = 0; i < links.length; i++) {
      var tag = links[i];
      if (tag.rel.toLowerCase().indexOf("stylesheet") >= 0 && tag.href) {
        var newHref = tag.href.replace(/(&|%5C?)\d+/, "");
        tag.href = newHref + (newHref.indexOf("?") >= 0 ? "&" : "?") + (new Date().valueOf());
      }
    }
    console.log('CSS updated');
  }

})();