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
describe("wac_CalendarItem", function () {
    var CalendarItem = require('ripple/platform/wac/1.0/CalendarItem'),
        db = require('ripple/db'),
        constants = require('ripple/constants'),
        sinon = require('sinon'),
        s;

    beforeEach(function () {
        s = sinon.sandbox.create();
    });

    afterEach(function () {
        s.verifyAndRestore();
    });

    it("can create a CalendarItem", function () {
        expect(new CalendarItem()).not.toEqual(null);
    });

    it("it is an instance of CalendarItem", function () {
        expect(new CalendarItem() instanceof CalendarItem).toEqual(true);
    });

    describe("update", function () {
        it("saves the item", function () {
            var items = [
                    new CalendarItem(),
                    new CalendarItem(),
                    new CalendarItem()
                ],
                target = new CalendarItem();

            items[0].calendarItemId = "1";
            items[1].calendarItemId = "2";
            items[2].calendarItemId = "3";

            s.stub(db, "retrieveObject").returns(items);

            target.calendarItemId = "2";
            target.eventNotes = "It puts the lotion in the basket";

            s.mock(db).expects("saveObject").withExactArgs(
                constants.PIM.CALENDAR_LIST_KEY, [items[0], target, items[2]]).once();

            target.update();
        });

        it("calling update on an item that doesn't exist throws an exception", function () {
            var items = [
                    new CalendarItem(),
                    new CalendarItem(),
                    new CalendarItem()
                ],
                target = new CalendarItem();

            items[0].calendarItemId = "1";
            items[1].calendarItemId = "2";
            items[2].calendarItemId = "3";

            s.stub(db, "retrieveObject").returns(items);

            target.calendarItemId = "4";
            target.eventNotes = "or else it gets the hose again";

            s.mock(db).expects("saveObject").never();

            expect(function () {
                target.update(target);
            }).toThrow();
        });
    });
});
