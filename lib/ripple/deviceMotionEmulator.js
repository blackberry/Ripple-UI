var event = require('ripple/event'),
    _self;

function _bind(name, win) {
    var callback = null;

    win.__defineGetter__(name, function () {
        return callback;
    });

    win.__defineSetter__(name, function (cb) {
        callback = cb;
    });

    return {
        get: function () {
            return callback;
        },
        set: function (value) {
            callback = value;
        },
        exec: function (arg) {
            return callback && callback(arg);
        },
        unbind: function (cb) {
            callback = cb === callback ? null : callback;
        }
    };
}
_self = {
    init: function (frame) {
        var widgetWindow = frame.contentWindow,
            _motion,
            _orientation,
            add = widgetWindow.addEventListener,
            remove = widgetWindow.removeEventListener;

        //Hang events off window (these are used to check for API existence by developer)
        widgetWindow.DeviceMotionEvent = function DeviceMotionEvent() {};
        widgetWindow.DeviceOrientationEvent = function DeviceOrientationEvent() {};

        _motion = _bind("ondevicemotion", widgetWindow);
        _orientation = _bind("ondeviceorientation", widgetWindow);

        widgetWindow.addEventListener = function (event, callback) {
            if (event === "deviceorientation") {
                _orientation.set(callback);
            }
            else if (event === "devicemotion") {
                _motion.set(callback);
            }
            else {
                add(event, callback);
            }
        };

        widgetWindow.removeEventListener = function (event, callback) {
            _motion.unbind(callback);
            _orientation.unbind(callback);
            remove(callback);
        };

        event.on("DeviceMotionEvent", function (motion) {
            _motion.exec({
                acceleration: motion.acceleration,
                accelerationIncludingGravity: motion.accelerationIncludingGravity,
                rotationRate: motion.rotationRate
            });
        });

        event.on("DeviceOrientationEvent", function (motion) {
            _orientation.exec(motion.orientation);
        });
    }
};

module.exports = _self;
