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
var platform = require('ripple/platform'),
    utils = require('ripple/utils'),
    db = require('ripple/db'),
    constants = require('ripple/constants');

module.exports = {
    fileName: "config.xml",
    validateVersion: function (configValidationObject) {
        var valid = true;
        valid = !((!configValidationObject.widget.validationResult[0].attributes.xmlns.valid) ||
            (!configValidationObject.widget.validationResult[0].attributes["xmlns:JIL"].valid));

        return valid;
    },
    extractInfo: function (configValidationObject) {
        if (!configValidationObject) {
            return null;
        }

        var widgetInfo = {},
            configPreferences,
            preferenceName;

        widgetInfo.id = configValidationObject.widget.validationResult[0].attributes.id.value || "";
        widgetInfo.name = configValidationObject.widget.children.name.validationResult[0].value;
        widgetInfo.icon = configValidationObject.widget.children.icon.validationResult[0].attributes.src.value;
        widgetInfo.version = configValidationObject.widget.validationResult[0].attributes.version.value;
        widgetInfo.preferences = {};

        configPreferences = configValidationObject.widget.children.preference.validationResult;

        utils.forEach(configPreferences, function (preference) {
            preferenceName = preference.attributes.name.value;
            if (preferenceName) {
                widgetInfo.preferences[preferenceName] = {
                    "key": preferenceName,
                    "value": preference.attributes.value.value || "",
                    "readonly": preference.attributes.readonly.value === "true"
                };

                db.save(preferenceName,
                        widgetInfo.preferences[preferenceName].value,
                        platform.getPersistencePrefix(widgetInfo.id));
            }
        });

        return widgetInfo;
    },
    schema: {
        rootElement: "widget",
        widget: {
            nodeName: "widget",
            required: true,
            occurrence: 1,
            helpText: "\"widget\" element describes widget information in configuration documents and serves as a container for other elements. It must be used in configuration document and may have following child elments: name,description,icon,author,license,content,maximum_display_mode,update,feature,access,billing. \"widget\" element MAY have following attributes: id,version,height,width,xml:lang",
            attributes: {
                xmlns: {
                    attributeName: "xmlns",
                    required: true,
                    type: "list",
                    listValues: ["http://www.w3.org/ns/widgets"]
                },
                "xmlns:JIL": {
                    attributeName: "xmlns:JIL",
                    required: true,
                    type: "list",
                    listValues: ["http://www.jil.org/ns/widgets1.2"]
                },
                "xmlns:its": {
                    attributeName: "xmlns:its",
                    helpText: "Indicates Text Directionality can be used. According to W3C spec, this feature is at risk, therefore we don't currently validate this.",
                    required: false,
                    type: "string"
                },
                id: {
                    attributeName: "id",
                    required: true,
                    type: "string"
                },
                version: {
                    attributeName: "version",
                    helpText: "Version must be in the following format: jil-rec-version-tag = major-version \".\" minor-version [\".\" version-desc]",
                    required: true,
                    type: "regex",
                    regex: /^\d{1,2}\.\d{1,2}(\.[A-Za-z0-9]{1,10})?$/
                },
                height: {
                    attributeName: "height",
                    required: true,
                    type: "integer"
                },
                width: {
                    attributeName: "width",
                    required: true,
                    type: "integer"
                },
                viewmodes: {
                    attributeName: "viewmodes",
                    required: false,
                    type: "list",
                    listValues: ["floating", "fullscreen"]
                },
                "xml:lang": {
                    attributeName: "xml:lang",
                    required: false,
                    type: "iso-language"
                }
            },
            children: {
                preference: {
                    nodeName: "preference",
                    required: false,
                    occurrence: 0,
                    attributes: {
                        name: {
                            attributeName: "name",
                            type: "string",
                            required: true
                        },
                        value: {
                            type: "string",
                            attributeName: "value",
                            required: false
                        },
                        readonly: {
                            attributeName: "readonly",
                            type: "boolean",
                            required: false
                        }
                    }
                },
                name: {
                    nodeName: "name",
                    required: false,
                    occurrence: 0,
                    type: "string",
                    attributes: {
                        "short": {
                            attributeName: "short",
                            type: "string",
                            required: false
                        },
                        "xml:lang": {
                            attributeName: "xml:lang",
                            type: "string",
                            required: false,
                            unique: true
                        }
                    }
                },
                description: {
                    nodeName: "description",
                    required: false,
                    occurrence: 0,
                    type: "string",
                    attributes: {
                        "xml:lang": {
                            attributeName: "xml:lang",
                            type: "string",
                            required: false,
                            unique: true
                        }
                    }
                },
                icon: {
                    nodeName: "icon",
                    required: false,
                    occurrence: 0,
                    attributes: {
                        src: {
                            attributeName: "src",
                            type: "string",
                            required: true
                        },
                        height: {
                            attributeName: "height",
                            required: false,
                            type: "integer"
                        },
                        width: {
                            attributeName: "width",
                            required: false,
                            type: "integer"
                        },
                        "xml:lang": {
                            attributeName: "xml:lang",
                            type: "string",
                            required: false,
                            unique: true
                        }
                    }
                },
                author: {
                    nodeName: "author",
                    required: false,
                    occurrence: 1,
                    type: "string",
                    attributes: {
                        email: {
                            attributeName: "email",
                            type: "regex",
                            required: false,
                            regex: constants.REGEX.EMAIL
                        },
                        href: {
                            attributeName: "href",
                            type: "regex",
                            required: false,
                            regex: constants.REGEX.URL
                        },
                        "xml:lang": {
                            attributeName: "xml:lang",
                            type: "string",
                            required: false,
                            unique: true
                        }
                    }
                },
                license: {
                    nodeName: "license",
                    required: false,
                    occurrence: 1,
                    type: "string",
                    attributes: {
                        href: {
                            attributeName: "href",
                            type: "regex",
                            required: false,
                            regex: constants.REGEX.URL
                        },
                        "xml:lang": {
                            attributeName: "xml:lang",
                            type: "string",
                            required: false,
                            unique: true
                        }
                    }
                },
                content: {
                    nodeName: "content",
                    required: false,
                    occurrence: 1,
                    attributes: {
                        src: {
                            attributeName: "src",
                            type: "string",
                            required: true
                        },
                        encoding: {
                            attributeName: "encoding",
                            type: "string",
                            required: false
                        },
                        type: {
                            attributeName: "type",
                            type: "string",
                            required: false
                        }
                    }
                },
                feature: {
                    nodeName: "feature",
                    required: false,
                    occurrence: 0,
                    attributes: {
                        name: {
                            attributeName: "name",
                            type: "list",
                            required: true,
                            listValues: ["http://jil.org/jil/api/1.1/widget", "http://jil.org/jil/api/1.1.5/exception",
                                            "http://jil.org/jil/api/1.1.5/exceptiontypes", "http://jil.org/jil/api/1.1/device",
                                            "http://jil.org/jil/api/1.1/accountinfo", "http://jil.org/jil/api/1.1/deviceinfo",
                                            "http://jil.org/jil/api/1.1.1/datanetworkinfo", "http://jil.org/jil/api/1.1/devicestateinfo",
                                            "http://jil.org/jil/api/1.1/accelerometerinfo", "http://jil.org/jil/api/1.1/config",
                                            "http://jil.org/jil/api/1.1.1/file", "http://jil.org/jil/api/1.1/positioninfo",
                                            "http://jil.org/jil/api/1.1/powerinfo", "http://jil.org/jil/api/1.1.1/radioinfo",
                                            "http://jil.org/jil/api/1.1.5/radiosignalsourcetypes", "http://jil.org/jil/api/1.1.5/applicationtypes",
                                            "http://jil.org/jil/api/1.1/messaging", "http://jil.org/jil/api/1.1/account",
                                            "http://jil.org/jil/api/1.1/attachment", "http://jil.org/jil/api/1.1/message",
                                            "http://jil.org/jil/api/1.1.4/messagefoldertypes", "http://jil.org/jil/api/1.1/messagequantities",
                                            "http://jil.org/jil/api/1.1/messagetypes", "http://jil.org/jil/api/1.1/multimedia",
                                            "http://jil.org/jil/api/1.1/audioplayer", "http://jil.org/jil/api/1.1.2/camera",
                                            "http://jil.org/jil/api/1.1.2/videoplayer", "http://jil.org/jil/api/1.1.1/pim",
                                            "http://jil.org/jil/api/1.1/addressbookitem", "http://jil.org/jil/api/1.1/calendaritem",
                                            "http://jil.org/jil/api/1.1/eventrecurrencetypes", "http://jil.org/jil/api/1.1.1/telephony",
                                            "http://jil.org/jil/api/1.1/callrecord", "http://jil.org/jil/api/1.1.1/callrecordtypes",
                                            "http://jil.org/jil/api/1.1.1/widgetmanager"]
                        },
                        required: {
                            attributeName: "required",
                            type: "boolean",
                            required: false
                        }
                    }
                },
                "JIL:maximum_display_mode": {
                    nodeName: "JIL:maximum_display_mode",
                    required: false,
                    occurrence: 1,
                    attributes: {
                        height: {
                            attributeName: "height",
                            type: "integer",
                            required: false
                        },
                        width: {
                            attributeName: "width",
                            type: "integer",
                            required: false
                        }
                    }
                },
                "JIL:update": {
                    nodeName: "JIL:update",
                    required: false,
                    occurrence: 1,
                    attributes: {
                        href: {
                            attributeName: "href",
                            type: "regex",
                            required: true,
                            regex: constants.REGEX.URL
                        },
                        period: {
                            attributeName: "period",
                            helpText: "Possible values for the period attribute are: 0, 1, 2, 3 meaning: every time the widget is opened in maximum display mode, every day, every week, every month; respectivly",
                            type: "list",
                            required: true,
                            listValues: ["0", "1", "2", "3"]
                        }
                    }
                },
                "JIL:access": {
                    nodeName: "JIL:access",
                    required: false,
                    occurrence: 1,
                    attributes: {
                        network: {
                            attributeName: "network",
                            type: "boolean",
                            required: false
                        },
                        localfs: {
                            attributeName: "localfs",
                            type: "boolean",
                            required: false
                        },
                        remote_scripts: {
                            attributeName: "remote_scripts",
                            type: "boolean",
                            required: false
                        }
                    }
                },
                "JIL:billing": {
                    nodeName: "JIL:billing",
                    required: false,
                    occurrence: 1,
                    attributes: {
                        required: {
                            attributeName: "required",
                            type: "boolean",
                            required: true
                        }
                    }
                }
            }
        }
    }
};
