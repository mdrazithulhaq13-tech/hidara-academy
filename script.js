/* =====================================================
   HIDARA ACADEMY — script.js
   ===================================================== */

/* ─── 1. DARK MODE ───
   Default = Light (no class on body)
   Dark = body gets class "dark-mode"
   Saved in localStorage
──────────────────────── */
const body = document.body;

function applyDarkMode(isDark) {
  body.classList.toggle('dark-mode', isDark);

  // Desktop toggle icon
  const desktopIcon = document.querySelector('#darkToggle i');
  if (desktopIcon) {
    desktopIcon.className = isDark ? 'bi bi-sun-fill' : 'bi bi-moon-stars-fill';
  }

  // Mobile toggle icon + text
  const mobIcon = document.getElementById('mobDarkIcon');
  const mobText = document.getElementById('mobDarkText');
  if (mobIcon) mobIcon.className = isDark ? 'bi bi-sun-fill me-2' : 'bi bi-moon-stars-fill me-2';
  if (mobText) mobText.textContent = isDark ? 'Disable Dark Mode' : 'Enable Dark Mode';
}

// Load saved preference — default is LIGHT (false)
const savedDark = localStorage.getItem('hidaraDark') === 'true';
applyDarkMode(savedDark);

// Desktop toggle click
const darkToggleBtn = document.getElementById('darkToggle');
if (darkToggleBtn) {
  darkToggleBtn.addEventListener('click', () => {
    const nowDark = !body.classList.contains('dark-mode');
    applyDarkMode(nowDark);
    localStorage.setItem('hidaraDark', nowDark);
  });
}

// Mobile toggle click
const mobDarkBtn = document.getElementById('mobDarkToggle');
if (mobDarkBtn) {
  mobDarkBtn.addEventListener('click', () => {
    const nowDark = !body.classList.contains('dark-mode');
    applyDarkMode(nowDark);
    localStorage.setItem('hidaraDark', nowDark);
  });
}


/* ─── 2. NAVBAR SCROLL EFFECT ─── */
const navbar = document.getElementById('navbar');
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const curr = window.scrollY;
  if (navbar) {
    navbar.classList.toggle('scrolled', curr > 60);
    // Hide on scroll down, show on scroll up
    if (curr > lastScroll && curr > 200) {
      navbar.style.transform = 'translateY(-100%)';
    } else {
      navbar.style.transform = 'translateY(0)';
    }
    navbar.style.transition = 'transform 0.3s ease, box-shadow 0.3s';
  }
  lastScroll = curr;
}, { passive: true });


/* ─── 3. NAV PILL SLIDER ─── */
const pillBg = document.getElementById('pillBg');
const plinks = document.querySelectorAll('.plink');

function slidePill(el) {
  if (!pillBg || !el) return;
  pillBg.style.opacity = '1';
  pillBg.style.left = el.offsetLeft + 'px';
  pillBg.style.width = el.offsetWidth + 'px';
  pillBg.style.height = el.offsetHeight + 'px';
}

plinks.forEach(link => {
  link.addEventListener('mouseenter', () => slidePill(link));
  link.addEventListener('click', () => {
    plinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
    slidePill(link);
  });
});

const pillNav = document.querySelector('.pill-nav');
if (pillNav) {
  pillNav.addEventListener('mouseleave', () => {
    const active = document.querySelector('.plink.active');
    if (active) slidePill(active);
    else if (pillBg) pillBg.style.opacity = '0';
  });
}

// Highlight nav link based on scroll position
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY + 120;
  document.querySelectorAll('section[id]').forEach(sec => {
    if (scrollY >= sec.offsetTop && scrollY < sec.offsetTop + sec.offsetHeight) {
      plinks.forEach(l => {
        const match = l.getAttribute('href') === '#' + sec.id;
        l.classList.toggle('active', match);
        if (match) slidePill(l);
      });
    }
  });
}, { passive: true });


/* ─── 4. SCROLL REVEAL ─── */
const reveals = document.querySelectorAll('.reveal');
const revObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
reveals.forEach(el => revObs.observe(el));


/* ─── 5. HERO PARTICLE CANVAS ─── */
const canvas = document.getElementById('heroCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function sizeCanvas() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  class Dot {
    constructor() { this.init(); }
    init() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.35;
      this.vy = (Math.random() - 0.5) * 0.35;
      this.r  = Math.random() * 1.8 + 0.5;
      this.op = Math.random() * 0.45 + 0.1;
      this.col = Math.random() > 0.5 ? '240,165,0' : '59,130,246';
    }
    move() {
      this.x += this.vx; this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.init();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.col},${this.op})`;
      ctx.fill();
    }
  }

  function buildParticles() {
    particles = [];
    const n = Math.min(70, Math.floor((W * H) / 14000));
    for (let i = 0; i < n; i++) particles.push(new Dot());
  }

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx*dx + dy*dy);
        if (d < 90) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(240,165,0,${0.07*(1 - d/90)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.move(); p.draw(); });
    drawLines();
    requestAnimationFrame(loop);
  }

  new ResizeObserver(() => { sizeCanvas(); buildParticles(); }).observe(canvas.parentElement);
  sizeCanvas(); buildParticles(); loop();
}


/* ─── 6. COUNTER ANIMATION ─── */
function runCounters() {
  document.querySelectorAll('.hs-n[data-target]').forEach(el => {
    const target = +el.dataset.target;
    let current  = 0;
    const step   = target / (1600 / 16);
    const t = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(t); }
      el.textContent = Math.floor(current);
    }, 16);
  });
}
const heroSec = document.getElementById('home');
if (heroSec) {
  new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) { setTimeout(runCounters, 700); }
  }, { threshold: 0.3 }).observe(heroSec);
}


/* ─── 7. CARD STAGGER ON SECTION ENTRY ─── */
document.querySelectorAll('section').forEach(sec => {
  const cards = sec.querySelectorAll('.course-card, .why-card, .testi-card, .fee-card, .timing-card');
  cards.forEach(c => { c.style.opacity = '0'; c.style.transform = 'translateY(20px)'; c.style.transition = 'opacity 0.5s ease, transform 0.5s ease'; });
  new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      cards.forEach((c, i) => setTimeout(() => { c.style.opacity = '1'; c.style.transform = 'translateY(0)'; }, i * 80));
    }
  }, { threshold: 0.1 }).observe(sec);
});


/* ─── 8. FORM SUBMIT ─── */
function handleSubmit(btn) {
  const orig = btn.innerHTML;
  btn.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Sending...';
  btn.disabled = true;
  setTimeout(() => {
    btn.innerHTML = '✅ Enquiry Sent!';
    btn.style.background = 'linear-gradient(135deg,#10b981,#059669)';
    btn.style.color = '#fff';
    setTimeout(() => {
      btn.innerHTML = orig;
      btn.disabled = false;
      btn.style.background = '';
      btn.style.color = '';
    }, 3000);
  }, 1500);
}


/* ─── 9. FOOTER YEAR ─── */
const fyear = document.getElementById('fyear');
if (fyear) fyear.textContent = new Date().getFullYear();


/* ─── 10. PAGE FADE IN ─── */
document.body.style.opacity = '0';
window.addEventListener('load', () => {
  document.body.style.transition = 'opacity 0.4s ease';
  document.body.style.opacity = '1';
});


/* =====================================================
   CHATBOT — HIRA AI
   Change CHATBOT_URL to update the backend
   AI model + system prompt → Cloudflare Worker code
   Chatbot colors → styles.css (chatbot section)
   ===================================================== */
const CHATBOT_URL = "https://hidara-academy-chatbot.md-razithulhaq13.workers.dev";

const chatWin   = document.getElementById('chatWindow');
const chatMsgs  = document.getElementById('chatMsgs');
const chatInp   = document.getElementById('chatInput');
const chatDot   = document.getElementById('chatDot');
const chatQuick = document.getElementById('chatQuick');

function toggleChat() {
  if (!chatWin) return;
  const open = chatWin.classList.toggle('open');
  if (open && chatDot) chatDot.classList.add('hidden');
  if (open && chatMsgs) setTimeout(() => chatMsgs.scrollTop = chatMsgs.scrollHeight, 100);
}

function sendQuick(text) {
  if (chatInp) { chatInp.value = text; setTimeout(sendMessage, 280); }
}

function clearChat() {
  if (!chatMsgs) return;
  chatMsgs.innerHTML = '<div class="cmsg bot-cmsg">👋 Hi! I\'m <strong>Hira AI</strong> — your Hidara Academy assistant. How can I help you today?</div>';
  if (chatQuick) chatQuick.style.display = 'flex';
}

async function sendMessage() {
  if (!chatInp || !chatMsgs) return;
  const text = chatInp.value.trim();
  if (!text) return;

  addMsg(text, 'user');
  chatInp.value = '';
  

  // Typing indicator
  const typingEl = document.createElement('div');
  typingEl.className = 'typing-dots'; typingEl.id = 'hiraTyping';
  typingEl.innerHTML = '<div class="tdot"></div><div class="tdot"></div><div class="tdot"></div>';
  chatMsgs.appendChild(typingEl);
  chatMsgs.scrollTop = chatMsgs.scrollHeight;

  try {
    const res  = await fetch(CHATBOT_URL, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({message: text}) });
    const data = await res.json();
    document.getElementById('hiraTyping')?.remove();
    addMsg(data.reply || 'Thank you! We will get back to you shortly.', 'bot');
  } catch {
    document.getElementById('hiraTyping')?.remove();
    addMsg('Sorry, trouble connecting. Please WhatsApp us directly! 📱', 'bot');
  }
}

function addMsg(text, sender) {
  if (!chatMsgs) return;
  const d = document.createElement('div');
  d.className = 'cmsg ' + (sender === 'bot' ? 'bot-cmsg' : 'user-cmsg');
  d.innerHTML = text;
  chatMsgs.appendChild(d);
  chatMsgs.scrollTop = chatMsgs.scrollHeight;
}
/* ══════════ END CHATBOT ══════════ */
