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
        A transition module is a function with the following signature <code>function(context):promise</code>.
    </li>
  </ul>
</blockquote>

### Explanation

A transition is a module which handles the animating of old and new DOM elements during a composition.
Once the composition mechanism has located and bound views, it will call into a transition, if one is configured.
Configuring a transition is done by setting the _transition_ property of the compose binding to a valid transition name.
The name provided is used to resolve a module at the path _durandal/transitions/{your-transition-name}_.
This module is expected to be a function module with the following signature: `function(context):promise`.
This function should animate out the old view, represented by `context.activeView` and/or animate in the new view, represented by `context.child`. It should then return a promise which it resolves after it's animation sequence is complete.

>**Note: ** Either _activeView_ or _child_ may be null, if there is no previous view or no new view. So, make sure to take this into account when writing your transition.

>**Note: ** The transition may also want to call `context.triggerAttach()` to trigger the _attached_ composition callback before the animation is complete. If it is not called by the transition, the composition system will invoke it after completion.

For an example of this, see the [entrance transition](https://github.com/BlueSpire/Durandal/blob/master/src/transitions/js/entrance.js) that is provided.