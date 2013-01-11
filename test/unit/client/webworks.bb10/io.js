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
describe("blackberry.io", function () {
    var target = ripple('platform/webworks.bb10/1.0.0/io'),
        app = ripple('app'),
        _id = "myappid";

    beforeEach(function () {
        spyOn(app, "getInfo").andReturn({
            id: _id
        });
    });

    describe("checks that property", function () {

        it("home exists and returns correct value", function () {
            expect(target.home).toBe("/webworksBB10/" + app.getInfo().id + "/home");
        });

        it("SDCard exists and returns correct value", function () {
            expect(target.SDCard).toBe("/webworksBB10/SDCard");
        });

        it("sharedFolder exists and returns correct value", function () {
            expect(target.sharedFolder).toBe("/webworksBB10/sharedFolder");
        });
    });
});
