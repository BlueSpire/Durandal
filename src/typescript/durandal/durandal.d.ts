/**
 * Durandal 2.0.0 Copyright (c) 2012 Blue Spire Consulting, Inc. All Rights Reserved.
 * Available via the MIT license.
 * see: http://durandaljs.com or https://github.com/BlueSpire/Durandal for details.
 */

/// <reference path="../jquery/jquery.d.ts" />
/// <reference path="../knockout/knockout.d.ts" />

/**
 * The system module encapsulates the most basic features used by other modules.
 * @module system
 * @requires require
 * @requires jquery
 */
declare module 'durandal/system' {
    /**
     * Durandal's version.
     * @property {string} version
     */
    export var version: string;

    /**
     * A noop function.
     * @method noop
     */
    export var noop: Function;

    /**
     * Gets the module id for the specified object.
     * @method getModuleId
     * @param {object} obj The object whose module id you wish to determine.
     * @return {string} The module id.
     */
    export function getModuleId(obj: any): string;

    /**
     * Sets the module id for the specified object.
     * @method setModuleId
     * @param {object} obj The object whose module id you wish to set.
     * @param {string} id The id to set for the specified object.
     */
    export function setModuleId(obj, id: string): void;

    /**
     * Resolves the default object instance for a module. If the module is an object, the module is returned. If the module is a function, that function is called with `new` and it's result is returned.
     * @method resolveObject
     * @param {object} module The module to use to get/create the default object for.
     * @return {object} The default object for the module.
     */
    export function resolveObject(module: any): any;

    /**
     * Gets/Sets whether or not Durandal is in debug mode.
     * @method debug
     * @param {boolean} [enable] Turns on/off debugging.
     * @return {boolean} Whether or not Durandal is current debugging.
     */
    export function debug(enable?: boolean): boolean;

    /**
     * Logs data to the console. Pass any number of parameters to be logged. Log output is not processed if the framework is not running in debug mode.
     * @method log
     * @param {object} info* The objects to log.
     */
    export function log(...msgs: any[]): void;

    /**
     * Logs an error.
     * @method error
     * @param {string} obj The error to report.
     */
    export function error(error: string): void;

    /**
     * Logs an error.
     * @method error
     * @param {Error} obj The error to report.
     */
    export function error(error: Error): void;

    /**
     * Asserts a condition by throwing an error if the condition fails.
     * @method assert
     * @param {boolean} condition The condition to check.
     * @param {string} message The message to report in the error if the condition check fails.
     */
    export function assert(condition: boolean, message: string): void;

    /**
     * Creates a deferred object which can be used to create a promise. Optionally pass a function action to perform which will be passed an object used in resolving the promise.
     * @method defer
     * @param {function} [action] The action to defer. You will be passed the deferred object as a paramter.
     * @return {JQueryDeferred} The deferred object.
     */
    export function defer<T>(action?: (dfd: JQueryDeferred<T>) => void ): JQueryDeferred<T>;

    /**
     * Creates a simple V4 UUID. This should not be used as a PK in your database. It can be used to generate internal, unique ids. For a more robust solution see [node-uuid](https://github.com/broofa/node-uuid).
     * @method guid
     * @return {string} The guid.
     */
    export function guid(): string;

    /**
     * Uses require.js to obtain a module. This function returns a promise which resolves with the module instance.
     * @method acquire
     * @param {string} moduleId The id of the module to load.
     * @return {JQueryPromise} A promise for the loaded module.
     */
    export function acquire(moduleId: string): JQueryPromise<any>;

    /**
     * Uses require.js to obtain an array of modules. This function returns a promise which resolves with the modules instances in an array.
     * @method acquire
     * @param {string[]} moduleIds The ids of the modules to load.
     * @return {JQueryPromise} A promise for the loaded module.
     */
    export function acquire(modules: string[]): JQueryPromise<any[]>;

    /**
     * Uses require.js to obtain multiple modules. This function returns a promise which resolves with the module instances in an array.
     * @method acquire
     * @param {string} moduleIds* The ids of the modules to load.
     * @return {JQueryPromise} A promise for the loaded module.
     */
    export function acquire(...moduleIds: string[]): JQueryPromise<any[]>;

    /**
     * Extends the first object with the properties of the following objects.
     * @method extend
     * @param {object} obj The target object to extend.
     * @param {object} extension* Uses to extend the target object.
    */
    export function extend(obj: any, ...extensions: any[]): any;
    
    /**
     * Uses a setTimeout to wait the specified milliseconds.
     * @method wait
     * @param {number} milliseconds The number of milliseconds to wait.
     * @return {JQueryPromise}
    */
    export function wait(milliseconds: number): JQueryPromise;

    /**
     * Gets all the owned keys of the specified object.
     * @method keys
     * @param {object} object The object whose owned keys should be returned.
     * @return {string[]} The keys.
     */
    export function keys(obj: any): string[];

    /**
     * Determines if the specified object is an html element.
     * @method isElement
     * @param {object} object The object to check.
     * @return {boolean} True if matches the type, false otherwise.
     */
    export function isElement(obj: any): boolean;

    /**
     * Determines if the specified object is an array.
     * @method isArray
     * @param {object} object The object to check.
     * @return {boolean} True if matches the type, false otherwise.
     */
    export function isArray(obj: any): boolean;

    /**
     * Determines if the specified object is a boolean.
     * @method isBoolean
     * @param {object} object The object to check.
     * @return {boolean} True if matches the type, false otherwise.
     */
    export function isObject(obj: any): boolean;

    /**
     * Determines if the specified object is a promise.
     * @method isPromise
     * @param {object} object The object to check.
     * @return {boolean} True if matches the type, false otherwise.
     */
    export function isPromise(obj: any): boolean;

    /**
     * Determines if the specified object is a function arguments object.
     * @method isArguments
     * @param {object} object The object to check.
     * @return {boolean} True if matches the type, false otherwise.
     */
    export function isArguments(obj: any): boolean;

    /**
     * Determines if the specified object is a function.
     * @method isFunction
     * @param {object} object The object to check.
     * @return {boolean} True if matches the type, false otherwise.
     */
    export function isFunction(obj: any): boolean;

    /**
     * Determines if the specified object is a string.
     * @method isString
     * @param {object} object The object to check.
     * @return {boolean} True if matches the type, false otherwise.
     */
    export function isString(obj: any): boolean;

    /**
     * Determines if the specified object is a number.
     * @method isNumber
     * @param {object} object The object to check.
     * @return {boolean} True if matches the type, false otherwise.
     */
    export function isNumber(obj: any): boolean;

    /**
     * Determines if the specified object is a date.
     * @method isDate
     * @param {object} object The object to check.
     * @return {boolean} True if matches the type, false otherwise.
     */
    export function isDate(obj: any): boolean;

    /**
     * Determines if the specified object is a boolean.
     * @method isBoolean
     * @param {object} object The object to check.
     * @return {boolean} True if matches the type, false otherwise.
     */
    export function isBoolean(obj: any): boolean;
}

/**
 * The viewEngine module provides information to the viewLocator module which is used to locate the view's source file. The viewEngine also transforms a view id into a view instance.
 * @module viewEngine
 * @requires system
 * @requires jquery
 */
declare module 'durandal/viewEngine' {
    /**
     * The file extension that view source files are expected to have.
     * @property {string} viewExtension
     * @default .html
    */
    export var viewExtension: string;

    /**
     * The name of the RequireJS loader plugin used by the viewLocator to obtain the view source. (Use requirejs to map the plugin's full path).
     * @property {string} viewPlugin
     * @default text
    */
    export var viewPlugin: string;

    /**
     * Determines if the url is a url for a view, according to the view engine.
     * @method isViewUrl
     * @param {string} url The potential view url.
     * @return {boolean} True if the url is a view url, false otherwise.
    */
    export function isViewUrl(url: string):boolean;
    
    /**
     * Converts a view url into a view id.
     * @method convertViewUrlToViewId
     * @param {string} url The url to convert.
     * @return {string} The view id.
    */
    export function convertViewUrlToViewId(url: string): string;

    /**
     * Converts a view id into a full RequireJS path.
     * @method convertViewIdToRequirePath
     * @param {string} viewId The view id to convert.
     * @return {string} The require path.
    */
    export function convertViewIdToRequirePath(viewId: string): string;

    /**
     * Parses the view engine recognized markup and returns DOM elements.
     * @method parseMarkup
     * @param {string} markup The markup to parse.
     * @return {HTMLElement[]} The elements.
    */
    export function parseMarkup(markup: string):Node[];

    /**
     * Calls `parseMarkup` and then pipes the results through `ensureSingleElement`.
     * @method processMarkup
     * @param {string} markup The markup to process.
     * @return {HTMLElement} The view.
    */
    export function processMarkup(markup: string): HTMLElement;

    /**
     * Converts an array of elements into a single element. White space and comments are removed. If a single element does not remain, then the elements are wrapped.
     * @method ensureSingleElement
     * @param {HTMLElement[]} allElements The elements.
     * @return {HTMLElement} A single element.
    */
    export function ensureSingleElement(allElements: Node[]): HTMLElement;

    /**
     * Creates the view associated with the view id.
     * @method createView
     * @param {string} viewId The view id whose view should be created.
     * @return {JQueryPromise<HTMLElement>} A promise of the view.
    */
    export function createView(viewId: string): JQueryPromise<HTMLElement>;

    /**
     * Called when a view cannot be found to provide the opportunity to locate or generate a fallback view. Mainly used to ease development.
     * @method createFallbackView
     * @param {string} viewId The view id whose view should be created.
     * @param {string} requirePath The require path that was attempted.
     * @param {Error} requirePath The error that was returned from the attempt to locate the default view.
     * @return {Promise} A promise for the fallback view.
    */
    export function createFallbackView(viewId: string, requirePath: string, err: Error): JQueryPromise<HTMLElement>;
}

/**
* Represents an event subscription.
* @class Subscription
*/
interface EventSubscription {
    /**
     * Attaches a callback to the event subscription.
     * @method then
     * @param {function} callback The callback function to invoke when the event is triggered.
     * @param {object} [context] An object to use as `this` when invoking the `callback`.
     * @chainable
     */
    then(thenCallback: Function, context?: any): EventSubscription;

    /**
     * Attaches a callback to the event subscription.
     * @method on
     * @param {function} [callback] The callback function to invoke when the event is triggered. If `callback` is not provided, the previous callback will be re-activated.
     * @param {object} [context] An object to use as `this` when invoking the `callback`.
     * @chainable
     */
    on(thenCallback: Function, context?: any): EventSubscription;

    /**
     * Cancels the subscription.
     * @method off
     * @chainable
     */
    off(): EventSubscription;
}

/**
 * Durandal events originate from backbone.js but also combine some ideas from signals.js as well as some additional improvements.
 * Events can be installed into any object and are installed into the `app` module by default for convenient app-wide eventing.
 * @module events
 * @requires system
 */
declare module 'durandal/events' {
    /**
     * Creates an object with eventing capabilities.
     * @class Events
    */
    class Events {
        constructor();

        /**
         * Creates a subscription or registers a callback for the specified event.
         * @method on
         * @param {string} events One or more events, separated by white space.
         * @return {Subscription} A subscription is returned.
         */
        on(events: string): EventSubscription;

        /**
         * Creates a subscription or registers a callback for the specified event.
         * @method on
         * @param {string} events One or more events, separated by white space.
         * @param {function} [callback] The callback function to invoke when the event is triggered.
         * @param {object} [context] An object to use as `this` when invoking the `callback`.
         * @return {Events} The events object is returned for chaining.
         */
        on(events: string, callback: Function, context?: any): Events;

        /**
         * Removes the callbacks for the specified events.
         * @method off
         * @param {string} [events] One or more events, separated by white space to turn off. If no events are specified, then the callbacks will be removed.
         * @param {function} [callback] The callback function to remove. If `callback` is not provided, all callbacks for the specified events will be removed.
         * @param {object} [context] The object that was used as `this`. Callbacks with this context will be removed.
         * @chainable
         */
        off(events: string, callback: Function, context?: any): Events;

        /**
         * Triggers the specified events.
         * @method trigger
         * @param {string} [events] One or more events, separated by white space to trigger.
         * @chainable
         */
        trigger(events: string, ...eventArgs: any[]): Events;

        /**
         * Creates a function that will trigger the specified events when called. Simplifies proxying jQuery (or other) events through to the events object.
         * @method proxy
         * @param {string} events One or more events, separated by white space to trigger by invoking the returned function.
         * @return {function} Calling the function will invoke the previously specified events on the events object.
         */
        proxy(events: string): Function;

        /**
         * Adds eventing capabilities to the specified object.
         * @method includeIn
         * @param {object} targetObject The object to add eventing capabilities to.
         */
        static includeIn(targetObject: any): void;
    }

    export = Events;
}

/**
 * The binder joins an object instance and a DOM element tree by applying databinding and/or invoking binding lifecycle callbacks (binding and bindingComplete).
 * @module binder
 * @requires system
 * @requires knockout
 */
declare module 'durandal/binder' {
    interface BindingInstruction {
        applyBindings: bool;
    }

    /**
     * Called before every binding operation. Does nothing by default.
     * @method beforeBind
     * @param {object} data The data that is about to be bound.
     * @param {DOMElement} view The view that is about to be bound.
     * @param {object} instruction The object that carries the binding instructions.
    */
    export var beforeBind: (data:any, view:HTMLElement, instruction:BindingInstruction) => void;

    /**
     * Called after every binding operation. Does nothing by default.
     * @method afterBind
     * @param {object} data The data that has just been bound.
     * @param {DOMElement} view The view that has just been bound.
     * @param {object} instruction The object that carries the binding instructions.
    */
    export var afterBind: (data: any, view: HTMLElement, instruction: BindingInstruction) => void;

    /**
     * Indicates whether or not the binding system should throw errors or not.
     * @property {boolean} throwOnErrors
     * @default false The binding system will not throw errors by default. Instead it will log them.
    */
    export var throwOnErrors: boolean;

    /**
     * Gets the binding instruction that was associated with a view when it was bound.
     * @method getBindingInstruction
     * @param {DOMElement} view The view that was previously bound.
     * @return {object} The object that carries the binding instructions.
    */
    export function getBindingInstruction(view: HTMLElement): BindingInstruction;

    /**
     * Binds the view, preserving the existing binding context. Optionally, a new context can be created, parented to the previous context.
     * @method bindContext
     * @param {KnockoutBindingContext} bindingContext The current binding context.
     * @param {DOMElement} view The view to bind.
     * @param {object} [obj] The data to bind to, causing the creation of a child binding context if present.
    */
    export function bindContext(bindingContext: KnockoutBindingContext, view: HTMLElement, obj?: any): BindingInstruction;
    
    /**
     * Binds the view, preserving the existing binding context. Optionally, a new context can be created, parented to the previous context.
     * @method bind
     * @param {object} obj The data to bind to.
     * @param {DOMElement} view The view to bind.
    */
    export function bind(obj: any, view: HTMLElement): BindingInstruction;
}

/**
 * The activator module encapsulates all logic related to screen/component activation.
 * An activator is essentially an asynchronous state machine that understands a particular state transition protocol.
 * The protocol ensures that the following series of events always occur: `canDeactivate` (previous state), `canActivate` (new state), `deactivate` (previous state), `activate` (new state).
 * Each of the _can_ callbacks may return a boolean, affirmative value or promise for one of those. If either of the _can_ functions yields a false result, then activation halts.
 * @module activator
 * @requires system
 * @requires knockout
 */
declare module 'durandal/activator' {
    interface ActivatorSettings {
        /**
         * The default value passed to an object's deactivate function as its close parameter.
         * @property {boolean} closeOnDeactivate
         * @default true
        */
        closeOnDeactivate: boolean;

        /**
         * Lower-cased words which represent a truthy value.
         * @property {string[]} affirmations
         * @default ['yes', 'ok', 'true']
        */
        affirmations: string[];

        /**
         * Interprets the response of a `canActivate` or `canDeactivate` call using the known affirmative values in the `affirmations` array.
         * @method interpretResponse
         * @param {object} value
         * @return {boolean}
        */
        interpretResponse(value: any): boolean;

        /**
         * Determines whether or not the current item and the new item are the same.
         * @method areSameItem
         * @param {object} currentItem
         * @param {object} newItem
         * @param {object} currentActivationData
         * @param {object} newActivationData
         * @return {boolean}
        */
        areSameItem(currentItem: any, newItem: any, currentActivationData: any, newActivationData: any): boolean;

        /**
         * Called immediately before the new item is activated.
         * @method beforeActivate
         * @param {object} newItem
        */
        beforeActivate(newItem: any): any;

        /**
         * Called immediately after the old item is deactivated.
         * @method afterDeactivate
         * @param {object} oldItem The previous item.
         * @param {boolean} close Whether or not the previous item was closed.
         * @param {function} setter The activate item setter function.
        */
        afterDeactivate(oldItem: any, close: boolean, setter: Function): void;
    }

    interface Activator<T> extends KnockoutComputed<T> {
        /**
         * The settings for this activator.
         * @property {ActivatorSettings} settings
        */
        settings: ActivatorSettings;

        /**
         * An observable which indicates whether or not the activator is currently in the process of activating an instance.
         * @method isActivating
         * @return {boolean}
        */
        isActivating: KnockoutObservable<boolean>;
        
        /**
         * Determines whether or not the specified item can be deactivated.
         * @method canDeactivateItem
         * @param {object} item The item to check.
         * @param {boolean} close Whether or not to check if close is possible.
         * @return {promise}
        */
        canDeactivateItem(item: T, close: boolean): JQueryPromise<boolean>;

        /**
         * Deactivates the specified item.
         * @method deactivateItem
         * @param {object} item The item to deactivate.
         * @param {boolean} close Whether or not to close the item.
         * @return {promise}
        */
        deactivateItem(item: T, close: boolean): JQueryPromise<boolean>;

        /**
         * Determines whether or not the specified item can be activated.
         * @method canActivateItem
         * @param {object} item The item to check.
         * @param {object} activationData Data associated with the activation.
         * @return {promise}
        */
        canActivateItem(newItem: T, activationData?: any): JQueryPromise<boolean>;

        /**
         * Activates the specified item.
         * @method activateItem
         * @param {object} newItem The item to activate.
         * @param {object} newActivationData Data associated with the activation.
         * @return {promise}
        */
        activateItem(newItem: T, activationData?: any): JQueryPromise<boolean>;

        /**
         * Determines whether or not the activator, in its current state, can be activated.
         * @method canActivate
         * @return {promise}
        */
        canActivate(): JQueryPromise<boolean>;

        /**
         * Activates the activator, in its current state.
         * @method activate
         * @return {promise}
        */
        activate(): JQueryPromise<boolean>;

        /**
         * Determines whether or not the activator, in its current state, can be deactivated.
         * @method canDeactivate
         * @return {promise}
        */
        canDeactivate(close: boolean): JQueryPromise<boolean>;

        /**
         * Deactivates the activator, in its current state.
         * @method deactivate
         * @return {promise}
        */
        deactivate(close: boolean): JQueryPromise<boolean>;

        /**
          * Adds canActivate, activate, canDeactivate and deactivate functions to the provided model which pass through to the corresponding functions on the activator.
          */
        includeIn(includeIn: any): void;

        /**
          * Sets up a collection representing a pool of objects which the activator will activate. See below for details. Activators without an item bool always close their values on deactivate. Activators with an items pool only deactivate, but do not close them.
          */
        forItems(items): Activator<T>;
    }

    /**
     * The default settings used by activators.
     * @property {ActivatorSettings} defaults
    */
    export var defaults: ActivatorSettings;
    
    /**
    * Creates a new activator.
     * @method create
     * @param {object} [initialActiveItem] The item which should be immediately activated upon creation of the ativator.
     * @param {ActivatorSettings} [settings] Per activator overrides of the default activator settings.
     * @return {Activator} The created activator.
    */
    export function create<T>(initialActiveItem?: T, settings?: ActivatorSettings): Activator<T>;

    /**
     * Determines whether or not the provided object is an activator or not.
     * @method isActivator
     * @param {object} object Any object you wish to verify as an activator or not.
     * @return {boolean} True if the object is an activator; false otherwise.
    */
    export function isActivator(object: any): boolean;
}

/**
 * The viewLocator module collaborates with the viewEngine module to provide views (literally dom sub-trees) to other parts of the framework as needed. The primary consumer of the viewLocator is the composition module.
 * @module viewLocator
 * @requires system
 * @requires viewEngine
 */
declare module 'durandal/viewLocator' {
    /**
     * Allows you to set up a convention for mapping module folders to view folders. It is a convenience method that customizes `convertModuleIdToViewId` and `translateViewIdToArea` under the covers.
     * @method useConvention
     * @param {string} [modulesPath] A string to match in the path and replace with the viewsPath. If not specified, the match is 'viewmodels'.
     * @param {string} [viewsPath] The replacement for the modulesPath. If not specified, the replacement is 'views'.
     * @param {string} [areasPath] Partial views are mapped to the "views" folder if not specified. Use this parameter to change their location.
    */
    export function useConvention(modulesPath?: string, viewsPath?: string, areasPath?: string): void;
    
    /**
     * Maps an object instance to a view instance.
     * @method locateViewForObject
     * @param {object} obj The object to locate the view for.
     * @param {DOMElement[]} [elementsToSearch] An existing set of elements to search first.
     * @return {Promise} A promise of the view.
    */
    export function locateViewForObject(obj: any, elementsToSearch?: HTMLElement[]): JQueryPromise<HTMLElement>;
    
    /**
     * Converts a module id into a view id. By default the ids are the same.
     * @method convertModuleIdToViewId
     * @param {string} moduleId The module id.
     * @return {string} The view id.
    */
    export function convertModuleIdToViewId(moduleId: string): string;

    /**
     * If no view id can be determined, this function is called to genreate one. By default it attempts to determine the object's type and use that.
     * @method determineFallbackViewId
     * @param {object} obj The object to determine the fallback id for.
     * @return {string} The view id.
    */
    export function determineFallbackViewId(obj: any): string;

    /**
     * Takes a view id and translates it into a particular area. By default, no translation occurs.
     * @method translateViewIdToArea
     * @param {string} viewId The view id.
     * @param {string} area The area to translate the view to.
     * @return {string} The translated view id.
    */
    export function translateViewIdToArea(viewId: string, area: string): string;
    
    /**
     * Locates the specified view.
     * @method locateView
     * @param {string|DOMElement} view A view. It will be immediately returned.
     * @param {string} [area] The area to translate the view to.
     * @param {DOMElement[]} [elementsToSearch] An existing set of elements to search first.
     * @return {Promise} A promise of the view.
    */
    export function locateView(view: HTMLElement, area?: string, elementsToSearch?: HTMLElement[]): JQueryPromise<HTMLElement>;
    
    /**
     * Locates the specified view.
     * @method locateView
     * @param {string|DOMElement} viewUrlOrId A view url or view id to locate.
     * @param {string} [area] The area to translate the view to.
     * @param {DOMElement[]} [elementsToSearch] An existing set of elements to search first.
     * @return {Promise} A promise of the view.
    */
    export function locateView(viewUrlOrId: string, area?: string, elementsToSearch?: HTMLElement[]): JQueryPromise<HTMLElement>;
}

/**
 * The composition module encapsulates all functionality related to visual composition.
 * @module composition
 * @requires system
 * @requires viewLocator
 * @requires binder
 * @requires viewEngine
 * @requires activator
 * @requires jquery
 * @requires knockout
 */
declare module 'durandal/composition' {
    interface CompositionTransation {
        /**
         * Registers a callback which will be invoked when the current composition transaction has completed. The transaction includes all parent and children compositions.
         * @method complete
         * @param {function} callback The callback to be invoked when composition is complete.
        */
        complete(callback: Function): void;
    }

    interface CompositionContext {
        mode: string;
        parent: HTMLElement;
        activeView: HTMLElement;
        triggerAttach(): void;
        bindingContext?: KnockoutBindingContext;
        cacheViews?: boolean;
        viewElements?: HTMLElement[];
        model?: any;
        view?: any;
        area?: string;
        preserveContext?: boolean;
        activate?: boolean;
        strategy? (context: CompositionContext): JQueryPromise<HTMLElement>;
        composingNewView: boolean;
        child: HTMLElement;
        beforeBind?: (child: HTMLElement, context: CompositionContext) => any;
        tranistion?: string;
    }

    /**
     * Converts a transition name to its moduleId.
     * @method convertTransitionToModuleId
     * @param {string} name The name of the transtion.
     * @return {string} The moduleId.
    */
    export function convertTransitionToModuleId(name: string): string;

    /**
     * The name of the transition to use in all composigions.
     * @property {string} defaultTransitionName
     * @default null
    */
    export var defaultTransitionName: string;

    /**
     * Represents the currently executing composition transaction.
     * @property {CompositionTransaction} current
     */
    export var current: CompositionTransation;

    /**
     * Registers a binding handler that will be invoked when the current composition transaction is complete.
     * @method addBindingHandler
     * @param {string} name The name of the binding handler.
     * @param {object} [config] The binding handler instance. If none is provided, the name will be used to look up an existing handler which will then be converted to a composition handler.
     * @param {function} [initOptionsFactory] If the registered binding needs to return options from its init call back to knockout, this function will server as a factory for those options. It will receive the same parameters that the init function does.
    */
    export function addBindingHandler(name, config?: KnockoutBindingHandler, initOptionsFactory?: (element?: HTMLElement, valueAccessor?: any, allBindingsAccessor?: any, viewModel?: any, bindingContext?: KnockoutBindingContext) => any);

    /**
     * Gets an object keyed with all the elements that are replacable parts, found within the supplied elements. The key will be the part name and the value will be the element itself.
     * @method getParts
     * @param {DOMElement[]} elements The elements to search for parts.
     * @return {object} An object keyed by part.
    */
    export function getParts(elements: HTMLElement[]): any;

    /**
     * Gets an object keyed with all the elements that are replacable parts, found within the supplied element. The key will be the part name and the value will be the element itself.
     * @method getParts
     * @param {DOMElement} element The element to search for parts.
     * @return {object} An object keyed by part.
    */
    export function getParts(element: HTMLElement): any;

    /**
     * Eecutes the default view location strategy.
     * @method defaultStrategy
     * @param {object} context The composition context containing the model and possibly existing viewElements.
     * @return {promise} A promise for the view.
    */
    export var defaultStrategy: (context: CompositionContext) => JQueryPromise<HTMLElement>;

    /**
     * Initiates a composition.
     * @method compose
     * @param {DOMElement} element The DOMElement or knockout virtual element that serves as the parent for the composition.
     * @param {object} settings The composition settings.
     * @param {object} [bindingContext] The current binding context.
    */
    export function compose(element: HTMLElement, settings: CompositionContext, bindingContext: KnockoutBindingContext): void;
}

/**
 * The app module controls app startup, plugin loading/configuration and root visual display.
 * @module app
 * @requires system
 * @requires viewEngine
 * @requires composition
 * @requires events
 * @requires jquery
 */
declare module 'durandal/app' {
    import Events = module('durandal/events');

    /**
     * The title of your application.
     * @property {string} title
    */
    export var title: string;
    
    /**
     * Shows a dialog via the dialog plugin.
     * @method showDialog
     * @param {object|string} obj The object (or moduleId) to display as a dialog.
     * @param {object} [activationData] The data that should be passed to the object upon activation.
     * @param {string} [context] The name of the dialog context to use. Uses the default context if none is specified.
     * @return {Promise} A promise that resolves when the dialog is closed and returns any data passed at the time of closing.
    */
    export function showDialog(obj: any, activationData?: any, context?: string):JQueryPromise;

    /**
     * Shows a message box via the dialog plugin.
     * @method showMessage
     * @param {string} message The message to display in the dialog.
     * @param {string} [title] The title message.
     * @param {string[]} [options] The options to provide to the user.
     * @return {Promise} A promise that resolves when the message box is closed and returns the selected option.
    */
    export function showMessage(message: string, title?: string, options?: string[]): JQueryPromise<string>;
    
    /**
     * Configures one or more plugins to be loaded and installed into the application.
     * @method configurePlugins
     * @param {object} config Keys are plugin names. Values can be truthy, to simply install the plugin, or a configuration object to pass to the plugin.
     * @param {string} [baseUrl] The base url to load the plugins from.
    */
    export function configurePlugins(config: Object, baseUrl?: string): void;

    /**
     * Starts the application.
     * @method start
     * @return {promise}
    */
    export function start(): JQueryPromise;

    /**
     * Sets the root module/view for the application.
     * @method setRoot
     * @param {string} root The root view or module.
     * @param {string} [transition] The transition to use from the previous root (or splash screen) into the new root.
     * @param {string} [applicationHost] The application host element id. By default the id 'applicationHost' will be used.
    */
    export function setRoot(root: any, transition?: string, applicationHost?: string): void;

    /**
     * Sets the root module/view for the application.
     * @method setRoot
     * @param {string} root The root view or module.
     * @param {string} [transition] The transition to use from the previous root (or splash screen) into the new root.
     * @param {string} [applicationHost] The application host element. By default the id 'applicationHost' will be used.
    */
    export function setRoot(root: any, transition?: string, applicationHost?: HTMLElement): void;

    /**
     * Creates a subscription or registers a callback for the specified event.
     * @method on
     * @param {string} events One or more events, separated by white space.
     * @return {Subscription} A subscription is returned.
     */
    export function on(events: string): EventSubscription;

    /**
     * Creates a subscription or registers a callback for the specified event.
     * @method on
     * @param {string} events One or more events, separated by white space.
     * @param {function} [callback] The callback function to invoke when the event is triggered.
     * @param {object} [context] An object to use as `this` when invoking the `callback`.
     * @return {Events} The events object is returned for chaining.
     */
    export function on(events: string, callback: Function, context?: any): Events;

    /**
     * Removes the callbacks for the specified events.
     * @method off
     * @param {string} [events] One or more events, separated by white space to turn off. If no events are specified, then the callbacks will be removed.
     * @param {function} [callback] The callback function to remove. If `callback` is not provided, all callbacks for the specified events will be removed.
     * @param {object} [context] The object that was used as `this`. Callbacks with this context will be removed.
     * @chainable
     */
    export function off(events: string, callback: Function, context?: any): Events;

    /**
     * Triggers the specified events.
     * @method trigger
     * @param {string} [events] One or more events, separated by white space to trigger.
     * @chainable
     */
    export function trigger(events: string, ...eventArgs:any[]): Events;

    /**
     * Creates a function that will trigger the specified events when called. Simplifies proxying jQuery (or other) events through to the events object.
     * @method proxy
     * @param {string} events One or more events, separated by white space to trigger by invoking the returned function.
     * @return {function} Calling the function will invoke the previously specified events on the events object.
     */
    export function proxy(events: string): Function;
}

/**
 * The dialog module enables the display of message boxes, custom modal dialogs and other overlays or slide-out UI abstractions. Dialogs are constructed by the composition system which interacts with a user defined dialog context. The dialog module enforced the activator lifecycle.
 * @module dialog
 * @requires system
 * @requires app
 * @requires composition
 * @requires activator
 * @requires viewEngine
 * @requires jquery
 * @requires knockout
 */
declare module 'plugins/dialog' {
    import activator = module('durandal/activator');
    import composition = module('durandal/composition');

    /**
    * Models a message box's message, title and options.
    * @class MessageBox
    */
    class Box {
        constructor(message: string, title: string, options: string[]);

        /**
         * Selects an option and closes the message box, returning the selected option through the dialog system's promise.
         * @method selectOption
         * @param {string} dialogResult The result to select.
         */
        selectOptions(dialogResult: string): void;

        /**
         * Provides the view to the composition system.
         * @method getView
         * @return {DOMElement} The view of the message box.
         */
        getView(): HTMLElement;

        /**
         * The title to be used for the message box if one is not provided.
         * @property {string} defaultTitle
         * @default Application
         * @static
         */
        static defaultTitle: string;

        /**
         * The options to display in the message box of none are specified.
         * @property {string[]} defaultOptions
         * @default ['Ok']
         * @static
         */
        static defaultOptions: string[];

        /**
         * The markup for the message box's view.
         * @property {string} defaultViewMarkup
         * @static
         */
        static defaultViewMarkup: string;
    }

    interface DialogContext {
        /**
         * In this function, you are expected to add a DOM element to the tree which will serve as the "host" for the modal's composed view. You must add a property called host to the modalWindow object which references the dom element. It is this host which is passed to the composition module.
         * @method addHost
         * @param {Dialog} theDialog The dialog model.
        */
        addHost(theDialog: Dialog);

        /**
         * This function is expected to remove any DOM machinery associated with the specified dialog and do any other necessary cleanup.
         * @method removeHost
         * @param {Dialog} theDialog The dialog model.
        */
        removeHost(theDialog: Dialog);

        /**
         * This function is called after the modal is fully composed into the DOM, allowing your implementation to do any final modifications, such as positioning or animation. You can obtain the original dialog object by using `getDialog` on context.model.
         * @method compositionComplete
         * @param {DOMElement} child The dialog view.
         * @param {DOMElement} parent The parent view.
         * @param {object} context The composition context.
        */
        compositionComplete(child: HTMLElement, parent: HTMLElement, context: composition.CompositionContext);
    }

    interface Dialog {
        owner: any;
        context: DialogContext;
        activator: activator.Activator<any>;
        close(): JQueryPromise;
        settings: composition.CompositionContext;
    }

    /**
     * The constructor function used to create message boxes.
     * @property {MessageBox} MessageBox
    */
    export var MessageBox: Box;

    /**
     * The css zIndex that the last dialog was displayed at.
     * @property {int} currentZIndex
    */
    export var currentZIndex: number;

    /**
     * Gets the next css zIndex at which a dialog should be displayed.
     * @method getNextZIndex
     * @param {int} The zIndex.
    */
    export function getNextZIndex(): number;

    /**
     * Determines whether or not there are any dialogs open.
     * @method isOpen
     * @return {boolean} True if a dialog is open. false otherwise.
    */
    export function isOpen(): boolean;

    /**
     * Gets the dialog context by name or returns the default context if no name is specified.
     * @method getContext
     * @param {string} [name] The name of the context to retrieve.
     * @return {DialogContext} True context.
    */
    export function getContext(name: string): DialogContext;

    /**
     * Adds (or replaces) a dialog context.
     * @method addContext
     * @param {string} name The name of the context to add.
     * @param {DialogContext} dialogContext The context to add.
    */
    export function addContext(name: string, modalContext: DialogContext): void;
    
    /**
     * Gets the dialog model that is associated with the specified object.
     * @method getDialog
     * @param {object} obj The object for whom to retrieve the dialog.
     * @return {Dialog} The dialog model.
    */
    export function getDialog(obj: any): Dialog;

    /**
     * Closes the dialog associated with the specified object.
     * @method close
     * @param {object} obj The object whose dialog should be closed.
     * @param {object} result* The results to return back to the dialog caller after closing.
    */
    export function close(obj: any): void;

    /**
     * Shows a dialog.
     * @method show
     * @param {object|string} obj The object (or moduleId) to display as a dialog.
     * @param {object} [activationData] The data that should be passed to the object upon activation.
     * @param {string} [context] The name of the dialog context to use. Uses the default context if none is specified.
     * @return {Promise} A promise that resolves when the dialog is closed and returns any data passed at the time of closing.
    */
    export function show(obj: any, activationData?: any, context?: string): JQueryPromise;

    /**
     * Shows a message box.
     * @method showMessage
     * @param {string} message The message to display in the dialog.
     * @param {string} [title] The title message.
     * @param {string[]} [options] The options to provide to the user.
     * @return {Promise} A promise that resolves when the message box is closed and returns the selected option.
    */
    export function showMessage(message: string, title?: string, options?: string[]): JQueryPromise<string>;

    /**
     * Installs this module into Durandal; called by the framework. Adds `app.showDialog` and `app.showMessage` convenience methods.
     * @method install
     * @param {object} [config] Add a `messageBox` property to supply a custom message box constructor. Add a `messageBoxView` property to supply custom view markup for the built-in message box.
    */
    export function install(config: Object): void;
}

/**
 * This module is based on Backbone's core history support. It abstracts away the low level details of working with browser history and url changes in order to provide a solid foundation for a router.
 * @module history
 * @requires system
 * @requires jquery
 */
declare module 'plugins/history' {
    interface HistoryOptions {
        /**
         * The function that will be called back when the fragment changes.
         * @property {function} routeHandler
         */
        routeHandler: (fragment: string) => void;

        /**
         * The url root used to extract the fragment when using push state.
         * @property {string} root
         */
        root?: string;

        /**
         * Use hash change when present.
         * @property {boolean} hashChange
         * @default true
         */
        hashChange?: boolean;

        /**
         * Use push state when present.
         * @property {boolean} pushState
         * @default false
         */
        pushState?: boolean;

        /**
         * Prevents loading of the current url when activating history.
         * @property {boolean} silent
         * @default false
         */
        silent?: boolean;
    }

    interface NavigationOptions {
        trigger: boolean;
        replace: boolean;
    }

    /**
     * The setTimeout interval used when the browser does not support hash change events.
     * @property {string} interval
     * @default 50
    */
    export var interval: number;

    /**
     * Indicates whether or not the history module is actively tracking history.
     * @property {string} active
    */
    export var active: boolean;

    /**
     * Gets the true hash value. Cannot use location.hash directly due to a bug in Firefox where location.hash will always be decoded.
     * @method getHash
     * @param {string} [window] The optional window instance
     * @return {string} The hash.
     */
    export function getHash(window?: Window): string;

    /**
     * Get the cross-browser normalized URL fragment, either from the URL, the hash, or the override.
     * @method getFragment
     * @param {string} fragment The fragment.
     * @param {boolean} forcePushState Should we force push state?
     * @return {string} he fragment.
     */
    export function getFragment(fragment: string, forcePushState: boolean): string;

    /**
     * Activate the hash change handling, returning `true` if the current URL matches an existing route, and `false` otherwise.
     * @method activate
     * @param {HistoryOptions} options.
     * @return {boolean|undefined} Returns true/false from loading the url unless the silent option was selected.
     */
    export function activate(options: HistoryOptions): boolean;

    /**
     * Disable history, perhaps temporarily. Not useful in a real app, but possibly useful for unit testing Routers.
     * @method deactivate
     */
    export function deactivate(): void;

    /**
     * Checks the current URL to see if it has changed, and if it has, calls `loadUrl`, normalizing across the hidden iframe.
     * @method checkUrl
     * @return {boolean} Returns true/false from loading the url.
     */
    export function checkUrl(): boolean;

    /**
     * Attempts to load the current URL fragment. A pass-through to options.routeHandler.
     * @method loadUrl
     * @return {boolean} Returns true/false from the route handler.
     */
    export function loadUrl(): boolean;

    /**
     * Save a fragment into the hash history, or replace the URL state if the
     * 'replace' option is passed. You are responsible for properly URL-encoding
     * the fragment in advance.
     * The options object can contain `trigger: true` if you wish to have the
     * route callback be fired (not usually desirable), or `replace: true`, if
     * you wish to modify the current URL without adding an entry to the history.
     * @method navigate
     * @param {string} fragment The url fragment to navigate to.
     * @param {object|boolean} options An options object with optional trigger and replace flags. You can also pass a boolean directly to set the trigger option. Trigger is `true` by default.
     * @return {boolean} Returns true/false from loading the url.
     */
    export function navigate(fragment: string, trigger?: boolean): boolean;

    /**
     * Save a fragment into the hash history, or replace the URL state if the
     * 'replace' option is passed. You are responsible for properly URL-encoding
     * the fragment in advance.
     * The options object can contain `trigger: true` if you wish to have the
     * route callback be fired (not usually desirable), or `replace: true`, if
     * you wish to modify the current URL without adding an entry to the history.
     * @method navigate
     * @param {string} fragment The url fragment to navigate to.
     * @param {object|boolean} options An options object with optional trigger and replace flags. You can also pass a boolean directly to set the trigger option. Trigger is `true` by default.
     * @return {boolean} Returns true/false from loading the url.
     */
    export function navigate(fragment: string, options: NavigationOptions): boolean;
}

/**
 * Enables common http request scenarios.
 * @module http
 * @requires jquery
 * @requires knockout
 */
declare module 'plugins/http' {
    /**
     * The name of the callback parameter to inject into jsonp requests by default.
     * @property {string} callbackParam
     * @default callback
    */
    export var callbackParam: string;
    
    /**
     * Makes an HTTP GET request.
     * @method get
     * @param {string} url The url to send the get request to.
     * @param {object} [query] An optional key/value object to transform into query string parameters.
     * @return {Promise} A promise of the get response data.
    */
    export function get(url: string, query?: Object): JQueryPromise;

    /**
     * Makes an JSONP request.
     * @method jsonp
     * @param {string} url The url to send the get request to.
     * @param {object} [query] An optional key/value object to transform into query string parameters.
     * @param {string} [callbackParam] The name of the callback parameter the api expects (overrides the default callbackParam).
     * @return {Promise} A promise of the response data.
    */
    export function jsonp(url: string, query?: Object, callbackParam?: string): JQueryPromise;
    
    /**
     * Makes an HTTP POST request.
     * @method post
     * @param {string} url The url to send the post request to.
     * @param {object} data The data to post. It will be converted to JSON. If the data contains Knockout observables, they will be converted into normal properties before serialization.
     * @return {Promise} A promise of the response data.
    */
    export function post(url: string, data: Object): JQueryPromise;
}

/**
 * Enables automatic observability of plain javascript object for ES5 compatible browsers. Also, converts promise properties into observables that are updated when the promise resolves.
 * @module observable
 * @requires system
 * @requires binder
 * @requires knockout
 */
declare module 'plugins/observable' {
    function observable(obj: any, property: string): KnockoutObservable;

    module observable {
        /**
         * Converts an entire object into an observable object by re-writing its attributes using ES5 getters and setters. Attributes beginning with '_' or '$' are ignored.
         * @method convertObject
         * @param {object} obj The target object to convert.
         */
        export function convertObject(obj: any): void;

        /**
         * Converts a normal property into an observable property using ES5 getters and setters.
         * @method convertProperty
         * @param {object} obj The target object on which the property to convert lives.
         * @param {string} propertyName The name of the property to convert.
         * @param {object} [original] The original value of the property. If not specified, it will be retrieved from the object.
         * @return {KnockoutObservable} The underlying observable.
         */
        export function convertProperty(obj: any, propertyName: string, original?: any): KnockoutObservable;

        /**
         * Defines a computed property using ES5 getters and setters.
         * @method defineProperty
         * @param {object} obj The target object on which to create the property.
         * @param {string} propertyName The name of the property to define.
         * @param {function|object} evaluatorOrOptions The Knockout computed function or computed options object.
         * @return {KnockoutComputed} The underlying computed observable.
         */
        export function defineProperty<T>(obj: any, propertyName: string, evaluatorOrOptions?: KnockoutComputedDefine<T>);

        /**
         * Installs the plugin into the view model binder's `beforeBind` hook so that objects are automatically converted before being bound.
         * @method install
         */
        export function install(config: Object): void;
    }

    export = observable;
}

/**
 * Serializes and deserializes data to/from JSON.
 * @module serializer
 * @requires system
 */
declare module 'plugins/serializer' {
    interface SerializerOptions {
        /**
         * The default replacer function used during serialization. By default properties starting with '_' or '$' are removed from the serialized object.
         * @method replacer
         * @param {string} key The object key to check.
         * @param {object} value The object value to check.
         * @return {object} The value to serialize.
        */
        replacer?: (key: string, value: any) => any;

        /**
         * The amount of space to use for indentation when writing out JSON.
         * @property {string|number} space
         * @default undefined
        */
        space: any;
    }

    interface DeserializerOptions {
        /**
         * Gets the type id for an object instance, using the configured `typeAttribute`.
         * @param {object} object The object to serialize.
         * @return {string} The type.
        */
        getTypeId: (object: any) => string;

        /**
         * Gets the constructor based on the type id.
         * @param {string} typeId The type id.
         * @return {Function} The constructor.
        */
        getConstructor: (typeId: string) => () => any;

        /**
         * The default reviver function used during deserialization. By default is detects type properties on objects and uses them to re-construct the correct object using the provided constructor mapping.
         * @param {string} key The attribute key.
         * @param {object} value The object value associated with the key.
         * @return {object} The value.
        */
        reviver: (key: string, value: any) => any;
    }

    /**
     * The name of the attribute that the serializer should use to identify an object's type.
     * @property {string} typeAttribute
     * @default type
    */
    export var typeAttribute: string;

    /**
     * The amount of space to use for indentation when writing out JSON.
     * @property {string|number} space
     * @default undefined
    */
    export var space: any;

    /**
     * The default replacer function used during serialization. By default properties starting with '_' or '$' are removed from the serialized object.
     * @method replacer
     * @param {string} key The object key to check.
     * @param {object} value The object value to check.
     * @return {object} The value to serialize.
    */
    export function replacer(key: string, value: any): any;

    /**
     * Serializes the object.
     * @method serialize
     * @param {object} object The object to serialize.
     * @param {object} [settings] Settings can specify a replacer or space to override the serializer defaults.
     * @return {string} The JSON string.
    */
    export function serialize(object: any, settings?: string);

    /**
     * Serializes the object.
     * @method serialize
     * @param {object} object The object to serialize.
     * @param {object} [settings] Settings can specify a replacer or space to override the serializer defaults.
     * @return {string} The JSON string.
    */
    export function serialize(object: any, settings?: number);

    /**
     * Serializes the object.
     * @method serialize
     * @param {object} object The object to serialize.
     * @param {object} [settings] Settings can specify a replacer or space to override the serializer defaults.
     * @return {string} The JSON string.
    */
    export function serialize(object: any, settings?: SerializerOptions);

    /**
     * Gets the type id for an object instance, using the configured `typeAttribute`.
     * @method getTypeId
     * @param {object} object The object to serialize.
     * @return {string} The type.
    */
    export function getTypeId(object: any): string;

    /**
     * Maps type ids to object constructor functions. Keys are type ids and values are functions.
     * @property {object} typeMap.
    */
    export var typeMap: any;

    /**
    * Adds a type id/constructor function mampping to the `typeMap`.
    * @method registerType
    * @param {string} typeId The type id.
    * @param {function} constructor The constructor.
    */
    export function registerType(typeId: string, constructor: () => any);

    /**
     * The default reviver function used during deserialization. By default is detects type properties on objects and uses them to re-construct the correct object using the provided constructor mapping.
     * @method reviver
     * @param {string} key The attribute key.
     * @param {object} value The object value associated with the key.
     * @param {function} getTypeId A custom function used to get the type id from a value.
     * @param {object} getConstructor A custom function used to get the constructor function associated with a type id.
     * @return {object} The value.
    */
    export function reviver(key: string, value: any, getTypeId: (value: any) => string, getConstructor: (string) => () => any): any;

    /**
     * Deserialize the JSON.
     * @method deserialize
     * @param {text} string The JSON string.
     * @param {DeserializerOptions} settings Settings can specify a reviver, getTypeId function or getConstructor function.
     * @return {object} The deserialized object.
    */
    export function deserialize<T>(text: string, settings?: DeserializerOptions): T;
}

/**
 * Layers the widget sugar on top of the composition system.
 * @module widget
 * @requires system
 * @requires composition
 * @requires jquery
 * @requires knockout
 */
declare module 'plugins/widget' {
    interface WidgetSettings {
        kind: string;
        model?: any;
        view?: any;
    }

    /**
     * Creates a ko binding handler for the specified kind.
     * @method registerKind
     * @param {string} kind The kind to create a custom binding handler for.
    */
    export function registerKind(kind: string);

    /**
     * Maps views and module to the kind identifier if a non-standard pattern is desired.
     * @method mapKind
     * @param {string} kind The kind name.
     * @param {string} [viewId] The unconventional view id to map the kind to.
     * @param {string} [moduleId] The unconventional module id to map the kind to.
    */
    export function mapKind(kind: string, viewId?: string, moduleId?: string);

    /**
     * Maps a kind name to it's module id. First it looks up a custom mapped kind, then falls back to `convertKindToModulePath`.
     * @method mapKindToModuleId
     * @param {string} kind The kind name.
     * @return {string} The module id.
    */
    export function mapKindToModuleId(kind: string): string;

    /**
     * Converts a kind name to it's module path. Used to conventionally map kinds who aren't explicitly mapped through `mapKind`.
     * @method convertKindToModulePath
     * @param {string} kind The kind name.
     * @return {string} The module path.
    */
    export function convertKindToModulePath(kind: string): string;

    /**
     * Maps a kind name to it's view id. First it looks up a custom mapped kind, then falls back to `convertKindToViewPath`.
     * @method mapKindToViewId
     * @param {string} kind The kind name.
     * @return {string} The view id.
    */
    export function mapKindToViewId(kind: string): string;

    /**
     * Converts a kind name to it's view id. Used to conventionally map kinds who aren't explicitly mapped through `mapKind`.
     * @method convertKindToViewPath
     * @param {string} kind The kind name.
     * @return {string} The view id.
    */
    export function convertKindToViewPath(kind: string): string;

    /**
     * Creates a widget.
     * @method create
     * @param {DOMElement} element The DOMElement or knockout virtual element that serves as the target element for the widget.
     * @param {object} settings The widget settings.
     * @param {object} [bindingContext] The current binding context.
    */
    export function create(element: HTMLElement, settings: WidgetSettings, bindingContext?: KnockoutBindingContext);
}


/**
  * A router plugin, currently based on SammyJS. The router abstracts away the core configuration of Sammy and re-interprets it in terms of durandal's composition and activation mechanism. To use the router, you must require it, configure it and bind it in the UI.
  * Documentation at http://durandaljs.com/documentation/Router/
  */
declare module "durandal/plugins/router" {
    import activator = module('durandal/activator');

    /**
      * Parameters to the map function. or information on route url patterns, see the SammyJS documentation. But 
      * basically, you can have simple routes my/route/, parameterized routes customers/:id or Regex routes. If you 
      * have a parameter in your route, then the activation data passed to your module's activate function will have a 
      * property for every parameter in the route (rather than the splat array, which is only present for automapped 
      * routes).
      */
    interface IRouteInfo {
        url: string;
        moduleId: string;
        name: string;
        /** used to set the document title */
        caption: string;
        /** determines whether or not to include it in the router's visibleRoutes array for easy navigation UI binding */
        visible: boolean;
        settings: Object;
        hash: string;
        /** only present on visible routes to track if they are active in the nav */
        isActive?: KnockoutComputed<boolean>;
    }
    /**
      * Parameters to the map function. e only required parameter is url the rest can be derived. The derivation 
      * happens by stripping parameters from the url and casing where appropriate. You can always explicitly provide 
      * url, name, moduleId, caption, settings, hash and visible. In 99% of situations, you should not need to provide 
      * hash; it's just there to simplify databinding for you. Most of the time you may want to teach the router how 
      * to properly derive the moduleId and name based on a url. If you want to do that, overwrite.
      */
    interface IRouteInfoParameters {
        /** your url pattern. The only required parameter */
        url: any;
        /** if not supplied, router.convertRouteToName derives it */
        moduleId?: string;
        /** if not supplied, router.convertRouteToModuleId derives it */
        name?: string;
        /** used to set the document title */
        caption?: string;
        /** determines whether or not to include it in the router's visibleRoutes array for easy navigation UI binding */
        visible?: boolean;
        settings?: Object;
    }
    /**
      * observable that is called when the router is ready
      */
    export var ready: KnockoutObservable<boolean>;
    /**
      * An observable array containing all route info objects.
      */
    export var allRoutes: KnockoutObservableArray<IRouteInfo>;
    /**
      * An observable array containing route info objects configured with visible:true (or by calling the mapNav function).
      */
    export var visibleRoutes: KnockoutObservableArray<IRouteInfo>;
    /**
      * An observable boolean which is true while navigation is in process; false otherwise.
      */
    export var isNavigating: KnockoutObservable<boolean>;
    /**
      * An observable whose value is the currently active item/module/page.
      */
    export var activeItem: activator.Activator<any>;
    /**
      * An observable whose value is the currently active route.
      */
    export var activeRoute: KnockoutObservable<IRouteInfo>;
    /**
      * called after an a new module is composed
      */
    export var afterCompose: () => void;
    /**
      * Returns the activatable instance from the supplied module.
      */
    export var getActivatableInstance: (routeInfo: IRouteInfo, params: any, module: any) => any;
    /**
      * Causes the router to move backwards in page history.
      */
    export var navigateBack: () => void;
    /**
      * Use router default convention.
      */
    export var useConvention: () => void;
    /**
      * Causes the router to navigate to a specific url.
      */
    export var navigateTo: (url: string) => void;
    /**
      * replaces the windows.location w/ the url
      */
    export var replaceLocation: (url: string) => void;
    /**
      * akes a route in and returns a calculated name.
      */
    export var convertRouteToName: (route: string) => string;
    /**
      * Takes a route in and returns a calculated moduleId. Simple transformations of this can be done via the useConvention function above. For more advanced transformations, you can override this function.
      */
    export var convertRouteToModuleId: (url: string) => string;
    /**
      * This can be overwritten to provide your own convention for automatically converting routes to module ids.
      */
    export var autoConvertRouteToModuleId: (url: string) => string;
    /**
      * This should not normally be overwritten. But advanced users can override this to completely transform the developer's routeInfo input into the final version used to configure the router.
      */
    export var prepareRouteInfo: (info: IRouteInfo) => void;
    /**
      * This should not normally be overwritten. But advanced users can override this to completely transform the developer's routeInfo input into the final version used to configure the router.
      */
    export var handleInvalidRoute: (route: IRouteInfo, parameters: any) => void;
    /**
      * Once the router is required, you can call router.mapAuto(). This is the most basic configuration option. When you call this function (with no parameters) it tells the router to directly correlate route parameters to module names in the viewmodels folder.
      */
    export var mapAuto: (path?: string) => void;
    /**
      * Works the same as mapRoute except that routes are automatically added to the visibleRoutes array.
      */
    export var mapNav: (url: string, moduleId?: string, name?: string) => IRouteInfo;
    /**
      * You can pass a single routeInfo to this function, or you can pass the basic configuration parameters. url is your url pattern, moduleId is the module path this pattern will map to, name is used as the document title and visible determines whether or not to include it in the router's visibleRoutes array for easy navigation UI binding.
      */
    export var mapRoute: {
        (route: IRouteInfoParameters): IRouteInfo;
        (url: string, moduleId?: string, name?: string, visible?: boolean): IRouteInfo;
    }
    /**
      * This function takes an array of routeInfo objects or a single routeInfo object and uses it to configure the router. The finalized routeInfo (or array of infos) is returned.
      */
    export var map: {
        (routeOrRouteArray: IRouteInfoParameters): IRouteInfo;
        (routeOrRouteArray: IRouteInfoParameters[]): IRouteInfo[];
    }
    /**
      * After you've configured the router, you need to activate it. This is usually done in your shell. The activate function of the router returns a promise that resolves when the router is ready to start. To use the router, you should add an activate function to your shell and return the result from that. The application startup infrastructure of Durandal will detect your shell's activate function and call it at the appropriate time, waiting for it's promise to resolve. This allows Durandal to properly orchestrate the timing of composition and databinding along with animations and splash screen display.
      */
    export var activate: (defaultRoute: string) => JQueryPromise;
    /**
      * Before any route is activated, the guardRoute funtion is called. You can plug into this function to add custom logic to allow, deny or redirect based on the requested route. To allow, return true. To deny, return false. To redirect, return a string with the hash or url. You may also return a promise for any of these values.
      */
    export var guardRoute: (routeInfo: IRouteInfo, params: any, instance: any) => any;
}

