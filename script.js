/* =====================================================
   HIDARA ACADEMY — script.js
   Professional Animations + Full Functionality
   ===================================================== */

/* ─── 1. DARK MODE ─── */
const body = document.body;

function applyDarkMode(isDark) {
  body.classList.toggle('dark-mode', isDark);
  const desktopIcon = document.querySelector('#darkToggle i');
  if (desktopIcon) desktopIcon.className = isDark ? 'bi bi-sun-fill' : 'bi bi-moon-stars-fill';
  const mobIcon = document.getElementById('mobDarkIcon');
  const mobText = document.getElementById('mobDarkText');
  if (mobIcon) mobIcon.className = isDark ? 'bi bi-sun-fill me-2' : 'bi bi-moon-stars-fill me-2';
  if (mobText) mobText.textContent = isDark ? 'Disable Dark Mode' : 'Enable Dark Mode';
}

const savedDark = localStorage.getItem('hidaraDark') === 'true';
applyDarkMode(savedDark);

const darkToggleBtn = document.getElementById('darkToggle');
if (darkToggleBtn) {
  darkToggleBtn.addEventListener('click', () => {
    const nowDark = !body.classList.contains('dark-mode');
    applyDarkMode(nowDark);
    localStorage.setItem('hidaraDark', nowDark);
  });
}

const mobDarkBtn = document.getElementById('mobDarkToggle');
if (mobDarkBtn) {
  mobDarkBtn.addEventListener('click', () => {
    const nowDark = !body.classList.contains('dark-mode');
    applyDarkMode(nowDark);
    localStorage.setItem('hidaraDark', nowDark);
  });
}


/* ─── 2. NAVBAR SCROLL ─── */
const navbar = document.getElementById('navbar');
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const curr = window.scrollY;
  if (navbar) {
    navbar.classList.toggle('scrolled', curr > 60);
    navbar.style.transform = (curr > lastScroll && curr > 200) ? 'translateY(-100%)' : 'translateY(0)';
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
      ctx.fillStyle = 'rgba(' + this.col + ',' + this.op + ')';
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
          ctx.strokeStyle = 'rgba(240,165,0,' + (0.07*(1 - d/90)) + ')';
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


/* ─── 7. CARD STAGGER ANIMATION ─── */
document.querySelectorAll('section').forEach(sec => {
  const cards = sec.querySelectorAll('.course-card, .why-card, .testi-card, .fee-card, .timing-card');
  cards.forEach(c => {
    c.style.opacity = '0';
    c.style.transform = 'translateY(24px)';
    c.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
  });
  new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      cards.forEach((c, i) => setTimeout(() => {
        c.style.opacity = '1';
        c.style.transform = 'translateY(0)';
      }, i * 90));
    }
  }, { threshold: 0.08 }).observe(sec);
});


/* ─── 8. HERO TEXT TYPEWRITER ─── */
window.addEventListener('load', () => {
  const tagline = document.querySelector('.hero-tagline');
  if (!tagline) return;
  const text = tagline.textContent;
  tagline.textContent = '';
  tagline.style.opacity = '1';
  let i = 0;
  const type = setInterval(() => {
    tagline.textContent += text[i];
    i++;
    if (i >= text.length) clearInterval(type);
  }, 22);
});


/* ─── 9. HERO ENTRANCE STAGGER ─── */
window.addEventListener('load', () => {
  const badge = document.querySelector('.hero-badge');
  const title = document.querySelector('.hero-title');
  const btns  = document.querySelector('.hero-left .d-flex');
  const stats = document.querySelector('.hero-stats');
  const card  = document.querySelector('.hero-card-wrap');

  [badge, title, btns, stats, card].filter(Boolean).forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.7s ease ' + (i * 0.15) + 's, transform 0.7s ease ' + (i * 0.15) + 's';
  });

  setTimeout(() => {
    [badge, title, btns, stats, card].filter(Boolean).forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
  }, 300);
});


/* ─── 10. FEE PRICE TICKER ─── */
function animateFeePrice() {
  document.querySelectorAll('.fee-price').forEach(el => {
    if (el.dataset.animated) return;
    el.dataset.animated = '1';
    const sup = el.querySelector('sup');
    if (!sup) return;
    let start = 0;
    const target = 3000;
    const t = setInterval(() => {
      start += 80;
      if (start >= target) { start = target; clearInterval(t); }
      el.innerHTML = '<sup>₹</sup>' + start.toLocaleString();
    }, 16);
  });
}
const feesSec = document.getElementById('fees');
if (feesSec) {
  new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) animateFeePrice();
  }, { threshold: 0.3 }).observe(feesSec);
}


/* ─── 11. MAGNETIC BUTTON EFFECT ─── */
document.querySelectorAll('.btn-orange, .nav-register').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = 'translate(' + (x * 0.12) + 'px, ' + (y * 0.12) + 'px) translateY(-2px)';
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
    btn.style.transition = 'transform 0.4s ease';
  });
});


/* ─── 12. CURSOR GLOW (desktop only) ─── */
if (window.innerWidth > 768) {
  const glow = document.createElement('div');
  glow.style.cssText = 'position:fixed;pointer-events:none;z-index:9990;width:280px;height:280px;border-radius:50%;background:radial-gradient(circle, rgba(240,165,0,0.055) 0%, transparent 70%);transform:translate(-50%,-50%);transition:left 0.15s ease,top 0.15s ease;left:-300px;top:-300px;';
  document.body.appendChild(glow);
  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  });
}


/* ─── 13. SECTION TITLE GRADIENT REVEAL ─── */
const secTitles = document.querySelectorAll('.sec-title');
const titleObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('title-revealed');
      titleObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
secTitles.forEach(t => titleObs.observe(t));

const styleEl = document.createElement('style');
styleEl.textContent = `
  @keyframes rippleAnim { to { transform: scale(2.5); opacity: 0; } }
  .sec-title.title-revealed .c-orange {
    background: linear-gradient(135deg, #f0a500, #ff6b00);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;
document.head.appendChild(styleEl);


/* ─── 14. MISSION CARD SLIDE IN ─── */
document.querySelectorAll('.mission-half').forEach((card, i) => {
  card.style.opacity = '0';
  card.style.transform = i % 2 === 0 ? 'translateX(-20px)' : 'translateX(20px)';
  card.style.transition = 'opacity 0.6s ease ' + (i * 0.15) + 's, transform 0.6s ease ' + (i * 0.15) + 's';
  new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      card.style.opacity = '1';
      card.style.transform = 'translateX(0)';
    }
  }, { threshold: 0.2 }).observe(card);
});


/* ─── 15. TIMING CARD FLIP ENTRANCE ─── */
document.querySelectorAll('.timing-card').forEach((card, i) => {
  card.style.opacity = '0';
  card.style.transform = 'rotateY(15deg) translateY(20px)';
  card.style.transition = 'opacity 0.6s ease ' + (i * 0.12) + 's, transform 0.6s ease ' + (i * 0.12) + 's';
  new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      card.style.opacity = '1';
      card.style.transform = 'rotateY(0) translateY(0)';
    }
  }, { threshold: 0.2 }).observe(card);
});


/* ─── 16. WHY CARD RIPPLE ON CLICK ─── */
document.querySelectorAll('.why-card').forEach(card => {
  card.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    const rect = card.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.cssText = 'position:absolute;border-radius:50%;width:' + size + 'px;height:' + size + 'px;left:' + (e.clientX - rect.left - size/2) + 'px;top:' + (e.clientY - rect.top - size/2) + 'px;background:rgba(240,165,0,0.15);transform:scale(0);animation:rippleAnim 0.6s ease-out;pointer-events:none;';
    card.style.overflow = 'hidden';
    card.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});


/* ─── 17. STATS STRIP COUNT UP ─── */
function animateStats() {
  document.querySelectorAll('.ss-n').forEach(el => {
    if (el.dataset.done) return;
    el.dataset.done = '1';
    const num = parseInt(el.textContent);
    if (!num) return;
    let current = 0;
    const t = setInterval(() => {
      current += num / 50;
      if (current >= num) { current = num; clearInterval(t); }
      el.textContent = Math.floor(current);
    }, 20);
  });
}
const timingsSec = document.getElementById('timings');
if (timingsSec) {
  new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) animateStats();
  }, { threshold: 0.3 }).observe(timingsSec);
}


/* ─── 18. CONTACT INFO SLIDE IN ─── */
document.querySelectorAll('.cinfo').forEach((item, i) => {
  item.style.opacity = '0';
  item.style.transform = 'translateX(-24px)';
  item.style.transition = 'opacity 0.5s ease ' + (i * 0.1) + 's, transform 0.5s ease ' + (i * 0.1) + 's';
  new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      item.style.opacity = '1';
      item.style.transform = 'translateX(0)';
    }
  }, { threshold: 0.2 }).observe(item);
});


/* ─── 19. SOCIAL ICON BOUNCE ─── */
document.querySelectorAll('.fsoc, .soc-icon').forEach(icon => {
  icon.addEventListener('mouseenter', () => {
    icon.animate([
      { transform: 'translateY(0) scale(1)' },
      { transform: 'translateY(-6px) scale(1.15)' },
      { transform: 'translateY(-2px) scale(1.08)' }
    ], { duration: 350, easing: 'ease-out', fill: 'forwards' });
  });
  icon.addEventListener('mouseleave', () => {
    icon.animate([
      { transform: 'translateY(-2px) scale(1.08)' },
      { transform: 'translateY(0) scale(1)' }
    ], { duration: 250, easing: 'ease-out', fill: 'forwards' });
  });
});


/* ─── 20. TESTIMONIAL STAR REVEAL ─── */
document.querySelectorAll('.testi-card').forEach(card => {
  const stars = card.querySelector('.tc-stars');
  if (!stars) return;
  new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      const text = '★★★★★';
      stars.textContent = '';
      let i = 0;
      const t = setInterval(() => {
        stars.textContent += text[i];
        i++;
        if (i >= text.length) clearInterval(t);
      }, 100);
    }
  }, { threshold: 0.5 }).observe(card);
});


/* ─── 21. LEARN IMPROVE SUCCEED ENTRANCE ─── */
const lisItems = document.querySelectorAll('.lis-item, .lis-dot');
if (lisItems.length) {
  lisItems.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(12px)';
    el.style.transition = 'opacity 0.5s ease ' + (0.8 + i * 0.1) + 's, transform 0.5s ease ' + (0.8 + i * 0.1) + 's';
  });
  window.addEventListener('load', () => {
    setTimeout(() => {
      lisItems.forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
    }, 500);
  });
}


/* ─── 22. FORM LABEL ORANGE ON FOCUS ─── */
document.querySelectorAll('.finput').forEach(input => {
  const label = input.closest('.col-12, .col-md-6') && input.closest('.col-12, .col-md-6').querySelector('.flabel');
  if (!label) return;
  input.addEventListener('focus', () => { label.style.color = '#f0a500'; label.style.transition = 'color 0.2s'; });
  input.addEventListener('blur',  () => { label.style.color = ''; });
});


/* ─── 23. ABOUT CARD DYNAMIC GLOW ─── */
const aboutCard = document.querySelector('.about-dark-card');
if (aboutCard) {
  aboutCard.addEventListener('mousemove', (e) => {
    const rect = aboutCard.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    aboutCard.style.background = 'radial-gradient(circle at ' + x + '% ' + y + '%, #1a3a6e, #0d1b3e)';
  });
  aboutCard.addEventListener('mouseleave', () => { aboutCard.style.background = ''; });
}


/* ─── 24. HERO PILL STAGGER ─── */
document.querySelectorAll('.hpill').forEach((pill, i) => {
  pill.style.opacity = '0';
  pill.style.transform = 'scale(0.85)';
  pill.style.transition = 'opacity 0.4s ease ' + (0.5 + i * 0.07) + 's, transform 0.4s ease ' + (0.5 + i * 0.07) + 's';
  setTimeout(() => {
    pill.style.opacity = '1';
    pill.style.transform = 'scale(1)';
  }, 800 + i * 70);
});


/* ─── 25. SCROLL PROGRESS BAR ─── */
const progressBar = document.createElement('div');
progressBar.style.cssText = 'position:fixed;top:0;left:0;height:3px;z-index:9999;background:linear-gradient(90deg,#f0a500,#1a56db);width:0%;transition:width 0.1s ease;pointer-events:none;';
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = ((scrollTop / docHeight) * 100) + '%';
}, { passive: true });


/* ─── 26. FOOTER YEAR ─── */
const fyear = document.getElementById('fyear');
if (fyear) fyear.textContent = new Date().getFullYear();


/* ─── 27. PAGE FADE IN ─── */
document.body.style.opacity = '0';
window.addEventListener('load', () => {
  document.body.style.transition = 'opacity 0.5s ease';
  document.body.style.opacity = '1';
});


/* =====================================================
   CHATBOT — HIRA AI
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
  if (open && chatQuick) chatQuick.style.display = 'flex';
  if (open && chatMsgs) setTimeout(() => chatMsgs.scrollTop = chatMsgs.scrollHeight, 100);
}

function sendQuick(text) {
  if (chatInp) { chatInp.value = text; setTimeout(sendMessage, 280); }
}

function clearChat() {
  if (!chatMsgs) return;
  chatMsgs.innerHTML = '<div class="cmsg bot-cmsg">Hi! I am <strong>Hira AI</strong> your Hidara Academy assistant. How can I help you today?</div>';
  if (chatQuick) chatQuick.style.display = 'flex';
}

async function sendMessage() {
  if (!chatInp || !chatMsgs) return;
  const text = chatInp.value.trim();
  if (!text) return;

  addMsg(text, 'user');
  chatInp.value = '';

  const typingEl = document.createElement('div');
  typingEl.className = 'typing-dots';
  typingEl.id = 'hiraTyping';
  typingEl.innerHTML = '<div class="tdot"></div><div class="tdot"></div><div class="tdot"></div>';
  chatMsgs.appendChild(typingEl);
  chatMsgs.scrollTop = chatMsgs.scrollHeight;

  try {
    const res  = await fetch(CHATBOT_URL, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({message: text}) });
    const data = await res.json();
    document.getElementById('hiraTyping') && document.getElementById('hiraTyping').remove();
    addMsg(data.reply || 'Thank you! We will get back to you shortly.', 'bot');
  } catch(e) {
    document.getElementById('hiraTyping') && document.getElementById('hiraTyping').remove();
    addMsg('Sorry, trouble connecting. Please WhatsApp us directly!', 'bot');
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


/* ─── NETLIFY FORM ─── */
const enquiryForm = document.getElementById('enquiryForm');
const formSuccess = document.getElementById('formSuccess');

if (enquiryForm) {
  enquiryForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    btn.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Sending...';
    btn.disabled = true;
    const formData = new FormData(enquiryForm);
    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString()
      });
      if (response.ok) {
        enquiryForm.style.display = 'none';
        if (formSuccess) formSuccess.style.display = 'block';
      } else {
        btn.innerHTML = 'Failed. Try Again.';
        btn.disabled = false;
      }
    } catch (err) {
      btn.innerHTML = 'Error. Try Again.';
      btn.disabled = false;
    }
  });
}

function resetForm() {
  if (enquiryForm) { enquiryForm.reset(); enquiryForm.style.display = 'block'; }
  if (formSuccess) formSuccess.style.display = 'none';
  const btn = document.getElementById('submitBtn');
  if (btn) {
    btn.innerHTML = 'Send Enquiry <i class="bi bi-send-fill ms-2"></i>';
    btn.disabled = false;
    btn.style.background = '';
  }
}


/* ─── HIDARA ACADEMY HOVER TEXT ─── */
const haText = document.getElementById('haText');
if (haText) {
  const hidara  = "HIDARA".split('');
  const academy = "ACADEMY".split('');
  haText.innerHTML =
    hidara.map(char => '<span class="ha-char ha-orange">' + char + '</span>').join('') +
    '<span class="ha-space"> </span>' +
    academy.map(char => '<span class="ha-char ha-white">' + char + '</span>').join('');
}
