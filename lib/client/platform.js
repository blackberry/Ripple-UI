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
    db = ripple('db'),
    utils = ripple('utils'),
    _console = ripple('console'),
    app = ripple('app'),
    event = ripple('event'),
    spec = ripple('platform/spec'),
    _self;

function _getRequestedPlatform() {
    var requestedPlatform = null,
        enableRippleArg = utils.queryString().enableripple,
        platform;

    if (enableRippleArg) {
        enableRippleArg = enableRippleArg.split('-');
        platform = spec.get(enableRippleArg[0], enableRippleArg[1]);
        if (platform) {
            requestedPlatform = { name: platform.id, version: platform.version };
        }
    }

    return requestedPlatform;
}

function _validatePlatform(platform) {
    return !(!platform ||
            !spec[platform.name] ||
            !spec[platform.name][platform.version] ||
            (spec[platform.name][platform.version] && !spec[platform.name][platform.version].objects));
}

function firstAvailablePlatform() {
    return utils.map(_self.getList(), function (platform) {
        return utils.map(platform, function (details, version) {
            return {name: details.id, version: version};
        })[0];
    })[0];
}

function _getPlatform() {
    return ripple('platform/' + _current.name + "/" + _current.version + "/spec");
}

_self = {
    initialize: function () {
        // if a selectable platform is specified, then persist it
        // else, set first available platform without saving, so first run check UI handles the selection (for UX)
        _current = _getRequestedPlatform() || db.retrieveObject("api-key");

        if (_validatePlatform(_current)) {
            db.saveObject("api-key", _current);
        } else {
            _current = firstAvailablePlatform();
        }

        _console.prefix = _current.name;
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
                db.saveObject("api-key", platform, null, baton.pass);
            }).andThen(function (prev, baton) {
                baton.take();
                db.save("device-key", deviceId, null, baton.pass);
            }).andThen(function (prev, baton) {
                //remove the persisted value for the layout
                baton.take();
                db.save("layout", null, null, baton.pass);
            }).andThen(function () {
                event.trigger("PlatformChangedEvent", [], true);
                _console.prefix = null;
                _console.log("Emulator :: loading platform " + platform.name);
            });

        save.start(callback);
    }
};

module.exports = _self;
