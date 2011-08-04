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
describe("webworks_sms", function () {
    var sms = require('ripple/platform/webworks.handset/2.0.0/server/sms'),
        smsClient = require('ripple/platform/webworks.handset/2.0.0/client/sms'),
        transport = require('ripple/platform/webworks.core/2.0.0/client/transport'),
        event = require('ripple/event'),
        sinon = require('sinon'),
        platform = require('ripple/platform'),
        notifications = require('ripple/notifications'),
        constants = require('ripple/constants'),
        _console = require('ripple/console'),
        MockBaton = function () {
            this.take = jasmine.createSpy('baton.take');
            this.pass = jasmine.createSpy('baton.pass');
        },
        s;

    beforeEach(function () {
        s = sinon.sandbox.create();
        spyOn(_console, "log");
    });

    afterEach(function () {
        s.verifyAndRestore();
    });

    describe("in server", function () {
        it("exposes the sms module", function () {
            var webworks = require('ripple/platform/webworks.handset/2.0.0/server');
            expect(webworks.blackberry.message.sms).toEqual(sms);
        });
    });

    describe("in spec", function () {
        it("includes sms module according to proper object structure", function () {
            var spec = require('ripple/platform/webworks.handset/2.0.0/spec');
            expect(spec.objects.blackberry.children.message.children.sms.path)
                .toEqual("webworks.handset/2.0.0/client/sms");
        });
    });

    describe("client", function () {
        describe("send", function () {
            it("calls the transport appropriately", function () {
                spyOn(transport, "call");
                smsClient.send("msg", "addr");
                expect(transport.call).toHaveBeenCalledWith("blackberry/message/sms/send", {
                    get: {
                        message: "msg",
                        address: "addr"
                    },
                    async: true
                });
            });
        });

        describe("addReceiveListener", function () {
            it("polls the transport appropriately", function () {
                var callback = function () {};
                spyOn(transport, "poll");
                smsClient.addReceiveListener(callback);
                expect(transport.poll.argsForCall[0][0]).toEqual("blackberry/message/sms/onReceive");
            });
        });
    });

    describe("in server/sms", function () {
        it("send raises a notification", function () {
            spyOn(platform, "current").andReturn({name: "generic"});
            s.mock(notifications).expects("openNotification")
                    .withExactArgs(constants.NOTIFICATIONS.TYPES.NORMAL,
                                   "To 5199541707: Pick up some milk").once();
            sms.send({
                message: "Pick up some milk",
                address: "5199541707"
            });
        });

        describe("when calling onSMS", function () {
            it("takes the baton", function () {
                var baton = new MockBaton();
                sms.onReceive({}, {}, baton);
                expect(baton.take).toHaveBeenCalled();
            });

            it("passes the baton when MessageReceived is raised", function () {
                var baton = new MockBaton();
                sms.onReceive({}, {}, baton);
                event.trigger("MessageReceived", [{
                    type: "sms",
                    time: new Date(),
                    from: "Inigo Montoya",
                    body: "You keep using that word. I do not think it means what you think it means."
                }], true);
                expect(baton.pass).toHaveBeenCalled();
            });

            it("only passes the baton once", function () {
                var baton = new MockBaton();
                sms.onReceive({}, {}, baton);
                event.trigger("MessageReceived", [{
                    type: "sms",
                    time: new Date(),
                    from: "Westley",
                    body: "AAARRRRRRRHHHHHHHAGGGGGGGGAAAA!!!!"
                }], true);
                event.trigger("MessageReceived", [{
                    type: "sms",
                    time: new Date(),
                    from: "Inigo Montoya",
                    body: "Do you hear that Fezzik? That is the sound of ultimate suffering. My heart made that sound when the six-fingered man killed my father. The Man in Black makes it now."
                }], true);
                expect(baton.pass.callCount).toBe(1);
            });

            it("it doesn't pass the baton if the message type isn't sms", function () {
                var baton = new MockBaton();
                sms.onReceive({}, {}, baton);
                event.trigger("MessageReceived", [{
                    type: "email",
                    time: new Date(),
                    from: "Your Mom",
                    subject: "I love you",
                    body: "ILOVEYOULETTER.txt.vbs"
                }], true);
                expect(baton.pass).not.toHaveBeenCalled();
            });
        });
    });
});
