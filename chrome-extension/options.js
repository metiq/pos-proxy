function save_options() {
    chrome.storage.sync.set({
        posIpAddress: document.getElementById('posIpAddress').value,
        posPort: document.getElementById('posPort').value
    }, function () {
        // Update status to let user know options were saved.
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function () {
            status.textContent = '';
        }, 750);
    });
}

function restore_options() {
    chrome.storage.sync.get(['posIpAddress', 'posPort'], function (items) {
        document.getElementById('posIpAddress').value = items.posIpAddress || '';
        document.getElementById('posPort').value = items.posPort || '';
    });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);