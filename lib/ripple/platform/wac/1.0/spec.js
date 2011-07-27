module.exports = {

    id: "wac",
    version: "1.0",
    name: "WAC",
    type: "plaform",

    persistencePrefix: "wac-",

    config: require('ripple/platform/wac/1.0/spec/config'),
    device: require('ripple/platform/wac/1.0/spec/device'),
    ui: require('ripple/platform/wac/1.0/spec/ui'),
    events: require('ripple/platform/wac/1.0/spec/events'),

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
                            path: "wac/1.0/DeviceStateInfo",
                            children: {
                                Config: {
                                    path: "wac/1.0/Config"
                                },
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
                        },
                        PowerInfo: {
                            path: "wac/1.0/PowerInfo"
                        }
                    }
                },
                ExceptionTypes: {
                    path: "wac/1.0/ExceptionTypes"
                },
                Exception: {
                    path: "wac/1.0/Exception"
                },
                Multimedia: {
                    path: "wac/1.0/Multimedia",
                    children: {
                        Camera: {
                            path: "wac/1.0/Camera"
                        },
                        AudioPlayer: {
                            path: "wac/1.0/AudioPlayer"
                        },
                        VideoPlayer: {
                            path: "wac/1.0/VideoPlayer"
                        }
                    }
                },
                Telephony: {
                    path: "wac/1.0/Telephony",
                    children: {
                        CallRecord: {
                            path: "wac/1.0/CallRecord"
                        },
                        CallRecordTypes: {
                            path: "wac/1.0/CallRecordTypes"
                        }
                    }
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
                Messaging: {
                    path: "wac/1.0/Messaging",
                    children: {
                        Account: {
                            path: "wac/1.0/Account"
                        },
                        Attachment: {
                            path: "wac/1.0/Attachment"
                        },
                        Message: {
                            path: "wac/1.0/Message"
                        },
                        MessageFolderTypes: {
                            path: "wac/1.0/MessageFolderTypes"
                        },
                        MessageQuantities: {
                            path: "wac/1.0/MessageQuantities"
                        },
                        MessageTypes: {
                            path: "wac/1.0/MessageTypes"
                        }
                    }
                }
            }
        }
    }

};
