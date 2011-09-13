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
var constants = require('ripple/constants'),
    exception = require('ripple/exception'),
    utils = require('ripple/utils'),
    helpers = require('ripple/xhr/helpers'),
    _console = require('ripple/console'),
    XHR = require('ripple/xhr/base');

function _XMLHttpRequest() {
    var xhr = new XHR(),
        origMethods = {
            setRequestHeader: xhr.setRequestHeader,
            getResponseHeader: xhr.getResponseHeader,
            getAllResponseHeaders: xhr.getAllResponseHeaders,
            open: xhr.open,
            send: xhr.send,
            abort: xhr.abort
        },
        _jxhr = new window.jXHR(),
        _sendFlag = false,
        _headers = [],
        _errorFlag = false,
        _url,
        _async;

    function _localURI() {
        return _url && helpers.isLocalRequest(_url);
    }

    function _set(prop, value) {
        xhr.__defineGetter__(prop, function () {
            return value;
        });
    }

    function _reset() {
        _set("response", "");
        _set("responseText", "");
        _set("responseXML", null);
    }

    xhr.setRequestHeader = function (header, value) {
        if (_localURI()) {
            origMethods.setRequestHeader.apply(xhr, Array.prototype.slice.call(arguments));
        } else {
            _console.error("XMLHttpRequest :: setRequestHeader does not work with JSONP.");
        }
    };

    xhr.getResponseHeader = function (header) {
        return _localURI() ?
                origMethods.getAllResponseHeaders.apply(xhr, [header]) :
                _headers[header] || null;
    };

    xhr.getAllResponseHeaders = function () {
        return _localURI() ?
                origMethods.getAllResponseHeaders.apply(xhr) :
                utils.reduce(_headers, function (str, value, key) {
                    return str + key + ": " + value + '\n';
                }, "").replace(/\n$/, '');
    };

    xhr.open = function (method, url, async) {
        _url = url;
        _async = async !== false ? true : false;

        if (_localURI()) {
            origMethods.open.apply(xhr, Array.prototype.slice.call(arguments));
        } else {
            _reset();
            method = method.toUpperCase();

            if (method === "POST") {
                //HACK: Switch the method to get for now to simulate post
                method = "GET";
            }

            if (method !== "GET") {
                exception.raise(exception.types.MethodNotImplemented, "Method: " + method + " not supported!");
            }

            _jxhr.onreadystatechange = function (data) {
                var response;

                try {
                    _set("readyState", _jxhr.readyState);

                    if (xhr.readyState === xhr.DONE) {
                        _sendFlag = false;
                        _set("status", data.status);
                        _set("statusText", data.statusText);
                        _headers = data.headers;

                        if (data.responseXML) {
                            response = new DOMParser().parseFromString(unescape(data.responseXML), "text/xml");
                            _set("responseXML", response);
                        } else {
                            response = unescape(data.responseText);
                            _set("responseText", response);
                        }

                        _set("response", response);
                    }

                    if (typeof xhr.onreadystatechange === "function") {
                        xhr.onreadystatechange.apply(xhr);
                    }
                } catch (e) {
                    exception.handle(e);
                }
            };

            _jxhr.onerror = xhr.onerror;
            _jxhr.open(method, constants.API_URL + "/jsonp_xhr_proxy?callback=?&tinyhippos_apikey=ABC&tinyhippos_rurl=" + escape(url));
        }
    };

    xhr.send = function (data) {
        if (_localURI()) {
            origMethods.send(data);
            return;
        }

        if (!_async) {
            exception.raise(exception.types.MethodNotImplemented, "Synchronous not supported.");
        }

        if (xhr.readyState !== xhr.OPENED || _sendFlag === true) {
            exception.raise(exception.types.InvalidState, "Ready state should be OPENED (1)");
        }

        _errorFlag = false;
        _sendFlag = true;
        data = null;

        _jxhr.send();
    };

    xhr.abort = function () {
        if (_localURI()) {
            origMethods.abort();
            return;
        }

        _reset();

        _errorFlag = true;

        if (xhr.readyState === xhr.UNSENT ||
                (xhr.readyState === xhr.OPENED && _sendFlag === false) ||
                xhr.readyState === xhr.DONE) {
            _set("readyState", xhr.UNSENT);
        } else {
            _set("readyState", xhr.DONE);
            _sendFlag = false;

            if (typeof xhr.onreadystatechange === "function") {
                xhr.onreadystatechange.apply(xhr);
            }
        }

        _jxhr.onreadystatechange = null;

        if (xhr.onabort) {
            xhr.onabort.apply(xhr, arguments);
        }
    };

    return xhr;
}

module.exports = _XMLHttpRequest;
