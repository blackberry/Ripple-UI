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
describe("phonegap_contacts", function () {
    var s,
        _contactDB = [],
        sinon = require('sinon'),
        db = require('ripple/db'),
        Contact = require('ripple/platform/phonegap/1.0/Contact'),
        ContactError = require('ripple/platform/phonegap/1.0/ContactError'),
        ContactField = require('ripple/platform/phonegap/1.0/ContactField'),
        ContactFindOptions = require('ripple/platform/phonegap/1.0/ContactFindOptions'),
        contacts = require('ripple/platform/phonegap/1.0/contacts');

    function _propertyCount(obj) {
        var prop, count = 0;
        for (prop in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, prop)) {
                count++;
            }
        }
        return count;
    }

    beforeEach(function () {
        s = sinon.sandbox.create();
        spyOn(db, "retrieveObject").andReturn(_contactDB);
    });

    afterEach(function () {
        s.verifyAndRestore();
        _contactDB.splice(0, _contactDB.length);
    });

    describe("spec", function () {
        var spec = require('ripple/platform/phonegap/1.0/spec');

        it("includes contacts module according to proper object structure", function () {
            expect(spec.objects.navigator.children.contacts.path)
                .toEqual("phonegap/1.0/contacts");
        });

        it("includes ContactError module according to proper object structure", function () {
            expect(spec.objects.ContactError.path)
                .toEqual("phonegap/1.0/ContactError");
        });

        it("includes Contact module according to proper object structure", function () {
            expect(spec.objects.Contact.path)
                .toEqual("phonegap/1.0/Contact");
        });

        it("includes ContactName module according to proper object structure", function () {
            expect(spec.objects.ContactName.path)
                .toEqual("phonegap/1.0/ContactName");
        });

        it("includes ContactAccount module according to proper object structure", function () {
            expect(spec.objects.ContactAccount.path)
                .toEqual("phonegap/1.0/ContactAccount");
        });

        it("includes ContactAddress module according to proper object structure", function () {
            expect(spec.objects.ContactAddress.path)
                .toEqual("phonegap/1.0/ContactAddress");
        });

        it("includes ContactOrganization module according to proper object structure", function () {
            expect(spec.objects.ContactOrganization.path)
                .toEqual("phonegap/1.0/ContactOrganization");
        });

        it("includes ContactFindOptions module according to proper object structure", function () {
            expect(spec.objects.ContactFindOptions.path)
                .toEqual("phonegap/1.0/ContactFindOptions");
        });

        it("includes ContactField module according to proper object structure", function () {
            expect(spec.objects.ContactField.path)
                .toEqual("phonegap/1.0/ContactField");
        });
    });

    it("can create a contact", function () {
        var obj = {
                name: "captain awesome",
                birthday: "11/12/0021"
            },
            contact;

        contact = contacts.create(obj);

        expect(contact.name).toEqual(obj.name);
        expect(contact.birthday).toEqual(obj.birthday);
    });

    describe("create", function () {
        it("contact sets uuid as id when instantiated", function () {
            spyOn(Math, "uuid").andReturn("ABCD");
            expect(contacts.create().id).toEqual("ABCD");
        });

        it("contact can set custom id when instantiated", function () {
            var contact = contacts.create({id: "5"});
            expect(contact.id).toEqual("5");
        });

        it("contact clone returns deep copy", function () {
            var contact = contacts.create(),
                clone = contact.clone();
            expect(typeof clone === "object").toEqual(true);
            expect(contact !== clone).toEqual(true);
        });

        it("contact clone sets id to null", function () {
            var contact = contacts.create(),
                clone = contact.clone();
            contact.id = "some id";
            expect(clone.id).toEqual(null);
            expect(contact.id).not.toEqual(clone.id);
        });
    });

    describe("find", function () {
        it("calls error callback when no contact fields given", function () {
            waits(1);
            contacts.find(null, function () {}, function (error) {
                expect(typeof error).toEqual("object");
                expect(error.message).toEqual("missing contact fields array");
                expect(error.code).toEqual(ContactError.INVALID_ARGUMENT_ERROR);
            });
        });

        it("returns empty array of contacts when given empty contact fields array", function () {
            waits(1);
            contacts.find([], function (items) {
                expect(items.length, 0, "expected empty array");
            });
        });

        it("calls error callback when only non-existent contact fields given", function () {
            waits(1);
            contacts.find(["dude"], function () {}, function (error) {
                expect(typeof error).toEqual("object");
                expect(typeof error.message).toEqual("string");
                expect(error.code).toEqual(ContactError.INVALID_ARGUMENT_ERROR);
            });
        });

        it("calls error callback when some non-existent contact fields given", function () {
            waits(1);
            contacts.find(["displayName", "sweet"], function () {}, function (error) {
                expect(typeof error).toEqual("object");
                expect(typeof error.message).toEqual("string");
                expect(error.code).toEqual(ContactError.INVALID_ARGUMENT_ERROR);
            });
        });

        it("calls error callback when no success callback given", function () {
            waits(1);
            contacts.find(["displayName"], undefined, function (error) {
                expect(typeof error).toEqual("object");
                expect(typeof error.message).toEqual("string");
                expect(error.code).toEqual(ContactError.INVALID_ARGUMENT_ERROR);
            });
        });

        it("returns array in success callback", function () {
            waits(1);
            contacts.find(["displayName"], function (items) {
                expect(typeof items).toEqual("object");
                expect(typeof items.length).toEqual("number");
            });
        });

        it("returns array of contacts", function () {
            var data = [new Contact(), new Contact()];
            data[0].displayName = "dave";
            data[1].displayName = "rob";

            _contactDB.splice.apply(_contactDB, [0, data.length].concat(data));

            waits(1);
            contacts.find(["displayName"], function (items) {
                expect(items.length).toEqual(2);
                expect(items[0].displayName).toEqual("dave");
                expect(items[1].displayName).toEqual("rob");
            });
        });

        it("returned contacts have id", function () {
            var data = [new Contact()],
                emails;

            emails = data[0].emails = new ContactField("dave", "dave@test.com", true);
            data[0].id = "daveID";

            _contactDB.splice.apply(_contactDB, [0, data.length].concat(data));

            waits(1);
            contacts.find(["emails"], function (items) {
                expect(items[0].id).toEqual("daveID");
            });
        });

        it("returns contacts with contact field properties only", function () {
            var data = [new Contact()],
                emails;

            emails = data[0].emails = new ContactField("dave", "dave@test.com", true);
            data[0].id = "daveID";

            _contactDB.splice.apply(_contactDB, [0, data.length].concat(data));

            waits(1);
            contacts.find(["emails"], function (items) {
                expect(items[0].id).toEqual("daveID");
                expect(items[0].emails).toEqual(emails);
                expect(typeof items[0].save).toEqual("function");
                expect(typeof items[0].clone).toEqual("function");
                expect(typeof items[0].remove).toEqual("function");
                expect(_propertyCount(items[0])).toEqual(5);
            });
        });

        it("returns default contacts when none persisted", function () {
            waits(1);
            contacts.find(["name", "displayName", "emails"], function (items) {
                var i;
                expect(items.length, 5, "expected five default contacts");
                for (i = 0; i < items.length; i++) {
                    expect(typeof items[i].id).toEqual("string");
                    expect(typeof items[i].emails).toEqual("object");
                    expect(typeof items[i].displayName).toEqual("string");
                    expect(_propertyCount(items[i])).toEqual(7);
                }
            });
        });

        it("can find contacts based on the filter findOption", function () {
            var contact = contacts.create({"name": "The Sheldon Cooper"}),
                data = [contact, new Contact(), new Contact()],
                options = new ContactFindOptions();

            options.filter = "sheldon";

            _contactDB.splice.apply(_contactDB, [0, data.length].concat(data));

            waits(1);
            contacts.find(["name", "displayName", "addresses"], function (items) {
                expect(items.length).toEqual(1);
                expect(items[0].id).toEqual(contact.id);
                expect(items[0].name).toEqual(contact.name);
            }, s.mock().never(), options);
        });

        it("can find contacts based on the filter findOption (with objects)", function () {
            var contact = contacts.create({
                    "name": "Sheldon Cooper",
                    "emails": [new ContactField("personal", "sheldon@email.com", true)]
                }),
                data = [contact, new Contact(), new Contact()],
                options = new ContactFindOptions();

            _contactDB.splice.apply(_contactDB, [0, data.length].concat(data));

            options.filter = "sheldon@email.com";

            waits(1);
            contacts.find(["name", "emails"], function (items) {
                expect(items.length).toEqual(1);
                expect(items[0].id).toEqual(contact.id);
                expect(items[0].name).toEqual(contact.name);
                expect(items[0].emails).toEqual(contact.emails);
            }, s.mock().never(), options);
        });

        it("should return multiple contacts when findOptions.multiple is true", function () {
            var options = new ContactFindOptions(),
                data = [new Contact(), new Contact(), new Contact()];

            options.multiple = true;

            _contactDB.splice.apply(_contactDB, [0, data.length].concat(data));

            waits(1);
            contacts.find(["displayName"], function (items) {
                expect(items.length).toEqual(3);
            }, s.mock().never(), options);
        });

        it("should return only one contact when findOptions.multiple is false", function () {
            var options = new ContactFindOptions(),
                data = [new Contact(), new Contact()];

            _contactDB.splice.apply(_contactDB, [0, data.length].concat(data));

            waits(1);
            contacts.find(["name"], function (items) {
                expect(items.length).toEqual(1);
            }, s.mock().never(), options);
        });

        it("can limit amount of contacts returned by last updated (findOptions)", function () {
            var options = new ContactFindOptions(),
                newContact = new Contact(),
                oldContact = new Contact(),
                data = [newContact, oldContact];

            oldContact.updated = new Date(2010, 0, 1);
            newContact.updated = new Date(2010, 8, 20);

            options.updatedSince = new Date(2010, 4, 20);
            options.multiple = true;

            _contactDB.splice.apply(_contactDB, [0, data.length].concat(data));

            waits(1);
            contacts.find(["name"], function (items) {
                expect(1, items.length, "expected only one contact");
                expect(newContact.id, items[0].id, "expected only one contact");
            }, s.mock().never(), options);
        });
    });

    describe("save", function () {
        it("can save itself", function () {
            var contact = contacts.create({"name": "claude"});

            // hmm, not 100% assertive
            s.mock(db)
                .expects("saveObject").once()
                .withArgs("phonegap-contacts");

            _contactDB.splice.apply(_contactDB, [0, 1]);

            waits(1);
            contact.save(function (items) {
                expect(items.length).toEqual(1);
                expect(items[0].id).toEqual(contact.id);
                expect(items[0].name).toEqual(contact.name);
            }, s.mock().never());
        });

        it("sets id to uuid if falsy", function () {
            var contact = contacts.create({
                "name": "dan",
                "id": null
            });

            // hmm, not 100% assertive
            s.mock(db)
                .expects("saveObject").once()
                .withArgs("phonegap-contacts");

            waits(1);
            contact.save(function (items) {
                expect(items.length).toEqual(1);
                expect(typeof items[0].id).toEqual("string");
            }, s.mock().never());
        });

        it("updates last updated property", function () {
            var contact = contacts.create({"name": "frank"}),
                then = new Date();

            // hmm, not 100% assertive
            s.mock(db)
                .expects("saveObject").once()
                .withArgs("phonegap-contacts");

            waits(1);
            contact.save(function (items) {
                expect(items.length).toEqual(1);
                expect(items[0].updated >= then).toEqual(true);
            }, s.mock().never());
        });

        it("does not update last updated property when error", function () {
            var lastUpdated = new Date(2010, 11, 28),
                contact = contacts.create({
                    "id": null,
                    "name": "ricardo",
                    "updated": lastUpdated
                });

            // hmm, not 100% assertive
            s.mock(db)
                .expects("saveObject").once()
                .withArgs("phonegap-contacts");

            _contactDB.splice.apply(_contactDB, [0, 1, contact]);

            waits(1);
            contact.save(undefined, function (error) {
                expect(contact.updated.getTime()).toEqual(lastUpdated.getTime());
            });
        });

        it("updates an existing contact if a contact with the same id already exists", function () {
            var contact = contacts.create({
                "name": "rob",
                "id": "some_id_yo"
            });

            s.mock(db)
                .expects("saveObject").once()
                .withArgs("phonegap-contacts", [contact]);

            _contactDB.splice.apply(_contactDB, [0, 1, contact]);

            waits(1);
            contact.save(function (items) {
                expect(items.length).toEqual(1);
                expect(items[0].id).toEqual(contact.id);
                expect(items[0].name).toEqual(contact.name);
            }, s.mock().never());
        });
    });

    describe("remove", function () {
        it("can remove itself", function () {
            var contact = contacts.create({"name": "michelle"});

            contact.id = "some_awesome_id";

            s.mock(db)
                .expects("saveObject").once()
                .withArgs("phonegap-contacts", []);

            _contactDB.splice.apply(_contactDB, [0, 1, contact]);

            waits(1);
            contact.remove(function (items) {
                expect(0, items.length, "expected only one contact");
            }, s.mock().never());
        });

        it("calling remove on a contact with a null id should return NOT_FOUND_ERROR", function () {
            var contact = contacts.create({"id": null, "name": "fabio"});

            s.mock(db).expects("saveObject").never();
            _contactDB.splice.apply(_contactDB, [0, 1, new Contact()]);

            waits(1);
            contact.remove(function () {}, function (error) {
                expect(typeof error).toEqual("object");
                expect(typeof error.message).toEqual("string");
                expect(error.code).toEqual(ContactError.NOT_FOUND_ERROR);
            });
        });

        it("calling remove on a non-existent contact id should return NOT_FOUND_ERROR", function () {
            var contact = contacts.create({"name": "fabio"});

            s.mock(db).expects("saveObject").never();

            _contactDB.splice.apply(_contactDB, [0, 1, new Contact()]);

            waits(1);
            contact.remove(function () {}, function (error) {
                expect(typeof error).toEqual("object");
                expect(typeof error.message).toEqual("string");
                expect(error.code, ContactError.NOT_FOUND_ERROR);
            });
        });
    });
});
