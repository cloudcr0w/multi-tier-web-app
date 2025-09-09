const chatMessages = document.getElementById("chat-messages");
const chatInput = document.getElementById("chat-input");
const chatSend = document.getElementById("chat-send");

document.addEventListener('DOMContentLoaded', () => {
    const welcomeScreen = document.getElementById('welcome-screen')
    const mainContent = document.getElementById('main-content')
    const welcomeButton = document.getElementById('welcome-button')
    const chatContainer = document.getElementById('chat-container'); 

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
// === CHATBOT ===
(function () {
  const chatBackendUrl = "https://fpibcdob4c.execute-api.us-east-1.amazonaws.com/chat";

  const $messages  = document.getElementById("chat-messages");
  const $input     = document.getElementById("chat-input");
  const $send      = document.getElementById("chat-send");
  const $container = document.getElementById("chat-container");

  if (!$messages || !$input || !$send || !$container) {
    console.warn("[chat] Elements not found, skipping init.");
    return;
  }

  // Pojawienie z opóźnieniem (fade-in z CSS)
  window.addEventListener("load", () => {
    setTimeout(() => {
      $container.classList.add("show"); // tylko animacja; rozwijanie robi hover/focus
      resetInactivityTimer();           // start licznika bezczynności
    }, 800);
  });

  function scrollToBottom() {
    requestAnimationFrame(() => {
      $messages.scrollTop = $messages.scrollHeight;
    });
  }

  function addMessage(text, role) {
    const div = document.createElement("div");
    div.className = `message ${role}`;
    div.textContent = text;
    $messages.appendChild(div);
    scrollToBottom();
  }

  function addTypingIndicator() {
    const tip = document.createElement("div");
    tip.className = "message bot typing-indicator";
    tip.textContent = "Bot is typing...";
    $messages.appendChild(tip);
    scrollToBottom();
  }

  function removeTypingIndicator() {
    const tip = $messages.querySelector(".typing-indicator");
    if (tip) tip.remove();
  }

  let busy = false;
  async function sendChat() {
    if (busy) return;
    const text = ($input.value || "").trim();
    if (!text) return;

    busy = true;
    addMessage(text, "user");
    openChat();                 // utrzymaj rozwinięty stan
    $input.value = "";
    $input.focus();
    addTypingIndicator();

    try {
      const res = await fetch(chatBackendUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text })
      });

      let reply = "No reply received.";
      if (res.ok) {
        const data = await res.json();
        reply = data.reply || reply;
      } else {
        try {
          const err = await res.json();
          reply = `Server error: ${err.error || res.statusText}`;
        } catch {
          reply = `Server error: ${res.status} ${res.statusText}`;
        }
      }
      removeTypingIndicator();
      addMessage(reply, "bot");
    } catch (e) {
      console.error("[chat] fetch error:", e);
      removeTypingIndicator();
      addMessage("⚠️ Network error. Please try again.", "bot");
    } finally {
      setTimeout(() => { busy = false; }, 700); // lekki debounce
      resetInactivityTimer();
    }
  }

// --- AUTO POWRÓT DO „PASKA” PO BEZCZYNNOŚCI ---
const INACTIVITY_SECS = 6;  // ustaw sobie docelowo
let inactivityTimer = null;

function openChat(){
  $container.classList.remove("bar");  // nie pasek
  $container.classList.add("open");    // pełne okno
}

function closeChat(){
  // zdejmij fokus, żeby :focus-within nie trzymało otwartego
  if (document.activeElement === $input) $input.blur();
  $container.classList.remove("open");
  $container.classList.add("bar");     // WYRAŹNIE: stan paska (welcome + input)
}

function resetInactivityTimer(){
  clearTimeout(inactivityTimer);
  inactivityTimer = setTimeout(() => {
    const hovering = $container.matches(":hover");
    const focusedInside = $container.contains(document.activeElement);
    if (!hovering && !focusedInside) closeChat();
  }, INACTIVITY_SECS * 1000);
}

// Aktywność w obrębie widżetu => otwieraj i restartuj timer
["mousemove","keydown","wheel","touchstart"].forEach(ev => {
  $container.addEventListener(ev, () => {
    openChat();
    resetInactivityTimer();
  }, { passive: true });
});

// Otwieraj na fokus/mouseenter (wystarczy raz)
[$input, $messages].forEach(el => {
  el.addEventListener("focus", () => { openChat(); resetInactivityTimer(); });
  el.addEventListener("mouseenter", () => { openChat(); resetInactivityTimer(); });
});

// Enter-to-send już masz niżej – dorzuć reset timera w else:
$input.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendChat();
  } else {
    resetInactivityTimer();
  }
});

// Start licznika gdy widget się pojawi (po .show)
window.addEventListener("load", () => {
  const obs = new MutationObserver(() => {
    if ($container.classList.contains("show")) {
      // Na starcie chcemy pasek, więc ustawiamy .bar
      $container.classList.add("bar");
      resetInactivityTimer();
      obs.disconnect();
    }
  });
  obs.observe($container, { attributes: true, attributeFilter: ["class"] });
});


  // Otwieraj na fokus/mouseenter (zachowanie jak dotąd)
  [$input, $messages].forEach(el => {
    el.addEventListener("focus", () => { openChat(); resetInactivityTimer(); });
    el.addEventListener("mouseenter", () => { openChat(); resetInactivityTimer(); });
  });

  // Enter-to-send
  $input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendChat();
    } else {
      resetInactivityTimer();
    }
  });

  $send.addEventListener("click", () => { sendChat(); });

  // Klik w tło chatu ustawia focus na input
  $container.addEventListener("click", (e) => {
    if (e.target === $container || e.target.classList.contains("chat-messages")) {
      $input.focus();
    }
  });
})();
