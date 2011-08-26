var utils = require('ripple/utils'),
    _self, _fs;

// stupid arrays that are not arrays...
function _map(array, callback) {
    var map = [],
        i;

    for (i = 0; i < array.length; i++) {
        map[i] = callback(array[i], i);
    }

    return map;
}

function _resolveLocalFileSystemURL(path, success, error) {
    return (window.resolveLocalFileSystemURL || window.webkitResolveLocalFileSystemURL)(path, success, error);
}

function _errorHandler(e) {
    var msg = '';

    switch (e.code) {
    case FileError.QUOTA_EXCEEDED_ERR:
        msg = 'QUOTA_EXCEEDED_ERR';
        break;
    case FileError.NOT_FOUND_ERR:
        msg = 'NOT_FOUND_ERR';
        break;
    case FileError.SECURITY_ERR:
        msg = 'SECURITY_ERR';
        break;
    case FileError.INVALID_MODIFICATION_ERR:
        msg = 'INVALID_MODIFICATION_ERR';
        break;
    case FileError.INVALID_STATE_ERR:
        msg = 'INVALID_STATE_ERR';
        break;
    default:
        msg = 'Unknown Error';
        break;
    }

    console.log('FileSystem initialization error: ' + msg);
}

_self = {
    initialize: function () {
        var requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
            
        requestFileSystem(window.TEMPORARY, 10 * 1024 * 1024, function (fs) {
            _fs = fs;
        }, _errorHandler);
    },

    ls: function (path, success, error) {
        path = path || "/";

        _fs.root.getDirectory(path, {}, function (dirEntry) {
            var dirReader = dirEntry.createReader();
            dirReader.readEntries(function (entries) {
                success(_map(entries, function (entry, index) {
                    return {
                        name: entry.name,
                        isDirectory: entry.isDirectory
                    };
                }));
            }, error);
        }, error);
    },

    rm: function (path, success, error, options) {
        options = options || {};

        _fs.root[options.recursive ? "getDirectory" : "getFile"](path, {create: false}, function (entry) {
            entry[options.recursive ? "removeRecursively" : "remove"](function () {
                success(entry);
            }, error);
        }, error);
    },

    rmdir: function (path, success, error) {
        _self.rm(path, success, error, {recursive: false});
    },

    mkdir: function (path, success, error) {
        _fs.root.getDirectory(path, {create: true}, function (dirEntry) {
            success(dirEntry);
        }, error);
    },

    mv: function (from, to, success, error) {
        var path = to.split("/"),
            fileName = path[path.length - 1];

        path.splice(path.length, 1);

        _self.stat(from, function (entry) {
            _self.stat(path, {}, function (dest) {
                entry.moveTo(dest, fileName, function (finalDestination) {
                    success(finalDestination);
                }, error);
            }, error);
        }, error);
    },

    touch: function (path, success, error) {
        _fs.root.getFile(path, {create: true}, function (fileEntry) {
            success(fileEntry);
        }, error);
    },

    cp: function (from, to, success, error) {
    },

    stat: function (path, success, error) {
        var url = "filesystem:" + utils.location().origin + "/temporary/" + path;
        _resolveLocalFileSystemURL(url, function (entry) {
            success(entry);
        }, error); 
    },

    write: function (path, contents, success, error, options) {
    },

    read: function (path, success, error) {
    }
};

module.exports = _self;
