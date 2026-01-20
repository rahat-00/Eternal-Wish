document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    const userData = JSON.parse(localStorage.getItem('user_gift_data'));

    // --- 1. GLOBAL VISUALS (Particles & Magnetic Buttons) ---
    initGlobalEffects();

    // --- 2. FORM PAGE LOGIC ---
    const celebrationForm = document.getElementById('celebrationForm');
    if (celebrationForm) {
        celebrationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const data = {
                name: document.getElementById('fullName').value,
                dob: document.getElementById('dob').value,
                sender: document.getElementById('senderName').value,
                rel: document.getElementById('relationship').value
            };
            // Save to browser memory
            localStorage.setItem('user_gift_data', JSON.stringify(data));
            
            // Visual feedback on the button
            const btn = document.getElementById('unlockBtn');
            btn.innerHTML = "<span>Verifying Connection...</span><div class='liquid-bg' style='top:0'></div>";
            
            setTimeout(() => {
                window.location.href = 'result.html';
            }, 1000);
        });
    }

    // --- 3. RESULT PAGE LOGIC (The Switcher) ---
    if (path.includes('result.html')) {
        if (!userData) {
            window.location.href = 'index.html';
            return;
        }

        const today = new Date();
        const bday = new Date(userData.dob);
        
        // Match Month and Day
        const isBirthday = today.getDate() === bday.getDate() && 
                           today.getMonth() === bday.getMonth();

        if (isBirthday) {
            // SUCCESS: Show the Wish & play your music
            document.getElementById('messageDisplay').classList.remove('hidden');
            handleBirthdayReveal(userData);
        } else {
            // NOT YET: Show the Countdown
            document.getElementById('countdownDisplay').classList.remove('hidden');
            handleCountdown(bday);
        }
    }
});

/**
 * Handles the Typewriter effect and plays the Happy Birthday.mp3
 */
function handleBirthdayReveal(data) {
    const bgMusic = document.getElementById('birthdayMusic');
    const typeSound = document.getElementById('typeSound');
    const target = document.getElementById('typewriterText');
    const titleEl = document.getElementById('wishTitle');
    const senderEl = document.getElementById('displaySender');

    // Setup Text
    titleEl.innerText = `To ${data.name}`;
    senderEl.innerText = `— ${data.sender}`;
    const message = `Today represents a rare alignment of time—your day. Prepared with immense care by your ${data.rel}, ${data.sender}, this message arrives to remind you that your presence is a joy to those around you. May your path ahead be as bright and beautiful as this moment. Happy Birthday!`;

    // 1. Start your background music
    if (bgMusic) {
        bgMusic.volume = 0.4;
        bgMusic.play().catch(() => {
            console.log("Audio waiting for user click...");
        });
    }

    // 2. Typewriter Effect
    let i = 0;
    function type() {
        if (i < message.length) {
            target.innerHTML += message.charAt(i);
            // Play typewriter key sound
            if (typeSound) {
                typeSound.currentTime = 0;
                typeSound.play().catch(() => {});
            }
            i++;
            setTimeout(type, 55);
        } else {
            // 3. Final Confetti celebration
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#c5a059', '#ffffff', '#e2b07e']
            });
        }
    }
    
    // Slight delay before typing starts for suspense
    setTimeout(type, 1200);
}

/**
 * Calculates time remaining until the next birthday
 */
function handleCountdown(bday) {
    const timerContainer = document.getElementById('timer');
    const today = new Date();
    
    // Determine the next birthday date
    let target = new Date(today.getFullYear(), bday.getMonth(), bday.getDate());
    if (today > target) {
        target.setFullYear(today.getFullYear() + 1);
    }

    function updateTimer() {
        const now = new Date().getTime();
        const diff = target - now;

        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);

        timerContainer.innerHTML = `
            <div class="t-unit"><span>${d}</span><label>Days</label></div>
            <div class="t-unit"><span>${h}</span><label>Hrs</label></div>
            <div class="t-unit"><span>${m}</span><label>Min</label></div>
            <div class="t-unit"><span>${s}</span><label>Sec</label></div>
        `;
    }

    updateTimer();
    setInterval(updateTimer, 1000);
}

/**
 * Initializes Particles and Magnetic Button Physics
 */
function initGlobalEffects() {
    // Particles
    const container = document.getElementById('particleContainer');
    if (container) {
        for (let i = 0; i < 30; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            const size = Math.random() * 5 + 2 + 'px';
            p.style.width = size; p.style.height = size;
            p.style.top = Math.random() * 100 + '%';
            p.style.left = Math.random() * 100 + '%';
            p.style.animationDelay = Math.random() * 8 + 's';
            container.appendChild(p);
        }
    }

    // Magnetic Button
    const btn = document.querySelector('.liquid-btn');
    if (btn) {
        document.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            const dist = Math.sqrt(x*x + y*y);

            if (dist < 150) {
                btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
            } else {
                btn.style.transform = `translate(0, 0)`;
            }
        });
    }
}
