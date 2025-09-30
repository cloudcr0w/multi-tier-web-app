// === Chat, Form & UI Logic ===

// Elements
const chatMessages = document.getElementById("chat-messages");
const chatInput = document.getElementById("chat-input");
const chatSend = document.getElementById("chat-send");

// === Welcome Screen Handling ===
document.addEventListener("DOMContentLoaded", () => {
  const welcomeScreen = document.getElementById("welcome-screen");
  const mainContent = document.getElementById("main-content");
  const welcomeButton = document.getElementById("welcome-button");
  const chatContainer = document.getElementById("chat-container");

  // Switch from welcome screen to main content
  welcomeButton.addEventListener("click", () => {
    welcomeScreen.classList.add("hidden");

    setTimeout(() => {
      welcomeScreen.style.display = "none";
      mainContent.style.display = "block";
      chatContainer.style.display = "block"; 
      setTimeout(() => {
        chatContainer.classList.add("show"); 
      }, 500); 
      mainContent.classList.add("fade-in");
    }, 500);
  });
});

// === Set current year ===
document.getElementById("current-year").textContent = new Date().getFullYear();

// === Contact Form API endpoint ===
const formUrl = "https://14ma9cvufd.execute-api.us-east-1.amazonaws.com/contact";

// === Scroll-to-top button ===
const scrollTopBtn = document.getElementById("scroll-top-btn");

window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    scrollTopBtn.classList.add("show");
    scrollTopBtn.classList.remove("hide");
  } else {
    scrollTopBtn.classList.add("hide");
    scrollTopBtn.classList.remove("show");
  }
});

scrollTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
  scrollTopBtn.classList.add("hide");
  scrollTopBtn.classList.remove("show");
});

// === Contact Form Submission ===
async function sendMessage(event) {
  event.preventDefault(); // Prevent default form submit

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  if (!name || !email || !message) {
    showPopup("Please fill out all fields.", "error");
    return;
  }

  const loading = document.getElementById("loading");
  loading.textContent = "Sending...";
  loading.classList.remove("hidden");

  const formMessage = document.getElementById("form-message");
  formMessage.classList.add("hidden");

  try {
    const response = await fetch(formUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message })
    });

    if (response.ok) {
      showPopup("Message sent successfully!", "success");
      clearForm();
    } else {
      const errorData = await response.json();
      const errorMessage = errorData.error || "Failed to send message";
      showPopup(`Error: ${errorMessage}`, "error");
    }
  } catch (error) {
    console.error("Error sending message:", error);
    showPopup("A network error occurred. Please try again later.", "error");
  } finally {
    loading.classList.add("hidden");
    loading.textContent = "";
  }
}

// === Show popup messages (success/error) ===
function showPopup(message, type) {
  const popup = document.createElement("div");
  popup.className = `popup ${type}`;
  popup.textContent = message;
  document.body.appendChild(popup);

  setTimeout(() => {
    popup.classList.add("removing");
    setTimeout(() => {
      popup.remove();
    }, 500);
  }, 3000);
}

// === Clear form fields ===
function clearForm() {
  document.getElementById("name").value = "";
  document.getElementById("email").value = "";
  document.getElementById("message").value = "";
}

// Bind form submit
document.getElementById("contact-form").addEventListener("submit", sendMessage);

// === Expand/Collapse project details ===
document.querySelectorAll(".toggle-btn").forEach(button => {
  button.addEventListener("click", () => {
    const project = button.closest(".project");
    const details = project.querySelector(".project-details");
    const isExpanded = details.classList.contains("expanded");

    details.classList.toggle("expanded");
    button.textContent = isExpanded ? "Show More ⬇️" : "Show Less ⬆️";
  });
});

// === Page visit tracker ===
fetch("https://67h17n0zlb.execute-api.us-east-1.amazonaws.com/prod/track", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ page: "home" })
});

// === Chatbot logic (unchanged, already working) ===
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

  window.addEventListener("load", () => {
    setTimeout(() => {
      $container.classList.add("show");
      $container.classList.add("bar");
      resetInactivityTimer();
      scrollToBottom();
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
  let lastRequestTime = 0;
  const COOLDOWN_MS = 2000;

  async function sendChat() {
    if (busy) return;
    const text = ($input.value || "").trim();
    if (!text) return;

    const now = Date.now();
    if (now - lastRequestTime < COOLDOWN_MS) {
      addMessage("⚠️ Please wait a moment before asking again.", "bot");
      return;
    }
    lastRequestTime = now;

    if (text.length > 50) {
      addMessage("⚠️ Your question is too long (max 50 chars).", "bot");
      return;
    }

    busy = true;
    $send.disabled = true;
    addMessage(text, "user");
    openChat();
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
      setTimeout(() => { busy = false; }, 700);
      $send.disabled = false;
      resetInactivityTimer();
    }
  }

  const INACTIVITY_SECS = 6;
  let inactivityTimer = null;

  function openChat() {
    $container.classList.remove("bar");
    $container.classList.add("open");
  }

  function closeChat() {
    if (document.activeElement === $input) $input.blur();
    $container.classList.remove("open");
    $container.classList.add("bar");
  }

  function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
      const hovering = $container.matches(":hover");
      const focusedInside = $container.contains(document.activeElement);
      if (!hovering && !focusedInside) closeChat();
    }, INACTIVITY_SECS * 1000);
  }

  ["mousemove", "keydown", "wheel", "touchstart"].forEach(ev => {
    $container.addEventListener(ev, () => {
      openChat();
      resetInactivityTimer();
    }, { passive: true });
  });

  [$input, $messages].forEach(el => {
    el.addEventListener("focus", () => { openChat(); resetInactivityTimer(); });
    el.addEventListener("mouseenter", () => { openChat(); resetInactivityTimer(); });
  });

  $input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendChat();
    } else {
      resetInactivityTimer();
    }
  });

  $send.addEventListener("click", () => { sendChat(); });

  $container.addEventListener("click", (e) => {
    if (e.target === $container || e.target.classList.contains("chat-messages")) {
      $input.focus();
    }
  });
})();
