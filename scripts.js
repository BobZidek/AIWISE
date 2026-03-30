/* ============================================================
   AIWISE MASTERCLASS — scripts.js
   ============================================================ */

'use strict';

// ── Countdown Timer ───────────────────────────────────────────
(function initCountdown() {
    const el = document.getElementById('countdown');
    if (!el) return;

    const KEY = 'aiwise_deadline_v1';
    let deadline = Number(localStorage.getItem(KEY));

    // Reset if expired or not set
    if (!deadline || Date.now() > deadline) {
        const d = new Date();
        d.setHours(23, 59, 59, 0);
        // If it's already past 23:59, set to tomorrow
        if (Date.now() > d.getTime()) {
            d.setDate(d.getDate() + 1);
        }
        deadline = d.getTime();
        localStorage.setItem(KEY, String(deadline));
    }

    function pad(n) { return String(n).padStart(2, '0'); }

    function tick() {
        const diff = deadline - Date.now();
        if (diff <= 0) {
            el.textContent = '00:00:00';
            return;
        }
        const h = Math.floor(diff / 3_600_000);
        const m = Math.floor((diff % 3_600_000) / 60_000);
        const s = Math.floor((diff % 60_000) / 1_000);
        el.textContent = `${pad(h)}:${pad(m)}:${pad(s)}`;
        setTimeout(tick, 1000);
    }
    tick();
})();


// ── Scroll Reveal ─────────────────────────────────────────────
(function initReveal() {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;

    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            // Stagger cards that share a grid parent
            const siblings = Array.from(
                entry.target.parentElement.querySelectorAll('.reveal:not(.visible)')
            );
            const idx = siblings.indexOf(entry.target);
            entry.target.style.transitionDelay = `${Math.min(idx * 75, 350)}ms`;
            entry.target.classList.add('visible');
            obs.unobserve(entry.target);
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

    els.forEach(el => obs.observe(el));
})();


// ── Number Counter Animation ──────────────────────────────────
(function initCounters() {
    const els = document.querySelectorAll('.stat-num[data-target]');
    if (!els.length) return;

    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const target = parseInt(el.dataset.target, 10);
            const duration = 1100;
            const start = Date.now();

            function update() {
                const t = Math.min((Date.now() - start) / duration, 1);
                const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
                el.textContent = Math.round(eased * target);
                if (t < 1) requestAnimationFrame(update);
            }
            requestAnimationFrame(update);
            obs.unobserve(el);
        });
    }, { threshold: 0.6 });

    els.forEach(el => obs.observe(el));
})();


// ── FAQ Accordion ─────────────────────────────────────────────
(function initFaq() {
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.faq-item');
            const isOpen = item.classList.contains('active');

            // Close all open items
            document.querySelectorAll('.faq-item.active').forEach(open => {
                open.classList.remove('active');
            });

            // Open clicked item (if it was closed)
            if (!isOpen) item.classList.add('active');
        });
    });
})();


// ── Video Player ──────────────────────────────────────────────
(function initVideo() {
    const video  = document.getElementById('heroVideo');
    const playBtn = document.getElementById('playBtn');
    if (!video || !playBtn) return;

    // Autoplay when hero is in view
    const obsVideo = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                video.play().catch(() => {
                    // Autoplay blocked by browser, user must click
                });
            }
        });
    }, { threshold: 0.5 });
    obsVideo.observe(video);

    // Click to unmute and show controls
    playBtn.addEventListener('click', () => {
        video.muted = false;
        playBtn.classList.add('hidden');
        video.controls = true;
        video.play();
    });

    // Show play button again when video pauses
    video.addEventListener('pause', () => {
        if (!video.ended) playBtn.classList.remove('hidden');
    });

    // When video ends, hide controls and show button again
    video.addEventListener('ended', () => {
        playBtn.classList.remove('hidden');
        video.controls = false;
        video.currentTime = 0;
    });
})();


// ── Navbar + Mobile Menu ──────────────────────────────────────
(function initNav() {
    const toggle   = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    if (!toggle || !navLinks) return;

    toggle.addEventListener('click', () => {
        const open = navLinks.classList.toggle('open');
        toggle.classList.toggle('open', open);
        toggle.setAttribute('aria-expanded', String(open));
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
            navLinks.classList.remove('open');
            toggle.classList.remove('open');
            toggle.setAttribute('aria-expanded', 'false');
        });
    });

    // Close menu on outside click
    document.addEventListener('click', e => {
        if (!toggle.contains(e.target) && !navLinks.contains(e.target)) {
            navLinks.classList.remove('open');
            toggle.classList.remove('open');
        }
    });
})();


// ── Mobile Sticky CTA ─────────────────────────────────────────
(function initStickyCta() {
    const cta  = document.getElementById('stickyCta');
    const hero = document.getElementById('hero');
    if (!cta || !hero) return;

    // Only meaningful on mobile (CSS sets display:none on desktop)
    function update() {
        const heroBottom = hero.getBoundingClientRect().bottom;
        cta.classList.toggle('visible', heroBottom < 0);
    }

    window.addEventListener('scroll', update, { passive: true });
    update();
})();


// ── Smooth scroll for anchor links ───────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        const topBarH = document.querySelector('.top-bar-wrapper')?.offsetHeight ?? 0;
        const y = target.getBoundingClientRect().top + window.scrollY - topBarH - 16;
        window.scrollTo({ top: y, behavior: 'smooth' });
    });
});
