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
//blackberry.find.FilterExpression ( leftField  : object ,  operator  : object ,  rightField : object ,  [negate : Boolean ] )
var FilterExpression = function (leftField, operator, rightField, negate) {
    this.__defineGetter__("leftField", function () {
        return leftField;
    });

    this.__defineGetter__("operator", function () {
        return operator;
    });

    this.__defineGetter__("rightField", function () {
        return rightField;
    });

    this.__defineGetter__("negate", function () {
        return negate ? true : false;
    });
};

module.exports = FilterExpression;
