// ==================== CONFIG ====================
const SURPRISE_PASSWORD = "iloveyou";

const customImages = [
    "00fc2e1f-bbb3-4973-a7e5-9cbab641bc1c.jpg",
    "d3660095-3203-4b16-b2f3-fab39b0b711f.jpg",
    "017c6aba-84de-405a-a61a-aec2464d48b3.jpg",
    "07a19562-e707-48b8-856a-a2750d15ae41.jpg",
    "1af5a983-b5b4-4311-b11d-6f9eb9484092.jpg",
    "2d61f4ce-855e-4a70-8845-e4b5ec4b65aa.jpg",
    "634e0b1f-f66c-458e-ab8a-7b1cc9a9a935.jpg",
    "657541be-c5ba-4e5e-bf1a-df3b15903d77.jpg",
    "67e91427-c3ab-444a-a623-790d817efcb6.jpg",
    "6bcf2163-a27a-478e-83f8-4950dc586ff4.jpg",
    "753271ed-2d82-4466-8d68-0cccb556d345.jpg",
    "b00a81d8-8ea9-499b-94be-532e0882805a.jpg",
    "b19f1f06-e664-4f1d-b3d0-82f9b4bf2906.jpg",
    "b3208ac0-ab17-4566-ac2b-15e463828fe7.jpg",
    "e46f69c1-85f9-410e-996c-a2e9bc42d0bf.jpg",
    "8a53e58e-e79a-4353-9c98-56cc38fc7bc6.jpg",
    "f8405af9-ea00-429e-93f1-9d60fe7bca5d.jpg"
];

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', function () {
    // Always start LOCKED
    document.getElementById('unlockScreen').style.display = 'flex';
    document.getElementById('mainContent').style.display = 'none';

    document.getElementById('surprisePassword').value = '';

    setupMusicAutoPlay();
});

// ==================== MUSIC ====================
function setupMusicAutoPlay() {
    const audio = document.getElementById('backgroundMusic');
    audio.volume = 0.3;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
        playPromise.catch(() => {
            document.addEventListener('click', function initMusic() {
                audio.play().catch(() => {});
                document.removeEventListener('click', initMusic);
            }, { once: true });
        });
    }
}

// ==================== UNLOCK ====================
function unlockSurprise() {
    const password = document.getElementById('surprisePassword').value;

    if (password === SURPRISE_PASSWORD) {
        unlockSurpriseNow();
    } else {
        shakeUnlockCard();
        document.getElementById('surprisePassword').value = '';
        showErrorMessage();
    }
}

function unlockSurpriseNow() {
    document.getElementById('unlockScreen').style.display = 'none';
    document.getElementById('mainContent').style.display = 'block';

    triggerConfetti();
    showMonthsaryReveal();
}

function shakeUnlockCard() {
    const card = document.querySelector('.unlock-card');
    card.style.animation = 'shake 0.5s';
    setTimeout(() => card.style.animation = '', 500);
}

function showErrorMessage() {
    const input = document.getElementById('surprisePassword');
    input.placeholder = "Wrong password 💔";
}

// ==================== BACK TO LOCK ====================
function goBackToLock() {
    const main = document.getElementById('mainContent');
    const lock = document.getElementById('unlockScreen');

    main.style.opacity = '0';

    setTimeout(() => {
        main.style.display = 'none';

        lock.style.display = 'flex';
        lock.style.opacity = '0';

        setTimeout(() => {
            lock.style.opacity = '1';
        }, 50);

    }, 300);

    document.getElementById('surprisePassword').value = '';
}

// ==================== MONTHSARY ====================
function showMonthsaryReveal() {
    document.getElementById('monthsarySection').style.display = 'block';
    document.getElementById('footerSection').style.display = 'block';

    const container = document.getElementById('mediaContainer');
    container.innerHTML = '';

    const items = generateHeartMediaItems();

    items.forEach((item, index) => {
        setTimeout(() => {
            container.appendChild(item);
            triggerConfetti();
        }, index * 150);
    });
}

// ==================== HEART ====================
function generateHeartMediaItems() {
    const items = [];
    const container = document.getElementById('mediaContainer');

    const rect = container.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const scale = Math.min(rect.width, rect.height) / 35;

    for (let t = 0; t < Math.PI * 2; t += 0.25) {
        const x = 16 * Math.pow(Math.sin(t), 3);
        const y = 13 * Math.cos(t)
            - 5 * Math.cos(2 * t)
            - 2 * Math.cos(3 * t)
            - Math.cos(4 * t);

        const div = document.createElement('div');
        div.className = 'media-item heart-pop';

        const size = window.innerWidth < 480 ? 65 :
            window.innerWidth < 768 ? 85 : 110;

        div.style.width = size + 'px';
        div.style.height = size + 'px';
        div.style.left = centerX + x * scale - size / 2 + 'px';
        div.style.top = centerY - y * scale - size / 2 + 'px';

        const img = document.createElement('img');
        img.src = customImages[Math.floor(Math.random() * customImages.length)];

        div.appendChild(img);
        items.push(div);
    }

    return items;
}

// ==================== CONFETTI ====================
function triggerConfetti() {
    const canvas = document.getElementById('confetti');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];

    class Confetti {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height - canvas.height;
            this.size = Math.random() * 8 + 4;
            this.speedX = Math.random() * 6 - 3;
            this.speedY = Math.random() * 5 + 5;
            this.opacity = 1;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.opacity -= 0.01;
        }

        draw() {
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = "#ff6b9d";
            ctx.fillRect(this.x, this.y, this.size, this.size);
        }
    }

    for (let i = 0; i < 100; i++) {
        particles.push(new Confetti());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach((p, i) => {
            p.update();
            p.draw();

            if (p.opacity <= 0) particles.splice(i, 1);
        });

        if (particles.length > 0) requestAnimationFrame(animate);
    }

    animate();
}

// ==================== ENTER KEY ====================
document.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') unlockSurprise();
});