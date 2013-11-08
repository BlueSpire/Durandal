---
title: Docs - HTTP
layout: docs
tags: ['docs','http','reference']
---
# HTTP
#### 

> The _http_ module encapsulates some common ajax needs.

This module is not required by durandal internally, so you can safely delete it if you don't want its functionality. Below are the relevant functions:

* `get(url [, query]) : promise` - Performs an HTTP GET request on the specified URL. This function returns a promise which resolves with the returned response data. You can optionally return a query object whose properties will be used to construct a query string.

* `post(url, data) : promise` - Performs an HTTP POST request on the specified URL with the supplied data. The data object is converted to JSON and the request is sent with an _application/json_ content type. Thie function returns a promise which resolves with the returned response data.

* `jsonp(url [, query, callbackParam]) : promise` - Performs a JSONP request to the specified url. You can optionally include a query object whose properties will be used to construct the query string. Also, you can pass the name of the API's callback parameter. If none is specified, it defaults to "callback". This api returns a promise. If you are using a callback parameter other than "callback" consistently throughout your application, then you may want to set the http module's `defaultJSONPCallbackParam` so that you don't need to specify it on every request.

>**Note:** The _post_ function uses the browser's JSON object internally. If your target browsers do not have support for this, and you wish to use this module, you will need to add [json2](https://github.com/douglascrockford/JSON-js)