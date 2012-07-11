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

var ui = require('ripple/ui'),
    event = require('ripple/event'),
    video = document.getElementById('camera-video'),
    upload = document.getElementById('picture-upload'),
    select = document.getElementById('select-file'),
    take = document.getElementById('take-file'),
    pic = document.getElementById("camera-image");


select.addEventListener('click', function () {
    upload.click();
});

upload.addEventListener('change', function () {
    pic.src = window.webkitURL.createObjectURL(upload.files[0]);
});

take.addEventListener('click', function () {
    console.log("captured-image: " + pic.src);
    event.trigger('captured-image', [pic.src, upload.files[0]]);
    module.exports.hide();
});

module.exports = {
    show: function () {
        ui.showOverlay("camera-window");
    },
    hide: function () {
        ui.hideOverlay("camera-window");
    }
};
