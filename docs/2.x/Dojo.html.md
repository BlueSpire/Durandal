---
title: Docs - Dojo
layout: docs
tags: ['docs','integration']
---
# Dojo
#### 

Here's how [Dojo](http://dojotoolkit.org/) describes itself:

> Dojo saves you time and scales with your development process, using web standards as its platform. It’s the toolkit experienced developers turn to for building high quality desktop and mobile web applications. From simple websites to large packaged enterprise applications whether desktop or mobile, Dojo will meet your needs.

Dojo is a great toolkit with lots of capabilities. However, many of its components rely on Dojo's own AMD loader.
Since Durandal relies on require.js, this presents a problem. However, they can be made to work together. Here's how:

1. Download the dojo source and install it within /App/lib/dojo (it includes dojo, dojox, and dijit folders).
2. Add the following script blocks to the bottom of your index.html:
```javascript
<script type="text/javascript">
  var dojoConfig = {
    async: true,  
    tlmSiblingOfDojo: false, 
    parseOnLoad: true,
    aliases: [['text', 'dojo/text']], 
    packages: [ 
      { name: 'durandal', location: '/App/durandal' },
      { name: 'helpers', location: '/App/helpers' }, 
      { name: 'views', location: '/App/views' },
      { name: 'viewmodels', location: '/App/viewmodels' }
    ]
  };
</script>
<script type="text/javascript" src="App/lib/dojo/dojo/dojo.js"></script>
<script type="text/javascript" src="App/main.js"></script>
```
3. Add the following line of code to the end of the finishExec() function in /App/lib/dojo/dojo/dojo.js, around line 1186 of the non-minified source, version 1.8.3:
```javascript
signal("moduleLoaded", [module.result, module.mid]);
```

> **Note:** The code specified in step 3 has been submitted via a pull request to the Dojo team. Hopefully, in the future, this step will not be necessary.

### Durandal, Dojo and ESRI ArcGIS

Are you using Durandal.js and ESRI ArcGIS? Have a look [here](https://github.com/dgwalton/DurandalEsri) to learn more about making these pieces work together.