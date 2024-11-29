// Backend address (adjust to your EC2 public IP address or CloudFront URL when ready)
const backendUrl = 'http://54.174.25.230:3000/api/contact';

// Function to handle sending the contact form message
async function sendMessage(event) {
	event.preventDefault(); // Prevents page reload

	// Get form data
	const name = document.getElementById('name').value.trim();
	const email = document.getElementById('email').value.trim();
	const message = document.getElementById('message').value.trim();

	// Validate form data
	if (!name || !email || !message) {
		showPopup('Please fill out all fields.', 'error');
		return;
	}

	// Elements for handling messages and loading
	const loading = document.getElementById('loading');
	const formMessage = document.getElementById('form-message');

	// Show loading indicator
	loading.classList.remove('hidden');
	formMessage.classList.add('hidden');

	try {
		// Send data to the backend
		const response = await fetch(backendUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ name, email, message }),
		});

		// Handle response from the backend
		if (response.ok) {
			showPopup('Message sent successfully!', 'success');
			clearForm(); // Clear the form fields
		} else {
			const errorData = await response.json();
			showPopup(`Error: ${errorData.error || 'Failed to send message'}`, 'error');
		}
	} catch (error) {
		// Handle errors during sending
		console.error('Error sending message:', error);
		showPopup('An error occurred. Please try again later.', 'error');
	} finally {
		// Hide loading indicator
		loading.classList.add('hidden');
	}
}

// Function to display a popup message
function showPopup(message, type) {
	const popup = document.createElement('div');
	popup.className = `popup ${type}`;
	popup.textContent = message;

	// Add the popup to the DOM
	document.body.appendChild(popup);

	// Automatically remove the popup after 3 seconds
	setTimeout(() => {
		popup.remove();
	}, 3000);
}

// Function to clear form fields after a successful submission
function clearForm() {
	document.getElementById('name').value = '';
	document.getElementById('email').value = '';
	document.getElementById('message').value = '';
}

// Add event listener for form submission
document.getElementById('contact-form').addEventListener('submit', sendMessage);
