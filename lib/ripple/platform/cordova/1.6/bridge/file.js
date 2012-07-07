module.exports = {
    requestFileSystem: function (win, fail, args) {
        // HACK: may not be webkit
        var rfs = window.webkitRequestFileSystem;
        return rfs(args[0], args[1], win, fail);
    }
};
