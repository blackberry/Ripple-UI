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
var constants = require('ripple/constants'),
    geo = require('ripple/geo'),
    db = require('ripple/db'),
    event = require('ripple/event'),
    utils = require('ripple/utils'),
    platform = require('ripple/platform'),
    _gpsMapZoomLevel;

function _updateGpsMap() {
    var positionInfo = geo.getPositionInfo(),
            geoImageDiv = document.getElementById(constants.COMMON.GEO_MAP_IMAGE_ID),
            geoZoomValue = document.getElementById(constants.GEO.MAP_ZOOM_LEVEL_CONTAINER);

    if (geoImageDiv) {
        geoImageDiv.setAttribute("src", constants.SERVICES.GOOGLE_MAPS_URI +
                "&center=" +
                positionInfo.latitude + "," + positionInfo.longitude + "&sensor=false&zoom=" +
                _gpsMapZoomLevel.toString() + "&key=" +
                constants.SERVICES.GOOGLE_MAPS_API_KEY);
    }

    if (geoZoomValue) {
        geoZoomValue.innerText = _gpsMapZoomLevel;
    }
}

function _updateGpsMapZoom(goUp) {
    if (goUp && _gpsMapZoomLevel < constants.GEO.MAP_ZOOM_MAX) {
        _gpsMapZoomLevel++;
    }
    else if (!goUp && _gpsMapZoomLevel > constants.GEO.MAP_ZOOM_MIN) {
        _gpsMapZoomLevel--;
    }
    document.getElementById(constants.GEO.MAP_ZOOM_LEVEL_CONTAINER).innerHTML = _gpsMapZoomLevel;

    _updateGpsMap();

    db.save(constants.GEO.MAP_ZOOM_KEY, _gpsMapZoomLevel);
}

function _getTextHeading(heading) {
    if (heading >= 337.5 || (heading >= 0 && heading <= 22.5)) {
        return 'N';
    }

    if (heading >= 22.5 && heading <= 67.5) {
        return 'NE';
    }

    if (heading >= 67.5 && heading <= 112.5) {
        return 'E';
    }
    if (heading >= 112.5 && heading <= 157.5) {
        return 'SE';
    }

    if (heading >= 157.5 && heading <= 202.5) {
        return 'S';
    }

    if (heading >= 202.5 && heading <= 247.5) {
        return 'SW';
    }

    if (heading >= 247.5 && heading <= 292.5) {
        return 'W';
    }

    if (heading >= 292.5 && heading <= 337.5) {
        return 'NW';
    }
}

module.exports = {
    panel: {
        domId: "gps-container",
        collapsed: true,
        pane: "right"
    },

    initialize: function () {
        var GEO_OPTIONS = constants.GEO.OPTIONS,
            positionInfo = geo.getPositionInfo(),
            positionEvent = "PositionInfoUpdatedEvent",
            latitude = document.getElementById(GEO_OPTIONS.LATITUDE),
            longitude = document.getElementById(GEO_OPTIONS.LONGITUDE),
            altitude = document.getElementById(GEO_OPTIONS.ALTITUDE),
            accuracy = document.getElementById(GEO_OPTIONS.ACCURACY),
            altitudeAccuracy = document.getElementById(GEO_OPTIONS.ALTITUDE_ACCURACY),
            heading = document.getElementById(GEO_OPTIONS.HEADING),
            speed = document.getElementById(GEO_OPTIONS.SPEED),
            cellID = document.getElementById(GEO_OPTIONS.CELL_ID),
            delay = document.getElementById(GEO_OPTIONS.DELAY),
            delayLabel = document.getElementById(GEO_OPTIONS.DELAY_LABEL),
            headingLabel = document.getElementById(GEO_OPTIONS.HEADING_LABEL),
            headingMapLabel = document.getElementById(GEO_OPTIONS.HEADING_MAP_LABEL),
            timeout = document.getElementById(GEO_OPTIONS.TIMEOUT),
            geoImage = document.getElementById(GEO_OPTIONS.IMAGE);


        function updateGeo() {
            geo.updatePositionInfo({
                latitude: parseFloat(latitude.value),
                longitude: parseFloat(longitude.value),
                altitude: parseInt(altitude.value, 10),
                accuracy: parseInt(accuracy.value, 10),
                altitudeAccuracy: parseInt(altitudeAccuracy.value, 10),
                heading: heading.value ? parseFloat(heading.value) : 0, // HACK: see techdebt http://www.pivotaltracker.com/story/show/5478847
                speed: speed.value ? parseInt(speed.value, 10) : 0, // HACK: see techdebt http://www.pivotaltracker.com/story/show/5478847
                cellID: cellID.value,
                timeStamp: new Date()
            },
            delay.value,
            timeout.checked);
        }

        function updateHeadingValues() {
            var headingDeg = parseFloat(heading.value),
                headingText = _getTextHeading(parseFloat(heading.value));

            headingLabel.innerText = headingText;
            headingMapLabel.innerHTML = headingText + "</br>" + headingDeg + "&deg;";
            geoImage.setAttribute("style", "-webkit-transform: rotate(-" + headingDeg + "deg);");
        }

        function initializeValues() {
            latitude.value =          positionInfo.latitude;
            longitude.value =         positionInfo.longitude;
            altitude.value =          positionInfo.altitude;
            accuracy.value =          positionInfo.accuracy;
            altitudeAccuracy.value =  positionInfo.altitudeAccuracy;
            cellID.value =            positionInfo.cellID;
            delay.value = document.getElementById(GEO_OPTIONS.DELAY_LABEL).innerText = geo.delay || 0;
            if (geo.timeout) {
                timeout.checked = true;
            }
            updateHeadingValues();
        }

        // HACK: see techdebt http://www.pivotaltracker.com/story/show/5478847 (double HACK!!!)
        if (platform.current().id === 'phonegap' || platform.current().id === 'webworks') {
            // make the fields visible
            jQuery("#geo-cellid-container").hide();
            jQuery("#geo-heading-container").show();
            jQuery("#geo-speed-container").show();
        }
        else {
            jQuery("#geo-cellid-container").show();
            jQuery("#geo-heading-container").hide();
            jQuery("#geo-speed-container").hide();
        }

        _gpsMapZoomLevel = db.retrieve(constants.GEO.MAP_ZOOM_KEY) || 14;

        jQuery("#geo-map-zoom-decrease").bind("click", function () {
            _updateGpsMapZoom(false);
        });

        jQuery("#geo-map-zoom-increase").bind("click", function () {
            _updateGpsMapZoom(true);
        });

        utils.bindAutoSaveEvent(jQuery("#" + GEO_OPTIONS.LATITUDE), updateGeo);
        utils.bindAutoSaveEvent(jQuery("#" + GEO_OPTIONS.LONGITUDE), updateGeo);
        utils.bindAutoSaveEvent(jQuery("#" + GEO_OPTIONS.ALTITUDE), updateGeo);
        utils.bindAutoSaveEvent(jQuery("#" + GEO_OPTIONS.ACCURACY), updateGeo);
        utils.bindAutoSaveEvent(jQuery("#" + GEO_OPTIONS.ALTITUDE_ACCURACY), updateGeo);
        utils.bindAutoSaveEvent(jQuery("#" + GEO_OPTIONS.CELL_ID), updateGeo);
        jQuery("#" + GEO_OPTIONS.DELAY).bind("change", function () {
            updateGeo();
            delayLabel.innerText = delay.value;
        });
        jQuery("#" + GEO_OPTIONS.TIMEOUT).bind("click", function () {
            updateGeo();
        });

        // HACK: see techdebt http://www.pivotaltracker.com/story/show/5478847 (double HACK!!!)
        if (platform.current().id === 'phonegap' || platform.current().id === 'webworks') {
            jQuery("#" + GEO_OPTIONS.HEADING).bind("change", function () {
                updateGeo();
                updateHeadingValues();
            });

            utils.bindAutoSaveEvent(jQuery("#" + GEO_OPTIONS.SPEED), updateGeo);
            heading.value =       positionInfo.heading;
            speed.value =         positionInfo.speed;
        }

        initializeValues();

        event.on(positionEvent, function () {
            _updateGpsMap();
        });

        event.trigger(positionEvent, [{
                latitude: latitude.value,
                longitude: longitude.value,
                altitude: altitude.value,
                accuracy: accuracy.value,
                altitudeAccuracy: altitudeAccuracy.value,
                heading: heading ? heading.value : 0, // HACK: see techdebt http://www.pivotaltracker.com/story/show/5478847
                speed: speed ? speed.value : 0, // HACK: see techdebt http://www.pivotaltracker.com/story/show/5478847
                cellID: cellID.value,
                timeStamp: new Date()
            }]);
    }
};
