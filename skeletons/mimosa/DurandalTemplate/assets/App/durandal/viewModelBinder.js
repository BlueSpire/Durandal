define(['./system'], function (system) {
    var viewModelBinder;
    var insufficientInfoMessage = 'Insufficient Information to Bind';
    var unexpectedViewMessage = 'Unexpected View Type';

    function doBind(obj, view, action) {
        if (!view || !obj) {
            if (viewModelBinder.throwOnErrors) {
                throw new Error(insufficientInfoMessage);
            } else {
                system.log(insufficientInfoMessage, view, obj);
            }
            return;
        }

        if (!view.getAttribute) {
            if (viewModelBinder.throwOnErrors) {
                throw new Error(unexpectedViewMessage);
            } else {
                system.log(unexpectedViewMessage, view, obj);
            }
            return;
        }

        var viewName = view.getAttribute('data-view');
        
        try {
            system.log('Binding', viewName, obj);
            
            viewModelBinder.beforeBind(obj, view);
            action();
            viewModelBinder.afterBind(obj, view);
        } catch (e) {
            if (viewModelBinder.throwOnErrors) {
                throw new Error(e.message + ';\nView: ' + viewName + ";\nModuleId: " + system.getModuleId(obj));
            } else {
                system.log(e.message, viewName, obj);
            }
        }
    }

    return viewModelBinder = {
        beforeBind: system.noop,
        afterBind:system.noop,
        bindContext: function(bindingContext, view, obj) {
            if (obj) {
                bindingContext = bindingContext.createChildContext(obj);
            }

            doBind(bindingContext, view, function() {
                ko.applyBindings(bindingContext, view);
                if (obj && obj.setView) {
                    obj.setView(view);
                }
            });
        },
        bind: function(obj, view) {
            doBind(obj, view, function() {
                ko.applyBindings(obj, view);
                if (obj.setView) {
                    obj.setView(view);
                }
            });
        }
    };
});