if (!document.getElementById("emulator-booting") && !document.getElementById("tinyhippos-injected")) {
    var script = document.createElement("script");
    script.id = "tinyhippos-injected";
    script.src = chrome.extension.getURL("controllers/injector.js");
    document.documentElement.appendChild(script);
}
