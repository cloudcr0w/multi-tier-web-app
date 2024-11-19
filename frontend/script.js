// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', () => {
	// Animate sections
	const sections = document.querySelectorAll('section')
	sections.forEach((section, index) => {
		setTimeout(() => {
			section.style.opacity = 1 // Apply animation effect
		}, index * 500) // Delay for each section
	})

	// Form submission logic
	const form = document.querySelector('#contact-form')
	form.addEventListener('submit', async e => {
		e.preventDefault() // Prevent default form submission

		const name = document.querySelector('#name').value
		const email = document.querySelector('#email').value
		const message = document.querySelector('#message').value

		try {
			// Send a POST request to the API
			const response = await fetch('https://api.crow-project.click/contact', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ name, email, message }),
			})

			// Check for server response status
			if (response.ok) {
				alert('Message sent successfully!')
			} else if (response.status === 400) {
				alert('Validation error: Please check your inputs.')
			} else if (response.status === 500) {
				alert('Server error: Please try again later.')
			} else {
				alert('Unexpected error: Please try again.')
			}

			// Log response data (optional)
			const data = await response.json()
			console.log('Response data:', data)
		} catch (err) {
			// Catch network or other errors
			console.error('Error:', err)
			alert('Error sending message. Please check your network connection.')
		}
	})
})
