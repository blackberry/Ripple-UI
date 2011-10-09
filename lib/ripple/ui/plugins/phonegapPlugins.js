var constants = require('ripple/constants'),
    platform = require('ripple/platform'),
    Plugin = require('ripple/platform/phonegap/1.0/Plugin'),
    utils = require('ripple/utils'),
    plugins = require('ripple/platform/phonegap/1.0/plugins');

function _getPluginProperties() {
    var name = jQuery("#phonegap-plugin-name").val();
    var action = jQuery("#phonegap-plugin-action").val();
    var args = jQuery("#phonegap-plugin-args").val();
    var result = jQuery("#phonegap-plugin-result").val();
    return {
            name: name,
            action: action,
            args: args,
            result: result
    }
}
function _setPluginProperties(plugin) {
    jQuery("#phonegap-plugin-name").val(plugin.name);
    jQuery("#phonegap-plugin-action").val(plugin.action);
    jQuery("#phonegap-plugin-args").val(plugin.args);
    jQuery("#phonegap-plugin-result").val(JSON.stringify(plugin.result));
}
function _resetPluginProperties(plugin) {
    jQuery("#phonegap-plugin-name").val("");
    jQuery("#phonegap-plugin-action").val("");
    jQuery("#phonegap-plugin-args").val("");
    jQuery("#phonegap-plugin-result").val("");
}
function _updateSelector() {
    var registeredPlugins = jQuery("#phonegap-plugin-registered");
    jQuery(registeredPlugins).html("<option>  ----  </option>");
    
    if (plugins.findAll()) {
        plugins.findAll().forEach(function (plugin, key) {
            jQuery(registeredPlugins).append("<option value='"+plugin.name+"'>"+plugin.name+"</option>");
        });
    }
}

module.exports = {
    panel: {
        domId: "phonegapplugins-container",
        collapsed: true,
        pane: "right"
    },
    initialize: function () {
        _updateSelector();

        var register = jQuery("#phonegap-plugin-register");
        register.bind("click", function() {
            var pluginProperties = _getPluginProperties();
            if (pluginProperties.name) {
                var plugin = new Plugin();
                utils.mixin(pluginProperties, plugin);
                plugin.save(_updateSelector);
            }
            _resetPluginProperties();
            _updateSelector();
        });

        var pluginSelect = jQuery("#phonegap-plugin-registered");
        pluginSelect.bind("change", function() {
            var pluginName = jQuery("#phonegap-plugin-registered option:selected").val();
            plugins.find(pluginName, function(plugin) {
                _setPluginProperties(plugin);
            });
        });

        var get = jQuery("#phonegap-plugin-get");
        get.bind("click", function() {
            console.log(plugins.findAll());
        });

        var remove = jQuery("#phonegap-plugin-remove");
        remove.bind("click", function() {
            var pluginName = jQuery("#phonegap-plugin-registered option:selected").val();
            var plugin = plugins.find(pluginName);
            plugin.remove();
            _updateSelector();
        });

        var removeAll = jQuery("#phonegap-plugin-remove-all");
        removeAll.bind("click", function() {
            plugins.removeAll();
            _updateSelector();
        });
    }
};
