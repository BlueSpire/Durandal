﻿define('ko/clickCounter/index', ['knockout'], function (ko) {
    var counter = ko.observable(0);
    var limiter = ko.computed(function () {
        return counter() >= 3;
    });

    var om = {
        numberOfClicks: counter,
        hasClickedTooManyTimes: limiter,
        registerClick: function () {
            counter(counter() + 1);
        },
        resetClicks: function () {
            counter(0);
        }
    }

    return om;
});