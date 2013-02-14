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
describe("Cordova Contacts Bridge", function () {
    var contacts = ripple('platform/cordova/2.0.0/bridge/contacts'),
    db = ripple('db'),
    contact = {
        "name": { formatted: "Mark Dineen" },
        "id": Math.uuid(undefined, 16),
        "displayName": "Mark Dineen",
        "emails": [{ type: "work", value: "mddineen@gmail.com", pref: false }]
    },
    s,
    e,
    _default = [{
            "name": { formatted: "Brent Lintner" },
            "displayName": "Brent Lintner",
            "emails": [{ type: "work", value: "brent@tinyhippos.com", pref: false }]
        }, {
            "name": { formatted: "PJ Lowe" },
            "displayName": "PJ Lowe",
            "emails": [{ type: "work", value: "pj@tinyhippos.com", pref: false }]
        }, {
            "name": { formatted: "Dan Silivestru" },
            "displayName": "Dan Silivestru",
            "emails": [{ type: "work", value: "dan@tinyhippos.com", pref: false }]
        }, {
            "name": { formatted: "Gord Tanner" },
            "displayName": "Gord Tanner",
            "emails": [{ type: "work", value: "gord@tinyhippos.com", pref: true }]
        }, {
            "name": { formatted: "Mark McArdle" },
            "displayName": "Mark McArdle",
            "emails": [{ type: "work", value: "mark@tinyhippos.com", pref: false }]
        }],
    navi;

    beforeEach(function () {
        navi = global.navigator;
        s = jasmine.createSpy("success");
        e = jasmine.createSpy("error");
        global.navigator = {
            contacts: {
                create: jasmine.createSpy("navigator.contacts.create").andCallFake(function (obj) {
                    return obj;
                })
            }
        };
    });

    afterEach(function () {
        global.navigator = navi;
    });

    describe("on search", function () {
        beforeEach(function () {
            spyOn(db, "retrieveObject").andReturn(_default);
        });

        it("throws an exception if called with no args", function () {
            expect(contacts.search).toThrow();
        });

        it("can be called without specifying an error callback", function () {
            contacts.search(s, null, [["name"], { filter: "", multiple: true }]);
            expect(typeof s.mostRecentCall.args[0][0].name.formatted).toBe("string");
        });

        it("returns the default if called with no filters", function () {
            contacts.search(s, e, [["name"], { filter: "", multiple: true }]);
            expect(s).toHaveBeenCalled();
            expect(s.mostRecentCall.args[0].length).toBe(5);
            expect(s.mostRecentCall.args[0][0].name.formatted).toBe("Brent Lintner");
            expect(e).not.toHaveBeenCalled();
        });

        it("returns Brent and Dan only when 'li' is added to the filter", function () {
            contacts.search(s, e, [["name"], { filter: "li", multiple: true }]);
            expect(s).toHaveBeenCalled();
            expect(s.mostRecentCall.args[0].length).toBe(2);
            expect(s.mostRecentCall.args[0][0].name.formatted).toBe("Brent Lintner");
            expect(s.mostRecentCall.args[0][1].name.formatted).toBe("Dan Silivestru");
            expect(e).not.toHaveBeenCalled();
        });

        it("returns only one result if filter is blank and multiple is false", function () {
            contacts.search(s, e, [["name"], { filter: "", multiple: false }]);
            expect(s).toHaveBeenCalled();
            expect(s.mostRecentCall.args[0].length).toBe(1);
            expect(s.mostRecentCall.args[0][0].name.formatted).toBe("Brent Lintner");
            expect(e).not.toHaveBeenCalled();
        });
    });
    
    describe("on save", function () {
        beforeEach(function () {
            spyOn(db, "saveObject");
            spyOn(db, "retrieveObject").andReturn([contact]);
        });

        it("throws an exception if called with no args", function () {
            expect(function () { contacts.save(); }).toThrow();
        });

        it("can be called without specifying an error callback", function () {
            contacts.save(s, null, [contact]);
            expect(db.saveObject).toHaveBeenCalledWith("cordova-contacts", [contact]);
            expect(s).toHaveBeenCalledWith(contact);
            expect(e).not.toHaveBeenCalled();
        });

        //gord: please confirm this is the intended behaviour
        it("does not throw an exception if called with an invalid contact", function () {
            contacts.save(s, e, [ {test: 'test'}  ]);
            expect(db.saveObject).toHaveBeenCalled(); //not?
            expect(s).toHaveBeenCalled(); //not?
            //error callback not implemented
            //expect(e).toHaveBeenCalled();
        });

        it("can be called normally, saving the contact", function () {
            contacts.save(s, e, [contact]);
            expect(db.saveObject).toHaveBeenCalledWith("cordova-contacts", [contact]);
            expect(s).toHaveBeenCalledWith(contact);
            expect(e).not.toHaveBeenCalled();
        });
    });

    describe("on remove", function () {
        beforeEach(function () {
            spyOn(db, "saveObject");
            spyOn(db, "retrieveObject").andReturn([contact]);
        });

        it("throws an exception if called with no args", function () {
            expect(contacts.remove).toThrow();
        });

        it("can be called without specifying an error callback", function () {
            contacts.remove(s, null, [contact.id]);
            expect(db.saveObject).toHaveBeenCalledWith("cordova-contacts", []);
            expect(s).toHaveBeenCalledWith();
            expect(e).not.toHaveBeenCalled();
        });

        it("throw an exception if called with an invalid id", function () {
            contacts.remove(s, e, [ 321654 ]);
            expect(db.saveObject).not.toHaveBeenCalled();
            expect(s).not.toHaveBeenCalled();
            //error callback not implemented
            //expect(e).toHaveBeenCalled();
        });
    });
});
