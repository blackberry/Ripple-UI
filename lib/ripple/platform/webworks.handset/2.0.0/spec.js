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

    id: "webworks.handset",
    version: "2.0.0",
    name: "WebWorks",

    persistencePrefix: "rim-handset-",

    ui: require('ripple/platform/webworks.handset/2.0.0/spec/ui'),
    device: require('ripple/platform/webworks.handset/2.0.0/spec/device'),
    config: require('ripple/platform/webworks.core/2.0.0/spec/config'),
    events: require('ripple/platform/webworks.handset/2.0.0/spec/events'),

    initialize: function () {},

    objects: {
        XMLHttpRequest: {
            path: "webworks.handset/2.0.0/XMLHttpRequest"
        },
        Coordinates: {
            path: "w3c/1.0/Coordinates"
        },
        Position: {
            path: "w3c/1.0/Position"
        },
        PositionError: {
            path: "w3c/1.0/PositionError"
        },
        navigator: {
            path: "w3c/1.0/navigator",
            children: {
                geolocation: {
                    path: "w3c/1.0/geolocation"
                }
            }
        },
        blackberry: {
            path: "webworks.handset/2.0.0/client/blackberry",
            children: {
                pim: {
                    path: "webworks.handset/2.0.0/client/pim",
                    feature: "blackberry.pim.category|blackberry.pim.Task|blackberry.pim.Recurrence|blackberry.pim.Reminder|blackberry.pim.Appointment|blackberry.pim.Address|blackberry.pim.Attendee|blackberry.pim.Memo|blackberry.pim.Contact",
                    children: {
                        category: {
                            path: "webworks.handset/2.0.0/client/category",
                            feature: "blackberry.pim.category"
                        },
                        Task: {
                            path: "webworks.handset/2.0.0/client/Task",
                            feature: "blackberry.pim.Task"
                        },
                        Recurrence: {
                            path: "webworks.handset/2.0.0/client/Recurrence",
                            feature: "blackberry.pim.Recurrence"
                        },
                        Reminder: {
                            path: "webworks.handset/2.0.0/client/Reminder",
                            feature: "blackberry.pim.Reminder"
                        },
                        Appointment: {
                            path: "webworks.handset/2.0.0/client/Appointment",
                            feature: "blackberry.pim.Appointment"
                        },
                        Address: {
                            path: "webworks.handset/2.0.0/client/Address",
                            feature: "blackberry.pim.Address"
                        },
                        Attendee: {
                            path: "webworks.handset/2.0.0/client/Attendee",
                            feature: "blackberry.pim.Attendee"
                        },
                        Memo: {
                            path: "webworks.handset/2.0.0/client/Memo",
                            feature: "blackberry.pim.Memo"
                        },
                        Contact: {
                            path: "webworks.handset/2.0.0/client/Contact",
                            feature: "blackberry.pim.Contact"
                        }
                    }
                },
                phone: {
                    children: {
                        Phone: {
                            path: "webworks.handset/2.0.0/client/Phone",
                            feature: "blackberry.phone.Phone"
                        },
                        PhoneLogs: {
                            path: "webworks.handset/2.0.0/client/PhoneLogs",
                            feature: "blackberry.phone.PhoneLogs|blackberry.phone.Find",
                            children: {
                                CallLog: {
                                    path: "webworks.handset/2.0.0/client/CallLog"
                                }
                            }
                        },
                        Find: {
                            children: {
                                FilterExpression: {
                                    path: "webworks.handset/2.0.0/client/FilterExpression",
                                    feature: "blackberry.phone.Find"
                                }
                            }
                        }
                    }
                },
                message: {
                    path: "webworks.handset/2.0.0/client/messaging",
                    feature: "blackberry.message.sms|blackberry.message",
                    children: {
                        sms: {
                            path: "webworks.handset/2.0.0/client/sms",
                            feature: "blackberry.message.sms"
                        },
                        Message: {
                            path: "webworks.handset/2.0.0/client/Message",
                            feature: "blackberry.message"
                        }
                    }
                },
                transport: {
                    path: "webworks.core/2.0.0/client/transport"
                },
                events: {
                    path: "webworks.core/2.0.0/client/events"
                },
                app: {
                    path: "webworks.handset/2.0.0/client/app",
                    feature: "blackberry.app",
                    children: {
                        event: {
                            path: "webworks.handset/2.0.0/client/appEvent",
                            feature: "blackberry.app.event"
                        }
                    }
                },
                invoke: {
                    path: "webworks.handset/2.0.0/client/invoke",
                    feature: "blackberry.invoke",
                    children: {
                        AddressBookArguments: {
                            path: "webworks.handset/2.0.0/client/AddressBookArguments",
                            feature: "blackberry.invoke.AddressBookArguments"
                        },
                        BrowserArguments: {
                            path: "webworks.handset/2.0.0/client/BrowserArguments",
                            feature: "blackberry.invoke.BrowserArguments"
                        },
                        CameraArguments: {
                            path: "webworks.handset/2.0.0/client/CameraArguments",
                            feature: "blackberry.invoke.CameraArguments"
                        },
                        CalendarArguments: {
                            path: "webworks.handset/2.0.0/client/CalendarArguments",
                            feature: "blackberry.invoke.CalendarArguments"
                        },
                        JavaArguments: {
                            path: "webworks.handset/2.0.0/client/JavaArguments",
                            feature: "blackberry.invoke.JavaArguments"
                        },
                        MapsArguments: {
                            path: "webworks.handset/2.0.0/client/MapsArguments",
                            feature: "blackberry.invoke.MapsArguments"
                        },
                        MemoArguments: {
                            path: "webworks.handset/2.0.0/client/MemoArguments",
                            feature: "blackberry.invoke.MemoArguments"
                        },
                        MessageArguments: {
                            path: "webworks.handset/2.0.0/client/MessageArguments",
                            feature: "blackberry.invoke.MessageArguments"
                        },
                        PhoneArguments: {
                            path: "webworks.handset/2.0.0/client/PhoneArguments",
                            feature: "blackberry.invoke.PhoneArguments"
                        },
                        SearchArguments: {
                            path: "webworks.handset/2.0.0/client/SearchArguments",
                            feature: "blackberry.invoke.SearchArguments"
                        },
                        TaskArguments: {
                            path: "webworks.handset/2.0.0/client/TaskArguments",
                            feature: "blackberry.invoke.TaskArguments"
                        }
                    }
                },
                identity: {
                    path: "webworks.handset/2.0.0/client/identity",
                    feature: "blackberry.identity",
                    children: {
                        Transport: {
                            path: "webworks.handset/2.0.0/client/identity/Transport",
                            feature: "blackberry.identity"
                        },
                        Service: {
                            path: "webworks.handset/2.0.0/client/identity/Service",
                            feature: "blackberry.identity"
                        },
                        phone: {
                            path: "webworks.handset/2.0.0/client/identity/phone",
                            feature: "blackberry.identity.phone"
                        }
                    }
                },
                system: {
                    path: "webworks.handset/2.0.0/client/system",
                    feature: "blackberry.system",
                    children: {
                        event: {
                            path: "webworks.handset/2.0.0/client/systemEvent",
                            feature: "blackberry.system.event"
                        }
                    }
                },
                ui: {
                    children: {
                        dialog: {
                            path: "webworks.core/2.0.0/client/dialog",
                            feature: "blackberry.ui.dialog"
                        },
                        menu: {
                            path: "webworks.handset/2.0.0/client/menu",
                            children: {
                                MenuItem: {
                                    path: "webworks.handset/2.0.0/client/MenuItem"
                                }
                            }
                        }
                    }
                },
                utils: {
                    path: "webworks.core/2.0.0/client/utils",
                    feature: "blackberry.utils"
                },
                find: {
                    feature: "blackberry.find",
                    children: {
                        FilterExpression: {
                            path: "webworks.handset/2.0.0/client/FilterExpression",
                            feature: "blackberry.find"
                        }
                    }
                },
                push: {
                    path: "webworks.handset/2.0.0/client/push",
                    feature: "blackberry.push"
                },
                audio: {
                    path: "webworks.handset/2.0.0/client/audio",
                    feature: "blackberry.audio",
                    children: {
                        Player: {
                            path: "webworks.handset/2.0.0/client/AudioPlayer",
                            feature: "blackberry.audio.Player"
                        }
                    }
                },
                io: {
                    children: {
                        dir: {
                            path: "webworks.handset/2.0.0/client/io/dir",
                            feature: "blackberry.io.dir"
                        },
                        file: {
                            path: "webworks.core/2.0.0/client/io/file",
                            feature: "blackberry.io.file"
                        }
                    }
                }
            }
        }
    }
};
