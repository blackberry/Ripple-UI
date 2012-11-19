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
describe("webworks XMLHttpRequest", function () {
    // TODO: will be switched for real module once completed
    var XHR_orig = global.XMLHttpRequest = window.XMLHttpRequest,
        XHR_base = ripple('xhr/base'),
        webworks = ripple('platform/webworks.handset/2.0.0/server'),
        XHR;

    beforeEach(function () {
        global.XMLHttpRequest = window.XMLHttpRequest = XHR_base;
        var core = ripple('platform/webworks.core/2.0.0/XMLHttpRequest');
        XHR = core.create('platform/webworks.handset/2.0.0/server');
    });

    afterEach(function () {
        global.XMLHttpRequest = window.XMLHttpRequest = XHR_orig;
    });

    describe("when mapping an api url to an object", function () {
        it("calls the underlying object method", function () {
            var url = "webworks://blackberry/the/most/incomprehensible",
                xhr = new XHR();

            webworks.blackberry.the = {
                most: {
                    incomprehensible: jasmine.createSpy()
                }
            };

            xhr.open("GET", url, false);
            xhr.send();

            expect(webworks.blackberry.the.most.incomprehensible).toHaveBeenCalled();

            delete webworks.blackberry.the;
        });

        it("passes the GET parameters as a parsed, decoded hash", function () {
            var url = "webworks://blackberry/thing/about/the",
                xhr = new XHR(),
                data = "?arg=" + encodeURIComponent(JSON.stringify("abc://")) +
                    "&arg2=" + encodeURIComponent(JSON.stringify("^ %$=&"));


            webworks.blackberry.thing = {
                about: {
                    the: function (data) {
                        expect(data.arg).toEqual("abc://");
                        expect(data.arg2).toEqual("^ %$=&");
                    }
                }
            };

            xhr.open("GET", url + data, false);
            xhr.send();

            delete webworks.blackberry.thing;
        });

        it("sets the response text as a stringified json object", function () {
            var url = "webworks://blackberry/world/is/that",
                xhr = new XHR(),
                response = {value: 5},
                spy = jasmine.createSpy().andReturn(response);

            webworks.blackberry.world = {
                is: {
                    that: spy
                }
            };

            xhr.open("GET", url, false);
            xhr.send();

            expect(xhr.responseText).toEqual(JSON.stringify(response));

            delete webworks.blackberry.world;
        });

        it("invokes ready state changes in proper order", function () {
            var url = "webworks://blackberry/it/is/comprehensible",
                xhr = new XHR(),
                states = [],
                response = {value: 5},
                spy = jasmine.createSpy();

            spy.andReturn(response);

            webworks.blackberry.it = {
                is: {
                    comprehensible: spy
                }
            };

            xhr.onreadystatechange = function () {
                states.push(xhr.readyState);
            };

            xhr.open("GET", url, false);
            xhr.send();

            expect(states.join("")).toEqual("1234");
            expect(xhr.readyState).toEqual(4);
            expect(xhr.status).toEqual(200);
            expect(xhr.responseText).toEqual(JSON.stringify(response));

            delete webworks.blackberry.it;
        });

        it("asynchronously calls ready state changes", function () {
            var url = "webworks://blackberry/abc",
                xhr = new XHR(),
                count = 0,
                response = {value: 5},
                spy = jasmine.createSpy();

            spy.andReturn(response);

            spyOn(window, "setTimeout").andCallFake(function (func) {
                func();
            });

            webworks.blackberry.abc = spy;

            xhr.onreadystatechange = function () {
                count++;
            };

            xhr.open("GET", url, true);
            xhr.send();

            expect(count).toEqual(4);
            expect(window.setTimeout).toHaveBeenCalled();
            delete webworks.blackberry.abc;
        });

        it("parses individual get parameters as JSON", function () {
            var url = "webworks://blackberry/cde",
                xhr = new XHR(),
                obj = {whatup: "dude"},
                data = "?arg=" + JSON.stringify(obj);

            spyOn(JSON, "parse").andCallThrough();

            webworks.blackberry.cde = function (data) {
                expect(data.arg).toEqual(obj);
            };

            xhr.open("GET", url + data, false);
            xhr.send();

            delete webworks.blackberry.cde;
        });

        it("passes post data as an argument", function () {
            var url = "webworks://blackberry/postoffice",
                xhr = new XHR(),
                data = {
                    the: "cat",
                    in: "the",
                    hat: "!!!"
                };

            webworks.blackberry.postoffice = function (args, postData) {
                expect(args).not.toBe(data);
                expect(postData).toEqual(data);
            };

            xhr.open("GET", url, false);
            xhr.send("the=cat&in=the&hat=!!!");

            delete webworks.blackberry.postoffice;
        });
    });
});
