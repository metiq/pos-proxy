function load_options() {
    chrome.storage.sync.get(['posIpAddress', 'posPort'], function (items) {
        document.getElementById('posIpAddress').innerText = items.posIpAddress || '-- not set ---';
        document.getElementById('posPort').innerText = items.posPort || '-- not set ---';
    });
}

document.addEventListener('DOMContentLoaded', load_options);
document.getElementById('btnOpenOptions').addEventListener('click', function () {
    chrome.runtime.openOptionsPage();
});