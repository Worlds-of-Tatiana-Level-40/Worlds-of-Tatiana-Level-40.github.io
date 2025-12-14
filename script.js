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

  // Vider la galerie avant de recharger
  gallery.innerHTML = '';

  // Essayer de charger le fichier JSON avec la liste des images
  const timestamp = new Date().getTime();
  fetch(`media/galerie/images.json?v=${timestamp}`)
    .then(response => response.json())
    .then(imageList => {
      if (imageList && imageList.length > 0) {
        displayGalleryFromList(imageList);
      } else {
        loadImagesWithFallback();
      }
    })
    .catch(() => {
      // Si le fichier JSON n'existe pas, essayer la méthode de fallback
      loadImagesWithFallback();
    });
}

// Fonction pour charger les images depuis une liste JSON
function displayGalleryFromList(imageList) {
  const gallery = document.getElementById('gallery');
  if (!gallery) return;
  
  const timestamp = new Date().getTime();
  const imagePromises = [];
  
  imageList.forEach((imageName, index) => {
    const imagePath = `media/galerie/${imageName}?v=${timestamp}`;
    
    const img = new Image();
    img.src = imagePath;
    
    const promise = new Promise((resolve) => {
      img.onload = () => resolve({ 
        src: imagePath, 
        exists: true, 
        name: imageName,
        index: index 
      });
      img.onerror = () => resolve({ 
        src: imagePath, 
        exists: false, 
        name: imageName,
        index: index 
      });
    });
    
    imagePromises.push(promise);
  });
  
  // Traitement par batch pour de meilleures performances
  const batchSize = 20;
  processBatchesFromList(imagePromises, batchSize);
}

// Fonction pour traiter les images par batch depuis une liste
function processBatchesFromList(imagePromises, batchSize) {
  const gallery = document.getElementById('gallery');
  if (!gallery) return;
  
  let processedCount = 0;
  let validImages = [];
  
  const processBatch = (startIndex) => {
    const batch = imagePromises.slice(startIndex, startIndex + batchSize);
    
    if (batch.length === 0) {
      // Tous les batches traités
      if (validImages.length === 0) {
        showNoImagesMessage();
      } else {
        showNotification(`📸 ${validImages.length} photo(s) chargée(s) !`, 'info');
      }
      return;
    }
    
    Promise.all(batch).then(results => {
      results.forEach((result, index) => {
        if (result.exists) {
          validImages.push(result);
          
          const img = document.createElement('img');
          img.src = result.src;
          img.alt = `Photo souvenir - ${result.name}`;
          img.loading = 'lazy';
          img.style.opacity = '0';
          img.style.transition = 'opacity 0.3s ease';
          
          // Animation d'apparition progressive
          img.onload = () => {
            setTimeout(() => {
              img.style.opacity = '1';
            }, (processedCount + index) * 30);
          };
          
          img.addEventListener('click', () => openLightbox(result.src));
          gallery.appendChild(img);
        }
      });
      
      processedCount += results.length;
      
      // Traiter le batch suivant après un petit délai
      setTimeout(() => {
        processBatch(startIndex + batchSize);
      }, 100);
    });
  };
  
  processBatch(0);
}

// Fonction de fallback pour charger les images sans JSON
function loadImagesWithFallback() {
  const gallery = document.getElementById('gallery');
  if (!gallery) return;
  
  // Essayer de détecter automatiquement les images communes
  const commonNames = [
    'photo1.jpg', 'photo2.jpg', 'photo3.jpg', 'photo4.jpg', 'photo5.jpg',
    'image1.jpg', 'image2.jpg', 'image3.jpg', 'image4.jpg', 'image5.jpg',
    'img1.jpg', 'img2.jpg', 'img3.jpg', 'img4.jpg', 'img5.jpg',
    'souvenir1.jpg', 'souvenir2.jpg', 'souvenir3.jpg',
    'pic1.jpg', 'pic2.jpg', 'pic3.jpg'
  ];
  
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
  const imagePromises = [];
  const timestamp = new Date().getTime();
  
  // Tester les noms communs avec différentes extensions
  commonNames.forEach((baseName, index) => {
    const nameWithoutExt = baseName.split('.')[0];
    imageExtensions.forEach(ext => {
      const imagePath = `media/galerie/${nameWithoutExt}.${ext}?v=${timestamp}`;
      
      const img = new Image();
      img.src = imagePath;
      
      const promise = new Promise((resolve) => {
        img.onload = () => resolve({ 
          src: imagePath, 
          exists: true, 
          name: `${nameWithoutExt}.${ext}`,
          index: index 
        });
        img.onerror = () => resolve({ 
          src: imagePath, 
          exists: false, 
          name: `${nameWithoutExt}.${ext}`,
          index: index 
        });
      });
      
      imagePromises.push(promise);
    });
  });
  
  Promise.all(imagePromises).then(results => {
    const validImages = results
      .filter(result => result.exists)
      .sort((a, b) => a.index - b.index);
    
    if (validImages.length === 0) {
      showNoImagesMessage();
    } else {
      validImages.forEach((imageData, index) => {
        const img = document.createElement('img');
        img.src = imageData.src;
        img.alt = `Photo souvenir - ${imageData.name}`;
        img.loading = 'lazy';
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
        
        img.onload = () => {
          setTimeout(() => {
            img.style.opacity = '1';
          }, index * 50);
        };
        
        img.addEventListener('click', () => openLightbox(imageData.src));
        gallery.appendChild(img);
      });
      
      showNotification(`📸 ${validImages.length} photo(s) chargée(s) !`, 'info');
    }
  });
}

// Fonction pour afficher le message "aucune image"
function showNoImagesMessage() {
  const gallery = document.getElementById('gallery');
  if (!gallery) return;
  
  const noImagesMsg = document.createElement('div');
  noImagesMsg.style.cssText = `
    grid-column: 1 / -1;
    text-align: center;
    padding: 3rem;
    color: var(--text-primary);
    font-family: 'Baloo 2', sans-serif;
    font-size: 1.2rem;
  `;
  noImagesMsg.innerHTML = `
    <div style="font-size: 3rem; margin-bottom: 1rem;">📸</div>
    <p>Aucune photo pour le moment...</p>
    <p style="font-size: 0.9rem; opacity: 0.8;">Soyez les premiers à partager vos souvenirs !</p>
  `;
  gallery.appendChild(noImagesMsg);
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

// Bouton envoi photos (peut être cliqué plusieurs fois)
document.getElementById('open-photos-tally-btn').addEventListener('click', (e) => {
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
      window.Tally.openPopup('A7zMoz', {
        layout: 'modal',
        width: 700,
        autoClose: 2000,
        doNotShowAfterSubmit: false, // Permet de soumettre plusieurs fois
        onSubmit: (payload) => {
          try {
            successSound.play();
          } catch (error) {
            console.log('Son non disponible');
          }
          showNotification('📸 Photos envoyées ! Merci pour le partage !', 'success');
          
          // Recharger la galerie après un délai pour voir les nouvelles photos
          setTimeout(() => {
            loadGalleryImages();
            showNotification('🔄 Galerie actualisée !', 'info');
          }, 3000);
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

// Animation rainbow pour l'easter egg
const style = document.createElement('style');
style.textContent = `
  @keyframes rainbow {
    0% { filter: hue-rotate(0deg); }
    100% { filter: hue-rotate(360deg); }
  }
`;
document.head.appendChild(style);
