---
title: Docs - Understanding Durandal's Modules
layout: docs
tags: ['docs','reference']
---
# Understanding Durandal's Modules
#### 

Durandal is distributed as a simple set of AMD modules which work together to create an amazing developer experience around building JavaScript applications. The following chart displays all the modules as well as their relationships to one another:

![Dependency Graph](/images/graph.png)

You can see from the diagram that certain modules, such as _system_ and _composition_, form a critical part of the framework's core. You can also see that _http_ exists merely as a utility and could be removed entirely (if you desire) without affecting any part of the system. It's also relatively easy to remove _events_, _modalDialog_ (and messageBox) and _widgets_ if your application doesn't use those features.