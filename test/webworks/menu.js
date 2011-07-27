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
describe("webworks menu", function () {
    var menu = require('ripple/platform/webworks/2.0.0/server/menu'),
        client = require('ripple/platform/webworks/2.0.0/client/menu'),
        transport = require('ripple/platform/webworks/2.0.0/client/transport'),
        MenuItem = require('ripple/platform/webworks/2.0.0/client/MenuItem'),
        events = require('ripple/platform/webworks/2.0.0/client/events'),
        event = require('ripple/event'),
        ui = require('ripple/ui'),
        MockBaton = function () {
            this.take = jasmine.createSpy("baton.take");
            this.pass = jasmine.createSpy("baton.pass");
        };

    describe("using server", function () {
        it("exposes the menu module", function () {
            var webworks = require('ripple/platform/webworks/2.0.0/server');
            expect(webworks.blackberry.ui.menu).toEqual(menu);
        });
    });

    describe("in spec", function () {
        it("includes ui module according to proper object structure", function () {
            var spec = require('ripple/platform/webworks/2.0.0/spec');
            expect(spec.objects.blackberry.children.ui.children.menu.path)
                .toEqual("webworks/2.0.0/client/menu");
        });
    });

    describe("client", function () {
        describe("addMenuItem", function () {
            it("calls the transport", function () {
                spyOn(transport, "call");
                client.addMenuItem("menu item");
                expect(transport.call).toHaveBeenCalledWith("blackberry/ui/menu/addMenuItem", {
                    get: {item: "menu item"}
                });
            });

            // TODO: it polls for onSelect when menu items, and calls callback when complete
        });

        describe("clearMenuItems", function () {
            it("calls the transport", function () {
                spyOn(transport, "call");
                client.clearMenuItems();
                expect(transport.call).toHaveBeenCalledWith("blackberry/ui/menu/clearMenuItems");
            });
        });

        describe("open", function () {
            it("calls the transport", function () {
                spyOn(transport, "call");
                client.open();
                expect(transport.call).toHaveBeenCalledWith("blackberry/ui/menu/open", {async: true});
            });
        });

        describe("removeMenuItem", function () {
            it("calls the transport", function () {
                var item = new MenuItem(1, 2);
                spyOn(transport, "call");
                client.removeMenuItem(item);
                expect(transport.call).toHaveBeenCalledWith("blackberry/ui/menu/removeMenuItem", {
                    get: {item: item}
                });
            });
        });

        describe("setDefaultMenuItem", function () {
            it("calls the transport", function () {
                var item = new MenuItem(1, 2);
                spyOn(transport, "call");
                client.setDefaultMenuItem(item);
                expect(transport.call).toHaveBeenCalledWith("blackberry/ui/menu/setDefaultMenuItem", {
                    get: {id: item.id}
                });
            });
        });
    });

    describe("creating menu item", function () {
        it("create a new menu item", function () {
            var menuItem = new MenuItem(false, 1, "Hello World", function () {});
            expect(menuItem.caption).toEqual("Hello World");
            expect(menuItem.isSeparator).toBeFalsy();
        });

        it("create a new menu item as a seperator", function () {
            var menuItem = new MenuItem(true, 2);
            expect(menuItem.isSeparator).toBeTruthy();
        });

        it("throws an exception if MenuItem is created with an ordinal less than 0", function () {
            expect(function () {
                var item = new MenuItem(false, -1, "Hello World", function () {});
            }).toThrow();
        });

        it("throws an exception if caption is not provided and seperator is false", function () {
            expect(function () {
                var item = new MenuItem(false, 1);
            }).toThrow();
        });
    });

    describe("Menu Items", function () {
        beforeEach(function () {
            menu.clearMenuItems();
        });

        it("can add menu items", function () {
            var menuItem = new MenuItem(false, 1, "Menu item 1", function () {});

            spyOn(event, "trigger").andCallFake(function (event, args) {
                expect(args[0][menuItem.id]).toBe(menuItem);
            });
            menu.addMenuItem({item: menuItem});

            expect(event.trigger).toHaveBeenCalled();
        });

        it("throws an exception when no menu item is provided", function () {
            expect(function () {
                menu.addMenuItem();
            }).toThrow();
        });

        it("clearing menu items", function () {
            var menuItem = new MenuItem(false, 1, "Menu item 1", function () {});
            menu.addMenuItem({item: menuItem});

            spyOn(event, "trigger").andCallFake(function (event, args) {
                expect(args[0]).toEqual({});
            });

            menu.clearMenuItems();
        });

        it("remove menu item", function () {
            var menuItem = new MenuItem(false, 1, "Menu item 1", function () {});
            menu.addMenuItem({item: menuItem});
            spyOn(event, "trigger").andCallFake(function (event, args) {
                expect(args[0][menuItem.id]).toBe(undefined);
            });
            menu.removeMenuItem({item: menuItem});
        });

        it("can set menu item as default choice", function () {
            var menuItem1 = new MenuItem(false, 1, "Menu item 1", function () {});
            spyOn(event, "trigger");

            menu.addMenuItem({item: menuItem1});
            menu.setDefaultMenuItem({id: menuItem1.id});

            expect(event.trigger.mostRecentCall.args[0]).toBe("DefaultItemChanged");
        });
    });

    describe("menu events", function () {
        var menuItem = new MenuItem(false, 1, "Menu item 1", function () {});

        it("open request shows the menu overlay", function () {
            spyOn(ui, "showOverlay");
            menu.open();
            expect(ui.showOverlay.mostRecentCall.args[0]).toBe("menu-window");
            expect(ui.showOverlay.callCount).toBe(1);
        });

        it("close request hides the menu overlay", function () {
            spyOn(ui, "hideOverlay");
            menu.close();
            expect(ui.hideOverlay.mostRecentCall.args[0]).toBe("menu-window");
            expect(ui.hideOverlay.callCount).toBe(1);
        });
    });

    describe("onSelect", function () {
        it("takes the baton", function () {
            var baton = new MockBaton();
            menu.onSelect({}, {}, baton);
            expect(baton.take).toHaveBeenCalled();
        });

        it("passes the baton when MenuItemSelected is raised", function () {
            var baton = new MockBaton();
            menu.onSelect({}, {}, baton);
            event.trigger("MenuItemSelected", [2], true);
            expect(baton.pass).toHaveBeenCalledWith({code: 1, data: 2});
        });

        it("only passes the baton once", function () {
            var baton = new MockBaton();
            menu.onSelect({}, {}, baton);
            event.trigger("MenuItemSelected", [1], true);
            event.trigger("MenuItemSelected", [2], true);
            expect(baton.pass.callCount).toBe(1);
        });
    });
});
