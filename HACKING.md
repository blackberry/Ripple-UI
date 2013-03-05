# Hacking Ripple

This file describes the directory structure, build process and overall dev workflow for the project.

## General Dev Workflow Notes

* `jake` is used as the go to mechanism to build, test, run code quality checks, etc (see `jake -T`).

## Folder Structure

* `assets` -> any static assets (ex css, html, themes).

* `bin` -> traditionally (in node projects), any "executable" files.

* `build` -> any JS modules that are used via `jake ...`.

* `lib` -> any core library code.

  * `lib/cli` -> any code that is used by the cli (executed via `bin/ripple`).

  * `lib/client` -> the client code. for the most part, this should be any client JS run in the browser.

  * `lib/server` -> the server portion of the code. for the most part, this is any code that is (mainly) run in node that is part of the back end of Ripple.

* `doc` -> any documentation files, which include things like the `cli` help files.

* `test` -> any test spec files and assets.

* `targets` -> this is where build specific target files are located (ex: extension specific files for the Chrome extension build are in here).

* `pkg` -> directory created during build, where all built targets are placed.

* `thirdparty` -> any thirdparty code that is not installed via NPM (defined in `package.json`).

## The `configure` Script

This script is what you need to run in order to setup a newly cloned repo for development.

    ./configure

Usually, you will only need to run this once. However, if you get errors about a certain package not existing, it probably means that NPM package dependencies have been updated, and you should run it again.

## Core Lib

This (for the most part) includes any JavaScript files used in the code base, which (for the most part) reside in `lib`.

JavaScript in Ripple is organized into CommonJS (based) modules, and are written in a modular pattern. Prototypal class based patterns are avoided, if possible. Some exceptions occur: one being if an emulated API is more easily implemented as such.

If you are writing modules that explicitly run in a node environment (ex `cli` and `server`), the "stock" `require` is used (with relative pathing):

    require('./relative/path/to/foo');

If you are writing modules in `lib/client`, you will notice the pattern is slightly different.

There is no `require` method, only a `ripple` method (that functions the same), as well as a `ripple.define` method to define modules.

Example:

    ripple('db');

..Will require a module relative to `lib/client` (in this case, `lib/client/db`).

_But_, if you are running tests in node (another reason why this was done), a `ripple` call will translate to something like this:

    require('/absolute/path/to/ripple-git-repo/lib/client/' + path);

Mainly, this was implemented to avoid the pitfalls of relative pathing in a large set of JavaScript modules (with a rather deep directory structure), rather than consistently utilizing relative pathing for Browser modules (and making it all work properly with something like [browserify](https://github.com/substack/node-browserify)).

### Client Platforms

Platforms (ex: PhoneGap, a.k.a Cordova) are organized (via directory structure) within the `client/platform` folder, and look like this:

    client/platform_name/version_number/*

Files inside that folder can be organized into whatever structure is desired (not including the `spec` folder structure detailed below).

Also, while there may be certain platform folders in `client/platform`, it does not mean that they are necessarily available to switch to. Some platforms are also a collection of core modules that are used in other platforms (ex: `client/platform/w3c`).

Currently, a platform that you can switch to is available if:

* It is defined in `client/platform/spec`.
* And, it has a corresponding `client/platform_name/version_number/spec` file (in the least).

As for the spec file, there are various modules that export types of data and/or methods that the top level `client/platform` module makes use of.

The primary use of a platform spec file is to specify objects that will be injected into the `window` object (in your application). There are also various (sometimes platform specific) options that can accompany them.

There is also an `initialize` method that, if available in the `spec` file, will be invoked during the platform bootstrap process.

You can take look at various platform spec files to see what is available.

**TO BE DOCUMENTED**: Go into detail about platform spec files, and their sub-modules.

### Client Devices

Adding a device is pretty straightforward. Look at another device file (`client/devices/device_name.js`), and create a new file for it.

Before it will show up, you need to add it to the devices list, which is in `client/devices.js`.

A device is given a generic UI around the dimensions of it, however, there is also a basic way to be able to "skin" devices. Take a look at any `device_name/skin.css` file to see how it is currently done.

**TO BE DOCUMENTED**: Go into detail about how to skin devices.

### Client UI

The client UI is organized into a core `client/ui` file, and then into atomic plugin files (residing in `client/ui/plugins`).

To create your own plugin file, take a look at any of the plugin files. Each file is just a module, which can export an `initialize` method that is invoked during the UI bootstrap process.

Before your plugin is loaded, you must add it to a list so the UI module knows to load it. There are two places you can place these:

* If you want the plugin to be loaded for any platform, add it to the `systemPlugins` array in `client/ui`.
* If you want the plugin to be loaded for a specific platform, add it to the corresponding platform `spec/ui` file, which should have a `plugins` array property (or create the file and/or property if it does not exist).

**TO BE DOCUMENTED**: Go into detail about overlay, dialog, and panel html files, etc.

### UI Themes

Themes are currently implemented as jQuery.UI themes. You can create custom themes with the [ThemeRoller](http://jqueryui.com/themeroller/).

Note: The `client/ui/themes` file is just a simple file that is used to define the folders a theme is in when copied to a target folder (see `assets/client/themes`).

## Testing

Tests are run atop [Jasmine](http://pivotal.github.com/jasmine/), and are (ideally) organized into a BDD style structure.

There are two ways to run tests.

### Within a terminal instance, in node.

This is the primary way of running tests. It uses an emulated DOM to support any browser specific things that tests may need.

Tests are run with Jake:

    jake test

The code that runs this (which can be seen through the Jakefile) resides in `build/test*`.

### In the browser.

There is a browser runner that can be booted via `jake btest`.

Any code that is used to run it resides in `build/btest*`.

## Building

You can build via `jake build`.

Any files used are located in `build/*`. To start, check out `build/build.js`.

During build, there is the concept of a build target. A build target is for packaging project components (usually `lib/client`) into usable solutions. For example, there is a target for creating Ripple as a Chrome Extension, while there is also a "hosted" target that is used by the CLI & NPM package.

For any target specific builds (that have any assets placed in `targets/target_name`), there are corresponding modules that build said targets, which are located in `build/targets/*`.

For every target that is built, they should (and will) be placed in the `pkg/` folder.

## Using Built Targets

There are various ways in which to use aspects of Ripple.

### Browser Extension

Currently, there is support for the Chrome extension framework. You can install it as an unpacked extension (either the vanilla or Blackberry version).

**TO BE DOCUMENTED**: Aspects of the Chrome Extension JS and how it all comes together.

You can also (as an alternative) use the NPM package to host your app (remotely _or_ locally), as it can inject the client UI (i.e. what the Chrome extension does) without needing the Extension. (See the NPM and Hosted Injection sections below for details).

### NPM Package

You can package the `cli` and `server` components into an NPM package, and also allows you to do other things, such as inject ripple without the extension (using the `hosted` build target).

`npm install -g .` to install.

### Hosted Injection

To inject the client UI using the NPM package, you can do something like:

    ripple emulate --path to/my/local/app

    # or

    ripple emulate --remote http://google.com

And navigate to the logged URL (with the enableripple=** query string param). Ex (on Ubuntu):

    google-chrome http://localhost:PORT/?enableripple=true
