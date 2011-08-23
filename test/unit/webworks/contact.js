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
describe("webworks contact", function () {
    var contact = require('ripple/platform/webworks.handset/2.0.0/server/contact'),
        Contact = require('ripple/platform/webworks.handset/2.0.0/client/Contact'),
        webworks = require('ripple/platform/webworks.handset/2.0.0/server'),
        db = require('ripple/db'),
        select = require('ripple/platform/webworks.core/2.0.0/select'),
        FilterExpression = require('ripple/platform/webworks.handset/2.0.0/client/FilterExpression'),
        spec = require('ripple/platform/webworks.handset/2.0.0/spec'),
        transport = require('ripple/platform/webworks.core/2.0.0/client/transport');

    describe("server index", function () {
        it("exposes the module", function () {
            expect(webworks.blackberry.pim.contact).toEqual(contact);
        });
    });

    describe("spec index", function () {
        it("includes module according to proper object structure", function () {
            expect(spec.objects.blackberry.children.pim.children.Contact.path)
                .toEqual("webworks.handset/2.0.0/client/Contact");
        });
    });

    describe("client", function () {
        describe("constructor", function () {
            describe("save", function () {
                it("generates a uuid when saved", function () {
                    spyOn(Math, "uuid").andReturn("234");
                    spyOn(transport, "call");

                    var item = new Contact();
                    item.save();

                    expect(item.uid).toEqual("234");
                    expect(Math.uuid).toHaveBeenCalledWith(null, 16);
                });

                it("calls the transport with id and properties", function () {
                    var item = new Contact();

                    spyOn(Math, "uuid").andReturn("42");
                    spyOn(transport, "call");

                    item.save();

                    expect(transport.call).toHaveBeenCalledWith("blackberry/pim/contact/save", {
                        post: {
                            contact: item
                        }
                    });
                });
            });

            describe("remove", function () {
                it("calls the transport with id and properties", function () {
                    var item = new Contact();
                    spyOn(transport, "call");
                    item.uid = "id";
                    item.remove();
                    expect(transport.call).toHaveBeenCalledWith("blackberry/pim/contact/remove", {
                        get: {
                            id: "id"
                        }
                    });
                });

                it("throws exception when called before save", function () {
                    var item = new Contact();
                    spyOn(transport, "call");
                    expect(function () {
                        item.remove();
                    }).toThrow();
                });
            });
        });

        describe("module", function () {
            describe("find", function () {
                it("calls the transport with proper args", function () {
                    var contacts = [];
                    spyOn(transport, "call").andReturn(contacts);
                    expect(Contact.find(1, 2, 3, 4, 5)).toEqual(contacts);
                    expect(transport.call).toHaveBeenCalledWith("blackberry/pim/contact/find", {
                        post: {
                            fieldFilter: 1,
                            orderBy: 2,
                            maxReturn: 3,
                            service: 4,
                            isAscending: 5
                        }
                    });
                });

                it("returns an array of massaged Contact objects", function () {
                    var item = new Contact(),
                        contacts;

                    item.uid = "id";
                    item.note = "value";
                    item.birthday = new Date();
                    item.anniversary = new Date();

                    spyOn(transport, "call").andReturn([JSON.parse(JSON.stringify(item))]);

                    contacts = Contact.find();

                    expect(contacts.length).toEqual(1);
                    expect(contacts[0].uid).toEqual(item.uid);
                    expect(contacts[0].note).toEqual(item.note);

                    // Date
                    expect(contacts[0].anniversary).toEqual(item.anniversary);
                    expect(contacts[0].birthday).toEqual(item.birthday);
                });
            });
        });

        describe("server module", function () {
            describe("find", function () {
                var chain;

                beforeEach(function () {
                    chain = {
                        orderBy: jasmine.createSpy().andReturn(chain),
                        max: jasmine.createSpy().andReturn(chain),
                        where: jasmine.createSpy()
                    };
                    spyOn(select, "from").andReturn(chain);
                });

                it("calls select module with filter expression", function () {
                    var filter = new FilterExpression();
                    contact.find({}, {fieldFilter: filter});
                    expect(chain.where).toHaveBeenCalledWith(filter);
                });

                it("returns unfiltered list of contacts", function () {
                    var _contact = {
                            uid: "id",
                            prop: "value"
                        };

                    chain.where.andReturn([_contact]);
                    spyOn(db, "retrieveObject").andReturn([]);
                    expect(contact.find({}, {}).data).toEqual([_contact]);
                });

                it("passes maxReturn", function () {
                    contact.find({}, {filter: new FilterExpression(), maxReturn: 2});
                    expect(chain.max).toHaveBeenCalledWith(2);
                });

                it("passes orderBy", function () {
                    contact.find({}, {filter: new FilterExpression(), orderBy: "orderByProp"});
                    expect(chain.orderBy).toHaveBeenCalledWith("orderByProp", "asc");
                });

                it("passes desc when not isAscending", function () {
                    contact.find({}, {filter: new FilterExpression(), orderBy: "foo", isAscending: false});
                    expect(chain.orderBy.mostRecentCall.args[1]).toEqual("desc");
                });

                it("passes asc when isAscending", function () {
                    contact.find({}, {filter: new FilterExpression(), orderBy: "foo", isAscending: true});
                    expect(chain.orderBy.mostRecentCall.args[1]).toEqual("asc");
                });
            });

            describe("save", function () {
                it("persists a new contact", function () {
                    var contacts = {},
                        item = {
                            uid: "42",
                            prop: "value"
                        };

                    spyOn(db, "saveObject");
                    spyOn(db, "retrieveObject").andReturn(contacts);
                    contact.save({}, {contact: item});

                    expect(contacts).toEqual({
                        "42": item
                    });
                    expect(db.saveObject).toHaveBeenCalledWith("blackberry-pim-contacts", contacts);
                });
            });

            describe("remove", function () {
                it("can remove a contact", function () {
                    var contacts = {
                            "42": contact
                        };

                    spyOn(db, "saveObject");
                    spyOn(db, "retrieveObject").andReturn(contacts);

                    contact.remove({id: "42"}, {});

                    expect(contacts).toEqual({});
                    expect(db.saveObject).toHaveBeenCalledWith("blackberry-pim-contacts", contacts);
                });
            });
        });
    });
});
