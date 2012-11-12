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
var utils = ripple('utils'),
    emulateRules,
    transforms = {
        "-webkit-device-pixel-ratio": {
            regex: /\-webkit(\-min|\-max)?\-device\-pixel\-ratio\:\s(\d*(\.\d*)?)/i,
            action: function (mq, matches) {
                var value = parseFloat(matches[2]),
                    prefix = matches[1];

                if ((!prefix && value === emulateRules["-webkit-device-pixel-ratio"]) ||
                    (prefix && prefix === "-min" && value <= emulateRules["-webkit-device-pixel-ratio"]) ||
                    (prefix && prefix === "-max" && value >= emulateRules["-webkit-device-pixel-ratio"])) {
                    mq.media.mediaText = mq.media.mediaText.replace(matches[2], "1");
                }
            }
        }
    };

module.exports = {
    init: function (win, doc) {
        emulateRules = ripple('devices').getCurrentDevice().mediaQueryEmulation;

        if (!emulateRules) {
            return;
        }

        doc.addEventListener("DOMContentLoaded", function () {
            var media = [];

            //collect the media queries
            utils.forEach(doc.styleSheets, function (sheet) {
                //a sheet can have a media query
                if (sheet.media && sheet.media.mediaText) {
                    media.push(sheet);
                }

                //as well as a specific rule in the sheet
                utils.filter(sheet.cssRules, function (rule) {
                    return !!rule.media;
                }).forEach(function (rule) {
                    media.push(rule);
                });
            });

            media.forEach(function (mq) {
                utils.forEach(transforms, function (transform) {
                    var matches = mq.media.mediaText.match(transform.regex);

                    if (matches) {
                        transform.action(mq, matches);
                    }
                });
            });
        });
    }
};
