if (!document.getElementById("emulator-booting") && !document.getElementById("tinyhippos-injected")) {
    var script = document.createElement("script");
    script.id = "tinyhippos-injected";
    script.innerText = 'if (window.top.require) { window.top.require("ripple/bootstrap").inject(window, document); }'; 
    document.documentElement.appendChild(script);
}
