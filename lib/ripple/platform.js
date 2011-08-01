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
var _current,
    db = require('ripple/db'),
    utils = require('ripple/utils'),
    _console = require('ripple/console'),
    constants = require('ripple/constants'),
    app = require('ripple/app'),
    event = require('ripple/event'),
    spec = require('ripple/platform/spec'),
    _self;

function _checkForDeprecatedPlatforms(replacement) {
    if (!spec[_current.name] ||
        !spec[_current.name][_current.version] ||
        (spec[_current.name][_current.version] && !spec[_current.name][_current.version].objects)) {
        _current = replacement;
        db.saveObject(constants.PLATFORM.SAVED_KEY, _current);
    }
}

function _getPlatform() {
    var p = require('ripple/platform/' + _current.name + "/" + _current.version + "/spec");
    return p;
}

_self = {
    initialize: function () {
        var firstAvailablePlatform = utils.map(this.getList(), function (platform) {
                    return utils.map(platform, function (details, version) {
                        return {name: details.id, version: version};
                    })[0];
                })[0];

        _current = db.retrieveObject(constants.PLATFORM.SAVED_KEY);

        if (_current) {
            _checkForDeprecatedPlatforms(firstAvailablePlatform);
        } else {
            _current = firstAvailablePlatform;
        }

        _console.prefix = _getPlatform().name;
    },

    getList: function () {
        var platformList = {};

        utils.forEach(spec, function (platform, platformKey) {
            utils.forEach(platform, function (version, versionKey) {
                platformList[platformKey] = platformList[platformKey] || {};
                platformList[platformKey][versionKey] = {
                    "id": version.id,
                    "name": version.name,
                    "type": version.type
                };
            });
        });

        return platformList;
    },

    getPersistencePrefix: function (id) {
        return _getPlatform().persistencePrefix + (id || app.getInfo().id) + "-";
    },

    current: function () {
        return _getPlatform();
    },

    changeEnvironment: function (platform, deviceId, callback) {

        var save = jWorkflow.order(function (prev, baton) {
                baton.take();
                db.saveObject(constants.PLATFORM.SAVED_KEY, platform, null, baton.pass);
            }).andThen(function (prev, baton) {
                baton.take();
                db.save(constants.DEVICE.SAVED_KEY, deviceId, null, baton.pass);
            }).andThen(function (prev, baton) {
                //remove the persisted value for the layout
                baton.take();
                db.save(constants.ENCAPSULATOR.LAYOUT, null, null, baton.pass);
            }).andThen(function () {
                event.trigger("PlatformChangedEvent", true);
                _console.prefix = null;
                _console.log("Emulator :: loading platform " + platform.name);
            });

        save.start(callback);
    }
};

module.exports = _self;
