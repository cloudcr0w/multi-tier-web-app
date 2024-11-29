document.addEventListener('DOMContentLoaded', () => {
	const form = document.querySelector('#contact-form')
	const messageDiv = document.querySelector('#form-message')
	const loading = document.querySelector('#loading')

	form.addEventListener('submit', async e => {
		e.preventDefault()

		const name = document.querySelector('#name').value.trim()
		const email = document.querySelector('#email').value.trim()
		const message = document.querySelector('#message').value.trim()

		messageDiv.classList.add('hidden')
		messageDiv.textContent = ''

		if (!name || !email || !message) {
			messageDiv.textContent = 'All fields are required.'
			messageDiv.classList.remove('hidden', 'success')
			messageDiv.classList.add('error')
			return
		}

		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			messageDiv.textContent = 'Please enter a valid email address.'
			messageDiv.classList.remove('hidden', 'success')
			messageDiv.classList.add('error')
			return
		}

		try {
			loading.classList.remove('hidden')

			const response = await fetch('https://api.crow-project.click/contact', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ name, email, message }),
				mode: 'cors',
			})

			if (response.ok) {
				const responseData = await response.text()
				messageDiv.textContent = 'Message sent successfully!'
				messageDiv.classList.remove('hidden', 'error')
				messageDiv.classList.add('success')
				form.reset()
			} else {
				const errorText = await response.text()
				messageDiv.textContent = `Error: ${response.status} - ${errorText}`
				messageDiv.classList.remove('hidden', 'success')
				messageDiv.classList.add('error')
			}
		} catch (err) {
			console.error('Error:', err)

			messageDiv.textContent = 'Error sending message. Please check your network connection.'
			messageDiv.classList.remove('hidden', 'success')
			messageDiv.classList.add('error')
		} finally {
			loading.classList.add('hidden')
		}
	})
})
