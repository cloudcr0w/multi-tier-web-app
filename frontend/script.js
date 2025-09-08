const chatMessages = document.getElementById("chat-messages");
const chatInput = document.getElementById("chat-input");
const chatSend = document.getElementById("chat-send");

document.addEventListener('DOMContentLoaded', () => {
    const welcomeScreen = document.getElementById('welcome-screen')
    const mainContent = document.getElementById('main-content')
    const welcomeButton = document.getElementById('welcome-button')
    const chatContainer = document.getElementById('chat-container'); // Chatbot container

    // Handle click on the welcome button
    welcomeButton.addEventListener('click', () => {
        // Hide the welcome screen
        welcomeScreen.classList.add('hidden')

        // Display the main content and chatbot after the transition
        setTimeout(() => {
            welcomeScreen.style.display = 'none'
            mainContent.style.display = 'block'
            chatContainer.style.display = 'block'; // Show chatbot after delay
            setTimeout(() => {
                chatContainer.classList.add('show'); // Add the class to trigger animation
            }, 500); // Delay the chatbot appearance
            mainContent.classList.add('fade-in')
        }, 500) // Match the CSS transition duration
    })
})
// JavaScript to set the current year
document.getElementById('current-year').textContent = new Date().getFullYear()

// Backend API endpoint
const backendUrl = 'https://d34d0xv55dvwew.cloudfront.net/api/contact'



// scroll-up button
const scrollTopBtn = document.getElementById('scroll-top-btn');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollTopBtn.classList.add('show');
        scrollTopBtn.classList.remove('hide');
    } else {
        scrollTopBtn.classList.add('hide');
        scrollTopBtn.classList.remove('show');
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    scrollTopBtn.classList.add('hide');
    scrollTopBtn.classList.remove('show');
});

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

// Toggle visibility with smooth transition
document.querySelectorAll('.toggle-btn').forEach(button => {
    button.addEventListener('click', () => {
        const project = button.closest('.project')
        const details = project.querySelector('.project-details')
        const isExpanded = details.classList.contains('expanded')

        details.classList.toggle('expanded')
        button.textContent = isExpanded ? 'Show More ⬇️' : 'Show Less ⬆️'
    })
})

fetch("https://67h17n0zlb.execute-api.us-east-1.amazonaws.com/prod/track", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ page: "home" })
});

// chatbot
chatSend.addEventListener("click", () => {
  const text = chatInput.value.trim();
  if(text) {
    addMessage(text, "user");
    chatInput.value = "";

    addTypingIndicator();

    fetch("https://fpibcdob4c.execute-api.us-east-1.amazonaws.com/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text })
    })
    .then(res => res.json())
    .then(data => {
      removeTypingIndicator();
      addMessage(data.reply, "bot");
    })
    .catch(err => {
      removeTypingIndicator();
      addMessage("⚠️ Error contacting AI API", "bot");
      console.error(err);
    });
  }
});
function addMessage(text, sender) {
  const messageElement = document.createElement("div"); // Tworzymy nowy element dla wiadomości
  messageElement.classList.add(sender); // Ustawiamy klasę dla nadawcy wiadomości (np. "user" lub "bot")
  messageElement.textContent = text; // Ustawiamy tekst wiadomości
  chatMessages.appendChild(messageElement); // Dodajemy wiadomość do kontenera wiadomości

  // Auto scroll na dół po każdej nowej wiadomości
  chatMessages.scrollTop = chatMessages.scrollHeight;
}
function addTypingIndicator() {
  const typingElement = document.createElement("div");
  typingElement.classList.add("typing-indicator");
  typingElement.textContent = "🤖 Bot is typing...";
  chatMessages.appendChild(typingElement);
}

function removeTypingIndicator() {
  const typingElement = document.querySelector(".typing-indicator");
  if (typingElement) {
    typingElement.remove(); // Usuwamy wskaźnik ładowania po zakończeniu
  }
}


// // After showing chatbot, add fade-in class to animate
// chatContainer.classList.add('fade-in');
