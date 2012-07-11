describe("phonegap events", function () {
    var spec = require('ripple/platform/phonegap/1.0.0/spec'),
        emulatorBridge = require('ripple/emulatorBridge'),
        events = spec.events;

    function _expectsEventToFire(name) {
        var evt = {initEvent: jasmine.createSpy()};

        spyOn(emulatorBridge, "document").andReturn(document);
        spyOn(document, "createEvent").andReturn(evt);
        spyOn(document, "dispatchEvent");

        events[name].callback();

        expect(document.createEvent).toHaveBeenCalledWith("Events");
        expect(evt.initEvent).toHaveBeenCalledWith(name, true, false);
        expect(document.dispatchEvent).toHaveBeenCalledWith(evt);
    }

    describe("spec/ui", function () {
        it("includes the platformEvents ui plugin", function () {
            expect(spec.ui.plugins.some(function (plugin) {
                return plugin === "platformEvents";
            })).toBe(true);
        });
    });

    describe("deviceready", function () {
        it("fires respective event off the document", function () {
            _expectsEventToFire("deviceready");
        });
    });

    describe("backbutton", function () {
        it("fires respective event off the document", function () {
            _expectsEventToFire("backbutton");
        });
    });

    describe("menubutton", function () {
        it("fires respective event off the document", function () {
            _expectsEventToFire("menubutton");
        });
    });

    describe("pause", function () {
        it("fires respective event off the document", function () {
            _expectsEventToFire("pause");
        });
    });

    describe("resume", function () {
        it("fires respective event off the document", function () {
            _expectsEventToFire("resume");
        });
    });

    describe("searchbutton", function () {
        it("fires respective event off the document", function () {
            _expectsEventToFire("searchbutton");
        });
    });

    describe("online", function () {
        it("fires respective event off the document", function () {
            _expectsEventToFire("online");
        });
    });

    describe("offline", function () {
        it("fires respective event off the document", function () {
            _expectsEventToFire("offline");
        });
    });
});
