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
describe("webworks Task", function () {
    var Task = require('ripple/platform/webworks.handset/2.0.0/server/Task'),
        TaskClient = require('ripple/platform/webworks.handset/2.0.0/client/Task'),
        Recurrence = require('ripple/platform/webworks.handset/2.0.0/client/Recurrence'),
        Reminder = require('ripple/platform/webworks.handset/2.0.0/client/Reminder'),
        webworks = require('ripple/platform/webworks.handset/2.0.0/server'),
        db = require('ripple/db'),
        select = require('ripple/platform/webworks.core/2.0.0/select'),
        FilterExpression = require('ripple/platform/webworks.handset/2.0.0/client/FilterExpression'),
        spec = require('ripple/platform/webworks.handset/2.0.0/spec'),
        transport = require('ripple/platform/webworks.core/2.0.0/client/transport');

    describe("server index", function () {
        it("exposes the module", function () {
            expect(webworks.blackberry.pim.Task).toEqual(Task);
        });
    });

    describe("spec index", function () {
        it("includes module according to proper object structure", function () {
            expect(spec.objects.blackberry.children.pim.children.Task.path)
                .toEqual("webworks.handset/2.0.0/client/Task");
        });
    });

    describe("client", function () {
        describe("constructor", function () {
            describe("priority", function () {
                it("defaults to normal", function () {
                    expect(new TaskClient().priority).toEqual(TaskClient.PRIORITY_NORMAL);
                });
            });

            describe("status", function () {
                it("defaults to not started", function () {
                    expect(new TaskClient().status).toEqual(TaskClient.NOT_STARTED);
                });
            });

            describe("save", function () {
                it("generates a uuid when saved", function () {
                    spyOn(Math, "uuid").andReturn("234");
                    spyOn(transport, "call");

                    var task = new TaskClient();
                    task.save();

                    expect(task.uid).toEqual("234");
                    expect(Math.uuid).toHaveBeenCalledWith(null, 16);
                });

                it("calls the transport with id and properties", function () {
                    var task = new TaskClient();

                    spyOn(Math, "uuid").andReturn("42");
                    spyOn(transport, "call");

                    task.save();

                    expect(transport.call).toHaveBeenCalledWith("blackberry/pim/Task/save", {
                        post: {
                            task: task
                        }
                    });
                });

            });

            describe("remove", function () {
                it("calls the transport with id and properties", function () {
                    var task = new TaskClient();
                    spyOn(transport, "call");
                    task.uid = "id";
                    task.remove();
                    expect(transport.call).toHaveBeenCalledWith("blackberry/pim/Task/remove", {
                        get: {
                            id: "id"
                        }
                    });
                });

                it("throws exception when called before save", function () {
                    var task = new TaskClient();
                    spyOn(transport, "call");
                    expect(function () {
                        task.remove();
                    }).toThrow();
                });
            });
        });

        describe("module", function () {
            describe("find", function () {
                it("calls the transport with proper args", function () {
                    var tasks = [];
                    spyOn(transport, "call").andReturn(tasks);
                    expect(TaskClient.find(1, 2, 3, 4)).toEqual(tasks);
                    expect(transport.call).toHaveBeenCalledWith("blackberry/pim/Task/find", {
                        post: {
                            filter: 1,
                            orderBy: 2,
                            maxReturn: 3,
                            isAscending: 4
                        }
                    });
                });

                it("returns an array of massaged Task objects", function () {
                    var task = new TaskClient(),
                        tasks;

                    task.uid = "id";
                    task.note = "value";
                    task.due = new Date();
                    task.recurrence = new Recurrence();
                    task.recurrence.end = new Date();
                    task.reminder = new Reminder();
                    task.reminder.date = new Date();

                    spyOn(transport, "call").andReturn([JSON.parse(JSON.stringify(task))]);

                    tasks = TaskClient.find();

                    expect(tasks.length).toEqual(1);
                    expect(tasks[0].uid).toEqual(task.uid);
                    expect(tasks[0].note).toEqual(task.note);
                    expect(tasks[0].due).toEqual(task.due);
                    expect(tasks[0].recurrence.end).toEqual(task.recurrence.end);
                    expect(tasks[0].reminder.date).toEqual(task.reminder.date);
                });
            });
        });
    });

    describe("server module", function () {
        describe("find", function () {
            it("calls select module with filter expression", function () {
                var filter = new FilterExpression(),
                    chain = {
                        where: jasmine.createSpy()
                    };
                spyOn(select, "from").andReturn(chain);
                Task.find({}, {filter: filter});
                expect(chain.where).toHaveBeenCalledWith(filter);
            });

            it("returns unfiltered list of tasks", function () {
                var task = {
                        uid: "id",
                        prop: "value"
                    },
                    tasks = {
                        "id": task
                    };

                spyOn(select, "from").andReturn({
                    where: jasmine.createSpy().andReturn([task])
                });
                spyOn(db, "saveObject");
                spyOn(db, "retrieveObject").andReturn(tasks);

                expect(Task.find({}, {}).data).toEqual([task]);
            });

            it("passes maxReturn", function () {
                var chain = {
                    where: jasmine.createSpy(),
                    max: jasmine.createSpy().andReturn(chain)
                };
                spyOn(select, "from").andReturn(chain);
                Task.find({}, {filter: new FilterExpression(), maxReturn: 2});
                expect(chain.max).toHaveBeenCalledWith(2);
            });

            it("passes orderBy", function () {
                var chain = {
                    where: jasmine.createSpy(),
                    orderBy: jasmine.createSpy().andReturn(chain)
                };
                spyOn(select, "from").andReturn(chain);
                Task.find({}, {filter: new FilterExpression(), orderBy: "orderByProp"});
                expect(chain.orderBy).toHaveBeenCalledWith("orderByProp", "asc");
            });

            it("passes desc when not isAscending", function () {
                var chain = {
                    where: jasmine.createSpy(),
                    orderBy: jasmine.createSpy().andReturn(chain)
                };
                spyOn(select, "from").andReturn(chain);
                Task.find({}, {filter: new FilterExpression(), orderBy: "foo", isAscending: false});
                expect(chain.orderBy.mostRecentCall.args[1]).toEqual("desc");
            });

            it("passes asc when isAscending", function () {
                var chain = {
                    where: jasmine.createSpy(),
                    orderBy: jasmine.createSpy().andReturn(chain)
                };
                spyOn(select, "from").andReturn(chain);
                Task.find({}, {filter: new FilterExpression(), orderBy: "foo", isAscending: true});
                expect(chain.orderBy.mostRecentCall.args[1]).toEqual("asc");
            });
        });

        describe("save", function () {
            it("persists a new task", function () {
                var tasks = {},
                    task = {
                        uid: "1234",
                        prop: "value"
                    };

                spyOn(db, "saveObject");
                spyOn(db, "retrieveObject").andReturn(tasks);
                Task.save({}, {task: task});

                expect(tasks).toEqual({
                    "1234": task
                });
                expect(db.saveObject).toHaveBeenCalledWith("blackberry-pim-task", tasks);
            });

            it("mixes into an existing task", function () {
                var task = {
                        "prop": "value",
                        "uid": "456",
                        "1": "2"
                    },
                    tasks = {
                        "456": {
                            "uid": "456",
                            "1": "3"
                        }
                    };

                spyOn(db, "saveObject");
                spyOn(db, "retrieveObject").andReturn(tasks);
                Task.save({}, {task: task});

                expect(tasks).toEqual({
                    "456": task
                });
                expect(db.saveObject).toHaveBeenCalledWith("blackberry-pim-task", tasks);
            });
        });

        describe("remove", function () {
            it("can remove a task", function () {
                var task = {
                        uid: "1234",
                        prop: "value"
                    },
                    tasks = {
                        "1234": task
                    };

                spyOn(db, "saveObject");
                spyOn(db, "retrieveObject").andReturn(tasks);

                Task.remove({id: "1234"}, {});

                expect(tasks).toEqual({});
                expect(db.saveObject).toHaveBeenCalledWith("blackberry-pim-task", tasks);
            });
        });
    });
});
