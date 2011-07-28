/*
 * Copyright 2011 Research In Motion Limited.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var _self;

function RemoteFunctionCall(functionUri) {
    var uri = functionUri,
		params = {},
        postString = "",
        postParams = {};

    function composeUri() {
        var uri = "webworks://" + functionUri,
            paramCount = 1,
            param;

        for (param in params) {
            if (params.hasOwnProperty(param)) {
                if (paramCount === 1) {
                    uri += "?";
                } else {
                    uri += "&";
                }
                uri += param + "=" + params[param];
                paramCount++;
            }

            uri = uri.replace(/\&$/, "");
        }

        return uri;
    }

    function createXhrRequest(uri, isAsync) {
        var request = new XMLHttpRequest(),
            paramCount = 1,
            param;

        for (param in postParams) {
            if (postParams.hasOwnProperty(param)) {
                postString += param + "=" + postParams[param] + "&";
                paramCount++;
            }
        }

        postString = postString.replace(/\&$/, "");

        // TODO: make get/post
        request.open("POST", uri, isAsync);
        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        return request;
    }

    this.addParam = function (name, value) {
        params[name] = encodeURIComponent(JSON.stringify(value));
    };

    this.addPostParam = function (name, value) {
        postParams[name] = JSON.stringify(value);
    };

    this.makeSyncCall = function (success, error) {
        var requestUri = composeUri(),
            request = createXhrRequest(requestUri, false),
            response;

        request.send(postString);

        response = JSON.parse(request.responseText || "null");

        if (response.code && response.code < 0) {
            if (error) {
                error(response.msg);
            }
            else {
                throw response.msg;
            }
        }
        else {
            if (success) {
                success(response.data);
            }

            return response.data;
        }

    };

    this.makeAsyncCall = function (callback, error) {
        var requestUri = composeUri(),
            request = createXhrRequest(requestUri, true);

        request.onreadystatechange = function () {
            if (request.readyState === 4 && request.status === 200) {
                var response = JSON.parse(request.responseText || "null"),
                    cb = response.code < 0 ? error : callback,
                    data = response.code < 0 ? response.msg : response.data;

                return cb && cb(data);
            }
        };

        request.send(postString);
    };
}

_self = {
    call: function (url, opts, callback, error) {
        var request = new RemoteFunctionCall(url),
            name;

        opts = opts || {};

        if (opts.get) {
            for (name in opts.get) {
                if (Object.hasOwnProperty.call(opts.get, name)) {
                    request.addParam(name, opts.get[name]);
                }
            }
        }

        if (opts.post) {
            for (name in opts.post) {
                if (Object.hasOwnProperty.call(opts.post, name)) {
                    request.addPostParam(name, opts.post[name]);
                }
            }
        }

        return opts.async ? request.makeAsyncCall(callback, error) : request.makeSyncCall(callback, error);
    },

    poll: function (url, opts, callback) {
        opts = opts || {};
        opts.async = true;

        _self.call(url, opts, function (response) {
            if (callback(response)) {
                _self.poll(url, opts, callback);
            }
        });
    }
};

module.exports = _self;
