(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- Header scroll state ---------------- */
  const header = document.querySelector('.site-header');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 20);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------------- Mobile nav toggle ---------------- */
  const navToggle = document.getElementById('navToggle');
  const navList = document.getElementById('navList');
  if (navToggle && navList) {
    navToggle.addEventListener('click', () => {
      const open = navList.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(open));
    });
    navList.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      navList.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }));
  }

  /* ---------------- Scroll reveal ---------------- */
  const revealEls = document.querySelectorAll('.reveal-up');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  /* ---------------- Animated stat counters ---------------- */
  const statNums = document.querySelectorAll('.stat-num');
  const animateCount = (el) => {
    const target = parseInt(el.dataset.count, 10) || 0;
    if (reduceMotion || target <= 1) { el.textContent = target; return; }
    const duration = 900;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if ('IntersectionObserver' in window) {
    const statIo = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { animateCount(entry.target); statIo.unobserve(entry.target); }
      });
    }, { threshold: 0.6 });
    statNums.forEach(el => statIo.observe(el));
  }

  /* ---------------- Cursor glow (desktop only) ---------------- */
  const glow = document.querySelector('.cursor-glow');
  if (glow && window.matchMedia('(hover: hover)').matches) {
    window.addEventListener('pointermove', (e) => {
      glow.style.opacity = '1';
      glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
    }, { passive: true });
    window.addEventListener('pointerleave', () => { glow.style.opacity = '0'; });
  }

  /* ---------------- Parallax layers ---------------- */
  const parallaxEls = document.querySelectorAll('[data-parallax]');
  if (parallaxEls.length && !reduceMotion) {
    let ticking = false;
    const updateParallax = () => {
      const vh = window.innerHeight;
      parallaxEls.forEach(el => {
        const speed = parseFloat(el.dataset.parallax) || 0.2;
        const rect = el.closest('section')?.getBoundingClientRect() ?? el.getBoundingClientRect();
        const offset = (rect.top) * speed;
        el.style.transform = `translate3d(0, ${offset}px, 0) ${el.classList.contains('hero-bg') ? 'scale(1.08)' : ''}`;
      });
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(updateParallax); ticking = true; }
    }, { passive: true });
    updateParallax();
  }

  /* ---------------- Card tilt-on-hover ---------------- */
  const tiltCards = document.querySelectorAll('.tilt');
  if (window.matchMedia('(hover: hover)').matches && !reduceMotion) {
    tiltCards.forEach(card => {
      let raf = null;
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          card.style.transform = `perspective(900px) rotateX(${(-y * 8).toFixed(2)}deg) rotateY(${(x * 10).toFixed(2)}deg) translateY(-6px)`;
        });
      });
      card.addEventListener('mouseleave', () => {
        if (raf) cancelAnimationFrame(raf);
        card.style.transform = 'perspective(900px) rotateX(0) rotateY(0) translateY(0)';
      });
    });
  }

  /* ---------------- Marquee pause on hover ---------------- */
  document.querySelectorAll('.marquee-track').forEach(track => {
    track.addEventListener('mouseenter', () => { track.style.animationPlayState = 'paused'; });
    track.addEventListener('mouseleave', () => { track.style.animationPlayState = 'running'; });
  });

  /* ---------------- Hero particle canvas ---------------- */
  const canvas = document.getElementById('heroCanvas');
  if (canvas && !reduceMotion) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let w, h, dpr;

    const palette = ['#e4142b', '#cdd1d7', '#8a8f98'];

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round((w * h) / 18000);
      particles = Array.from({ length: Math.min(count, 90) }, () => spawn());
    };

    const spawn = () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.6 + 0.4,
      vy: -(Math.random() * 0.35 + 0.08),
      vx: (Math.random() - 0.5) * 0.12,
      c: palette[Math.floor(Math.random() * palette.length)],
      a: Math.random() * 0.5 + 0.2,
    });

    let mx = -9999, my = -9999;
    window.addEventListener('pointermove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mx = e.clientX - rect.left;
      my = e.clientY - rect.top;
    }, { passive: true });

    const step = () => {
      ctx.clearRect(0, 0, w, h);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        const dx = p.x - mx, dy = p.y - my;
        const dist2 = dx * dx + dy * dy;
        if (dist2 < 9000) {
          const f = (9000 - dist2) / 9000;
          p.x += (dx / (Math.sqrt(dist2) || 1)) * f * 1.4;
          p.y += (dy / (Math.sqrt(dist2) || 1)) * f * 1.4;
        }
        if (p.y < -10) { Object.assign(p, spawn(), { y: h + 10 }); }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.c;
        ctx.globalAlpha = p.a;
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      requestAnimationFrame(step);
    };

    resize();
    window.addEventListener('resize', resize);
    requestAnimationFrame(step);
  }

})();
