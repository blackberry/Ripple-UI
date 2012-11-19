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
describe("webworks Message", function () {
    var Message = ripple('platform/webworks.handset/2.0.0/client/Message'),
        Service = ripple('platform/webworks.handset/2.0.0/client/identity/Service'),
        select = ripple('platform/webworks.core/2.0.0/select'),
        FilterExpression = ripple('platform/webworks.handset/2.0.0/client/FilterExpression'),
        transport = ripple('platform/webworks.core/2.0.0/client/transport');

    describe("client side code", function () {
        var identity = ripple('platform/webworks.handset/2.0.0/client/identity');

        describe("in spec", function () {
            it("includes module according to proper object structure", function () {
                var spec = ripple('platform/webworks.handset/2.0.0/spec');
                expect(spec.objects.blackberry.children.message.children.Message.path)
                    .toEqual("webworks.handset/2.0.0/client/Message");
            });
        });

        describe("in client/Message", function () {
            beforeEach(function () {
                spyOn(transport, "call");
            });

            it("test when constructing without a service it gets the default email service", function () {
                spyOn(identity, "getDefaultService").andReturn([]);
                new Message();
                expect(identity.getDefaultService).toHaveBeenCalled();
            });

            it("when constructing with a service it doesn't get the default email service", function () {
                spyOn(identity, "getDefaultService");
                new Message(new Service());
                expect(identity.getDefaultService).not.toHaveBeenCalled();
            });

            it("that the default values are set correctly on a new message", function () {
                var service = new Service(),
                    msg = new Message(service);

                service.emailAddress = "gord@tinyHippos.com";

                expect(msg.bccRecipients).toEqual("");
                expect("", msg.body, "body");
                expect("", msg.ccRecipients, "ccRecipients");
                expect(Message.FOLDER_DRAFT, msg.folder, "folder");
                expect("", msg.from, "from");
                expect(Message.PRIORITY_MEDIUM, msg.priority, "priority");
                expect("", msg.replyTo, "replyTo");
                expect(Message.STATUS_DRAFT, msg.status, "status");
                expect("", msg.subject, "subject");
                expect("", msg.toRecipients, "toRecipients");
                expect(0, msg.uid, "uid");
            });

            it("that when saving a draft message it generates a uid", function () {
                spyOn(Math, "uuid").andReturn("42");
                var service = new Service(),
                    msg = new Message(service);
                msg.save();
                expect(42, msg.uid);
            });

            it("that when saving a message that was already saved it keeps the uid", function () {
                var stub = spyOn(Math, "uuid").andReturn("42"),
                    service = new Service(),
                    msg = new Message(service);
                msg.save();
                stub.reset();
                stub.andReturn(123);
                msg.save();
                expect(42, msg.uid);
            });

            it("when calling save on a draft the status stays as draft", function () {
                spyOn(Math, "uuid").andReturn("42");
                var service = new Service(),
                    msg = new Message(service);
                msg.save();
                expect(Message.STATUS_DRAFT, msg.status);
            });

            it("when saving a message it sets the from and replyTo addresses from the service passed in", function () {
                spyOn(Math, "uuid").andReturn("42");
                var service = new Service(),
                    msg = new Message(service);
                service.emailAddress = "gord@tinyHippos.com";
                msg.save();
                expect("gord@tinyHippos.com", msg.from, "from");
                expect("gord@tinyHippos.com", msg.replyTo, "replyTo");
            });

            it("when calling send with missing fields it throws an exception", function () {
                var msg = new Message(new Service());
                expect(msg.send).toThrow();
            });

            it("when calling send with all the required fields it sets the uid of the message", function () {
                spyOn(Math, "uuid").andReturn("42");
                var service = new Service(),
                    msg = new Message(service);

                msg.toRecipients = "gord@tinyhippos.com";
                msg.subject = "where's the beef?";
                msg.send();

                expect(msg.uid).toEqual(42);
            });

            it("removed messages are put in the deleted folder", function () {
                var service = new Service(),
                    msg = new Message(service);

                msg.save();
                msg.remove();

                expect(Message.FOLDER_DELETED, msg.folder);
            });

            it("when sending a message the status is unknown", function () {
                var service = new Service(),
                    msg = new Message(service);

                msg.toRecipients = "gord@tinyhippos.com";
                msg.subject = "wazzzzaaaappp?!?";
                msg.send();

                expect(Message.STATUS_UNKNOWN, msg.status);
            });

            it("test when sending a message the folder is draft", function () {
                var service = new Service(),
                    msg = new Message(service);

                msg.toRecipients = "gord@tinyhippos.com";
                msg.subject = "wazzzzaaaappp?!?";
                msg.send();

                expect(msg.folder).toEqual(Message.FOLDER_DRAFT);
            });
        });

        describe("find", function () {
            it("calls the transport with proper args", function () {
                var messages = [];
                spyOn(transport, "call").andReturn(messages);
                expect(Message.find(1, 2, 3)).toEqual(messages);
                expect(transport.call).toHaveBeenCalledWith("blackberry/message/message/find", {
                    post: {
                        filter: 1,
                        maxReturn: 2,
                        service: 3
                    }
                });
            });
        });

        describe("save", function () {
            it("generates a uuid when saved", function () {
                spyOn(Math, "uuid").andReturn("45");
                spyOn(identity, "getDefaultService").andReturn([{type: 0}]);
                spyOn(transport, "call");

                var item = new Message();
                item.save();

                expect(item.uid).toEqual(45);
                expect(Math.uuid).toHaveBeenCalledWith(8, 10);
            });

            it("calls the transport with id and properties", function () {
                spyOn(transport, "call");
                spyOn(Math, "uuid").andReturn("45");
                spyOn(identity, "getDefaultService").andReturn([{type: 0}]);

                var item = new Message();
                item.save();

                expect(transport.call).toHaveBeenCalledWith("blackberry/message/message/save", {
                    post: {message: item}
                });
            });
        });

        describe("remove", function () {
            it("calls the transport with id and properties", function () {
                spyOn(transport, "call");
                spyOn(Math, "uuid").andReturn("45");
                spyOn(identity, "getDefaultService").andReturn([{type: 0}]);

                var item = new Message();

                item.uid = 123;
                item.remove();

                expect(transport.call).toHaveBeenCalledWith("blackberry/message/message/remove", {
                    get: {uid: 123}
                });
            });
        });
    });

    describe("server side code", function () {
        var message = ripple('platform/webworks.handset/2.0.0/server/message'),
            webworks = ripple('platform/webworks.handset/2.0.0/server'),
            db = ripple('db');

        describe("using server", function () {
            it("exposes the message module", function () {
                expect(webworks.blackberry.message.message).toEqual(message);
            });
        });

        describe("when saving a message", function () {
            it("can save a new message", function () {
                var messages = {},
                    m = new Message(new Service());

                spyOn(db, "retrieveObject").andReturn(messages);
                spyOn(db, "saveObject");

                m.subject = "asdf";
                m.body = "asdf";

                message.save(null, {message: m});

                expect(messages[m.uid]).toEqual(m);
            });

            it("can overwrites some stuff when saving the first time", function () {
                var messages = {},
                    m = new Message(new Service());

                spyOn(db, "retrieveObject").andReturn(messages);
                spyOn(db, "saveObject");

                m.subject = "asdf";
                m.body = "asdf";
                m.folder = Message.FOLDER_DELETED;
                m.status = Message.STATUS_ERROR_OCCURED;

                message.save(null, {message: m});
                expect(messages[m.uid].folder).toBe(Message.FOLDER_DRAFT);
                expect(messages[m.uid].status).toBe(Message.STATUS_DRAFT);
            });

            it("can save an existing message", function () {
                var messages = {
                        "123": new Message(new Service())
                    },
                    m;

                spyOn(db, "retrieveObject").andReturn(messages);
                spyOn(db, "saveObject");
                spyOn(message, "find").andReturn(messages["123"]);

                m = message.find();
                m.subject = "asdf";
                m.body = "updated!";

                message.save(null, {message: m});
                expect(messages[m.uid]).toEqual(m);
            });

            it("doesn't write to some properties when saving an existing message", function () {
                var messages = {
                        "123": new Message(new Service())
                    },
                    m;

                spyOn(db, "retrieveObject").andReturn(messages);
                spyOn(db, "saveObject");
                spyOn(message, "find").andReturn(messages["123"]);

                m = message.find();
                m.folder = "WRITE!!";
                m.status = "WRITE!";

                message.save(null, {message: m});
                expect(messages[m.uid].folder).toBe(Message.FOLDER_DRAFT);
                expect(messages[m.uid].status).toBe(Message.STATUS_DRAFT);
            });
        });

        describe("when removing a message", function () {
            it("throws an exception of the message doesn't exist", function () {
                spyOn(db, "retrieveObject").andReturn({});

                expect(function () {
                    message.remove({uid: "123"});
                }).toThrow();
            });

            it("removes the message from the collection", function () {
                var msgs = {
                    "123": {}
                };

                spyOn(db, "retrieveObject").andReturn(msgs);
                spyOn(db, "saveObject");

                message.remove({uid: "123"});

                expect(msgs["123"]).not.toBeDefined();
            });

            it("doesn't remove messages when they don't match the uid", function () {
                var msgs = {
                    "1": {},
                    "2": {},
                    "3": {}
                };

                spyOn(db, "retrieveObject").andReturn(msgs);
                spyOn(db, "saveObject");

                message.remove({uid: "1"});

                expect(msgs["2"]).toBeDefined();
            });
        });

        describe("when sending a message", function () {
            it("sets the status to sent and folder to sent", function () {
                var msgs = {
                        "1": new Message(new Service())
                    },
                    m = msgs["1"];

                spyOn(db, "retrieveObject").andReturn(msgs);
                spyOn(db, "saveObject");

                m.uid = "1";
                m.toRecipients = "stephandgord@gmail.com";
                m.subject = "reservations";
                m.body = "I got us reservations for dinner @ 6, see you there";

                message.send({message: m});

                expect(msgs["1"].folder).toBe(Message.FOLDER_SENT);
                expect(msgs["1"].status).toBe(Message.STATUS_SENT);

            });
        });

        describe("when finding a message", function () {
            var from;

            beforeEach(function () {
                from = {
                    where: jasmine.createSpy().andReturn([])
                };
                from.orderBy = jasmine.createSpy().andReturn(from);
                from.max = jasmine.createSpy().andReturn(from);
            });

            it("calls select module with filter expression", function () {
                var filter = new FilterExpression();
                spyOn(select, "from").andReturn(from);

                message.find(null, {filter: filter});
                expect(from.where).toHaveBeenCalledWith(filter);
            });

            it("passes maxReturn", function () {
                var filter = new FilterExpression();
                spyOn(select, "from").andReturn(from);

                message.find(null, {filter: filter, maxReturn: 10});
                expect(from.max).toHaveBeenCalledWith(10);
            });
        });
    });
});
