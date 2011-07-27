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
describe("wac_PIM", function () {

    var pim = require('ripple/platform/wac/1.0/PIM'),
        sinon = require('sinon'),
        CalendarItem = require('ripple/platform/wac/1.0/CalendarItem'),
        AddressBookItem = require('ripple/platform/wac/1.0/AddressBookItem'),
        constants = require('ripple/constants'),
        db = require('ripple/db'),
        s;

    beforeEach(function () {
        s = sinon.sandbox.create();
    });

    afterEach(function () {
        s.verifyAndRestore();
    });

    it("createAddressBookItem returns an empty AddressBookItem", function () {
        expect(pim.createAddressBookItem() instanceof AddressBookItem).toEqual(true);
    });

    it("getAddressBookItem returns the item for the given ID", function () {
        var items = [
            {addressBookItemId: "1"},
            {addressBookItemId: "2"},
            {addressBookItemId: "3"}
        ];

        s.stub(db, "retrieveObject").returns(items);
        expect(pim.getAddressBookItem("2").addressBookItemId).toEqual(items[1].addressBookItemId);
    });

    it("getAddressBookItem returns null when no items match the given ID", function () {
        s.stub(db, "retrieveObject").returns([]);
        expect(pim.getAddressBookItem("2")).toBeNull();
    });

    it("getAddressBookItem returns null when nothing returned from persistence", function () {
        s.stub(db, "retrieveObject").returns(undefined);
        expect(pim.getAddressBookItem("2")).toBeNull();
    });

    it("getAddressBookItemsCount returns the count of items", function () {
        var items = [
            {addressBookItemId: "a"},
            {addressBookItemId: "b"},
            {addressBookItemId: "c"}
        ];

        s.stub(db, "retrieveObject").returns(items);
        expect(pim.getAddressBookItemsCount()).toEqual(items.length);
    });

    it("getAddressBookItemsCount returns 5 when persitence returns undefined", function () {
        //this is because of the default contacts ;)
        s.stub(db, "retrieveObject").returns(undefined);
        s.mock(db).expects("saveObject").once();

        expect(pim.getAddressBookItemsCount()).toEqual(5);
    });

    it("addAddressBookItem should add an item to the persisted list", function () {
        var items = [],
            added = new AddressBookItem();

        s.stub(db, "retrieveObject").returns(items);
        s.mock(db).expects("saveObject").once().withExactArgs(constants.PIM.ADDRESS_LIST_KEY, [added]);

        pim.addAddressBookItem(added);
    });

    it("addAddressBookItem should set id if none provided", function () {
        var items = [],
            added = new AddressBookItem();

        s.stub(db, "retrieveObject").returns(items);
        s.mock(db).expects("saveObject").once().withExactArgs(constants.PIM.ADDRESS_LIST_KEY, [added]);

        pim.addAddressBookItem(added);
        expect(added.addressBookItemId).toBeTruthy();
    });

    it("addAddressBookItem should not set id if one is provided", function () {
        var items = [],
            added = new AddressBookItem(),
            id = "AF7492";

        added.addressBookItemId = id;
        s.stub(db, "retrieveObject").returns(items);
        s.mock(db).expects("saveObject").once().withExactArgs(constants.PIM.ADDRESS_LIST_KEY, [added]);

        pim.addAddressBookItem(added);
        expect(added.addressBookItemId).toEqual(id);
    });

    it("addAddressBookItem throws an exception when passed in a null item", function () {
        expect(function () {
            var foo = null;
            pim.addAddressBookItem(foo);
        }).toThrow();
    });

    it("addAddressBookItem throws an exception when passed in an invalid address book item", function () {
        expect(function () {
            pim.addAddressBookItem({
                title: "",
                address: ""
            });
        }).toThrow();
    });

    it("deleteAddressBookItem should remove an item from the persisted list", function () {
        var items = [
            {addressBookItemId: "a"},
            {addressBookItemId: "b"},
            {addressBookItemId: "c"}
        ];

        s.stub(db, "retrieveObject").returns(items);
        s.mock(db).expects("saveObject").once().withExactArgs(constants.PIM.ADDRESS_LIST_KEY, [items[0], items[2]]);

        pim.deleteAddressBookItem("b");
    });

    it("deleteAddressBookItem shouldn't delete if not match found", function () {
        var items = [
                {addressBookItemId: "a"},
                {addressBookItemId: "b"},
                {addressBookItemId: "c"}
            ];

        s.stub(db, "retrieveObject").returns(items);
        s.mock(db).expects("saveObject").once().withExactArgs(constants.PIM.ADDRESS_LIST_KEY, items);

        pim.deleteAddressBookItem("d");
    });

    it("should raise the onAddressBookItemsFound event when searching", function () {
        s.stub(db, "retrieveObject").returns([]);
        s.stub(db, "saveObject");

        pim.onAddressBookItemsFound = s.mock().withExactArgs([]).once();
        pim.findAddressBookItems({title: "Dr"}, 0, 1);
    });

    it("should be able to search for addressBookItemId", function () {
        var items = [
                {addressBookItemId: "a"},
                {addressBookItemId: "b"},
                {addressBookItemId: "c"}
            ], result;

        s.stub(db, "retrieveObject").returns(items);
        pim.onAddressBookItemsFound = s.mock().once();
        pim.findAddressBookItems({addressBookItemId: "b"}, 0, 1);

        result = pim.onAddressBookItemsFound.args[0][0];

        expect(result.length).toEqual(1);
        expect(result[0].addressBookItemId).toEqual("b");
    });

    it("should be able to search for fullName", function () {
        var items = [
                {fullName: "Gord"},
                {fullName: "Steph"},
                {fullName: "Gwen"}
            ], result;

        s.stub(db, "retrieveObject").returns(items);
        pim.onAddressBookItemsFound = s.mock().once();
        pim.findAddressBookItems({fullName: "Gwen"}, 0, 1);

        result = pim.onAddressBookItemsFound.args[0][0];

        expect(result.length).toEqual(1);
        expect(result[0].fullName).toEqual("Gwen");
    });

    it("should be able to search for a blank fullName", function () {
        var items = [
                {fullName: "Gord"},
                {fullName: "Steph"},
                {fullName: "", mobilePhone: "555-1234"},
                {fullName: "Gwen"}
            ], result;

        s.stub(db, "retrieveObject").returns(items);
        pim.onAddressBookItemsFound = s.mock().once();
        pim.findAddressBookItems({fullName: ""}, 0, 1);

        result = pim.onAddressBookItemsFound.args[0][0];
        expect(result.length).toEqual(1);
        expect(result[0].mobilePhone).toEqual("555-1234");
        expect(result[0].fullName).toEqual("");
    });

    it("should be able to search for mobilePhone", function () {
        var items = [
            {mobilePhone: "555-1234"},
            {mobilePhone: "555-2222"},
            {mobilePhone: "555-2222"},
            {mobilePhone: "555-1234"}
        ], result;

        s.stub(db, "retrieveObject").returns(items);
        pim.onAddressBookItemsFound = s.mock().once();
        pim.findAddressBookItems({mobilePhone: "555-1234"}, 0, 2);

        result = pim.onAddressBookItemsFound.args[0][0];
        expect(result.length).toEqual(2);
        expect(result[0].mobilePhone).toEqual("555-1234");
        expect(result[1].mobilePhone).toEqual("555-1234");
    });

    it("should be able to search for a blank mobilePhone", function () {
        var items = [
            {mobilePhone: "555-1234"},
            {mobilePhone: "555-2222"},
            {mobilePhone: ""},
            {mobilePhone: "555-1234"}
        ], result;

        s.stub(db, "retrieveObject").returns(items);
        pim.onAddressBookItemsFound = s.mock().once();
        pim.findAddressBookItems({mobilePhone: ""}, 0, 1);

        result = pim.onAddressBookItemsFound.args[0][0];
        expect(result.length).toEqual(1);
        expect(result[0].mobilePhone).toEqual("");
    });

    it("should be able to search for homePhone", function () {
        var items = [
            {homePhone: "555-1234"},
            {homePhone: "555-2222"},
            {homePhone: "555-2222"},
            {homePhone: "555-1234"}
        ], result;

        s.stub(db, "retrieveObject").returns(items);
        pim.onAddressBookItemsFound = s.mock().once();
        pim.findAddressBookItems({homePhone: "555-2222"}, 0, 2);

        result = pim.onAddressBookItemsFound.args[0][0];
        expect(result.length).toEqual(2);
        expect(result[0].homePhone).toEqual("555-2222");
        expect(result[1].homePhone).toEqual("555-2222");
    });

    it("should be able to search for a blank homePhone", function () {
        var items = [
            {homePhone: "555-1234"},
            {homePhone: ""},
            {homePhone: "555-2222"},
            {homePhone: "555-1234"}
        ], result;

        s.stub(db, "retrieveObject").returns(items);
        pim.onAddressBookItemsFound = s.mock().once();
        pim.findAddressBookItems({homePhone: ""}, 0, 1);

        result = pim.onAddressBookItemsFound.args[0][0];
        expect(result.length).toEqual(1);
        expect(result[0].homePhone).toEqual("");
    });

    it("should be able to search for workPhone", function () {
        var items = [
            {workPhone: "555-1234"},
            {workPhone: "555-2222"},
            {workPhone: "555-2222"},
            {workPhone: "555-1234"}
        ], result;

        s.stub(db, "retrieveObject").returns(items);
        pim.onAddressBookItemsFound = s.mock().once();
        pim.findAddressBookItems({workPhone: "555-2222"}, 0, 2);

        result = pim.onAddressBookItemsFound.args[0][0];
        expect(result.length).toEqual(2);
        expect(result[0].workPhone).toEqual("555-2222");
        expect(result[1].workPhone).toEqual("555-2222");
    });

    it("should be able to search for a blank workPhone", function () {
        var items = [
            {workPhone: ""},
            {workPhone: "555-2222"},
            {workPhone: ""},
            {workPhone: "555-1234"}
        ], result;

        s.stub(db, "retrieveObject").returns(items);
        pim.onAddressBookItemsFound = s.mock().once();
        pim.findAddressBookItems({workPhone: ""}, 0, 2);

        result = pim.onAddressBookItemsFound.args[0][0];
        expect(result.length).toEqual(2);
        expect(result[0].workPhone).toEqual("");
        expect(result[1].workPhone).toEqual("");
    });

    it("should be able to search for eMail", function () {
        var items = [
            {eMail: "gord@tinyhippos.com"},
            {eMail: "gtanner@gmail.com"},
            {eMail: "gord.tanner@tinyhippos.com"}
        ], result;

        s.stub(db, "retrieveObject").returns(items);
        pim.onAddressBookItemsFound = s.mock().once();
        pim.findAddressBookItems({eMail: "gord@tinyhippos.com"}, 0, 1);

        result = pim.onAddressBookItemsFound.args[0][0];
        expect(result.length).toEqual(1);
        expect(result[0].eMail).toEqual("gord@tinyhippos.com");
    });

    it("should be able to search for blank eMail", function () {
        var items = [
            {eMail: "gord@tinyhippos.com"},
            {eMail: ""},
            {eMail: "gtanner@gmail.com"},
            {eMail: ""},
            {eMail: "gord.tanner@tinyhippos.com"}
        ], result;

        s.stub(db, "retrieveObject").returns(items);
        pim.onAddressBookItemsFound = s.mock().once();
        pim.findAddressBookItems({eMail: ""}, 0, 2);

        result = pim.onAddressBookItemsFound.args[0][0];
        expect(result.length).toEqual(2);
        expect(result[0].eMail).toEqual("");
        expect(result[1].eMail).toEqual("");
    });

    it("should be able to search for company", function () {
        var items = [
            {company: "tinyhippos.com"},
            {company: "tinyhippos.com"},
            {company: "tinyhippos.com"}
        ], result;

        s.stub(db, "retrieveObject").returns(items);
        pim.onAddressBookItemsFound = s.mock().once();
        pim.findAddressBookItems({company: "tinyhippos.com"}, 0, 3);

        result = pim.onAddressBookItemsFound.args[0][0];
        expect(result.length).toEqual(3);
    });

    it("should be able to search for a blank company", function () {
        var items = [
            {company: "tinyhippos.com"},
            {company: ""},
            {company: "tinyhippos.com"}
        ], result;

        s.stub(db, "retrieveObject").returns(items);
        pim.onAddressBookItemsFound = s.mock().once();
        pim.findAddressBookItems({company: ""}, 0, 1);

        result = pim.onAddressBookItemsFound.args[0][0];
        expect(result.length).toEqual(1);
        expect(result[0].company).toEqual("");
    });

    it("should be able to search for title", function () {
        var items = [
            {title: "Dr"},
            {title: "Dr"},
            {title: "Overlord"},
            {title: "Dr"}
        ], result;

        s.stub(db, "retrieveObject").returns(items);
        pim.onAddressBookItemsFound = s.mock().once();
        pim.findAddressBookItems({title: "Overlord"}, 0, 1);

        result = pim.onAddressBookItemsFound.args[0][0];
        expect(result.length).toEqual(1);
        expect(result[0].title).toEqual("Overlord");
    });

    it("should be able to search for a blank title", function () {
        var items = [
            {title: "Dr"},
            {title: ""},
            {title: "Overlord"},
            {title: "Dr"}
        ], result;

        s.stub(db, "retrieveObject").returns(items);
        pim.onAddressBookItemsFound = s.mock().once();
        pim.findAddressBookItems({title: ""}, 0, 1);

        result = pim.onAddressBookItemsFound.args[0][0];
        expect(result.length).toEqual(1);
        expect(result[0].title).toEqual("");
    });

    it("should be able to search for address", function () {
        var items = [
            {address: "123 Anystreet"},
            {address: "53 Patricia Ave"}
        ], result;

        s.stub(db, "retrieveObject").returns(items);
        pim.onAddressBookItemsFound = s.mock().once();
        pim.findAddressBookItems({address: "123 Anystreet"}, 0, 1);

        result = pim.onAddressBookItemsFound.args[0][0];
        expect(result.length).toEqual(1);
        expect(result[0].address).toEqual("123 Anystreet");
    });

    it("should be able to search for a blank address", function () {
        var items = [
            {address: "123 Anystreet"},
            {address: ""},
            {address: "53 Patricia Ave"}
        ], result;

        s.stub(db, "retrieveObject").returns(items);
        pim.onAddressBookItemsFound = s.mock().once();
        pim.findAddressBookItems({address: ""}, 0, 1);

        result = pim.onAddressBookItemsFound.args[0][0];
        expect(result.length).toEqual(1);
        expect(result[0].address).toEqual("");
    });

    it("can search by multiple values", function () {
        var items = [
            {fullName: "Gord", workPhone: "555-1234"},
            {fullName: "Gord", workPhone: "555-2222"},
            {fullName: "Gord", workPhone: "555-2222"},
            {fullName: "Gord", workPhone: "555-1234"}
        ], result;

        s.stub(db, "retrieveObject").returns(items);
        pim.onAddressBookItemsFound = s.mock().once();
        pim.findAddressBookItems({fullName: "Gord", workPhone: "555-2222"}, 0, 2);

        result = pim.onAddressBookItemsFound.args[0][0];
        expect(result.length).toEqual(2);
    });

    it("can search when a search param is null but the entity has a value", function () {
        var items = [
            {fullName: "Gord", workPhone: "555-1234"},
            {fullName: "Gord", workPhone: null},
            {fullName: "Gord", workPhone: null},
            {fullName: "Gord", workPhone: "555-1234"}
        ], result;

        s.stub(db, "retrieveObject").returns(items);
        pim.onAddressBookItemsFound = s.mock().once();
        pim.findAddressBookItems({fullName: "Gord", workPhone: null}, 0, 2);

        result = pim.onAddressBookItemsFound.args[0][0];
        expect(result.length).toEqual(2);
    });

    it("searching is case insensitive", function () {
        var items = [
            {fullName: "Gord", workPhone: "5551111"},
            {fullName: "GORD", workPhone: "5552222"},
            {fullName: "GoRd", workPhone: "5552222"},
            {fullName: "gOrD", workPhone: "5552222"}
        ], result;

        s.stub(db, "retrieveObject").returns(items);
        pim.onAddressBookItemsFound = s.mock().once();
        pim.findAddressBookItems({fullName: "Gord"}, 0, 4);

        result = pim.onAddressBookItemsFound.args[0][0];
        expect(result.length).toEqual(4);
    });

    it("searching can use wildcards", function () {
        var items = [
            {fullName: "Gord", workPhone: "5551111"},
            {fullName: "Gwen", workPhone: "5552222"},
            {fullName: "Griffin", workPhone: "5552222"},
            {fullName: "Steph", workPhone: "5552222"}
        ], result;

        s.stub(db, "retrieveObject").returns(items);
        pim.onAddressBookItemsFound = s.mock().once();
        pim.findAddressBookItems({fullName: "G*"}, 0, 3);

        result = pim.onAddressBookItemsFound.args[0][0];
        expect(result.length).toEqual(3);
        expect(result[0].fullName).toEqual("Gord");
    });

    it("can escape * when searching", function () {
        var calls = [
            {fullName: "Steph", workPhone: "5551111"},
            {fullName: "Gwen", workPhone: "5552222"},
            {fullName: "Griffin", workPhone: "5552222"},
            {fullName: "Gord", workPhone: "*69"}
        ], result;

        s.stub(db, "retrieveObject").returns(calls);
        pim.onAddressBookItemsFound = s.mock().once();
        pim.findAddressBookItems({workPhone: "\\*69"}, 0, 1);

        result = pim.onAddressBookItemsFound.args[0][0];
        expect(result.length).toEqual(1);
        expect(result[0].workPhone).toEqual("*69");
    });

    it("can search with multiple wildcards", function () {
        var calls = [
            {fullName: "Steph", workPhone: "5551111"},
            {fullName: "Gwen", workPhone: "5551234"},
            {fullName: "Griffin", workPhone: "5552222"}
        ], result;

        s.stub(db, "retrieveObject").returns(calls);
        pim.onAddressBookItemsFound = s.mock().once();
        pim.findAddressBookItems({workPhone: "*12*"}, 0, 1);

        result = pim.onAddressBookItemsFound.args[0][0];
        expect(result.length).toEqual(1);
        expect(result[0].workPhone).toEqual("5551234");
    });

    it("can search for strings containing escaped single quotes", function () {
        var calls = [
            {fullName: "George O'Conner"},
            {fullName: "Larry"}
        ], result;

        s.stub(db, "retrieveObject").returns(calls);
        pim.onAddressBookItemsFound = s.mock().once();
        pim.findAddressBookItems({fullName: "*O\'Conner"}, 0, 1);

        result = pim.onAddressBookItemsFound.args[0][0];
        expect(result.length).toEqual(1);
        expect(result[0].fullName).toEqual("George O'Conner");
    });

    it("can search for strings containing escaped double quotes", function () {
        var calls = [
            {fullName: 'George O"Conner'},
            {fullName: "Larry"}
        ], result;

        s.stub(db, "retrieveObject").returns(calls);
        pim.onAddressBookItemsFound = s.mock().once();
        pim.findAddressBookItems({fullName: "*O\"Conner"}, 0, 1);

        result = pim.onAddressBookItemsFound.args[0][0];
        expect(result.length).toEqual(1);
        expect(result[0].fullName).toEqual('George O"Conner');
    });

    it("can search for only the first 2 records", function () {
        var calls = [
            {fullName: "Gwen", homePhone: "5551234"},
            {fullName: "Griffin", homePhone: "5552222"},
            {fullName: "Gwen", homePhone: "5551234"},
            {fullName: "Gwen", homePhone: "5551234"},
            {fullName: "Griffin", homePhone: "5552222"},
            {fullName: "Griffin", homePhone: "5552222"}
        ], result;

        s.stub(db, "retrieveObject").returns(calls);
        pim.onAddressBookItemsFound = s.mock().once();
        pim.findAddressBookItems({fullName: "g*"}, 0, 2);

        result = pim.onAddressBookItemsFound.args[0][0];
        expect(result.length).toEqual(2);
        expect(result[0].fullName).toEqual("Gwen");
        expect(result[1].fullName).toEqual("Griffin");
    });

    it("can serach for the third and forth records", function () {
        var calls = [
            {fullName: "Gwen", homePhone: "5551234"},
            {fullName: "Griffin", homePhone: "5552222"},
            {fullName: "Gwen", homePhone: "5551234"},
            {fullName: "Gwen", homePhone: "5551234"},
            {fullName: "Griffin", homePhone: "5552222"},
            {fullName: "Griffin", homePhone: "5552222"}
        ], result;

        s.stub(db, "retrieveObject").returns(calls);
        pim.onAddressBookItemsFound = s.mock().once();
        pim.findAddressBookItems({fullName: "g*"}, 2, 4);

        result = pim.onAddressBookItemsFound.args[0][0];
        expect(result.length).toEqual(2);
        expect(result[0].fullName).toEqual("Gwen");
        expect(result[1].fullName).toEqual("Gwen");
    });

    it("if startInx equals, only one item whose sequence number is startInx is returned", function () {
        var calls = [
            {fullName: "Gwen", homePhone: "5551234"},
            {fullName: "Griffin", homePhone: "5552222"},
            {fullName: "Gwen", homePhone: "5551234"},
            {fullName: "Gwen", homePhone: "5551234"},
            {fullName: "Griffin", homePhone: "5552222"},
            {fullName: "Griffin", homePhone: "5552222"}
        ], result;

        s.stub(db, "retrieveObject").returns(calls);
        pim.onAddressBookItemsFound = s.mock().once();
        pim.findAddressBookItems({fullName: "g*"}, 2, 2);

        result = pim.onAddressBookItemsFound.args[0][0];
        expect(result.length).toEqual(1);
        expect(result[0].fullName).toEqual("Gwen");
        expect(result[0].homePhone).toEqual("5551234");
    });

    it("if startInx is greater than endInx the returned callRecordsFound will be an empty array.", function () {
        var calls = [
            {fullName: "Gwen", homePhone: "5551234"},
            {fullName: "Griffin", homePhone: "5552222"},
            {fullName: "Gwen", homePhone: "5551234"},
            {fullName: "Gwen", homePhone: "5551234"},
            {fullName: "Griffin", homePhone: "5552222"},
            {fullName: "Griffin", homePhone: "5552222"}
        ], result;

        s.stub(db, "retrieveObject").returns(calls);
        pim.onAddressBookItemsFound = s.mock().once();
        pim.findAddressBookItems({fullName: "g*"}, 4, 2);

        result = pim.onAddressBookItemsFound.args[0][0];
        expect(result.length).toEqual(0);
    });

    it("if startInx is greater than the number of found item the returned callRecordsFound will be an empty array.", function () {
        var calls = [
            {fullName: "Gwen", homePhone: "5551234"},
            {fullName: "Griffin", homePhone: "5552222"},
            {fullName: "Gord", homePhone: "5551234"},
            {fullName: "Gwen", homePhone: "5551234"},
            {fullName: "Griffin", homePhone: "5552222"},
            {fullName: "Griffin", homePhone: "5552222"}
        ], result;

        s.stub(db, "retrieveObject").returns(calls);
        pim.onAddressBookItemsFound = s.mock().once();
        pim.findAddressBookItems({fullName: "Gord"}, 3, 6);

        result = pim.onAddressBookItemsFound.args[0][0];
        expect(result.length).toEqual(0);
    });

    it("if endInx is greater than the number of found items the returned callRecordsFound will contain items between startInx and the last returned item", function () {
        var calls = [
            {fullName: "Gwen", homePhone: "5551234"},
            {fullName: "Griffin", homePhone: "5552222"},
            {fullName: "Gord", homePhone: "5551234"},
            {fullName: "Gwen", homePhone: "5551234"},
            {fullName: "Griffin", homePhone: "5552222"},
            {fullName: "Griffin", homePhone: "5552222"}
        ], result;

        s.stub(db, "retrieveObject").returns(calls);
        pim.onAddressBookItemsFound = s.mock().once();
        pim.findAddressBookItems({fullName: "Gwen"}, 0, 6);

        result = pim.onAddressBookItemsFound.args[0][0];
        expect(result.length).toEqual(2);
        expect(result[0].fullName).toEqual("Gwen");
        expect(result[1].fullName).toEqual("Gwen");
    });

    it("if endInx is positive and startInx is negative, startInx will be treated as 0", function () {
        var calls = [
            {fullName: "Gwen", homePhone: "5551234"},
            {fullName: "Griffin", homePhone: "5552222"},
            {fullName: "Gord", homePhone: "5551234"},
            {fullName: "Gwen", homePhone: "5551234"},
            {fullName: "Griffin", homePhone: "5552222"},
            {fullName: "Griffin", homePhone: "5552222"}
        ], result;

        s.stub(db, "retrieveObject").returns(calls);
        pim.onAddressBookItemsFound = s.mock().once();
        pim.findAddressBookItems({fullName: "Gwen"}, -1, 1);

        result = pim.onAddressBookItemsFound.args[0][0];
        expect(result.length).toEqual(1);
        expect(result[0].fullName).toEqual("Gwen");
    });

    it("if endInx is negative throws INVALID_PARAMETER exception", function () {
        expect(function () {
            pim.findAddressBookItems({fullName: "Gwen"}, 0, -1);
        }).toThrow();
    });

    it("if comparisonContact is invalid throws INVALID_PARAMETER exception", function () {
        expect(function () {
            pim.findAddressBookItems("Gwen", 0, 1);
        }).toThrow();
    });

    it("if startInx is not a number throws INVALID_PARAMETER exception", function () {
        expect(function () {
            pim.findAddressBookItems({fullName: "Gwen"}, "test", 1);
        }).toThrow();
    });

    it("if endInx is not a number throws INVALID_PARAMETER exception", function () {
        expect(function () {
            pim.findAddressBookItems({fullName: "Gwen"}, 0, "test");
        }).toThrow();
    });

    it("addCalendarItem should add an item to the persisted list", function () {
        var items = [],
            added = new CalendarItem();

        s.stub(db, "retrieveObject").returns(items);
        s.mock(db).expects("saveObject").once().withExactArgs(constants.PIM.CALENDAR_LIST_KEY, [added]);

        pim.addCalendarItem(added);
    });

    it("deleteCalendarItem should remove an item from the persisted list", function () {
        var items = [
            {calendarItemId: "a"},
            {calendarItemId: "b"},
            {calendarItemId: "c"}
        ];

        s.stub(db, "retrieveObject").returns(items);
        s.mock(db).expects("saveObject").once().withExactArgs(constants.PIM.CALENDAR_LIST_KEY, [items[0], items[2]]);

        pim.deleteCalendarItem("b");
    });

    it("getCalendarItem returns the item for the given ID", function () {
        var items = [
            {calendarItemId: "1"},
            {calendarItemId: "2"},
            {calendarItemId: "3"}
        ];

        s.stub(db, "retrieveObject").returns(items);
        expect(items[1].calendarItemId).toEqual(pim.getCalendarItem("2").calendarItemId);
    });

    it("should raise the onCalendarItemsFound event when searching", function () {
        s.stub(db, "retrieveObject").returns([]);

        pim.onCalendarItemsFound = s.mock().withExactArgs([]).once();
        pim.findCalendarItems({eventName: "w00t"});
    });

    it("should be able to search for calendarItemId", function () {
        var items = [
            {calendarItemId: "a"},
            {calendarItemId: "b"},
            {calendarItemId: "c"}
        ];

        s.stub(db, "retrieveObject").returns(items);
        pim.onCalendarItemsFound = s.mock().once();
        pim.findCalendarItems({calendarItemId: "b"});
    });

    it("should be able to search for alarmDate", function () {
        var items = [
            {alarmDate: new Date(new Date().setMonth(1))},
            {alarmDate: new Date(new Date().setMonth(2))},
            {alarmDate: new Date(new Date().setMonth(3))}
        ], result;

        s.stub(db, "retrieveObject").returns(items);
        pim.onCalendarItemsFound = s.mock().once();
        pim.findCalendarItems({alarmDate: items[1].alarmDate});

        result = pim.onCalendarItemsFound.args[0][0];

        expect(result.length).toEqual(1);
        expect(result[0].alarmDate).toEqual(items[1].alarmDate);
    });

    it("should be able to search for eventStartTime", function () {
        var items = [
            {eventStartTime: new Date(new Date().setMonth(1))},
            {eventStartTime: new Date(new Date().setMonth(2))},
            {eventStartTime: new Date(new Date().setMonth(3))}
        ], result;

        s.stub(db, "retrieveObject").returns(items);
        pim.onCalendarItemsFound = s.mock().once();
        pim.findCalendarItems({eventStartTime: items[1].eventStartTime});

        result = pim.onCalendarItemsFound.args[0][0];

        expect(result.length).toEqual(1);
        expect(result[0].eventStartTime).toEqual(items[1].eventStartTime);
    });

    it("should be able to search for events in a timebox", function () {
        var items = [
            {eventStartTime: new Date(new Date().setMonth(1)), eventEndTime: new Date(new Date().setMonth(3))},
            {eventStartTime: new Date(new Date().setMonth(2)), eventEndTime: new Date(new Date().setMonth(3))},
            {eventStartTime: new Date(new Date().setMonth(4)), eventEndTime: new Date(new Date().setMonth(5))}
        ], result;

        s.stub(db, "retrieveObject").returns(items);
        pim.onCalendarItemsFound = s.mock().never();

        result = pim.getCalendarItems(items[0].eventStartTime, items[1].eventEndTime);

        expect(result.length).toEqual(2);
    });

    it("I can call a method on a returned addressbook item", function () {
        var items = [
                {addressBookItemId: "1"},
                {addressBookItemId: "2"},
                {addressBookItemId: "3"}
            ],
            contact;

        s.stub(db, "retrieveObject").returns(items);
        contact = pim.getAddressBookItem("1");

        expect(contact.getAvailableAttributes());
    });

    it("the returned calendar item has the update method", function () {
        var items = [
                {calendarItemId: "a"},
                {calendarItemId: "b"},
                {calendarItemId: "c"}
            ],
            event;

        s.stub(db, "retrieveObject").returns(items);
        event = pim.getCalendarItem("b");

        expect(event.update);
    });
});
