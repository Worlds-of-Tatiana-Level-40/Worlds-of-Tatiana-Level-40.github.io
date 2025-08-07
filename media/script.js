// Initialisation d'AOS (Animate On Scroll)
AOS.init({
  duration: 1000,
  once: true,
  offset: 100
});

// Gestion du menu burger
const burgerMenu = document.querySelector('.burger-menu');
const navMenu = document.querySelector('.nav-menu');

if (burgerMenu && navMenu) {
  burgerMenu.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    burgerMenu.classList.toggle('active');
  });

  // Fermer le menu quand on clique sur un lien
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      burgerMenu.classList.remove('active');
    });
  });
}


// Gestion de la galerie et lightbox
const gallery = document.getElementById('gallery');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.querySelector('.lightbox-close');

// Images par défaut pour la galerie (utilisation d'images Pexels)
const defaultImages = [
  {
    src: 'https://images.pexels.com/photos/163036/mario-luigi-yoschi-figures-163036.jpeg?auto=compress&cs=tinysrgb&w=400',
    alt: 'Gaming figurines'
  },
  {
    src: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=400',
    alt: 'Gaming setup'
  },
  {
    src: 'https://images.pexels.com/photos/1293269/pexels-photo-1293269.jpeg?auto=compress&cs=tinysrgb&w=400',
    alt: 'Comic books'
  },
  {
    src: 'https://images.pexels.com/photos/1174746/pexels-photo-1174746.jpeg?auto=compress&cs=tinysrgb&w=400',
    alt: 'Superhero figures'
  },
  {
    src: 'https://images.pexels.com/photos/1637438/pexels-photo-1637438.jpeg?auto=compress&cs=tinysrgb&w=400',
    alt: 'Gaming controllers'
  },
  {
    src: 'https://images.pexels.com/photos/1298601/pexels-photo-1298601.jpeg?auto=compress&cs=tinysrgb&w=400',
    alt: 'Cosplay masks'
  }
];

// Charger les images dans la galerie
if (gallery) {
  // Essayer de charger depuis le dossier media d'abord
  fetch('media/')
    .then(response => response.text())
    .then(data => {
      const parser = new DOMParser();
      const htmlDoc = parser.parseFromString(data, 'text/html');
      const links = htmlDoc.querySelectorAll('a');
      let hasImages = false;
      
      links.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
          hasImages = true;
          const img = document.createElement('img');
          img.src = 'media/' + href;
          img.alt = 'Photo souvenir';
          img.loading = 'lazy';
          
          img.addEventListener('click', () => openLightbox(img.src));
          gallery.appendChild(img);
        }
      });
      
      // Si aucune image trouvée, utiliser les images par défaut
      if (!hasImages) {
        loadDefaultImages();
      }
    })
    .catch(() => {
      // En cas d'erreur, charger les images par défaut
      loadDefaultImages();
    });
}

function loadDefaultImages() {
  if (!gallery) return;
  
  defaultImages.forEach(imageData => {
    const img = document.createElement('img');
    img.src = imageData.src;
    img.alt = imageData.alt;
    img.loading = 'lazy';
    
    img.addEventListener('click', () => openLightbox(img.src));
    gallery.appendChild(img);
  });
}

// Fonctions lightbox
function openLightbox(src) {
  if (lightbox && lightboxImg) {
    lightboxImg.src = src;
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
}

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

// Fermer la lightbox avec Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeLightbox();
  }
});

// Smooth scroll pour les liens d'ancrage
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const headerHeight = document.querySelector('.header').offsetHeight;
      const targetPosition = target.offsetTop - headerHeight - 20;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// Effet parallax léger sur le hero
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const hero = document.querySelector('.hero');
  const header = document.querySelector('.header');
  
  // Effet parallax sur le hero
  if (hero) {
    const rate = scrolled * -0.5;
    hero.style.transform = `translateY(${rate}px)`;
  }
  
  // Effet sur le header
  if (header) {
    if (scrolled > 100) {
      header.style.background = 'rgba(15, 15, 35, 0.98)';
      header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
    } else {
      header.style.background = 'rgba(15, 15, 35, 0.95)';
      header.style.boxShadow = 'none';
    }
  }
});

// Fonction pour afficher des notifications
function showNotification(message, type = 'info') {
  // Créer l'élément notification s'il n'existe pas
  let notificationContainer = document.querySelector('.notification-container');
  if (!notificationContainer) {
    notificationContainer = document.createElement('div');
    notificationContainer.className = 'notification-container';
    notificationContainer.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10001;
      pointer-events: none;
    `;
    document.body.appendChild(notificationContainer);
  }
  
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.style.cssText = `
    background: var(--bg-tertiary);
    color: var(--text-primary);
    padding: 1rem 1.5rem;
    border-radius: var(--border-radius);
    margin-bottom: 10px;
    box-shadow: var(--shadow-xl);
    border-left: 4px solid var(--${type === 'success' ? 'success' : type === 'error' ? 'error' : 'primary'}-color);
    transform: translateX(400px);
    transition: transform 0.3s ease;
    pointer-events: auto;
    max-width: 300px;
  `;
  
  notification.textContent = message;
  notificationContainer.appendChild(notification);
  
  // Animation d'entrée
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  // Suppression automatique
  setTimeout(() => {
    notification.style.transform = 'translateX(400px)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 4000);
}

// Easter egg : Konami Code
let konamiCode = [];
const konamiSequence = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'KeyB', 'KeyA'
];

document.addEventListener('keydown', (e) => {
  konamiCode.push(e.code);
  
  // Garder seulement les 10 dernières touches
  if (konamiCode.length > 10) {
    konamiCode.shift();
  }
  
  // Vérifier si le code Konami est correct
  if (konamiCode.length === 10 && 
      konamiCode.every((key, index) => key === konamiSequence[index])) {
    
    // Easter egg activé !
    activateEasterEgg();
    konamiCode = []; // Reset
  }
});

function activateEasterEgg() {
  // Créer des éléments qui tombent
  const emojis = ['🎮', '🦸‍♂️', '🚀', '⚡', '🎭', '🎯', '💫', '🔥'];
  
  for (let i = 0; i < 30; i++) {
    setTimeout(() => {
      const emoji = document.createElement('div');
      emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      emoji.style.cssText = `
        position: fixed;
        top: -50px;
        left: ${Math.random() * window.innerWidth}px;
        font-size: 2rem;
        z-index: 10000;
        pointer-events: none;
        animation: fall 3s linear forwards;
      `;
      
      document.body.appendChild(emoji);
      
      setTimeout(() => {
        if (emoji.parentNode) {
          emoji.parentNode.removeChild(emoji);
        }
      }, 3000);
    }, i * 100);
  }
  
  // Ajouter l'animation CSS si elle n'existe pas
  if (!document.querySelector('#easter-egg-style')) {
    const style = document.createElement('style');
    style.id = 'easter-egg-style';
    style.textContent = `
      @keyframes fall {
        to {
          transform: translateY(${window.innerHeight + 100}px) rotate(360deg);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  showNotification('🎉 Easter egg activé ! Code Konami détecté !', 'success');
}

// Animation des éléments flottants dans le hero
document.querySelectorAll('.floating-element').forEach((element, index) => {
  element.addEventListener('click', () => {
    element.style.animation = 'none';
    element.style.transform = 'scale(1.5) rotate(360deg)';
    element.style.transition = 'transform 0.5s ease';
    
    setTimeout(() => {
      element.style.animation = '';
      element.style.transform = '';
      element.style.transition = '';
    }, 500);
  });
});

// Initialisation terminée
console.log('🎮 Comic Con Birthday - Script initialisé !');
console.log('💡 Astuce : Essaie le code Konami (↑↑↓↓←→←→BA) pour une surprise !');



// Dépli/repli des sous-catégories d'animations
document.querySelectorAll('.toggle-subsection').forEach(title => {
  title.addEventListener('click', () => {
    const subsection = title.parentElement;
    subsection.classList.toggle('active');
  });
});

