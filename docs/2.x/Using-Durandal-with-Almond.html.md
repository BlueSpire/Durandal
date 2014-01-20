---
title: Docs - Using Durandal with Almond
layout: docs
tags: ['docs','how to','build']
---
# Using Durandal with Almond
#### 

Almond is a minimal AMD API implementation for use with optimized builds. It is a replacement for RequireJS in projects which, after optimization, no longer need full AMD loader support. That said, Durandal relies on an API from RequireJS which is not present in Almond. In order to remedy this situation, we have forked Almond and added the API (a total of four lines of code). You can find the fork as well as full documentation here at https://github.com/BlueSpire/almond It works as a drop-in replacement for Almond. There are no other differences besides the additional four lines.