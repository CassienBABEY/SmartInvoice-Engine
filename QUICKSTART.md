# 🚀 SmartInvoice Engine - Quickstart

## Pour les Utilisateurs Windows

### ⚡ Installation Rapide

```bash
# 1. Téléchargez l'installateur
SmartInvoice-Setup-0.2.0.exe

# 2. Double-cliquez et suivez l'assistant

# 3. Lancez depuis le raccourci bureau
```

**C'est tout ! L'application est prête à l'emploi.**

---

## Pour les Développeurs

### 🛠️ Setup Environnement (5 min)

```bash
# Cloner le repository
git clone https://github.com/yourusername/SmartInvoice-Engine.git
cd SmartInvoice-Engine

# Backend
make setup                    # Installer dépendances Python

# Frontend
cd frontend
npm install
cd ..

# LibreOffice (optionnel, pour PDF)
make install-libreoffice      # Linux/WSL uniquement
```

### 🏃 Lancer l'Application

**Option 1 : Tout en une commande**
```bash
make dev
# Backend: http://localhost:8000
# Frontend: http://localhost:5173
```

**Option 2 : Séparé (2 terminaux)**
```bash
# Terminal 1 - Backend
make api

# Terminal 2 - Frontend
cd frontend && npm run dev
```

### 📦 Créer l'Installateur Windows

```bash
# 1. Installer PyInstaller
pip install pyinstaller

# 2. Installer Inno Setup
# Télécharger depuis: https://jrsoftware.org/isdl.php

# 3. Build complet
make build-windows

# 4. Tester la distribution
make test-build

# 5. Créer l'installateur
iscc installer.iss

# Résultat: installer_output/SmartInvoice-Setup-0.2.0.exe
```

---

## 📝 Créer une Facture (3 étapes)

### Étape 1 : Créer un Template

Ouvrez Word et créez un document avec des placeholders :

```
FACTURE N°{{number_invoice}}

Date : {{date_invoice}}
Client : {{client_name}}

Total : {{number_total}} €
Logo : {{img_logo}}
```

**Syntaxe :**
- `{{nom}}` → Texte
- `{{date_xxx}}` → Date (DD/MM/YYYY)
- `{{number_xxx}}` → Nombre (avec option €)
- `{{img_xxx}}` → Image

Sauvegardez : `ma_facture.docx`

### Étape 2 : Uploader le Template

1. Ouvrez SmartInvoice
2. Page **TEMPLATES**
3. Cliquez "Nouveau template"
4. Sélectionnez `ma_facture.docx`

### Étape 3 : Générer une Facture

1. Page **GENERATE**
2. Sélectionnez votre template
3. Remplissez le formulaire
4. Cliquez "Générer"
5. Preview + Téléchargement (DOCX + PDF)

**Astuce** : Cliquez sur le cadenas 🔒 pour mémoriser les valeurs récurrentes !

---

## 🔧 Commandes Utiles

### Développement
```bash
make dev          # Lancer backend + frontend
make api          # Backend uniquement
make frontend     # Frontend uniquement
make clean        # Nettoyer cache Python
make clean-data   # Nettoyer données générées
```

### Build
```bash
make build-icon       # Créer logo.ico
make build-windows    # Build complet
make test-build       # Tester la distribution
```

### Code Quality
```bash
make format       # Black formatter
make lint         # Flake8 + Ruff
make test         # Pytest (à venir)
```

---

## 📚 Documentation Complète

- **Utilisateurs** : [GUIDE_UTILISATEUR.md](GUIDE_UTILISATEUR.md)
- **Développeurs** : [BUILD_INSTRUCTIONS.md](BUILD_INSTRUCTIONS.md)
- **Architecture** : [ARCHITECTURE.md](ARCHITECTURE.md)
- **Changelog** : [CHANGELOG.md](CHANGELOG.md)

---

## 💡 Aide Rapide

### L'app ne démarre pas ?
```bash
# Vérifier les ports
netstat -ano | findstr :8000

# Relancer proprement
# 1. Fermer toutes les fenêtres SmartInvoice
# 2. Relancer depuis le raccourci
```

### Preview PDF ne fonctionne pas ?
```bash
# Installer LibreOffice
# Windows: https://www.libreoffice.org/download/download/
# Linux/WSL: make install-libreoffice
```

### Build échoue ?
```bash
# 1. Nettoyer tout
make clean-all

# 2. Réinstaller dépendances
make setup
cd frontend && npm install

# 3. Retry
make build-windows
```

---

## 🎯 Structure Minimale

```
SmartInvoice-Engine/
├── app/              # Backend Python
├── frontend/         # Frontend React
├── templates/        # Vos templates DOCX
├── invoices/         # Factures générées
├── assets/images/    # Images pour factures
└── Makefile          # Commandes pratiques
```

---

## 📞 Support

- **Issues** : [GitHub Issues](https://github.com/yourusername/SmartInvoice-Engine/issues)
- **Email** : support@smartinvoice.com
- **Docs** : Voir fichiers `*.md` dans le repo

---

**Bon développement ! 🚀**

