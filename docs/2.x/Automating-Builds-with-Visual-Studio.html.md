---
title: Docs - Automating Builds with Visual Studio
layout: docs
tags: ['docs','how to','build']
---
# Automating Builds with Visual Studio
#### 

It is a recommened practice to optimize your application for deploy. If you are working in an environment based on MSBuild or using Visual Studio in your day to day development and testing, then you may wish to automate this process. Below you will find some simple instructions explaining how to do this.

#### Install Dependencies
1. Install NodeJS from http://nodejs.org
2. Install Weyland via NPM using the following command `npm install -g weyland`

#### Add A Config File

At the project root create a js file named _weyland-config.js_
You can use the config file from the Nuget or VSIX install as is, except remove this line or your build will fail: `mainConfigFile: 'App/main.js'` (This is fixed as of 2.0.1.)

#### Add the Post Build Event

Go to the project's properties and select `Build Events`. In the post build event add the following:

```
cd $(ProjectDir)
weyland build
```

If you ony want to build when the Release configuration is selected, use the following:

```
if '$(Configuration)'=='Release' (
	cd $(ProjectDir)
	weyland build
)
```

Build your project. You should see the weyland build output in the Output window, with a last line similar to: "Optimized build created at ...App\main-built.js"

#### Include Generated Files

In the solution explorer, select "Show All Files". Under the App folder, locate _main-built.js_.
Right click and select 'Include in Project'.

#### Auto-Load Debug vs. Release

Optionally, you can use the following code in your html page to automatically load the correct file (main.js vs. main-built.js).

```c#
@if (HttpContext.Current.IsDebuggingEnabled) {
	<script type="text/javascript" src="~/Scripts/require.js" data-main="@Url.Content("~/App/main")"></script>
}
else {
	<script type="text/javascript" src="~/App/main-built.js"></script>
}
```