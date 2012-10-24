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
describe("webworks audio.Player", function () {
    var player = require('ripple/client/platform/webworks.handset/2.0.0/server/audioPlayer'),
        Player = require('ripple/client/platform/webworks.handset/2.0.0/client/AudioPlayer'),
        transport = require('ripple/client/platform/webworks.core/2.0.0/client/transport'),
        utils = require('ripple/client/utils'),
        MockBaton = function () {
            this.take = jasmine.createSpy("baton.take");
            this.pass = jasmine.createSpy("baton.pass");
        },
        notifications = require('ripple/client/notifications'),
        _createElement = utils.createElement,
        _emulatedError;

    beforeEach(function () {
        _emulatedError = undefined;
        document.getElementById("webworks-audio-players").innerHtml = "";

        spyOn(utils, "createElement").andCallFake(function (type, args) {
            var audioNode = _createElement.apply(utils, ["div", args]);
            audioNode.canPlayType = function () {
                return "probably";
            };

            // think jsdom does not have special methods like play on audio
            audioNode.play = jasmine.createSpy();
            audioNode.pause = jasmine.createSpy();
            audioNode.stop = jasmine.createSpy();
            audioNode.load = jasmine.createSpy();

            audioNode.error = _emulatedError;

            return audioNode;
        });
    });

    describe("in spec", function () {
        it("includes module in correct spot", function () {
            var webworks = require('ripple/client/platform/webworks.handset/2.0.0/server');
            expect(webworks.blackberry.audio.player).toBe(player);
        });
    });

    describe("client", function () {
        var id = "uid",
            data = "data";

        beforeEach(function () {
            spyOn(transport, "call").andCallFake(function (uri) {
                return uri.match(/\/create$/) ? id : data;
            });
        });

        describe("create", function () {
            it("calls the transport with id and properties", function () {
                new Player("locator", "type", true);
                expect(transport.call).toHaveBeenCalledWith("blackberry/audio/player/create", {
                    get: {
                        locator: "locator",
                        type: "type",
                    },
                    async: false
                });
            });
        });

        describe("close", function () {
            it("calls the transport appropriately", function () {
                expect(new Player().close()).toEqual("data");
                expect(transport.call.argsForCall[1]).toEqual(["blackberry/audio/player/close", {
                    get: {id: "uid"}
                }]);
            });
        });

        describe("pause", function () {
            it("calls the transport appropriately", function () {
                expect(new Player().pause()).toEqual("data");
                expect(transport.call.argsForCall[1]).toEqual(["blackberry/audio/player/pause", {
                    get: {id: "uid"}
                }]);
            });
        });

        describe("play", function () {
            it("calls the transport appropriately", function () {
                expect(new Player().play()).toEqual("data");
                expect(transport.call.argsForCall[1]).toEqual(["blackberry/audio/player/play", {
                    get: {id: "uid"}
                }]);
            });
        });

        describe("duration", function () {
            it("calls the transport appropriately", function () {
                expect(new Player().duration).toEqual("data");
                expect(transport.call.argsForCall[1]).toEqual(["blackberry/audio/player/getDuration", {
                    get: {id: "uid"}
                }]);
            });
        });

        describe("state", function () {
            it("calls the transport appropriately", function () {
                expect(new Player().state).toEqual("data");
                expect(transport.call.argsForCall[1]).toEqual(["blackberry/audio/player/getState", {
                    get: {id: "uid"}
                }]);
            });
        });

        describe("mediaTime", function () {
            it("calls the transport appropriately for the getter", function () {
                expect(new Player().mediaTime).toEqual("data");
                expect(transport.call.argsForCall[1]).toEqual(["blackberry/audio/player/getMediaTime", {
                    get: {id: "uid"}
                }]);
            });

            it("calls the transport appropriately for the setter", function () {
                var p = new Player();
                p.mediaTime = "test";

                expect(transport.call.argsForCall[1]).toEqual(["blackberry/audio/player/setMediaTime", {
                    get: {
                        id: "uid",
                        value: "test",
                    }
                }]);
            });
        });

        describe("volumeLevel", function () {
            it("calls the transport appropriately for the getter", function () {
                expect(new Player().volumeLevel).toEqual("data");
                expect(transport.call.argsForCall[1]).toEqual(["blackberry/audio/player/getVolumeLevel", {
                    get: {id: "uid"}
                }]);
            });

            it("calls the transport appropriately for the setter", function () {
                var p = new Player();
                p.volumeLevel = "3";

                expect(transport.call.argsForCall[1]).toEqual(["blackberry/audio/player/setVolumeLevel", {
                    get: {
                        id: "uid",
                        value: "3",
                    }
                }]);
            });
        });

        describe("addPlayerListener", function () {
            it("polls for audio player events", function () {
                var events = [
                        "onStart", "onStopped", "onBufferingStarted", "onBufferingStopped",
                        "onDurationUpdated", "onEnd", "onError", "onVolumeChange", "onClose"
                    ];

                spyOn(transport, "poll");

                expect(transport.poll.argsForCall.reduce(function (hasAllEvents, args) {
                    return events.some(function (name) {
                        return args[0] === "blackberry/audio/player/" + name;
                    }) ? hasAllEvents : false;
                }, true)).toEqual(true);
            });
        });
    });

    describe("when creating", function () {
        it("returns us back an id", function () {
            spyOn(Math, "uuid").andReturn("1");
            expect(player.create({locator: "asdf"}).data).toBe("1");
        });

        it("creates an audio tag", function () {
            var id = player.create({locator: "asdf"}).data;
            expect(document.getElementById(id)).not.toBeNull();
        });

        it("assigns the src of the audio tag", function () {
            var id = player.create({locator: "foo"}).data;
            expect(document.getElementById(id).getAttribute("src")).toBe("foo");
        });

        it("assigns the type of the audio tag", function () {
            var id = player.create({locator: "foo", type: "audio/ogg"}).data;
            expect(document.getElementById(id).getAttribute("type")).toBe("audio/ogg");
        });

        it("calls load on the audio tag", function () {
            var id = player.create({locator: "foo"}).data;
            expect(document.getElementById(id).load).toHaveBeenCalled();
        });

        it("throws an exception if there is an error on the audio tag", function () {
            _emulatedError = {code: 4};
            expect(function () {
                player.create({locator: "asdf"});
            }).toThrow();
        });
    });

    describe("when playing", function () {
        it("calls play on audio tag", function () {
            var id = player.create({locator: "foo"}).data;
            expect(player.play({id: id}).data).toBe(true);
            expect(document.getElementById(id).play).toHaveBeenCalled();
        });

        it("returns false if there is an error on the audio tag", function () {
            var id = player.create({locator: "foo"}).data,
                node = document.getElementById(id);

            node.error = {code: 4};
            expect(player.play({id: id}).data).not.toBe(true);
        });
    });

    describe("when pausing", function () {
        it("calls pause on audio tag", function () {
            var id = player.create({locator: "foo"}).data;
            expect(player.pause({id: id}).data).toBe(true);
            expect(document.getElementById(id).pause).toHaveBeenCalled();
        });

        it("returns false if there is an error on the audio tag", function () {
            var id = player.create({locator: "foo"}).data,
                node = document.getElementById(id);

            node.error = {code: 4};
            expect(player.pause({id: id}).data).not.toBe(true);
        });
    });

    describe("when listening for events", function () {
        var id,
            node,
            baton;

        function takeBaton(method) {
            return function () {
                var baton = new MockBaton(),
                    id = player.create({location: "aa"}).data;

                player[method]({id: id}, null, baton);
                expect(baton.take).toHaveBeenCalled();
            };
        }

        function raise(event) {
            var evt = document.createEvent('Events');
            evt.initEvent(event, true, true);
            node.dispatchEvent(evt);
        }

        function passOnce(method, event) {
            return function () {
                player[method]({id: id}, null, baton);
                var fire = function () {
                    raise(event);
                };

                runs(fire);
                runs(fire);
                waits(1);
                runs(function () {
                    expect(baton.pass.callCount).toBe(1);
                });
            };
        }

        function noPlayer(method) {
            return function () {
                it("doesn't pass the baton", function () {
                    player[method]({id: "asdf"}, null, baton);
                    expect(baton.pass).not.toHaveBeenCalled();
                });

                it("returns an error event", function () {
                    var result = player[method]({id: "asdf"}, null, baton);
                    expect(result.code).toBe(-1);
                    expect(result.data.event).toBe("EVENT_ERROR");
                    expect(result.data.eventData).toBe(5);
                });
            };
        }

        function pass(method, event, expected) {
            return function () {
                player[method]({id: id}, null, baton);
                raise(event);
                waits(1);
                runs(function () {
                    expect(baton.pass).toHaveBeenCalledWith({
                        code: 1,
                        data: expected
                    });
                });
            };
        }

        beforeEach(function () {
            id = player.create({locator: "foo"}).data;
            baton = new MockBaton();

            node = document.getElementById(id);
            node.currentTime = 4567;
            node.duration = 1234;
            node.error = "WTF";
        });

        describe("when calling onStart", function () {
            it("takes the baton", takeBaton("onStart"));
            it("only passes the baton once", passOnce("onStart", "play"));
            describe("when it can't find the player", noPlayer("onStart"));

            it("generates the correct data from the dom event", pass("onStart", "play", {
                event: "EVENT_START",
                eventData: 4567
            }));
        });

        describe("when calling onStopped", function () {
            it("takes the baton", takeBaton("onStopped"));
            it("only passes the baton once", passOnce("onStopped", "pause"));
            describe("when it can't find the player", noPlayer("onStopped"));

            it("generates the correct data from the dom event", pass("onStopped", "pause", {
                event: "EVENT_STOPPED",
                eventData: 4567
            }));
        });

        describe("when calling onBufferingStarted", function () {
            it("takes the baton", takeBaton("onBufferingStarted"));
            it("only passes the baton once", passOnce("onBufferingStarted", "loadstart"));
            describe("when it can't find the player", noPlayer("onBufferingStarted"));

            it("generates the correct data from the dom event", pass("onBufferingStarted", "loadstart", {
                event: "EVENT_BUFFERING_STARTED",
                eventData: 4567
            }));
        });

        describe("when calling onBufferingStopped", function () {
            it("takes the baton", takeBaton("onBufferingStopped"));
            it("only passes the baton once", passOnce("onBufferingStopped", "canplaythrough"));
            describe("when it can't find the player", noPlayer("onBufferingStopped"));

            it("generates the correct data from the dom event", pass("onBufferingStopped", "canplaythrough", {
                event: "EVENT_BUFFERING_STOPPED",
                eventData: 4567
            }));
        });

        describe("when calling onDurationUpdated", function () {
            it("takes the baton", takeBaton("onDurationUpdated"));
            it("only passes the baton once", passOnce("onDurationUpdated", "durationchange"));
            describe("when it can't find the player", noPlayer("onDurationUpdated"));

            it("generates the correct data from the dom event", pass("onDurationUpdated", "durationchange", {
                event: "EVENT_DURATION_UPDATED",
                eventData: 1234
            }));
        });

        describe("when calling onEnd", function () {
            it("takes the baton", takeBaton("onEnd"));
            it("only passes the baton once", passOnce("onEnd", "ended"));
            describe("when it can't find the player", noPlayer("onEnd"));

            it("generates the correct data from the dom event", pass("onEnd", "ended", {
                event: "EVENT_END_OF_MEDIA",
                eventData: 1234
            }));
        });

        describe("when calling onError", function () {
            it("takes the baton", takeBaton("onError"));
            it("only passes the baton once", passOnce("onError", "error"));
            describe("when it can't find the player", noPlayer("onError"));

            it("generates the correct data from the dom event", pass("onError", "error", {
                event: "EVENT_ERROR",
                eventData: "WTF"
            }));
        });

        describe("when calling onVolumeChange", function () {
            it("takes the baton", takeBaton("onVolumeChange"));
            it("only passes the baton once", passOnce("onVolumeChange", "volumechange"));
            describe("when it can't find the player", noPlayer("onVolumeChange"));

            it("generates the correct data from the dom event", pass("onVolumeChange", "volumechange", {
                event: "EVENT_VOLUME_CHANGED",
                eventData: null
            }));
        });

        describe("when calling onClose", function () {
            it("takes the baton", takeBaton("onClose"));
            describe("when it can't find the player", noPlayer("onClose"));

            it("raises the event when close is called", function () {
                player.onClose({id: id}, null, baton);
                player.close({id: id});
                expect(baton.pass).toHaveBeenCalledWith({
                    code: 1,
                    data: {
                        event: "EVENT_CLOSED",
                        eventData: null
                    }
                });

            });

            it("only passes the baton once", function () {
                player.onClose({id: id}, null, baton);
                player.close({id: id});
                player.close({id: id});
                expect(baton.pass.callCount).toBe(1);
            });

        });
    });

    it("can get the duration", function () {
        var id = player.create({location: "aa"}).data,
            node = document.getElementById(id);

        node.duration = 500;
        expect(player.getDuration({id: id}).data).toBe(500);
    });

    it("can get the mediaTime", function () {
        var id = player.create({location: "aa"}).data,
            node = document.getElementById(id);

        node.currentTime = 500;
        expect(player.getMediaTime({id: id}).data).toBe(500);
    });

    it("can set the mediaTime", function () {
        var id = player.create({location: "aa"}).data,
            node = document.getElementById(id);

        node.currentTime = 500;
        player.setMediaTime({id: id, value: 1000});
        expect(node.currentTime).toBe(1000);
    });

    it("can get the volumeLevel", function () {
        var id = player.create({location: "aa"}).data,
            node = document.getElementById(id);

        node.volume = 0.5;
        expect(player.getVolumeLevel({id: id}).data).toBe(50);
    });

    it("can set the volumeLevel", function () {
        var id = player.create({location: "aa"}).data,
            node = document.getElementById(id);

        node.volume = 0.5;
        player.setVolumeLevel({id: id, value: 80});
        expect(node.volume).toBe(0.8);
    });

    describe("when getting the state", function () {
        it("sets the state to prefetched to start", function () {
            var id = player.create({location: "aa"}).data;
            expect(player.getState({id: id}).data).toBe(Player.PREFETCHED);
        });

        it("sets the state to STARTED when play is called", function () {
            var id = player.create({location: "aa"}).data;
            player.play({id: id});
            expect(player.getState({id: id}).data).toBe(Player.STARTED);
        });

        it("keeps the state to STARTED when pause is called", function () {
            var id = player.create({location: "aa"}).data;
            player.play({id: id});
            player.pause({id: id});
            expect(player.getState({id: id}).data).toBe(Player.STARTED);
        });

        it("sets the state to CLOSED when close is called", function () {
            var id = player.create({location: "aa"}).data;
            player.close({id: id});
            expect(player.getState({id: id}).data).toBe(Player.CLOSED);
        });
    });

    describe("when closing", function () {
        it("removes the dom element(which is an element in the dom) from the dom", function () {
            var id = player.create({location: "asdf"}).data;
            player.close({id: id});
            expect(document.getElementById(id)).toBe(null);
        });

        it("returns true the first time, false the second time", function () {
            var id = player.create({location: "asdf"}).data;
            expect(player.close({id: id}).data).toBe(true);
            expect(player.close({id: id}).data).toBe(false);
        });

        it("raises a notification when you attempt to use a player after it is closed", function () {
            spyOn(notifications, "openNotification");
            var id = player.create({location: "asdf"}).data;
            expect(player.close({id: id}).data).toBe(true);
            expect(player.play({id: id}).data).toBe(false);
            expect(player.pause({id: id}).data).toBe(false);
            expect(player.close({id: id}).data).toBe(false);
            expect(player.getDuration({id: id}).data).toBe(-1);
            expect(player.getMediaTime({id: id}).data).toBe(-1);
            player.setMediaTime({id: id});
            expect(player.getVolumeLevel({id: id}).data).toBe(-1);
            player.setVolumeLevel({id: id});

            expect(notifications.openNotification).toHaveBeenCalled();
            expect(notifications.openNotification.callCount).toBe(8);
        });
    });
});
