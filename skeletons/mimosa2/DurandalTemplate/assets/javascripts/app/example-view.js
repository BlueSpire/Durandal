define(['jquery', 'templates'], function($, templates) {
  var ExampleView = (function() {

    function ExampleView() {}

    ExampleView.prototype.render = function(element) {
      $(element).append(templates.example);
      $(element).append(templates['another-example']);
    };

    return ExampleView;

  })();
  return ExampleView;
});