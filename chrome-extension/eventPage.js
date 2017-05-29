var hostName = 'io.metiq.posproxy',
    posIpAddress, posPort;

chrome.runtime.onConnectExternal.addListener(function (port) {
    port.onMessage.addListener(function (message, port) {

        if (!posIpAddress || !posPort) {
            port.postMessage({ error: 'POS address and port is not set, please set them in the extension\'s options.' });
            return;
        }

        var data = {
            address: posIpAddress,
            port: posPort,
            message: message
        };

        chrome.runtime.sendNativeMessage(hostName, data, function (response) {
            if (chrome.runtime.lastError) {
                port.postMessage({ error: chrome.runtime.lastError.message });
                return;
            }

            port.postMessage(response);
        });
    });
});

chrome.storage.sync.get(['posIpAddress', 'posPort'], function (items) {
    posIpAddress = items.posIpAddress;
    posPort = items.posPort;
});