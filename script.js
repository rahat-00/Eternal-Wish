document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('particleContainer');
    if (container) {
        for (let i = 0; i < 30; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            p.style.width = Math.random() * 5 + 2 + 'px';
            p.style.height = p.style.width;
            p.style.top = Math.random() * 100 + '%';
            p.style.left = Math.random() * 100 + '%';
            p.style.animationDelay = Math.random() * 5 + 's';
            container.appendChild(p);
        }
    }

    const form = document.getElementById('celebrationForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const data = {
                name: document.getElementById('fullName').value,
                dob: document.getElementById('dob').value,
                sender: document.getElementById('senderName').value,
                rel: document.getElementById('relationship').value
            };
            localStorage.setItem('user_gift_data', JSON.stringify(data));
            window.location.href = 'result.html';
        });
    }

    if (window.location.pathname.includes('result.html')) {
        const data = JSON.parse(localStorage.getItem('user_gift_data'));
        if (!data) return;

        const bgMusic = document.getElementById('birthdayMusic');
        const typeSound = document.getElementById('typeSound');
        const today = new Date();
        const bday = new Date(data.dob);

        if (today.getDate() === bday.getDate() && today.getMonth() === bday.getMonth()) {
            if (bgMusic) bgMusic.play().catch(() => console.log("Music interaction required"));
            
            const message = `Today is not just an ordinary day — it is your day, ${data.name}. This message reaches you with genuine care from your ${data.rel}, ${data.sender}. May today bring you peace, happiness, and moments that make you smile without even trying. You are deeply valued.`;
            document.getElementById('wishTitle').innerText = `To ${data.name}`;
            document.getElementById('displaySender').innerText = `— ${data.sender}`;
            
            let i = 0;
            function type() {
                if (i < message.length) {
                    document.getElementById('typewriterText').innerHTML += message.charAt(i);
                    if (typeSound) { typeSound.currentTime = 0; typeSound.play().catch(() => {}); }
                    i++;
                    setTimeout(type, 50);
                } else {
                    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#c5a059', '#ffffff'] });
                }
            }
            setTimeout(type, 1000);
        }
    }
});