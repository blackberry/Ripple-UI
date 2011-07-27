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
module.exports = {

    id: "vodafone",
    version: "2.7",
    name: "Vodafone",
    type: "carrier",

    persistencePrefix: "vodafone-",

    config: require('ripple/platform/vodafone/2.7/spec/config'),
    device: require('ripple/platform/vodafone/2.7/spec/device'),
    ui: require('ripple/platform/vodafone/2.7/spec/ui'),
    events: require('ripple/platform/vodafone/2.7/spec/events'),

    objects: {
        navigator: {
            path: "w3c/1.0/navigator"
        },
        WidgetManager: {
            path: "wac/1.0/WidgetManager"
        },
        Widget: {
            path: "wac/1.0/Widget",
            children: {
                Device: {
                    path: "wac/1.0/Device",
                    children: {
                        AccountInfo: {
                            path: "wac/1.0/AccountInfo"
                        },
                        ApplicationTypes: {
                            path: "wac/1.0/ApplicationTypes"
                        },
                        DataNetworkInfo: {
                            path: "wac/1.0/DataNetworkInfo",
                            children: {
                                DataNetworkConnectionTypes: {
                                    path: "wac/1.0/DataNetworkConnectionTypes"
                                }
                            }
                        },
                        DeviceInfo: {
                            path: "wac/1.0/DeviceInfo"
                        },
                        DeviceStateInfo: {
                            path: "vodafone/2.7/DeviceStateInfo",
                            children: {
                                AccelerometerInfo: {
                                    path: "wac/1.0/AccelerometerInfo"
                                }
                            }
                        },
                        File: {
                            path: "wac/1.0/File"
                        },
                        PositionInfo: {
                            path: "wac/1.0/PositionInfo"
                        },
                        RadioInfo: {
                            path: "wac/1.0/RadioInfo",
                            children: {
                                RadioSignalSourceTypes: {
                                    path: "wac/1.0/RadioSignalSourceTypes"
                                }
                            }
                        }
                    }
                },
                ExceptionTypes: {
                    path: "wac/1.0/ExceptionTypes"
                },
                Exception: {
                    path: "wac/1.0/Exception"
                },
                PIM: {
                    path: "wac/1.0/PIM",
                    children: {
                        AddressBookItem: {
                            path: "wac/1.0/AddressBookItem"
                        },
                        CalendarItem: {
                            path: "wac/1.0/CalendarItem"
                        },
                        EventRecurrenceTypes: {
                            path: "wac/1.0/EventRecurrenceTypes"
                        }
                    }
                },
                Multimedia: {
                    path: "wac/1.0/Multimedia",
                    children: {
                        Camera: {
                            path: "wac/1.0/Camera"
                        },
                        AudioPlayer: {
                            path: "wac/1.0/AudioPlayer"
                        }
                    }
                }
            }
        },
        widget: {
            path: "opera/4.0/widget"
        },
        defaultStatus: {
            path: "opera/4.0/defaultStatus"
        },
        moveBy: {
            path: "opera/4.0/moveBy"
        },
        moveTo: {
            path: "opera/4.0/moveTo"
        },
        resizeBy: {
            path: "opera/4.0/resizeBy"
        },
        resizeTo: {
            path: "opera/4.0/resizeTo"
        },
        status: {
            path: "opera/4.0/status"
        }
    }

};
