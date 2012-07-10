var fs,
    topCordova = window.top.require('ripple/platform/cordova/1.6/spec'),
    BlobBuilder = (window.BlobBuilder || window.WebKitBlobBuilder),
    rlfsu = window.webkitResolveLocalFileSystemURL;

function cleanPath(path) {
    while (path[0] && path[0] === '/') {
        path = path.substr(1);
    }
    return path;
}

module.exports = {
    requestFileSystem: function (win, fail, args) {
        // HACK: may not be webkit
        var rfs = window.webkitRequestFileSystem,
            type = args[0],
            size = args[1];

        // HACK: assume any FS requested over a gig in size will throw an error
        if (size > (1024 * 1024 * 1024 /* gigabyte */)) {
            if (fail) fail(FileError.QUOTA_EXCEEDED_ERR);
        } else {
            return rfs(type, size, function (effes) {
                fs = effes;
                win(effes);
            }, fail);
        }
    },
    resolveLocalFileSystemURI: function (win, fail, args) {
        var uri = args[0],
            fulluri = fs.root.toURL();

        uri = cleanPath(uri);

        fulluri += uri;

        return rlfsu(fulluri, function (entry) {
            if (win) win(entry);
        }, function (error) {
            if (fail) fail(error.code);
        });
    },
    getFile: function (win, fail, args) {
        var path = args[0],
            filename = args[1],
            options = args[2],
            file = '';

        path = cleanPath(path);
        filename = cleanPath(filename);

        if (path) {
            file = path + '/';
        }
        file += filename;

        fs.root.getFile(file, options, function (entry) {
            if (win) win(entry);
        }, function (err) {
            if (fail) fail(err.code);
        });
    },
    remove: function (win, fail, args) {
        var file = args[0];
        rlfsu(fs.root.toURL() + file, function (entry) {
            entry.remove(function () {
                if (win) win();
            }, function (err) {
                if (fail) fail(err.code);
            });
        }, fail);
    },
    readEntries: function (win, fail, args) {
        var root = fs.root.toURL(),
            path = args[0],
            reader;

        path = cleanPath(path);
        path = root + path;

        rlfsu(path, function (entry) {
            reader = entry.createReader();
            reader.readEntries(function (entries) {
                if (win) win(entries);
            }, function (err) {
                if (fail) fail(err.code);
            });
        }, function (err) {
            if (fail) fail(err.code);
        });
    },
    getDirectory: function (win, fail, args) {
        var path = args[0],
            filename = args[1],
            options = args[2],
            file = '';

        path = cleanPath(path);
        filename = cleanPath(filename);

        if (path) {
            file = path + '/';
        }
        file += filename;

        fs.root.getDirectory(file, options, function (entry) {
            if (win) win(entry);
        }, function (err) {
            if (fail) fail(err.code);
        });
    },
    removeRecursively: function (win, fail, args) {
        var root = fs.root.toURL(),
            path = args[0];

        path = cleanPath(path);

        rlfsu(root + path, function (dirEntry) {
            dirEntry.removeRecursively(function () {
                if (win) win();
            }, function (err) {
                if (fail) fail(err.code);
            });
        }, function (err) {
            if (fail) fail(err.code);
        });
    },
    getFileMetadata: function (win, fail, args) {
        var path = args[0],
            root = fs.root.toURL();

        path = cleanPath(path);

        rlfsu(root + path, function (entry) {
            entry.file(function (file) {
                if (win) win(file);
            }, function (err) {
                if (fail) fail(err.code);
            });
        }, function (err) {
            if (fail) fail(err.code);
        });
    },
    getMetadata: function (win, fail, args) {
        var path = args[0],
            root = fs.root.toURL();

        path = cleanPath(path);
        
        rlfsu(root + path, function (entry) {
            entry.getMetadata(function (data) {
                if (win) win(data);
            }, function (err) {
                if (fail) fail(err.code);
            });
        }, function (err) {
            if (fail) fail(err.code);
        });
    },
    getParent: function (win, fail, args) {
        var path = args[0],
            root = fs.root.toURL();

        path = cleanPath(path);

        rlfsu(root + path, function (entry) {
            entry.getParent(function (dirEntry) {
                if (win) win(dirEntry);
            }, function (err) {
                if (fail) fail(err.code);
            });
        }, function (err) {
            if (fail) fail(err.code);
        });
    },
    copyTo: function (win, fail, args) {
        var src = args[0],
            parent = args[1],
            name = args[2],
            root = fs.root.toURL();

        parent = cleanPath(parent);
        src = cleanPath(src);

        // get the directoryentry that we will copy TO
        rlfsu(root + parent, function (parentDirToCopyTo) {
            rlfsu(root + src, function (sourceDir) {
                sourceDir.copyTo(parentDirToCopyTo, name, function (newEntry) {
                    if (win) win(newEntry);
                }, function (err) {
                    if (fail) fail(err.code);
                });
            }, function (err) {
                if (fail) fail(err.code);
            });
        }, function (err) {
            if (fail) fail(err.code);
        });
    },
    moveTo: function (win, fail, args) {
        var src = args[0],
            parent = args[1],
            name = args[2],
            root = fs.root.toURL();

        parent = cleanPath(parent);
        src = cleanPath(src);

        // get the directoryentry that we will move TO
        rlfsu(root + parent, function (parentDirToMoveTo) {
            rlfsu(root + src, function (sourceDir) {
                sourceDir.moveTo(parentDirToMoveTo, name, function (newEntry) {
                    if (win) win(newEntry);
                }, function (err) {
                    if (fail) fail(err.code);
                });
            }, function (err) {
                if (fail) fail(err.code);
            });
        }, function (err) {
            if (fail) fail(err.code);
        });
    },
    write: function (win, fail, args) {
        var file = args[0],
            text = args[1],
            position = args[2],
            root = fs.root.toURL(),
            sourcepath,
            bb = new BlobBuilder();

        // Format source path
        sourcepath = (file.fullPath ? file.fullPath : '') + file.name;
        sourcepath = cleanPath(sourcepath);

        // Create a blob for the text to be written
        bb.append(text);

        // Get the FileEntry, create if necessary
        fs.root.getFile(sourcepath, {create: true}, function (entry) {
            // Create a FileWriter for this entry
            entry.createWriter(function (writer) {
                writer.onwriteend = function (progressEvt) {
                    if (win) win(progressEvt.total);
                };
                writer.onerror = function (err) {
                    if (fail) fail(err.code);
                };

                if (position && position > 0) {
                    writer.seek(position);
                }
                writer.write(bb.getBlob('text/plain'));
            }, function (err) {
                if (fail) fail(err.code);
            });
        }, function (err) {
            if (fail) fail(err.code);
        });
    },
    readAsText: function (win, fail, args) {
        var path = args[0],
            encoding = args[1],
            FileReader = topCordova.nativeMethods.FileReader,
            fr = new FileReader(),
            root = fs.root.toURL();

        // Set up FileReader events
        fr.onerror = function (err) {
            if (fail) fail(err.code);
        };
        fr.onload = function (evt) {
            if (win) win(evt.target.result);
        };

        path = cleanPath(path);

        fs.root.getFile(path, {create: false}, function (entry) {
            entry.file(function (blob) {
                fr.readAsText(blob, encoding);
            }, function (err) {
                if (fail) fail(err.code);
            });
        }, function (err) {
            if (fail) fail(err.code);
        });
    },
    readAsDataURL: function (win, fail, args) {
        var path = args[0],
            FileReader = topCordova.nativeMethods.FileReader,
            fr = new FileReader(),
            root = fs.root.toURL();

        // Set up FileReader events
        fr.onerror = function (err) {
            if (fail) fail(err.code);
        };
        fr.onload = function (evt) {
            if (win) win(evt.target.result);
        };

        path = cleanPath(path);

        fs.root.getFile(path, {create: false}, function (entry) {
            entry.file(function (blob) {
                fr.readAsDataURL(blob);
            }, function (err) {
                if (fail) fail(err.code);
            });
        }, function (err) {
            if (fail) fail(err.code);
        });
    },
    truncate: function (win, fail, args) {
        var file = args[0],
            position = args[1],
            root = fs.root.toURL(),
            sourcepath;

        // Format source path
        sourcepath = (file.fullPath ? file.fullPath : '') + file.name;
        sourcepath = cleanPath(sourcepath);

        // Get the FileEntry, create if necessary
        fs.root.getFile(sourcepath, {create: false}, function (entry) {
            // Create a FileWriter for this entry
            entry.createWriter(function (writer) {
                writer.onwriteend = function (progressEvt) {
                    if (win) win(progressEvt.target.length);
                };
                writer.onerror = function (err) {
                    if (fail) fail(err.code);
                };

                writer.truncate(position);
            }, function (err) {
                if (fail) fail(err.code);
            });
        }, function (err) {
            if (fail) fail(err.code);
        });
    }
};
