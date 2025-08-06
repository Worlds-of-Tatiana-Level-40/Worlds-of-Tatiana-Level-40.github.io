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

// Effet de cursor glow
const cursorGlow = document.querySelector('.cursor-glow');
if (cursorGlow) {
  document.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
    cursorGlow.style.opacity = '1';
  });

  document.addEventListener('mouseleave', () => {
    cursorGlow.style.opacity = '0';
  });
}

// Gestion du formulaire de newsletter
const newsletterForm = document.getElementById('newsletter-form');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Récupérer les données du formulaire
    const formData = {
      nom: this.querySelector('input[name="nom"]').value,
      email: this.querySelector('input[name="email"]').value,
      adultes: parseInt(this.querySelector('input[name="adultes"]').value) || 0,
      enfants: parseInt(this.querySelector('input[name="enfants"]').value) || 0,
      message: this.querySelector('textarea[name="message"]').value,
      date: new Date().toLocaleString('fr-FR')
    };
    
    // Animation du bouton
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Envoi en cours...';
    submitBtn.disabled = true;
    
    // Sauvegarder les données
    saveReservation(formData);
    
    // Simulation d'envoi
    setTimeout(() => {
      submitBtn.textContent = 'Confirmé ! 🎉';
      submitBtn.style.background = 'var(--success-color)';
      
      // Afficher un message de succès
      showNotification(`Merci ${formData.nom} ! Réservation confirmée pour ${formData.adultes + formData.enfants} personne(s) 🚀`, 'success');
      
      // Reset après 3 secondes
      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        submitBtn.style.background = '';
        this.reset();
      }, 3000);
    }, 1500);
  });
}

// Fonction pour sauvegarder les réservations
function saveReservation(data) {
  try {
    // Récupérer les réservations existantes
    let reservations = JSON.parse(localStorage.getItem('reservations') || '{"reservations": []}');
    
    // Ajouter la nouvelle réservation
    reservations.reservations.push(data);
    
    // Sauvegarder dans localStorage
    localStorage.setItem('reservations', JSON.stringify(reservations));
    
    // Afficher dans la console pour debug
    console.log('Nouvelle réservation:', data);
    console.log('Total réservations:', reservations.reservations.length);
    
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error);
    showNotification('Erreur lors de la sauvegarde. Réservation notée localement.', 'warning');
  }
}

// Fonction pour afficher les réservations (pour admin)
function showReservations() {
  // Vérifier l'authentification admin
  if (!checkAdminAuth()) {
    return;
  }
  
  const reservations = JSON.parse(localStorage.getItem('reservations') || '{"reservations": []}');
  
  if (reservations.reservations.length === 0) {
    showNotification('Aucune réservation pour le moment.', 'info');
    return;
  }
  
  // Créer un tableau HTML
  let tableHTML = `
    <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                background: var(--bg-tertiary); padding: 2rem; border-radius: var(--border-radius);
                max-width: 90vw; max-height: 80vh; overflow: auto; z-index: 10001;
                box-shadow: var(--shadow-xl);">
      <h3 style="margin-bottom: 1rem; color: var(--primary-color);">
        Réservations (${reservations.reservations.length})
        <button onclick="this.parentElement.parentElement.remove()" 
                style="float: right; background: var(--error-color); color: white; 
                       border: none; padding: 0.5rem; border-radius: 50%; cursor: pointer;">×</button>
      </h3>
      <table style="width: 100%; border-collapse: collapse; color: var(--text-primary);">
        <thead>
          <tr style="background: var(--bg-secondary);">
            <th style="padding: 0.5rem; border: 1px solid var(--text-muted);">Nom</th>
            <th style="padding: 0.5rem; border: 1px solid var(--text-muted);">Email</th>
            <th style="padding: 0.5rem; border: 1px solid var(--text-muted);">Adultes</th>
            <th style="padding: 0.5rem; border: 1px solid var(--text-muted);">Enfants</th>
            <th style="padding: 0.5rem; border: 1px solid var(--text-muted);">Total</th>
            <th style="padding: 0.5rem; border: 1px solid var(--text-muted);">Date</th>
            <th style="padding: 0.5rem; border: 1px solid var(--text-muted);">Actions</th>
          </tr>
        </thead>
        <tbody>
  `;
  
  reservations.reservations.forEach((res, index) => {
    tableHTML += `
      <tr>
        <td style="padding: 0.5rem; border: 1px solid var(--text-muted);">${res.nom}</td>
        <td style="padding: 0.5rem; border: 1px solid var(--text-muted);">${res.email}</td>
        <td style="padding: 0.5rem; border: 1px solid var(--text-muted); text-align: center;">${res.adultes}</td>
        <td style="padding: 0.5rem; border: 1px solid var(--text-muted); text-align: center;">${res.enfants}</td>
        <td style="padding: 0.5rem; border: 1px solid var(--text-muted); text-align: center; font-weight: bold;">${res.adultes + res.enfants}</td>
        <td style="padding: 0.5rem; border: 1px solid var(--text-muted); font-size: 0.8rem;">${res.date}</td>
        <td style="padding: 0.5rem; border: 1px solid var(--text-muted); text-align: center;">
          <button onclick="deleteReservation(${index})" 
                  style="background: var(--error-color); color: white; border: none; 
                         padding: 0.25rem 0.5rem; border-radius: 4px; cursor: pointer; font-size: 0.8rem;">
            🗑️
          </button>
        </td>
      </tr>
    `;
  });
  
  tableHTML += `
        </tbody>
      </table>
      <div style="margin-top: 1rem; padding: 1rem; background: var(--bg-secondary); border-radius: var(--border-radius);">
        <h4 style="color: var(--accent-color); margin-bottom: 0.5rem;">📊 Statistiques</h4>
        <p style="margin: 0.25rem 0;">Total personnes: <strong>${reservations.reservations.reduce((total, res) => total + res.adultes + res.enfants, 0)}</strong></p>
        <p style="margin: 0.25rem 0;">Adultes: <strong>${reservations.reservations.reduce((total, res) => total + res.adultes, 0)}</strong></p>
        <p style="margin: 0.25rem 0;">Enfants: <strong>${reservations.reservations.reduce((total, res) => total + res.enfants, 0)}</strong></p>
      </div>
      <div style="margin-top: 1rem; text-align: center;">
        <button onclick="document.getElementById('download-reservations').click()" 
                style="background: var(--primary-color); color: white; border: none; 
                       padding: 0.75rem 1.5rem; border-radius: var(--border-radius); cursor: pointer;">
          📥 Télécharger JSON
        </button>
        <button onclick="exportToCSV()" 
                style="background: var(--success-color); color: white; border: none; 
                       padding: 0.75rem 1.5rem; border-radius: var(--border-radius); cursor: pointer; margin-left: 1rem;">
          📊 Télécharger CSV
        </button>
        <button onclick="clearAllReservations()" 
                style="background: var(--error-color); color: white; border: none; 
                       padding: 0.75rem 1.5rem; border-radius: var(--border-radius); cursor: pointer; margin-left: 1rem;">
          🗑️ Vider tout
        </button>
        <button onclick="logoutAdmin()" 
                style="background: var(--warning-color); color: white; border: none; 
                       padding: 0.75rem 1.5rem; border-radius: var(--border-radius); cursor: pointer; margin-left: 1rem;">
          🚪 Déconnexion
        </button>
      </div>
    </div>
  `;
  
  const tableDiv = document.createElement('div');
  tableDiv.innerHTML = tableHTML;
  document.body.appendChild(tableDiv);
  
  // Créer le lien de téléchargement pour le bouton
  updateDownloadLink();
}

// Système d'authentification admin
function checkAdminAuth() {
  const adminPassword = '29Juillet'; // Changez ce mot de passe !
  const sessionKey = 'admin_session';
  const sessionDuration = 30 * 60 * 1000; // 30 minutes
  
  // Vérifier si une session existe et est valide
  const session = localStorage.getItem(sessionKey);
  if (session) {
    const sessionData = JSON.parse(session);
    if (Date.now() - sessionData.timestamp < sessionDuration) {
      return true; // Session valide
    } else {
      localStorage.removeItem(sessionKey); // Session expirée
    }
  }
  
  // Demander le mot de passe
  const inputPassword = prompt('🔒 Mot de passe administrateur requis:');
  
  if (inputPassword === adminPassword) {
    // Créer une session
    localStorage.setItem(sessionKey, JSON.stringify({
      timestamp: Date.now(),
      authenticated: true
    }));
    showNotification('🔓 Accès administrateur accordé (30 min)', 'success');
    return true;
  } else if (inputPassword !== null) {
    showNotification('❌ Mot de passe incorrect', 'error');
  }
  
  return false;
}

// Fonction pour déconnexion admin
function logoutAdmin() {
  localStorage.removeItem('admin_session');
  showNotification('🚪 Déconnexion administrateur', 'info');
  // Fermer la modal admin si ouverte
  const adminModal = document.querySelector('[style*="z-index: 10001"]');
  if (adminModal) {
    adminModal.remove();
  }
}

// Fonction pour supprimer une réservation
function deleteReservation(index) {
  if (!checkAdminAuth()) return;
  
  const reservations = JSON.parse(localStorage.getItem('reservations') || '{"reservations": []}');
  const reservation = reservations.reservations[index];
  
  if (confirm(`Supprimer la réservation de ${reservation.nom} (${reservation.adultes + reservation.enfants} personne(s)) ?`)) {
    reservations.reservations.splice(index, 1);
    localStorage.setItem('reservations', JSON.stringify(reservations));
    showNotification(`Réservation de ${reservation.nom} supprimée`, 'success');
    
    // Fermer et rouvrir la modal pour actualiser
    document.querySelector('[style*="z-index: 10001"]').remove();
    setTimeout(() => showReservations(), 100);
  }
}

// Fonction pour mettre à jour le lien de téléchargement
function updateDownloadLink() {
  const reservations = JSON.parse(localStorage.getItem('reservations') || '{"reservations": []}');
  const dataStr = JSON.stringify(reservations, null, 2);
  const dataBlob = new Blob([dataStr], {type: 'application/json'});
  
  let downloadLink = document.getElementById('download-reservations');
  if (!downloadLink) {
    downloadLink = document.createElement('a');
    downloadLink.id = 'download-reservations';
    downloadLink.style.display = 'none';
    document.body.appendChild(downloadLink);
  }
  
  downloadLink.href = URL.createObjectURL(dataBlob);
  downloadLink.download = `reservations_${new Date().toISOString().split('T')[0]}.json`;
}

// Fonction pour vider toutes les réservations
function clearAllReservations() {
  if (!checkAdminAuth()) return;
  
  if (confirm('Êtes-vous sûr de vouloir supprimer TOUTES les réservations ? Cette action est irréversible.')) {
    localStorage.removeItem('reservations');
    showNotification('Toutes les réservations ont été supprimées.', 'success');
    // Fermer la modal admin
    const adminModal = document.querySelector('[style*="z-index: 10001"]');
    if (adminModal) {
      adminModal.remove();
    }
  }
}

// Fonction pour exporter en CSV
function exportToCSV() {
  if (!checkAdminAuth()) return;
  
  const reservations = JSON.parse(localStorage.getItem('reservations') || '{"reservations": []}');
  
  if (reservations.reservations.length === 0) {
    showNotification('Aucune réservation à exporter.', 'warning');
    return;
  }
  
  // Créer le contenu CSV
  let csvContent = 'Nom,Email,Adultes,Enfants,Total,Message,Date\n';
  
  reservations.reservations.forEach(res => {
    const message = (res.message || '').replace(/"/g, '""'); // Échapper les guillemets
    csvContent += `"${res.nom}","${res.email}",${res.adultes},${res.enfants},${res.adultes + res.enfants},"${message}","${res.date}"\n`;
  });
  
  // Créer et télécharger le fichier CSV
  const csvBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const csvUrl = URL.createObjectURL(csvBlob);
  
  const downloadLink = document.createElement('a');
  downloadLink.href = csvUrl;
  downloadLink.download = `reservations_${new Date().toISOString().split('T')[0]}.csv`;
  downloadLink.click();
  
  showNotification('Fichier CSV téléchargé ! 📊', 'success');
}

// Fonction pour afficher le statut des réservations
function showReservationStatus() {
  if (!checkAdminAuth()) return;
  
  const reservations = JSON.parse(localStorage.getItem('reservations') || '{"reservations": []}');
  const totalPersonnes = reservations.reservations.reduce((total, res) => total + res.adultes + res.enfants, 0);
  const totalAdultes = reservations.reservations.reduce((total, res) => total + res.adultes, 0);
  const totalEnfants = reservations.reservations.reduce((total, res) => total + res.enfants, 0);
  
  showNotification(`📊 ${reservations.reservations.length} réservation(s) | ${totalPersonnes} personnes (${totalAdultes} adultes, ${totalEnfants} enfants)`, 'info');
}

// Raccourci clavier pour afficher les réservations (Ctrl+R+E+S)
let adminKeys = [];
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey) {
    adminKeys.push(e.key.toLowerCase());
    
    // Garder seulement les 3 dernières touches
    if (adminKeys.length > 3) {
      adminKeys.shift();
    }
    
    // Vérifier la séquence RES
    if (adminKeys.length === 3 && 
        adminKeys[0] === 'r' && adminKeys[1] === 'e' && adminKeys[2] === 's') {
      showReservations();
      adminKeys = [];
    }
    
    // Vérifier la séquence STA (pour status)
    if (adminKeys.length === 3 && 
        adminKeys[0] === 's' && adminKeys[1] === 't' && adminKeys[2] === 'a') {
      showReservationStatus();
      adminKeys = [];
    }
  } else {
    adminKeys = [];
  }
});

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