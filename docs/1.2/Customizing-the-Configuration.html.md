---
title: Docs - Customizing the Configuration
layout: docs
tags: ['docs','configuration','how to']
---
# Customizing the Configuration
#### 

<blockquote>
  <strong>Key Points</strong>
  <ul>
    <li>
        Several modules have <code>useConvention</code> helpers for common configuration options.
    </li>
    <li>
        In the module reference docs, various functions are marked with [overridable](/documentation/Overridable), indicating a point of customization.
    </li>
  </ul>
</blockquote>

### Explanation

We've attempted to build Durandal with sensible defaults. However, it's easy to change these defaults to match the needs of your own project.
The best way to learn how to do this is to skim the module reference documentation.
Throughout the documentation you will find specific functions marked with the [overridable](/documentation/Overridable) designation.
This indicates that we expected that you might want to replace this function with your own implementation, allowing  you to control some part of how Durandal is working.
In some cases, modules will have a special function called `useConvention` which overrides functions for you based on standard application organization patterns.
Two example of this are the [view locator](/documentation/View-Locator) and the [router](/documentation/Router).