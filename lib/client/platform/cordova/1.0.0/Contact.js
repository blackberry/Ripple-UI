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
    event = ripple('event');

function _properties(obj) {
    var prop, newObj = {};
    for (prop in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, prop)) {
            if (typeof obj[prop] !== "function") {
                newObj[prop] = utils.copy(obj[prop]);
            }
        }
    }
    return newObj;
}

module.exports = function (
        id,
        displayName,
        name,
        nickname,
        phoneNumbers,
        emails,
        addresses,
        ims,
        organizations,
        birthday,
        note,
        photos,
        categories,
        urls
) {

    return {
        id: id || Math.uuid(undefined, 16),
        displayName: displayName || null,
        name: name || null,
        nickname: nickname || null,
        phoneNumbers: phoneNumbers || null,
        emails: emails || null,
        addresses: addresses || null,
        ims: ims || null,
        organizations: organizations || null,
        birthday: birthday || null,
        note: note || null,
        photos: photos || null,
        categories: categories || null,
        urls: urls || null,
        save: function (success, error) {
            var _self = this,
                lastUpdated = this.updated; // hackish

            this.updated = new Date();

            if (!this.id) {
                this.id = Math.uuid(undefined, 16);
            }

            event.trigger("phonegap-contact-save", [_properties(this), success, function (e) {
                _self.updated = lastUpdated;
                error(e);
            }]);
        },
        remove: function (success, error) {
            event.trigger("phonegap-contact-remove", [this.id, success, error]);
        },
        clone: function () {
            var copy = utils.copy(this);
            copy.id = null;
            return copy;
        }
    };
};
