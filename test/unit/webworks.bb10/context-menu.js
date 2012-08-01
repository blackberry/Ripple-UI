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
        events = require('ripple/event');
    
    beforeEach(function () {
        spyOn(ui, 'showOverlay');
        contextMenu = require('ripple/platform/webworks.bb10/1.0.0/context-menu');
    });

    describe("existentials", function () {
        it("should exist ", function () {
            expect(typeof contextMenu).not.toBe('undefined' || null);
        });
        
        it("should have an enabled property", function () {
            expect(contextMenu.enabled).toBeDefined();
        });

        it("should have a readonly field named CONTEXT_ALL", function () {
            expect(contextMenu.CONTEXT_ALL).toBeDefined();
        });

        it("should have a readonly field named CONTEXT_LINK", function () {
            expect(contextMenu.CONTEXT_LINK).toBeDefined();
        });

        it("should have a readonly field named CONTEXT_IMAGE_LINK", function () {
            expect(contextMenu.CONTEXT_IMAGE_LINK).toBeDefined();
        });

        it("should have a readonly field named CONTEXT_IMAGE", function () {
            expect(contextMenu.CONTEXT_IMAGE).toBeDefined();
        });

        it("should have a readonly field named CONTEXT_INPUT", function () {
            expect(contextMenu.CONTEXT_INPUT).toBeDefined();
        });

        it("should have a readonly field named CONTEXT_TEXT", function () {
            expect(contextMenu.CONTEXT_TEXT).toBeDefined();
        });
    });

    describe("mutations", function () {
        it("should allow the enabled property to be set", function () {
            contextMenu.enabled = false;
            expect(contextMenu.enabled).toBeFalsy();
            contextMenu.enabled = true;
            expect(contextMenu.enabled).toBeTruthy();
        });
    });

    describe("events", function () {
        it("should receive ContextMenuEvent event", function () {
            events.trigger('ContextMenuEvent', ['context'], true);
            expect(ui.showOverlay).toHaveBeenCalled();
        });

        it("should received LayoutChanged event", function () {
            events.trigger('LayoutChanged', [], true);
            expect(ui.showOverlay).toHaveBeenCalled();
        });
    });
});
