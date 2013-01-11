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
describe("blackberry.pim.memo", function () {
    var memo = ripple('platform/webworks.handset/2.0.0/server/memo'),
        Memo = ripple('platform/webworks.handset/2.0.0/client/Memo'),
        transport = ripple('platform/webworks.core/2.0.0/client/transport'),
        db = ripple('db'),
        utils = ripple('utils'),
        FilterExpression = ripple('platform/webworks.handset/2.0.0/client/FilterExpression'),
        select = ripple('platform/webworks.core/2.0.0/select'),
        webworks = ripple('platform/webworks.handset/2.0.0/server');

    describe("using server", function () {
        it("exposes the memo module", function () {
            expect(webworks.blackberry.pim.memo).toEqual(memo);
        });
    });

    describe("client", function () {
        describe("find", function () {
            it("calls the transport with proper args", function () {
                var memos = [];
                spyOn(transport, "call").andReturn(memos);
                expect(Memo.find(1, 2, 3, 4, 5)).toEqual(memos);
                expect(transport.call).toHaveBeenCalledWith("blackberry/pim/memo/find", {
                    post: {
                        filter: 1,
                        orderBy: 2,
                        maxReturn: 3,
                        service: 4,
                        isAscending: 5
                    }
                });
            });
        });

        describe("save", function () {
            it("generates a uuid when saved", function () {
                spyOn(Math, "uuid").andReturn("234");
                spyOn(transport, "call");

                var item = new Memo();
                item.save(null, {});

                expect(item.uid).toEqual(234);
                expect(Math.uuid).toHaveBeenCalledWith(8, 10);
            });

            it("calls the transport with id and properties", function () {
                spyOn(Math, "uuid").andReturn("234");
                spyOn(transport, "call");

                var item = new Memo();

                item.save(null, {});

                expect(transport.call).toHaveBeenCalledWith("blackberry/pim/memo/save", {
                    post: {memo: item}
                });
            });
        });

        describe("remove", function () {
            it("calls the transport with id and properties", function () {
                var item = new Memo();
                spyOn(transport, "call");
                item.uid = 123;
                item.remove();
                expect(transport.call).toHaveBeenCalledWith("blackberry/pim/memo/remove", {
                    get: {uid: 123}
                });
            });
        });
    });

    describe("when saving a memo object", function () {
        it("can save a new memo object", function () {
            var memos = {},
                m = new Memo();

            spyOn(db, "retrieveObject").andReturn(memos);
            spyOn(db, "saveObject");

            m.title = "see movie";
            m.note = "get popcorn";

            memo.save(null, {memo: m});

            expect(memos[m.uid]).toBe(m);
        });

        it("can save a existing memo object", function () {
            var memos = {
                    "123": {
                        uid: "123",
                        title: "name",
                        note: "foo",
                        categories: ['a', 'b']
                    }
                },
                m;

            spyOn(db, "retrieveObject").andReturn(memos);
            spyOn(db, "saveObject");
            spyOn(memo, "find").andReturn(memos["123"]);

            m = utils.copy(memo.find(null, {}));
            m.title = "updated!";

            memo.save(null, {memo: m});
            expect(memos[m.uid]).toBe(m);
        });
    });

    describe("when removing a memo object", function () {
        it("removes from the persisted list", function () {
            var memos = {
                    "42": {
                        uid: "42",
                        title: "What is meaning of life?",
                        note: "mer?",
                        categories: []
                    }
                };

            spyOn(db, "retrieveObject").andReturn(memos);
            spyOn(db, "saveObject");

            memo.remove({uid: "42"});

            expect(memos["42"]).not.toBeDefined();
        });

        it("throws an exception if the uid doesn't exist", function () {
            spyOn(db, "retrieveObject").andReturn({});
            spyOn(db, "saveObject");

            expect(function () {
                memo.remove({uid: "42"});
            }).toThrow();

            expect(db.saveObject.callCount).toBe(0);
        });

        it("doesn't delete items that don't match the UID", function () {
            var memos = {
                    "1": {},
                    "3": {},
                    "4": {},
                    "2": {}
                };

            spyOn(db, "retrieveObject").andReturn(memos);
            spyOn(db, "saveObject");

            memo.remove({uid: "1"});

            expect(utils.count(memos)).toBe(3);
            expect(memos["3"]).toBeDefined();
        });
    });

    describe("when finding a memo object", function () {
        var from;

        beforeEach(function () {
            from = {
                where: jasmine.createSpy().andReturn([])
            };
            from.orderBy = jasmine.createSpy().andReturn(from);
            from.max = jasmine.createSpy().andReturn(from);
        });

        it("calls select module with filter expression", function () {
            var filter = new FilterExpression();
            spyOn(select, "from").andReturn(from);

            memo.find(null, {filter: filter});
            expect(from.where).toHaveBeenCalledWith(filter);
        });

        it("passes orderBy and defaults isAscending to 'asc' when isAscending is not provided", function () {
            var filter = new FilterExpression();
            spyOn(select, "from").andReturn(from);

            memo.find(null, {filter: filter, orderBy: "foo"});
            expect(from.orderBy).toHaveBeenCalledWith("foo", "asc");
        });

        it("passes orderBy and sets isAscending to 'asc' when isAscending is true", function () {
            var filter = new FilterExpression();
            spyOn(select, "from").andReturn(from);

            memo.find(null, {filter: filter, orderBy: "foo", isAscending: true});
            expect(from.orderBy).toHaveBeenCalledWith("foo", "asc");
        });

        it("passes orderBy and sets isAscending to 'desc' when isAscending is false", function () {
            var filter = new FilterExpression();
            spyOn(select, "from").andReturn(from);

            memo.find(null, {filter: filter, orderBy: "foo", isAscending: false});
            expect(from.orderBy).toHaveBeenCalledWith("foo", "desc");
        });

        it("passes maxReturn", function () {
            var filter = new FilterExpression();
            spyOn(select, "from").andReturn(from);

            memo.find(null, {filter: filter, maxReturn: 10});
            expect(from.max).toHaveBeenCalledWith(10);
        });
    });
});
