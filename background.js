chrome.runtime.onInstalled.addListener(() => {
    chrome.identity.getAuthToken({ 'interactive': true }, function(token) {
        if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message);
            return;
        }

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
                    if (userInfo && userInfo.email) {
                        fetchUserInfo(userInfo.email).then(userDetails => {
                            sendResponse({ email: userInfo.email, userDetails: userDetails });
                        });
                    }
                })
                .catch(error => {
                    console.error(error);
                    sendResponse({ email: null });
                });
        });

        return true;
    }
});

function fetchUserInfo(email) {
    return fetch(`http://68.183.156.19/users/${email}`)
        .then(response => response.json())
        .catch(error => console.error(error));
}