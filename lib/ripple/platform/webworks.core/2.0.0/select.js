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
var utils = require('ripple/utils'),
    _select,
    _predicates = {
        "==": function (left, right) {
            return left === right;
        },
        "!=": function (left, right) {
            return left !== right;
        },
        "<": function (left, right) {
            return left < right;
        },
        ">": function (left, right) {
            return left > right;
        },
        "<=": function (left, right) {
            return left <= right;
        },
        ">=": function (left, right) {
            return left >= right;
        },
        "REGEX": function (left, right) {
            return left && left.match(new RegExp(right));
        },
        "CONTAINS": function (left, right) {
            return left.indexOf(right) >= 0;
        }
    };

function isFilter(field) {
    return field && field.operator !== undefined && field.operator !== null;
}

function extractValue(item, field) {
    return field.split(".").reduce(function (value, prop) {
        return value[prop];
    }, item);
}

function copy(items) {
    //use a reduce to ensure that we always just return an array
    //not the most performant but will whitewash the result
    return utils.reduce(items, function (array, item) {
        array.push(item);
        return array;
    }, []);
}

_select = {
    ops: {
        find: {
            0: "!=",
            1: "==",
            2: "<",
            3: "<=",
            4: ">",
            5: ">=",
            8: "REGEX",
            16: "AND",
            32: "OR",
            64: "CONTAINS"
        },
        phone: {
            0: "!=",
            1: "==",
            2: "<",
            3: "<=",
            4: ">",
            5: ">=",
            8: "AND",
            16: "OR",
            32: "CONTAINS"
        }
    },
    from: function (items) {
        var _getPredicate = function (filter, operators) {

                var noOp = function () {
                        return false;
                    },
                    operator = (function () {
                        var result = operators[filter.operator] || filter.operator,
                            exists = function (op) {
                                return result === op;
                            };

                        return utils.some(operators, exists) ? result : "";
                    }());

                return function (item) {
                    var left = extractValue(item, filter.leftField),
                        right = filter.rightField,
                        predicate = _predicates[operator] || noOp;

                    return filter.negate ? !predicate(left, right) : predicate(left, right);
                };

            },
            _applyFilter = function (filter, operators) {
                var result = [],
                    left,
                    right,
                    op;

                if (isFilter(filter.leftField) && isFilter(filter.rightField)) {

                    left = _select.from(items).where(filter.leftField);
                    right = _select.from(items).where(filter.rightField);
                    op = operators[filter.operator] || filter.operator;

                    switch (op) {
                    case "AND":
                        result = left.filter(function (item) {
                            return right.indexOf(item) >= 0;
                        });
                        break;
                    case "OR":
                        result = left.concat(right.filter(function (item) {
                            return left.indexOf(item) < 0;
                        }));
                        break;
                    }

                    if (filter.negate) {
                        //reverse the result set.
                        result = utils.filter(items, function (item) {
                            return result.indexOf(item) < 0;
                        });
                    }
                }
                else {
                    result = utils.filter(items, _getPredicate(filter, operators));
                }

                return result;
            },
            _orderBy,
            _max,
            _direction,
            _self = {
                orderBy: function (prop, dir) {
                    _orderBy = prop;
                    _direction = dir || "asc";
                    return _self;
                },
                max: function (max) {
                    _max = max;
                    return _self;
                },
                where: function (filter, ops) {
                    var result = isFilter(filter) ? _applyFilter(filter, ops || _select.ops.find) : copy(items);

                    result.sort(function (a, b) {
                        if (a[_orderBy] < b[_orderBy]) {
                            return _direction === "asc" ? -1 : 1;
                        }
                        else if (a[_orderBy] > b[_orderBy]) {
                            return _direction === "asc" ? 1: -1;
                        }
                        return 0;
                    });

                    return result.slice(0, _max === null || _max === -1 ? undefined : _max); // slice in V8 returns empty array if null
                }
            };

        return _self;
    }
};

module.exports = _select;
