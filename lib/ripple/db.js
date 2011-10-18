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
var _self,
    _db,
    utils = require('ripple/utils'),
    constants = require('ripple/constants'),
    event = require('ripple/event'),
    _cache = {};

function _validateAndSetPrefix(prefix) {
    if (prefix) {
        utils.validateArgumentType(prefix, "string");
    }

    return prefix || constants.COMMON.PREFIX;
}

function _createKey(key, prefix) {
    return _validateAndSetPrefix(prefix) + key;
}

function _createItem(key, value, prefix) {
    return {
        id: _createKey(key, prefix),
        key: key,
        value: value,
        prefix: _validateAndSetPrefix(prefix)
    };
}

function _save(key, value, prefix, callback) {
    var item = _createItem(key, value, prefix);
    _cache[item.id] = item;

    _db.transaction(function (tx) {
        tx.executeSql('REPLACE INTO persistence (id, key, value, prefix) VALUES (?, ?, ?, ?)', [item.id, item.key, item.value, item.prefix], function () {
            return callback && callback();
        });
    });
}

function _retrieve(key, prefix) {
    var item = _cache[_createKey(key, prefix)];
    return item ? item.value : undefined;
}

function _retrieveAll(prefix, callback) {
    var result = {};

    if (prefix) {
        utils.forEach(_cache, function (value, key) {
            if (value.prefix === prefix) {
                result[value.key] = value.value;
            }
        });
    }

    callback.apply(null, [result]);
}

function _remove(key, prefix, callback) {
    delete _cache[_createKey(key, prefix)];

    _db.transaction(function (tx) {
        tx.executeSql('DELETE FROM persistence WHERE key = ? AND prefix = ?', [key, _validateAndSetPrefix(prefix)], function () {
            return callback && callback();
        });
    });
}

function _removeAll(prefix, callback) {
    utils.forEach(_cache, function (value, key) {
        if (!prefix || key.indexOf(prefix) === 0) {
            delete _cache[key];
        }
    });

    _db.transaction(function (tx) {
        if (prefix) {
            tx.executeSql('DELETE FROM persistence WHERE prefix = ?', [prefix], function () {
                return callback && callback();
            });
        } else {
            tx.executeSql('DELETE FROM persistence', [], function () {
                return callback && callback();
            });
        }
    });
}

_self = {
    save: function (key, value, prefix, callback) {
        _save(key, value, prefix, callback);
        event.trigger("StorageUpdatedEvent");
    },

    saveObject: function (key, obj, prefix, callback) {
        _save(key, JSON.stringify(obj), prefix, callback);
        event.trigger("StorageUpdatedEvent");
    },

    retrieve: function (key, prefix) {
        return _retrieve(key, prefix);
    },

    retrieveObject: function (key, prefix) {
        var retrievedValue = _retrieve(key, prefix);
        return retrievedValue ? JSON.parse(retrievedValue) : retrievedValue;
    },

    retrieveAll: function (prefix, callback) {
        return _retrieveAll(prefix, callback);
    },

    remove: function (key, prefix, callback) {
        event.trigger("StorageUpdatedEvent");
        _remove(key, prefix, callback);
    },

    removeAll: function (prefix, callback) {
        _removeAll(prefix, callback);
        event.trigger("StorageUpdatedEvent");
    },

    initialize: function (previous, baton) {
        baton.take();

        _db = openDatabase('tinyHippos', '1.0', 'tiny Hippos persistence', 2 * 1024 * 1024);
        _db.transaction(function (tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS persistence (id unique, key, value, prefix)');

            tx.executeSql('SELECT id, key, value, prefix FROM persistence', [], function (tx, results) {
                var len = results.rows.length, i, item;

                for (i = 0; i < len; i++) {
                    item = results.rows.item(i);
                    _cache[item.id] = item;
                }

                baton.pass();
            });
        });
    }
};

module.exports = _self;
