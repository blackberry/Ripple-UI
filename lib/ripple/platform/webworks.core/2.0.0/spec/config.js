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
var utils = require('ripple/utils');

module.exports = {
    fileName: "config.xml",
    validateVersion: function (config) {
        return true;
    },
    extractInfo: function (config) {
        if (!config) {
            return null;
        }

        var widgetInfo = {},
            widgetFeatures = config.widget.children.feature.validationResult,
            accessUrls = config.widget.children.access.validationResult,
            accessFeatures = config.widget.children.access.children.feature.validationResult,
            toFeature = function (validationResult) {
                return {
                    id: validationResult.attributes.id.value,
                    required: !validationResult.attributes.required || validationResult.attributes.required.value,
                    URIs: []
                };
            };

        widgetInfo.id = config.widget.validationResult[0].attributes.id.value;
        widgetInfo.name = config.widget.children.name.validationResult[0].value;
        widgetInfo.icon = config.widget.children.icon.validationResult[0].attributes.src.value;
        widgetInfo.version = config.widget.validationResult[0].attributes.version.value;
        widgetInfo.author = config.widget.children.author.validationResult[0].value;
        widgetInfo.authorEmail = config.widget.children.author.validationResult[0].attributes.email.value;
        widgetInfo.authorURL = config.widget.children.author.validationResult[0].attributes.href.value;
        widgetInfo.copyright = config.widget.children.author.validationResult[0].attributes["rim:copyright"].value;
        widgetInfo.description = config.widget.children.description.validationResult[0].value;
        if (config.widget.children.license.validationResult[0]) {
            widgetInfo.license = config.widget.children.license.validationResult[0].value;
            widgetInfo.licenseURL = config.widget.children.license.validationResult[0].attributes.href.value;
        }

        widgetInfo.features = widgetFeatures.reduce(function (features, validationResult) {
            if (validationResult.valid) {
                var feature = toFeature(validationResult);
                feature.URIs.push({
                    value: utils.location().href,
                    subdomains: true
                });
                features = features || {};
                features[feature.id] = feature;
            }
            return features;
        }, {});

        widgetInfo.features = accessUrls.map(function (access) {
            return {
                uri: access.attributes.uri.value,
                subdomains: access.attributes.subdomains.value,
                features: accessFeatures ? accessFeatures.filter(function (f) {
                    return f.node && f.node.parentNode && f.node.parentNode.attributes.uri.value === access.attributes.uri.value;
                }) : null
            };
        }).reduce(function (result, access) {
            return access.features ? access.features.reduce(function (features, validationResult) {
                var feature = features[validationResult.attributes.id.value] || toFeature(validationResult);
                feature.URIs.push({
                    value: access.uri,
                    subdomains: access.subdomains
                });
                features[feature.id] = feature;
                return features;
            }, result) : result;
        }, widgetInfo.features);

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
                "xmlns:rim": {
                    attributeName: "xmlns:rim",
                    required: true,
                    type: "list",
                    listValues: ["http://www.blackberry.com/ns/widgets"]
                },
                "xml:lang": {
                    attributeName: "xml:lang",
                    required: false,
                    type: "iso-language"
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
                "rim:header": {
                    attributeName: "rim:header",
                    required: false,
                    type: "string"
                },
                "rim:backButton": {
                    attributeName: "rim:backButton",
                    required: false,
                    type: "string"
                }
            },
            children: {
                name: {
                    nodeName: "name",
                    required: true,
                    occurrence: 1,
                    attributes: {
                        "xml:lang": {
                            attributeName: "xml:lang",
                            required: false,
                            type: "iso-language"
                        },
                        "its:dir": {
                            attributeName: "its:dir",
                            required: false,
                            type: "list",
                            listValues: ["rtl", "ltr", "lro", "rlo"]
                        }
                    }
                },
                description: {
                    nodeName: "description",
                    required: false,
                    occurrence: 1,
                    attributes: {
                        "xml:lang": {
                            attributeName: "xml:lang",
                            required: false,
                            type: "iso-language"
                        },
                        "its:dir": {
                            attributeName: "its:dir",
                            required: false,
                            type: "list",
                            listValues: ["rtl", "ltr", "lro", "rlo"]
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
                        "rim:hover": {
                            attributeName: "rim:hover",
                            type: "boolean",
                            required: false
                        }
                    }
                },
                author: {
                    nodeName: "author",
                    required: false,
                    occurrence: 1,
                    attributes: {
                        href: {
                            attributeName: "href",
                            type: "string",
                            required: false
                        },
                        "rim:copyright": {
                            attributeName: "rim:copyright",
                            type: "string",
                            required: false
                        },
                        email: {
                            attributeName: "email",
                            type: "string",
                            required: false
                        },
                        "xml:lang": {
                            attributeName: "xml:lang",
                            required: false,
                            type: "iso-language"
                        },
                        "its:dir": {
                            attributeName: "its:dir",
                            required: false,
                            type: "list",
                            listValues: ["rtl", "ltr", "lro", "rlo"]
                        }
                    }
                },
                license: {
                    nodeName: "license",
                    required: false,
                    occurrence: 1,
                    attributes : {
                        href: {
                            attributeName: "href",
                            type: "string",
                            required: false
                        },
                        "xml:lang": {
                            attributeName: "xml:lang",
                            required: false,
                            type: "iso-language"
                        },
                        "its:dir": {
                            attributeName: "its:dir",
                            required: false,
                            type: "list",
                            listValues: ["rtl", "ltr", "lro", "rlo"]
                        }
                    }
                },
                "rim:cache": {
                    nodeName: "rim:cache",
                    required: false,
                    occurrence: 1,
                    attributes: {
                        disableAllCache: {
                            attributeName: "disableAllCache",
                            required: false,
                            type: "boolean"
                        },
                        aggressiveCacheAge: {
                            attributeName: "aggressiveCacheAge",
                            required: false,
                            type: "number"
                        },
                        maxCacheSizeTotal: {
                            attributeName: "maxCacheSizeTotal",
                            required: false,
                            type: "number"
                        },
                        maxCacheSizeItem: {
                            attributeName: "maxCacheSizeItem",
                            required: false,
                            type: "number"
                        }
                    }
                },
                access: {
                    nodeName: "access",
                    required: false,
                    occurrence: 0,
                    attributes: {
                        uri: {
                            attributeName: "uri",
                            required: true,
                            type: "string"
                        },
                        subdomains: {
                            attributeName: "subdomains",
                            required: false,
                            type: "boolean"
                        }
                    },
                    children: {
                        feature: {
                            nodeName: "feature",
                            required: false,
                            occurrence: 0,
                            attributes: {
                                id: {
                                    attributeName: "id",
                                    required: true,
                                    //TODO: this should be a list
                                    type: "string"
                                },
                                required: {
                                    attributeName: "required",
                                    required: false,
                                    type: "boolean"
                                },
                                version: {
                                    attributeName: "version",
                                    required: false,
                                    type: "string"
                                }
                            }
                        }
                    }
                },
                feature: {
                    nodeName: "feature",
                    required: false,
                    occurrence: 0,
                    attributes: {
                        id: {
                            attributeName: "id",
                            required: true,
                            //TODO: this should be a list
                            type: "string"
                        },
                        required: {
                            attributeName: "required",
                            required: false,
                            type: "boolean"
                        },
                        version: {
                            attributeName: "version",
                            required: false,
                            type: "string"
                        }
                    }
                },
                "rim:loadingScreen": {
                    nodeName: "rim:loadingScreen",
                    required: false,
                    occurrence: 1,
                    attributes: {
                        backgroundColor: {
                            attributeName: "backgroundColor",
                            required: false,
                            type: "string"
                        },
                        backgroundImage: {
                            attributeName: "backgroundImage",
                            required: false,
                            type: "string"
                        },
                        foregroundImage: {
                            attributeName: "foregroundImage",
                            required: false,
                            type: "string"
                        },
                        onRemotePageLoad: {
                            attributeName: "onRemotePageLoad",
                            required: false,
                            type: "boolean"
                        },
                        onLocalPageLoad: {
                            attributeName: "onLocalPageLoad",
                            required : false,
                            type: "boolean"
                        },
                        onFirstLaunch: {
                            attributeName: "onFirstLaunch",
                            required: false,
                            type: "boolean"
                        }
                    },
                    children: {
                        "rim:transitionEffect": {
                            nodeName: "rim:transitionEffect",
                            required: false,
                            occurrence: 1,
                            attributes: {
                                "type": {
                                    attributeName: "type",
                                    required: true,
                                    type: "list",
                                    listValues: ["slidePush", "slideOver", "fadeIn", "fadeOut", "wipeIn", "wipeOut", "zoomIn", "zoomOut"]
                                },
                                duration: {
                                    attributeName: "duration",
                                    required: false,
                                    type: "number"
                                },
                                direction: {
                                    attributeName: "direction",
                                    required: false,
                                    type: "list",
                                    listValues: ["left", "right", "up", "down"]
                                }
                            }
                        }
                    }
                },
                "rim:connection": {
                    nodeName: "rim:connection",
                    required: false,
                    occurrence: 1,
                    attributes: {
                        timeout: {
                            attributeName: "timeout",
                            required: false,
                            type: "number"
                        }
                    },
                    children: {
                        id: {
                            nodeName: "id",
                            required: false,
                            occurrence: 0
                        }
                    }
                },
                "rim:navigation": {
                    nodeName: "rim:navigation",
                    required: false,
                    occurrence: 1,
                    attributes: {
                        mode: {
                            attributeName: "mode",
                            required: false,
                            type: "list",
                            listValues: ["focus"]
                        }
                    }
                },
                "content": {
                    nodeName: "content",
                    required: true,
                    occurrence: 1,
                    attributes: {
                        src: {
                            attributeName: "src",
                            required: true,
                            type: "string"
                        },
                        type: {
                            attributeName: "type",
                            required: false,
                            type: "string"
                        },
                        charset: {
                            attributeName: "charset",
                            required: false,
                            type: "string"
                        }
                    }
                }
            }
        }
    }
};
