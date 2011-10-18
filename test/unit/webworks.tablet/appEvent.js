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
describe("webworks_appEvent", function () {
    var appEvent = require('ripple/platform/webworks.tablet/2.0.0/server/appEvent'),
        client = require('ripple/platform/webworks.tablet/2.0.0/client/appEvent'),
        transport = require('ripple/platform/webworks.core/2.0.0/client/transport'),
        event = require('ripple/event'),
        MockBaton = function () {
            this.take = jasmine.createSpy('baton.take');
            this.pass = jasmine.createSpy('baton.pass');
        };

    describe("client", function () {
        // TODO: test the callback logic in polling
        describe("onBackground", function () {
            it("polls the transport appropriately", function () {
                spyOn(transport, "poll");
                client.onBackground(null);
                expect(transport.poll.argsForCall[0][0]).toEqual("blackberry/app/event/onBackground");
                expect(transport.poll.argsForCall[0][1]).toEqual({});
                expect(typeof transport.poll.argsForCall[0][2]).toEqual("function"); // could tighten...
            });
        });

        describe("onForeground", function () {
            it("polls the transport appropriately", function () {
                spyOn(transport, "poll");
                client.onForeground(null);
                expect(transport.poll.argsForCall[0][0]).toEqual("blackberry/app/event/onForeground");
                expect(transport.poll.argsForCall[0][1]).toEqual({});
                expect(typeof transport.poll.argsForCall[0][2]).toEqual("function"); // could tighten...
            });
        });

        describe("onSwipeStart", function () {
            it("polls the transport appropriately", function () {
                spyOn(transport, "poll");
                client.onSwipeStart(null);
                expect(transport.poll.argsForCall[0][0]).toEqual("blackberry/app/event/onSwipeStart");
                expect(transport.poll.argsForCall[0][1]).toEqual({});
                expect(typeof transport.poll.argsForCall[0][2]).toEqual("function"); // could tighten...
            });
        });

        describe("onSwipeDown", function () {
            it("polls the transport appropriately", function () {
                spyOn(transport, "poll");
                client.onSwipeDown(null);
                expect(transport.poll.argsForCall[0][0]).toEqual("blackberry/app/event/onSwipeDown");
                expect(transport.poll.argsForCall[0][1]).toEqual({});
                expect(typeof transport.poll.argsForCall[0][2]).toEqual("function"); // could tighten...
            });
        });

    });

    describe("onBackground", function () {
        it("takes the baton", function () {
            var baton = new MockBaton();

            appEvent.onBackground({}, {}, baton);
            expect(baton.take).toHaveBeenCalled();
        });
    });

    describe("onForeground", function () {
        it("takes the baton", function () {
            var baton = new MockBaton();

            appEvent.onForeground({}, {}, baton);
            expect(baton.take).toHaveBeenCalled();
        });
    });

    describe("onSwipeDown", function () {
        it("takes the baton", function () {
            var baton = new MockBaton();

            appEvent.onSwipeDown({}, {}, baton);
            expect(baton.take).toHaveBeenCalled();
        });
    });

    describe("onSwipeStart", function () {
        it("takes the baton", function () {
            var baton = new MockBaton();

            appEvent.onSwipeStart({}, {}, baton);
            expect(baton.take).toHaveBeenCalled();
        });
    });

    describe("the correct baton is passed when", function () {
        it("raises AppRequestBackground", function () {
            var bg = new MockBaton(),
                fg = new MockBaton(),
                sd = new MockBaton(),
                ss = new MockBaton();

            appEvent.onBackground({}, {}, bg);
            appEvent.onForeground({}, {}, fg);
            appEvent.onSwipeDown({}, {}, sd);
            appEvent.onSwipeStart({}, {}, ss);

            event.trigger("AppRequestBackground", [], true);
            expect(bg.pass).toHaveBeenCalled();
            expect(fg.pass).not.toHaveBeenCalled();
        });

        it("raises AppRequestForeground", function () {
            var bg = new MockBaton(),
                fg = new MockBaton(),
                sd = new MockBaton(),
                ss = new MockBaton();

            appEvent.onBackground({}, {}, bg);
            appEvent.onForeground({}, {}, fg);
            appEvent.onSwipeDown({}, {}, sd);
            appEvent.onSwipeStart({}, {}, ss);

            event.trigger("AppRequestForeground", [], true);
            expect(bg.pass).not.toHaveBeenCalled();
            expect(fg.pass).toHaveBeenCalled();
        });
    });

    it("only passes the baton once", function () {
        var baton = new MockBaton();

        appEvent.onBackground({}, {}, baton);

        event.trigger("AppRequestBackground", [], true);
        event.trigger("AppRequestBackground", [], true);

        expect(baton.pass.callCount).toBe(1);
    });
});
