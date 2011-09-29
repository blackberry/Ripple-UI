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
var exception = require('ripple/exception'),
    event = require('ripple/event'),
    app = require('ripple/app'),
    _console = require('ripple/console'),
    utils = require('ripple/utils'),
    platform = require('ripple/platform'),
    _validationResult = {
        valid: false,
        message: "",
        value: null
    },
    _configValidationResults = null;

function _failNodeValidation(schemaNode, message, value, node) {
    var validationResult = utils.copy(_validationResult);

    if (!schemaNode.validationResult) {
        schemaNode.validationResult = [];
    }
    validationResult.valid = false;
    if (value) {
        validationResult.value = value;
    }
    else {
        delete(validationResult.value);
    }
    validationResult.message = schemaNode.nodeName + message;
    validationResult.node = node;

    schemaNode.validationResult.push(validationResult);
}

function _createEmptyNodeValidation(node) {

    var validationResult = utils.copy(_validationResult),
        attributeValidationResult, attribute;

    if (!node.validationResult) {
        node.validationResult = [];
    }

    validationResult.value = "";
    delete(validationResult.valid);
    delete(validationResult.message);

    if (node.attributes) {
        for (attribute in node.attributes) {
            if (node.attributes.hasOwnProperty(attribute)) {
                if (!validationResult.attributes) {
                    validationResult.attributes = {};
                }

                attributeValidationResult = utils.copy(_validationResult);

                attributeValidationResult.attributeName = node.attributes[attribute].attributeName;
                delete(attributeValidationResult.value);
                delete(attributeValidationResult.valid);
                delete(attributeValidationResult.message);

                validationResult.attributes[attributeValidationResult.attributeName] = attributeValidationResult;
            }
        }
    }

    node.validationResult.push(validationResult);
}

function _validateValue(valueToTest, schemaNode) {
    var failMessage = "",
        nodeValue,
        numbers,
        numberRangeIndex,
        numberRange,
        range1,
        range2;

    switch (schemaNode.type) {
    case "string":
        if (typeof valueToTest !== "string") {
            failMessage = " value was expected to be of type string but was typeof: " + typeof(valueToTest);
        }
        break;
    case "number":
        nodeValue = parseFloat(valueToTest);
        if (isNaN(nodeValue)) {
            failMessage = " value was expected to be of type number but was typeof: " + typeof(valueToTest);
        }
        break;
    case "integer":
        nodeValue = parseInt(valueToTest, 10);
        if (isNaN(nodeValue)) {
            failMessage = " value was expected to be of type number but was typeof: " + typeof(valueToTest);
        }
        break;
    case "boolean":
        if (valueToTest !== "false" && valueToTest !== "true") {
            failMessage = " value was expected to be of type boolean (i.e. 'true' or 'false' but was: " + valueToTest;
        }
        break;
    case "list":
        if (!utils.arrayContains(schemaNode.listValues, valueToTest)) {
            failMessage = " value is not recognized as being valid, it was:<br/><br/><span class=\"ui-text-fail\">" + valueToTest +
                    "</span><br/><br/>Valid values are:<p class=\"ui-text-pass\">" + schemaNode.listValues.join(" <br/> ") + "</p>";
        }
        break;
    case "listBoolean":
    case "listDefault":
        if (!utils.arrayContains(schemaNode.listValues, valueToTest)) {
            failMessage = " value is not recognized as being valid, it was:<br/><br/><span class=\"ui-text-fail\">" + valueToTest +
                    "</span><br/><br/>The framework will assume the value to be:<p class=\"ui-text-pass\">" + schemaNode.defaultValue + "</p>";
        }
        break;
    case "listNumbers":
        numbers = valueToTest.split(",");

        for (numberRangeIndex = 0; numberRangeIndex < numbers.length; numberRangeIndex++) {
            numberRange = valueToTest.split("-");
            if (numberRange.length > 1) {
                range1 = parseInt(numberRange[0], 10);
                range2 = parseInt(numberRange[1], 10);
                if (isNaN(range1) || isNaN(range2)) {
                    failMessage = " range values where not recognized as being valid, they was: " + range1 +
                            " and " + range2 + " :: valid values should be of type 'integer'";
                    break;
                }
            }
            else if (numberRange.length === 1) {
                range1 = parseInt(numberRange[0], 10);
                if (isNaN(range1)) {
                    failMessage = " value was not recognized as being valid, it was: " + range1 +
                            " :: valid values should be of type 'integer'";
                    break;
                }
            }
        }
        break;
    case "regex":
        if (!valueToTest.match(schemaNode.regex)) {
            failMessage = " value does not match expected format. Value should pass this regular expression validation: " + schemaNode.regex;
        }
        break;
    case "iso-language":
        break;
    default:
        exception.raise(exception.types.Application, "Schema node with value type of: " + schemaNode.type + " is not known");
    }

    return failMessage;
}

function _passNodeValidation(schemaNode, value, node) {
    var validationResult = utils.copy(_validationResult);

    if (!schemaNode.validationResult) {
        schemaNode.validationResult = [];
    }
    validationResult.valid = true;
    validationResult.node = node;
    if (value) {
        validationResult.value = value;
    }
    else {
        delete(validationResult.value);
    }
    delete(validationResult.message);

    schemaNode.validationResult.push(validationResult);
}

function _validateNodeValue(schemaNode, node) {
    var failMessage,
        valueToTest = node && node.nodeValue ? node.nodeValue.replace(/^\s\s*/, '').replace(/\s\s*$/, '') : null;

    if (schemaNode.type && valueToTest) {

        failMessage = _validateValue(valueToTest, schemaNode);

        if (failMessage !== "") {
            _failNodeValidation(schemaNode, failMessage, valueToTest, node);
            return;
        }
    }
    _passNodeValidation(schemaNode, valueToTest, node);
}

function _failNodeAttributeValidation(node, attribute, message, value) {
    var nodeValidationResult = node.validationResult ? node.validationResult.pop() : utils.copy(_validationResult),
        attributeValidationResult = utils.copy(_validationResult);

    if (!nodeValidationResult.attributes) {
        nodeValidationResult.attributes = {};
    }

    nodeValidationResult.valid = false;
    nodeValidationResult.message = "One or more attributes failed validation";

    attributeValidationResult.attributeName = attribute.attributeName;
    attributeValidationResult.valid = false;
    if (value) {
        attributeValidationResult.value = value;
    }
    else {
        delete(attributeValidationResult.value);
    }
    attributeValidationResult.message = node.nodeName + "." + attribute.attributeName + message;

    nodeValidationResult.attributes[attribute.attributeName] = attributeValidationResult;
    node.validationResult.push(nodeValidationResult);
}

function _passNodeAttributeValidation(node, attribute, value) {
    var nodeValidationResult = node.validationResult ? node.validationResult.pop() : utils.copy(_validationResult),
        attributeValidationResult = utils.copy(_validationResult);

    if (!nodeValidationResult.attributes) {
        nodeValidationResult.attributes = {};
    }

    attributeValidationResult.attributeName = attribute.attributeName;
    attributeValidationResult.valid = true;
    if (value) {
        attributeValidationResult.value = value;
    }
    else {
        delete(attributeValidationResult.value);
    }
    delete(attributeValidationResult.message);

    nodeValidationResult.attributes[attribute.attributeName] = attributeValidationResult;
    node.validationResult.push(nodeValidationResult);
}

function _validateNodeAttributeValue(schemaNode, schemaNodeAttribute, attribute) {
    var failMessage,
        valueToTest = attribute ? attribute.value.replace(/^\s\s*/, '').replace(/\s\s*$/, '') : null;

    if (schemaNodeAttribute.type && valueToTest) {

        failMessage = _validateValue(valueToTest, schemaNodeAttribute);

        if (failMessage !== "") {
            _failNodeAttributeValidation(schemaNode, schemaNodeAttribute, failMessage, valueToTest);
            return;
        }
    }
    _passNodeAttributeValidation(schemaNode, schemaNodeAttribute, valueToTest);
}

function _validateNodeAttributes(schemaNode, node, children) {

    var siblings = utils.filter(children, function (child) {
            return child !== node;
        }),
        attributeConverter = function (attribute) {
            var _self = {
                toValue: function (n) {
                    var obj = _self.toNode(n);
                    return obj ? obj.value : null;
                },
                toNode: function (n) {
                    return n.attributes.getNamedItem(attribute.attributeName);
                }
            };

            return _self;
        };

    utils.forEach(schemaNode.attributes, function (attribute) {

        var convert = attributeConverter(attribute),
            dupe = false;

        if (attribute.unique) {
            // this means we need to check and see if there are other node with the same name
            // and ensure that they have a different value for this attributes, if not... fail

            dupe = siblings.some(function (sibling) {
                return convert.toValue(sibling) === convert.toValue(node);
            });

            if (dupe) {
                _failNodeAttributeValidation(schemaNode,
                        attribute,
                        " node is allowed to appear multiple times, however it must be unique based on this attribute and in this case another node with an identical attribute vale was found",
                        convert.toValue(node));
                return;
            }
        }

        if (attribute.required && !convert.toValue(node)) {
            _failNodeAttributeValidation(schemaNode, attribute, " attribute was expected but not found", null);
        }
        else {
            _validateNodeAttributeValue(schemaNode, attribute, convert.toNode(node));
        }
    });
}


function _validateNode(schemaNode, parentNode) {
    var children = utils.filter(parentNode.childNodes, function (child) {
        return child && child.nodeName === schemaNode.nodeName;
    });

    if (children.length === 0) {
        if (schemaNode.required) {
            _failNodeValidation(schemaNode, " node expected, but not found", null, null);
        }
        else {
            _createEmptyNodeValidation(schemaNode);
        }
    }

    utils.forEach(children, function (child) {
        if (schemaNode.occurrence !== 0 && schemaNode.occurrence < children.length) {
            _failNodeValidation(schemaNode, " node: more then " + schemaNode.occurrence + " node(s) found", null, child);
        }
        else {
            _validateNodeValue(schemaNode, child.childNodes[0] || child);

            _validateNodeAttributes(schemaNode, child, children);
        }

        utils.forEach(schemaNode.children, function (schema) {
            _validateNode(schema, child);
        });
    });
}

function _validateAgainstSchemaNode(configSchema, configXML) {
    var results = utils.copy(configSchema);
    try {
        _validateNode(results[configSchema.rootElement], configXML);
    }
    catch (e) {
        exception.handle(e, true);
    }

    return results;
}

function _validate(configXML) {
    // traverse the config schema JSON object
    // TODO: update to get platform.getPlatformConfigSpec().schema
    return _validateAgainstSchemaNode(platform.current().config.schema, configXML);
}

function _process(results) {
    // Check to make sure that widget is the correct version (i.e. config.xml needs to match selected platform)
    var validVersion = app.validateVersion(results);

    if (!validVersion) {
        _console.warn("Your application does not appear to match" +
                " the platform you have selected. The version number in your configuration might not " +
                "match the selected platform version or your configuration file has errors in it.");
    }

    // save widget info
    app.saveInfo(results);
    event.trigger("WidgetInformationUpdated");

    // Check for readonly preferences (WAC only?)

    if (app.getInfo().preferences !== {}) {
        event.trigger("StorageUpdatedEvent");
    }
}

module.exports = {

    validate: function (configXML) {
        utils.validateNumberOfArguments(1, 1, arguments.length);
        return _validate(configXML);
    },

    initialize: function (previous, baton) {
        var xmlHttp = new XMLHttpRequest(),
            config = platform.current().config,
            fileName = config ? config.fileName : null,
            results;

        if (!fileName) {
            return;
        }

        try {
            var path = utils.location().href;
            path = path.substring(0, path.lastIndexOf("/")) + "/";

            xmlHttp.open("GET", path + fileName, false);
            xmlHttp.send();
            if (xmlHttp.responseXML) {
                results = _validate(xmlHttp.responseXML);
                _process(results);
                _configValidationResults = results;
            }
        }
        catch (e) {
            exception.handle(e);
        }
    },

    getValidationResults: function () {
        return _configValidationResults;
    }
};
