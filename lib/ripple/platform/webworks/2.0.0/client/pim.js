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
var transport = require('ripple/platform/webworks/2.0.0/client/transport'),
    _uri = "blackberry/pim/category/",
    _self;

_self = {
    addCategory: function (categoryName) {
        transport.call(_uri + "addCategory", {
            get: {categoryName: categoryName}
        });
    },
    deleteCategory: function (categoryName) {
        transport.call(_uri + "deleteCategory", {
            get: {categoryName: categoryName}
        });
    },
    getCategories: function () {
        return transport.call(_uri + "getCategories").data;
    }
};

module.exports = _self;
