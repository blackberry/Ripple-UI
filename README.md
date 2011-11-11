# Ripple

A browser based, platform agnostic mobile application development and testing tool.
 
All source code (excluding third party libraries) are subject to:

Copyright (c) 2011 Research In Motion Limited

## License

All assets in this repository, unless otherwise stated through sub-directory LICENSE or NOTICE files, are subject to the Apache Software License v.2.0.

In particular, the assets under ext/assets/images are excluded from the Apache Software License v.2.0.  Please see the [NOTICE](https://github.com/blackberry/Ripple-UI/tree/master/ext/assets/images) file for more details.

## Build Requirements

* nodejs, npm, git
* OSX or linux (Windows is not currently supported for development)

## Getting Started

    ./configure

This script will pull down the needed npm packages and initialize the submodules.

## Build Commands

    jake -T

This will describe all the available commands for building and running the tests.

## Running Inside The Browser

Ripple is (by-design) browser agnostic, and is able to run inside any web browser (with disabled web security).

`jake` will build ripple to the pkg/ folder. In that folder there is a web directory and a chromium directory.

To test ripple as a Chrome/Chromium Browser extension just load the chromium folder as an unpacked extension.

To serve ripple as a standalone web app, you just place pkg/web in the root of your webserver.

To get ripple running as a standalone web app in Chrome/Chromium, you should start it with these [command line](http://www.chromium.org/developers/how-tos/run-chromium-with-flags) flags:

    --app=http://path/to/ripple-ui/pkg/web
    --disable-web-security
    --user-data-dir=/path/to/dummy/profile

## CLI &amp; NPM Package

To use the CLI:

    jake build
    node bin/cli --help

Or if you want to install it (globally) as an npm package, then:

    jake build
    npm install -g .
    ripple --help

## Code Guidelines

* 4 spaces per editor tab
* jake lint, no new lint errors introduced
* all unit tests are green

## Reference Material &amp; Community

You can also find associated reference material for the Ripple tool as well as contributor forums at the following locations.

* [Contributor Forums](http://supportforums.blackberry.com/t5/Ripple-Contributions/bd-p/ripple)
* [Documentation](http://rippledocs.tinyhippos.com/index.html)

