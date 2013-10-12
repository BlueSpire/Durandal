---
title: Docs - Creating a Transition
layout: docs
tags: ['docs','transitions','how to']
---
# Creating a Transition
#### 

<blockquote>
  <strong>Key Points</strong>
  <ul>
    <li>
        Durandal's composition mechanism can use a transition to animate DOM changes.
    </li>
    <li>
        Create transitions by adding a module at <em>durandal/transitions/{your-transition-name}</em>.
    </li>
    <li>
        A transition module is a function with the following signature <code>function(parent, newChild, settings):promise</code>.
    </li>
    <li>
        Versatile transitions need to take view caching into consideration.
    </li>
  </ul>
</blockquote>

### Explanation

A transition is a module which handles the adding and removing of views from the DOM.
Once the composition mechanism has located and bound views, it will call into a transition to update the DOM, if one is configured.
Configuring a transition is done by setting the _transition_ property of the compose binding to a valid transition name.
The name provided is used to resolve a module at the path _durandal/transitions/{your-transition-name}_.
This module is expected to be a function module with the following signature: `function(parent, newChild, settings):promise`.
This function should display the _newChild_ in the _parent_ element and return a promise which it resolves after it's animation sequence is complete.
Implementing a versatile transition can be a bit tricky, as several important factors need to be considered:

* There may not be a new view to show, only an old one to animate out.
* There may be an active  view to animate out (`settings.activeView`).
* The composition settings may have been configured to cach views (`settings.cacheViews`).
* The current view being composed, may already be in the DOM and may not be a new view...or it may (`settings.composingNewView`).

A versatile transition must support all these possibilities. For an example of this, see the _entrance_ transition that is provided.
Also, [see this gist](https://gist.github.com/evanlarsen/4799019) for a sample animation helper that makes it really easy to build css3-based transitions quickly and easily.