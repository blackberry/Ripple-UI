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
if (!window.tinyHippos) {
    window.tinyHippos = {};
    var _panel = th_panel;

    (function () {
        var injection = _panel.LAYOUT_HTML.replace(/#URL_PREFIX#/g, document.querySelector(".emulator-bootstrap").id);

        document.open();

        document.addEventListener("tinyHipposInterpreted", function () {
            require('ripple/bootstrap').bootstrap();
        }, false);

        document.write(injection);

        window.setTimeout(function () {
            document.close();
        }, 100);
    }());
}

delete window.th_panel;
