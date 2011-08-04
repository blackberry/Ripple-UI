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
module.exports = {
    create: function (server) {
        var XHR = window.XMLHttpRequest,
            webworks = require(server);

        return function () {
            var _url,
                _async,
                xhr = new XHR(),
                origMethods = {
                    open: xhr.open,
                    send: xhr.send,
                    setRequestHeader: xhr.setRequestHeader
                };

            function onreadystatechange() {
                if (typeof xhr.onreadystatechange === "function") {
                    xhr.onreadystatechange();
                }
            }

            function statemachine(getResult) {
                var state = 0,
                    incState = function (prev, baton) {
                        state++;
                        if (_async) {
                            baton.take();
                            setTimeout(baton.pass, 1);
                        }
                    },
                    setResponse = function (result) {
                        xhr.__defineGetter__("status", function () {
                            return 200;
                        });

                        xhr.__defineGetter__("responseText", function () {
                            return result !== null && result !== undefined ?
                                JSON.stringify(result) : null;
                        });
                    };

                xhr.__defineGetter__("readyState", function () {
                    return state;
                });

                jWorkflow.order(incState)
                         .andThen(onreadystatechange)
                         .andThen(incState)
                         .andThen(onreadystatechange)
                         .andThen(incState)
                         .andThen(onreadystatechange)
                         .andThen(getResult)
                         .andThen(setResponse)
                         .andThen(incState)
                         .andThen(onreadystatechange)
                         .start();
            }

            xhr.setRequestHeader = function (header, value) {
                if (!_url.match(/^webworks:\/\//)) {
                    origMethods.setRequestHeader.apply(xhr, Array.prototype.slice.call(arguments));
                }
            };

            xhr.open = function (method, url, async, user, password) {
                _url = url;
                _async = async;

                if (!_url.match(/^webworks:\/\//)) {
                    origMethods.open.apply(xhr, Array.prototype.slice.call(arguments));
                }
            };

            xhr.send = function (post) {
                if (!_url.match(/^webworks:\/\//)) {
                    origMethods.send.apply(xhr, Array.prototype.slice.call(arguments));
                    return;
                }

                var params = _url.match(/\?(.*)$/),
                    objPath = _url.match(/^webworks:\/\/([^\?]*)/)[1].split("/"),
                    apiMethod = objPath.reduce(function (obj, name) {
                        return obj[name];
                    }, webworks),
                    postParams = {},
                    get = {};

                if (params) {
                    params[1].split("&").forEach(function (param) {
                            var pair = param.split("="),
                                key = decodeURIComponent(pair[0]),
                                value = decodeURIComponent(pair[1]);
                            // parsing undefied with JSON throws exception
                            get[key] = value === "undefined" ? undefined : JSON.parse(value);
                        });
                }

                if (post) {
                    post.split("&").forEach(function (param) {
                            var pair = param.split("="),
                                value;
                            try {
                                value = JSON.parse(decodeURIComponent(pair[1]));
                            } catch (e) {
                                value = pair[1] === "undefined" ? undefined : pair[1];
                            }

                            postParams[pair[0]] = value;
                        });
                }

                statemachine(function (prev, baton) {
                    return apiMethod(get, postParams, baton);
                });
            };

            return xhr;
        };
    }
};
