// Initialisation AOS
AOS.init({
  duration: 800,
  easing: 'ease-in-out',
  once: true,
  offset: 100
});

// Menu burger
const burgerMenu = document.querySelector('.burger-menu');
const navMenu = document.querySelector('.nav-menu');

if (burgerMenu && navMenu) {
  burgerMenu.addEventListener('click', () => {
    burgerMenu.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Fermer le menu en cliquant sur un lien
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      burgerMenu.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });
}

// Smooth scroll pour les liens d'ancrage
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const headerHeight = document.querySelector('.header').offsetHeight;
      const targetPosition = target.offsetTop - headerHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// Galerie et Lightbox
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.querySelector('.lightbox-close');

// Fonction pour charger les images de la galerie
function loadGalleryImages() {
  const gallery = document.getElementById('gallery');
  if (!gallery) return;

  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
  const imagePromises = [];

  // Essayer de charger les images de 1 à 20
  for (let i = 1; i <= 20; i++) {
    for (const ext of imageExtensions) {
      const timestamp = new Date().getTime();
      const imagePath = `media/galerie/image${i}.${ext}?v=${timestamp}`;
      
      const img = new Image();
      img.src = imagePath;
      
      const promise = new Promise((resolve) => {
        img.onload = () => resolve({ src: imagePath, exists: true });
        img.onerror = () => resolve({ src: imagePath, exists: false });
      });
      
      imagePromises.push(promise);
    }
  }

  Promise.all(imagePromises).then(results => {
    const existingImages = results.filter(result => result.exists);
    
    existingImages.forEach(imageData => {
      const img = document.createElement('img');
      img.src = imageData.src;
      img.alt = `Image galerie`;
      img.addEventListener('click', () => openLightbox(imageData.src));
      gallery.appendChild(img);
    });
  });
}

// Ouvrir la lightbox
function openLightbox(src) {
  if (lightbox && lightboxImg) {
    lightboxImg.src = src;
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
}

// Fermer la lightbox
function closeLightbox() {
  if (lightbox) {
    lightbox.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
}

// Event listeners pour la lightbox
if (lightboxClose) {
  lightboxClose.addEventListener('click', closeLightbox);
}

if (lightbox) {
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });
}

// Échapper pour fermer la lightbox
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeLightbox();
  }
});

// Charger les images au chargement de la page
document.addEventListener('DOMContentLoaded', loadGalleryImages);

// Effet parallax léger sur le hero
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const heroBackground = document.querySelector('.hero-bg');
  
  if (heroBackground) {
    heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
  }
});

// Animation des éléments flottants
document.querySelectorAll('.floating-element').forEach((element, index) => {
  element.style.animationDelay = `${index * 0.5}s`;
});

// Gestion des sous-catégories d'animations
document.querySelectorAll('.toggle-subsection').forEach(toggle => {
  toggle.addEventListener('click', function() {
    const subsection = this.closest('.animation-subsection');
    const isActive = subsection.classList.contains('active');
    
    // Fermer toutes les autres sous-sections
    document.querySelectorAll('.animation-subsection').forEach(section => {
      section.classList.remove('active');
    });
    
    // Ouvrir/fermer la sous-section cliquée
    if (!isActive) {
      subsection.classList.add('active');
    }
  });
});

// Easter egg - Code Konami
let konamiCode = [];
const konamiSequence = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'KeyB', 'KeyA'
];

document.addEventListener('keydown', (e) => {
  konamiCode.push(e.code);
  
  if (konamiCode.length > konamiSequence.length) {
    konamiCode.shift();
  }
  
  if (JSON.stringify(konamiCode) === JSON.stringify(konamiSequence)) {
    showNotification('🎮 Code Konami activé ! Bonus geek débloqué !', 'success');
    // Ajouter un effet spécial
    document.body.style.animation = 'rainbow 2s infinite';
    setTimeout(() => {
      document.body.style.animation = '';
    }, 5000);
  }
});

// Système de notifications
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--gradient-primary);
    color: white;
    padding: 1rem 2rem;
    border-radius: var(--border-radius);
    box-shadow: var(--shadow-lg);
    z-index: 10000;
    transform: translateX(100%);
    transition: transform 0.3s ease;
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Gestion Tally avec cache busting
const successSound = new Audio(`media/sons/success.mp3?v=${new Date().getTime()}`);

// Bouton billetterie
document.getElementById('open-tally-btn').addEventListener('click', (e) => {
  e.preventDefault();
  
  // Supprimer l'ancienne instance de Tally si elle existe
  if (window.Tally && window.Tally.closePopup) {
    window.Tally.closePopup();
  }
  
  // Recharger le script Tally avec cache busting
  const timestamp = new Date().getTime();
  const script = document.createElement('script');
  script.src = `https://tally.so/widgets/embed.js?v=${timestamp}`;
  script.onload = () => {
    // Ouvrir le popup une fois le script chargé
    if (window.Tally && window.Tally.openPopup) {
      window.Tally.openPopup('3xWvry', {
        layout: 'modal',
        width: 700,
        autoClose: 3000,
        doNotShowAfterSubmit: true,
        onSubmit: (payload) => {
          try {
            successSound.play();
          } catch (error) {
            console.log('Son non disponible');
          }
          showNotification('🎉 Réservation confirmée ! Merci !', 'success');
        }
      });
    }
  };
  
  // Remplacer l'ancien script
  const oldScript = document.querySelector('script[src*="tally.so"]');
  if (oldScript) {
    oldScript.remove();
  }
  
  document.head.appendChild(script);
});

// Bouton concours cosplay
document.getElementById('open-cosplay-tally-btn').addEventListener('click', (e) => {
  e.preventDefault();
  
  // Supprimer l'ancienne instance de Tally si elle existe
  if (window.Tally && window.Tally.closePopup) {
    window.Tally.closePopup();
  }
  
  // Recharger le script Tally avec cache busting
  const timestamp = new Date().getTime();
  const script = document.createElement('script');
  script.src = `https://tally.so/widgets/embed.js?v=${timestamp}`;
  script.onload = () => {
    // Ouvrir le popup une fois le script chargé
    if (window.Tally && window.Tally.openPopup) {
      window.Tally.openPopup('rj5bYv', {
        layout: 'modal',
        width: 700,
        autoClose: 3000,
        doNotShowAfterSubmit: true,
        onSubmit: (payload) => {
          try {
            successSound.play();
          } catch (error) {
            console.log('Son non disponible');
          }
          showNotification('🎭 Inscription confirmée ! À bientôt sur scène !', 'success');
        }
      });
    }
  };
  
  // Remplacer l'ancien script
  const oldScript = document.querySelector('script[src*="tally.so"]');
  if (oldScript) {
    oldScript.remove();
  }
  
  document.head.appendChild(script);
});

// Bouton newsletter
document.getElementById('open-newsletter-tally-btn').addEventListener('click', (e) => {
  e.preventDefault();
  
  // Supprimer l'ancienne instance de Tally si elle existe
  if (window.Tally && window.Tally.closePopup) {
    window.Tally.closePopup();
  }
  
  // Recharger le script Tally avec cache busting
  const timestamp = new Date().getTime();
  const script = document.createElement('script');
  script.src = `https://tally.so/widgets/embed.js?v=${timestamp}`;
  script.onload = () => {
    // Ouvrir le popup une fois le script chargé
    if (window.Tally && window.Tally.openPopup) {
      window.Tally.openPopup('kdljEo', {
        layout: 'modal',
        width: 700,
        autoClose: 3000,
        doNotShowAfterSubmit: true,
        onSubmit: (payload) => {
          try {
            successSound.play();
          } catch (error) {
            console.log('Son non disponible');
          }
          showNotification('📧 Inscription newsletter confirmée ! Merci !', 'success');
        }
      });
    }
  };
  
  // Remplacer l'ancien script
  const oldScript = document.querySelector('script[src*="tally.so"]');
  if (oldScript) {
    oldScript.remove();
  }
  
  document.head.appendChild(script);
});


// Bouton galerie pour envoyer des photos
document.getElementById('open-gallery-tally-btn').addEventListener('click', (e) => {
  e.preventDefault();
  
  // Fermer l'ancienne instance de Tally si elle existe
  if (window.Tally && window.Tally.closePopup) {
    window.Tally.closePopup();
  }
  
  // Charger le script Tally avec cache busting
  const timestamp = new Date().getTime();
  const script = document.createElement('script');
  script.src = `https://tally.so/widgets/embed.js?v=${timestamp}`;
  
  script.onload = () => {
    if (window.Tally && window.Tally.openPopup) {
      window.Tally.openPopup('A7zMoz', { // <-- Remplace TON_FORM_ID par l'ID de ton formulaire Tally
        layout: 'modal',
        width: 700,
        autoClose: 3000,
        doNotShowAfterSubmit: true,
        onSubmit: (payload) => {
          try {
            successSound.play(); // joue le son de confirmation
          } catch (error) {
            console.log('Son non disponible');
          }
          showNotification('📸 Merci pour tes photos !', 'success');
        }
      });
    }
  };
  
  // Remplacer l'ancien script si présent
  const oldScript = document.querySelector('script[src*="tally.so"]');
  if (oldScript) oldScript.remove();
  
  document.head.appendChild(script);
});




// Animation rainbow pour l'easter egg
const style = document.createElement('style');
style.textContent = `
  @keyframes rainbow {
    0% { filter: hue-rotate(0deg); }
    100% { filter: hue-rotate(360deg); }
  }
`;
document.head.appendChild(style);
