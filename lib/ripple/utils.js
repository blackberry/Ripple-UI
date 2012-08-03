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
var self,
    exception = require('ripple/exception'),
    constants = require('ripple/constants'),
    _HtmlElements = ['header', 'footer', 'section', 'aside', 'nav', 'article'];

self = module.exports = {
    validateNumberOfArguments: function (lowerBound, upperBound, numberOfArguments, customExceptionType, customExceptionMessage, customExceptionObject) {

        customExceptionMessage = customExceptionMessage || "";

        if (arguments.length < 3 || arguments.length > 6) {
            exception.raise(exception.types.Argument, "Wrong number of arguments when calling: validateNumberOfArguments()");
        }

        if (isNaN(lowerBound) && isNaN(upperBound) && isNaN(numberOfArguments)) {
            exception.raise(exception.types.ArgumentType, "(validateNumberOfArguments) Arguments are not numbers");
        }

        lowerBound = parseInt(lowerBound, 10);
        upperBound = parseInt(upperBound, 10);
        numberOfArguments = parseInt(numberOfArguments, 10);

        if (numberOfArguments < lowerBound || numberOfArguments > upperBound) {
            exception.raise((customExceptionType || exception.types.ArgumentLength), (customExceptionMessage + "\n\nWrong number of arguments"), customExceptionObject);
        }

    },

    validateArgumentType: function (arg, argType, customExceptionType, customExceptionMessage, customExceptionObject) {
        var invalidArg = false,
            msg;

        switch (argType) {
        case "array":
            if (!arg instanceof Array) {
                invalidArg = true;
            }
            break;
        case "date":
            if (!arg instanceof Date) {
                invalidArg = true;
            }
            break;
        case "integer":
            if (typeof arg === "number") {
                if (arg !== Math.floor(arg)) {
                    invalidArg = true;
                }
            }
            else {
                invalidArg = true;
            }
            break;
        default:
            if (typeof arg !== argType) {
                invalidArg = true;
            }
            break;
        }

        if (invalidArg) {
            msg = customExceptionMessage +  ("\n\nInvalid Argument type. argument: " + arg + " ==> was expected to be of type: " + argType);
            exception.raise((customExceptionType || exception.types.ArgumentType), msg, customExceptionObject);
        }
    },

    validateMultipleArgumentTypes: function (argArray, argTypeArray, customExceptionType, customExceptionMessage, customExceptionObject) {
        for (var i = 0; i < argArray.length; i++) {
            this.validateArgumentType(argArray[i], argTypeArray[i], customExceptionType, customExceptionMessage, customExceptionObject);
        }
    },

    createElement: function (elementType, attributes) {
        var d = document.createElement(elementType);

        if (attributes) {
            this.forEach(attributes, function (attributeValue, attributeName) {

                switch (attributeName.toLowerCase()) {

                case "innerhtml":
                    d.innerHTML = attributeValue;
                    break;

                case "innertext":
                    d.innerText = attributeValue;
                    break;

                default:
                    d.setAttribute(attributeName, attributeValue);
                }

            });
        }

        return d;
    },


    loadHTMLElements: function () {
        for (var i = 0; i < _HtmlElements.length; i += 1) {
            document.createElement(_HtmlElements[i]);
        }
    },

    getAllStylesheetRules: function getAllStylesheetRules(title) {
        this.validateNumberOfArguments(1, 1, arguments.length);

        var i, x, sheet, rules, styles_array = [];

        // get style sheet according to title
        for (i = 0; i < document.styleSheets.length; i += 1) {

            sheet = document.styleSheets[i];
            rules = sheet.cssRules;

            if (rules) {
                for (x = 0; x < rules.length; x += 1) {
                    if (rules[x].selectorText && rules[x].selectorText === (title.toString())) {
                        styles_array.push(rules[x]);
                    }
                }
            }
        }

        return (styles_array);
    },

    location: function () {
        return window.location;
    },

    queryString: function () {
        // trim the leading ? and split each name=value
        var args = this.location().search.replace(/^\?/, '').split('&');

        return args.reduce(function (obj, value) {
            if (value) {
                value = value.toLowerCase().split("=");
                obj[value[0]] = value[1];
            }
            return obj;
        }, {});
    },

    extensionUrl: function () {
        return document.getElementById("extension-url").innerText;
    },

    appLocation: function () {
        if (require('ripple/ui').registered("omnibar")) {
            var path = require('ripple/ui/plugins/omnibar').rootURL().replace(/\/$/, ""),
                parts;

            if ((parts = path.match(/^((http[s]?|ftp):\/\/)(.+\/)?([^\/].+)$/i)) !== null && parts.length === 5) {
                if (parts[4] === "about:blank") {
                    path = "";
                }
                else if (parts[3]) {
                    path = parts[1] + parts[3];
                    if (parts[4].indexOf(".") === -1) {
                        path += parts[4] + "/";
                    }
                }
                else {
                    path = parts[1] + parts[4] + "/";
                }
            }
            else {
                path = "";
            }
            return path;
        }
        return self.rippleLocation();
    },

    rippleLocation: function () {
        var loc = self.location(),
            parts = loc.pathname.replace(/\/$/, "").split("/"),
            base = "",
            port = loc.port ? ":" + loc.port : "";

        if (parts[parts.length - 1].indexOf(".") !== -1) {
            parts = parts.splice(0, parts.length - 1);
        }
        base = parts.join("/");

        return loc.protocol + "//" + loc.hostname + port + base + "/";
    },

    arrayContains: function (array, obj) {
        var i = array.length;
        while (i--) {
            if (array[i] === obj) {
                return true;
            }
        }
        return false;
    },

    some: function (obj, predicate, scope) {
        if (obj instanceof Array) {
            return obj.some(predicate, scope);
        }
        else {
            var values = self.map(obj, predicate, scope);

            return self.reduce(values, function (some, value) {
                return value ? value : some;
            }, false);
        }
    },

    count: function (obj) {
        return self.sum(obj, function (total) {
            return 1;
        });
    },

    sum: function (obj, selector, scope) {
        var values = self.map(obj, selector, scope);
        return self.reduce(values, function (total, value) {
            return total + value;
        });
    },

    max: function (obj, selector, scope) {
        var values = self.map(obj, selector, scope);
        return self.reduce(values, function (max, value) {
            return max < value ? value : max;
        }, Number.MIN_VALUE);
    },

    min: function (obj, selector, scope) {
        var values = self.map(obj, selector, scope);
        return self.reduce(values, function (min, value) {
            return min > value ? value : min;
        }, Number.MAX_VALUE);
    },

    forEach: function (obj, action, scope) {
        if (obj instanceof Array) {
            return obj.forEach(action, scope);
        }
        else {
            self.map(obj, action, scope);
        }
    },

    filter: function (obj, predicate, scope) {
        if (obj instanceof Array) {
            return obj.filter(predicate, scope);
        }
        else {
            var result = [];
            self.forEach(obj, function (value, index) {
                if (predicate.apply(scope, [value, index])) {
                    result.push(value);
                }

            }, scope);

            return result;
        }
    },

    reduce: function (obj, func, init, scope) {
        var i,
            initial = init === undefined ? 0 : init,
            result = initial;


        if (obj instanceof Array) {
            return obj.reduce(func, initial);
        }
        else if (obj instanceof NamedNodeMap) {
            for (i = 0; i < obj.length; i++) {
                result = func.apply(scope, [result, obj[i], i]);
            }
        }
        else {
            for (i in obj) {
                if (obj.hasOwnProperty(i)) {
                    result = func.apply(scope, [result, obj[i], i]);
                }
            }
        }

        return result;

    },

    map: function (obj, func, scope) {
        var i,
            returnVal = null,
            result = [];

        if (obj instanceof Array) {
            return obj.map(func, scope);
        }
        else if (obj instanceof NamedNodeMap) {
            for (i = 0; i < obj.length; i++) {
                returnVal = func.apply(scope, [obj[i], i]);
                result.push(returnVal);
            }
        }
        else {
            for (i in obj) {
                if (obj.hasOwnProperty(i)) {
                    returnVal = func.apply(scope, [obj[i], i]);
                    result.push(returnVal);
                }
            }
        }

        return result;
    },

    regexSanitize: function (regexString) {
        return regexString.replace("^", "\\^")
                    .replace("$", "\\$")
                    .replace("(", "\\(")
                    .replace(")", "\\)")
                    .replace("<", "\\<")
                    .replace("[", "\\[")
                    .replace("{", "\\{")
                    .replace(/\\/, "\\\\")
                    .replace("|", "\\|")
                    .replace(">", "\\>")
                    .replace(".", "\\.")
                    .replace("*", "\\*")
                    .replace("+", "\\+")
                    .replace("?", "\\?");
    },

    bindAutoSaveEvent: function (node, saveCallback) {
        var oldSetTimeoutId,
            jNode = jQuery(node);

        jNode.bind("keyup", function (event) {
            if (event.keyCode !== 9) {
                clearTimeout(oldSetTimeoutId);
                oldSetTimeoutId = window.setTimeout(function () {
                    saveCallback();
                }, 500);
            }
        });
    },

    find: function (comparison, collection, startInx, endInx, callback) {
        var results = [],
            compare = function (s, pattern) {

                if (typeof(s) !== "string" || pattern === null) {
                    return s === pattern;
                }

                var regex = pattern.replace(/\./g, "\\.")
                                   .replace(/\^/g, "\\^")
                                   .replace(/\*/g, ".*")
                                   .replace(/\\\.\*/g, "\\*");

                regex = "^".concat(regex, "$");

                return !!s.match(new RegExp(regex, "i"));
            };

        self.forEach(collection, function (c) {
            var match,
                fail = false;

            self.forEach(comparison, function (value, key) {
                if (!fail && value !== undefined) {

                    if (compare(c[key], value)) {
                        match = c;
                    }
                    else {
                        fail = true;
                        match = null;
                    }
                }
            });

            if (match) {
                results.push(match);
            }
        });

        if (callback) {
            if (startInx === undefined) {
                startInx = 0;
            }
            if (endInx === undefined) {
                endInx = results.length;
            }
            if (startInx === endInx) {
                endInx = startInx + 1;
            }

            callback.apply(null, [results.slice(startInx, endInx)]);
        }
    },

    mixin: function (mixin, to) {
        for (var prop in mixin) {
            if (Object.hasOwnProperty.call(mixin, prop)) {
                to[prop] = mixin[prop];
            }
        }
        return to;
    },

    copy: function (obj) {
        var i,
            newObj = jQuery.isArray(obj) ? [] : {};

        if (typeof obj === 'number' ||
            typeof obj === 'string' ||
            typeof obj === 'boolean' ||
            obj === null ||
            obj === undefined) {
            return obj;
        }

        if (obj instanceof Date) {
            return new Date(obj);
        }

        if (obj instanceof RegExp) {
            return new RegExp(obj);
        }

        for (i in obj) {
            if (obj.hasOwnProperty(i)) {
                if (obj[i] && typeof obj[i] === "object") {
                    if (obj[i] instanceof Date) {
                        newObj[i] = obj[i];
                    }
                    else {
                        newObj[i] = self.copy(obj[i]);
                    }
                }
                else {
                    newObj[i] = obj[i];
                }
            }
        }

        return newObj;
    },

    navHelper: function () {
        return {
            getHeading: function (lat1, lon1, lat2, lon2) {
                var dLon = this.rad(lon2 - lon1),
            llat1 = this.rad(lat1),
            llat2 = this.rad(lat2),
            y = Math.sin(dLon) * Math.cos(llat2),
            x = Math.cos(llat1) * Math.sin(llat2) - Math.sin(llat1) * Math.cos(llat2) * Math.cos(dLon);
                return (this.deg(Math.atan2(y, x)) + 360) % 360;
            },

            getDistance: function (lat1, lon1, lat2, lon2) {
                var dLat = this.rad(lat2 - lat1),
            dLon = this.rad(lon2 - lon1),
            a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(this.rad(lat1)) * Math.cos(this.rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2),
            c = 2 * Math.asin(Math.sqrt(a)),
            d = 6378100 * c;
                return d * 0.868976242;
            },

            simulateTravel: function (lat, lon, hdg, dist) {
                var lat1 = this.rad(lat),
            lon1 = this.rad(lon),
            brng = this.rad(hdg),
            angularDistance = dist / 6378100,
            lat2 = Math.asin(Math.sin(lat1) * Math.cos(angularDistance) + Math.cos(lat1) * Math.sin(angularDistance) * Math.cos(brng)),
            lon2 = lon1 + Math.atan2(Math.sin(brng) * Math.sin(angularDistance) * Math.cos(lat1), Math.cos(angularDistance) - Math.sin(lat1) * Math.sin(lat2));
                lon2 = (lon2 + 3 * Math.PI) % (2 * Math.PI) - Math.PI; // Normalise to -180..+180

                return {
                    latitude: this.deg(lat2),
                    longitude: this.deg(lon2)
                };
            },

            deg: function (num) {
                return num * 180 / Math.PI;
            },

            rad: function (num) {
                return num * Math.PI / 180;
            }
        };
    }
};
