define(function(require){
	var apiModel = require('apiModel'),
		shell = require('shell');

	return {
		coreNav:shell.coreNav,
		pluginNav:shell.pluginNav,
		model:apiModel.project
	};
});