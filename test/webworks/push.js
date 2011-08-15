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
describe("webworks push", function () {
    var push = require('ripple/platform/webworks.handset/2.0.0/server/push'),
        client = require('ripple/platform/webworks.handset/2.0.0/client/push'),
        transport = require('ripple/platform/webworks.core/2.0.0/client/transport'),
        PushData = require('ripple/platform/webworks.handset/2.0.0/client/PushData'),
        event = require('ripple/event'),
        MockBaton = function () {
            this.take = jasmine.createSpy("baton.take");
            this.pass = jasmine.createSpy("baton.pass");
        },
        dataActual = {
            headerField: ["21f39092"],
            requestURI: "/",
            source: "ripple",
            isChannelEncrypted: false,
            payload: "My payload"
        };

    describe("using server", function () {
        it("exposes the push module", function () {
            var webworks = require('ripple/platform/webworks.handset/2.0.0/server');
            expect(webworks.blackberry.push).toEqual(push);
        });
    });

    describe("in spec", function () {
        it("includes push module according to proper object structure", function () {
            var spec = require('ripple/platform/webworks.handset/2.0.0/spec');
            expect(spec.objects.blackberry.children.push.path)
                .toEqual("webworks.handset/2.0.0/client/push");
        });
    });

    describe("client", function () {
        describe("onPushListener", function () {
            it("polls the transport appropriately", function () {
                spyOn(transport, "poll");
                client.openPushListener(null, 2, "bb transport", "max queue cap");
                expect(transport.poll.argsForCall[0][0]).toEqual("blackberry/push/onPush");
                expect(transport.poll.argsForCall[0][1]).toEqual({
                    get: {
                        port: 2,
                        bbTransport: "bb transport",
                        maxQueueCap: "max queue cap"
                    }
                });
                expect(typeof transport.poll.argsForCall[0][2]).toEqual("function");
            });
            // TODO: test the callback logic
        });
    });

    describe("when calling onPush", function () {
        it("takes the baton", function () {
            var baton = new MockBaton();
            push.onPush({port: 123}, null, baton);
            expect(baton.take).toHaveBeenCalled();
        });

        it("throws an exception if no port provided", function () {
            expect(push.onPush).toThrow();
        });

        it("throws an exception if an invalid port is specified", function () {
            expect(function () {
                push.onPush({port: "abc"}, null, new MockBaton());
            }).toThrow();

        });

        it("passes the baton when the Push event is raised", function () {
            var baton = new MockBaton();
            push.onPush({port: 123}, null, baton);
            event.trigger("Push", [dataActual, 123], true);
            expect(baton.pass).toHaveBeenCalled();
        });

        it("only passes the baton once", function () {
            var baton = new MockBaton();
            push.onPush({port: 123}, null, baton);

            event.trigger("Push", [dataActual, 123], true);
            event.trigger("Push", [dataActual, 123], true);

            expect(baton.pass.callCount).toBe(1);
        });
    });

    describe("using push.data", function () {

        describe("getHeaderField", function () {
            it("returns the value of the header field", function () {
                var data = new PushData(dataActual, 123);
                expect(data.getHeaderField(0)).toBe(dataActual.headerField[0]);
            });
        });

        describe("getRequestURI", function () {
            it("returns the value of the request URI", function () {
                var data = new PushData(dataActual, 123);
                expect(data.getRequestURI()).toBe(dataActual.requestURI);
            });
        });

        describe("getSource", function () {
            it("returns the value of the source field", function () {
                var data = new PushData(dataActual, 123);
                expect(data.getSource()).toBe(dataActual.source);
            });
        });

        describe("isChannelEncrypted", function () {
            it("returns the value of the isChannelEncrypted field", function () {
                var data = new PushData(dataActual, 123);
                expect(data.isChannelEncrypted).toBe(dataActual.isChannelEncrypted);
            });
        });

        describe("payload", function () {
            it("returns the value of the payload field", function () {
                var data = new PushData(dataActual, 123);
                expect(data.payload).toBe(dataActual.payload);
            });
        });
    });
});
