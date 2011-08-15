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
var _lines = [
        {id: 1, number: 12345678910, label: "rogers", type: 1},
        {id: 2, number: 10987654321, label: "mystery", type: 0}
    ],
    _self;

function _filterLines(args) {

    var result = _lines;

    if (args && typeof args.id === "number") {
        result = _lines.filter(function (line) {
            return line.id === args.id;
        });

        if (result.length === 0) {
            throw "invalid line id: " + args.id;
        }
    }

    return result;
}

_self = {
    getLineIds: function () {
        var lines = _lines.map(function (line) {
            return line.id;
        });
        return {
            code: 1,
            data: lines
        };
    },
    getLineLabel: function (args) {
        return {
            code: 1,
            data: _filterLines(args)[0].label
        };
    },
    getLineNumber: function (args) {
        return {
            code: 1,
            data: _filterLines(args)[0].number
        };
    },
    getLineType: function (args) {
        return {
            code: 1,
            data: _filterLines(args)[0].type
        };
    }
};

module.exports = _self;
