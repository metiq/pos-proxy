# pos-proxy
POS Proxy is a browser extension and native message host that enables web pages to connect to POS terminals via TCP sockets.

Example usage:
```javascript
function makePOSPayment(payment) {
    var extensionId = "dphlfblnpgpkjmckdehggknkknlihoed";

    var message = {
        // ... Some data that the POS understands
    };

    // We use the connect instead of sendMessage because the extension makes another asyn call
    // to the native message host, so the callback fires before the extension gets the real response back
    var port = chrome.runtime.connect(editorExtensionId);
    port.onMessage.addListener(function (response) {

        // Do stuff with the response

        // Disconnect here because there is no need to keep the connection open
        // some use cases might be better with keeping it open
        port.disconnect();
    });

    port.postMessage(message);
}
```
