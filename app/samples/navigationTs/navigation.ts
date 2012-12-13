/// <reference path="..\..\dts\knockout-2.2.d.ts" />

import viewModelModule = module ('durandal/viewModel');

// hack to get around
var viewModel1: any;
viewModel1 = viewModelModule;
var viewModel: viewModelModule.ViewModel;
viewModel = viewModel1;

export class First {
    displayName = 'First Page';
    activate() {
    }
}

export class Second {
    displayName = 'Second Page';
    activate() {
    }
}

export class Shell {
    displayName = "Navigation";
    activeItem = viewModel.activator(new First());
    
    public gotoFirst() {
            this.activeItem(new First());
        }

    public gotoSecond() {
            this.activeItem(new Second);
    }
}