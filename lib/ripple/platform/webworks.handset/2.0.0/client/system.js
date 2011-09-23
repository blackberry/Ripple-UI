var utils = require('ripple/utils'),
    transport = require('ripple/platform/webworks.core/2.0.0/client/transport'),
    system = require('ripple/platform/webworks.core/2.0.0/client/system'),
    _uri = "blackberry/system/",
    _self;

_self = {
    setHomeScreenBackground: function (filePath) {
        transport.call(_uri + "setHomeScreenBackground", {
            get: {filePath: filePath},
            async: true
        });
    },
};

(function () {
    // HACK: can't type check if system[key] is a function, sets off getters
    // also can't use utils.mixin or forEach for the same reason
    function get(i) {
        return function () {
            return system[i];
        };
    }

    for (var key in system) {
        if (system.hasOwnProperty(key)) {
            _self.__defineGetter__(key, get(key));
        }
    }
}());

module.exports = _self;
