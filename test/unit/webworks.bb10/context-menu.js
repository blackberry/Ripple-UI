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
describe("context menu", function () {
    var ui = require('ripple/ui'),
        contextMenu,
        events = require('ripple/event'),
        goodAction = {
            actionId: 'MyItem',
            label: 'My Item',
            icon: 'http://mysite.com/icon.png'
        },
        actionNoId = {
            label: 'My Item',
            icon: 'http://mysite.com/icon.png'
        },
        actionInvalidId = {
            actionId: '',
            label: 'My Item',
            icon: 'http://mysite.com/icon.png'
        },
        customMenuCallback;

    beforeEach(function () {
        spyOn(ui, 'showOverlay');
        contextMenu = require('ripple/platform/webworks.bb10/1.0.0/context-menu');
        customMenuCallback = jasmine.createSpy('customMenuCallback');
    });

    it("exists", function () {
        expect(contextMenu).toBeDefined();
    });

    describe("Make sure API signature is implemented correctly", function () {
        it("has an enabled property", function () {
            expect(contextMenu.enabled).toBeDefined();
        });

        it("has a readonly field named CONTEXT_ALL", function () {
            expect(contextMenu.CONTEXT_ALL).toBeDefined();
        });

        it("has have a readonly field named CONTEXT_LINK", function () {
            expect(contextMenu.CONTEXT_LINK).toBeDefined();
        });

        it("has a readonly field named CONTEXT_IMAGE_LINK", function () {
            expect(contextMenu.CONTEXT_IMAGE_LINK).toBeDefined();
        });

        it("has a readonly field named CONTEXT_IMAGE", function () {
            expect(contextMenu.CONTEXT_IMAGE).toBeDefined();
        });

        it("has a readonly field named CONTEXT_INPUT", function () {
            expect(contextMenu.CONTEXT_INPUT).toBeDefined();
        });

        it("has a readonly field named CONTEXT_TEXT", function () {
            expect(contextMenu.CONTEXT_TEXT).toBeDefined();
        });

        it("has addItem field defined", function () {
            expect(contextMenu.addItem).toBeDefined();
        });

        it("has removeItem field defined", function () {
            expect(contextMenu.removeItem).toBeDefined();
        });
    });

    it("allows the enabled property to be set", function () {
        contextMenu.enabled = false;
        expect(contextMenu.enabled).toBeFalsy();
        contextMenu.enabled = true;
        expect(contextMenu.enabled).toBeTruthy();
    });

    it("receives ContextMenuEvent event", function () {
        events.trigger('ContextMenuEvent', [{name: contextMenu.CONTEXT_ALL}], true);
        expect(ui.showOverlay).toHaveBeenCalled();
    });

    it("receives LayoutChanged event", function () {
        events.trigger('LayoutChanged', [], true);
        expect(ui.showOverlay).toHaveBeenCalled();
    });

    it("can have custom items added and removed", function () {
        contextMenu.addItem([contextMenu.CONTEXT_ALL], goodAction, customMenuCallback);
        contextMenu.removeItem([contextMenu.CONTEXT_ALL], goodAction.actionId);
    });

    it("supports firing custom menu events", function () {
        contextMenu.addItem([contextMenu.CONTEXT_ALL], goodAction, customMenuCallback);
        events.trigger('contextmenu.executeMenuAction', [goodAction.actionId], true);
        expect(customMenuCallback).toHaveBeenCalled();

        contextMenu.removeItem([contextMenu.CONTEXT_ALL], goodAction.actionId);
    });

    it("throws an error when adding duplicate custom menu items", function () {
        contextMenu.addItem([contextMenu.CONTEXT_ALL], goodAction, customMenuCallback);

        expect(function () {
            contextMenu.addItem([contextMenu.CONTEXT_ALL], goodAction, customMenuCallback);
        }).toThrow();

        contextMenu.removeItem([contextMenu.CONTEXT_ALL], goodAction.actionId);
    });

    it("throws an error when adding custom menu item with actionId = '' ", function () {
        expect(function () {
            contextMenu.addItem([contextMenu.CONTEXT_ALL], actionInvalidId, customMenuCallback);
        }).toThrow();
    });

    it("throws an error when adding custom menu item with no actionId", function () {
        expect(function () {
            contextMenu.addItem([contextMenu.CONTEXT_ALL], actionNoId, customMenuCallback);
        }).toThrow();
    });

    it("doesn't invoke callback for a removed custom menu item", function () {
        contextMenu.addItem([contextMenu.CONTEXT_ALL], goodAction, customMenuCallback);
        events.trigger('contextmenu.executeMenuAction', [goodAction.actionId], true);
        expect(customMenuCallback).wasCalled();

        contextMenu.removeItem([contextMenu.CONTEXT_ALL], goodAction.actionId);
        events.trigger('contextmenu.executeMenuAction', [goodAction.actionId], true);
        expect(customMenuCallback.callCount).toEqual(1);
    });
});
