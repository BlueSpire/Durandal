define(['knockout'], function (ko) {
    var firstName = ko.observable("Planet"),
        lastName = ko.observable("Earth");

    var fullName = ko.computed(function () {
        // Knockout tracks dependencies automatically.
        // It knows that fullName depends on firstName and lastName, because these get called when evaluating fullName.
        return firstName() + " " + lastName();
    });

    return  {
        firstName: firstName,
        lastName: lastName,
        fullName: fullName
    }
});