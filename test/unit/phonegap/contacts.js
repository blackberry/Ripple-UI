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
    var db = require('ripple/db'),
        event = require('ripple/event'),
        utils = require('ripple/utils'),
        Contact = require('ripple/platform/phonegap/1.0.0/Contact'),
        ContactError = require('ripple/platform/phonegap/1.0.0/ContactError'),
        ContactField = require('ripple/platform/phonegap/1.0.0/ContactField'),
        ContactFindOptions = require('ripple/platform/phonegap/1.0.0/ContactFindOptions'),
        contacts = require('ripple/platform/phonegap/1.0.0/contacts');

    beforeEach(function () {
        spyOn(window, "setTimeout").andCallFake(function (func) {
            func();
        });
    });

    describe("spec", function () {
        var spec = require('ripple/platform/phonegap/1.0.0/spec');

        it("includes contacts module according to proper object structure", function () {
            expect(spec.objects.navigator.children.contacts.path)
                .toEqual("phonegap/1.0.0/contacts");
        });

        it("includes ContactError module according to proper object structure", function () {
            expect(spec.objects.ContactError.path)
                .toEqual("phonegap/1.0.0/ContactError");
        });

        it("includes Contact module according to proper object structure", function () {
            expect(spec.objects.Contact.path)
                .toEqual("phonegap/1.0.0/Contact");
        });

        it("includes ContactName module according to proper object structure", function () {
            expect(spec.objects.ContactName.path)
                .toEqual("phonegap/1.0.0/ContactName");
        });

        it("includes ContactAccount module according to proper object structure", function () {
            expect(spec.objects.ContactAccount.path)
                .toEqual("phonegap/1.0.0/ContactAccount");
        });

        it("includes ContactAddress module according to proper object structure", function () {
            expect(spec.objects.ContactAddress.path)
                .toEqual("phonegap/1.0.0/ContactAddress");
        });

        it("includes ContactOrganization module according to proper object structure", function () {
            expect(spec.objects.ContactOrganization.path)
                .toEqual("phonegap/1.0.0/ContactOrganization");
        });

        it("includes ContactFindOptions module according to proper object structure", function () {
            expect(spec.objects.ContactFindOptions.path)
                .toEqual("phonegap/1.0.0/ContactFindOptions");
        });

        it("includes ContactField module according to proper object structure", function () {
            expect(spec.objects.ContactField.path)
                .toEqual("phonegap/1.0.0/ContactField");
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
            contacts.find(null, function () {}, function (error) {
                expect(typeof error).toEqual("object");
                expect(error.message).toEqual("missing contact fields array");
                expect(error.code).toEqual(ContactError.INVALID_ARGUMENT_ERROR);
            });
        });

        it("returns empty array of contacts when given empty contact fields array", function () {
            contacts.find([], function (items) {
                expect(items.length, 0, "expected empty array");
            });
        });

        it("calls error callback when only non-existent contact fields given", function () {
            contacts.find(["dude"], function () {}, function (error) {
                expect(typeof error).toEqual("object");
                expect(typeof error.message).toEqual("string");
                expect(error.code).toEqual(ContactError.INVALID_ARGUMENT_ERROR);
            });
        });

        it("calls error callback when some non-existent contact fields given", function () {
            contacts.find(["displayName", "sweet"], function () {}, function (error) {
                expect(typeof error).toEqual("object");
                expect(typeof error.message).toEqual("string");
                expect(error.code).toEqual(ContactError.INVALID_ARGUMENT_ERROR);
            });
        });

        it("calls error callback when no success callback given", function () {
            contacts.find(["displayName"], undefined, function (error) {
                expect(typeof error).toEqual("object");
                expect(typeof error.message).toEqual("string");
                expect(error.code).toEqual(ContactError.INVALID_ARGUMENT_ERROR);
            });
        });

        it("returns array in success callback", function () {
            contacts.find(["displayName"], function (items) {
                expect(typeof items).toEqual("object");
                expect(typeof items.length).toEqual("number");
            });
        });

        it("returns array of contacts", function () {
            var data = [new Contact(), new Contact()];
            data[0].displayName = "dave";
            data[1].displayName = "rob";

            spyOn(db, "retrieveObject").andReturn(data);

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

            spyOn(db, "retrieveObject").andReturn(data);

            contacts.find(["emails"], function (items) {
                expect(items[0].id).toEqual("daveID");
            });
        });

        it("returns contacts with contact field properties only", function () {
            var data = [new Contact()],
                emails;

            emails = data[0].emails = new ContactField("dave", "dave@test.com", true);
            data[0].id = "daveID";

            spyOn(db, "retrieveObject").andReturn(data);

            contacts.find(["emails"], function (items) {
                expect(items[0].id).toEqual("daveID");
                expect(items[0].emails).toEqual(emails);
                expect(typeof items[0].save).toEqual("function");
                expect(typeof items[0].clone).toEqual("function");
                expect(typeof items[0].remove).toEqual("function");
                expect(utils.count(items[0])).toEqual(5);
            });
        });

        it("returns default contacts when none persisted", function () {
            spyOn(db, "retrieveObject").andReturn(null);
            contacts.find(["name", "displayName", "emails"], function (items) {
                var i;
                expect(items.length, 5, "expected five default contacts");
                for (i = 0; i < items.length; i++) {
                    expect(typeof items[i].id).toEqual("string");
                    expect(typeof items[i].emails).toEqual("object");
                    expect(typeof items[i].displayName).toEqual("string");
                    expect(utils.count(items[i])).toEqual(7);
                }
            });
        });

        it("returns all the fields when given a fields array of ['*']", function () {
            var error = jasmine.createSpy("error callback");

            spyOn(db, "retrieveObject").andReturn(null);

            contacts.find(["*"], function (items) {
                expect(utils.count(items[0])).toBe(17);
            }, error);
        });

        it("can find contacts based on the filter findOption", function () {
            var contact = contacts.create({"name": "The Sheldon Cooper"}),
                data = [contact, new Contact(), new Contact()],
                options = new ContactFindOptions(),
                error = jasmine.createSpy();

            options.filter = "sheldon";

            spyOn(db, "retrieveObject").andReturn(data);

            contacts.find(["name", "displayName", "addresses"], function (items) {
                expect(items.length).toEqual(1);
                expect(items[0].id).toEqual(contact.id);
                expect(items[0].name).toEqual(contact.name);
            }, error, options);
        });

        it("can find contacts based on the filter findOption (with objects)", function () {
            var contact = contacts.create({
                    "name": "Sheldon Cooper",
                    "emails": [new ContactField("personal", "sheldon@email.com", true)]
                }),
                data = [contact, new Contact(), new Contact()],
                options = new ContactFindOptions(),
                error = jasmine.createSpy();

            spyOn(db, "retrieveObject").andReturn(data);

            options.filter = "sheldon@email.com";

            contacts.find(["name", "emails"], function (items) {
                expect(items.length).toEqual(1);
                expect(items[0].id).toEqual(contact.id);
                expect(items[0].name).toEqual(contact.name);
                expect(items[0].emails).toEqual(contact.emails);
            }, error, options);
        });

        it("should return multiple contacts when findOptions.multiple is true", function () {
            var options = new ContactFindOptions(),
                data = [new Contact(), new Contact(), new Contact()],
                error = jasmine.createSpy();

            options.multiple = true;

            spyOn(db, "retrieveObject").andReturn(data);

            contacts.find(["displayName"], function (items) {
                expect(items.length).toEqual(3);
            }, error, options);
        });

        it("should return only one contact when findOptions.multiple is false", function () {
            var options = new ContactFindOptions(),
                data = [new Contact(), new Contact()],
                error = jasmine.createSpy();

            spyOn(db, "retrieveObject").andReturn(data);

            contacts.find(["name"], function (items) {
                expect(items.length).toEqual(1);
            }, error, options);
        });

        it("can limit amount of contacts returned by last updated (findOptions)", function () {
            var options = new ContactFindOptions(),
                newContact = new Contact(),
                oldContact = new Contact(),
                data = [newContact, oldContact],
                error = jasmine.createSpy();

            oldContact.updated = new Date(2010, 0, 1);
            newContact.updated = new Date(2010, 8, 20);

            options.updatedSince = new Date(2010, 4, 20);
            options.multiple = true;

            spyOn(db, "retrieveObject").andReturn(data);

            contacts.find(["name"], function (items) {
                expect(1, items.length, "expected only one contact");
                expect(newContact.id, items[0].id, "expected only one contact");
            }, error, options);
        });
    });

    describe("when saving", function () {

        describe("the Contact object", function () {

            beforeEach(function () {
                spyOn(event, "trigger");
            });

            it("sets id to uuid if falsy", function () {
                var contact = contacts.create({
                        "name": "dan",
                        "id": null
                    });

                spyOn(Math, "uuid").andReturn(420);
                contact.save(jasmine.createSpy(), jasmine.createSpy());
                expect(contact.id).toBe(420);
            });

            it("doesn't set the uuid if truthy", function () {
                var contact = contacts.create({
                        "name": "dan",
                        "id": null
                    });

                spyOn(Math, "uuid").andReturn(420);
                contact.save(jasmine.createSpy(), jasmine.createSpy());
                expect(contact.id).toBe(420);
            });

            it("raises the phonegap-contact-save event", function () {
                var contact = contacts.create({"name": "claude"});
                contact.save(jasmine.createSpy(), jasmine.createSpy());
                expect(event.trigger).toHaveBeenCalledWith("phonegap-contact-save", [
                    jasmine.any(Object),
                    jasmine.any(Function),
                    jasmine.any(Function)
                ]);
            });

            it("sets the updated property", function () {
                var contact = contacts.create({name: "Peter Pan"});
                contact.save(jasmine.createSpy(), jasmine.createSpy());
                expect(contact.updated).toBeDefined();
            });

            it("reverts the last updated property on error", function () {

                var contact = contacts.create({name: "Tom", updated: "w00t"});

                contact.save(function () { }, function () {
                    expect(contact.updated).toBe("w00t");
                });

                //execute the error callback via hackery and magic
                event.trigger.argsForCall[0][1][2]();
            });
        });

        describe("the contacts module", function () {
            it("saves a new contact", function () {
                var contact = contacts.create({
                        "name": "rob",
                        "id": "some_id_yo"
                    }),
                    error = jasmine.createSpy();

                spyOn(db, "saveObject");
                spyOn(db, "retrieveObject").andReturn([]);

                event.trigger("phonegap-contact-save", [contact, function (item) {
                    expect(db.saveObject).toHaveBeenCalledWith("phonegap-contacts", [contact]);
                }, error], true);
            });

            it("updates an existing contact if a contact with the same id already exists", function () {
                var contact = contacts.create({
                        "name": "rob",
                        "id": "some_id_yo"
                    }),
                    error = jasmine.createSpy();

                spyOn(db, "saveObject");
                spyOn(db, "retrieveObject").andReturn([contact]);

                event.trigger("phonegap-contact-save", [contact, function (item) {
                    expect(item.id).toEqual(contact.id);
                    expect(item.name).toEqual(contact.name);
                    expect(db.saveObject).toHaveBeenCalledWith("phonegap-contacts", [contact]);
                }, error], true);
            });
        });
    });

    describe("remove", function () {
        it("can remove itself", function () {
            var contact = contacts.create({"name": "michelle"}),
                data = [contact],
                error = jasmine.createSpy();

            contact.id = "some_awesome_id";

            spyOn(db, "saveObject");
            spyOn(db, "retrieveObject").andReturn(data);

            contact.remove(function () {
                expect(data.length).toBe(0);
                expect(db.saveObject).toHaveBeenCalledWith("phonegap-contacts", []);
            }, error);
        });

        it("returns a NOT_FOUND_ERROR when calling remove on a contact with a null id", function () {
            var contact = contacts.create({"id": null, "name": "fabio"}),
                data = [contact];

            spyOn(db, "saveObject");
            spyOn(db, "retrieveObject").andReturn(data);

            contact.remove(function () {}, function (error) {
                expect(typeof error).toEqual("object");
                expect(typeof error.message).toEqual("string");
                expect(error.code).toEqual(ContactError.NOT_FOUND_ERROR);
            });

        });

        it("calling remove on a non-existent contact id should return NOT_FOUND_ERROR", function () {
            var contact = contacts.create({"name": "fabio"}),
                data = [contact];

            spyOn(db, "saveObject");
            spyOn(db, "retrieveObject").andReturn(data);

            contact.remove(function () {}, function (error) {
                expect(typeof error).toEqual("object");
                expect(typeof error.message).toEqual("string");
                expect(error.code, ContactError.NOT_FOUND_ERROR);
            });
        });
    });
});
