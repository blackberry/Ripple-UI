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
describe("db", function () {

    var db = ripple('db'),
        old_openDatabase;

    beforeEach(function () {
        old_openDatabase = window.openDatabase;

        window.openDatabase = global.openDatabase = function () {
            var self = {
                transaction: function (callback) {
                    if (callback) {
                        var tx = {
                            executeSql: function (cmd, arr, callback2) {
                                if (callback2) {
                                    callback2.call(tx, tx, { rows: [] });
                                }
                            }
                        };
                        callback.call(self, tx);
                    }
                }
            };
            return self;
        };
        jWorkflow.order(db.initialize, db).start();
    });

    afterEach(function () {
        db.removeAll();
        window.openDatabase = old_openDatabase;
    });

    it("save_with_custom_prefix", function () {
        db.save("testKey", "test value", "testPrefix-");
        var storedValue = db.retrieve("testKey", "testPrefix-");
        expect(storedValue).toEqual("test value");
    });

    it("save_without_custom_prefix", function () {
        db.save("testKey", "test value");
        var storedValue = db.retrieve("testKey");
        expect(storedValue).toEqual("test value");
    });

    it("save_doesnt_retrieve_without_prefix", function () {
        db.save("testKey", "test value");
        var storedValue = db.retrieve("testKey", "testPrefix-");
        expect(storedValue).toBeFalsy();
    });

    it("save_doesnt_retrieve_with_prefix", function () {
        db.save("testKey", "test value", "testPrefix-");
        var storedValue = db.retrieve("testKey");
        expect(storedValue).toEqual(undefined);
    });

    it("saveObject_with_custom_prefix", function () {
        var testJSON = {
                test: "test value"
            },
            storedValue;

        db.saveObject("testKey", testJSON, "testPrefix-");
        storedValue = db.retrieveObject("testKey", "testPrefix-");
        expect(storedValue).toEqual(testJSON);
    });

    it("saveObject_without_custom_prefix", function () {
        var testJSON = {
                test: "test value"
            },
            storedValue;

        db.saveObject("testKey", testJSON);
        storedValue = db.retrieveObject("testKey");
        expect(storedValue).toEqual(testJSON);
    });

    //HACK: This test should be readded
    xit("saveObject_doesnt_retrieve_without_prefix", function () {
        var testJSON = {
                test: "test value"
            },
            storedValue;

        db.saveObject("testKey", testJSON, "testPrefix-");
        storedValue = db.retrieveObject("testKey");
        expect(storedValue).toEqual(undefined);
    });

    it("saveObject_doesnt_retrieve_with_prefix", function () {
        var testJSON = {
                test: "test value"
            },
            storedValue;

        db.saveObject("testKey", testJSON);
        storedValue = db.retrieveObject("testKey", "testPrefix-");
        expect(storedValue).toEqual(undefined);
    });

    it("saveObject_saves_an_array", function () {
        var testArray = [
                {a: 1},
                {a: 2}
            ],
            storedValue;

        db.saveObject("testKey", testArray);
        storedValue = db.retrieveObject("testKey");
        expect(storedValue).toEqual(testArray);
    });

    it("remove_deletes_from_local_storage", function () {
        db.save("testKey", "test value");
        db.remove("testKey");

        var storedValue = db.retrieve("testKey");
        expect(storedValue).toEqual(undefined);
    });

    it("remove_deletes_from_local_storage_with_custom_prefix", function () {
        db.save("testKey", "test value", "testPrefix-");
        db.remove("testKey", "testPrefix-");

        var storedValue = db.retrieve("testKey", "testPrefix-");
        expect(storedValue).toEqual(undefined);
    });

    it("removeAll_removes_all", function () {
        db.save("testKey", "test value");
        db.save("testKey", "test value", "testPrefix-");

        db.removeAll();

        var storedValue = db.retrieve("testKey"),
            prefixValue = db.retrieve("testKey", "testPrefix-");

        expect(storedValue).toEqual(undefined);
        expect(prefixValue).toEqual(undefined);
    });

    it("removeAll_removes_all_removes_prefix_subset", function () {
        db.save("testKey", "test value");
        db.save("testKey", "test value", "testPrefix-");

        db.removeAll("testPrefix-");

        var storedValue = db.retrieve("testKey"),
            prefixValue = db.retrieve("testKey", "testPrefix-");

        expect(storedValue).toEqual("test value");
        expect(prefixValue).toEqual(undefined);
    });

    it("can_retrieve_all_for_a_prefix", function () {
        db.save("testKey", "test value", "testPrefix-");
        db.save("testKey2", "test value 2", "testPrefix-");
        db.save("testKey3", "test value 3", "testPrefix2-");

        db.retrieveAll("testPrefix-", function (items) {
            expect(items.testKey).toEqual("test value");
            expect(items.testKey2).toEqual("test value 2");
            expect(items.testKey3).toEqual(undefined);
        });
    });

});
