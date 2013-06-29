/**
 * Durandal 2.0.0 Copyright (c) 2012 Blue Spire Consulting, Inc. All Rights Reserved.
 * Available via the MIT license.
 * see: http://durandaljs.com or https://github.com/BlueSpire/Durandal for details.
 */
define(['durandal/system', 'knockout'], function (system, ko) {
    var viewModelBinder;
    var insufficientInfoMessage = 'Insufficient Information to Bind';
    var unexpectedViewMessage = 'Unexpected View Type';

    function normalizeBindingInstruction(result){
        if(result === undefined){
            return { applyBindings: true };
        }

        if(system.isBoolean(result)){
            return { applyBindings:result };
        }

        if(result.applyBindings === undefined){
            result.applyBindings = true;
        }

        return result;
    }

    function doBind(obj, view, bindingTarget, data){
        if (!view || !bindingTarget) {
            if (viewModelBinder.throwOnErrors) {
                system.error(insufficientInfoMessage);
            } else {
                system.log(insufficientInfoMessage, view, data);
            }
            return;
        }

        if (!view.getAttribute) {
            if (viewModelBinder.throwOnErrors) {
                system.error(unexpectedViewMessage);
            } else {
                system.log(unexpectedViewMessage, view, data);
            }
            return;
        }

        var viewName = view.getAttribute('data-view');

        try {
            var instruction;

            if (obj && obj.binding) {
                instruction = obj.binding(view);
            }

            instruction = normalizeBindingInstruction(instruction);
            viewModelBinder.beforeBind(data, view, instruction);

            if(instruction.applyBindings){
                system.log('Binding', viewName, data);
                ko.applyBindings(bindingTarget, view);
            }else if(obj){
                ko.utils.domData.set(view, "__ko_bindingContext__", { $data:obj });
            }

            viewModelBinder.afterBind(data, view, instruction);

            if (obj && obj.bindingComplete) {
                obj.bindingComplete(view);
            }
        } catch (e) {
            e.message = e.message + ';\nView: ' + viewName + ";\nModuleId: " + system.getModuleId(data);
            if (viewModelBinder.throwOnErrors) {
                system.error(e);
            } else {
                system.log(e.message);
            }
        }
    }

    return viewModelBinder = {
        beforeBind: system.noop,
        afterBind: system.noop,
        throwOnErrors: false,
        bindContext: function(bindingContext, view, obj) {
            if (obj) {
                bindingContext = bindingContext.createChildContext(obj);
            }

            doBind(obj, view, bindingContext, obj || bindingContext.$data);
        },
        bind: function(obj, view) {
            doBind(obj, view, obj, obj);
        }
    };
});
