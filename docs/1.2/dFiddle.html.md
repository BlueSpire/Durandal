---
title: Docs - dFiddle
layout: docs
tags: ['docs','tools']
---
# dFiddle
#### 

JSFiddle et al. are all great when there's a need to fiddle with CSS/JavaScript/HTML snippets or
share code during discussions on stackoverflow or newsgroups. Unfortunately, due to the nature of Durandal which encourages you to break down apps into many smaller modules and then use 
[composition](/documentation/Using-Composition) to stitch them back together, those apps are no longer at their sweet spot. There's no easy
 way to deal with multiple smaller external files in tools like JSFiddle. [dFiddle](https://github.com/dFiddle/dFiddle-1.2) to the rescue!

### What is it?

A cut down version of [Durandal], hosted as a Github repo with only one gh-pages branch. By cutting things down to the bare
minimum, dFiddle allows bringing up live Durandal _fiddles_ in minutes.

### Basic Usage

1. Fork [dFiddle](https://github.com/dFiddle/dFiddle-1.2) on GitHub (hint: there's a fork button in the upper right) and optionally
clone it to your local machine
2. For each example in the Durandal Starter Kit you'll find a _fiddle_ version that can be used as a starting
point for your own code.
3. You're in the mood for creating more examples? Great! Simply create sub-folders in a samples sub-category
folders e.g. `samples/viewCompostion` and add it to `sampleGroups` in `index.js`. Check out
https://github.com/dFiddle/dFiddle-1.2/blob/gh-pages/App/samples/viewComposition/index.js#L9 for the exact syntax.

### Advanced Usage

1. See above.
2. Go free style by replacing every bit in the solution with your own code.

> **Note**: If your are trying to get a BreezeJS application up and running you might be better off by
hosting your solution on Microsoft Azure, as this would allow you to work with the ASP.NET Web API,
which you would have to mock up on GitHub otherwise. The same goes for fiddles that leverage other data technologies.

### Sharing the Fiddle

Once you make your first commit the live version will become available at an URL like
`http://Your_User_Name.github.io/dFiddle-1.2`. The published Url can be found under Repo | Settings | GitHub
Pages.
According to GitHub, it may take up to **ten minutes** for changes to be visible.

+ Share links to the the live version e.g. http://dfiddle.github.io/dFiddle-1.2/#/view-composition/wizard
+ Share links right down to a specific code line e.g.
https://github.com/dFiddle/dFiddle-1.2/blob/gh-pages/App/samples/viewComposition/wizard/index.js#L3

Totally optional: Whenever you find a solution for a specific issue, send a pull request so that it can be integrated.