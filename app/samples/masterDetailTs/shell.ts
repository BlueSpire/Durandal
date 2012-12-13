/// <reference path="..\..\dts\knockout-2.2.d.ts" />

import projectModule = module('samples/masterDetailTs/project');
import viewModelModule = module ('durandal/viewModel');

// hack to get around
var viewModel1: any;
viewModel1 = viewModelModule;
var viewModel: viewModelModule.ViewModel;
viewModel = viewModel1;

export class Shell
{
    projects: KnockoutObservableArray;

    constructor ()
    {
        this.projects = ko.observableArray([
            new projectModule.Project("Durandal", "A cross-device, cross-platform application framework written in JavaScript, Durandal is a very small amount of code built on top of three existing and established Javascript libraries: jQuery, Knockout and RequireJS."),
            new projectModule.Project("UnityDatabinding", "A general databinding framework for Unity3D. Includes bindings for UI composition and samples for the NGUI library."),
            new projectModule.Project("Caliburn.Micro", "Caliburn.Micro is a small, yet powerful framework, designed for building applications across all Xaml Platforms. With strong support for MVVM and other proven UI patterns, Caliburn.Micro will enable you to build your solution quickly, without the need to sacrifice code quality or testability.")
        ]);
    }

    public activeProject() {
        return viewModel.activator.forItems(this.projects);
    }
};