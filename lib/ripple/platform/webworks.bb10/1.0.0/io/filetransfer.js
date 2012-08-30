/*
 *  Copyright 2012 Research In Motion Limited.
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
// TODO: This needs to check io.sandbox, and if so, write to the appropriate fs?
//       Currently, use what ripple/fs uses (TEMP).
var _self,
    fs = require('ripple/fs'),
    FILENAME = /\/?([^\/]*)$/,
    DEFAULT_UPLOAD_MIME = "image/jpeg",
    DEFAULT_UPLOAD_FILENAME = "image.jpg",
    DEFAULT_UPLOAD_FILEKEY = "file",
    constants = {
        FILE_NOT_FOUND_ERR: 1,
        INVALID_URL_ERR: 2,
        CONNECTION_ERR: 3,
        PERMISSIONS_ERR: 4
    };

// TODO: This translation is not covered in tests (for every use case), at the moment.
//       This needs to be mapped to the exact same return values as in WebWorks BB10.
function errorConstantFor(httpcode) {
    function fileWasNotFound(code) { return code === 410 || code === 404; }
    function invalidURL(code) { return code === 400; }
    function connectionIssue(code) { return code === 0; }
    function permissionsIssue(code) { return code ===  403 || code === 401; }

    if (fileWasNotFound(httpcode)) {
        return constants.FILE_NOT_FOUND_ERR;
    } else if (invalidURL(httpcode)) {
        return constants.INVALID_URL_ERR;
    } else if (connectionIssue(httpcode)) {
        return constants.CONNECTION_ERR;
    } else if (permissionsIssue(httpcode)) {
        return constants.PERMISSIONS_ERR;
    }
}

function download(path, to, success, fail) {
    function webworksError(httpcode, errorConstant) {
        fail({
            code: errorConstant || errorConstantFor(httpcode),
            source: path,
            target: to,
            http_status: httpcode
        });
    }

    function handleFSError(msg, error) {
        fail(webworksError(undefined, constants.FILE_NOT_FOUND_ERR));
        console.error(msg);
        console.error(error);
    }

    function getBlob(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.responseType = "blob";
        xhr.onload = function () {
            if (xhr.status === 200) { callback(xhr.response); }
            else { webworksError(xhr.status); }
        };
        xhr.send();
    }

    function createFile(prev, baton) {
        var directory = to.replace(FILENAME, ""),
            mkdirOpts = {recursive: true},
            mkdirErrorMsg = "failed (recursively) creating the directory (" + directory + ")",
            touchErrorMsg = "failed touching file (" + to + ")";

        function touch() {
            fs.touch(to, function () {
                baton.pass();
            }, handleFSError.bind(_self, touchErrorMsg));
        }

        baton.take();

        if (directory !== "") {
            fs.mkdir(directory, function () {
                touch();
            }, handleFSError.bind(_self, mkdirErrorMsg), mkdirOpts);
        } else { touch(); }
    }

    function writeToFile(prev, baton) {
        var writeErrorMsg = "failed writing to file (" + to + ")";

        baton.take();

        getBlob(path, function (blob) {
            fs.write(to, blob, function (entry) {
                success(entry);
                baton.pass();
            }, handleFSError.bind(_self, writeErrorMsg));
        });
    }

    jWorkflow
        .order(createFile)
        .andThen(writeToFile)
        .start();
}

function upload(path, server, success, fail, opts) {
    var readErrorMsg = "failed reading file to blob (" + path + ")";

    function webworksError(httpcode, errorConstant) {
        fail({
            code: errorConstant || errorConstantFor(httpcode),
            source: path,
            target: server,
            http_status: httpcode
        });
    }

    function handleFSError(msg, error) {
        webworksError(undefined, constants.FILE_NOT_FOUND_ERR);
        console.error(msg);
        console.error(error);
    }

    function readAsBlob(prev, baton) {
        baton.take();
        fs.read(path, function (blob) {
            baton.pass(blob);
        }, handleFSError.bind(_self, readErrorMsg));
    }

    function uploadToRemote(prev, baton) {
        var xhr = new XMLHttpRequest(),
            formdata = new FormData(),
            params = opts.params || {},
            mimeType = opts.mimeType || DEFAULT_UPLOAD_MIME,
            blob = new Blob([prev], {type: mimeType}),
            fileName = opts.fileName || DEFAULT_UPLOAD_FILENAME,
            fileKey = opts.fileKey || DEFAULT_UPLOAD_FILEKEY,
            bytesSent;

        baton.take();

        // TODO: chunk options are ignored (defaults to browser's choice)
        console.log("Note: chunked encoding is not directly supported for the filetransfer.upload API." +
                    " Whether the request is sent as such is done at the discretion of the browser.");

        Object.keys(params).forEach(function (key) {
            formdata.append(key, params[key]);
        });

        formdata.append(fileKey, blob, fileName);

        xhr.open('POST', server);

        xhr.onload = function () {
            success({
                bytesSent: bytesSent,
                responseCode: xhr.status,
                response: xhr.response
            });
            baton.pass();
        };

        xhr.onerror = function () {
            webworksError(xhr.status);
        };

        xhr.upload.onprogress = function (evt) {
            if (evt.lengthComputable) {
                var progress = (evt.loaded / evt.total) * 100;
                bytesSent = evt.loaded;
                if (progress % 10 === 0) {
                    console.log("upload progress: " + progress + "%");
                }
            }
        };

        xhr.send(formdata);
    }

    jWorkflow
        .order(readAsBlob)
        .andThen(uploadToRemote)
        .start();
}

_self = {
    download: download,
    upload: upload
};

Object.keys(constants).forEach(function (key) {
    Object.defineProperty(_self, key, {
        value: constants[key],
        enumerable: true
    });
});

module.exports = _self;
