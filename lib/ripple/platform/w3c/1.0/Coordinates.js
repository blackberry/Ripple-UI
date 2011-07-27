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
module.exports = function (latitude, longitude, altitude, accuracy, altitudeAccuracy, heading, speed) {
    return {
        latitude: latitude || 0,                    //Latitude in decimal degrees. (Number)
        longitude: longitude || 0,                  //Longitude in decimal degrees. (Number)
        altitude: altitude || 0,                    //Height of the position in meters above the ellipsoid. (Number)
        accuracy: accuracy || 0,                    //Accuracy level of the latitude and longitude coordinates in meters. (Number)
        altitudeAccuracy: altitudeAccuracy || 0,    //Accuracy level of the altitude coordinate in meters. (Number)
        heading: heading || 0,                      //Direction of travel, specified in degrees counting clockwise relative to the true north. (Number)
        speed: speed || 0                           //Current ground speed of the device, specified in meters per second. (Number)
    };
};
