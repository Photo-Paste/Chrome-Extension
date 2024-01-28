document.addEventListener('DOMContentLoaded', function() {
    chrome.runtime.sendMessage({message: "getUserEmail"}, function(response) {
        if (response && response.userDetails) {
            const userEmail = response.email;

            fetchMessages(userEmail);
        }

        document.getElementById('copy-button').addEventListener('click', function() {
            toggleMessagesDisplay();
        });
    });
});

let messageOptions = [];

function fetchMessages(email) {
    fetch(`http://68.183.156.19/records/${email}`)
        .then(response => response.json())
        .then(messages => {
            if (messages && messages.length > 0) {
                populateDropdown(messages.slice(-5));
            }
        })
        .catch(error => {
            console.error('Failed to fetch messages:', error);
            document.getElementById('user-email').textContent += '\nUnable to fetch messages';
        });
}

function populateDropdown(messages) {
    const dropdown = document.getElementById('message-dropdown');
    messageOptions = []; // Reset the array
    dropdown.innerHTML = '';

    messages.forEach((message, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `Message ID: ${message.id}, Text: ${message.text}`;
        dropdown.appendChild(option);

        messageOptions.push(message.text);
    });
}

function copySelectedMessage() {
    const dropdown = document.getElementById('message-dropdown');
    const selectedMessage = messageOptions[dropdown.value];
    if (selectedMessage) {
        navigator.clipboard.writeText(selectedMessage)
            .then(() => {
                console.log('Message copied to clipboard');
            })
            .catch(err => console.error('Failed to copy text: ', err));
    } else {
        console.log('No message selected or available to copy');
    }
}

function toggleMessagesDisplay() {
    const dropdown = document.getElementById('message-dropdown');
    const isVisible = dropdown.style.display === 'block';
    dropdown.style.display = isVisible ? 'none' : 'block';

    if (!isVisible) {
        copySelectedMessage();
    }
}
