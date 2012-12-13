# Synopsis

    ripple device-proxy [--port xxxx] [--route xxxx]

# Description

    A device proxy, allowing for API calls to be proxied to a connected device, rather then emulated
    by Ripple

# Arguments

* --port   the port to host the application on
* --route  specify an optional path to prefix proxy routes with (ex: http://localhost:port/prefix/xhr_proxy)

# Example usage

    ripple device-proxy --port 1234
