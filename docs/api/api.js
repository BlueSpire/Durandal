YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "Activator",
        "ActivatorModule",
        "ActivatorSettings",
        "AppModule",
        "CompositionModule",
        "CompositionTransaction",
        "DialogContext",
        "DialogModule",
        "EntranceModule",
        "Events",
        "EventsModule",
        "HTTPModule",
        "HistoryModule",
        "HistoryOptions",
        "MessageBox",
        "ObservableModule",
        "Router",
        "RouterModule",
        "SerializerModule",
        "Subscription",
        "SystemModule",
        "ViewEngineModule",
        "ViewLocatorModule",
        "ViewModelBinderModule",
        "WidgetModule"
    ],
    "modules": [
        "activator",
        "app",
        "composition",
        "dialog",
        "entrance",
        "events",
        "history",
        "http",
        "observable",
        "router",
        "serializer",
        "system",
        "viewEngine",
        "viewLocator",
        "viewModelBinder",
        "widget"
    ],
    "allModules": [
        {
            "displayName": "activator",
            "name": "activator",
            "description": "The activator module encapsulates all logic related to screen/component activation.\nAn activator is essentially an asynchronous state machine that understands a particular state transition protocol.\nThe protocol ensures that the following series of events always occur: `canDeactivate` (previous state), `canActivate` (new state), `deactivate` (previous state), `activate` (new state).\nEach of the _can_ callbacks may return a boolean, affirmative value or promise for one of those. If either of the _can_ functions yields a false result, then activation halts."
        },
        {
            "displayName": "app",
            "name": "app",
            "description": "The app module controls app startup, plugin loading/configuration and root visual display."
        },
        {
            "displayName": "composition",
            "name": "composition",
            "description": "The composition module encapsulates all functionality related to visual composition."
        },
        {
            "displayName": "dialog",
            "name": "dialog",
            "description": "The viewLocator module collaborates with the viewEngine module to provide views (literally dom sub-trees) to other parts of the framework as needed. The primary consumer of the viewLocator is the composition module."
        },
        {
            "displayName": "entrance",
            "name": "entrance",
            "description": "The entrance transition module."
        },
        {
            "displayName": "events",
            "name": "events",
            "description": "Durandal events originate from backbone.js but also combine some ideas from signals.js as well as some additional improvements.\nEvents can be installed into any object and are installed into the `app` module by default for convenient app-wide eventing."
        },
        {
            "displayName": "history",
            "name": "history",
            "description": "Abstracts away the low level details of working with browser history and url changes in order to provide a solid foundation for a router."
        },
        {
            "displayName": "http",
            "name": "http",
            "description": "Enables common http request scenarios."
        },
        {
            "displayName": "observable",
            "name": "observable",
            "description": "Enables automatic observability of plain javascript object for ES5 compatible browsers."
        },
        {
            "displayName": "router",
            "name": "router",
            "description": "Connects the history module's url and history tracking support to Durandal's activation and composition engine allowing you to easily build navigation-style applications."
        },
        {
            "displayName": "serializer",
            "name": "serializer",
            "description": "Serializes and deserializes data to/from JSON."
        },
        {
            "displayName": "system",
            "name": "system",
            "description": "The system module encapsulates the most basic features used by other modules."
        },
        {
            "displayName": "viewEngine",
            "name": "viewEngine",
            "description": "The viewEngine module provides information to the viewLocator module which is used to locate the view's source file. The viewEngine also transforms a view id into a view instance."
        },
        {
            "displayName": "viewLocator",
            "name": "viewLocator",
            "description": "The viewLocator module collaborates with the viewEngine module to provide views (literally dom sub-trees) to other parts of the framework as needed. The primary consumer of the viewLocator is the composition module."
        },
        {
            "displayName": "viewModelBinder",
            "name": "viewModelBinder",
            "description": "The viewLocator module collaborates with the viewEngine module to provide views (literally dom sub-trees) to other parts of the framework as needed. The primary consumer of the viewLocator is the composition module."
        },
        {
            "displayName": "widget",
            "name": "widget",
            "description": "Layers the widget sugar on top of the composition system."
        }
    ]
} };
});