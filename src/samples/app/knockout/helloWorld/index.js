define(['durandal/app'], function (app) {
        
        var firstName = ko.observable("Planet");
        var lastName = ko.observable("Earth");

        var fullName = ko.computed(function () {
            // Knockout tracks dependencies automatically. It knows that fullName depends on firstName and lastName, because these get called when evaluating fullName.
            return firstName() + " " + lastName();
        });

        function viewAttached(view) {
            firstName = "Planet", lastname = "Earth";
        };

        return  {
            firstName: firstName,
            lastName: lastName,
            fullName: fullName
        }
});