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
describeBrowser("widgetConfig", function () {
    // TODO: need to mock more

    function _getConfig(filePath) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", filePath, false);
        xmlHttp.send();
        return xmlHttp.responseXML;
    }

    window.fooConfig = _getConfig;

    var widgetConfig = require('ripple/widgetConfig'),
        platform = require('ripple/platform');

    it("validateNumberOfArguments_Throws_Exception_If_No_Arguments", function () {
        expect(function () {
            widgetConfig.validate();
        }).toThrow(function (e) {
            return e.type === "ArgumentLength";
        });
    });

    it("load_config_file", function () {
        var configXML = _getConfig("test/assets/config/config.xml");
        expect(typeof configXML === "object");
    });

    it("config_no_namespaces_file_loads_and_we_can_parse_the_first_node", function () {
        var evaluator,
            configXML,
            resolver,
            results,
            configNodes;

        configXML = _getConfig("test/assets/config/config_no_namespaces.xml");

        evaluator = new XPathEvaluator();
        resolver = evaluator.createNSResolver(configXML);
        configNodes = evaluator.evaluate("//*[name()='widget']", configXML,
                        null, XPathResult.ANY_TYPE, null);

        results = configNodes.iterateNext();

        expect(typeof configNodes === "object");
    });

    it("config_file_loads_and_we_can_parse_a_namespaced_node", function () {
        var configXML,
            evaluator,
            resolver,
            configNodes;

        configXML = _getConfig("test/assets/config/config.xml");

        evaluator = new XPathEvaluator();
        resolver = evaluator.createNSResolver(configXML);
        configNodes = configXML.evaluate("//*[name()='JIL:billing']", configXML,
                        resolver, XPathResult.ANY_TYPE, null);

        expect(typeof configNodes).toEqual("object");
    });

    it("config_file_validation_returns_true_for_a_valid_config_file", function () {
        var configXML,
            evaluator,
            resolver,
            configNodes;

        configXML = _getConfig("test/assets/config/config.xml");
        expect(widgetConfig.validate(configXML).widget.validationResult[0].valid).toEqual(true);
    });

    it("config_file_validation_returns_returns_proper_nodes_as_being_validated", function () {
        var configXML,
            evaluator,
            resolver,
            configNodes,
            result;

        configXML = _getConfig("test/assets/config/config.xml");

        result = widgetConfig.validate(configXML).widget;

        expect(result.validationResult[0].valid).toEqual(true);
        expect(result.children["preference"].validationResult[0].valid).toEqual(true);
        expect(result.children["name"].validationResult[0].valid).toEqual(true);
        expect(result.children["description"].validationResult[0].valid).toEqual(true);
        expect(result.children["icon"].validationResult[0].valid).toEqual(true);
        expect(result.children["author"].validationResult[0].valid).toEqual(true);
        expect(result.children["content"].validationResult[0].valid).toEqual(true);
        expect(result.children["feature"].validationResult[0].valid).toEqual(true);
        expect(result.children["JIL:maximum_display_mode"].validationResult[0].valid).toEqual(true);
        expect(result.children["JIL:update"].validationResult[0].valid).toEqual(true);
        expect(result.children["JIL:access"].validationResult[0].valid).toEqual(true);
        expect(result.children["JIL:billing"].validationResult[0].valid).toEqual(true);
    });

    it("config_file_validation_validates_for_required_widget_and_icon_nodes", function () {
        var configXML,
            evaluator,
            resolver,
            configNodes,
            result;

        configXML = _getConfig("test/assets/config/config_no_widet_node.xml");

        result = widgetConfig.validate(configXML).widget;

        expect(result).toBeTruthy();
        expect(result.validationResult[0].message).toEqual("widget node expected, but not found");
    });

    it("config_file_validation_validates_that_only_one_name_node_can_exist", function () {
        var configXML,
            evaluator,
            resolver,
            configNodes,
            result;

        configXML = _getConfig("test/assets/config/config_multiple_name_nodes.xml");

        result = widgetConfig.validate(configXML).widget;

        expect(result.children.name.validationResult[1].attributes["xml:lang"].message)
            .toEqual("name.xml:lang node is allowed to appear multiple times, however it must be unique based on " +
                     "this attribute and in this case another node with an identical attribute vale was found");
    });

    it("config_file_validation_validates_that_multiple_unique_name_node_can_exist", function () {
        var configXML,
            evaluator,
            resolver,
            configNodes,
            result;

        configXML = _getConfig("test/assets/config/config_multiple_name_nodes_unique.xml");
        result = widgetConfig.validate(configXML).widget;
        expect(result.children.name.validationResult[0].valid).toEqual(true);
    });

    it("config_file_validation_fails_for_bad_attributes", function () {
        var configXML,
            evaluator,
            resolver,
            configNodes,
            result;

        configXML = _getConfig("test/assets/config/config_with_missing_attributes.xml");

        result = widgetConfig.validate(configXML).widget;

        expect(result.validationResult[0].attributes.id.message).toEqual("widget.id attribute was expected but not found");
        expect(result.validationResult[0].attributes.version.message).toEqual("widget.version attribute was expected but not found");
        expect(result.validationResult[0].attributes.height.message).toEqual("widget.height attribute was expected but not found");
        expect(result.validationResult[0].attributes.width.message).toEqual("widget.width attribute was expected but not found");
        expect(result.children.icon.validationResult[0].attributes.src.message).toEqual("icon.src attribute was expected but not found");
    });

    it("config_file_validation_catches_bad_urls_and_emails_in_attributes", function () {
        var configXML,
            evaluator,
            resolver,
            configNodes,
            result;

        configXML = _getConfig("test/assets/config/config_with_bad_url_email_attributes.xml");
        result = widgetConfig.validate(configXML).widget;

        expect("author.email value does not match expected format. Value should pass this regular expression validation: " + (/^([^@\s]+)@((?:[\-a-z0-9]+\.)+[a-z]{2,})$/))
            .toEqual(result.children.author.validationResult[0].attributes.email.message);
        expect("JIL:update.href value does not match expected format. Value should pass this regular expression validation: " +
                                  (/^((https?|ftp|gopher|telnet|file|notes|ms-help):((\/\/)|(\\\\))+[\w\d:#@%\/;$()~_?\+-=\\\.&]*)$/))
            .toEqual(result.children["JIL:update"].validationResult[0].attributes.href.message);
    });

    it("can handle duplicate nodes at different levels", function () {
        var configXML,
            widget;

        spyOn(platform, "current").andReturn(require('ripple/platform/webworks.core/2.0.0/spec'));
        configXML = _getConfig("test/assets/config/config_multiple_nested_features.xml");
        widget = widgetConfig.validate(configXML).widget;
        expect(widget.children.feature.validationResult.length).toBe(1);
        expect(widget.children.access.children.feature.validationResult.length).toBe(2);
    });
});
