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
describe("event", function () {
    var event = ripple('event');

    describe("the on method", function () {
        afterEach(function () {
            event.clear("test on");
        });

        it("registers an event", function () {
            event.on("test on", function () {});
            expect(event.eventHasSubscriber("test on")).toEqual(true);
        });

        it("should throw an exception if registering for something falsy", function () {
            expect(function () {
                event.on(null, function () {});
            }).toThrow();
        });
    });

    describe("the eventHasSubscriber method", function () {
        it("returns false when nothing subscribed to event", function () {
            expect(event.eventHasSubscriber("another test event blargen")).toEqual(false);
        });
    });

    describe("getEventSubscribers", function () {
        afterEach(function () {
            event.clear("test get");
        });

        it("should return a list of all subscribers", function () {
            event.on("test get", function () {});
            event.on("test get", function () {});
            event.on("test get", function () {});
            var subscribers = event.getEventSubscribers("test get");
            expect(subscribers.length).toEqual(3);
        });

        it("should return a copy of the method", function () {
            var subscribers,
                subscribers_2,
                func1 = jasmine.createSpy(),
                func2 = jasmine.createSpy(),
                func3 = jasmine.createSpy();

            event.on("test get", func1);
            event.on("test get", func2);
            event.on("test get", func3);

            subscribers = event.getEventSubscribers("test get");

            subscribers[0] = null;
            subscribers[1] = null;
            subscribers[2] = null;

            subscribers_2 = event.getEventSubscribers("test get");

            expect(subscribers[0]).not.toEqual(subscribers_2[0]);
            expect(subscribers[1]).not.toEqual(subscribers_2[1]);
            expect(subscribers[2]).not.toEqual(subscribers_2[2]);
        });
    });

    describe("trigger", function () {
        afterEach(function () {
            event.clear("test trigger");
        });

        it("can call the listener sync", function () {
            var spy = jasmine.createSpy();
            event.on("test trigger", spy);
            event.trigger("test trigger", [], true);
            expect(spy).toHaveBeenCalled();
        });

        it("can call the listener async", function () {
            var spy = jasmine.createSpy();
            event.on("test trigger", spy);
            event.trigger("test trigger", [], false);
            expect(spy).not.toHaveBeenCalled();
            waits(1);
            runs(function () {
                expect(spy).toHaveBeenCalled();
            });
        });

        it("passes the arguments", function () {
            var spy = jasmine.createSpy();
            event.on("test trigger", spy);
            event.trigger("test trigger", ["larry", "curly", "moe"], true);
            expect(spy).toHaveBeenCalledWith("larry", "curly", "moe");
        });

        it("sets the scope for the listener", function () {
            var kittens = {};
            event.on("test trigger", function () {
                expect(this).toBe(kittens);
            }, kittens);
            event.trigger("test trigger", [], true);
        });

        it("should call the listener async by default", function () {
            var spy = jasmine.createSpy();
            event.on("test trigger", spy);
            event.trigger("test trigger");
            expect(spy).not.toHaveBeenCalled();
            waits(1);
            runs(function () {
                expect(spy).toHaveBeenCalled();
            });
        });
    });

    describe("clear", function () {
        afterEach(function () {
            event.clear("test clear");
        });

        it("removes all subscribers for an event type", function () {
            var spy = jasmine.createSpy();
            event.on("test clear", spy);

            event.clear("test clear");
            event.trigger("test clear", null, true);

            expect(spy).not.toHaveBeenCalled();
        });

        it("clear with no params removes no subscribers", function () {
            var spy = jasmine.createSpy();

            event.on("test clear", spy);
            event.clear();
            event.trigger("test clear", null, true);

            expect(spy).toHaveBeenCalled();
        });
    });

    describe("once", function () {
        afterEach(function () {
            event.clear("test once");
        });

        it("test once only gets triggered once", function () {
            var func = jasmine.createSpy();
            event.once("test once", func);
            event.trigger("test once");
            event.trigger("test once");
            waits(1);
            runs(function () {
                expect(func.callCount).toEqual(1);
            });
        });
    });
});
