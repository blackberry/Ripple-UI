/*
 *  Copyright 2011 Research In Motion Limited.
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
describe("webworks pim.category", function () {

    var categoryClient = require('ripple/platform/webworks.handset/2.0.0/client/category'),
        categoryServer = require('ripple/platform/webworks.handset/2.0.0/server/category'),
        spec = require('ripple/platform/webworks.handset/2.0.0/spec'),
        transport = require('ripple/platform/webworks.core/2.0.0/client/transport'),
        webworks = require('ripple/platform/webworks.handset/2.0.0/server'),
        db = require('ripple/db');

    describe("server index", function () {
        it("exposes the category module", function () {
            expect(webworks.blackberry.pim.category).toEqual(categoryServer);
        });
    });

    describe("platform spec", function () {
        it("includes the module according to proper object structure", function () {
            expect(spec.objects.blackberry.children.pim.children.category.path)
                .toEqual("webworks.handset/2.0.0/client/category");
        });
    });

    describe("client module", function () {
        describe("addCategory", function () {
            it("calls the transport with proper args", function () {
                spyOn(transport, "call");
                categoryClient.addCategory("x");
                expect(transport.call)
                    .toHaveBeenCalledWith("blackberry/pim/category/addCategory", {get: {categoryName: "x"}});
            });
        });

        describe("deleteCategory", function () {
            it("calls the transport with proper args", function () {
                spyOn(transport, "call");
                categoryClient.deleteCategory("y");
                expect(transport.call)
                    .toHaveBeenCalledWith("blackberry/pim/category/deleteCategory", {get: {categoryName: "y"}});
            });
        });

        describe("getCategories", function () {
            it("calls the transport with proper args", function () {
                spyOn(transport, "call").andReturn("z");
                expect(categoryClient.getCategories()).toEqual("z");
                expect(transport.call)
                    .toHaveBeenCalledWith("blackberry/pim/category/getCategories");
            });
        });
    });

    // errrr.... arghh
    describe("server module", function () {
        describe("getCategories", function () {
            it("returns the current list of categories", function () {
                var categories = [];
                spyOn(db, "retrieveObject").andReturn(categories);
                expect(categoryServer.getCategories().data).toEqual(categories);
            });
        });

        describe("addCategory", function () {
            var categories;

            beforeEach(function () {
                categories = [];
                spyOn(db, "saveObject");
                spyOn(db, "retrieveObject").andReturn(categories);
            });

            it("adds categories", function () {
                categoryServer.addCategory({categoryName: "people"});
                categoryServer.addCategory({categoryName: "fun people"});
                expect(categories.length).toEqual(2);
                expect(categories).toEqual(["people", "fun people"]);
            });

            it("persists the category", function () {
                categoryServer.addCategory({categoryName: "more fun people"});
                expect(db.saveObject).toHaveBeenCalledWith("blackberry-pim-category", ["more fun people"]);
            });
        });

        describe("deleteCategory", function () {
            var categories;

            beforeEach(function () {
                categories = [];
                spyOn(db, "saveObject");
                spyOn(db, "retrieveObject").andReturn(categories);
            });

            it("deletes a category", function () {
                categoryServer.addCategory({categoryName: "the beautiful people"});
                categoryServer.deleteCategory({categoryName: "the beautiful people"});
                expect(categories.length).toEqual(0);
                expect(categories).toEqual([]);
            });

            it("persists the new category list", function () {
                categoryServer.addCategory({categoryName: "name"});
                categoryServer.deleteCategory({categoryName: "name"});
                expect(db.saveObject).toHaveBeenCalledWith("blackberry-pim-category", []);
            });
        });
    });

});
