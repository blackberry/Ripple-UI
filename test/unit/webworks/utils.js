/*
 * Copyright 2011 Research In Motion Limited.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var utils = require('ripple/platform/webworks.core/2.0.0/client/utils');

describe("utils", function () {
    beforeEach(function () {
        global.BlobBuilder = global.WebKitBlobBuilder = jasmine.createSpy();
    });

    afterEach(function () {
        delete global.BlobBuilder;
        delete global.WebKitBlobBuilder;
    });

    describe("handset", function () {
        describe("platform spec index", function () {
            it("includes module according to proper object structure", function () {
                var spec = require('ripple/platform/webworks.handset/2.0.0/spec');
                expect(spec.objects.blackberry.children.utils).toEqual({
                    path: "webworks.core/2.0.0/client/utils",
                    feature: "blackberry.utils"
                });
            });
        });
    });

    describe("tablet", function () {
        describe("platform spec index", function () {
            it("includes module according to proper object structure", function () {
                var spec = require('ripple/platform/webworks.tablet/2.0.0/spec');
                expect(spec.objects.blackberry.children.utils).toEqual({
                    path: "webworks.core/2.0.0/client/utils",
                    feature: "blackberry.utils"
                });
            });
        });
    });

    describe("blobToString and stringToBlob", function () {
        it("can translate a blob into a string and back", function () {
            var blobBuilder = {
                    append: jasmine.createSpy(),
                    getBlob: jasmine.createSpy().andReturn({size: 3})
                },
                str = "da foo",
                blob;

            BlobBuilder.andReturn(blobBuilder);

            blob = utils.stringToBlob(str);

            expect(blob.id).toBeDefined();
            expect(blob.length).toBeDefined();
            expect(utils.blobToString(blob)).toEqual(str);
            expect(utils.stringToBlob(str)).toEqual(blob);
            expect(blobBuilder.append).toHaveBeenCalledWith(str);
        });
    });
});
