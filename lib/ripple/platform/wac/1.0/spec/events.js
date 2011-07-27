module.exports = {
    "contexts": {
        "Widget": {
            "events": {
                "WidgetWakeup": {
                    name: "WidgetWakeup",
                    description: "onWakeup",
                    args: false
                },
                "WidgetMaximize": {
                    name: "WidgetMaximize",
                    description: "onMaximize",
                    args: false
                },
                "WidgetFocus": {
                    name: "WidgetFocus",
                    description: "onFocus",
                    args: false
                },
                "WidgetRestore": {
                    name: "WidgetRestore",
                    description: "onRestore",
                    args: false
                }
            },
            "context": "Widget"
        }
    }
};
