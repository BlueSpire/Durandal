define(function(require){
	var data = require('text!data.json'), 
		model = JSON.parse(data);

	var modules = {};
	var classes = {};

	function createContainer(){
		return {
			properties:[],
			propertyLookup:{},
			events:[],
			eventLookup:{},
			methods:[],
			methodLookup:{},
			classes:[],
			classLookup:{}
		};
	}

	function categorize(owner, item, type){
		switch(item.itemtype){
			case 'property':
				item.hash = '#' + type + '/' + owner.name + '/property/' + item.name;
                item.srcHref = 'https://github.com/BlueSpire/Durandal/blob/master/' + item.file;
                item.lineHref = item.srcHref + "#L" + item.line;
				owner.propertyLookup[item.name] = item;
				owner.properties.push(item);
				break;
			case 'method':
				item.hash = '#' + type + '/' + owner.name + '/method/' + item.name;
                item.srcHref = 'https://github.com/BlueSpire/Durandal/blob/master/' + item.file;
                item.lineHref = item.srcHref + "#L" + item.line;
				owner.methodLookup[item.name] = item;
				owner.methods.push(item);
				break;
			case 'event':
				item.hash = '#' + type + '/' + owner.name + '/event/' + item.name;
                item.srcHref = 'https://github.com/BlueSpire/Durandal/blob/master/' + item.file;
                item.lineHref = item.srcHref + "#L" + item.line;
				owner.eventLookup[item.name] = item;
				owner.events.push(item);
				break;
		}
	}

	for(var moduleName in model.modules){
		if(moduleName == 'entrance'){
			continue;
		}

		var current = model.modules[moduleName];
		var module = modules[moduleName] = createContainer();

		module.name = moduleName;
		module.description = current.description;
		module.dependencies = ko.utils.arrayFilter(current.requires, function(item){
			return item != 'jquery' && item != 'knockout' && item != 'require';
		});
	}

	for(var i = 0, len = model.classitems.length; i < len; i++){
		var current = model.classitems[i];
		var module = modules[current.module];
		var className = current['class'];

		if(className.indexOf('Module') != -1){
			categorize(module, current, 'module');
		}else{
			var theClass = module.classLookup[className];

			if(!theClass){
				theClass = createContainer();
				theClass.name = className;
				theClass.hash = '#module/' + current.module + '/class/' + className;

				module.classLookup[className] = theClass;
				module.classes.push(theClass);

				classes[className] = theClass;
			}

			categorize(theClass, current, 'class');
		}
	}

	var apiModel = {
		modules:modules,
		classes:classes,
		project:model.project,
		getItem:function(containerType, containerName, memberType, itemName){
			var lookup = containerType == 'module' ? modules : classes;
			var container = lookup[containerName];
			return container[memberType + 'Lookup'][itemName];
		}
	};

	return apiModel;
});