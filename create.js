document.addEventListener('DOMContentLoaded', function() {
    chrome.runtime.sendMessage({message: "getUserEmail"}, function(response) {
        if (response && response.email) {
            document.getElementById('user-email').textContent = 'Your email: ' + response.email;
        } else {
            document.getElementById('user-email').textContent = 'Unable to fetch email';
        }
    });
});
