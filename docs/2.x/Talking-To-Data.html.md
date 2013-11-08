---
title: Docs - Talking to Data
layout: docs
tags: ['docs']
---
# Talking to Data
#### 

<blockquote>
  <strong>Key Points</strong>
  <ul>
    <li>Use any service technology or backend with Durandal.</li>
    <li>Optionally, leverage our [http plugin](/documentation/api#module/http) and [serializer plugin](/documentation/api#module/serializer).</li>
    <li>Optionally leverage 3rd party data libraries.</li>
  </ul>
</blockquote>

Durandal expresses no opinions about how you handle services or backend architecture. You can use any technique that works for you. You may wish to use jQuery's ajax helpers to query JSON data services or you might prefer our simple [http plugin](/documentation/api#module/http) (which just wraps up some of jQuery's functionality) in combination with our [serializer plugin](/documentation/api#module/serializer). If you need a more advanced solution, you might look at [BreezeJS](http://www.breezejs.com/) or [JayData](http://jaydata.org/). Of course, you can always write your own.