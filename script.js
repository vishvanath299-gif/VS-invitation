// ── Scroll Reveal ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));



// ── Countdown ──
function tick() {
  const diff = new Date('2026-05-25T09:00:00') - new Date();
  if (diff <= 0) { ['cd-days', 'cd-hours', 'cd-mins', 'cd-secs', 'cd-ms'].forEach(id => { const el = document.getElementById(id); if (el) el.textContent = '00'; }); return; }
  const pad = n => String(Math.floor(n)).padStart(2, '0');
  const el = id => document.getElementById(id);
  if (el('cd-days')) el('cd-days').textContent = pad(diff / 86400000);
  if (el('cd-hours')) el('cd-hours').textContent = pad((diff % 86400000) / 3600000);
  if (el('cd-mins')) el('cd-mins').textContent = pad((diff % 3600000) / 60000);
  if (el('cd-secs')) el('cd-secs').textContent = pad((diff % 60000) / 1000);
  if (el('cd-ms')) el('cd-ms').textContent = pad((diff % 1000) / 10);
}
tick(); setInterval(tick, 50);

// ── Custom Cursor Logic ──
const cursor = document.getElementById('cursor');
document.addEventListener('mousemove', (e) => {
  if (cursor) {
    cursor.style.transform = `translate3d(${e.clientX - 12}px, ${e.clientY - 12}px, 0)`;
  }
});

document.addEventListener('mousedown', () => { if (cursor) cursor.style.transform += ' scale(0.8)'; });
document.addEventListener('mouseup', () => { if (cursor) cursor.style.transform += ' scale(1)'; });

// ── Parallax Hero ──
window.addEventListener('scroll', () => {
  const y = window.pageYOffset;
  const img = document.querySelector('.hero__img');
  if (img && y < window.innerHeight) img.style.transform = `scale(1.05) translateY(${y * 0.25}px)`;
});

// ── Luxury Footer Card Glow ──
document.querySelectorAll('.luxury-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--x', `${e.clientX - rect.left}px`);
    card.style.setProperty('--y', `${e.clientY - rect.top}px`);
  });
});

// ── Audio Player & Welcome Gate Logic ──
const audio = document.getElementById('wedding-audio');
const audioToggle = document.getElementById('audio-toggle');
const welcomeGate = document.getElementById('welcome-gate');
const welcomeBtn = document.getElementById('welcome-btn');

// Add lock class to body to prevent scrolling at first
document.body.classList.add('gate-locked');

function playAudio() {
  if (audio && audio.paused) {
    return audio.play().then(() => {
      if (audioToggle) audioToggle.classList.add('playing');
      return true;
    }).catch(err => {
      console.log("Audio play failed/blocked: ", err);
      return false;
    });
  }
  return Promise.resolve(true);
}

// Cinematic Entrance Sequence when user clicks Open Invitation
function triggerEntranceSequence() {
  const content = document.querySelector('.welcome-gate__content');
  const gate = document.getElementById('welcome-gate');

  if (!gate) return;

  // 1. Immediately play audio in muted state to bypass browser gesture policies
  if (audio) {
    audio.muted = true;
    audio.play().then(() => {
      if (audioToggle) audioToggle.classList.add('playing');
    }).catch(err => console.log("Initial audio gesture registration failed:", err));
  }

  // 2. Hide the modal/content card immediately (fade out & scale down)
  if (content) {
    content.classList.add('content-hidden');
  }

  // 3. Immediately display the pulsing red heart at the center of the viewport
  gate.classList.add('show-red-heart');

  // 4. After 1200ms (red heart entry and pulsing completed), slide the royal gate doors open!
  setTimeout(() => {
    gate.classList.add('gate-opened');
  }, 1200);

  // 5. After 2200ms (exactly as doors finish opening), play & fade in the music!
  setTimeout(() => {
    if (audio) {
      audio.muted = false;
      audio.currentTime = 0; // Play from the start of track
      audio.volume = 0;

      // Smoothly fade in volume over 1.2 seconds for a premium, luxury theatre effect!
      let vol = 0;
      const fadeInterval = setInterval(() => {
        if (vol < 1) {
          vol += 0.08;
          audio.volume = Math.min(vol, 1);
        } else {
          clearInterval(fadeInterval);
        }
      }, 100);
    }

    // 6. Remove the gate elements from DOM completely and unlock scroll
    setTimeout(() => {
      if (gate) gate.remove();
      document.body.classList.remove('gate-locked');
    }, 450);
  }, 2200);
}

// Immediate open fallback for load-time autoplay success
function openGateImmediate() {
  if (welcomeGate) {
    welcomeGate.classList.add('gate-opened');
    setTimeout(() => {
      welcomeGate.remove();
      document.body.classList.remove('gate-locked');
    }, 1000);
  } else {
    document.body.classList.remove('gate-locked');
  }
}

// 1. Attempt to play audio immediately on load (rare but supported)
window.addEventListener('DOMContentLoaded', () => {
  playAudio().then((success) => {
    if (success) {
      console.log("Autoplay succeeded on load!");
      openGateImmediate();
    } else {
      console.log("Autoplay blocked on load, waiting for gate click.");
    }
  });
});

// Fallback on window load
window.addEventListener('load', () => {
  if (audio && audio.paused) {
    playAudio().then((success) => {
      if (success) {
        openGateImmediate();
      }
    });
  }
});

// 2. Click listener for the Open Invitation button triggers the grand sequence!
if (welcomeBtn) {
  welcomeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    triggerEntranceSequence();
  });
}

// 3. Keep audio toggle button operational
if (audioToggle && audio) {
  audioToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    if (audio.paused) {
      audio.muted = false;
      audio.volume = 1;
      audio.play().then(() => {
        audioToggle.classList.add('playing');
      }).catch(err => console.log("Audio blocked: ", err));
    } else {
      audio.pause();
      audioToggle.classList.remove('playing');
    }
  });
}

// ── Fun Zone Logic ──
// Tab Switching
const funTabBtns = document.querySelectorAll('.fun-tab-btn');
const funTabContents = document.querySelectorAll('.fun-tab-content');

funTabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    funTabBtns.forEach(b => b.classList.remove('active'));
    funTabContents.forEach(c => c.classList.remove('active'));

    btn.classList.add('active');
    const tabId = `tab-${btn.dataset.tab}`;
    const targetContent = document.getElementById(tabId);
    if (targetContent) targetContent.classList.add('active');
  });
});

// Feast Planner Logic
const feastCbs = document.querySelectorAll('.feast-cb');
const leafPlates = document.getElementById('leaf-plates');
const feastBadge = document.getElementById('feast-badge');
const feastComment = document.getElementById('feast-comment');

const foodEmojis = {
  biryani: '🍛',
  elai: '🍚',
  sweet: '🍬',
  icecream: '🍨',
  appalam: '🍘'
};

const foodScores = {
  biryani: 3,
  elai: 3,
  sweet: 2,
  icecream: 2,
  appalam: 1
};

const foodComments = [
  { max: 0, badge: "Diet Raja / Rani 😇", comment: "ரொம்ப நல்லவங்கப்பா நீங்க! மாப்பிள்ளை பட்ஜெட்டை காப்பாத்த வந்த தெய்வம்!" },
  { max: 3, badge: "Normal Citizen 👍", comment: "பக்குவமான ஆளுங்க நீங்க, அளவா சாப்பிட்டு நைஸா கிளம்பிருவீங்க!" },
  { max: 6, badge: "Sappatu Raman / Ramani 🦁", comment: "கல்யாண சாப்பாடு தான் முக்கியம்! பந்திக்கு முந்திக்கோங்க பிரண்ட்ஸ்!" },
  { max: 11, badge: "Mandaba Don! 💸", comment: "அன்பாக்ஸிங் சப்பை! பந்தியை ஒரு கை பாக்காம போக மாட்டீங்க போலயே! இலை ரெடியா இருக்கு!" }
];

function updateFeast() {
  if (!leafPlates || !feastBadge || !feastComment) return;

  let score = 0;
  // Clear visual food
  leafPlates.innerHTML = '';

  feastCbs.forEach(cb => {
    if (cb.checked) {
      score += foodScores[cb.value];

      // Create visual food element on Banana leaf
      const foodDiv = document.createElement('div');
      foodDiv.className = `virtual-food food-${cb.value}`;
      foodDiv.textContent = foodEmojis[cb.value];
      leafPlates.appendChild(foodDiv);
    }
  });

  // Find correct comment
  let matched = foodComments[0];
  for (const item of foodComments) {
    if (score >= item.max) {
      matched = item;
    }
  }

  feastBadge.textContent = matched.badge;
  feastComment.textContent = matched.comment;
}

feastCbs.forEach(cb => cb.addEventListener('change', updateFeast));
updateFeast(); // Initial load

// Boss Poll Logic
const pollOptionsContainers = document.querySelectorAll('.poll-options');

// Simulated base votes
const baseVotes = {
  remote: { deva: 12, devika: 85 },
  duty: { deva: 78, both: 22 }
};

const funnyResponses = {
  remote: {
    deva: "Haha! தேவா கனவு வேணா காணலாம், ஆனா ரிமோட் தேவிகாகிட்ட தான் இருக்கும்! 📺😂",
    devika: "100% உண்மை! ரிமோட் தேவிகா கையை விட்டு போகாது! 👑💅"
  },
  duty: {
    deva: "ஆகா! தேவா பாத்திரம் தேய்க்கும் காட்சிகள் விரைவில்... வாழ்த்துக்கள்! 🧼😎",
    both: "சமத்துவமான ஜோடி! இருவரும் இணைந்தே வீட்டு வேலைகளை சமாளிப்பார்கள்! 🤝❤️"
  }
};

pollOptionsContainers.forEach(container => {
  const qType = container.dataset.question;
  const btns = container.querySelectorAll('.poll-btn');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const choice = btn.dataset.choice;

      // Mark all as voted
      btns.forEach(b => {
        b.classList.add('voted');
        if (b.dataset.choice === choice) {
          b.classList.add('selected');
        }
      });

      // Calculate percentages
      const votes = baseVotes[qType];
      let devTotal = votes.deva;
      let otherTotal = votes[Object.keys(votes).find(k => k !== 'deva')];

      if (choice === 'deva') {
        devTotal += 1;
      } else {
        otherTotal += 1;
      }

      const total = devTotal + otherTotal;
      const pctDeva = Math.round((devTotal / total) * 100);
      const pctOther = 100 - pctDeva;

      btns.forEach(b => {
        const c = b.dataset.choice;
        const bar = b.querySelector('.poll-bar');
        const pctText = b.querySelector('.poll-pct');

        const finalPct = c === 'deva' ? pctDeva : pctOther;
        if (bar) bar.style.width = `${finalPct}%`;
        if (pctText) pctText.textContent = `${finalPct}%`;
      });

      // Show funny response
      const responseEl = document.getElementById(`poll-${qType}-response`);
      if (responseEl) {
        responseEl.textContent = funnyResponses[qType][choice];
      }
    });
  });
});

// Saree Color Guesser Logic
const sareeBtns = document.querySelectorAll('.saree-btn');
const sareeResponse = document.getElementById('saree-response');

const sareeComments = {
  maroon: "classic பாரம்பரிய தேர்வு! மாப்பிள்ளை தேவா சில்க் வேட்டில கெத்தா நிப்பாரு, தேவிகா மகாராணி மாதிரி இருப்பாங்க! 👑✨",
  pink: "ராணி பிங்க்! அட்டகாசமான கலர்! தேவிகா ஜொலிப்பாங்க, தேவா சட்டை பாக்கெட்ல இதே மேட்சிங் ரோஸ் இருக்கும்! 🌹💖",
  green: "மங்களகரமான பட்டு பச்சை! இயற்கையோடு இணைந்த அழகு, தேவா தேவிகாவை பார்த்து கண் இமைக்க மறந்துடுவாரு! 💚👀",
  yellow: "மஞ்சள் வர்ணம்! மங்கள வாழ்த்துக்கள்! மங்களகரமான முகூர்த்தத்திற்கு பக்காவான சாய்ஸ்! 💛🙏"
};

sareeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    sareeBtns.forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    const color = btn.dataset.color;
    if (sareeResponse) {
      sareeResponse.textContent = `உங்க கெஸ்ஸிங்: Devika in ${sareeComments[color]}`;
    }
  });
});

// Gift Advisor Logic
const giftSelector = document.getElementById('gift-selector');
const giftAdviseBtn = document.getElementById('gift-advise-btn');
const giftTicketWrap = document.getElementById('gift-ticket-wrap');
const ticketPassType = document.getElementById('ticket-pass-type');
const ticketJoke = document.getElementById('ticket-joke');
const ticketRowVal = document.getElementById('ticket-row-val');

const giftJokes = {
  gold: {
    pass: "GOLDEN ULTRA VIP",
    joke: "அடேங்கப்பா! 5 பவுன் தங்க நகையா?! நீங்கதாங்க மாப்பிள்ளை வீட்டோட செல்ல பிள்ளை! பந்தில முதல் இலை, எக்ஸ்ட்ரா பாயாசம், அப்பளம் ஸ்பெஷலா உங்களுக்கு ரெடியா இருக்கு! 🏆🥇",
    row: "Row A - Center (Stage VIP Sofa)"
  },
  mixer: {
    pass: "KITCHEN SPECIALIST",
    joke: "மிக்ஸி/கிரைண்டரா! ரொம்ப பாரம்பரியமான இந்திய குடும்ப பரிசு! மாப்பிள்ளை அம்மா ரொம்ப ஹேப்பி, ஆனா வீட்ல ஏற்கனவே மூணு மிக்ஸி இருக்குறது யாருக்கும் தெரியாது! 🔌🥣",
    row: "Row C - Near Buffet Entry"
  },
  moy: {
    pass: "TRADITIONAL SUPPORTER",
    joke: "மொய் கவர்! எப்போதுமே கிளாசிக்! சாஸ்திரிகள் மைக்ல உங்க பேரை சத்தமா வாசிப்பாரு! பெருமைக்குரிய தருணம்! பந்தில அப்பளம் எக்ஸ்ட்ரா கேளுங்க, தருவாங்க! ✉️✍️",
    row: "Row B - Middle Section"
  },
  blessing: {
    pass: "SOULFUL BLESSER",
    joke: "அன்பான ஆசீர்வாதம்! உலகத்துலயே மிக உயர்ந்த பரிசு இதுதான்! நாங்க ரொம்ப கடமைப்பட்டு இருக்கோம்... ஆனா சாப்பாட்டு பந்தில லட்டு எக்ஸ்ட்ரா சாப்பிட்டு நைஸா கிளம்பிடனும், ஓகேவா? 😉😂",
    row: "Row D - General Seating"
  }
};

if (giftAdviseBtn && giftSelector) {
  giftAdviseBtn.addEventListener('click', () => {
    const val = giftSelector.value;
    if (!val) {
      alert("தயவுசெய்து ஒரு கிப்ட்டை தேர்ந்தெடுங்கள்!");
      return;
    }

    const jokeData = giftJokes[val];
    if (jokeData && giftTicketWrap) {
      ticketPassType.textContent = jokeData.pass;
      ticketJoke.textContent = jokeData.joke;
      ticketRowVal.textContent = jokeData.row;
      giftTicketWrap.style.display = 'flex';
    }
  });
}

