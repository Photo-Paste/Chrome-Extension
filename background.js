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
    // First, try to fetch user info with a GET request
    return fetch(`http://68.183.156.19/users/${email}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Fetch failed, trying to create a new account');
            }
            return response.json();
        })
        .catch(error => {
            console.error('GET request failed:', error.message);
            // If GET request fails, attempt to create user with POST request
            return createNewUser(email);
        });
}

function createNewUser(email) {
    const postData = {
        name: "Test",
        is_admin: false,
        profile_image_url: "profile",
        active: true
    };

    return fetch(`http://68.183.156.19/users/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to create new user');
        }
        return response.json();
    })
    .catch(error => {
        console.error('POST request failed:', error.message);
        return { error: 'Failed to fetch or create user' };
    });
}