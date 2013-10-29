---
title: Docs - Adding a Splash Screen
layout: docs
tags: ['docs','splash','how to']
---
# Adding a Splash Screen
#### 

<blockquote>
  <strong>Key Points</strong>
  <ul>
    <li>
      Consider using a splash to improve user experience.
    </li>
    <li>
      Add html to your <em>applicationHost</em> to immediately display a splash.
    </li>
    <li>
      The html should have a single root element.
    </li>
  </ul>
</blockquote>

### Explanation

Adding a splash screen to your application can be a very nice touch. It becomes important particularly if you have a large application that takes a second to download. Fortunately, it's very easy to add a splash screen with Durandal. All you need to do is put the HTML content for your splash inside the _applicationHost_ div in your page, like this:

```html
<div id="applicationHost">
    <div class="splash">
        <div class="message">
            Durandal Starter Kit
        </div>
        <i class="icon-spinner icon-2x icon-spin active"></i>
    </div>
</div>
```

The splash HTML should have a single root element. It will then display immediately when your page loads and will remain in the page until you call `app.setRoot`. For an extra added touch, you can animate your application in from the splash screen to its main view by providing the animation as the second parameter to _setRoot_ as follows: `app.setRoot('shell', 'entrance');`

>**Note:** This technique can be used at any composition site to add "loading" UI to that part of the screen while any asynchronous operations needed to render complete.