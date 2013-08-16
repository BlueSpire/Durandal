define(function(require){
	var apiModel = require('apiModel');
	var ctor = function(){};

	ctor.prototype.activate = function(containerType, containerName, itemName){
		this.name = containerName + '.' + itemName;
		this.model = apiModel.getItem(containerType, containerName, 'method', itemName);
	};

    ctor.prototype.compositionComplete = function(){
        prettyPrint();
    };

	return ctor;
});