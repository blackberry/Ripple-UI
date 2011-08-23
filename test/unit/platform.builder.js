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
describeBrowser("platform builder", function () {
    var sinon = require('sinon'),
        builder = require('ripple/platform/builder'),
        app = require('ripple/app'),
        s;

    beforeEach(function () {
        s = sinon.sandbox.create();
    });

    afterEach(function () {
        s.verifyAndRestore();
    });

    it("it requires in the module for the path", function () {
        var target = {};
        require.define('ripple/platform/xmen/1.0/cyclops', s.mock().once());

        builder.build({
            test: {
                path: "xmen/1.0/cyclops"
            }
        }).into(target);

        expect(target.test).toBeDefined();
        delete require.modules["ripple/platform/xmen/1.0/cyclops"];
    });

    it("it creates the children", function () {
        var target = {};

        require.define('ripple/platform/xmen/1.0/magneto', s.mock().once());
        require.define('ripple/platform/xmen/1.0/scarletWitch', s.mock().once());
        require.define('ripple/platform/xmen/1.0/quicksilver', s.mock().once());

        builder.build({
            magneto: {
                path: "xmen/1.0/magneto",
                children: {
                    scarletWitch: {
                        path: "xmen/1.0/scarletWitch"
                    },
                    quicksilver: {
                        path: "xmen/1.0/quicksilver"
                    }
                }
            }
        }).into(target);

        expect(target.magneto.scarletWitch).toBeDefined();
        expect(target.magneto.quicksilver).toBeDefined();

        delete require.modules['ripple/platform/xmen/1.0/magneto'];
        delete require.modules['ripple/platform/xmen/1.0/scarletWitch'];
        delete require.modules['ripple/platform/xmen/1.0/quicksilver'];
    });

    it("when a path is not given it creates an empty object literal in its place", function () {
        var target = {};

        builder.build({
            fellowship: {
                children: {
                    frodo: {},
                    samwise: {},
                    meriadoc: {},
                    peregrin: {},
                    gandalf: {},
                    aragorn: {},
                    legolas: {},
                    gimli: {},
                    boromir: {}
                }
            }
        }).into(target);

        expect(target.fellowship).toBeDefined();
        expect(target.fellowship.gandalf).toBeDefined();
    });

    describe("when the object has a feature", function () {
        it("doesn't inject the object if the app info doesn't have it", function () {
            var target = {};

            spyOn(app, "getInfo").andReturn({
                features: {}
            });

            builder.build({
                its_a_bug_and_not_a: {
                    feature: "w00t"
                }
            }).into(target);

            expect(target.its_a_bug_and_not_a).not.toBeDefined();
        });

        it("includes the object if the app info contains the feature", function () {
            var target = {};

            spyOn(app, "getInfo").andReturn({
                features: {
                    "best.feature.in.the.world": {}
                }
            });

            builder.build({
                hey_i_heard: {
                    feature: "best.feature.in.the.world"
                }
            }).into(target);

            expect(target.hey_i_heard).toBeDefined();
        });

        it("includes the feature if the config file doesn't have features", function () {
            var target = {};

            spyOn(app, "getInfo").andReturn({
                features: undefined
            });

            builder.build({
                backdoor: {
                    feature: "the.pig.flys.at.midnight"
                }
            }).into(target);

            expect(target.backdoor).toBeDefined();
        });

        it("can search in a pipe delimited list of features", function () {
            var target = {};

            spyOn(app, "getInfo").andReturn({
                features: {
                    larry: {},
                    curly: {},
                    moe: {},
                    shemp: {},
                    ted: {},
                    joe: {},
                    curlyJoe: {},
                    emil: {}

                }
            });

            builder.build({
                stooges: {
                    feature: "larry|curly|moe"
                }
            }).into(target);

            expect(target.stooges).toBeDefined();
        });
    });

    it("can include a submodule when the parent module isn't allowed", function () {
        var target = {};

        spyOn(app, "getInfo").andReturn({
            features: {
                hampsters: {}
            }
        });

        builder.build({
            foo: {
                feature: "chickens",
                children: {
                    bar: {
                        feature: "hampsters"
                    }
                }
            }
        }).into(target);

        expect(target.foo.bar).toBeDefined();
    });

    it("doesn't create a module if none of the submodules are allowed ether", function () {
        var target = {};

        spyOn(app, "getInfo").andReturn({
            features: {
                bacon: {}
            }
        });

        builder.build({
            John: {
                feature: "chickens",
                children: {
                    Smith: {
                        feature: "hampsters"
                    }
                }
            }
        }).into(target);

        expect(target.John).not.toBeDefined();
    });
});
