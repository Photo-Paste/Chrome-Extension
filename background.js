chrome.runtime.onInstalled.addListener(() => {
    chrome.identity.getAuthToken({ 'interactive': true }, function(token) {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message);
            return;
        }

        // Fetch user info
        fetch('https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=' + token)
            .then(response => response.json())
            .then(userInfo => {
                if (userInfo && userInfo.email) {
                    chrome.runtime.sendMessage({ email: userInfo.email });
                }
            })
            .catch(error => console.error(error));
    });
});

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.message === "getUserEmail") {
        chrome.identity.getAuthToken({ 'interactive': false }, function(token) {
            if (chrome.runtime.lastError) {
                sendResponse({ email: null });
                return;
            }

            fetch('https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=' + token)
                .then(response => response.json())
                .then(userInfo => {
                    sendResponse({ email: userInfo.email });
                })
                .catch(error => {
                    console.error(error);
                    sendResponse({ email: null });
                });
        });

        return true; // Indicates that the response is asynchronous
    }
});
