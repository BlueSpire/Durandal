/// <reference path="require.intellisense.js" />
/// <reference path="require.js" />

(function () {
	var DEBUG = 3, WARN = 2, ERROR = 1, NONE = 0;

	//Set the logging level
	var logLevel = DEBUG;

	function log(level) {
		var msg = Array.prototype.slice.call(arguments, 1);
		if (logLevel >= level) {
			msg.splice(0, 0, level == DEBUG ? 'DEBUG' : level == WARN ?
			  'WARN' : level == ERROR ? 'ERROR' : 'UNKNOWN');
			intellisense.logMessage(msg.join(':'));
		}
	}

	log(DEBUG, "Re-read _references.js ");

	//Redirect errors to intellisense log
	requirejs.onError = function (e) {
		var modules = e.requireModules && e.requireModules.join(',');
		switch (e.requireType) {
			case 'scripterror':
				log(WARN, modules, "Dependency script not yet loaded, check the stated define name matches the require." + modules);
				break;
			default:
				log(ERROR, e.requireType, modules, e.toString());
				break;
		}
	};

	var originalDefine = define;
	var lastDefine = "{743D069C-7591-459B-BD9C-08E4B4B8A7DC}";
	var currentDocumentId = "_@ROOT";
	define = function (name, deps, callback) {
		//Disallow anonymous modules - unfortunately we can't handle them
		//without turning everything to guesswork.
		if (typeof name !== 'string') {
			log(ERROR, "Intellisense not supported for anonymous modules");
			log(name);
		}
		//Make use of the fact that VS seemingly invokes the current document
		//code twice. On the second call, rename the module to ensure this 
		//specific code will be evaluated and then require it to evaluate it.
		if (lastDefine === name) {
			log(DEBUG, "Define current document");
			originalDefine(currentDocumentId, deps, callback);
			log(DEBUG, "Require current document");
			require([currentDocumentId], function () {
				//This log message may never get printed as VS stops execution of
				//the current document once it hits the node at which auto-
				//completion has being invoked.
				log(DEBUG, "Loaded current document and all dependencies");
			});
		} else {
			log(DEBUG, "Define module", name);
			originalDefine(name, deps, callback);
		}
		lastDefine = name;
	};

	intellisense.annotate(window, {
		define: function () {
			/// <signature>
			///     <summary>Defines a named module, with optional dependencies, whose value is determined by executing a callback.</summary>
			///     <param name="name" type="String">The name of the module</param>
			///     <param name="deps" type="Array" elementType="String" optional="true">An array of modules that this module depends on</param>
			///     <param name="callback" type="Function">The callback that will be called when your module is asked to produce a value</param>
			/// </signature>
			/// <signature>
			///     <summary>Defines a named module, with optional dependencies, whose value is determined by executing a callback.</summary>
			///     <param name="name" type="String">The name of the module</param>
			///     <param name="callback" type="Function">The callback that will be called when your module is asked to produce a value</param>
			/// </signature>
		},
		require: function () {
			/// <signature>
			///     <summary>Defines a callback function that will be triggered after a set of dependency modules have been evaluated</summary>
			///     <param name="deps" type="Array" elementType="String"></param>
			///     <param name="callback" type="Function"></param>
			/// </signature>
		}
	});
}());