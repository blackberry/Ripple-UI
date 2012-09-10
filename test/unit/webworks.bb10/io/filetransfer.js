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
describe("webworks bb10 io.filetransfer", function () {
    var fs = require('ripple/fs'),
        filetransfer = require('ripple/platform/webworks.bb10/1.0.0/io/filetransfer'),
        spec = require('ripple/platform/webworks.bb10/1.0.0/spec'),
        WEBWORKS_BB10_FEATURE_ID = 'blackberry.io.filetransfer',
        WEBWORKS_BB10_FILETRANSFER_CONSTANTS = {
            FILE_NOT_FOUND_ERR: 1,
            INVALID_URL_ERR: 2,
            CONNECTION_ERR: 3,
            PERMISSIONS_ERR: 4
        };

    // API Documentation
    // https://developer.blackberry.com/html5/apis/blackberry.io.filetransfer.html

    describe("where filetransfer's public API will be (when injected into window.*)", function () {
        it("is in the blackberry.io.filetransfer namespace (specified in the respective platform spec)", function () {
            expect(spec.objects.blackberry.children.io.children.filetransfer)
                .toEqual({
                    path: "webworks.bb10/1.0.0/io/filetransfer",
                    feature: WEBWORKS_BB10_FEATURE_ID
                });
        });
    });

    describe("public constants", function () {
        it("are defined", function () {
            Object.keys(WEBWORKS_BB10_FILETRANSFER_CONSTANTS, function (key) {
                expect(filetransfer[key])
                    .toBe(WEBWORKS_BB10_FILETRANSFER_CONSTANTS[key]);
            });
        });

        it("are immutable", function () {
            Object.keys(WEBWORKS_BB10_FILETRANSFER_CONSTANTS, function (key) {
                filetransfer[key] = "another value";
                expect(filetransfer[key])
                    .toBe(WEBWORKS_BB10_FILETRANSFER_CONSTANTS[key]);

                delete filetransfer[key];
                expect(filetransfer[key])
                    .toBe(WEBWORKS_BB10_FILETRANSFER_CONSTANTS[key]);
            });
        });
    });

    describe("upload a local file to a remote server", function () {
        var path = "path/to/some/local/file",
            server = "http://path/to/http/upload/server",
            defaultFileKey = "file",
            defaultFileName = "image.jpg",
            defaultFileMime = "image/jpeg",
            options,
            success,
            fail,
            xhr,
            formdataInstance,
            mockFileErrorInstance,
            mockBlobInstance;

        beforeEach(function () {
            options = {};
            success = jasmine.createSpy("success callback");
            fail = jasmine.createSpy("fail callback");

            mockFileErrorInstance = {code: 1}; // FileError.NOT_FOUND_ERR
            mockBlobInstance = {};

            formdataInstance = {
                append: jasmine.createSpy("FormData.append")
            };

            xhr = {
                open: jasmine.createSpy("xhr.open"),
                send: jasmine.createSpy("xhr.send"),
                upload: {onprogress: null},
                onload: null
            };

            spyOn(global, "FormData").andReturn(formdataInstance);
            spyOn(global, 'XMLHttpRequest').andReturn(xhr);
            spyOn(global, "Blob").andReturn(mockBlobInstance); // don't care about differences
            spyOn(fs, "read");
            spyOn(console, "error");
            spyOn(console, "log");
        });

        it("reads the local file (to upload)", function () {
            filetransfer.upload(path, server, success, fail, options);
            expect(fs.read.argsForCall[0][0]).toBe(path);
        });

        describe("if reading the local file (to upload) fails", function () {
            beforeEach(function () {
                filetransfer.upload(path, server, success, fail, options);
                var readError = fs.read.argsForCall[0][2];
                readError(mockFileErrorInstance);
            });

            it("invokes the download callback with a file not found error", function () {
                expect(fail).toHaveBeenCalledWith({
                    code: filetransfer.FILE_NOT_FOUND_ERR,
                    source: path,
                    target: server,
                    http_status: undefined
                });
            });

            it("logs the file system error object to the console", function () {
                expect(console.error).toHaveBeenCalledWith(mockFileErrorInstance);
            });
        });

        describe("sending data via XHR2", function () {
            var readSuccess;

            function fsReadSuccess() {
                readSuccess = fs.read.argsForCall[0][1];
                readSuccess(mockBlobInstance);
            }

            it("logs to console if chunked mode option is true", function () {
                var expectedMsg = "Note: chunked encoding is not directly supported for the filetransfer.upload API." + 
                                  " Whether the request is sent as such is done at the discretion of the browser.";

                options.chunkedMode = true;
                options.chunkSize = 2048;

                filetransfer.upload(path, server, success, fail, options);

                fsReadSuccess();

                expect(console.log).toHaveBeenCalledWith(expectedMsg);
            });

            it("sends form data with the file (as a blob) appended to it", function () {
                filetransfer.upload(path, server, success, fail, options);

                fsReadSuccess();

                expect(global.Blob).toHaveBeenCalledWith([mockBlobInstance], {type: defaultFileMime});
                expect(formdataInstance.append).toHaveBeenCalledWith(defaultFileKey, mockBlobInstance, defaultFileName);
                expect(xhr.open).toHaveBeenCalledWith("POST", server);
                expect(xhr.send).toHaveBeenCalledWith(formdataInstance);
            });

            it("can include any extra params in the form data", function () {
                options = {params: {some: "extra post param"}};
                filetransfer.upload(path, server, success, fail, options);
                fsReadSuccess();
                expect(formdataInstance.append).toHaveBeenCalledWith("some", options.params.some);
            });

            it("can override the default mime type (of the file)", function () {
                options = {mimeType: "text/html"};
                filetransfer.upload(path, server, success, fail, options);
                fsReadSuccess();
                expect(Blob).toHaveBeenCalledWith([mockBlobInstance], {type: options.mimeType});
            });

            it("can set a custom form data key (for the file blob)", function () {
                options = {fileKey: "foo"};
                filetransfer.upload(path, server, success, fail, options);
                fsReadSuccess();
                expect(formdataInstance.append.argsForCall[0][0]).toBe(options.fileKey);
            });

            it("can set a custom form data file name (for the file blob)", function () {
                options = {fileName: "foo"};
                filetransfer.upload(path, server, success, fail, options);
                fsReadSuccess();
                expect(formdataInstance.append.argsForCall[0][2]).toBe(options.fileName);
            });

            it("logs the progress of the upload to console (to be helpful)", function () {
                filetransfer.upload(path, server, success, fail, options);

                fsReadSuccess();

                xhr.upload.onprogress({
                    lengthComputable: true,
                    loaded: 512,
                    total: 1024
                });

                expect(console.log).toHaveBeenCalledWith("upload progress: 50%");

                xhr.upload.onprogress({
                    lengthComputable: true,
                    loaded: 1024,
                    total: 1024
                });

                expect(console.log).toHaveBeenCalledWith("upload progress: 100%");
            });

            it("invokes success with the appropriate data object", function () {
                filetransfer.upload(path, server, success, fail, options);

                fsReadSuccess();

                xhr.upload.onprogress({
                    lengthComputable: true,
                    loaded: 1024,
                    total: 1024
                });

                xhr.response = "uploaded successfully";
                xhr.status = 200;
                xhr.onload();

                expect(success).toHaveBeenCalledWith({
                    bytesSent: 1024,
                    responseCode: xhr.status,
                    response: xhr.response
                });
            });

            describe("if the upload fails (for whatever reason)", function () {
                it("invokes the error callback with an appropriate error object", function () {
                    filetransfer.upload(path, server, success, fail, options);

                    fsReadSuccess();

                    xhr.status = 0;
                    xhr.onerror();

                    expect(fail).toHaveBeenCalledWith({
                        code: filetransfer.CONNECTION_ERR,
                        source: path,
                        target: server,
                        http_status: xhr.status
                    });
                });
            });
        });
    });

    describe("downloading a remote file to the local file system", function () {
        var path = "path/to/some/remote/file",
            to = "path/to/some/local/filename",
            toDirPath = to.replace(/\/[^\/]*$/, ''),
            toInRoot = "/filename",
            success,
            fail,
            mkdirSuccess,
            mkdirFail,
            touchSuccess,
            touchFail,
            writeSuccess,
            writeFail,
            mockFileEntryInstance,
            mockFileErrorInstance,
            mockBlobInstance;

        beforeEach(function () {
            spyOn(fs, 'mkdir');
            spyOn(fs, 'touch');
            spyOn(fs, 'write');

            mockBlobInstance = {};
            mockFileEntryInstance = {};
            mockFileErrorInstance = {code: 1}; // FileError.NOT_FOUND_ERR

            success = jasmine.createSpy("success callback");
            fail = jasmine.createSpy("fail callback");
        });

        describe("initializing the local file system path", function () {
            it("recursively creates the directory", function () {
                filetransfer.download(path, to, success, fail);

                var args = fs.mkdir.argsForCall[0];
                expect(args[0]).toBe(toDirPath);
                expect(args[3]).toEqual({recursive: true});
            });

            it("skips recursively creating the directory if local file path is in root", function () {
                filetransfer.download(path, toInRoot, success, fail);

                var args = fs.touch.argsForCall[0];

                expect(fs.mkdir).not.toHaveBeenCalled();
                expect(args[0]).toBe(toInRoot);
            });

            describe("if creating a directory fails", function () {
                beforeEach(function () {
                    spyOn(console, 'error');

                    filetransfer.download(path, to, success, fail);

                    mkdirFail = fs.mkdir.argsForCall[0][2];
                    mkdirFail(mockFileErrorInstance);
                });

                it("invokes the download callback with a file not found error", function () {
                    expect(fail).toHaveBeenCalledWith({
                        code: filetransfer.FILE_NOT_FOUND_ERR,
                        source: path,
                        target: to,
                        http_status: undefined
                    });
                });

                it("logs the file system error object to the console", function () {
                    expect(console.error).toHaveBeenCalledWith(mockFileErrorInstance);
                });
            });

            it("touches the file", function () {
                filetransfer.download(path, to, success, fail);

                mkdirSuccess = fs.mkdir.argsForCall[0][1];
                mkdirSuccess(mockFileEntryInstance);

                expect(fs.touch.argsForCall[0][0]).toBe(to);
            });

            describe("if touching a file fails", function () {
                beforeEach(function () {
                    spyOn(console, 'error');

                    filetransfer.download(path, to, success, fail);

                    mkdirSuccess = fs.mkdir.argsForCall[0][1];
                    mkdirSuccess(mockFileEntryInstance);

                    touchFail = fs.touch.argsForCall[0][2];
                    touchFail(mockFileErrorInstance);
                });

                it("invokes the download callback with an appropriate (error) info object", function () {
                    expect(fail).toHaveBeenCalledWith({
                        code: filetransfer.FILE_NOT_FOUND_ERR,
                        source: path,
                        target: to,
                        http_status: undefined
                    });
                });

                it("logs the file system error object to the console", function () {
                    expect(console.error).toHaveBeenCalledWith(mockFileErrorInstance);
                });
            });
        });

        describe("writing the data to the local file system path", function () {
            var xhr;

            beforeEach(function () {
                xhr = {
                    open: jasmine.createSpy("open"),
                    send: jasmine.createSpy("send")
                };

                spyOn(global, 'XMLHttpRequest').andReturn(xhr);

                filetransfer.download(path, to, success, fail);

                mkdirSuccess = fs.mkdir.argsForCall[0][1];
                mkdirSuccess(mockFileEntryInstance);

                touchSuccess = fs.touch.argsForCall[0][1];
                touchSuccess(mockFileEntryInstance);
            });

            it("loads the data url into a blob", function () {
                xhr.response = mockBlobInstance;
                xhr.status = 200;
                xhr.onload();

                expect(xhr.responseType).toBe("blob");
                expect(xhr.open).toHaveBeenCalledWith("GET", path);
                expect(xhr.send).toHaveBeenCalled();
            });

            it("saves the blob to the local filesystem", function () {
                xhr.response = mockBlobInstance;
                xhr.status = 200;
                xhr.onload();

                expect(fs.write.argsForCall[0][0]).toBe(to);
                expect(fs.write.argsForCall[0][1]).toBe(mockBlobInstance);
            });

            it("invokes the download success callback with the file entry", function () {
                xhr.response = mockBlobInstance;
                xhr.status = 200;
                xhr.onload();

                writeSuccess = fs.write.argsForCall[0][2];
                writeSuccess(mockFileEntryInstance);

                expect(success).toHaveBeenCalledWith(mockFileEntryInstance);
            });

            describe("if loading the data url into a blob fails", function () {
                it("invokes the download callback with an appropriate (error) info object", function () {
                    xhr.response = mockBlobInstance;
                    xhr.status = 0;
                    xhr.onload();

                    expect(fail).toHaveBeenCalledWith({
                        code: filetransfer.CONNECTION_ERR,
                        source: path,
                        target: to,
                        http_status: xhr.status
                    });
                });
            });

            describe("if writing to the filesystem fails", function () {
                beforeEach(function () {
                    spyOn(console, 'error');

                    xhr.response = mockBlobInstance;
                    xhr.status = 200;
                    xhr.onload();

                    writeFail = fs.write.argsForCall[0][3];
                    writeFail(mockFileErrorInstance);
                });

                it("invokes the download callback with an appropriate (error) info object", function () {
                    expect(fail).toHaveBeenCalledWith({
                        code: filetransfer.FILE_NOT_FOUND_ERR,
                        source: path,
                        target: to,
                        http_status: undefined
                    });
                });

                it("logs the file system error object to the console", function () {
                    expect(console.error).toHaveBeenCalledWith(mockFileErrorInstance);
                });
            });
        });
    });
});
