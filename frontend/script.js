// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', () => {
	const sections = document.querySelectorAll('section')
	sections.forEach((section, index) => {
		setTimeout(() => {
			section.style.opacity = 1 // Apply animation effect
		}, index * 500) // Delay for each section
	})

	// Form submission logic
	const form = document.querySelector('#contact-form')
	form.addEventListener('submit', async e => {
		e.preventDefault()

		const name = document.querySelector('#name').value
		const email = document.querySelector('#email').value
		const message = document.querySelector('#message').value

		try {
			const response = await fetch('http://3.93.195.12:3000/contact', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ name, email, message }),
			})

			if (response.ok) {
				alert('Message sent successfully!')
			} else {
				alert('Error sending message. Please try again.')
			}
		} catch (err) {
			console.error('Error:', err)
			alert('Error sending message. Please check your network connection.')
		}
	})
})
