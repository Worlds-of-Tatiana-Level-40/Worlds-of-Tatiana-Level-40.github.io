// ==========================
// AOS
// ==========================
AOS.init({
  duration: 800,
  easing: 'ease-in-out',
  once: true,
  offset: 100
});

// ==========================
// MENU BURGER
// ==========================
const burgerMenu = document.querySelector('.burger-menu');
const navMenu = document.querySelector('.nav-menu');

if (burgerMenu && navMenu) {
  burgerMenu.addEventListener('click', () => {
    burgerMenu.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      burgerMenu.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });
}

// ==========================
// SMOOTH SCROLL
// ==========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;

    const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
    const targetPosition = target.offsetTop - headerHeight;

    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  });
});

// ==========================
// LIGHTBOX
// ==========================
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.querySelector('.lightbox-close');

function openLightbox(src) {
  if (!lightbox || !lightboxImg) return;
  lightboxImg.src = src;
  lightbox.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.style.display = 'none';
  document.body.style.overflow = 'auto';
}

lightboxClose?.addEventListener('click', closeLightbox);

lightbox?.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});

// ==========================
// GALERIE (images.json)
// ==========================
function loadGalleryImages() {
  const gallery = document.getElementById('gallery');
  if (!gallery) return;

  fetch('media/galerie/images.json')
    .then(res => res.json())
    .then(images => {
      images.forEach(filename => {
        const img = document.createElement('img');
        img.src = `media/galerie/${filename}?v=${Date.now()}`;
        img.alt = 'Image galerie';
        img.addEventListener('click', () => openLightbox(img.src));
        gallery.appendChild(img);
      });
    })
    .catch(err => {
      console.error('Erreur galerie :', err);
    });
}

document.addEventListener('DOMContentLoaded', loadGalleryImages);

// ==========================
// PARALLAX HERO
// ==========================
window.addEventListener('scroll', () => {
  const heroBg = document.querySelector('.hero-bg');
  if (!heroBg) return;
  heroBg.style.transform = `translateY(${window.scrollY * 0.5}px)`;
});

// ==========================
// ELEMENTS FLOTTANTS
// ==========================
document.querySelectorAll('.floating-element').forEach((el, i) => {
  el.style.animationDelay = `${i * 0.4}s`;
});

// ==========================
// SOUS-SECTIONS ANIMATIONS
// ==========================
document.querySelectorAll('.toggle-subsection').forEach(toggle => {
  toggle.addEventListener('click', () => {
    const parent = toggle.closest('.animation-subsection');
    document.querySelectorAll('.animation-subsection').forEach(s => s.classList.remove('active'));
    parent.classList.toggle('active');
  });
});

// ==========================
// KONAMI CODE
// ==========================
let konami = [];
const konamiSeq = [
  'ArrowUp','ArrowUp','ArrowDown','ArrowDown',
  'ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','KeyB','KeyA'
];

document.addEventListener('keydown', e => {
  konami.push(e.code);
  if (konami.length > konamiSeq.length) konami.shift();

  if (JSON.stringify(konami) === JSON.stringify(konamiSeq)) {
    showNotification('🎮 Code Konami activé !', 'success');
    document.body.style.animation = 'rainbow 2s infinite';
    setTimeout(() => document.body.style.animation = '', 5000);
  }
});

// ==========================
// NOTIFICATIONS
// ==========================
function showNotification(message, type = 'info') {
  const notif = document.createElement('div');
  notif.textContent = message;
  notif.className = `notification notification-${type}`;
  notif.style.cssText = `
    position:fixed;top:20px;right:20px;
    background:var(--gradient-primary);
    color:white;padding:1rem 2rem;
    border-radius:12px;z-index:10000;
    transform:translateX(120%);
    transition:0.3s;
  `;
  document.body.appendChild(notif);
  setTimeout(() => notif.style.transform = 'translateX(0)', 100);
  setTimeout(() => {
    notif.style.transform = 'translateX(120%)';
    setTimeout(() => notif.remove(), 300);
  }, 3000);
}

// ==========================
// TALLY – GALERIE PHOTOS
// ==========================
const successSound = new Audio(`media/sons/success.mp3?v=${Date.now()}`);

document.getElementById('open-gallery-tally-btn')?.addEventListener('click', e => {
  e.preventDefault();

  if (window.Tally?.closePopup) window.Tally.closePopup();

  const script = document.createElement('script');
  script.src = `https://tally.so/widgets/embed.js?v=${Date.now()}`;
  script.onload = () => {
    window.Tally.openPopup('TON_ID_TALLY_GALERIE', {
      layout: 'modal',
      width: 700,
      doNotShowAfterSubmit: false,
      onSubmit: () => {
        successSound.play().catch(() => {});
        showNotification('📸 Merci pour ta photo !', 'success');
      }
    });
  };

  document.querySelector('script[src*="tally.so"]')?.remove();
  document.head.appendChild(script);
});

// ==========================
// STYLE RAINBOW
// ==========================
const style = document.createElement('style');
style.textContent = `
@keyframes rainbow {
  from { filter:hue-rotate(0deg); }
  to { filter:hue-rotate(360deg); }
}`;
document.head.appendChild(style);
