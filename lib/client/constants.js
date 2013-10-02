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
    "SERVICES": {
        "GOOGLE_MAPS_URI": "http://maps.google.com/maps/api/staticmap?size=476x476&maptype=roadmap",
        "GOOGLE_MAPS_API_KEY": "ABQIAAAA-CaPZHXR-0Tzhui_h6gpjhSE_2rGlnYiB7L-ZGVwgaut5s7OYRSlBAaHCzBuZf2_23_vrCOfPxXHjA"
    },

    "FS_SIZE": 1024 * 1024 * 10,

    "COMMON":  {
        "APPLICATION_STATE": "ui-application-state-",
        "PREFIX": "tinyhippos-",
        "MENU_BUTTON" : "menu-button",
        "BACK_BUTTON" : "back-button",
        "HTML_CONTAINER" : "document",
        "INFO_SECTION": "information-sub-container",
        "ORIENTATION_SELECT_PORTRAIT_ID" : "layout-portrait",
        "ORIENTATION_SELECT_LANDSCAPE_ID" : "layout-landscape",
        "PLATFORM_SELECT_ID": "platform-select",
        "DEVICE_SELECT_ID": "device-select",
        "STORAGE_TABLE_BODY_CLASS": "preferences-list-body",
        "STORAGE_COUNT_CONTAINER_ID": "preferences-count",
        "GEO_MAP_CONTAINER_ID": "geo-map",
        "FILESYSTEM_UPDATE_BUTTON_ID_WITH_HASH": "#update-filesystem-button",
        "APPLICATIONS_CONTAINER_ID": "widget-applications-content",
        "STORAGE_CLEAR_BUTTON_ID": "preferences-clear-button",
        "CHANGE_PLATFORM_BUTTON_ID": "change-platform",
        "AJAX_LOADER_CONTAINER_CLASS": ".loader",
        "IRRELEVANT_CLASS": "irrelevant",
        "MULTIMEDIA_VOLUME_SLIDER_ID": "media-volume",
        "MULTIMEDIA_VOLUME_FIELD_ID": "media-volume-value",
        "MULTIMEDIA_AUDIO_STATE_FIELD_ID": "media-audio-state",
        "MULTIMEDIA_AUDIO_PLAYING_FIELD_ID": "multimedia-isaudioplaying",
        "MULTIMEDIA_AUDIO_PROGRESS_ID": "media-audio-progress",
        "MULTIMEDIA_AUDIO_FILE_FIELD_ID": "media-audio-file",
        "MULTIMEDIA_VIDEO_STATE_FIELD_ID": "media-video-state",
        "MULTIMEDIA_VIDEO_PLAYING_FIELD_ID": "multimedia-isvideoplaying",
        "MULTIMEDIA_VIDEO_PROGRESS_ID": "media-video-progress",
        "MULTIMEDIA_VIDEO_FILE_FIELD_ID": "media-video-file",
        "EXTENSION_URL_CONTAINER": "extension-url",
        "SECURITY_LEVEL": "security-level"
    },

    "FILESYSTEM": {
        "PERSISTENCE_KEY": "filesystem",
        "INPUT_PREFIX_ID": "#panel-filesystem-"
    },

    "PLATFORM":  {
        "DEFAULT": {
            "name": "cordova",
            "version": "1.0.0"
        }
    },

    "ENCAPSULATOR":  {
        "DEFAULT_HEIGHT": 684,
        "DEFAULT_WIDTH": 480
    },

    "GEO":  {
        "OPTIONS" : {
            "LATITUDE" : "geo-latitude",
            "LONGITUDE" : "geo-longitude",
            "ALTITUDE" : "geo-altitude",
            "CELL_ID" : "geo-cellid",
            "ACCURACY" : "geo-accuracy",
            "ALTITUDE_ACCURACY" : "geo-altitudeaccuracy",
            "HEADING" : "geo-heading",
            "SPEED" : "geo-speed",
            "TIME_STAMP" : "geo-timestamp",
            "DELAY" : "geo-delay",
            "DELAY_LABEL" : "geo-delay-label",
            "HEADING_LABEL" : "geo-heading-label",
            "HEADING_MAP_LABEL" : "geo-map-direction-label",
            "IMAGE" : "geo-map-img",
            "MAP_MARKER" : "geo-map-marker",
            "MAP_CONTAINER" : "geo-map-container",
            "TIMEOUT" : "geo-timeout",
            "GPXFILE": "geo-gpxfile",
            "GPXGO": "geo-gpx-go",
            "GPXMULTIPLIER": "geo-gpxmultiplier-select",
            "GPXREPLAYSTATUS": "geo-gpxreplaystatus"
        },
        "MAP_ZOOM_MAX": 21,
        "MAP_ZOOM_MIN": 0,
        "MAP_ZOOM_LEVEL_CONTAINER": "geo-map-zoomlevel-value",
        "MAP_ZOOM_KEY": "geo-map-zoom-key",
        "GPXGO_LABELS": {
            "GO": "Go",
            "STOP": "Stop"
        }
    },

    "PUSH": {
        "OPTIONS" : {
            "PAYLOAD" : "push-text"
        }
    },

    "TELEPHONY": {
        "CALL_LIST_KEY": "telephony-call-list-key"
    },

    "PIM": {
        "ADDRESS_LIST_KEY": "pim-address-list-key",
        "CALENDAR_LIST_KEY": "pim-calendar-list-key"
    },

    "CAMERA": {
        "WINDOW_ANIMATION": "images/dance.gif",
        "WARNING_TEXT": "The runtime simulated saving the camera file to {file}. If you need to access this file in your application, please copy a file to the saved location"
    },

    "AUDIOPLAYER" : {
        "WARNING_TEXT": "The runtime simulated saving the audio file to {file}. If you need to access this file in your application, please copy a file to the saved location"
    },

    "API_APPLICATION": {
        "NO_APPLICATIONS_MESSAGE": "No applications available for your platform"
    },

    "NOTIFICATIONS":  {
        "MESSAGE_CONTAINER_CLASS": "notification-message-div",
        "MAIN_CONTAINER_CLASS": "panel-notification",
        "CLOSE_BUTTON_CLASS": "panel-notification-closebtn",
        "MESSAGE_TEXT_CONTAINER_CLASS": "panel-notification-text",
        "CSS_PREFIX": "panel-notification-",
        "STATE_TYPES": {
            "OPEN": 1,
            "CLOSE": 2
        }
    },

    "CSS_PREFIX":  {
        "IRRELEVANT" : "irrelevant"
    },

    "STORAGE":  {
        "PAIR_DELIMETER" : ",",
        "KEY_VALUE_DELIMETER" : "|"
    },

    "REGEX":  {
        "GEO" : /^geo-/,
        "URL": /^((https?|ftp|gopher|telnet|file|notes|ms-help):((\/\/)|(\\\\))+[\w\d:#@%\/;$()~_?\+-=\\\.&]*)$/,
        //"Email": /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
        "EMAIL": /^([^@\s]+)@((?:[\-a-z0-9]+\.)+[a-z]{2,})$/,
        "WC3_DTF": /^((\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d):(\d\d)|(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d)|(\d{4})-(\d\d)-(\d\d)|(\d{4})-(\d\d)|(\d\d\d\d))$/,
        "NON_RELATIVE_URI": /^https?:\/\/|^file:\/\//
    },

    "CONFIG": {
        "SUCCESS_CSS": {
            "true": "ui-text-pass",
            "false": "ui-text-fail",
            "missing": "ui-text-missing"
        }
    },

    "SETTINGS": {
        "TOOLTIPS_TOGGLE_DIV": "#settings-toggletooltips",
        "TOOLTIPS_KEY": "tool-tips-key"
    },

    "UI": {
        "JQUERY_UI_BUTTON_CLASSES": "ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only",
        "JQUERY_UI_INPUT_CLASSES": "ui-state-default ui-corner-all",
        "PANEL_TABLE_CLASS": "panel-table",
        "RIGHT_RANGE_LABEL_CLASS": "range-label",
        "LEFT_RANGE_LABEL_CLASS": "range-label-left",
        "TEXT_LABEL_CLASS": "ui-text-label",
        "SCREEN_PPI": 96
    },

    "MULTIMEDIA": {
        "AUDIO_STATES": {
            "OPENED": "opened",
            "STOPPED": "stopped",
            "PAUSED": "paused",
            "PLAYING": "playing",
            "COMPLETED": "completed"
        }
    },

    "LANG": {
        "ISO6392_LIST": ["abk", "ace", "ach", "ada", "ady", "aar", "afh", "afr", "afa", "ain", "aka", "akk", "alb/sqi", "gsw", "ale", "alg", "tut", "amh", "anp", "apa", "ara", "arg", "arp", "arw", "arm/hye", "rup", "art", "asm", "ast", "ath", "aus", "map", "ava", "ave", "awa", "aym", "aze", "ban", "bat", "bal", "bam", "bai", "bad", "bnt", "bas", "bak", "baq/eus", "btk", "bej", "bel", "bem", "ben", "ber", "bho", "bih", "bik", "byn", "bin", "bis", "zbl", "nob", "bos", "bra", "bre", "bug", "bul", "bua", "bur/mya", "cad", "spa", "cat", "cau", "ceb", "cel", "cai", "khm", "chg", "cmc", "cha", "che", "chr", "nya", "chy", "chb", "chi/zho", "chn", "chp", "cho", "zha", "chu", "chk", "chv", "nwc", "syc", "rar", "cop", "cor", "cos", "cre", "mus", "crp", "cpe", "cpf", "cpp", "crh", "hrv", "cus", "cze/ces", "dak", "dan", "dar", "del", "div", "zza", "din", "doi", "dgr", "dra", "dua", "dut/nld", "dum", "dyu", "dzo", "frs", "efi", "egy", "eka", "elx", "eng", "enm", "ang", "myv", "epo", "est", "ewe", "ewo", "fan", "fat", "fao", "fij", "fil", "fin", "fiu", "fon", "fre/fra", "frm", "fro", "fur", "ful", "gaa", "gla", "car", "glg", "lug", "gay", "gba", "gez", "geo/kat", "ger/deu", "nds", "gmh", "goh", "gem", "kik", "gil", "gon", "gor", "got", "grb", "grc", "gre/ell", "kal", "grn", "guj", "gwi", "hai", "hat", "hau", "haw", "heb", "her", "hil", "him", "hin", "hmo", "hit", "hmn", "hun", "hup", "iba", "ice/isl", "ido", "ibo", "ijo", "ilo", "arc", "smn", "inc", "ine", "ind", "inh", "ina", "ile", "iku", "ipk", "ira", "gle", "mga", "sga", "iro", "ita", "jpn", "jav", "kac", "jrb", "jpr", "kbd", "kab", "xal", "kam", "kan", "kau", "pam", "kaa", "krc", "krl", "kar", "kas", "csb", "kaw", "kaz", "kha", "khi", "kho", "kmb", "kin", "kir", "tlh", "kom", "kon", "kok", "kor", "kos", "kpe", "kro", "kua", "kum", "kur", "kru", "kut", "lad", "lah", "lam", "day", "lao", "lat", "lav", "ltz", "lez", "lim", "lin", "lit", "jbo", "dsb", "loz", "lub", "lua", "lui", "smj", "lun", "luo", "lus", "mac/mkd", "mad", "mag", "mai", "mak", "mlg", "may/msa", "mal", "mlt", "mnc", "mdr", "man", "mni", "mno", "glv", "mao/mri", "arn", "mar", "chm", "mah", "mwr", "mas", "myn", "men", "mic", "min", "mwl", "moh", "mdf", "rum/ron", "mkh", "lol", "mon", "mos", "mul", "mun", "nqo", "nah", "nau", "nav", "nde", "nbl", "ndo", "nap", "new", "nep", "nia", "nic", "ssa", "niu", "zxx", "nog", "non", "nai", "frr", "sme", "nso", "nor", "nno", "nub", "iii", "nym", "nyn", "nyo", "nzi", "oci", "pro", "oji", "ori", "orm", "osa", "oss", "oto", "pal", "pau", "pli", "pag", "pan", "pap", "paa", "pus", "per/fas", "peo", "phi", "phn", "pon", "pol", "por", "pra", "que", "raj", "rap", "qaa-qtz", "roa", "roh", "rom", "run", "rus", "sal", "sam", "smi", "smo", "sad", "sag", "san", "sat", "srd", "sas", "sco", "sel", "sem", "srp", "srr", "shn", "sna", "scn", "sid", "sgn", "bla", "snd", "sin", "sit", "sio", "sms", "den", "sla", "slo/slk", "slv", "sog", "som", "son", "snk", "wen", "sot", "sai", "alt", "sma", "srn", "suk", "sux", "sun", "sus", "swa", "ssw", "swe", "syr", "tgl", "tah", "tai", "tgk", "tmh", "tam", "tat", "tel", "ter", "tet", "tha", "tib/bod", "tig", "tir", "tem", "tiv", "tli", "tpi", "tkl", "tog", "ton", "tsi", "tso", "tsn", "tum", "tup", "tur", "ota", "tuk", "tvl", "tyv", "twi", "udm", "uga", "uig", "ukr", "umb", "mis", "und", "hsb", "urd", "uzb", "vai", "ven", "vie", "vol", "vot", "wak", "wln", "war", "was", "wel/cym", "fry", "wal", "wol", "xho", "sah", "yao", "yap", "yid", "yor", "ypk", "znd", "zap", "zen", "zul", "zun"]
    },

    "XHR": {
        PROXY_SETTING: "settings-xhr-proxy-setting",
        PROXY_SETTINGS_LIST: {
            enabled: "enabled",
            disabled: "disabled"
        },
        DEFAULT_LOCAL_PORT: 4400,
        DEFAULT_LOCAL_ROUTE: "/ripple",
        LOCAL_PROXY_PORT_SETTING: "settings-xhr-proxy-local-port",
        LOCAL_PROXY_ROUTE_SETTING: "settings-xhr-proxy-local-route"
    }
};
