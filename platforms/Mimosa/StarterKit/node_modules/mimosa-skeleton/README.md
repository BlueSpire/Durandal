mimosa-skeleton
===========

Mimosa needs skeletons! If you are using a cool suite of technologies and have a setup that you usually copy/paste around to get you started, then Mimosa needs you! Spend a little time and share your setup with other Mimosa users.  See the Contribute section below.

## Overview

This module adds commands for dealing with Mimosa skeletons.  This module also contains the Mimosa skeleton registry file.

Skeletons are small starter Mimosa projects that include libraries (like, for instance, BootStrap or Backbone) and boilerplate code to jumpstart application development.

Mimosa skeletons are hosted on GitHub, so this module has a dependency on git being installed and being available at the command line from the location the skeleton commands are executed.

For more information regarding Mimosa in general, see http://mimosajs.com.

## Install

In the short term, to use this module, you'll need to execute the following command:

```
mimosa mod:install mimosa-skeleton
```

After it has been installed, all of the commands this module adds to Mimosa will become available. After a few skeletons have been created, this module will become a default Mimosa module.

## Functionality

This module adds 3 new commands to Mimosa:

### mimosa skel:new <skeleton reference> <folder to create>

This command creates a new skeleton from the  [registry](https://github.com/dbashford/mimosa-skeleton/blob/master/registry.json). The command takes two arguments.

* skeleton reference: either the name of the skeleton from the [registry](https://github.com/dbashford/mimosa-skeleton/blob/master/registry.json), the url of a github repo or a local system path.
* folder to create: this parameter is optional.  If it is not provided, the skeleton will be dropped in the current directory.  If it is provided, the skeleton will be dropped in the named folder.  The named folder will be created if it does not exist.

### mimosa skel:list

This command lists all skeletons from the registry including the name, a description, the URL and some keywords for the skeleton.

### mimosa skel:search

This command takes a keyword as input, like `backbone`, and writes out all the skeletons that have that keyword.  Someday I hope Mimosa has enough skeletons that this command becomes a necessity to wade through them all.  For now it is a nice to have.

## Contribute

To contribute a skeleton, just submit a pull request or open an issue to get your skeleton added to the [registry](https://github.com/dbashford/mimosa-skeleton/blob/master/registry.json). I will curate the list but only barely. I don't care if you use Backbone or Ember or Angular or Batman, and I don't care how you organize your projects (that much)...but don't submit a Yeoman project. =)

Your skeleton can be as in depth as you'd care to make it.  You can provide a nodejs server stack if you wish.  Example code is welcome, boilerplate code is definitely encouraged. But don't submit an entire app. It shouldn't take someone using a skeleton an hour to slice out all the demo code before getting started with their own stuff.
