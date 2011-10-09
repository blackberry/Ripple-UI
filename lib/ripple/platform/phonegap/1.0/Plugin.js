var event = require('ripple/event');

module.exports = function (
        success,
        error,
        name,
        action,
        args,
        result
) {
    return ({
        success: success || null,
        error: error || null,
        name: name || "",
        action: action || "",
        args: args || [],
        result: result || {},
        save: function(success, error) {
            event.trigger("phonegap-plugin-save", [this, success, error]);
        },
        remove: function(success, error) {
            event.trigger("phonegap-plugin-remove", [this.name, success, error]);
        },
        exec: function(action, args, success, error) {
            if (this.action === action) {
                success(this.result);
                return;
            }
            error('could not exec phonegap plugin with (' + action + ',' + args + ')');
            return;
        }
    });
}
