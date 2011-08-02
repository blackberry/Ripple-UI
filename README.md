# Ripple

A browser based, platform agnostic mobile application development and testing tool.
 
All source code (excluding third party libraries) are subject to:

Copyright (c) 2011 Research In Motion Limited

## Build Requirements

* nodejs, npm
* OSX or linux (windows is not currently supported for development)

## Reference Material &amp; Community
You can also find associated reference material for the Ripple tool as well as contributor forums at the following locations.

* [Contributor Forums](http://supportforums.blackberry.com/t5/Ripple-Contributions/bd-p/ripple)
* [Documentation](http://rippledocs.tinyhippos.com/index.html)

## Getting Started

    ./configure

This script will pull down the needed npm packages and initialize the submodules.

## Build Commands

    jake

This will build ripple to a ripple_build folder next to the ripple-ui folder.
In that folder there is a web directory and a chromium directory.  

To test ripple as an extension in chrome/chromium just load the chromium folder as an unpacked extension.

    jake -T

This will describe all the available commands for building and running the tests

## Code Guidelines

* 4 spaces per editor tab
* jake lint, no new lint errors introduced
* all unit tests are green
