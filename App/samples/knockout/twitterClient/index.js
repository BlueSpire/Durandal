define(['durandal/system','durandal/app'], function (system,app) {

    var initialLists = [
            { name: "SPA Advocates", userNames: ['DurandalJS','John_Papa','EisenbergEffect','wardbell','DanWahlin', 'mikekidder',] },
            { name: "Celebrities", userNames: ['JohnCleese', 'MCHammer', 'StephenFry', 'algore', 'StevenSanderson'] },
            { name: "Microsoft people", userNames: ['BillGates', 'shanselman', 'ScottGu'] },
            { name: "Tech pundits", userNames: ['Scobleizer', 'LeoLaporte', 'techcrunch', 'BoingBoing', 'timoreilly', 'codinghorror'] }
    ];

    var selectedList = "SPA Advocates";

    var twitterApi = (function () {
        var throttleFunction = function (fn, throttleMilliseconds) {
            var invocationTimeout;

            return function () {
                var args = arguments;
                if (invocationTimeout)
                    clearTimeout(invocationTimeout);

                invocationTimeout = setTimeout(function () {
                    invocationTimeout = null;
                    fn.apply(window, args);
                }, throttleMilliseconds);
            };
        };

        var getTweetsForUsersThrottled = throttleFunction(function (userNames, callback) {
            if (userNames.length == 0)
                callback([]);
            else {
                var url = "http://search.twitter.com/search.json?callback=?&rpp=100&q=";
                for (var i = 0; i < userNames.length; i++)
                    url += "from:" + userNames[i] + (i < userNames.length - 1 ? " OR " : "");
                $.ajax({
                    url: url,
                    dataType: "jsonp",
                    success: function (data) { callback($.grep(data.results || [], function (tweet) { return !tweet.to_user_id; })); }
                });
            }
        }, 50);

        return {
            getTweetsForUser: function (userName, callback) {
                return this.getTweetsForUsers([userName], callback);
            },
            getTweetsForUsers: function (userNames, callback) {
                return getTweetsForUsersThrottled(userNames, callback);
            }
        };
    })();

    var savedLists = ko.observableArray(initialLists);

    var editingList = {
        name: ko.observable(selectedList),
        userNames: ko.observableArray()
    };

    var userNameToAdd = ko.observable("");

    var currentTweets = ko.observableArray([])

    var findSavedList = function (name) {
        var lists = savedLists();
        return ko.utils.arrayFirst(lists, function (list) {
            return list.name === name;
        });
    };

    var addUser = function () {
        if (userNameToAdd() && userNameToAddIsValid()) {
            editingList.userNames.push(userNameToAdd());
            userNameToAdd("");
        }
    };

    var removeUser = function (userName) {
        editingList.userNames.remove(userName)
    };

    var saveChanges = function () {
        var saveAs = prompt("Save as", editingList.name());
        if (saveAs) {
            var dataToSave = editingList.userNames().slice(0);
            var existingSavedList = findSavedList(saveAs);
            if (existingSavedList) existingSavedList.userNames = dataToSave; // Overwrite existing list
            else savedLists.push({
                name: saveAs,
                userNames: dataToSave
            }); // Add new list
            editingList.name(saveAs);
        }
    };

    var deleteList = function () {
        var nameToDelete = editingList.name();
        var savedListsExceptOneToDelete = $.grep(savedLists(), function (list) {
            return list.name != nameToDelete
        });
        editingList.name(savedListsExceptOneToDelete.length == 0 ? null : savedListsExceptOneToDelete[0].name);
        savedLists(savedListsExceptOneToDelete);
    };

    var hasUnsavedChanges = ko.computed(function () {
        if (!editingList.name()) {
            return editingList.userNames().length > 0;
        }
        var savedData = findSavedList(editingList.name()).userNames;
        var editingData = editingList.userNames();
        return savedData.join("|") != editingData.join("|");
    });

    var userNameToAddIsValid = ko.computed(function () {
        return (userNameToAdd() == "") || (userNameToAdd().match(/^\s*[a-zA-Z0-9_]{1,15}\s*$/) != null);
    });

    var canAddUserName = ko.computed(function () {
        return userNameToAddIsValid() && userNameToAdd() != "";
    });

    // The active user tweets are (asynchronously) computed from editingList.userNames
    ko.computed(function () {
        twitterApi.getTweetsForUsers(editingList.userNames(), currentTweets);
    });

    ko.computed(function () {
        // Observe viewModel.editingList.name(), so when it changes (i.e., user selects a different list) we know to copy the saved list into the editing list
        var savedList = findSavedList(editingList.name());
        if (savedList) {
            var userNamesCopy = savedList.userNames.slice(0);
            editingList.userNames(userNamesCopy);
        } else {
            editingList.userNames([]);
        }
    });

    function activate() {
        system.log('View Activating', this);
    }

    function viewAttached() {
        system.log('View Activated', this);
    }

    return {
        savedLists : savedLists,
        editingList : editingList,
        userNameToAdd : userNameToAdd,
        currentTweets : currentTweets,
        findSavedList : findSavedList,
        addUser : addUser,
        removeUser : removeUser,
        saveChanges : saveChanges,
        deleteList : deleteList,
        hasUnsavedChanges : hasUnsavedChanges,
        userNameToAddIsValid : userNameToAddIsValid,
        canAddUserName: canAddUserName,
        activate: activate,
        viewAttached: viewAttached
    }
});