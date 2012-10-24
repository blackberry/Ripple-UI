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
describe("ui", function () {
    var ui = require('ripple/client/ui'),
        db = require('ripple/client/db'),
        themes = require('ripple/client/ui/themes'),
        utils = require('ripple/client/utils'),
        platform = require('ripple/client/platform');

    function _plugin(name) {
        return 'ripple/client/ui/plugins/' + name;
    }

    it("initializes core ui plugin modules", function () {
        var plugins = ui.getSystemPlugins(),
            platformPlugins = [ // picked random
                "accelerometer",
                "geoView"
            ],
            jWorkflow_order = jWorkflow.order;

        spyOn(jWorkflow, "order").andCallFake(function () {
            return jWorkflow_order();
        });

        spyOn(platform, "current").andReturn({ui: {plugins: platformPlugins}});

        plugins.concat(platformPlugins).forEach(function (name) {
            var module = require(_plugin(name));
            if (module.initialize) {
                spyOn(module, "initialize");
            }
        });

        ui.initialize();

        plugins.concat(platformPlugins).forEach(function (name) {
            var module = require(_plugin(name));
            if (module.initialize) {
                expect(module.initialize).toHaveBeenCalled();
            }
        });
    });

    describe("loading a theme", function () {
        // Note: I did this more as an integration style of test (explicit unit testing felt superfluous)
        it("can be done via a URL query string parameter", function () {
            var searchParams = '?theme=foo'; // theme must exist

            themes.push('foo');

            spyOn(platform, "current").andReturn({ui: {plugins: []}});
            spyOn(utils, 'location').andReturn({search: searchParams});
            spyOn(db, 'save');
            spyOn(db, 'retrieve');
            spyOn(db, 'retrieveObject');
            spyOn(db, 'saveObject');
            spyOn(db, 'remove');
            spyOn(document.getElementsByTagName('head')[0], 'appendChild');
            ui.getSystemPlugins().forEach(function (name) {
                var module = require(_plugin(name));
                if (module.initialize) {
                    spyOn(module, "initialize");
                }
            });

            ui.initialize();

            themes.splice(-1, 1);

            expect(db.save).toHaveBeenCalledWith('ui-theme', 'foo');
        });
    });
});
