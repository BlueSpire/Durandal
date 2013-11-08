---
title: Docs - Making Durandal Apps SEO Crawlable
layout: docs
tags: ['docs','seo', 'build']
---
# Making Durandal Apps SEO Crawlable
#### 

### Why do I need to be aware of SEO?

The web is changing. JavaScript frameworks like Durandal are rising and more and more applications are created this way, offering excellent user experiences. But, is the web ready for this movement? Let's just say that it's a "work in progress".

There are a lot of things we have to be aware of when developing a dynamic JavaScript application and one of the most important things is SEO. When we develop a Durandal application and make it available to the world, one of the first things we would like to see is the application being indexed by google. But without any configuration, the only thing we will see indexed is the root page of our site. What's the problem? I created one of my best web applications, the users love it, it's quick and optimized...but nobody can enjoy it because google can't see it.

What googlebot can see is our index page and nothing more, and the reason is because our content is generated dynamically and the web hasn't traditionally worked this way. We may think "times are changing" and Google should be aware about this...and of course it is. But to take advantage of it we have to make some changes in our application first.

### What does Google require?

To understand what Google requires, first we have to read [this documentation](https://developers.google.com/webmasters/ajax-crawling). Here's a short snippet from Google:

>"If you're running an AJAX application with content that you'd like to appear in search results, we have a new process that, when implemented, can help Google (and potentially other search engines) crawl and index your content. Historically, AJAX applications have been difficult for search engines to process because AJAX content is produced dynamically by the browser and thus not visible to crawlers. While there are existing methods for dealing with this problem, they involve regular manual maintenance to keep the content up-to-date."

### Two URL Scheme Options

If you read through the documentation you will see that there are two possible solutions to our problem:

1. Implementing a scheme using "pretty urls" with hashbangs ("#!")
2. Implementing a scheme for pages without hashbangs

The first scheme implies that our urls are using hashbangs (#!) instead hashes (#) so we´ll have urls like `http://mysite.com/#!home/index` or `http://mysite.com/#!account/user`. These kinds of urls are kwown as "pretty urls". When a googlebot arrives at this kind of url, it knows that the site supports the AJAX crawling sheme so it will change the url. The previous urls would be converted to `http://mysite.com/?_escaped_fragment_=home/index` and `http://mysite.com/?_escaped_fragment_=account/user`. These type of urls are known as a "ugly urls".

Durandal 2.0 supports the hashbang scheme by plugging into the router's `convertRouteToHash` function and replacing it with an implementation that uses "#!".  But a better solution is to use Durandal's support for push-state, allowing us to make our application crawlable using the second option.

With the second scheme we don´t have hashbangs. So, how can we tell the googlebot to crawl our site properly? Google says we have to add a new meta tag to each page that uses AJAX-generated content.

```html
<meta name="fragment" content="!">
```

In our case, we have to put the meta tag in our index page. Once the meta tag is there, the googlebot will start crawling the site in a different way.

When arriving at urls like these `http://mysite.com/home/index` and `http://mysite.com/account/user` the bot will actually crawl `http://mysite.com/home/index?_escaped_fragment_=` and `http://mysite.com/account/user?_escaped_fragment_=`. So it is pretty much the same as "#!" but with the "?_escaped_fragment_=" at the end of the url.

Once we have one of these schemes implemented in out Durandal app, we have to start listening for these urls on the server side. We have to listen for urls containing the "?_escaped_fragment_="  in order to check for bot requests. Once we are capable of listening for them, Google tells us to return an [HTML Snapshot](https://developers.google.com/webmasters/ajax-crawling/docs/html-snapshot) of the page.

### HTML Snapshots

What is an HTML Snapshot? An HTML Snapshot is a static version of our dynamically generated content. How can I get this working? Well, your best bet is using a *headless browser* to crawl your page. What is a headless browser? A headless browser is a web browser without a graphical user interface. In other words, it is a browser, a piece of software, that accesses web pages but doesn’t show them to any human being. They’re actually used to provide the content of web pages to other programs.

### Client-Side Details

We've commented about the client peice already. In the following paragraphs, we are going to make it work using the preferred second commented scheme. First, we start by changing our application to use push-state. Let's go to our router configuration in shell.js and activate the router with the pushState option enabled.

```javascript
router.activate({ pushState : true });
```

Now, let´s go to our index  page and let´s add the meta fragment tag in the head:

```html
<head>
...
    <meta name="fragment" content="!">
...
</head>
```

The client side is now ready. If we prefer to use the first scheme with "pretty urls"  and hashbangs, we have to adapt the Durandal router to use "#!" instead "#" and remove the meta fragment tag, because it´s not required with the hashbangs.

### Server-Side Details

For the following server-side code samples we will use .NET code (ASP.NET MVC) but translating it to another platform should be straighforward. When having a client application like Durandal, we use a backend platform behind it to redirect all the incoming urls to an index page.

In ASP.NET MVC we need a route like this

```c#
routes.MapRoute(
        name: "Default",
        url: "{*url}",
        defaults: new { controller = "Home", action = "Index" }
);
```

This route is redirecting all the incoming request to the "/Home/Index" route so we now need to make that work in the controller:

```c#
public ActionResult Index() {
    // If the request is not from a bot => control goes to Durandal app
    if (Request.QueryString["_escaped_fragment_"] == null) {
        return View();
    }
    
    // If the request contains the _escaped_fragment_, then we return an HTML Snapshot tp the bot
    try {
        //We´ll crawl the normal url without _escaped_fragment_
        var result = Crawl(Request.Url.AbsoluteUri.Replace("?_escaped_fragment_=", "");
        return Content(result);
    }
    catch (Exception ex) {
        // If any exception occurs then you can log the exception  and return the normal View()
        //... Wathever method to log ...
        return View();
    }
}
```

The work involved here consists in checking for the "_escaped_fragment_" parameter and if present, returning the HTML Snapshot by calling Crawl(). To take the snapshot, first we have to install a headless browser like [PhantomJs](http://phantomjs.org/). There are a lot of them so you can analyze and choose your preferred one. To install PhantomJS you should simply copy the *phantomjs.exe* file to your root website folder. Once there, you can execute the process passing a script as a parameter and your target url. There are several options to write the script but this one works pretty well:

Create a *createSnapshot.js* script like this:

```javascript
// This example shows how to render pages that perform AJAX calls
// upon page load.
//
// Instead of waiting a fixed amount of time before doing the render,
// we are keeping track of every resource that is loaded.
//
// Once all resources are loaded, we wait a small amount of time
// (resourceWait) in case these resources load other resources.
//
// The page is rendered after a maximum amount of time (maxRenderTime)
// or if no new resources are loaded.
 
var resourceWait  = 300,
    maxRenderWait = 10000;
 
var page = require('webpage').create(),
    system = require('system'),
    count = 0,
    forcedRenderTimeout,
    renderTimeout;
 
page.viewportSize = { width: 1280, height : 1024 };
 
function doRender() {
    console.log(page.content);
    phantom.exit();
}
 
page.onResourceRequested = function (req) {
    count += 1;    
    clearTimeout(renderTimeout);
};
 
page.onResourceReceived = function (res) {
    if (!res.stage || res.stage === 'end') {
        count -= 1;        
        if (count === 0) {
            renderTimeout = setTimeout(doRender, resourceWait);
        }
    }
};
 
page.open(system.args[1], function (status) {
    if (status !== "success") {        
        phantom.exit();
    } else {
        forcedRenderTimeout = setTimeout(function () {            
            doRender();
        }, maxRenderWait);
    }
});
```

The script receives the target url as a parameter. You can add this script to the Scripts folder in your ASP.NET MVC site. Finally, we have to call it to get the HTML.

```
/// <summary>
/// Start a new phantomjs process for crawling
/// </summary>
/// <param name="url">The target url</param>
/// <returns>Html string</returns>
private string Crawl(string url) {
    var appRoot = Path.GetDirectoryName(AppDomain.CurrentDomain.BaseDirectory);
    
    var startInfo = new ProcessStartInfo {
        Arguments = String.Format("{0} {1}", Path.Combine(appRoot, "Scripts\\createSnapshot.js"), url),
        FileName = Path.Combine(appRoot, "phantomjs.exe"),
        UseShellExecute = false,
        CreateNoWindow = true,
        RedirectStandardOutput = true,
        RedirectStandardError = true,
        RedirectStandardInput = true,
        StandardOutputEncoding = System.Text.Encoding.UTF8
    };

    var p = new Process();
    p.StartInfo = startInfo;
    p.Start();
    string output = p.StandardOutput.ReadToEnd();
    p.WaitForExit();
    return output;
}
```

The output will be the *console.log(page.content)* in the createSnapshot.js script and will include the complete dynamically generated HTML. That´s all. Once implemented in your site, it is recommended to use the Google Webmaster tools feature "fetch as googlebot" to check the retrieved content. 

> **Note:** In order to "fetch as googlebot"  we have to enter the complete url with the _escaped_fragment_  because the tool can´t make the _escaped_fragment_ substitution.

Here are some points for improving the code:

* When the incoming request is for an unkwown route (router.mapUnknownRoute()) we should return a 404 HTTP code from the server. We can mimic the Durandal router server side and let our backend return the 404 for us. Another option is to keep only one route catching the incoming requests and in the HomeController check the for the HTML phantomjs is returning. When we find any HTML id, class or text representing our Durandal not found view, we can return the HTTP 404 (HttpNotFoundResult).

* Another improvement is caching the content for later requests to avoid overloading the server. We can store it in an HTML file on disk or any storage system we use (Blob Storage in Azure, AWS Storage, etc.)

* We can create a separate server project exposing an API to crawl. It´s a good idea to do this if we are developing a lot of Durandal applications. Then we can share the crawler between them.

If you don't want to do this yourself or can´t use a backend, another option is using an online service for crawling. There are several options right now, for example [Blitline](http://www.blitline.com/docs/seo_optimizer) or [PhantomJsCloud](http://phantomjscloud.com/).

On Github you can find some projects that help to start with Durandal SEO like [AzureCrawler](https://github.com/yagopv/AzureCrawler) which exposes a Web API that calls the phantomjs process and returns the HTML (with the extra feature of storing the retrieved HTML on Azure Blob Storage). Or perhaps [seoserver](https://github.com/moviepilot/seoserver), a NodeJS-specific crawler.