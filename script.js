// Navbar scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// Scroll reveal
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 60);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
reveals.forEach(el => observer.observe(el));

// Form handler
function handleSubmit() {
  const btn = document.querySelector('.btn-submit');
  btn.textContent = '✅ Enquiry Sent!';
  btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
  btn.style.color = 'white';
  setTimeout(() => {
    btn.textContent = 'Send Enquiry ✦';
    btn.style.background = '';
    btn.style.color = '';
  }, 3000);
}

// Chatbot
const CHATBOT_URL = "https://hidara-academy-chatbot.md-razithulhaq13.workers.dev";

function toggleChat() {
  const win = document.getElementById("chatWindow");
  win.classList.toggle("open");
}

function sendQuick(text) {
  document.getElementById("chatInput").value = text;
  setTimeout(() => sendMessage(), 300);
}

async function sendMessage() {
  const input = document.getElementById("chatInput");
  const messages = document.getElementById("chatMessages");
  const text = input.value.trim();
  if (!text) return;

  appendMessage(text, "user");
  input.value = "";

  const typing = document.createElement("div");
  typing.className = "typing-indicator";
  typing.id = "typing";
  typing.innerHTML = `
    <div class="typing-dot"></div>
    <div class="typing-dot"></div>
    <div class="typing-dot"></div>
  `;
  messages.appendChild(typing);
  messages.scrollTop = messages.scrollHeight;

  try {
    const response = await fetch(CHATBOT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: text })
    });

    const data = await response.json();
    const reply = data.reply || "Thank you! We will get back to you shortly.";

    document.getElementById("typing")?.remove();
    appendMessage(reply, "bot");

  } catch (error) {
    document.getElementById("typing")?.remove();
    appendMessage("Sorry, I am having trouble connecting. Please WhatsApp us directly! 📱", "bot");
  }
}

function appendMessage(text, sender) {
  const messages = document.getElementById("chatMessages");
  const div = document.createElement("div");
  div.className = `msg msg-${sender}`;
  div.innerHTML = text;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}
