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
describe("xhr", function () {
    var utils = ripple('utils'),
        xhr = ripple('xhr'),
        helpers = ripple('xhr/helpers'),
        XHR_orig = window.XMLHttpRequest,
        XHR_base = ripple('xhr/base'),
        XHR_cors = ripple('xhr/cors'),
        XHR_jsonp = ripple('xhr/jsonp');

    function _isEmptyObject(obj) {
        var name;
        for (name in obj) {
            return false;
        }
        return true;
    }

    function _validate(XHR) {
        var obj = new XHR();
        expect(_isEmptyObject(obj)).toBe(false);
        expect(typeof obj.open).toBe("function");
        expect(typeof obj.send).toBe("function");
    }

    describe("xhr", function () {
        describe("initialize", function () {
            describe("when proxy disabled", function () {
                afterEach(function () {
                    window.XMLHttpRequest = XHR_orig;
                });

                it("overwrites window.XMLHttpRequest with base", function () {
                    spyOn(helpers, "proxyEnabled").andReturn(false);
                    xhr.initialize();
                    expect(window.XMLHttpRequest).toBe(XHR_base);
                });
            });

            describe("when proxy enabled", function () {
                beforeEach(function () {
                    spyOn(helpers, "proxyEnabled").andReturn(true);
                });

                afterEach(function () {
                    window.XMLHttpRequest = XHR_orig;
                });

                it("overwrites window.XMLHttpRequest with cors when not on file://", function () {
                    spyOn(utils, "location").andReturn({protocol: "http://"});
                    xhr.initialize();
                    expect(window.XMLHttpRequest).toBe(XHR_cors);
                });

                it("overwrites window.XMLHttpRequest with jsonp when on file://", function () {
                    spyOn(utils, "location").andReturn({protocol: "file://"});
                    xhr.initialize();
                    expect(window.XMLHttpRequest).toBe(XHR_jsonp);
                });
            });
        });
    });

    describe("xhr/base", function () {
        it("exports a mappable xhr object", function () {
            _validate(XHR_base);
        });

        it("can legally invoke a method", function () {
            var instance = new XHR_base();
            expect(function () {
                instance.open("GET", "http://127.0.0.1");
            }).not.toThrow();
        });

        // TODO: make more assertive (need reference to old XMLHttpRequest)
        it("can set unsettable properties", function () {
            function returns(val) {
                return function () {
                    return val;
                };
            }

            var instance = new XHR_base(),
                func = function () {};

            instance.__defineGetter__("responseText", returns("dude"));
            instance.__defineGetter__("responseXML", returns("<xml>"));
            instance.__defineGetter__("status", returns(200));
            instance.__defineGetter__("readyState", returns(4));
            instance.onreadystatechange = func;

            expect(instance.onreadystatechange).toBe(func);
            expect(instance.responseText).toBe("dude");
            expect(instance.responseXML).toBe("<xml>");
            expect(instance.status).toBe(200);
            expect(instance.readyState).toBe(4);
        });
    });

    // TODO: add tests (cors)
    // test defaulting to base on local request
    describe("xhr/cors", function () {
        it("exports a mappable xhr object", function () {
            _validate(XHR_cors);
        });

        xdescribe("setRequestHeader", function () {});
        xdescribe("open", function () {});
    });

    // TODO: add tests (jsonp)
    // test send, abort, open, getAllResponseHeaders, getResponseHeader, setRequestHeader
    // test defaulting to base on local request
    describe("xhr/jsonp", function () {
        // TODO: wtf
        xit("exports a mappable xhr object", function () {
            _validate(XHR_jsonp);
        });

        xdescribe("setRequestHeader", function () {});
        xdescribe("getResponseHeader", function () {});
        xdescribe("getAllResponseHeaders", function () {});
        xdescribe("open", function () {});
        xdescribe("send", function () {});
        xdescribe("abort", function () {});
    });
});
