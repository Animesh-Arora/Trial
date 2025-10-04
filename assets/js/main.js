// Serenity Health Interactions and Animations
(function(){
  const $ = (sel, el=document) => el.querySelector(sel);
  const $$ = (sel, el=document) => Array.from(el.querySelectorAll(sel));

  // Mobile nav toggle
  const navToggle = $('.nav-toggle');
  const navLinks = $('.nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      // Animate burger
      navToggle.classList.toggle('active', isOpen);
    });
    // Close on link click (mobile)
    navLinks.addEventListener('click', e => {
      if (e.target.matches('a') && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Smooth scroll for nav links
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId && targetId.length > 1) {
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  // IntersectionObserver for reveal animations
  const revealEls = $$('.reveal-on-scroll');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = Number(entry.target.getAttribute('data-delay') || 0);
        setTimeout(() => entry.target.classList.add('visible'), delay);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));

  // Parallax hero layers
  const heroLayers = $$('.hero-layer');
  function onScrollParallax(){
    const scrolled = window.scrollY || window.pageYOffset;
    heroLayers.forEach(layer => {
      const speed = Number(layer.getAttribute('data-parallax') || 0.2);
      layer.style.transform = `translateY(${-(scrolled * speed)}px)`;
    });
  }
  window.addEventListener('scroll', onScrollParallax, { passive: true });
  onScrollParallax();

  // Animated counters in hero
  const counters = $$('.stat .num');
  const countersIo = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = Number(el.getAttribute('data-count') || 0);
        const duration = 1200;
        const start = performance.now();
        function step(now){
          const p = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased).toString();
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        countersIo.unobserve(el);
      }
    });
  }, { threshold: 0.6 });
  counters.forEach(c => countersIo.observe(c));

  // Header style on scroll + active nav link
  const header = $('.site-header');
  const sections = ['#home','#features','#doctors','#testimonials','#contact'].map(id => document.querySelector(id)).filter(Boolean);
  const navItems = $$('.nav-links a');
  function onScrollHeader(){
    const y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle('is-scrolled', y > 8);
    const fromTop = y + 100;
    let activeId = '#home';
    sections.forEach(sec => {
      if (sec && sec.offsetTop <= fromTop) activeId = '#' + sec.id;
    });
    navItems.forEach(a => a.classList.toggle('active', a.getAttribute('href') === activeId));
  }
  window.addEventListener('scroll', onScrollHeader, { passive: true });
  onScrollHeader();

  // Testimonials carousel (fade)
  const track = $('.carousel-track');
  const slides = $$('.testimonial', track);
  const prevBtn = $('.carousel .prev');
  const nextBtn = $('.carousel .next');
  const dotsWrap = $('.carousel-dots');
  let idx = 0;
  function updateCarousel(){
    slides.forEach((s, i) => s.classList.toggle('active', i === idx));
    dotsWrap.querySelectorAll('button').forEach((d, i) => d.classList.toggle('active', i === idx));
  }
  if (track && slides.length){
    // Create dots
    slides.forEach((_, i) => {
      const b = document.createElement('button');
      b.setAttribute('aria-label', `Go to slide ${i+1}`);
      b.addEventListener('click', () => { idx = i; updateCarousel(); });
      dotsWrap.appendChild(b);
    });
    updateCarousel();
    prevBtn?.addEventListener('click', () => { idx = (idx - 1 + slides.length) % slides.length; updateCarousel(); });
    nextBtn?.addEventListener('click', () => { idx = (idx + 1) % slides.length; updateCarousel(); });
    // Auto-advance
    setInterval(() => { idx = (idx + 1) % slides.length; updateCarousel(); }, 6000);
  }

  // Contact form interactions
  const form = $('.contact-form');
  const statusEl = $('.form-status');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      statusEl.textContent = 'Sending…';
      const formData = new FormData(form);
      // Fake async submit
      await new Promise(r => setTimeout(r, 900));
      // Simple client validation feedback
      const name = formData.get('name')?.toString().trim();
      const email = formData.get('email')?.toString().trim();
      const message = formData.get('message')?.toString().trim();
      if (!name || !email || !message) {
        statusEl.textContent = 'Please fill in all fields.';
        statusEl.style.color = '#c62828';
        return;
      }
      statusEl.textContent = 'Thanks! We will reach out shortly.';
      statusEl.style.color = '#1b5e20';
      form.reset();
    });
  }

  // Floating action button behavior
  const fab = $('.fab');
  fab?.addEventListener('click', () => {
    $('#contact')?.scrollIntoView({ behavior: 'smooth' });
  });

  // Footer year
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
