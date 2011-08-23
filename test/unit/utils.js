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
describe("utils", function () {
    var _array = [],
        _object = {},
        _foreachArray = [],
        _foreachObj = {},
        exception = require('ripple/exception'),
        utils = require('ripple/utils');

    beforeEach(function () {
        _array = [1, 2, 3, 4, 5];
        _object = {a: 1, b: 2, c: 3, d: 4, e: 5};
        _foreachArray = [];
        _foreachArray.push({ called: false, call: function () {
            this.called = true;
        }});
        _foreachArray.push({ called: false, call: function () {
            this.called = true;
        }});

        _foreachObj.a = { called: false, call: function () {
            this.called = true;
        }};

        _foreachObj.b = { called: false, call: function () {
            this.called = true;
        }};
    });

    it("validateNumberOfArguments_Throws_Exception_If_No_Arguments", function () {
        expect(utils.validateNumberOfArguments).toThrow();
    });

    it("validateNumberOfArguments_Throws_Exception_If_Too_Many_Arguments", function () {
        expect(function () {
            utils.validateNumberOfArguments("1", "2", "3", 3, true);
        }).toThrow();
    });

    it("validateNumberOfArguments_Throws_Argument_Exception_If_Invalid_Arguments", function () {
        expect(function () {
            utils.validateNumberOfArguments("1", "2", "3", "4", "5", "6", "7");
        }).toThrow(function (e) {
            return e.type === exception.types.Argument;
        });

        expect(function () {
            utils.validateNumberOfArguments("1");
        }).toThrow(function (e) {
            return e.type === exception.types.Argument;
        });
    });

    it("validateNumberOfArguments_Throws_Exception_If_Out_Of_Bounds", function () {
        expect(function () {
            utils.validateNumberOfArguments(1, 1, 3);
        }).toThrow();
    });

    it("validateNumberOfArguments_Works_For_Upper_Lower_Equal_Number_Of_Arguments", function () {
        expect(function () {
            utils.validateNumberOfArguments(1, 1, 1);
        }).not.toThrow();
    });

    it("validateNumberOfArguments_Works_For_Number_Of_Arguments_Between_Upper_And_Lower", function () {
        expect(function () {
            utils.validateNumberOfArguments(1, 3, 2);
        }).not.toThrow();
    });

    it("validateNumberOfArguments_Works_For_Number_Of_Arguments_Equal_Upper", function () {
        expect(function () {
            utils.validateNumberOfArguments(1, 3, 3);
        }).not.toThrow();
    });

    it("validateNumberOfArguments_Works_For_Number_Of_Arguments_Equal_Lower", function () {
        expect(function () {
            utils.validateNumberOfArguments(1, 3, 1);
        }).not.toThrow();
    });

    it("validateNumberOfArguments_throws_custom_exception_properly", function () {
        var obj = {
                "name": "TestException",
                "message": "test message"
            };

        expect(function () {
            utils.validateNumberOfArguments(1, 1, 3, obj.name, obj.message);
        }).toThrow(function (e) {
            return e.name === obj.name;
        });
    });

    it("validateNumberOfArguments_throws_custom_exception_with_existingObject_properly", function () {
        var obj = {
                "name": "TestException",
                "message": "test message"
            },
            customObj = {
                "test": "test property"
            };

        try {
            utils.validateNumberOfArguments(1, 1, 3, obj.name, obj.message, customObj);
        } catch (e) {
            expect(e.test).toEqual(customObj.test);
            expect(e.name).toEqual(obj.name);
            expect(e.message).toMatch(new RegExp(obj.message));
            return;
        }

        throw "Exception was expected, none was thrown";
    });

    it("createElement_Throws_Exception_For_Wrong_Element_Type", function () {
        expect(function () {
            utils.createElement(1);
        }).toThrow();
    });

    it("createElement_Creates_Div_With_Style_Attribute", function () {
        var node = utils.createElement("div", {"style": "color:black;"});
        expect(node.nodeName).toEqual("DIV");
        expect(node.getAttribute("style")).toMatch(/color:black;/);
    });

    it("HtmlElements_Works", function () {
        expect(function () {
            utils.loadHTMLElements();
        }).not.toThrow();
    });

    // TODO: figure out a way to properly test loadHTMLElements
    it("getAllStylesheetRules_Throws_Exception_If_No_Arguments", function () {
        expect(function () {
            utils.getAllStylesheetRules();
        }).toThrow();
    });

    it("getAllStylesheetRules_Throws_Exception_If_Too_Many_Arguments", function () {
        expect(function () {
            utils.getAllStylesheetRules("1", "2", "3", 3, true);
        }).toThrow();
    });

    it("validateArgumentType_throws_error_with_incorrect_type", function () {
        expect(function () {
            utils.validateArgumentType("test", "number");
        }).toThrow();
    });

    it("validateArgumentType_throws_no_error_when_valid_type", function () {
        expect(function () {
            utils.validateArgumentType("test", "string");
        }).not.toThrow();
    });

    it("validateArgumentType_throws_custom_exception_properly", function () {
        var obj = {
                "name": "TestException",
                "message": "test message"
            };

        expect(function () {
            utils.validateArgumentType("test", "boolean", obj.name, obj.message);
        }).toThrow(function (e) {
            return e.name === obj.name;
        });
    });

    it("validateArgumentType_throws_custom_exception_with_existingObject_properly", function () {
        var obj = {
                "name": "TestException",
                "message": "test message"
            },
            customObj = {
                "test": "test property"
            };

        try {
            utils.validateArgumentType("test", "boolean", obj.name, obj.message, customObj);
        } catch (e) {
            expect(e.test).toEqual(customObj.test);
            expect(e.name).toEqual(obj.name);
            expect(e.message).toMatch(new RegExp(obj.message));
            return;
        }

        throw "Exception was expected, none was thrown";
    });

    it("validateMultipleArgumentTypes_throws_error_with_incorrect_types", function () {
        expect(function () {
            utils.validateMultipleArgumentTypes(["test", "4", 4], ["string", "number", "boolean"]);
        }).toThrow();
    });

    it("validateMultipleArgumentTypes_throws_no_error_when_valid_types", function () {
        expect(function () {
            utils.validateMultipleArgumentTypes(["test", 4, false], ["string", "number", "boolean"]);
        }).not.toThrow();
    });

    it("validateMultipleArgumentTypes_throws_no_error_when_valid_types_two", function () {
        expect(function () {
            utils.validateMultipleArgumentTypes([1, 1], ["number", "number"]);
        }).not.toThrow();
    });

    // -------------------------- utils.validateMultipleArgumentTypes ----------------------\\

    it("map_works_on_arrays", function () {
        var result = utils.map(_array, function (x) {
            return x * 2;
        });

        expect(result).toEqual([2, 4, 6, 8, 10]);
    });

    it("map_works_on_objects", function () {
        var result = utils.map(_object, function (x, i) {
            return i + x;
        });

        expect(result).toEqual(["a1", "b2", "c3", "d4", "e5"]);
    });

    xit("map_works_on_named_node_maps", function () {
        //HACK: this is so the test doesn't run in node
        if (document.body.attributes instanceof NamedNodeMap) {
            var result = utils.map(document.body.attributes, function (x, i) {
                return "VALUE[" + x.name + "]" + " INDEX: " + i;
            });
            expect(result).toEqual(["VALUE[class] INDEX: 0"]);
        }
    });

    it("reduce_works_on_arrays", function () {
        var result = utils.reduce(_array, function (s, x) {
            return s + x;
        });
        expect(result).toEqual(15);
    });

    it("reduce_works_on_objects", function () {
        var result = utils.reduce(_object, function (s, x, i) {
            return s + i;
        }, "!");
        expect(result).toEqual("!abcde");
    });

    xit("reduce_works_on_named_node_maps", function () {
        //HACK: this is so the test doesn't run in node
        if (document.body.attributes instanceof NamedNodeMap) {
            var result = utils.reduce(document.body.attributes, function (s, x, i) {
                return s + ":" + x.name + ":" + x.value + ":" + i;
            }, "!");
            expect(result).toEqual("!:class:jsur_loading:0");
        }
    });

    it("reduce_works_with_initial_value", function () {
        var result = utils.reduce(_object, function (s, x) {
            return s + x;
        }, 10);
        expect(result).toEqual(25);
    });

    it("reduce_works_with_initial_empty_string", function () {
        var result = utils.reduce(_object, function (s, x) {
            return s + x;
        }, "");
        expect(result).toEqual("12345");
    });

    it("some_true", function () {
        expect(utils.some(_object, function (v, i) {
            return i === "a";
        })).toEqual(true);
    });

    it("some_false", function () {
        expect(utils.some(_object, function (v, i) {
            return i === "wtf";
        })).toEqual(false);
    });

    it("some_true_array", function () {
        expect(utils.some(_array, function (v, i) {
            return v === 4;
        })).toEqual(true);
    });

    it("sum", function () {
        var result = utils.sum(_array, function (v) {
            return v * 10;
        });
        expect(result).toEqual(150);
    });

    it("count", function () {
        var result = utils.count(_array);
        expect(result).toEqual(5);
    });

    it("count object", function () {
        var result = utils.count(_object);
        expect(result).toEqual(5);
    });

    it("max", function () {
        var result = utils.max(_array, function (v) {
            return v;
        });
        expect(result).toEqual(5);
    });

    it("min", function () {
        var result = utils.min(_array, function (v) {
            return v;
        });
        expect(result).toEqual(1);
    });

    it("foreach_array", function () {
        utils.forEach(_foreachArray, function (x) {
            x.call();
        });

        expect(_foreachArray[0].called).toEqual(true);
        expect(_foreachArray[1].called).toEqual(true);
    });

    it("foreach_obj", function () {
        utils.forEach(_foreachObj, function (x) {
            x.call();
        });

        expect(_foreachObj.a.called).toEqual(true);
        expect(_foreachObj.b.called).toEqual(true);
    });

    it("filter", function () {
        var result = utils.filter(_array, function (v) {
            return v % 2 === 0;
        });
        expect(result).toEqual([2, 4]);
    });

    it("filter_obj", function () {
        var result = utils.filter(_object, function (v) {
            return v % 2 === 0;
        });
        expect(result).toEqual([2, 4]);
    });

    // -------- mixin

    it("mixin mixes in an object into another", function () {
        var obj = {
                foo: "bar",
                func: function () {}
            },
            anotherObj = {
                bar: "foo"
            };

        utils.mixin(obj, anotherObj);
        expect(obj.foo).toEqual(anotherObj.foo);
        expect(anotherObj.bar).toEqual("foo");
        expect(typeof obj.func).toEqual("function");
    });

    it("mixin returns mixed in obj", function () {
        var obj = {
                foo: "bar",
                func: function () {}
            },
            anotherObj = {
                bar: "foo"
            };

        expect(utils.mixin(obj, anotherObj)).toBe(anotherObj);
    });

    it("Copy_copies_an_object_literal_properly", function () {
        var obj = {
                test: "hello world",
                testtwo: "hello again"
            },
            obj2 = utils.copy(obj);

        expect(obj).toEqual(obj2);
        expect(obj).toEqual(obj2);
    });

    it("Copy_copies_a_integer_properly", function () {
        var num = 1,
            num2 = utils.copy(1);
        expect(num).toEqual(num2);
    });

    it("Copy_copies_a_string_properly", function () {
        var str = "hello world",
            str2 = utils.copy(str);
        expect(str).toEqual(str2);
    });

    it("Copy_copies_a_boolean_properly", function () {
        var bool = true,
            bool2 = false;
        expect(utils.copy(bool)).toEqual(bool);
        expect(utils.copy(bool2)).toEqual(bool2);
    });

    it("Copy_copies_a_date_properly", function () {
        var date = new Date();
        //use unix timestamp since date objects dont work here.
        expect(utils.copy(date).getTime()).toEqual(date.getTime());
    });

    it("Copy_makes_an_actual_copy_of_an_integer", function () {
        var num = 1,
            num2 = utils.copy(num);
        num = 4;
        expect(num).not.toEqual(num2);
    });

    it("Copy_makes_an_actual_copy_of_a_boolean", function () {
        var bool = true,
            bool2 = utils.copy(bool);
        bool = false;
        expect(bool).not.toEqual(bool2);
    });

    it("Copy_makes_an_actual_copy_of_a_string", function () {
        var str = "hello world",
            str2 = utils.copy(str);
        str = "foo";
        expect(str).not.toEqual(str2);
    });

    it("Copy_makes_an_actual_copy_of_a_date", function () {
        var date = new Date(),
            date2 = utils.copy(date);
        date2 = "foo";
        expect(date).not.toEqual(date2);
    });

    it("Copy_makes_an_actual_copy_of_an_object_literal", function () {
        var obj = {
                test: "hello world",
                testtwo: "hello again"
            },
            obj2 = utils.copy(obj);
        obj = {foo: "foo!!"};
        expect(obj).not.toEqual(obj2);
    });

    it("can copy null and return null", function () {
        expect(utils.copy(null)).toBe(null);
    });

    it("can copy undefined and return undefined", function () {
        expect(utils.copy(undefined)).toBe(undefined);
    });
});
