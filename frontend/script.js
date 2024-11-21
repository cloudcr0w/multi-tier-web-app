document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#contact-form');
    form.addEventListener('submit', async e => {
        e.preventDefault(); // Zapobiega domyślnej wysyłce formularza

        const name = document.querySelector('#name').value;
        const email = document.querySelector('#email').value;
        const message = document.querySelector('#message').value;

        try {
            const response = await fetch('https://api.crow-project.click/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, message }),
            });

            if (response.ok) {
                alert('Message sent successfully!');
            } else {
                alert('Error: ' + response.statusText);
            }
        } catch (err) {
            console.error('Error:', err);
            alert('Error sending message. Please check your network connection.');
        }
    });
});
