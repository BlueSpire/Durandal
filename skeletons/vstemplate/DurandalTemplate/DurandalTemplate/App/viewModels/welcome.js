define(function(require) {
    var Welcome = function() {
        this.displayName = 'Welcome to the Durandal Starter Project!';
        this.description = 'Durandal is a cross-device, cross-platform client framework written in JavaScript and designed to make building Single Page Applications (SPAs) easy to create and maintain.';
        this.features = [
            'Develop apps for PC, Mac, Linux, Android and iOS.',
            'Built on top of the industry leading and proven libraries jQuery, Knockout and RequireJS.',
            'Enables clean and simple MVC, MVVM and MVP patterned architecures through intuitive module conventions.',
            'CommonJS Promises are embraced everywhere in the API for a robust, consistent approach to async programming.',
            'The first HTML/JS framework where UI Composition is embraced at the very core and flows outward to everything.',
            'A simple app model provides you with an app start lifecycle, modal dialogs, message boxes and an event aggregator.',
            'Elegant creation of reusable, databindable, skinnable and templatable widgets.',
            'Leverage optional components for screen activation and deactivation, enabling easy handling of complex screen states.',
            'Optimize all your HTML and JavaScript into a single file for deploy.',
            'Easily customize any part of the frameork.',
            'Integrates beautifully with other libraries such as SammyJS and Bootstrap.',
            'Works with any backend technology.'
        ];
    };

    return Welcome;
});