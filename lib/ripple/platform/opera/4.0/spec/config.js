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
    config: "config.xml",
    configSchema: {
        rootElement: "widget",
        widget: {
            nodeName: "widget",
            required: true,
            occurrence: 1,
            attributes: {
                defaultmode: {
                    attributeName: "defaultmode",
                    required: false,
                    type: "listDefault",
                    listValues: ["widget", "application", "fullscreen"],
                    defaultValue: "widget"
                },
                dockable: {
                    attributeName: "dockable",
                    required: false,
                    type: "listBoolean",
                    listValues: ["yes", "true", "dockable"],
                    defaultValue: false
                },
                transparent: {
                    attributeName: "transparent",
                    required: false,
                    type: "listBoolean",
                    listValues: ["yes", "true", "transparent"],
                    defaultValue: false
                },
                network: {
                    attributeName: "network",
                    required: false,
                    type: "list",
                    listValues: ["public", "private", "public private", "private public"]
                }
            },
            children: {
                widgetname: {
                    nodeName: "widgetname",
                    required: true,
                    occurrence: 1,
                    type: "string"
                },
                width: {
                    nodeName: "width",
                    required: false,
                    occurrence: 1,
                    type: "integer",
                    defaultValue: 300
                },
                height: {
                    nodeName: "height",
                    required: false,
                    occurrence: 1,
                    type: "integer",
                    defaultValue: 300
                },
                widgetfile: {
                    nodeName: "widgetfile",
                    required: false,
                    occurrence: 1,
                    type: "regex",
                    regex: constants.REGEX.URL,
                    helpText: "An author must not %-encode all path names.<br/><br/>It is recommended that authors use this element."
                },
                author: {
                    nodeName: "author",
                    required: false,
                    occurrence: 1,
                    children: {
                        name: {
                            nodeName: "name",
                            type: "string",
                            occurrence: 1,
                            required: false
                        },
                        organization: {
                            nodeName: "organization",
                            type: "string",
                            occurrence: 1,
                            required: false
                        },
                        email: {
                            nodeName: "email",
                            type: "regex",
                            regex: constants.REGEX.EMAIL,
                            occurrence: 1,
                            required: false
                        },
                        link: {
                            nodeName: "link",
                            type: "regex",
                            regex: constants.REGEX.URL,
                            occurrence: 1,
                            required: false
                        }
                    }
                },
                description: {
                    nodeName: "description",
                    required: false,
                    occurrence: 1,
                    type: "string"
                },
                icon: {
                    nodeName: "icon",
                    required: false,
                    occurrence: 0,
                    type: "string",
                    attributes: {
                        width: {
                            attributeName: "width",
                            type: "integer",
                            required: false
                        },
                        height: {
                            attributeName: "height",
                            type: "integer",
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
                            type: "string",
                            required: true
                        },
                        required: {
                            attributeName: "required",
                            type: "boolean",
                            required: false
                        }
                    },
                    children: {
                        param: {
                            nodeName: "param",
                            required: false,
                            occurrence: 0,
                            attributes: {
                                name: {
                                    attributeName: "name",
                                    required: true,
                                    type: "string"
                                },
                                value: {
                                    attributeName: "value",
                                    required: true,
                                    type: "string"
                                }
                            }
                        }
                    }
                },
                id: {
                    nodeName: "id",
                    required: false,
                    occurrence: 1,
                    children: {
                        host: {
                            nodeName: "host",
                            required: true,
                            occurrence: 1,
                            type: "regex",
                            regex: constants.REGEX.URL
                        },
                        name: {
                            nodeName: "name",
                            required: true,
                            occurrence: 1,
                            type: "string"
                        },
                        revised: {
                            nodeName: "revised",
                            required: true,
                            occurrence: 1,
                            type: "regex",
                            regex: constants.REGEX.WC3_DTF
                        }
                    }
                },
                security: {
                    nodeName: "security",
                    required: false,
                    occurrence: 1,
                    children: {
                        access: {
                            nodeName: "access",
                            required: false,
                            occurrence: 1,
                            helpText: "A user agent must treat undeclared child elements of the access element to mean that an author is requesting access to the full capabilities afforded by the semantics of the missing element. An example is that if the host element is missing, the widget is requesting access to all hosts.",
                            children: {
                                protocol: {
                                    nodeName: "protocol",
                                    occurrence: 0,
                                    type: "list",
                                    listValues: ["http", "https"],
                                    required: false
                                },
                                host: {
                                    nodeName: "host",
                                    occurrence: 0,
                                    type: "string",
                                    required: false
                                },
                                port: {
                                    nodeName: "port",
                                    occurrence: 0,
                                    type: "listNumbers",
                                    required: false
                                },
                                path: {
                                    nodeName: "path",
                                    occurrence: 0,
                                    type: "string",
                                    required: false
                                }
                            }
                        },
                        content: {
                            nodeName: "content",
                            required: false,
                            occurrence: 1,
                            attributes: {
                                plugin: {
                                    attributeName: "plugin",
                                    type: "string",
                                    required: true,
                                    listValues: ["yes", "no", "true", "false", "plugin"]
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    extractInfo: function (configValidationObject) {
        if (!configValidationObject) {
            return null;
        }

        var widgetInfo = {};

        widgetInfo.id = configValidationObject.widget.children.id.children.name.validationResult[0].value || "";
        widgetInfo.name = configValidationObject.widget.children.widgetname.validationResult[0].value || "";
        widgetInfo.icon = configValidationObject.widget.children.icon.validationResult[0].value || "";
        widgetInfo.preferences = {};

        return widgetInfo;
    }
};
