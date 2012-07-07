module.exports = {
    requestFileSystem: function (win, fail, args) {
        // HACK: may not be webkit
        var rfs = window.webkitRequestFileSystem,
            type = args[0],
            size = args[1];

        // HACK: assume any FS requested over a gig in size will throw an error
        if (size > (1024 * 1024 * 1024 /* gigabyte */)) {
            fail(FileError.QUOTA_EXCEEDED_ERR);
        } else {
            return rfs(type, size, win, fail);
        }
    }
};
