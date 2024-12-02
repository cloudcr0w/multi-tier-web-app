// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', () => {
	const welcomeScreen = document.getElementById('welcome-screen')
	const mainContent = document.getElementById('main-content')
	const welcomeButton = document.getElementById('welcome-button')

	// Handle click on the welcome button
	welcomeButton.addEventListener('click', () => {
		// Hide the welcome screen
		welcomeScreen.classList.add('hidden')

		// Display the main content after the transition
		setTimeout(() => {
			welcomeScreen.style.display = 'none'
			mainContent.style.display = 'block'
			mainContent.classList.add('fade-in')
		}, 500) // Match the CSS transition duration
	})
})
// JavaScript to set the current year
document.getElementById('current-year').textContent = new Date().getFullYear()

// Backend API endpoint
const backendUrl = 'https://d34d0xv55dvwew.cloudfront.net/api/contact'

// Handle form submission
async function sendMessage(event) {
	event.preventDefault() // Prevent default form submission behavior

	// Get input values from the form
	const name = document.getElementById('name').value.trim()
	const email = document.getElementById('email').value.trim()
	const message = document.getElementById('message').value.trim()

	// Validate the inputs
	if (!name || !email || !message) {
		showPopup('Please fill out all fields.', 'error')
		return
	}

	// Show loading indicator
	const loading = document.getElementById('loading')
	loading.textContent = 'Sending...' // Ensure correct text
	loading.classList.remove('hidden')

	// Hide any previous messages
	const formMessage = document.getElementById('form-message')
	formMessage.classList.add('hidden')

	try {
		// Send form data to the backend API
		const response = await fetch(backendUrl, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ name, email, message }),
		})

		// Handle the response
		if (response.ok) {
			showPopup('Message sent successfully!', 'success')
			clearForm()
		} else {
			const errorData = await response.json()
			const errorMessage = errorData.error || 'Failed to send message'
			showPopup(`Error: ${errorMessage}`, 'error')
		}
	} catch (error) {
		// Handle network or unexpected errors
		console.error('Error sending message:', error)
		showPopup('A network error occurred. Please try again later.', 'error')
	} finally {
		// Hide the loading indicator
		loading.classList.add('hidden')
		loading.textContent = '' // Reset the text
	}
}

// Show a popup message
function showPopup(message, type) {
	// Create a new popup element
	const popup = document.createElement('div')
	popup.className = `popup ${type}`
	popup.textContent = message

	// Append the popup to the body
	document.body.appendChild(popup)

	// Remove the popup after 3 seconds
	setTimeout(() => {
		popup.classList.add('removing') // Trigger fade-out animation
		setTimeout(() => {
			popup.remove() // Remove from the DOM after the animation
		}, 500) // Match the animation duration
	}, 3000)
}

// Clear form inputs
function clearForm() {
	document.getElementById('name').value = ''
	document.getElementById('email').value = ''
	document.getElementById('message').value = ''
}

// Add event listener for form submission
document.getElementById('contact-form').addEventListener('submit', sendMessage)
