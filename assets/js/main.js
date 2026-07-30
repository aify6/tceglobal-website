/**
 * The Change Embassy — Main Script
 */

(function () {
  'use strict';

  /* ─── NAV: scroll effect ─── */
  const mainNav = document.getElementById('main-nav');
  if (mainNav) {
    window.addEventListener('scroll', () => {
      mainNav.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
  }

  /* ─── MOBILE MENU ─── */
  let overlay = null;

  function createOverlay() {
    if (overlay) return;
    overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    overlay.addEventListener('click', closeMobileMenu);
    document.body.appendChild(overlay);
  }

  function openMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    const hamburger = document.querySelector('.nav-hamburger');
    if (!navLinks || !hamburger) return;
    createOverlay();
    navLinks.classList.add('mobile-open');
    overlay.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    const hamburger = document.querySelector('.nav-hamburger');
    if (!navLinks || !hamburger) return;
    navLinks.classList.remove('mobile-open');
    if (overlay) overlay.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    if (!navLinks) return;
    navLinks.classList.contains('mobile-open') ? closeMobileMenu() : openMobileMenu();
  }

  window.toggleMobileMenu = toggleMobileMenu;

  // Close menu when a nav link is clicked (SPA-style navigation)
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileMenu();
  });

  /* ─── GIVE NOW BUTTON ─── */
  document.querySelectorAll('.btn-give-now').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const href = btn.getAttribute('href');
      if (!href) return;

      const rect = btn.getBoundingClientRect();
      const clickX = e.clientX;
      const clickY = e.clientY;
      const insideButton = clickX >= rect.left && clickX <= rect.right && clickY >= rect.top && clickY <= rect.bottom;

      if (!insideButton) return;

      e.preventDefault();
      window.location.assign(href);
    });
  });

  /* ─── CONTACT FORM ─── */
  (function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const status = document.createElement('p');
    status.id = 'contact-form-status';
    status.className = 'form-status';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    form.appendChild(status);

    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const submitButton = form.querySelector('button[type="submit"]');
      const formData = new FormData(form);
      const payload = {
        name: formData.get('name') || '',
        email: formData.get('email') || '',
        phone: formData.get('phone') || '',
        subject: formData.get('subject') || '',
        message: formData.get('message') || '',
        _subject: formData.get('_subject') || 'New message from tceglobal.org contact form',
        _captcha: formData.get('_captcha') || 'false',
        _template: 'table'
      };

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
      }
      status.textContent = '';
      status.style.color = '';

      try {
        const response = await fetch('https://formsubmit.co/ajax/aifycorp@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`);
        }

        form.reset();
        status.textContent = 'Thanks! Your message has been received. We will be in touch soon.';
        status.style.color = '#2e7d32';
      } catch (error) {
        status.textContent = 'We could not send the message right now. Please email hello@tceglobal.com directly.';
        status.style.color = '#b21d1d';
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = 'Send Message →';
        }
      }
    });
  }());

  /* ─── FAQ TOGGLE ─── */
  function toggleFaq(el) {
    const ans = el.nextElementSibling;
    if (!ans) return;
    const isOpen = ans.classList.contains('open');
    document.querySelectorAll('.faq-a').forEach(a => a.classList.remove('open'));
    document.querySelectorAll('.faq-q').forEach(q => {
      q.classList.remove('open');
      q.setAttribute('aria-expanded', 'false');
    });
    if (!isOpen) {
      ans.classList.add('open');
      el.classList.add('open');
      el.setAttribute('aria-expanded', 'true');
    }
  }
  window.toggleFaq = toggleFaq;

  document.querySelectorAll('.faq-q').forEach((faq) => {
    faq.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleFaq(faq);
      }
    });
  });

  /* ─── LEADERS CAROUSEL ─── */
  (function initLeadersCarousel() {
    const track   = document.getElementById('leaders-track');
    const prevBtn = document.getElementById('leaders-prev');
    const nextBtn = document.getElementById('leaders-next');
    if (!track || !prevBtn || !nextBtn) return;

    const GAP = 20;
    let autoTimer = null;

    function getCardWidth() {
      const card = track.querySelector('.leader-card');
      return card ? card.offsetWidth + GAP : 280;
    }
    function scrollBy(px) { track.scrollBy({ left: px, behavior: 'smooth' }); }
    function startAutoScroll() {
      stopAutoScroll();
      autoTimer = setInterval(() => {
        const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 10;
        atEnd ? track.scrollTo({ left: 0, behavior: 'smooth' }) : scrollBy(getCardWidth());
      }, 3500);
    }
    function stopAutoScroll() { if (autoTimer) { clearInterval(autoTimer); autoTimer = null; } }

    prevBtn.addEventListener('click', () => scrollBy(-getCardWidth()));
    nextBtn.addEventListener('click', () => scrollBy(getCardWidth()));
    track.addEventListener('mouseenter', stopAutoScroll);
    track.addEventListener('focusin', stopAutoScroll);
    track.addEventListener('mouseleave', startAutoScroll);
    track.addEventListener('focusout', startAutoScroll);
    startAutoScroll();
  }());

  /* ─── COUNTDOWN TIMER ─── */
  (function initCountdown() {
    const cdDays = document.getElementById('cd-days');
    const cdHrs  = document.getElementById('cd-hrs');
    const cdMin  = document.getElementById('cd-min');
    const cdSec  = document.getElementById('cd-sec');
    const wrap   = document.getElementById('countdown-wrap');
    const concluded = document.getElementById('event-concluded');
    if (!cdDays || !cdHrs || !cdMin || !cdSec) return;

    // TODO: confirm exact Prophetic Shift Conference date/time
    const TARGET = new Date('2026-10-03T19:00:00');
    function pad(n) { return String(n).padStart(2, '0'); }

    function updateCountdown() {
      const diff = TARGET - Date.now();
      if (diff <= 0) {
        if (wrap) wrap.style.display = 'none';
        if (concluded) concluded.style.display = 'flex';
        return;
      }
      cdDays.textContent = pad(Math.floor(diff / 86_400_000));
      cdHrs.textContent  = pad(Math.floor((diff % 86_400_000) / 3_600_000));
      cdMin.textContent  = pad(Math.floor((diff % 3_600_000)  /    60_000));
      cdSec.textContent  = pad(Math.floor((diff %    60_000)  /     1_000));
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }());

  /* ─── SCROLL-IN ANIMATION ─── */
  (function initScrollAnimations() {
    const SELECTORS = [
      '.kingdom-card', '.dept-card', '.event-card',
      '.resource-card', '.leader-card', '.ministry-card',
      '.leadership-card', '.give-option-card', '.visit-step',
      '.course-card', '.value-card',
    ];
    const elements = document.querySelectorAll(SELECTORS.join(', '));
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity   = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    elements.forEach(el => {
      el.style.opacity    = '0';
      el.style.transform  = 'translateY(16px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      observer.observe(el);
    });
  }());

  /* ─── YOUTUBE LIVE MODAL ─── */
  (function initLiveModal() {
    const modal = document.getElementById('live-modal');
    const watchBtn = document.getElementById('watch-live-btn');
    const closeBtn = document.getElementById('live-modal-close');
    const overlay = document.getElementById('live-modal-overlay');
    const iframe = document.getElementById('youtube-player');
    if (!modal || !watchBtn || !closeBtn) return;

    const config = window.YOUTUBE_CONFIG || {};
    const API_KEY = config.API_KEY;
    const CHANNEL_HANDLE = config.CHANNEL_HANDLE || '@Drwilliamsbukola';
    const hasApiKey = API_KEY && API_KEY !== 'YOUR_YOUTUBE_API_KEY_HERE';

    let channelData = { liveStreamId: null, isLive: false, channelId: null };

    // Fetch channel ID from handle
    async function getChannelIdFromHandle(handle) {
      try {
        const cleanHandle = handle.replace('@', '');
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=id&type=channel&forHandle=${cleanHandle}&key=${API_KEY}`
        );
        const data = await response.json();
        return data.items?.length > 0 ? data.items[0].id.channelId : null;
      } catch (err) {
        return null;
      }
    }

    // Check if channel is live
    async function checkIfLive() {
      if (!hasApiKey) return false;

      try {
        if (!channelData.channelId) {
          channelData.channelId = await getChannelIdFromHandle(CHANNEL_HANDLE);
          if (!channelData.channelId) return false;
        }

        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=id&channelId=${channelData.channelId}&eventType=live&type=video&key=${API_KEY}`
        );
        const data = await response.json();

        if (data.items?.length > 0) {
          channelData.liveStreamId = data.items[0].id.videoId;
          channelData.isLive = true;
          return true;
        }
        return false;
      } catch (err) {
        return false;
      }
    }

    function openModal() {
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    watchBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      
      if (hasApiKey) {
        watchBtn.disabled = true;
        const isLive = await checkIfLive();
        watchBtn.disabled = false;

        if (isLive) {
          iframe.src = `https://www.youtube.com/embed/${channelData.liveStreamId}?autoplay=1`;
          openModal();
          return;
        }
      }

      // Default: go to channel
      window.open(`https://www.youtube.com/${CHANNEL_HANDLE}`, '_blank');
    });

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
    });
  }());

}());
