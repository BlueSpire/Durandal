define(function(require){
	var apiModel = require('apiModel');
	var ctor = function(){};

	ctor.prototype.activate = function(containerType, containerName, itemName){
		this.name = containerName + '.' + itemName;
		this.model = apiModel.getItem(containerType, containerName, 'property', itemName);
	};

	return ctor;
});