var hostName = 'io.metiq.posproxy';

chrome.runtime.onConnectExternal.addListener(function (port) {
    port.onMessage.addListener(function (message) {

        chrome.storage.sync.get(['posIpAddress', 'posPort'], function (items) {

            var posIpAddress = items.posIpAddress,
                posPort = items.posPort;

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
});