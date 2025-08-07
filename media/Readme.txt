ANNIVERSAIRE COMIC CON 2025 - GUIDE DE MODIFICATION
=====================================================

Ce site web est conçu pour votre anniversaire Comic Con. Voici comment le personnaliser :

📁 STRUCTURE DES FICHIERS
========================
- index.html : Page principale du site
- style.css : Styles et design du site
- script.js : Fonctionnalités interactives
- media/ : Dossier pour vos images et vidéos personnelles
- reservations.json : Fichier contenant les réservations (généré automatiquement)

🖼️ AJOUTER VOS IMAGES ET VIDÉOS
===============================

1. IMAGES POUR LA GALERIE :
   - Créez un dossier "media" à la racine du site
   - Ajoutez vos photos au format JPG, PNG, GIF ou WEBP
   - Les images apparaîtront automatiquement dans la galerie
   - Noms recommandés : photo1.jpg, photo2.jpg, etc.

2. PLAN DU LIEU :
   - Remplacez "media/plan.png" par votre propre plan
   - Format recommandé : PNG ou JPG
   - Taille optimale : 800x600 pixels

3. VIDÉOS (optionnel) :
   - Ajoutez vos vidéos dans le dossier "media"
   - Formats supportés : MP4, WEBM
   - Pour les intégrer, modifiez le fichier index.html

✏️ PERSONNALISER LE CONTENU
===========================

1. TITRE ET DESCRIPTION :
   - Ouvrez index.html
   - Modifiez la balise <title> ligne 5
   - Changez le titre principal dans la section hero (ligne ~45)

2. PROGRAMME :
   - Section "Programme de la journée" (ligne ~85)
   - Modifiez les horaires et activités selon vos besoins

3. INFORMATIONS PRATIQUES :
   - Section "Informations Pratiques" (ligne ~180)
   - Adaptez les horaires, lieu, restauration, etc.

4. ANIMATIONS :
   - Section "Animations & Activités" (ligne ~150)
   - Personnalisez les activités proposées

🎨 MODIFIER LES COULEURS
========================
Dans le fichier style.css, modifiez les variables CSS (lignes 2-20) :
- --primary-color : Couleur principale
- --secondary-color : Couleur secondaire
- --accent-color : Couleur d'accent

📧 GESTION DES RÉSERVATIONS
===========================

Le formulaire de newsletter collecte maintenant :
- Nom complet
- Email
- Nombre d'adultes
- Nombre d'enfants
- Message optionnel

Les données sont sauvegardées dans "reservations.json" au format :
{
  "reservations": [
    {
      "nom": "Nom Prénom",
      "email": "email@exemple.com",
      "adultes": 2,
      "enfants": 1,
      "message": "Message optionnel",
      "date": "2025-01-XX XX:XX:XX"
    }
  ]
}

Pour récupérer les données :
1. Téléchargez le fichier "reservations.json"
2. Importez-le dans Excel/Google Sheets
3. Utilisez-le pour votre publipostage

🚀 DÉMARRER LE SITE
===================

1. MÉTHODE SIMPLE :
   - Double-cliquez sur index.html
   - Le site s'ouvre dans votre navigateur

2. SERVEUR LOCAL (recommandé) :
   - Ouvrez un terminal dans le dossier du site
   - Tapez : python -m http.server 8000
   - Ouvrez http://localhost:8000 dans votre navigateur

📱 RESPONSIVE
=============
Le site s'adapte automatiquement aux mobiles et tablettes.

🎮 FONCTIONNALITÉS SPÉCIALES
============================
- Code Konami : ↑↑↓↓←→←→BA pour un easter egg
- Animations au scroll
- Lightbox pour les images
- Menu burger sur mobile

🔧 DÉPANNAGE
============

1. Les images ne s'affichent pas :
   - Vérifiez que le dossier "media" existe
   - Vérifiez les noms de fichiers (pas d'espaces, accents)

2. Le formulaire ne fonctionne pas :
   - Utilisez un serveur local (voir section "Démarrer le site")
   - Vérifiez que le fichier est accessible en écriture

3. Problèmes d'affichage :
   - Videz le cache du navigateur (Ctrl+F5)
   - Vérifiez la console développeur (F12)

📞 SUPPORT
==========
Pour toute question technique, consultez les commentaires dans les fichiers
ou recherchez des tutoriels sur HTML/CSS/JavaScript.

Bon anniversaire Comic Con ! 🎮🦸‍♂️🎉