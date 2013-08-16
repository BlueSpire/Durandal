define(function(require){
	var apiModel = require('apiModel'),
		router = require('plugins/router'),
		ko = require('knockout');

	var ctor = function(){ };

	ctor.prototype.activate = function(containerType, containerName, itemName){
		this.model = apiModel.classes[itemName] || apiModel.modules[containerName];
	};

	return ctor;
});