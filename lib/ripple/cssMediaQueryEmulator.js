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
var emulateRules = require('ripple/devices').getCurrentDevice().mediaQueryEmulation,
    styleSheets = require('ripple/emulatorBridge').document().styleSheets,
    utils = require('ripple/utils'),
    constants = require('ripple/constants'),
    media = [],
    matches,
    parsedPredicate;

module.exports = {
    init: function () {
        if (emulateRules) {
            utils.forEach(styleSheets, function (sheet) {
                if (sheet.media && sheet.media.mediaText && !utils.arrayContains(media, sheet)) {
                    media.push(sheet);
                }
                utils.forEach(utils.filter(sheet.cssRules, function (rule) {
                    return !!rule.media;
                }), function (rule) {
                    media.push(rule);
                });
            });
            console.log(media);
            //we emulate -webkit-device-pixel-ratio by changing the value in the cssText to 1, causing chrome to render it
            if (emulateRules["-webkit-device-pixel-ratio"]) {
                utils.forEach(utils.filter(media, function (mq) {
                    return mq.media.mediaText.search(constants.REGEX.WEBKIT_DEVICE_PIXEL_RATIO) > -1;
                }), function (mq) {
                    matches = mq.media.mediaText.match(constants.REGEX.WEBKIT_DEVICE_PIXEL_RATIO);
                    parsedPredicate = parseFloat(matches[2]);
                    
                    if ((!matches[1] && parsedPredicate === emulateRules["-webkit-device-pixel-ratio"]) ||
                        (matches[1] && matches[1] === "-min" && parsedPredicate <= emulateRules["-webkit-device-pixel-ratio"]) ||
                        (matches[1] && matches[1] === "-max" && parsedPredicate >= emulateRules["-webkit-device-pixel-ratio"])) {

                        mq.media.mediaText = mq.media.mediaText.replace(matches[2], "1");
                    }
                });
            }
        }
    }
};
