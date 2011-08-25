var _self, _fs;

// stupid arrays that are not arrays...
function _map(array, callback) {
    var map = [],
        i;

    for (i = 0; i < array.length; i++) {
        map[i] = callback(array[i], i);
    }

    return map;
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

    rm: function (path, success, error) {
    },

    rmdir: function (path, success, error) {
    },

    mkdir: function (path, success, error) {
        _fs.root.getDirectory(path, {create: true}, function (dirEntry) {
            success(dirEntry);
        }, error);
    },

    mv: function (from, to, success, error) {
    },

    touch: function (path, success, error) {
        _fs.root.getFile(path, {create: true}, function (fileEntry) {
           success(fileEntry);
        }, error);
    },

    cp: function (from, to, success, error) {
    },

    stat: function (path, success, error) {
    }
};

module.exports = _self;
