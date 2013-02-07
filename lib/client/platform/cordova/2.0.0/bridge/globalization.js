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

var platform = ripple('platform'),
    deviceSettings = ripple('deviceSettings'),
    bridge = ripple('emulatorBridge'),
    GlobalizationError = bridge.window().GlobalizationError;

function format(date, length, selector) {
    if (selector === "time") {
        //Time is always time IMHO
        return moment(date).format("LT");
    }

    var result;

    switch (length) {
    case 'medium':
        result = moment(date).format('LL LT');
        break;
    case 'long':
        result = moment(date).format('LLL');
        break;
    case 'full':
        result = moment(date).format('LLLL');
        break;
    case 'short':
        result = moment(date).format('L LT');
        break;
    }

    if (selector === "date") {
        //Stripping time
        result = result.replace(" " + moment(date).format("LT"), "");
    }

    return result;
}

function parse(str, length, selector) {
    if (selector === "time") {
        return moment(str, moment.longDateFormat.LT);
    }

    var format;

    switch (length) {
    case 'medium':
        format = moment.longDateFormat.LL + " LT";
        break;
    case 'long':
        format = moment.longDateFormat.LLL;
        break;
    case 'full':
        format = moment.longDateFormat.LLLL;
        break;
    case 'short':
        format = moment.longDateFormat.L + " LT";
        break;
    }

    if (selector === 'date') {
        format = format.replace(' LT', '');
    }

    format = format.replace("LT", moment.longDateFormat.LT);

    return moment(str, format);
}

module.exports = {
    getLocaleName: function (win) {
        win({ value: moment.lang() });
    },

    getPreferredLanguage: function (win) {
        win({
            value: platform.current().device.globalization.locale.options[moment.lang()]
        });
    },

    dateToString: function (win, fail, args) {
        var date = args[0].date,
            options = args[0].options || {},
            formatLength = options.formatLength,
            selector = options.selector;

        win({
            value: format(date, formatLength || 'short', selector)
        });
    },

    stringToDate: function (win, fail, args) {
        var str = args[0].dateString,
            options = args[0].options || {},
            result = parse(str, options.formatLength || 'short', options.selector);

        if (result.isValid()) {
            win({
                year: result.year(),
                month: result.month(),
                day: result.date(),
                hour: result.hours(),
                minute: result.minutes(),
                second: result.seconds(),
                millisecond: result.milliseconds()
            });
        }
        else {
            fail(new GlobalizationError(GlobalizationError.PARSING_ERROR, "Parsing Error"));
        }
    },

    getDatePattern: function (win, fail, args) {
        var options = args[0].options || {},
            formatLength = options.formatLength || 'short',
            selector = options.selector,
            pattern;


        if (selector === 'time') {
            pattern = moment.longDateFormat.LT;
        }
        else {
            switch (formatLength) {
            case 'medium':
                pattern = moment.longDateFormat.LL + " LT";
                break;
            case 'long':
                pattern = moment.longDateFormat.LLL;
                break;
            case 'full':
                pattern = moment.longDateFormat.LLLL;
                break;
            case 'short':
                pattern = moment.longDateFormat.L + " LT";
                break;
            }

            if (selector === 'date') {
                pattern = pattern.replace(" LT", "");
            }

            pattern = pattern.replace("LT", moment.longDateFormat.LT);
        }

        win({
            pattern: pattern,
            timezone: "???",
            utc_offset: 0,
            dst_offset: 0
        });
    },

    getDateNames: function (win, fail, args) {
        var options = args[0].options || {},
            type = options.type || 'wide',
            item = options.item || 'months',
            key = item;

        if (key === 'days') key = 'weekdays';
        if (type === 'narrow') key += 'Short';


        //HACK: The mobile-spec tests use instanceof checks for Array
        //      We need to make sure we use the same prototype hash
        //      as the frame's window so that test works.
        win({value: new bridge.window().Array().concat(moment[key])});
    },

    isDayLightSavingsTime: function (win) {
        win({
            dst: deviceSettings.retrieveAsBoolean("globalization.isDayLightSavingsTime")
        });
    },

    getFirstDayOfWeek: function (win) {
        win({
            value: deviceSettings.retrieveAsInt("globalization.firstDayOfWeek")
        });
    },

    numberToString: function (win, fail, args) {
        var number = args[0].number,
            options = args[0].options || {type: 'decimal'},
            result = {};

        switch (options.type) {
        case 'currency':
            result.value = accounting.formatMoney(number);
            break;
        case 'percent':
            result.value = accounting.formatNumber(Math.round(number * 100)) + '%';
            break;
        case 'decimal':
            result.value = accounting.formatNumber(number);
            break;
        }

        win(result);
    },

    stringToNumber: function (win, fail, args) {
        var number = args[0].numberString,
            options = args[0].options || {type: 'decimal'},
            result = {};

        result.value = accounting.unformat(number);

        if (options.type === 'percent') {
            result.value = result.value / 100;
        }

        win(result);
    },

    getNumberPattern: function (win, fail, args) {
        var pattern = "#,##0",
            settings = accounting.settings.number;

        if (args[0].type === 'currency') {
            settings = accounting.settings.currency;
            pattern = settings.symbol + pattern + ".00";
        }
        else if (args[0].type === 'percent') {
            settings = {
                precision: 0,
                decimal: accounting.settings.number.decimal,
                thousand: accounting.settings.number.thousand
            };
            pattern = "#,##0%";
        }

        win({
            pattern: pattern,
            symbol: ".",
            fraction: 0,
            rounding: settings.precision,
            positive: "",
            negative: "-",
            decimal: settings.decimal,
            grouping: settings.thousand
        });
    },

    getCurrencyPattern: function (win, fail, args) {
        var pattern = accounting.settings.currency.symbol + "#,##0.00";

        win({
            pattern: pattern,
            code: args[0].currencyCode,
            fraction: 0,
            rounding: accounting.settings.currency.precision,
            decimal: accounting.settings.currency.decimal,
            grouping: accounting.settings.currency.thousand
        });
    }
};
