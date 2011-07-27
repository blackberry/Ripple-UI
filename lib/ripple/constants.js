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

    "COMMON":  {
        "APPLICATION_STATE": "ui-application-state-",
        "PREFIX": "tinyhippos-",
        "DEVICE_CONTAINER" : "device-container",
        "VIEWPORT_CONTAINER" : "viewport-container",
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
        "GEO_MAP_IMAGE_ID": "geo-map-img",
        "FILESYSTEM_UPDATE_BUTTON_ID_WITH_HASH": "#update-filesystem-button",
        "USER_AGENT_DEFAULT": "default",
        "APPLICATIONS_CONTAINER_ID": "widget-applications-content",
        "STORAGE_CLEAR_BUTTON_ID": "preferences-clear-button",
        "CHANGE_PLATFORM_BUTTON_ID": "platform-device-update",
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
        "SAVED_KEY": "api-key",
        "DEFAULT": {
            "name": "wac",
            "version": "1.0"
        }
    },

    "DEVICE":  {
        "SAVED_KEY": "device-key",
    },

    "ENCAPSULATOR":  {
        "DEFAULT_HEIGHT": 684,
        "DEFAULT_WIDTH": 480,
        "LAYOUT": "layout",
        "DISPLAY_LAYOUT": {
            "LANDSCAPE": "landscape",
            "PORTRAIT": "portrait"
        }
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
            "TIMEOUT" : "geo-timeout"
        },
        "MAP_ZOOM_MAX": 21,
        "MAP_ZOOM_MIN": 0,
        "MAP_ZOOM_LEVEL_CONTAINER": "geo-map-zoomlevel-value",
        "MAP_ZOOM_KEY": "geo-map-zoom-key"
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
        "TYPES": {
            "NORMAL": "normal",
            "ERROR": "error"
        },
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
        "LOCAL_URI": /^https?:\/\/(127\.0\.0\.1|localhost)|^file:\/\//,
        "EXTERNAL_URI": /(?:(?:[a-zA-Z0-9\/;\?&=:\-_\$\+!\*'\(\|\\~\[\]#%\.](?!www))+(?:\.[Cc]om|\.[Ee]du|\.[gG]ov|\.[Ii]nt|\.[Mm]il|\.[Nn]et|\.[Oo]rg|\.[Bb]iz|\.[Ii]nfo|\.[Nn]ame|\.[Pp]ro|\.[Aa]ero|\.[cC]oop|\.[mM]useum|\.[Cc]at|\.[Jj]obs|\.[Tt]ravel|\.[Aa]rpa|\.[Mm]obi|\.[Aa]c|\.[Aa]d|\.[aA]e|\.[aA]f|\.[aA]g|\.[aA]i|\.[aA]l|\.[aA]m|\.[aA]n|\.[aA]o|\.[aA]q|\.[aA]r|\.[aA]s|\.[aA]t|\.[aA]u|\.[aA]w|\.[aA]z|\.[aA]x|\.[bB]a|\.[bB]b|\.[bB]d|\.[bB]e|\.[bB]f|\.[bB]g|\.[bB]h|\.[bB]i|\.[bB]j|\.[bB]m|\.[bB]n|\.[bB]o|\.[bB]r|\.[bB]s|\.[bB]t|\.[bB]v|\.[bB]w|\.[bB]y|\.[bB]z|\.[cC]a|\.[cC]c|\.[cC]d|\.[cC]f|\.[cC]g|\.[cC]h|\.[cC]i|\.[cC]k|\.[cC]l|\.[cC]m|\.[cC]n|\.[cC]o|\.[cC]r|\.[cC]s|\.[cC]u|\.[cC]v|\.[cC]x|\.[cC]y|\.[cC]z|\.[dD]e|\.[dD]j|\.[dD]k|\.[dD]m|\.[dD]o|\.[dD]z|\.[eE]c|\.[eE]e|\.[eE]g|\.[eE]h|\.[eE]r|\.[eE]s|\.[eE]t|\.[eE]u|\.[fF]i|\.[fF]j|\.[fF]k|\.[fF]m|\.[fF]o|\.[fF]r|\.[gG]a|\.[gG]b|\.[gG]d|\.[gG]e|\.[gG]f|\.[gG]g|\.[gG]h|\.[gG]i|\.[gG]l|\.[gG]m|\.[gG]n|\.[gG]p|\.[gG]q|\.[gG]r|\.[gG]s|\.[gG]t|\.[gG]u|\.[gG]w|\.[gG]y|\.[hH]k|\.[hH]m|\.[hH]n|\.[hH]r|\.[hH]t^[ml]?|\.[hH]u|\.[iI]d|\.[iI]e|\.[iI]l|\.[iI]m|\.[iI]n|\.[iI]o|\.[iI]q|\.[iI]r|\.[iI]s|\.[iI]t|\.[jJ]e|\.[jJ]m|\.[jJ]o|\.[jJ]p|\.[kK]e|\.[kK]g|\.[kK]h|\.[kK]i|\.[kK]m|\.[kK]n|\.[kK]p|\.[kK]r|\.[kK]w|\.[kK]y|\.[kK]z|\.[lL]a|\.[lL]b|\.[lL]c|\.[lL]i|\.[lL]k|\.[lL]r|\.[lL]s|\.[lL]t|\.[lL]u|\.[lL]v|\.[lL]y|\.[mM]a|\.[mM]c|\.[mM]d|\.[mM]g|\.[mM]h|\.[mM]k|\.[mM]l|\.[mM]m|\.[mM]n|\.[mM]o|\.[mM]p|\.[mM]q|\.[mM]r|\.[mM]s|\.[mM]t|\.[mM]u|\.[mM]v|\.[mM]w|\.[mM]x|\.[mM]y|\.[mM]z|\.[nN]a|\.[nN]c|\.[nN]e|\.[nN]f|\.[nN]g|\.[nN]i|\.[nN]l|\.[nN]o|\.[nN]p|\.[nN]r|\.[nN]u|\.[nN]z|\.[oO]m|\.[pP]a|\.[pP]e|\.[pP]f|\.[pP]g|\.[pP]h|\.[pP]k|\.[pP]l|\.[pP]m|\.[pP]n|\.[pP]r|\.[pP]s|\.[pP]t|\.[pP]w|\.[pP]y|\.[qP]a|\.[rR]e|\.[rR]o|\.[rR]u|\.[rR]w|\.[sS]a|\.[sS]b|\.[sS]c|\.[sS]d|\.[sS]e|\.[sS]g|\.[sS]h|\.[Ss]i|\.[sS]j|\.[sS]k|\.[sS]l|\.[sS]m|\.[sS]n|\.[sS]o|\.[sS]r|\.[sS]t|\.[sS]v[^c]|\.[sS]y|\.[sS]z|\.[tT]c|\.[tT]d|\.[tT]f|\.[tT]g|\.[tT]h|\.[tT]j|\.[tT]k|\.[tT]l|\.[tT]m|\.[tT]n|\.[tT]o|\.[tT]p|\.[tT]r|\.[tT]t|\.[tT]v|\.[tT]w|\.[tT]z|\.[uU]a|\.[uU]g|\.[uU]k|\.[uU]m|\.[uU]s|\.[uU]y|\.[uU]z|\.[vV]a|\.[vV]c|\.[vV]e|\.[vV]g|\.[vV]i|\.[vV]n|\.[vV]u|\.[wW]f|\.[wW]s|\.[yY]e|\.[yY]t|\.[yY]u|\.[zZ]a|\.[zZ]m|\.[zZ]w))/
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
        "PROXY_DISABLED_BUTTON": "settings-xhrproxy-disabled"
    },

    "PLATFORMS": {
        "WAC": {
            "APPLICATIONS": [
                "ALARM",
                "BROWSER",
                "CALCULATOR",
                "CALENDAR",
                "CAMERA",
                "CONTACTS",
                "FILES",
                "GAMES",
                "MAIL",
                "MEDIAPLAYER",
                "MESSAGING",
                "PHONECALL",
                "PICTURES",
                "PROG_MANAGER",
                "SETTINGS",
                "TASKS",
                "WIDGET_MANAGER"
            ],
            "DEVICE": {
                "WIDGET_ENGINE_NAME": "Generic",
                "WIDGET_ENGINE_PROVIDER": "tinyHippos",
                "WIDGET_ENGINE_VERSION": "x.x"
            }
        }
    }
};
