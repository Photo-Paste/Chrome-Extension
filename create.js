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
    messageOptions = [];
    dropdown.innerHTML = '';

    messages.forEach((message) => {
        const option = document.createElement('div');
        option.textContent = message.text;
        option.classList.add('dropdown-option');
        option.style.position = 'relative'; // Set the position of the option container to relative

        // Create an img element for the SVG icon
        const copyIcon = document.createElement('img');
        copyIcon.src = 'clipboard.svg'; // Path to your SVG icon
        copyIcon.alt = 'Copy'; // Alt text for accessibility
        copyIcon.classList.add('copy-icon'); // Add any styling classes here
        copyIcon.style.cssText = "position: absolute; top: 5px; right: 5px; cursor: pointer; width: 20px; height: 20px;"; // Position and size the SVG icon

        // Attach the click event listener to the SVG icon
        copyIcon.addEventListener('click', function() {
            navigator.clipboard.writeText(message.text)
                .then(() => {
                    console.log('Message copied to clipboard');
                })
                .catch(err => console.error('Failed to copy text: ', err));
        });

        // Append the SVG icon to the option container
        option.appendChild(copyIcon);
        dropdown.appendChild(option);
    });
}
