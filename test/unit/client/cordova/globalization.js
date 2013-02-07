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
describe("cordova globalization bridge", function () {
    var bridge = ripple('emulatorBridge'),
        glob, success, fail;

    beforeEach(function () {

        global.GlobalizationError = jasmine.createSpy("GlobalizationError");
        global.GlobalizationError.PARSING_ERROR = 12;
        spyOn(bridge, 'window').andReturn({
            GlobalizationError: global.GlobalizationError,
            Array: Array
        });

        glob = ripple('platform/cordova/2.0.0/bridge/globalization');
        success = jasmine.createSpy("success");
        fail = jasmine.createSpy("fail");
           
        spyOn(moment, "lang").andReturn("cv");
    });

    afterEach(function () {
        delete global.GlobalizationError;
    });

    describe("getLocaleName", function () {
        it("returns the locale on the success callback", function () {
            glob.getLocaleName(success, fail);
            expect(success).toHaveBeenCalledWith({value: "cv"});
        });

        it("gets the locale from momentjs", function () {
            glob.getLocaleName(success, fail);
            expect(moment.lang).toHaveBeenCalledWith();
        });

        it("doesn't call the fail callback", function () {
            glob.getLocaleName(success, fail);
            expect(fail).not.toHaveBeenCalled();
        });
    });

    describe("getPreferredLanguage", function () {
        var platform = ripple('platform');

        it("returns the options string for the momentjs locale", function () {
            spyOn(platform, "current").andReturn({
                device: {
                    globalization: {
                        locale: { options: { "cv": "Chuvash" } }
                    }
                }
            });
            glob.getPreferredLanguage(success, fail);
            expect(success).toHaveBeenCalledWith({value: "Chuvash"});
        });
    });

    describe("dateToString", function () {
        var mock, args;

        beforeEach(function () {
            mock = {
                format: jasmine.createSpy("moment().format").andCallFake(function (str) {
                    return str;
                })
            };
            spyOn(global, "moment").andReturn(mock);

            args = [
                { date: new Date(), options: { selector: "time" } }
            ];
        });

        it("calls moment with the provided date", function () {
            var date = new Date();
            glob.dateToString(success, fail, args);
            expect(moment).toHaveBeenCalledWith(date);
        });

        describe("when the selector is time", function () {
            it("calls format with LT when length is short", function () {
                args[0].options.formatLength = "short";
                glob.dateToString(success, fail, args);
                expect(mock.format).toHaveBeenCalledWith("LT");
            });

            it("calls format with LT when length is medium", function () {
                args[0].options.formatLength = "medium";
                glob.dateToString(success, fail, args);
                expect(mock.format).toHaveBeenCalledWith("LT");
            });

            it("calls format with LT when length is long", function () {
                args[0].options.formatLength = "long";
                glob.dateToString(success, fail, args);
                expect(mock.format).toHaveBeenCalledWith("LT");
            });

            it("calls format with LT when length is full", function () {
                args[0].options.formatLength = "full";
                glob.dateToString(success, fail, args);
                expect(mock.format).toHaveBeenCalledWith("LT");
            });

            it("calls success with the result of format", function () {
                glob.dateToString(success, fail, args);
                expect(success).toHaveBeenCalledWith({value: "LT"});
            });
        });

        describe("when the selector is date and time", function () {
            beforeEach(function () {
                args = [
                    { date: new Date(), options: { selector: "date and time" } }
                ];
            });

            it("calls format with L LT when length is short", function () {
                args[0].options.formatLength = "short";
                glob.dateToString(success, fail, args);
                expect(mock.format).toHaveBeenCalledWith("L LT");
            });

            it("calls format with LL LT when length is medium", function () {
                args[0].options.formatLength = "medium";
                glob.dateToString(success, fail, args);
                expect(mock.format).toHaveBeenCalledWith("LL LT");
            });

            it("calls format with LLL when length is long", function () {
                args[0].options.formatLength = "long";
                glob.dateToString(success, fail, args);
                expect(mock.format).toHaveBeenCalledWith("LLL");
            });

            it("calls format with LLLL when length is full", function () {
                args[0].options.formatLength = "full";
                glob.dateToString(success, fail, args);
                expect(mock.format).toHaveBeenCalledWith("LLLL");
            });

            it("calls success with the result of format", function () {
                glob.dateToString(success, fail, args);
                expect(success).toHaveBeenCalledWith({value: "L LT"});
            });
        });

        describe("when the selector is date", function () {
            beforeEach(function () {
                args = [
                    { date: new Date(), options: { selector: "date" } }
                ];
            });

            it("calls format with L LT when length is short", function () {
                args[0].options.formatLength = "short";
                glob.dateToString(success, fail, args);
                expect(mock.format).toHaveBeenCalledWith("L LT");
                expect(mock.format).toHaveBeenCalledWith("LT");
            });

            it("calls format with LL LT when length is medium", function () {
                args[0].options.formatLength = "medium";
                glob.dateToString(success, fail, args);
                expect(mock.format).toHaveBeenCalledWith("LL LT");
                expect(mock.format).toHaveBeenCalledWith("LT");
            });

            it("calls format with LLL when length is long", function () {
                args[0].options.formatLength = "long";
                glob.dateToString(success, fail, args);
                expect(mock.format).toHaveBeenCalledWith("LLL");
                expect(mock.format).toHaveBeenCalledWith("LT");
            });

            it("calls format with LLLL when length is full", function () {
                args[0].options.formatLength = "full";
                glob.dateToString(success, fail, args);
                expect(mock.format).toHaveBeenCalledWith("LLLL");
                expect(mock.format).toHaveBeenCalledWith("LT");
            });

            it("calls success with the result of format", function () {
                glob.dateToString(success, fail, args);
                //NOTE: This selector strips the time off
                expect(success).toHaveBeenCalledWith({value: "L"});
            });
        });
    });

    describe("stringToDate", function () {
        var mock, args;

        beforeEach(function () {
            mock = {
                isValid: jasmine.createSpy("moment.isValid").andReturn(true),
                year: jasmine.createSpy("moment.year").andReturn(1980),
                month: jasmine.createSpy("moment.month").andReturn(12),
                date: jasmine.createSpy("moment.date").andReturn(18),
                hours: jasmine.createSpy("moment.hours").andReturn(9),
                minutes: jasmine.createSpy("moment.minutes").andReturn(30),
                seconds: jasmine.createSpy("moment.seconds").andReturn(15),
                milliseconds: jasmine.createSpy("moment.milliseconds").andReturn(334)
            };
            spyOn(global, "moment").andReturn(mock);

            moment.longDateFormat = {
                L: "L",
                LL: "LL",
                LLL: "LLL LT",
                LLLL: "LLLL LT",
                LT: "LT"
            };

            args = [
                { dateString: "A long long time ago...", options: { selector: "time" } }
            ];
        });

        it("calls the success callback when isValid returns true", function () {
            mock.isValid.andReturn(true);
            glob.stringToDate(success, fail, args);

            expect(success).toHaveBeenCalledWith({
                year: 1980,
                month: 12,
                day: 18,
                hour: 9,
                minute: 30,
                second: 15,
                millisecond: 334
            });
            expect(fail).not.toHaveBeenCalled();
        });

        it("calls the error callback when isValid returns false", function () {
            mock.isValid.andReturn(false);
            glob.stringToDate(success, fail, args);

            expect(success).not.toHaveBeenCalled();
            expect(fail).toHaveBeenCalled();
        });

        describe("when the selector is time", function () {
            it("it calls moment with LT when the length is short", function () {
                args[0].options.formatLength = "short";
                glob.stringToDate(success, fail, args);
                expect(moment).toHaveBeenCalledWith(args[0].dateString, "LT");
            });

            it("it calls moment with LT when the length is medium", function () {
                args[0].options.formatLength = "medium";
                glob.stringToDate(success, fail, args);
                expect(moment).toHaveBeenCalledWith(args[0].dateString, "LT");
            });

            it("it calls moment with LT when the length is long", function () {
                args[0].options.formatLength = "long";
                glob.stringToDate(success, fail, args);
                expect(moment).toHaveBeenCalledWith(args[0].dateString, "LT");
            });

            it("it calls moment with LT when the length is full", function () {
                args[0].options.formatLength = "full";
                glob.stringToDate(success, fail, args);
                expect(moment).toHaveBeenCalledWith(args[0].dateString, "LT");
            });
        });

        describe("when the selector is date", function () {
            beforeEach(function () {
                args[0].options.selector = "date";
            });

            it("it calls moment with L when the length is short", function () {
                args[0].options.formatLength = "short";
                glob.stringToDate(success, fail, args);
                expect(moment).toHaveBeenCalledWith(args[0].dateString, "L");
            });

            it("it calls moment with LL when the length is medium", function () {
                args[0].options.formatLength = "medium";
                glob.stringToDate(success, fail, args);
                expect(moment).toHaveBeenCalledWith(args[0].dateString, "LL");
            });

            it("it calls moment with LLL when the length is long", function () {
                args[0].options.formatLength = "long";
                glob.stringToDate(success, fail, args);
                expect(moment).toHaveBeenCalledWith(args[0].dateString, "LLL");
            });

            it("it calls moment with LLLL when the length is full", function () {
                args[0].options.formatLength = "full";
                glob.stringToDate(success, fail, args);
                expect(moment).toHaveBeenCalledWith(args[0].dateString, "LLLL");
            });
        });

        describe("when the selector is date and time", function () {
            beforeEach(function () {
                args[0].options.selector = "date and time";
            });

            it("it calls moment with L LT when the length is short", function () {
                args[0].options.formatLength = "short";
                glob.stringToDate(success, fail, args);
                expect(moment).toHaveBeenCalledWith(args[0].dateString, "L LT");
            });

            it("it calls moment with LL LT when the length is medium", function () {
                args[0].options.formatLength = "medium";
                glob.stringToDate(success, fail, args);
                expect(moment).toHaveBeenCalledWith(args[0].dateString, "LL LT");
            });

            it("it calls moment with LLL LT when the length is long", function () {
                args[0].options.formatLength = "long";
                glob.stringToDate(success, fail, args);
                expect(moment).toHaveBeenCalledWith(args[0].dateString, "LLL LT");
            });

            it("it calls moment with LLLL LT when the length is full", function () {
                args[0].options.formatLength = "full";
                glob.stringToDate(success, fail, args);
                expect(moment).toHaveBeenCalledWith(args[0].dateString, "LLLL LT");
            });
        });
    });

    describe("getDatePattern", function () {
        var args;

        beforeEach(function () {
            spyOn(global, "moment").andReturn({});
            moment.longDateFormat = {
                L: "L",
                LL: "LL",
                LLL: "LLL LT",
                LLLL: "LLLL LT",
                LT: "TIME"
            };

            args = [
                { options: { selector: "time" } }
            ];
        });

        describe("when the selector is time", function () {
            it("returns TIME when length is short", function () {
                args[0].options.formatLength = "short";
                glob.getDatePattern(success, fail, args);
                expect(success).toHaveBeenCalledWith({ 
                    pattern: "TIME",
                    timezone: "???",
                    utc_offset: 0,
                    dst_offset: 0
                });
            });

            it("returns TIME when length is medium", function () {
                args[0].options.formatLength = "medium";
                glob.getDatePattern(success, fail, args);
                expect(success).toHaveBeenCalledWith({
                    pattern: "TIME",
                    timezone: "???",
                    utc_offset: 0,
                    dst_offset: 0
                });
            });

            it("returns TIME when length is long", function () {
                args[0].options.formatLength = "long";
                glob.getDatePattern(success, fail, args);
                expect(success).toHaveBeenCalledWith({ 
                    pattern: "TIME",
                    timezone: "???",
                    utc_offset: 0,
                    dst_offset: 0
                });
            });

            it("returns TIME when length is full", function () {
                args[0].options.formatLength = "full";
                glob.getDatePattern(success, fail, args);
                expect(success).toHaveBeenCalledWith({ 
                    pattern: "TIME",
                    timezone: "???",
                    utc_offset: 0,
                    dst_offset: 0
                });
            });
        });

        describe("when the selector is date", function () {
            beforeEach(function () {
                args[0].options.selector = "date";
            });

            it("returns TIME when length is short", function () {
                args[0].options.formatLength = "short";
                glob.getDatePattern(success, fail, args);
                expect(success).toHaveBeenCalledWith({
                    pattern: "L",
                    timezone: "???",
                    utc_offset: 0,
                    dst_offset: 0
                });
            });

            it("returns TIME when length is medium", function () {
                args[0].options.formatLength = "medium";
                glob.getDatePattern(success, fail, args);
                expect(success).toHaveBeenCalledWith({ 
                    pattern: "LL",
                    timezone: "???",
                    utc_offset: 0,
                    dst_offset: 0
                });
            });

            it("returns TIME when length is long", function () {
                args[0].options.formatLength = "long";
                glob.getDatePattern(success, fail, args);
                expect(success).toHaveBeenCalledWith({ 
                    pattern: "LLL",
                    timezone: "???",
                    utc_offset: 0,
                    dst_offset: 0
                });
            });

            it("returns TIME when length is full", function () {
                args[0].options.formatLength = "full";
                glob.getDatePattern(success, fail, args);
                expect(success).toHaveBeenCalledWith({ 
                    pattern: "LLLL",
                    timezone: "???",
                    utc_offset: 0,
                    dst_offset: 0
                });
            });
        });

        describe("when the selector is date and time", function () {
            beforeEach(function () {
                args[0].options.selector = "date and time";
            });

            it("returns L TIME when length is short", function () {
                args[0].options.formatLength = "short";
                glob.getDatePattern(success, fail, args);
                expect(success).toHaveBeenCalledWith({ 
                    pattern: "L TIME",
                    timezone: "???",
                    utc_offset: 0,
                    dst_offset: 0
                });
            });

            it("returns LL TIME when length is medium", function () {
                args[0].options.formatLength = "medium";
                glob.getDatePattern(success, fail, args);
                expect(success).toHaveBeenCalledWith({ 
                    pattern: "LL TIME",
                    timezone: "???",
                    utc_offset: 0,
                    dst_offset: 0
                });
            });

            it("returns LLL TIME when length is long", function () {
                args[0].options.formatLength = "long";
                glob.getDatePattern(success, fail, args);
                expect(success).toHaveBeenCalledWith({ 
                    pattern: "LLL TIME",
                    timezone: "???",
                    utc_offset: 0,
                    dst_offset: 0
                });
            });

            it("returns LLLL TIME when length is full", function () {
                args[0].options.formatLength = "full";
                glob.getDatePattern(success, fail, args);
                expect(success).toHaveBeenCalledWith({ 
                    pattern: "LLLL TIME",
                    timezone: "???",
                    utc_offset: 0,
                    dst_offset: 0
                });
            });
        });
    });

    describe("getDateNames", function () {
        var args;
        beforeEach(function () {
            args = [{}];

            spyOn(global, "moment");
            moment.months = ["An array of months in long format"];
            moment.monthsShort = ["An array of months in short format"];
            moment.weekdays = ["An array of weekdays in long format"];
            moment.weekdaysShort = ["An array of weekdays in short format"];
        });

        it("returns moment.months when no args", function () {
            glob.getDateNames(success, null, args);
            expect(success).toHaveBeenCalledWith({value: moment.months});
        });

        describe("the item is months", function () {
            beforeEach(function () {
                args[0].options = { item: 'months' };
            });

            it("returns moment.months when type is wide", function () {
                args[0].options.type = 'wide';
                glob.getDateNames(success, null, args);
                expect(success).toHaveBeenCalledWith({value: moment.months});
            });

            it("returns moment.monthsShort when type is narrow", function () {
                args[0].options.type = 'narrow';
                glob.getDateNames(success, null, args);
                expect(success).toHaveBeenCalledWith({value: moment.monthsShort});
            });
        });

        describe("the item is days", function () {
            beforeEach(function () {
                args[0].options = { item: 'days' };
            });

            it("returns moment.weekdays when type is wide", function () {
                args[0].options.type = 'wide';
                glob.getDateNames(success, null, args);
                expect(success).toHaveBeenCalledWith({value: moment.weekdays});
            });

            it("returns moment.weekdaysShort when type is narrow", function () {
                args[0].options.type = 'narrow';
                glob.getDateNames(success, null, args);
                expect(success).toHaveBeenCalledWith({value: moment.weekdaysShort});
            });
        });
    });

    describe("isDayLightSavingsTime", function () {
        var deviceSettings = ripple('deviceSettings'),
            args = [{ date: new Date() }];

        it("gets the value from deviceSettings", function () {
            spyOn(deviceSettings, "retrieveAsBoolean").andReturn(true);
            glob.isDayLightSavingsTime(success, fail, args);
            expect(deviceSettings.retrieveAsBoolean).toHaveBeenCalledWith("globalization.isDayLightSavingsTime");
        });

        it("calls the success callback with the value from deviceSettings", function () {
            spyOn(deviceSettings, "retrieveAsBoolean").andReturn(true);
            glob.isDayLightSavingsTime(success, fail, args);
            expect(success).toHaveBeenCalledWith({dst: true});
        });
    });

    describe("getFirstDayOfWeek", function () {
        var deviceSettings = ripple('deviceSettings');

        it("gets the value from deviceSettings", function () {
            spyOn(deviceSettings, "retrieveAsInt").andReturn(2);
            glob.getFirstDayOfWeek(success, fail);
            expect(deviceSettings.retrieveAsInt).toHaveBeenCalledWith("globalization.firstDayOfWeek");
        });

        it("calls the success callback with the value from deviceSettings", function () {
            spyOn(deviceSettings, "retrieveAsInt").andReturn(2);
            glob.getFirstDayOfWeek(success, fail);
            expect(deviceSettings.retrieveAsInt).toHaveBeenCalledWith("globalization.firstDayOfWeek");
            expect(success).toHaveBeenCalledWith({value: 2});
        });
    });

    describe("numberToString", function () {
        describe("there is no type", function () {
            var args = [{number: 12}];

            beforeEach(function () {
                spyOn(global.accounting, "formatNumber").andReturn("1,234.56");
            });

            it("gets the value from accounting", function () {
                glob.numberToString(success, fail, args);
                expect(accounting.formatNumber).toHaveBeenCalledWith(12);
            });

            it("calls the success callback with the result", function () {
                glob.numberToString(success, fail, args);
                expect(success).toHaveBeenCalledWith({value: "1,234.56"});
            });
        });

        describe("type is decimal", function () {
            var args = [{number: 12, options: {type: 'decimal'}}];

            beforeEach(function () {
                spyOn(global.accounting, "formatNumber").andReturn("1,234.56");
            });

            it("gets the value from accounting", function () {
                glob.numberToString(success, fail, args);
                expect(accounting.formatNumber).toHaveBeenCalledWith(12);
            });

            it("calls the success callback with the result", function () {
                glob.numberToString(success, fail, args);
                expect(success).toHaveBeenCalledWith({value: "1,234.56"});
            });
        });

        describe("type is currency", function () {
            var args = [{number: 4433, options: {type: 'currency'}}];

            beforeEach(function () {
                spyOn(global.accounting, "formatMoney").andReturn("$1,234.56");
            });

            it("gets the value from accounting", function () {
                glob.numberToString(success, fail, args);
                expect(accounting.formatMoney).toHaveBeenCalledWith(4433);
            });

            it("calls the success callback with the result", function () {
                glob.numberToString(success, fail, args);
                expect(success).toHaveBeenCalledWith({value: "$1,234.56"});
            });
        });

        describe("type is percent", function () {
            it("calls the success callback with the result", function () {
                var args = [{number: 0.44, options: {type: 'percent'}}];
                glob.numberToString(success, fail, args);
                expect(success).toHaveBeenCalledWith({value: "44%"});
            });

            it("calls the success callback with the result for 1", function () {
                var args = [{number: 1, options: {type: 'percent'}}];
                glob.numberToString(success, fail, args);
                expect(success).toHaveBeenCalledWith({value: "100%"});
            });

            it("calls the success callback with the result for 2.547", function () {
                var args = [{number: 2.547, options: {type: 'percent'}}];
                glob.numberToString(success, fail, args);
                expect(success).toHaveBeenCalledWith({value: "255%"});
            });

            it("calls the success callback with the result for 12.547", function () {
                var args = [{number: 12.547, options: {type: 'percent'}}];
                glob.numberToString(success, fail, args);
                expect(success).toHaveBeenCalledWith({value: "1,255%"});
            });
            
            it("calls the success callback with the result for 0", function () {
                var args = [{number: 0, options: {type: 'percent'}}];
                glob.numberToString(success, fail, args);
                expect(success).toHaveBeenCalledWith({value: "0%"});
            });
        });
    });

    describe("stringToNumber", function () {
        beforeEach(function () {
            spyOn(global.accounting, "unformat").andReturn(123);
        });

        describe("there is no type", function () {
            var args = [{numberString: "5,544"}];

            it("gets the value from accounting", function () {
                glob.stringToNumber(success, fail, args);
                expect(accounting.unformat).toHaveBeenCalledWith("5,544");
            });

            it("calls the success callback with the result", function () {
                glob.stringToNumber(success, fail, args);
                expect(success).toHaveBeenCalledWith({value: 123});
            });
        });
        
        describe("type is decimal", function () {
            var args = [{numberString: "1,234", options: {type: 'decimal'}}];

            it("gets the value from accounting", function () {
                glob.stringToNumber(success, fail, args);
                expect(accounting.unformat).toHaveBeenCalledWith("1,234");
            });

            it("calls the success callback with the result", function () {
                glob.stringToNumber(success, fail, args);
                expect(success).toHaveBeenCalledWith({value: 123});
            });
        });

        describe("type is currency", function () {
            var args = [{numberString: "$11,234.34", options: {type: 'currency'}}];

            it("gets the value from accounting", function () {
                glob.stringToNumber(success, fail, args);
                expect(accounting.unformat).toHaveBeenCalledWith("$11,234.34");
            });

            it("calls the success callback with the result", function () {
                glob.stringToNumber(success, fail, args);
                expect(success).toHaveBeenCalledWith({value: 123});
            });
        });

        describe("type is percent", function () {
            var args = [{numberString: "544%", options: {type: 'percent'}}];

            it("gets the value from accounting", function () {
                glob.stringToNumber(success, fail, args);
                expect(accounting.unformat).toHaveBeenCalledWith("544%");
            });

            it("calls the success callback with the result", function () {
                glob.stringToNumber(success, fail, args);
                expect(success).toHaveBeenCalledWith({value: 1.23});
            });
        });
    });


    describe("getNumberPattern", function () {
        it("gives the formatting information", function () {
            glob.getNumberPattern(success, fail, [{}]);
            expect(success).toHaveBeenCalledWith({
                pattern: "#,##0",
                symbol: ".",
                fraction: 0,
                rounding: accounting.settings.number.precision,
                positive: "",
                negative: "-",
                decimal: accounting.settings.number.decimal,
                grouping: accounting.settings.number.thousand
            });
        });

        it("gives the formatting information", function () {
            glob.getNumberPattern(success, fail, [{type: 'decimal'}]);
            expect(success).toHaveBeenCalledWith({
                pattern: "#,##0",
                symbol: ".",
                fraction: 0,
                rounding: accounting.settings.number.precision,
                positive: "",
                negative: "-",
                decimal: accounting.settings.number.decimal,
                grouping: accounting.settings.number.thousand
            });
        });

        it("gives the formatting information for currency", function () {
            glob.getNumberPattern(success, fail, [{type: 'currency'}]);
            expect(success).toHaveBeenCalledWith({
                pattern: accounting.settings.currency.symbol + "#,##0.00",
                symbol: ".",
                fraction: 0,
                rounding: accounting.settings.currency.precision,
                positive: "",
                negative: "-",
                decimal: accounting.settings.currency.decimal,
                grouping: accounting.settings.currency.thousand
            });
        });

        it("gives the formatting information for percent", function () {
            glob.getNumberPattern(success, fail, [{type: 'percent'}]);
            expect(success).toHaveBeenCalledWith({
                pattern: "#,##0%",
                symbol: ".",
                fraction: 0,
                rounding: 0,
                positive: "",
                negative: "-",
                decimal: accounting.settings.number.decimal,
                grouping: accounting.settings.number.thousand
            });
        });
    });

    describe("getCurrencyPattern", function () {
        it("gives the formatting information", function () {
            glob.getCurrencyPattern(success, fail, [{currencyCode: 'USD'}]);
            expect(success).toHaveBeenCalledWith({
                pattern: accounting.settings.currency.symbol + "#,##0.00",
                code: 'USD',
                fraction: 0,
                rounding: accounting.settings.currency.precision,
                decimal: accounting.settings.currency.decimal,
                grouping: accounting.settings.currency.thousand
            });
        });
    });
});
