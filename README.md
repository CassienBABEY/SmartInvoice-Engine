# 📄 SmartInvoice Engine

**Application de bureau Windows pour la génération de factures professionnelles depuis des templates DOCX.**

![Version](https://img.shields.io/badge/version-0.2.0-blue)
![Python](https://img.shields.io/badge/python-3.10%2B-green)
![License](https://img.shields.io/badge/license-MIT-orange)

## ✨ Fonctionnalités

- ✅ **Génération de factures** depuis templates DOCX personnalisables
- ✅ **Interface moderne** avec navigation par pages (React + TypeScript)
- ✅ **Gestion des types de champs** : texte, date (DD/MM/YYYY), nombre (avec devise), image
- ✅ **Preview PDF** avec conversion haute-fidélité (LibreOffice)
- ✅ **Mémorisation des valeurs** par template pour gain de temps
- ✅ **Gestion des templates** : upload, suppression, liste
- ✅ **Historique des factures** avec preview et téléchargement
- ✅ **Design minimaliste** (noir, blanc, gris) - compatible dark mode

## 📦 Installation (Utilisateurs)

### Méthode 1 : Installateur Windows (Recommandé)

1. Télécharger `SmartInvoice-Setup-0.2.0.exe`
2. Double-cliquer et suivre les étapes
3. Lancer depuis le menu démarrer ou le raccourci bureau

### Méthode 2 : Portable

1. Extraire `SmartInvoice-Portable.zip`
2. Exécuter `SmartInvoice.bat`
3. L'application s'ouvre dans le navigateur

## 🛠️ Installation (Développeurs)

### Prérequis

- Python 3.10+
- Node.js 18+ et npm
- Poetry (gestionnaire de dépendances Python)
- LibreOffice (pour la conversion PDF)

### Setup

```bash
# Cloner le repository
git clone https://github.com/yourusername/SmartInvoice-Engine.git
cd SmartInvoice-Engine

# Installer les dépendances backend
make setup

# Installer les dépendances frontend
cd frontend && npm install && cd ..

# Installer LibreOffice (Linux/WSL)
make install-libreoffice
```

## 🚀 Usage

### Mode développement

```bash
# Lancer backend + frontend simultanément
make dev

# OU lancer séparément :

# Backend uniquement (http://localhost:8000)
make api

# Frontend uniquement (http://localhost:5173)
make frontend
```

### Création de templates

Créez un fichier DOCX avec des placeholders entre accolades :

| Placeholder | Type | Description |
|------------|------|-------------|
| `{{name}}` | Texte | Champ texte simple |
| `{{date_invoice}}` | Date | Format DD/MM/YYYY avec validation |
| `{{number_amount}}` | Nombre | Champ numérique (option devise) |
| `{{img_logo}}` ou `{{image_logo}}` | Image | Insertion d'image depuis `assets/images/` |

**Exemple de template :**

```
Facture n°{{number_invoice}}
Date : {{date_invoice}}

Client : {{name}}
Montant : {{number_total}} €

Logo : {{img_logo}}
```

### Workflow dans l'application

1. **Page GENERATE** :
   - Sélectionner un template
   - Remplir le formulaire
   - Preview et téléchargement (DOCX + PDF)

2. **Page TEMPLATES** :
   - Liste des templates existants
   - Upload de nouveaux templates
   - Suppression

3. **Page FACTURES** :
   - Historique des factures générées
   - Preview dans une modal
   - Téléchargement DOCX/PDF

4. **Page PARAMS** :
   - Statut de l'API
   - Version de l'application
   - Paramètres futurs

## 🏗️ Build de l'Application Windows

### Créer l'exécutable

```bash
# Créer l'icône Windows
make build-icon

# Build complet (frontend + backend)
make build-windows

# Créer l'installateur (nécessite Inno Setup)
make build-installer
```

**Résultat :** `installer_output/SmartInvoice-Setup-0.2.0.exe`

Voir [BUILD_INSTRUCTIONS.md](BUILD_INSTRUCTIONS.md) pour les détails.

## 📁 Structure du Projet

```
SmartInvoice-Engine/
├── app/                      # Backend FastAPI
│   ├── core/                 # Config, modèles
│   ├── endpoints/            # Routes API
│   ├── services/             # Logique métier
│   └── utils/                # Utilitaires (DOCX, images)
├── frontend/                 # Frontend React + TypeScript
│   ├── src/
│   │   ├── components/       # Composants réutilisables
│   │   ├── pages/            # Pages de l'app
│   │   └── styles/           # CSS (theme.css)
│   └── public/
├── templates/                # Templates DOCX
├── forms/                    # Définitions de formulaires (JSON)
├── invoices/                 # Factures générées (DOCX)
├── invoices_pdf/             # Cache PDF
├── assets/                   # Ressources
│   └── images/               # Images pour insertion
├── build.spec                # Config PyInstaller
├── installer.iss             # Config Inno Setup
├── build_windows.py          # Script de build
└── Makefile                  # Commandes de dev
```

## 🧹 Développement

```bash
# Formatter le code Python
make format

# Vérifier le linting
make lint

# Lancer les tests
make test

# Nettoyer les fichiers temporaires
make clean

# Nettoyer les données (templates, forms, invoices)
make clean-data

# Nettoyage complet (+ node_modules, dist)
make clean-all
```

## 🎨 Architecture Technique

### Backend
- **FastAPI** : API REST moderne et performante
- **Pydantic** : Validation des données
- **python-docx** : Manipulation de fichiers DOCX
- **LibreOffice** : Conversion DOCX → PDF haute-fidélité

### Frontend
- **React 18** + **TypeScript** : Interface utilisateur
- **Vite** : Build ultra-rapide
- **CSS Variables** : Theming cohérent

### Packaging
- **PyInstaller** : Conversion Python → .exe
- **Inno Setup** : Installateur Windows professionnel

## 📝 License

MIT License - voir [LICENSE](LICENSE)

## 🤝 Contribution

Les contributions sont les bienvenues ! Merci de :
1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 💬 Support

- **Issues GitHub** : [github.com/yourusername/SmartInvoice-Engine/issues](https://github.com/yourusername/SmartInvoice-Engine/issues)
- **Email** : support@smartinvoice.com
- **Documentation** : Voir [BUILD_INSTRUCTIONS.md](BUILD_INSTRUCTIONS.md)

---

**Développé avec ❤️ par l'équipe SmartInvoice**
