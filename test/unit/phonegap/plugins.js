describe("phonegap_plugins", function () {
    var s,
        _pluginDB = [],
        sinon = require('sinon'),
        db = require('ripple/db'),
        Plugin = require('ripple/platform/phonegap/1.0/Plugin'),
        plugins = require('ripple/platform/phonegap/1.0/plugins');

    function _propertyCount(obj) {
        var prop, count = 0;
        for (prop in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, prop)) {
                count++;
            }
        }
        return count;
    }

    beforeEach(function () {
        s = sinon.sandbox.create();
        spyOn(db, "retrieveObject").andReturn(_pluginDB);
    });

    afterEach(function () {
        s.verifyAndRestore();
        _pluginDB.splice(0, _pluginDB.length);
    });

    describe("spec", function () {
        var spec = require('ripple/platform/phonegap/1.0/spec');

        it("includes Plugin module according to proper object structure", function () {
            expect(spec.objects.Plugin.path)
                .toEqual("phonegap/1.0/Plugin");
        });

    });

    it("can create a plugin", function () {
        var obj = {
                name: "Weather",
                action: "get",
                result: '{"tokyo":"sunny","sapporo":"cloudy"}'
            },
            plugin;

        plugin = plugins.create(obj);

        expect(plugin.name).toEqual(obj.name);
        expect(plugin.action).toEqual(obj.action);
        expect(JSON.stringify(plugin.result)).toEqual(obj.result);
    });

    describe("find and findAll", function () {
        it("calls error callback when no plugin fields given", function () {
            waits(1);
            plugins.find(null, function () {}, function (error) {
                expect(typeof error).toEqual("string");
                expect(error).toEqual("could not find plugin named (null)");
            });
        });

        it("calls error callback when given empty plugin fields array", function () {
            waits(1);
            plugins.find([], function () {}, function (error) {
                expect(typeof error).toEqual("string");
                expect(error).toEqual("could not find plugin named ()");
            });
        });

        it("only return plugin when no success callback given", function () {
            waits(1);
            plugin = plugins.find("Weather", undefined, function () {});
            expect(typeof plugin).toEqual("object");
        });

        it("returns object in success callback", function () {
            waits(1);
            plugins.find("Weather", function (items) {
                expect(typeof items).toEqual("object");
            });
        });

        it("returns array of plugins", function () {
            var data = [new Plugin(), new Plugin()];
            data[0].name = "HogePlugin";
            data[1].name = "FubaPlugin";

            _pluginDB.splice.apply(_pluginDB, [0, data.length].concat(data));

            waits(1);
            var _plugins = plugins.findAll();
            expect(_plugins.length).toEqual(2);
            expect(_plugins[0].name).toEqual("HogePlugin");
            expect(_plugins[1].name).toEqual("FubaPlugin");
        });

        it("return empty array", function () {
            var _plugins = plugins.findAll();
            expect(_plugins.length).toEqual(0);
        });

        it("return added array", function () {
            var data = [new Plugin(), new Plugin()];
            data[0].name = "HogePlugin";
            data[1].name = "FubaPlugin";

            _pluginDB.splice.apply(_pluginDB, [0, data.length].concat(data));

            waits(1);
            var _plugins = plugins.findAll();
            expect(_plugins.length).toEqual(2);
        });
    });

    describe("save", function () {
        it("can save itself", function () {
            var plugin = plugins.create({"name": "Weather"});

            // hmm, not 100% assertive
            s.mock(db)
                .expects("saveObject").once()
                .withArgs("phonegap-plugins");

            _pluginDB.splice.apply(_pluginDB, [0, 1]);

            waits(1);
            plugin.save(function (item) {
                expect(typeof item.name).toEqual("string");
            });
        });

        it("updates an existing plugin if a plugin with the same id already exists", function () {
            var plugin = plugins.create({
                "name": "Weather",
                "action": "hoge"
            });

            s.mock(db)
                .expects("saveObject").once()
                .withArgs("phonegap-plugins", [plugin]);

            _pluginDB.splice.apply(_pluginDB, [0, 1, plugin]);

            waits(1);
            plugin["action"] = "fuba";
            plugin.save(function (items) {
                expect(items.action).toEqual("fuba");
                expect(items.name).toEqual(plugin.name);
            }, s.mock().never());
        });
    });

    describe("remove and removeAll", function () {
        it("can remove itself", function () {
            var plugin = plugins.create({"name": "hoge"});

            s.mock(db)
                .expects("saveObject").once()
                .withArgs("phonegap-plugins", []);

            _pluginDB.splice.apply(_pluginDB, [0, 1, plugin]);

            waits(1);
            plugin.remove(function (items) {
                expect(items.length).toEqual(0);
            }, s.mock().never());
        });

        it("can remove all plugins", function () {
            var data = [new Plugin(), new Plugin()];
            data[0].name = "HogePlugin";
            data[1].name = "FubaPlugin";

            _pluginDB.splice.apply(_pluginDB, [0, data.length].concat(data));

            waits(1);
            plugins.removeAll();
            _plugins = plugins.findAll();
            expect(_plugins.length).toEqual(0);
        });
    });

    describe("exec", function () {
        it("can return result json", function () {
            var plugin = plugins.create({"name": "hoge", "action":"get", "result": {"data":1}});

            plugin.exec(plugin.action, plugin.args, function (result) {
                expect(result.data).toEqual(1);
            });
        });

        it("calls error callback when action is not same", function () {
            var plugin = plugins.create({"name": "hoge", "action":"get", "result": {"data":1}});

            plugin.exec('', plugin.args, function () {}, function (error) {
                expect(error).toEqual("could not exec phonegap plugin with (,)");
            });
        });
    });
});
