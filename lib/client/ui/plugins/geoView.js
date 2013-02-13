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
var constants = ripple('constants'),
    geo = ripple('geo'),
    db = ripple('db'),
    event = ripple('event'),
    utils = ripple('utils'),
    platform = ripple('platform'),
    _gpsMapZoomLevel;

function _updateGpsMap() {
    var positionInfo = geo.getPositionInfo(),
            mapContainer = document.getElementById(constants.GEO.OPTIONS.MAP_CONTAINER),
            geoZoomValue = document.getElementById(constants.GEO.MAP_ZOOM_LEVEL_CONTAINER);

    if (mapContainer) {
        geo.map.setCenter(new OpenLayers.LonLat(positionInfo.longitude, positionInfo.latitude) // Center of the map
            .transform(
              new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
              new OpenLayers.Projection("EPSG:900913") // to Spherical Mercator Projection
            ),
            _gpsMapZoomLevel,
            true // don't trigger dragging events
        );
    }

    if (geoZoomValue) {
        geoZoomValue.innerHTML = _gpsMapZoomLevel;
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
            gpxMultiplier = document.getElementById(GEO_OPTIONS.GPXMULTIPLIER),
            gpxReplayStatus = document.getElementById(GEO_OPTIONS.GPXREPLAYSTATUS),
            gpxGo = $(document.getElementById(GEO_OPTIONS.GPXGO)).find("span")[0],
            mapMarker = document.getElementById(GEO_OPTIONS.MAP_MARKER),
            mapContainer = document.getElementById(GEO_OPTIONS.MAP_CONTAINER),
            map = null,
            track = [],
            _replayingGpxFile = false,
            _haltGpxReplay = false;


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

            headingLabel.innerHTML = headingText;
            headingMapLabel.innerHTML = headingText + "</br>" + headingDeg + "&deg;";
            mapMarker.setAttribute("style", "-webkit-transform: rotate(" + headingDeg + "deg);");
        }

        function updateValsFromMap() {
            var center = geo.map.getCenter().transform(
                new OpenLayers.Projection("EPSG:900913"),
                new OpenLayers.Projection("EPSG:4326"));
            longitude.value = center.lon;
            latitude.value = center.lat;
            updateGeo();
        }

        function initializeValues() {
            latitude.value =          positionInfo.latitude;
            longitude.value =         positionInfo.longitude;
            altitude.value =          positionInfo.altitude;
            accuracy.value =          positionInfo.accuracy;
            altitudeAccuracy.value =  positionInfo.altitudeAccuracy;
            cellID.value =            positionInfo.cellID;
            delay.value = document.getElementById(GEO_OPTIONS.DELAY_LABEL).innerHTML = geo.delay || 0;
            if (geo.timeout) {
                timeout.checked = true;
            }
            updateHeadingValues();
        }

        function initMap() {
            // override image location so we don't have to include image assets
            OpenLayers.ImgPath = 'http://openlayers.org/api/img/';

            // init map
            geo.map = new OpenLayers.Map(mapContainer, {controls: [], theme: null});

            // add controls and OSM map layer
            geo.map.addLayer(new OpenLayers.Layer.OSM());
            geo.map.addControl(new OpenLayers.Control.Navigation());

            // override behaviour of click to pan and double click to zoom in
            var clickHandler = new OpenLayers.Handler.Click(
                this,
                {
                    click: function (e) {
                        var lonlat = geo.map.getLonLatFromViewPortPx(e.xy);
                        geo.map.panTo(new OpenLayers.LonLat(lonlat.lon, lonlat.lat), _gpsMapZoomLevel);
                    },

                    dblclick: function () {
                        _updateGpsMapZoom(true);
                    }
                },
                {double: true}
            );

            // add click handler to map
            clickHandler.setMap(geo.map);
            clickHandler.activate();

            // update long and lat when map is panned
            geo.map.events.register("moveend", map, function () {
                updateValsFromMap();
            });

            event.on("ApplicationState", function (obj) {
                if (obj && obj[0].id === 'gps-container' && obj.hasClass('ui-box-open')) {
                    _updateGpsMap();
                }
            });
        }

        function loadGpxFile(win, fail, args) {
            var reader = new FileReader(),
                file = args[0],
                _xml,
                t,
                att,
                lastAtt,
                _ele,
                _timestamp,
                _lastTimestamp,
                _useTimestamp = new Date().getTime(),
                _tempTimestamp,
                _tempPosition,
                _lastPosition,
                _useLastTimestamp,
                _heading = 0,
                _speed = 0,
                _dist = 0,
                navUtils = new utils.navHelper();

            reader.onload = function (e) {
                _xml = e.target.result;
                t = $(_xml).find('trkpt');

                track = [];

                utils.forEach(t, function (p, i) {
                    if (!isNaN(i)) {
                        att = t[i].attributes;
                        lastAtt = t[i - 1] ? t[i - 1].attributes : {};
                        _ele = $(t[i]).find("ele")[0];
                        _timestamp = $(t[i]).find("time")[0];
                        _lastTimestamp = $(t[i - 1]).find("time")[0];

                        if (_timestamp) {
                            //files recorded with endomondo and others have timestamps, this is not a route plan but a record of a track
                            _useTimestamp = new Date(_timestamp.innerHTML).getTime();
                        }

                        if (t[i - 1]) {
                            _dist = navUtils.getDistance(att["lat"].value, att["lon"].value, lastAtt["lat"].value, lastAtt["lon"].value);

                            if (_lastTimestamp) {
                                _useLastTimestamp = new Date(_lastTimestamp.innerHTML).getTime();
                            }
                            else {
                                //routes from YOURS come in as tracks (rather than routes under the GPX schema), but with no timestamps.  This is a route.
                                _useLastTimestamp = _useTimestamp;
                                _useTimestamp += Math.round(_dist / 22.2222 * 1000);  //80km/h in m/s
                            }

                            _heading = navUtils.getHeading(lastAtt["lat"].value, lastAtt["lon"].value, att["lat"].value, att["lon"].value);
                            _speed = (_dist / ((_useTimestamp - _useLastTimestamp) / 1000)).toFixed(2);

                            if (!_lastTimestamp) {
                                //on YOURS routes, make sure we have at least one update a second
                                _tempTimestamp = _useLastTimestamp;

                                while (_useTimestamp - _tempTimestamp > 1000) {
                                    _tempTimestamp += 1000;
                                    _lastPosition = track[track.length - 1].coords;
                                    _tempPosition = navUtils.simulateTravel(_lastPosition.latitude, _lastPosition.longitude, _heading, _speed);
                                    track.push({
                                        coords: {
                                            latitude: _tempPosition.latitude,
                                            longitude: _tempPosition.longitude,
                                            altitude: _ele ? _ele.innerHTML : 0,
                                            accuracy: 150,
                                            altitudeAccuracy: 80,
                                            heading: _heading,
                                            speed: _speed
                                        },
                                        timestamp: _tempTimestamp
                                    });
                                }
                            }
                        }

                        track.push({
                            coords: {
                                latitude: att["lat"].value,
                                longitude: att["lon"].value,
                                altitude: _ele ? _ele.innerHTML : 0,
                                accuracy: 150,
                                altitudeAccuracy: 80,
                                heading: _heading,
                                speed: _speed
                            },
                            timestamp: _useTimestamp
                        });
                    }
                });
            };
            reader.onerror = function (e) {
                fail(e);
            };
            reader.readAsText(file.target.files[0], "UTF-8");
        }

        function replayGpxTrack() {
            if (_replayingGpxFile) {
                _haltGpxReplay = true;
                gpxGo.innerHTML = constants.GEO.GPXGO_LABELS.GO;
            }
            else {
                if (track.length > 0) {
                    _haltGpxReplay = false;
                    gpxGo.innerHTML = constants.GEO.GPXGO_LABELS.STOP;

                    latitude.value = track[0].coords.latitude;
                    longitude.value = track[0].coords.longitude;
                    altitude.value = track[0].coords.altitude;
                    accuracy.value = track[0].coords.accuracy;
                    altitudeAccuracy.value = track[0].coords.altitudeAccuracy;
                    heading.value = track[0].coords.heading;
                    speed.value = track[0].coords.speed;

                    updateGeo();
                    updateHeadingValues();
                    _triggerEvent();

                    moveNextGpxTrack(1);
                }
            }
        }

        function moveNextGpxTrack(i)
        {
            if (_haltGpxReplay) {
                _replayingGpxFile = false;
                _haltGpxReplay = false;
                console.log("Emulator :: User interrupted replay of GPX file (Aye Captain, answers All Stop.)");
            }
            else {
                _replayingGpxFile = true;
                var _timeMultiplier = !isNaN(gpxMultiplier.value) ? gpxMultiplier.value : 1,
                _step = 0,
                _interval = 0;

                while (_interval < 250) {
                    _step++;
                    if ((i + _step) >= track.length) { break; }
                    _interval = (track[i + _step].timestamp - track[i].timestamp) / _timeMultiplier;
                }

                gpxReplayStatus.textContent = (_interval / 1000).toFixed(2) + "s (" + (_interval / 1000 * _timeMultiplier).toFixed(2) + "s realtime), " + (i + 1) + " of " + track.length + " (stepping " + _step + " at " + _timeMultiplier + "x)";

                setTimeout(function () {
                    latitude.value = track[i].coords.latitude;
                    longitude.value = track[i].coords.longitude;
                    altitude.value = track[i].coords.altitude;
                    accuracy.value = track[i].coords.accuracy;
                    altitudeAccuracy.value = track[i].coords.altitudeAccuracy;
                    heading.value = track[i].coords.heading;
                    speed.value = track[i].coords.speed;

                    updateGeo();
                    updateHeadingValues();
                    _triggerEvent();

                    if (track[i + _step]) {
                        moveNextGpxTrack(i + _step);
                    }
                    else {
                        if (i < track.length - 1) {
                            moveNextGpxTrack(track.length - 1);
                        }
                        else {
                            _replayingGpxFile = false;
                            gpxGo.innerHTML = constants.GEO.GPXGO_LABELS.GO;
                            console.log("Emulator :: Finished replaying GPX file (Arriving at our destination, assuming standard orbit Captain.)");
                        }
                    }
                }, _interval);
            }
        }

        // HACK: see techdebt http://www.pivotaltracker.com/story/show/5478847 (double HACK!!!)
        if (platform.current().id === 'phonegap' ||
            platform.current().id === 'webworks' ||
            platform.current().id === 'cordova') {
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
            delayLabel.innerHTML = delay.value;
        });
        jQuery("#" + GEO_OPTIONS.TIMEOUT).bind("click", function () {
            updateGeo();
        });
        jQuery("#" + GEO_OPTIONS.GPXFILE).bind("change", function (a) {
            loadGpxFile(null, null, [a]);
        });
        jQuery("#" + GEO_OPTIONS.GPXGO).bind("click", function () {
            replayGpxTrack();
        });

        // HACK: see techdebt http://www.pivotaltracker.com/story/show/5478847 (double HACK!!!)
        if (platform.current().id === 'phonegap' || platform.current().id === 'webworks' || platform.current().id === 'cordova') {
            jQuery("#" + GEO_OPTIONS.HEADING).bind("change", function () {
                updateGeo();
                updateHeadingValues();
            });

            utils.bindAutoSaveEvent(jQuery("#" + GEO_OPTIONS.SPEED), updateGeo);
            heading.value =       positionInfo.heading;
            speed.value =         positionInfo.speed;
        }

        initMap();

        initializeValues();

        event.on(positionEvent, function () {
            _updateGpsMap();
        });

        _triggerEvent();

        function _triggerEvent() {
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
    }
};
