/*
 *  Copyright 2012 Research In Motion Limited.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*jshint proto:true*/

// NOTE: the code below is the equivalent to taking 12 angry cats,
// throwing them into a big sack and shaking it to make them even angrier.
// if you reach into this code, expect to be slightly mutilated.
// I recommend having a good bottle of Canadian Rye on hand... just in case

var _orig = window.webkitRequestFileSystem,
    fs = ripple('fs'),
    _console = ripple('console'),
    _io = ripple('platform/webworks.bb10/1.0.0/io'),
    _appId = ripple('app').getInfo().id,
    _sandboxedDirectoryEntry,
    _unSandboxedDirectoryEntry,
    _paths = {
        sandboxed: "/rippleFileSystem/" + _appId + "/sandbox",
        unSandboxed: "/rippleFileSystem/" + _appId + "/unsandboxed"
    };

function fsInitError(e) {
    _console.error("Something went wrong initializing the HTML5 FileSystem!");
    _console.error(e);
}

fs.mkdir(_paths.sandboxed, function (dirEntry) {
    _sandboxedDirectoryEntry = dirEntry;
}, fsInitError, {recursive: true});

fs.mkdir(_paths.unSandboxed, function (dirEntry) {
    _unSandboxedDirectoryEntry = dirEntry;

    fs.mkdir(_paths.unSandboxed + _io.SDCard, function () {
    }, fsInitError, {recursive: true}, true);

    fs.mkdir(_paths.unSandboxed + _io.home, function () {
    }, fsInitError, {recursive: true}, true);

    fs.mkdir(_paths.unSandboxed + _io.sharedFolder, function () {
        fs.mkdir(_paths.unSandboxed + _io.sharedFolder + "/Books", function () {}, fsInitError.bind(), true);
        fs.mkdir(_paths.unSandboxed + _io.sharedFolder + "/Documents", function () {}, fsInitError.bind(), true);
        fs.mkdir(_paths.unSandboxed + _io.sharedFolder + "/Downloads", function () {}, fsInitError.bind(), true);
        fs.mkdir(_paths.unSandboxed + _io.sharedFolder + "/Misc", function () {}, fsInitError.bind(), true);
        fs.mkdir(_paths.unSandboxed + _io.sharedFolder + "/Music", function () {}, fsInitError.bind(), true);
        fs.mkdir(_paths.unSandboxed + _io.sharedFolder + "/Photos", function () {}, fsInitError.bind(), true);
        fs.mkdir(_paths.unSandboxed + _io.sharedFolder + "/Print", function () {}, fsInitError.bind(), true);
        fs.mkdir(_paths.unSandboxed + _io.sharedFolder + "/Videos", function () {}, fsInitError.bind(), true);
        fs.mkdir(_paths.unSandboxed + _io.sharedFolder + "/Voice", function () {}, fsInitError.bind(), true);
    }, fsInitError, {recursive: true}, true);
}, fsInitError, {recursive: true}, true);


module.exports = function (type, size, success, fail) {
    var _internalFS = {},
        _sandboxed = _io.sandbox,
        _type = _sandboxed ? type : "PERSISTENT", // Always PERSISTENT if unsandboxed, since this is how it works on device
        coreFS = ripple('platform/webworks.bb10/1.0.0/coreFileSystem');

    function _internalSuccess(fileSystem) {
        _internalFS.name = fileSystem.name;
        _internalFS.root = coreFS.createDirectoryEntry(_sandboxed ? _sandboxedDirectoryEntry : _unSandboxedDirectoryEntry, fileSystem, _sandboxed);
        _internalFS.root.__proto__ = _sandboxed ? _sandboxedDirectoryEntry : _unSandboxedDirectoryEntry;
        _internalFS.__proto__ = fileSystem;

        success(_internalFS);
    }

    _orig(_type, size, _internalSuccess, fail);
};
