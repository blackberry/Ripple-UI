if (!document.getElementById("emulator-booting")) {
    console.log("frame window");
    var script = document.createElement("script");
    script.innerHTML = "window.top.require('ripple/bootstrap').inject(window, document);console.log('injected');";
    document.documentElement.appendChild(script);
}

