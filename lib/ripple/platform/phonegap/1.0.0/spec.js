module.exports = {
    id: "phonegap",
    version: "1.0.0",
    name: "PhoneGap",
    type: "platform",

    persistencePrefix: "phonegap-",

    config: require('ripple/platform/phonegap/1.0.0/spec/config'),
    device: require('ripple/platform/phonegap/1.0.0/spec/device'),
    ui: require('ripple/platform/phonegap/1.0.0/spec/ui'),
    events: require('ripple/platform/phonegap/1.0.0/spec/events'),

    initialize: function () { },

    objects: {
        PhoneGap: {
            path: "phonegap/1.0.0/PhoneGap"
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
        Acceleration: {
            path: "phonegap/1.0.0/Acceleration"
        },
        navigator: {
            path: "phonegap/1.0.0/navigator",
            children: {
                accelerometer: {
                    path: "phonegap/1.0.0/accelerometer"
                },
                geolocation: {
                    path: "w3c/1.0/geolocation"
                },
                notification: {
                    path: "phonegap/1.0.0/notification"
                },
                contacts: {
                    path: "phonegap/1.0.0/contacts"
                },
                network: {
                    path: "phonegap/1.0.0/network"
                },
                camera: {
                    path: "phonegap/1.0.0/camera"
                },
                sms: {
                    path: "phonegap/1.0.0/sms"
                },
                telephony: {
                    path: "phonegap/1.0.0/telephony"
                },
                map: {
                    path: "phonegap/1.0.0/map"
                },
                orientation: {
                    path: "phonegap/1.0.0/orientation"
                },
                system: {
                    path: "phonegap/1.0.0/system"
                },
                compass: {
                    path: "phonegap/1.0.0/compass"
                }
            }
        },
        ContactError: {
            path: "phonegap/1.0.0/ContactError"
        },
        Contact: {
            path: "phonegap/1.0.0/Contact"
        },
        ContactName: {
            path: "phonegap/1.0.0/ContactName"
        },
        ContactAccount: {
            path: "phonegap/1.0.0/ContactAccount"
        },
        ContactAddress: {
            path: "phonegap/1.0.0/ContactAddress"
        },
        ContactOrganization: {
            path: "phonegap/1.0.0/ContactOrganization"
        },
        ContactFindOptions: {
            path: "phonegap/1.0.0/ContactFindOptions"
        },
        ContactField: {
            path: "phonegap/1.0.0/ContactField"
        },
        NetworkStatus: {
            path: "phonegap/1.0.0/NetworkStatus"
        },
        device: {
            path: "phonegap/1.0.0/device"
        },
        SystemInfoOptions: {
            path: "phonegap/1.0.0/SystemInfoOptions"
        },
        PowerAttributes: {
            path: "phonegap/1.0.0/PowerAttributes"
        },
        CPUAttributes: {
            path: "phonegap/1.0.0/CPUAttributes"
        },
        ThermalAttributes: {
            path: "phonegap/1.0.0/ThermalAttributes"
        },
        NetworkAttributes: {
            path: "phonegap/1.0.0/NetworkAttributes"
        },
        Connection: {
            path: "phonegap/1.0.0/Connection"
        },
        ConnectionAttributes: {
            path: "phonegap/1.0.0/ConnectionAttributes"
        },
        SensorAttributes: {
            path: "phonegap/1.0.0/SensorAttributes"
        },
        AVCodecsAttributes: {
            path: "phonegap/1.0.0/AVCodecsAttributes"
        },
        AudioCodecAttributes: {
            path: "phonegap/1.0.0/AudioCodecAttributes"
        },
        VideoCodecAttributes: {
            path: "phonegap/1.0.0/VideoCodecAttributes"
        },
        StorageUnitAttributes: {
            path: "phonegap/1.0.0/StorageUnitAttributes"
        },
        InputDevicesAttributes: {
            path: "phonegap/1.0.0/InputDevicesAttributes"
        },
        OutputDevicesAttributes: {
            path: "phonegap/1.0.0/OutputDevicesAttributes"
        },
        DisplayDeviceAttributes: {
            path: "phonegap/1.0.0/DisplayDeviceAttributes"
        },
        AudioDeviceAttributes: {
            path: "phonegap/1.0.0/AudioDeviceAttributes"
        },
        PrintingDeviceAttributes: {
            path: "phonegap/1.0.0/PrintingDeviceAttributes"
        },
        BrailleDeviceAttributes: {
            path: "phonegap/1.0.0/BrailleDeviceAttributes"
        },
        PointerAttributes: {
            path: "phonegap/1.0.0/PointerAttributes"
        },
        KeyboardAttributes: {
            path: "phonegap/1.0.0/KeyboardAttributes"
        },
        CameraAttributes: {
            path: "phonegap/1.0.0/CameraAttributes"
        },
        MicrophoneAttributes: {
            path: "phonegap/1.0.0/MicrophoneAttributes"
        }
    }

};
