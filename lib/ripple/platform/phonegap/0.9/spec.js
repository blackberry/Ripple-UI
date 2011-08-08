module.exports = {
    id: "phonegap",
    vrsion: "0.9",
    name: "PhoneGap",
    type: "platform",

    persistencePrefix: "phonegap-",

    config: require('ripple/platform/phonegap/0.9/spec/config'),
    device: require('ripple/platform/phonegap/0.9/spec/device'),
    ui: require('ripple/platform/phonegap/0.9/spec/ui'),

    objects: {
        PhoneGap: {
            path: "phonegap/0.9/PhoneGap"
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
            path: "phonegap/0.9/Acceleration"
        },
        navigator: {
            path: "phonegap/0.9/navigator",
            children: {
                accelerometer: {
                    path: "phonegap/0.9/accelerometer"
                },
                geolocation: {
                    path: "w3c/1.0/geolocation"
                },
                notification: {
                    path: "phonegap/0.9/notification"
                },
                service: {
                    path: "phonegap/0.9/service",
                    children: {
                        contacts: {
                            path: "phonegap/0.9/contacts"
                        }
                    }
                },
                network: {
                    path: "phonegap/0.9/network"
                },
                camera: {
                    path: "phonegap/0.9/camera"
                },
                file: {
                    path: "phonegap/0.9/file"
                },
                sms: {
                    path: "phonegap/0.9/sms"
                },
                telephony: {
                    path: "phonegap/0.9/telephony"
                },
                map: {
                    path: "phonegap/0.9/map"
                },
                orientation: {
                    path: "phonegap/0.9/orientation"
                },
                system: {
                    path: "phonegap/0.9/system"
                },
                compass: {
                    path: "phonegap/0.9/compass"
                }
            }
        },
        ContactError: {
            path: "phonegap/0.9/ContactError"
        },
        Contact: {
            path: "phonegap/0.9/Contact"
        },
        ContactName: {
            path: "phonegap/0.9/ContactName"
        },
        ContactAccount: {
            path: "phonegap/0.9/ContactAccount"
        },
        ContactAddress: {
            path: "phonegap/0.9/ContactAddress"
        },
        ContactOrganization: {
            path: "phonegap/0.9/ContactOrganization"
        },
        ContactFindOptions: {
            path: "phonegap/0.9/ContactFindOptions"
        },
        ContactField: {
            path: "phonegap/0.9/ContactField"
        },
        NetworkStatus: {
            path: "phonegap/0.9/NetworkStatus"
        },
        device: {
            path: "phonegap/0.9/device"
        },
        SystemInfoOptions: {
            path: "phonegap/0.9/SystemInfoOptions"
        },
        PowerAttributes: {
            path: "phonegap/0.9/PowerAttributes"
        },
        CPUAttributes: {
            path: "phonegap/0.9/CPUAttributes"
        },
        ThermalAttributes: {
            path: "phonegap/0.9/ThermalAttributes"
        },
        NetworkAttributes: {
            path: "phonegap/0.9/NetworkAttributes"
        },
        Connection: {
            path: "phonegap/0.9/Connection"
        },
        ConnectionAttributes: {
            path: "phonegap/0.9/ConnectionAttributes"
        },
        SensorAttributes: {
            path: "phonegap/0.9/SensorAttributes"
        },
        AVCodecsAttributes: {
            path: "phonegap/0.9/AVCodecsAttributes"
        },
        AudioCodecAttributes: {
            path: "phonegap/0.9/AudioCodecAttributes"
        },
        VideoCodecAttributes: {
            path: "phonegap/0.9/VideoCodecAttributes"
        },
        StorageUnitAttributes: {
            path: "phonegap/0.9/StorageUnitAttributes"
        },
        InputDevicesAttributes: {
            path: "phonegap/0.9/InputDevicesAttributes"
        },
        OutputDevicesAttributes: {
            path: "phonegap/0.9/OutputDevicesAttributes"
        },
        DisplayDeviceAttributes: {
            path: "phonegap/0.9/DisplayDeviceAttributes"
        },
        AudioDeviceAttributes: {
            path: "phonegap/0.9/AudioDeviceAttributes"
        },
        PrintingDeviceAttributes: {
            path: "phonegap/0.9/PrintingDeviceAttributes"
        },
        BrailleDeviceAttributes: {
            path: "phonegap/0.9/BrailleDeviceAttributes"
        },
        PointerAttributes: {
            path: "phonegap/0.9/PointerAttributes"
        },
        KeyboardAttributes: {
            path: "phonegap/0.9/KeyboardAttributes"
        },
        CameraAttributes: {
            path: "phonegap/0.9/CameraAttributes"
        },
        MicrophoneAttributes: {
            path: "phonegap/0.9/MicrophoneAttributes"
        },
        FileReader: {
            path: "phonegap/0.9/FileReader"
        },
        FileWriter: {
            path: "phonegap/0.9/FileWriter"
        }
    }

};
