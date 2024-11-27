document.querySelector('#loading').classList.remove('hidden')
document.querySelector('#loading').classList.add('hidden')

document.addEventListener('DOMContentLoaded', () => {
	const form = document.querySelector('#contact-form')
	const messageDiv = document.querySelector('#form-message')

	form.addEventListener('submit', async e => {
		e.preventDefault()

		const name = document.querySelector('#name').value.trim()
		const email = document.querySelector('#email').value.trim()
		const message = document.querySelector('#message').value.trim()

		messageDiv.classList.add('hidden')
		messageDiv.textContent = ''

		try {
			const response = await fetch('https://api.crow-project.click/contact', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ name, email, message }),
			})

			if (response.ok) {
				messageDiv.textContent = 'Message sent successfully!'
				messageDiv.classList.remove('hidden', 'error')
				messageDiv.classList.add('success')

				form.reset()
			} else {
				messageDiv.textContent = 'Error: ' + response.statusText
				messageDiv.classList.remove('hidden', 'success')
				messageDiv.classList.add('error')
			}
		} catch (err) {
			console.error('Error:', err)

			messageDiv.textContent = 'Error sending message. Please check your network connection.'
			messageDiv.classList.remove('hidden', 'success')
			messageDiv.classList.add('error')
		}
	})
})
