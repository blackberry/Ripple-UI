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
describe("wac_AddressBookItem", function () {
    var AddressBookItem = require('ripple/platform/wac/1.0/AddressBookItem'),
        db = require('ripple/db'),
        constants = require('ripple/constants'),
        sinon = require('sinon'),
        s;

    beforeEach(function () {
        s = sinon.sandbox.create();
    });

    afterEach(function () {
        s.verifyAndRestore();
    });

    it("we can create an address book item", function () {
        expect(new AddressBookItem()).toBeTruthy();
    });

    it("it is an instance of addressbook item", function () {
        expect(new AddressBookItem() instanceof AddressBookItem).toEqual(true);
    });

    it("can set the value of a known attribute", function () {
        var target = new AddressBookItem();
        target.setAttributeValue("title", "Overlord");
        expect(target.title).toEqual("Overlord");
    });

    it("we can set the value of an unknown attribute", function () {
        var target = new AddressBookItem();
        target.setAttributeValue("turnOns", "cheetos");
        expect(target.turnOns).toEqual("cheetos");
    });

    it("it returns undefined for an attribute that doesn't exist", function () {
        var target = new AddressBookItem();
        expect(target.turnOffs).toEqual(undefined);
    });

    it("we can get the value of a known attribute", function () {
        var target = new AddressBookItem();
        target.fullName = "James Howlett";
        expect(target.getAttributeValue("fullName")).toEqual("James Howlett");
    });

    it("we can get the value of an unknown attribute", function () {
        var target = new AddressBookItem();
        target.fooodOrder = "wonton soup";
        expect(target.getAttributeValue("fooodOrder")).toEqual("wonton soup");
    });

    it("getAttributeValue validates number of params(none)", function () {
        expect(function () {
            var target = new AddressBookItem();
            target.getAttributeValue();
        }).toThrow();
    });

    it("getAttributeValue validates number of params(to many)", function () {
        expect(function () {
            var target = new AddressBookItem();
            target.getAttributeValue("foo", "bar");
        }).toThrow();
    });

    it("getAttributeValue validates param, wrong type", function () {
        expect(function () {
            var target = new AddressBookItem();
            target.getAttributeValue({});
        }).toThrow();
    });

    it("setAttributeValue validates number of params(none)", function () {
        expect(function () {
            var target = new AddressBookItem();
            target.setAttributeValue();
        }).toThrow();
    });

    it("setAttributeValue validates number of params(to many)", function () {
        expect(function () {
            var target = new AddressBookItem();
            target.setAttributeValue("foo", "bar", 1);
        }).toThrow();
    });

    it("setAttributeValue validates param, wrong type", function () {
        expect(function () {
            var target = new AddressBookItem();
            target.setAttributeValue({}, "woot");
        }).toThrow();
    });

    it("get available attributes returns default list", function () {
        var target = new AddressBookItem();
        expect(target.getAvailableAttributes()).toEqual([
            "addressBookItemId",
            "fullName",
            "mobilePhone",
            "homePhone",
            "workPhone",
            "eMail",
            "company",
            "title",
            "address"
        ].sort());
    });

    it("get available attributes returns added params", function () {
        var target = new AddressBookItem();
        target.setAttributeValue("woo", "hoo");
        expect(target.getAvailableAttributes()).toEqual([
            "addressBookItemId",
            "fullName",
            "woo",
            "mobilePhone",
            "homePhone",
            "workPhone",
            "eMail",
            "company",
            "title",
            "address"
        ].sort());
    });

    it("get address group names throws an exception", function () {
        var target = new AddressBookItem();
        expect(function () {
            target.getAddressGroupNames(target);
        }).toThrow();
    });

    it("set address group names throws an exception", function () {
        var target = new AddressBookItem();
        expect(function () {
            target.setAddressGroupNames(target);
        }).toThrow();
    });

    it("calling update saves the item", function () {
        var items = [
                new AddressBookItem(),
                new AddressBookItem(),
                new AddressBookItem()
            ],
            target = new AddressBookItem();

        items[0].addressBookItemId = "1";
        items[1].addressBookItemId = "2";
        items[2].addressBookItemId = "3";

        s.stub(db, "retrieveObject").returns(items);

        target.addressBookItemId = "2";
        target.title = "1984";

        s.mock(db).expects("saveObject").withExactArgs(
            constants.PIM.ADDRESS_LIST_KEY, [items[0], target, items[2]]).once();

        target.update();
    });

    it("calling update on an item that doesn't exist throws an exception", function () {
        var items = [
                new AddressBookItem(),
                new AddressBookItem(),
                new AddressBookItem()
            ],
            target = new AddressBookItem();

        items[0].addressBookItemId = "1";
        items[1].addressBookItemId = "2";
        items[2].addressBookItemId = "3";

        s.stub(db, "retrieveObject").returns(items);

        target.addressBookItemId = "4";
        target.title = "1984";

        s.mock(db).expects("saveObject").never();

        expect(function () {
            target.update(target);
        }).toThrow();
    });
});
