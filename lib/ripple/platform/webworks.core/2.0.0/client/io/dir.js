var transport = require('ripple/platform/webworks.core/2.0.0/client/transport'),
    _uri = "blackberry/io/dir/";

module.exports = {
    createNewDir: function (path) {
        return transport.call(_uri + "createNewDir", {
            post: {path: path}
        });
    }
};
