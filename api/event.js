define(function(require){
	var apiModel = require('apiModel');
	var ctor = function(){};

	ctor.prototype.activate = function(containerType, containerName, itemName){
		this.model = apiModel.getItem(containerType, containerName, 'event', itemName);
	};

	return ctor;
});