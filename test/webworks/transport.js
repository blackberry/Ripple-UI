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
describe("webworks transport", function () {
    var webworks = require('ripple/platform/webworks/2.0.0/server'),
        spec = require('ripple/platform/webworks/2.0.0/spec'),
        transport = require('ripple/platform/webworks/2.0.0/client/transport');

    describe("spec index", function () {
        it("includes module according to proper object structure", function () {
            expect(spec.objects.blackberry.children.transport.path)
                .toEqual("webworks/2.0.0/client/transport");
        });
    });

    describe("client", function () {
        describe("poll", function () {
            it("calls a uri with callback", function () {
                var callback = jasmine.createSpy().andReturn(false),
                    response = "txt",
                    uri = "uri";

                spyOn(transport, "call").andCallFake(function (uri, opts, func) {
                    func(response);
                });

                transport.poll(uri, {get: {}}, callback);

                expect(transport.call.argsForCall[0][0]).toEqual(uri);
                expect(transport.call.argsForCall[0][1]).toEqual({async: true, get: {}});
                expect(typeof transport.call.argsForCall[0][2]).toEqual("function");
                expect(callback).toHaveBeenCalledWith(response);
            });
        });

        describe("call", function () {
            var xhr;

            beforeEach(function () {
                spyOn(global, "XMLHttpRequest").andReturn(xhr = {
                    responseText: "4",
                    open: jasmine.createSpy(),
                    send: jasmine.createSpy(),
                    setRequestHeader: jasmine.createSpy()
                });
            });

            it("adds GET params to query string", function () {
                var params = {
                        key: "value",
                        key2: "value2"
                    };

                transport.call("some/uri", {get: params});
                expect(xhr.open.mostRecentCall.args[1]).toEqual("webworks://some/uri?key=%22value%22&key2=%22value2%22");
            });

            it("adds POST params to query string", function () {
                var params = {
                        key: "value",
                        key2: "value2"
                    };

                transport.call("some/uri", {post: params});
                expect(xhr.send).toHaveBeenCalledWith('key="value"&key2="value2"');
            });

            it("can make a synchronous call", function () {
                transport.call("some/uri");
                expect(xhr.open).toHaveBeenCalledWith("POST", "webworks://some/uri", false);
            });

            it("can make an asynchronous call", function () {
                transport.call("some/uri", {async: true});
                expect(xhr.open).toHaveBeenCalledWith("POST", "webworks://some/uri", true);
            });

            it("passes a callback for an asynchronous call", function () {
                var callback = jasmine.createSpy();

                xhr.readyState = 4;
                xhr.status = 200;

                transport.call("some/uri", {async: true}, callback);
                xhr.onreadystatechange();

                expect(xhr.open).toHaveBeenCalledWith("POST", "webworks://some/uri", true);
                expect(callback).toHaveBeenCalledWith(JSON.parse(xhr.responseText));
            });
        });
    });
});
