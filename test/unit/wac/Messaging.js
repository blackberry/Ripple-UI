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
describe("wac_Messaging", function () {

    var messaging = require('ripple/platform/wac/1.0/Messaging'),
        Message = require('ripple/platform/wac/1.0/Message'),
        platform = require('ripple/platform'),
        notifications = require('ripple/notifications'),
        constants = require('ripple/constants'),
        _console = require('ripple/console'),
        ExceptionTypes = require('ripple/platform/wac/1.0/ExceptionTypes'),
        MessageTypes = require('ripple/platform/wac/1.0/MessageTypes'),
        sinon = require('sinon'),
        s;

    beforeEach(function () {
        s = sinon.sandbox.create();
        spyOn(_console, "log");
    });


    afterEach(function () {
        s.verifyAndRestore();
    });

    it("is a message returned on create", function () {
        var msg = messaging.createMessage(MessageTypes.SMSMessage);

        expect(msg.messageType).toEqual(MessageTypes.SMSMessage, "The message isn't the right type");
    });

    it("is a message sent on send", function () {
        var text,
            msg = new Message();

        msg.messageType = MessageTypes.SMSMessage;
        msg.messageId = 1;
        msg.destinationAddress = "1234567890";
        text = "Sent " + msg.messageType + " " + msg.messageId + " to " + msg.destinationAddress;

        spyOn(platform, "current").andReturn({name: "whatup"});
        s.mock(notifications).expects("openNotification")
                .withExactArgs(constants.NOTIFICATIONS.TYPES.NORMAL, text).once();

        messaging.sendMessage(msg);
    });

    it("send throws invalid parameter when not passed a message object", function () {
        expect(function () {
            messaging.sendMessage({});
        }).toThrow();
    });

    it("it can't add an address for something weird", function () {
        var msg = new Message();
        msg.addAddress("FOOOBAR", "5199541707");
        expect(msg.FOOOBAR).not.toBeDefined();
    });

    it("it can add the destination address", function () {
        var msg = new Message();
        msg.addAddress("destination", "5199541707");
        expect(msg.destinationAddress[0]).toEqual("5199541707");
    });

    it("it can add a couple destination addresses", function () {
        var msg = new Message();
        msg.addAddress("destination", "5199541707;2269297927");
        expect(msg.destinationAddress[0]).toEqual("5199541707");
        expect(msg.destinationAddress[1]).toEqual("2269297927");
    });

    it("it can add the cc address", function () {
        var msg = new Message();
        msg.addAddress("cc", "5199541707");
        expect(msg.ccAddress[0]).toEqual("5199541707");
    });

    it("it can add a couple cc addresses", function () {
        var msg = new Message();
        msg.addAddress("cc", "5199541707;2269297927");
        expect(msg.ccAddress[0]).toEqual("5199541707");
        expect(msg.ccAddress[1]).toEqual("2269297927");
    });

    it("it can add the bcc address", function () {
        var msg = new Message();
        msg.addAddress("bcc", "5199541707");
        expect(msg.bccAddress[0]).toEqual("5199541707");
    });

    it("it can add a couple bcc addresses", function () {
        var msg = new Message();
        msg.addAddress("bcc", "5199541707;2269297927");
        expect(msg.bccAddress[0]).toEqual("5199541707");
        expect(msg.bccAddress[1]).toEqual("2269297927");
    });

    it("it can delete a bcc address", function () {
        var msg = new Message();
        msg.addAddress("bcc", "5199541707;2269297927");
        msg.deleteAddress("bcc", "2269297927");

        expect(msg.bccAddress.length).toEqual(1);
        expect(msg.bccAddress[0]).toEqual("5199541707");
    });

});
