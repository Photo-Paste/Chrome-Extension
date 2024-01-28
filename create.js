document.addEventListener('DOMContentLoaded', function() {
    chrome.runtime.sendMessage({message: "getUserEmail"}, function(response) {
        if (response && response.userDetails) {
            document.getElementById('user-email').textContent = 'Your firebase profile_image: ' + response.email;
        } else {
            document.getElementById('user-email').textContent = 'Unable to fetch user details';
        }
    });
});