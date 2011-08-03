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
describe("webworks_config", function () {
    var config = require('ripple/platform/webworks.core/2.0.0/spec/config'),
        utils = require('ripple/utils'),
        stub = {
            widget: {
                children: {
                    name: {
                        validationResult: [{
                            value: "Jimmy"
                        }]
                    },
                    icon: {
                        validationResult: [{
                            attributes: {
                                src: {
                                    value: "icon.png"
                                }
                            }
                        }]
                    },
                    author: {
                        validationResult: [{
                            value: "Hemingway",
                            attributes: {
                                email: {
                                    value: "ernest@hemingway.com"
                                },
                                href: {
                                    value: "www.hemingway.com"
                                },
                                "rim:copyright": {
                                    value: "2011"
                                }
                            }
                        }]
                    },
                    description: {
                        validationResult: [{
                            value: "teh awesome!"
                        }]
                    },
                    license: {
                        validationResult: [{
                            value: "WTFPL",
                            attributes: {
                                href: {
                                    value: "http://sam.zoy.org/wtfpl/COPYING"
                                }
                            }
                        }]
                    },
                    feature: {
                        validationResult: [{
                            attributes: {
                                id: {
                                    value: "blackberry.ui.dialog"
                                },
                                required: {
                                    value: false
                                }
                            },
                            valid: true
                        }]
                    },
                    "access": {
                        validationResult: [{
                            attributes: {
                                uri: {
                                    value: "http://www.somedomain.com"
                                },
                                subdomains: {
                                    value: true
                                }
                            },
                            valid: true,
                            children: {
                                feature: {
                                    validationResult: [{
                                        attributes: {
                                            id: {
                                                value: "blackberry.pim.memo"
                                            }
                                        }
                                    }, {
                                        attributes: {
                                            id: {
                                                value: "blackberry.invoke"
                                            }
                                        }
                                    }]
                                }
                            }
                        }, {
                            attributes: {
                                uri: {
                                    value: "http://www.otherdomain.com"
                                },
                                subdomains: {
                                    value: false
                                }
                            },
                            valid: true,
                            children: {
                                feature: {
                                    validationResult: [{
                                        attributes: {
                                            id: {
                                                value: "blackberry.invoke"
                                            }
                                        }
                                    }]
                                }
                            }
                        }]
                    }
                },
                validationResult: [{
                    attributes: {
                        version: {
                            value: "1.0"
                        },
                        id : {
                            value: "unique"
                        }
                    },
                    valid: true
                }]
            }
        };

    beforeEach(function () {
    });

    afterEach(function () {
    });

    it("returns null when no config is passed in", function () {
        expect(config.extractInfo()).toBeNull();
    });

    it("extracts id field from config", function () {
        expect(config.extractInfo(stub).id).toBe("unique");
    });

    it("extracts icon field from config", function () {
        expect(config.extractInfo(stub).icon).toBe("icon.png");
    });

    it("extracts version field from config", function () {
        expect(config.extractInfo(stub).version).toBe("1.0");
    });

    it("extracts author field from config", function () {
        expect(config.extractInfo(stub).author).toBe("Hemingway");
    });

    it("extracts email field from config", function () {
        expect(config.extractInfo(stub).authorEmail).toBe("ernest@hemingway.com");
    });

    it("extracts href field from config", function () {
        expect(config.extractInfo(stub).authorURL).toBe("www.hemingway.com");
    });

    it("extracts copyright field from config", function () {
        expect(config.extractInfo(stub).copyright).toBe("2011");
    });

    it("extracts description field from config", function () {
        expect(config.extractInfo(stub).description).toBe("teh awesome!");
    });

    it("extracts license field from config", function () {
        expect(config.extractInfo(stub).license).toBe("WTFPL");
    });

    it("extracts licenseURL field from config", function () {
        expect(config.extractInfo(stub).licenseURL).toBe("http://sam.zoy.org/wtfpl/COPYING");
    });

    it("extracts the features from the config", function () {
        var total = utils.count(config.extractInfo(stub).features);
        expect(total).toBe(3);
    });

    it("extracts features nested under the widget object", function () {
        var feature = config.extractInfo(stub).features["blackberry.ui.dialog"];
        expect(feature.id).toBe("blackberry.ui.dialog");
    });

    it("extracts features nested under the access object", function () {
        var feature = config.extractInfo(stub).features["blackberry.pim.memo"];
        expect(feature.id).toBe("blackberry.pim.memo");
    });

    it("extracts features under the widget object with the uri as the window.location", function () {
        var feature = config.extractInfo(stub).features["blackberry.ui.dialog"];
        expect(feature.URIs[0].value).toBe(window.location.href);
        expect(feature.URIs[0].subdomains).toBe(true);
    });

    it("extracts features under the access object with the uri as the access uri", function () {
        var feature = config.extractInfo(stub).features["blackberry.pim.memo"];
        expect(feature.URIs[0].value).toBe("http://www.somedomain.com");
        expect(feature.URIs[0].subdomains).toBe(true);
    });

    it("sets required to be true when no node is present", function () {
        var feature = config.extractInfo(stub).features["blackberry.pim.memo"];
        expect(feature.required).toBe(true);
    });

    it("sets the required value from the node", function () {
        var feature = config.extractInfo(stub).features["blackberry.ui.dialog"];
        expect(feature.required).toBe(false);
    });

    it("collects all the access urls under the same feature", function () {
        var feature = config.extractInfo(stub).features["blackberry.invoke"];
        expect(feature.URIs.length).toBe(2);
        expect(feature.URIs[0].subdomains).toBe(true);
        expect(feature.URIs[1].subdomains).toBe(false);
    });
});
