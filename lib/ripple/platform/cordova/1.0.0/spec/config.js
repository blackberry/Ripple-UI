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
var constants = require('ripple/constants');

module.exports = {
    fileName: "config.xml",
    validateVersion: function (configValidationObject) {
        var valid = true;
        valid = !((!configValidationObject.widget.validationResult[0].attributes.xmlns.valid) ||
            (!configValidationObject.widget.validationResult[0].attributes["xmlns:gap"].valid));

        return valid;
    },
    extractInfo: function (configValidationObject) {
        if (!configValidationObject) {
            return null;
        }

        var widgetInfo = {};

        widgetInfo.id = configValidationObject.widget.validationResult[0].attributes.id.value || "";
        widgetInfo.name = configValidationObject.widget.children.name.validationResult[0].value;
        widgetInfo.icon = configValidationObject.widget.children.icon.validationResult[0].attributes.src.value;
        widgetInfo.version = configValidationObject.widget.validationResult[0].attributes.version.value;

        return widgetInfo;
    },
    schema: {
        rootElement: "widget",
        widget: {
            nodeName: "widget",
            required: true,
            occurrence: 1,
            attributes: {
                xmlns: {
                    attributeName: "xmlns",
                    required: true,
                    type: "list",
                    listValues: ["http://www.w3.org/ns/widgets"]
                },
                "xmlns:gap": {
                    attributeName: "xmlns:gap",
                    required: true,
                    type: "list",
                    listValues: ["http://phonegap.com/ns/1.0"]
                },
                "xml:lang": {
                    attributeName: "xml:lang",
                    required: false,
                    type: "iso-language"
                },
                dir: {
                    attributeName: "dir",
                    required: false,
                    type: "list",
                    listValues: ["ltr", "rtl", "lro", "rlo"]
                },
                id: {
                    attributeName: "id",
                    required: false,
                    type: "string"
                },
                version: {
                    attributeName: "version",
                    required: false,
                    type: "string"
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
                viewmodes: {
                    attributeName: "viewmodes",
                    required: false,
                    type: "list",
                    listValues: ["floating", "fullscreen"]
                }
            },
            children: {
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
                            listValues: ["http://api.phonegap.com/1.0/accelerometer", "http://api.phonegap.com/1.0/camera",
                                "http://api.phonegap.com/1.0/compass", "http://api.phonegap.com/1.0/contacts", "http://api.phonegap.com/1.0/device",
                                "http://api.phonegap.com/1.0/events", "http://api.phonegap.com/1.0/file", "http://api.phonegap.com/1.0/geolocation",
                                "http://api.phonegap.com/1.0/media", "http://api.phonegap.com/1.0/network", "http://api.phonegap.com/1.0/notification",
                                "http://api.phonegap.com/1.0/storage"]
                        },
                        required: {
                            attributeName: "required",
                            type: "boolean",
                            required: false
                        }
                    }
                },
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
                }
            }
        }
    }
};
