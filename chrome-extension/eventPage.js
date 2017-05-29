var hostName = 'io.metiq.posproxy';

chrome.runtime.onConnectExternal.addListener(function (port) {
  port.onMessage.addListener(function (message, port) {
    chrome.runtime.sendNativeMessage(hostName, message, function (response) {
      port.postMessage(response);
    });
  });
});