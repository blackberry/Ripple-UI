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
describe("webworks finder", function () {
    var select = require('ripple/platform/webworks.core/2.0.0/select'),
        utils = require('ripple/utils'),
        FilterExpression = require('ripple/platform/webworks.handset/2.0.0/client/FilterExpression');

    describe("when searching properties that are equal", function () {
        var items = [
            { name: "Brent" },
            { name: "Gord" },
            { name: "Dan" }
        ];
        it("can use the == operator", function () {
            var fe = new FilterExpression("name", "==", "Gord"),
                result = select.from(items).where(fe);

            expect(result.length).toBe(1);
            expect(result[0]).toBe(items[1]);

        });

        it("can use the 1 operator", function () {
            var fe = new FilterExpression("name", 1, "Gord"),
                result = select.from(items).where(fe);

            expect(result.length).toBe(1);
            expect(result[0]).toBe(items[1]);

        });

        it("can invert the search", function () {
            var fe = new FilterExpression("name", 1, "Gord", true),
                result = select.from(items).where(fe);

            expect(result.length).toBe(2);
            expect(result[0]).toBe(items[0]);
            expect(result[1]).toBe(items[2]);
        });
    });

    describe("when searching for properties that are not equal", function () {
        var items = [
            { name: "Gwen", sex: "female" },
            { name: "Griffin", sex: "male" },
            { name: "Stephanie", sex: "female" },
            { name: "Gord", sex: "male" }
        ];

        it("can use the != operator", function () {
            var fe = new FilterExpression("sex", "!=", "male"),
                result = select.from(items).where(fe);

            expect(result.length).toBe(2);
            expect(result[0]).toBe(items[0]);
            expect(result[1]).toBe(items[2]);
        });

        it("can use the 0 operator", function () {
            var fe = new FilterExpression("sex", 0, "male"),
                result = select.from(items).where(fe);

            expect(result.length).toBe(2);
            expect(result[0]).toBe(items[0]);
            expect(result[1]).toBe(items[2]);
        });

        it("it can invert the search", function () {
            var fe = new FilterExpression("sex", 0, "male", true),
                result = select.from(items).where(fe);

            expect(result.length).toBe(2);
            expect(result[0]).toBe(items[1]);
            expect(result[1]).toBe(items[3]);
        });
    });


    describe("when searching for properties that are less than", function () {
        var items = [
            { name: "Gwen", age: 4 },
            { name: "Griffin", age: 2 },
            { name: "Stephanie", age: 29 },
            { name: "Gord", age: 30 }
        ];

        it("can use the < operator", function () {
            var fe = new FilterExpression("age", "<", "30"),
                result = select.from(items).where(fe);

            expect(result.length).toBe(3);
        });

        it("can use the 2 operator", function () {
            var fe = new FilterExpression("age", 2, "30"),
                result = select.from(items).where(fe);

            expect(result.length).toBe(3);
        });

        it("it can invert the search", function () {
            var fe = new FilterExpression("age", "<", "30", true),
                result = select.from(items).where(fe);

            expect(result.length).toBe(1);
        });
    });

    describe("when searching for properties that are greater than", function () {
        var items = [
            { name: "Gwen", age: 4 },
            { name: "Griffin", age: 2 },
            { name: "Stephanie", age: 29 },
            { name: "Gord", age: 30 }
        ];
        it("can use the > operator", function () {
            var fe = new FilterExpression("age", ">", "5"),
                result = select.from(items).where(fe);

            expect(result.length).toBe(2);
        });

        it("can use the 4 operator", function () {
            var fe = new FilterExpression("age", 4, "5"),
                result = select.from(items).where(fe);

            expect(result.length).toBe(2);
        });

        it("it can invert the search", function () {
            var fe = new FilterExpression("age", ">", "30", true),
                result = select.from(items).where(fe);

            expect(result.length).toBe(4);
        });
    });

    describe("when searching for properties that are less then or equal", function () {
        var items = [
            { name: "Gwen", fingers: 8 },
            { name: "Griffin", fingers: 8 },
            { name: "Stephanie", fingers: 8 },
            { name: "Gord", fingers: 8 }
        ];
        it("can use the <= operator", function () {
            var fe = new FilterExpression("fingers", "<=", "8"),
                result = select.from(items).where(fe);

            expect(result.length).toBe(4);
        });

        it("can use the 3 operator", function () {
            var fe = new FilterExpression("fingers", 3, "8"),
                result = select.from(items).where(fe);

            expect(result.length).toBe(4);
        });

        it("it can invert the operator", function () {
            var fe = new FilterExpression("fingers", 3, "8", true),
                result = select.from(items).where(fe);

            expect(result.length).toBe(0);
        });
    });

    describe("when searching for properties that are greater then or equal", function () {
        var items = [
            { name: "Gwen", fingers: 8 },
            { name: "Griffin", fingers: 8 },
            { name: "Stephanie", fingers: 8 },
            { name: "Gord", fingers: 8 }
        ];
        it("can use the >= operator", function () {
            var fe = new FilterExpression("fingers", ">=", "11"),
                result = select.from(items).where(fe);

            expect(result.length).toBe(0);
        });

        it("can use the 5 operator", function () {
            var fe = new FilterExpression("fingers", 5, "11"),
                result = select.from(items).where(fe);

            expect(result.length).toBe(0);
        });

        it("it can invert the selection", function () {
            var fe = new FilterExpression("fingers", ">=", "11", true),
                result = select.from(items).where(fe);

            expect(result.length).toBe(4);
        });
    });


    describe("when searching in an array", function () {
        var orders = [
            { id: 1, items: ["milk", "eggs", "cheese"]},
            { id: 2, items: ["bread", "milk", "noodles"]}
        ];
        it("can check if an array contains something using the CONTAINS operator", function () {
            var fe = new FilterExpression("items", "CONTAINS", "noodles"),
                result = select.from(orders).where(fe);

            expect(result.length).toBe(1);
            expect(result[0]).toBe(orders[1]);
        });

        it("can check if an array contains something using the 64 operator", function () {
            var fe = new FilterExpression("items", 64, "noodles"),
                result = select.from(orders).where(fe);

            expect(result.length).toBe(1);
            expect(result[0]).toBe(orders[1]);
        });

        it("it can invert the selection", function () {
            var fe = new FilterExpression("items", "CONTAINS", "noodles", true),
                result = select.from(orders).where(fe);

            expect(result.length).toBe(1);
            expect(result[0]).toBe(orders[0]);
        });
    });

    describe("when searching with a regex", function () {
        var orders = [
            { id: 1, description: "awesome" },
            { id: 2, description: "awesomer" },
            { id: 2, description: "more awesomer" },
            { id: 3, description: "awesomist" }
        ];
        it("can use the REGEX operator", function () {
            var fe = new FilterExpression("description", "REGEX", "^awesom*"),
                result = select.from(orders).where(fe);

            expect(result.length).toBe(3);
        });

        it("can use the 8 operator", function () {
            var fe = new FilterExpression("description", 8, "^awesom*"),
                result = select.from(orders).where(fe);

            expect(result.length).toBe(3);
        });

        it("it can invert the operator", function () {
            var fe = new FilterExpression("description", "REGEX", "^awesom*", true),
                result = select.from(orders).where(fe);

            expect(result.length).toBe(1);
        });

        it("can handle a search where the field doesn't exist", function () {
            var fe = new FilterExpression("bloodType", "REGEX", "^B*"),
                result = select.from(orders).where(fe);

            expect(result.length).toBe(0);
        });
    });

    it("returns an empty array if left is a filter expression but right isn't", function () {
        var result = select.from([]).where(new FilterExpression(new FilterExpression("asdf", "==", "test"), "AND", "asdf"));
        expect(result.length).toBe(0);
    });

    it("returns an empty array if right is a filter expression but left isn't", function () {
        var result = select.from([]).where(new FilterExpression("foo", "AND", new FilterExpression("asfd", "==", "test")));
        expect(result.length).toBe(0);
    });

    describe("can combine filter expressions", function () {
        var people = [
            {first: "Gord", last: "Downie"},
            {first: "Gord", last: "Tanner"},
            {first: "Stephanie", last: "Tanner"},
            {first: "Gord", last: "Shumway"}
        ];
        it("with the AND operator", function () {
            var fe = new FilterExpression(
                    new FilterExpression("first", "==", "Gord"),
                    "AND",
                    new  FilterExpression("last", "==", "Tanner")),
                result = select.from(people).where(fe);

            expect(result.length).toBe(1);
            expect(result[0]).toBe(people[1]);
        });

        it("with the OR operator", function () {
            var fe = new FilterExpression(
                    new FilterExpression(
                        new FilterExpression("first", "==", "Gord"),
                        "OR",
                        new FilterExpression("first", "==", "Stephanie")),
                    "AND",
                    new  FilterExpression("last", "==", "Tanner")),
                result = select.from(people).where(fe);

            expect(result.length).toBe(2);
            expect(result[0]).toBe(people[1]);
            expect(result[1]).toBe(people[2]);
        });

        it("invert the match", function () {
            var fe = new FilterExpression(new FilterExpression("first", "==", "Gord"), "AND", new FilterExpression("last", "==", "Tanner"), true),
                result = select.from(people).where(fe);
            expect(result.length).toBe(3);
        });

        it("can use the op code for AND", function () {
            var fe = new FilterExpression(new FilterExpression("first", "==", "Gord"), 16, new FilterExpression("last", "==", "Tanner")),
                result = select.from(people).where(fe);
            expect(result.length).toBe(1);
        });

        it("can use the op code for OR", function () {
            var fe = new FilterExpression(new FilterExpression("first", "==", "Stephanie"), 32, new FilterExpression("last", "==", "Tanner")),
                result = select.from(people).where(fe);
            expect(result.length).toBe(2);
        });
    });

    it("returns an empty collection when both left and right are filter expressions and the operator is not AND or OR", function () {
        var people = [
                {first: "Gord", last: "Downie"},
                {first: "Gord", last: "Tanner"},
                {first: "Gord", last: "Shumway"},
                {first: "Stephanie", last: "Tanner"}
            ],
            fe = new FilterExpression(
                new FilterExpression("first", "==", "Stephanie"),
                "==",
                new  FilterExpression("last", "==", "Tanner")),
            result = select.from(people).where(fe);

        expect(result.length).toBe(0);
    });

    it("returns an empty collection when using an operator that doesn't exist", function () {
        var people = [
                {first: "Gord", last: "Downie"},
                {first: "Gord", last: "Tanner"},
                {first: "Gord", last: "Shumway"},
                {first: "Stephanie", last: "Tanner"}
            ],
            fe = new FilterExpression("first", "PUPPIES!!!", "ARE OMG SO CUTE"),
            result = select.from(people).where(fe);

        expect(result.length).toBe(0);
    });

    describe("select can sort the results", function () {
        var things = [
            {foo: "bbaa", bar: true, id: 3},
            {foo: "aabb", bar: true, id: 1},
            {foo: "ccdd", bar: true, id: 5},
            {foo: "ddcc", bar: true, id: 4}
        ];

        describe("and defaults the sort to ascending", function () {
            it("using in as the last chain", function () {
                var fe = new FilterExpression("bar", "==", true),
                    result = select.from(things).orderBy("foo").where(fe);

                expect(result[0]).toEqual(things[1]);
                expect(result[1]).toEqual(things[0]);
                expect(result[2]).toEqual(things[2]);
                expect(result[3]).toEqual(things[3]);
            });

            xit("using orderedBy as the last chain", function () {
                var fe = new FilterExpression("bar", "==", true),
                    result = select.from(things).where(fe).orderBy("foo");

                expect(result[0]).toEqual(things[1]);
                expect(result[1]).toEqual(things[0]);
                expect(result[2]).toEqual(things[2]);
                expect(result[3]).toEqual(things[3]);
            });
        });

        it("can sort decending", function () {
            var fe = new FilterExpression("bar", "==", true),
                result = select.from(things).orderBy("foo", "desc").where(fe);

            expect(result[0]).toEqual(things[3]);
            expect(result[1]).toEqual(things[2]);
            expect(result[2]).toEqual(things[0]);
            expect(result[3]).toEqual(things[1]);

        });
    });

    describe("select can limit the number of results", function () {
        var cats = [
            {name: "Fluffy", awesome: true},
            {name: "Smokey", awesome: true},
            {name: "Mr Wiggles", awesome: true},
            {name: "Mittens", awesome: true},
            {name: "Pookie", awesome: true},
            {name: "Snowball", awesome: true},
            {name: "Gandalf", awesome: true}
        ];

        it("limit will cap the number of results", function () {
            var fe = new FilterExpression("awesome", "==", true),
                result = select.from(cats).max(3).where(fe);

            expect(result.length).toBe(3);
        });

        it("limit can return less than the max", function () {
            var fe = new FilterExpression("name", "==", "Fluffy"),
                result = select.from(cats).max(3).where(fe);

            expect(result.length).toBe(1);
        });

        it("limit returns all results when given -1", function () {
            var fe = new FilterExpression("awesome", "==", true),
                result = select.from(cats).max(-1).where(fe);

            expect(result.length).toBe(cats.length);
        });
    });

    it("can use subproperties of the field", function () {
        var cars = [
                {
                    make: "Ford",
                    model: "Focus",
                    engine: {
                        placement: "FR",
                        horsepower: 200
                    }
                },
                {
                    make: "Toyota",
                    model: "Prius",
                    engine: {
                        placement: "FR",
                        horsepower: 190
                    }
                },
                {
                    make: "Mitsubishi",
                    model: "Lancer Evo",
                    engine: {
                        placement: "AWD",
                        horsepower: 300
                    }
                }
            ],
            fe = new FilterExpression("engine.placement", "==", "AWD"),
            result = select.from(cars).where(fe);

        expect(result.length).toBe(1);
        expect(result[0]).toBe(cars[2]);
    });

    describe("can pass in nothing for the filter expression", function () {
        var team = [
            {name: "Gord"},
            {name: "Brent"},
            {name: "Dan"},
            {name: "Nino"},
            {name: "Nukul"}
        ];

        it("returns all of the items", function () {
            var result = select.from(team).where();
            expect(result.length).toBe(team.length);

        });

        it("will sort the team", function () {
            var result = select.from(team).orderBy("name").where();

            expect(result[0]).toEqual(team[1]);
            expect(result[1]).toEqual(team[2]);
            expect(result[2]).toEqual(team[0]);
            expect(result[3]).toEqual(team[3]);
            expect(result[4]).toEqual(team[4]);
        });

        it("will cap the number of results", function () {
            var result = select.from(team).max(3).orderBy("name").where();
            expect(result.length).toBe(3);
        });
    });

    describe("when working with object literals", function () {
        it("it can apply a filter", function () {
            var team = {
                    "1": {name: "Gord"},
                    "3": {name: "Brent"},
                    "4": {name: "Dan"},
                    "2": {name: "Nino"},
                    "6": {name: "Nukul"}
                },
                fe = new FilterExpression("name", "==", "Dan"),
                result = select.from(team).orderBy("name").max(10).where(fe);

            expect(result).toEqual([team["4"]]);

        });

        it("it can work without a filter", function () {
            var team = {
                    "1": {name: "Gord"},
                    "3": {name: "Brent"},
                    "4": {name: "Dan"},
                    "2": {name: "Nino"},
                    "6": {name: "Nukul"}
                },
                result = select.from(team).orderBy("name").max(10).where();

            expect(result.length).toEqual(utils.count(team));

        });
    });

    describe("when using the phone op codes", function () {
        var phones = {
                "Bold": {name: "Bold", model: 9780},
                "Curve": {name: "Curve", model: 9300},
                "Torch": {name: "Torch", model: 9800}
            };

        it("returns an empty array when using REGEX", function () {

            var fe = new FilterExpression("name", "REGEX", "^B"),
                result = select.from(phones).where(fe, select.ops.phone);

            expect(result.length).toBe(0);

        });

        it("uses 8 as the AND operator", function () {

            var fe = new FilterExpression(
                new FilterExpression("name", "==", "Bold"),
                8,
                new FilterExpression("model", "==", 9780)),
                result = select.from(phones).where(fe, select.ops.phone);

            expect(result[0]).toBe(phones["Bold"]);
            expect(result.length).toBe(1);

        });

        it("uses 16 as the OR operator", function () {

            var fe = new FilterExpression(
                new FilterExpression("name", "==", "Bold"),
                16,
                new FilterExpression("model", "==", 9800)),
                result = select.from(phones).where(fe, select.ops.phone);

            expect(result.length).toBe(2);

        });

        it("when using op code 64 it returns an empty array", function () {

            var team = {
                    emails: [
                        "gtanner@rim.com",
                        "blintner@rim.com",
                        "dsilivestru@rim.com"
                    ]
                },
                fe = new FilterExpression("emails", 64, "gtanner@rim.com"),
                result = select.from(team).where(fe, select.ops.phone);

            expect(result.length).toBe(0);

        });
    });
});
