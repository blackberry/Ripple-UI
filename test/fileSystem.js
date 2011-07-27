/*
 *  Copyright 2011 Research In Motion Limited.
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
describe("file_system", function () {

    // TODO: make this more modular and not use itself
    // TODO: add tests for getURI exceptions
    // TODO: getFileSystemPaths returns a copied object

    var fileSystem = require('ripple/fileSystem'),
        db = require('ripple/db'),
        sinon = require('sinon'),
        s, oldXHR,
        xhrResult = 200;

    beforeEach(function () {
        s = sinon.sandbox.create();
        s.stub(db, "saveObject");
        s.stub(db, "retrieveObject");

        oldXHR = global.XMLHttpRequest = window.XMLHttpRequest;

        global.XMLHttpRequest = window.XMLHttpRequest = function () {
            return {
                open: function () {
                },
                send: function () {
                },
                status: xhrResult
            };
        };

        var defaultFileSystemPaths = fileSystem.getFileSystemPaths();
        defaultFileSystemPaths.photos.uri = "http://127.0.0.1";
        fileSystem.updateFileSystemPaths(defaultFileSystemPaths);
    });

    afterEach(function () {
        s.verifyAndRestore();
        global.XMLHttpRequest = window.XMLHttpRequest = oldXHR;
    });

    it("getURI replaces photos virtual directory0", function () {
        var newURI = fileSystem.getURI("/virtual/photos/path.jpg");
        expect(newURI).toEqual("http://127.0.0.1/path.jpg");
    });

    it("getURI replaces photos virtual directory1", function () {
        var newURI = fileSystem.getURI("/virTUal/photos/path.jpg");
        expect(newURI).toEqual("http://127.0.0.1/path.jpg");
    });

    it("exists returns false if the file doesn't exist", function () {
        xhrResult = 404;
        expect(fileSystem.exists("/virtual/photos/missing.jpg")).toEqual(false);
    });

    it("exists returns true if the file does exist", function () {
        xhrResult = 200;
        expect(fileSystem.exists("/virtual/photos/dontPanic.png")).toEqual(true);
    });

    it("it can provide an overload for a file", function () {
        var file = "http://127.0.0.1/ripple/solution/extension/chromium/images/dontPanic.png";
        fileSystem.override("virtual/photos/foo.png", file);
        expect(fileSystem.getURI("virtual/photos/foo.png")).toEqual(file);
    });

});
