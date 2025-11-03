# 📋 Changelog - SmartInvoice Engine

## Version 0.2.0 (Novembre 2025)

### 🏗️ RESTRUCTURATION COMPLÈTE

#### Backend
- ✅ **Structure corrigée** : Tout dans `app/` (cohérent)
  ```
  Avant: backend-api/ (séparé de app/)
  Après: app/
         ├── core/
         ├── services/
         ├── endpoints/
         ├── router.py
         └── main.py
  ```

- ✅ **Séparation endpoint/service** : Logique métier uniquement dans services
- ✅ **Endpoints modulaires** :
  - `app/endpoints/templates.py` : Templates & génération
  - `app/endpoints/images.py` : Gestion images
  - `app/endpoints/invoices.py` : Gestion factures
- ✅ **Router central** : `app/router.py` charge tous les endpoints
- ✅ **Main simplifié** : `app/main.py` (50 lignes)

#### Frontend
- ✅ **Preview DOCX native** : Librairie `docx-preview` (100% JavaScript)
- ✅ **Affichage dans le modal** : Preview en temps réel du fichier Word
- ✅ **Spinner de chargement** : Feedback visuel pendant le chargement
- ✅ **Gestion d'erreurs** : Fallback si la preview échoue
- ✅ **Design moderne** : Animation spinner + layout propre

#### Dépendances
- ❌ **Supprimé LibreOffice** : Trop lourd (500MB), bugs
- ✅ **Ajouté docx-preview** : Léger (100KB), pure JavaScript
- ✅ **Aucune dépendance backend** : Tout côté frontend

---

## 🎯 Fonctionnalités

### Ce qui fonctionne maintenant

1. **Preview DOCX** ✅
   - Affichage natif dans le navigateur
   - Pas de conversion nécessaire
   - Formatting préservé (styles, tableaux, images)

2. **Téléchargement** ✅
   - Bouton "⬇️ Télécharger"
   - Fichier Word original
   - Pas de perte de qualité

3. **Métadonnées** ✅
   - Taille du fichier
   - Date de création
   - Date de modification

---

## 📦 Dépendances

### Backend (Python)
```toml
python = "^3.10,<3.11"
python-docx = "^1.1.0"
pydantic = "^2.5.0"
pillow = "^10.1.0"
fastapi = "^0.109.0"
uvicorn = "^0.27.0"
python-multipart = "^0.0.20"
```

### Frontend (JavaScript)
```json
{
  "dependencies": {
    "react": "^18.3.1",
    "docx-preview": "^0.3.3"  // Nouveau
  }
}
```

---

## 🚀 Utilisation

### 1. Lancer le backend
```bash
cd /home/cassienbabey/SmartInvoice-Engine
make api
```

### 2. Lancer le frontend
```bash
cd frontend
npm run dev
```

### 3. Workflow complet
1. Génère une facture (ou utilise une existante)
2. **Clique sur une facture** dans la liste
3. **Modal s'ouvre** avec :
   - ⏳ Spinner de chargement (2-3 secondes)
   - 📄 **Preview DOCX** (affichage natif)
   - 📊 Métadonnées (taille, dates)
   - ⬇️ Bouton télécharger
4. **Preview s'affiche** : Document Word complet avec formatting
5. **Clique sur "Télécharger"** si besoin

---

## 🔧 Différences techniques

### Avant (v0.1)
```
Backend: backend-api/ (séparé)
Preview: Aucune
Download: Word uniquement
Dépendances: Aucune externe
```

### Après (v0.2)
```
Backend: app/ (unifié)
Preview: DOCX natif (docx-preview)
Download: Word uniquement
Dépendances: docx-preview (frontend)
```

---

## ❌ Pourquoi pas PDF ?

### Options évaluées

| Solution | Problème | Verdict |
|----------|----------|---------|
| **LibreOffice** | 500MB, installation complexe, bugs | ❌ Trop lourd |
| **Aspose** | ~$1000/an, licence commerciale | ❌ Payant |
| **weasyprint** | Nécessite HTML intermédiaire | ⚠️ Complexe |
| **docx2pdf** | Windows uniquement | ❌ Limité |
| **pypandoc** | Nécessite Pandoc (grosse dépendance) | ❌ Lourd |

### Solution adoptée : Preview DOCX native

**Avantages** :
- ✅ 100% gratuit
- ✅ Léger (100KB vs 500MB)
- ✅ Pas de conversion
- ✅ Pas de perte de qualité
- ✅ Fonctionne partout (navigateur)
- ✅ Formatting préservé

**Inconvénient** :
- ⚠️ Nécessite le navigateur (pas d'export PDF direct)

**Si besoin de PDF plus tard** :
- Option 1 : Générer directement en PDF (reportlab, weasyprint)
- Option 2 : Service cloud (Google Docs API, Cloudmersive)
- Option 3 : Screenshot première page (ImageMagick)

---

## 📂 Structure finale

```
SmartInvoice-Engine/
├── app/                      # Backend unifié
│   ├── core/                # Config + models
│   │   ├── config.py
│   │   └── models.py
│   ├── services/            # Logique métier
│   │   ├── template_service.py
│   │   ├── form_service.py
│   │   └── generator_service.py
│   ├── utils/               # Utilities
│   │   └── docx_parser.py
│   ├── endpoints/           # API endpoints
│   │   ├── templates.py
│   │   ├── images.py
│   │   └── invoices.py
│   ├── router.py            # Router central
│   └── main.py              # Point d'entrée
│
├── frontend/                # Interface React
│   └── src/
│       ├── components/
│       │   ├── InvoiceModal.tsx  # Preview DOCX
│       │   ├── InvoicesList.tsx
│       │   └── TemplateForm.tsx
│       └── App.tsx
│
├── templates/               # Templates DOCX
├── forms/                   # Définitions JSON
├── invoices/                # Factures générées
├── assets/images/           # Images pour factures
│
├── Makefile                 # Commandes utiles
├── pyproject.toml           # Dépendances Python
└── ARCHITECTURE.md          # Documentation
```

---

## 🎓 Principes appliqués

### 1. Minimalisme
- Pas de sur-ingénierie
- Dépendances minimales
- Code simple et clair

### 2. Séparation des responsabilités
- **Endpoints** : Validation + appel service
- **Services** : Logique métier
- **Utils** : Fonctions réutilisables

### 3. Cohérence
- Tout dans `app/` (pas de dossier séparé)
- Nommage uniforme
- Structure logique

---

## 📝 Commandes

```bash
# Backend
make api          # Lance l'API
make clean        # Nettoie cache Python
make clean-data   # Nettoie données générées
make lint         # Vérifie le code
make format       # Formate le code

# Frontend
cd frontend
npm run dev       # Lance le dev server
npm run build     # Build production
```

---

## 🐛 Bugs corrigés

1. ✅ **Preview blanche** : Remplacé iframe PDF par docx-preview
2. ✅ **Download automatique** : Iframe téléchargeait au lieu d'afficher
3. ✅ **Structure incohérente** : backend-api/ séparé de app/
4. ✅ **Dépendance lourde** : Supprimé LibreOffice (500MB)

---

---

## Version 0.2.1 (Décembre 2025)

### 🎨 UI/UX Améliorations

#### Interface Utilisateur
- ✅ **Redesign complet** : Navigation multi-pages avec sidebar
- ✅ **5 pages** : HOME, GENERATE, TEMPLATES, FACTURES, PARAMS
- ✅ **Sidebar moderne** : Logo, version, navigation avec icônes
- ✅ **Design minimaliste** : Noir, blanc, gris (compatible dark mode)
- ✅ **Breadcrumb navigation** : Fil d'Ariane avec petites icônes
- ✅ **Transitions fluides** : Animations CSS subtiles
- ✅ **Ombres modernes** : Profondeur et hiérarchie visuelle

#### Page HOME
- ✅ **Hero section** : Grande carte centrée "Générer une facture"
- ✅ **Listes horizontales** : Templates et factures récents
- ✅ **Navigation rapide** : Clic sur template → GENERATE pré-rempli

#### Page GENERATE
- ✅ **Workflow 3 étapes** : Template → Formulaire → Preview
- ✅ **Barre de progression** : Indicateur visuel de l'étape actuelle
- ✅ **Formulaire hiérarchique** : Sections pliables par type de champ
- ✅ **Upload intégré** : Images uploadables directement depuis le formulaire
- ✅ **Mémorisation des valeurs** : Icône cadenas 🔒 pour sauvegarder par template
- ✅ **Validation dates** : Format DD/MM/YYYY avec auto-insertion des `/`
- ✅ **Validation complète** : Jours/mois valides, années bissextiles

#### Page TEMPLATES
- ✅ **Cards visuelles** : Templates affichés en grandes cartes
- ✅ **Upload facile** : Carte "Nouveau template" avec drag & drop
- ✅ **Actions rapides** : Icônes Utiliser et Supprimer
- ✅ **Navigation fluide** : Clic sur "Utiliser" → GENERATE

#### Page FACTURES
- ✅ **Liste complète** : Toutes les factures avec métadonnées
- ✅ **Preview modal** : DOCX + PDF dans une popup
- ✅ **Double téléchargement** : Boutons DOCX et PDF séparés
- ✅ **Refresh automatique** : Liste à jour après génération
- ✅ **Icône de refresh** : Bouton avec icône au lieu de texte

#### Page PARAMS
- ✅ **Statut API** : Indicateur vert 🟢 quand connecté
- ✅ **Informations système** : Version, statistiques

### 🔧 Fonctionnalités Backend

#### Gestion des Placeholders
- ✅ **Suppression automatique** : Placeholders vides retirés des factures
- ✅ **Plus de `{{}}`** : Champs non remplis disparaissent complètement
- ✅ **Logique intelligente** : `replace_placeholders()` optimisé

#### Service Defaults
- ✅ **Nouveau service** : `defaults_service.py`
- ✅ **Endpoints dédiés** : `/defaults/{template_name}`
- ✅ **Persistance JSON** : `{template}_defaults.json`
- ✅ **Chargement auto** : Valeurs pré-remplies au chargement

#### Conversion PDF
- ✅ **LibreOffice headless** : Conversion haute-fidélité
- ✅ **Cache PDF** : `invoices_pdf/` pour performances
- ✅ **Vérification timestamps** : Reconversion uniquement si nécessaire

### 📦 Build & Packaging

#### PyInstaller
- ✅ **Fichier spec** : `build.spec` configuré
- ✅ **Hidden imports** : Tous les modules nécessaires
- ✅ **Icône Windows** : `logo.ico` multi-résolutions
- ✅ **Données incluses** : Templates, assets, frontend

#### Script de Build
- ✅ **`build_windows.py`** : Build automatisé complet
- ✅ **Nettoyage auto** : Suppression des builds précédents
- ✅ **Build frontend** : `npm install` + `npm run build`
- ✅ **Build backend** : PyInstaller avec spec
- ✅ **Copie frontend** : Frontend buildé dans dist/
- ✅ **Création launcher** : `SmartInvoice.bat`
- ✅ **Dossiers de données** : forms/, invoices/, invoices_pdf/

#### Inno Setup
- ✅ **`installer.iss`** : Configuration complète
- ✅ **Interface moderne** : WizardStyle=modern
- ✅ **Multi-langues** : Français + Anglais
- ✅ **Permissions correctes** : users-modify pour dossiers de données
- ✅ **Raccourcis** : Bureau + Menu démarrer
- ✅ **Désinstallation propre** : Suppression complète
- ✅ **Messages personnalisés** : Bienvenue, post-install
- ✅ **Détection processus** : Fermeture auto si en cours d'exécution

#### Makefile
- ✅ **`make build-icon`** : Création logo.ico
- ✅ **`make build-windows`** : Build complet
- ✅ **`make build-installer`** : Instructions Inno Setup
- ✅ **`make test-build`** : Vérification de la distribution
- ✅ **`make dev`** : Lancement backend + frontend simultané

### 📚 Documentation

#### Guides Utilisateur
- ✅ **`GUIDE_UTILISATEUR.md`** : Guide complet en français
  - Installation et premier lancement
  - Création de templates (syntaxe détaillée)
  - Workflow de génération
  - Gestion des images
  - Dépannage (troubleshooting)
  - Astuces et raccourcis

#### Build Instructions
- ✅ **`BUILD_INSTRUCTIONS.md`** : Instructions développeur
  - Prérequis détaillés
  - Étapes de build
  - Structure de distribution
  - Utilisation installateur
  - Build manuel
  - Personnalisation
  - Dépannage technique

#### README
- ✅ **Badges** : Version, Python, License
- ✅ **Table des matières** : Navigation claire
- ✅ **Installation multi-méthodes** : Installateur + Portable
- ✅ **Exemples de code** : Création de templates
- ✅ **Architecture technique** : Détails stack
- ✅ **Commandes de dev** : Makefile complet

### 🧹 Nettoyage

#### Fichiers Supprimés
- ✅ `debug_docx.py` - Script de debug obsolète
- ✅ `example.py` - Fichier d'exemple inutilisé
- ✅ `list_fields.py` - Utilitaire obsolète
- ✅ `test_ceramed.py` - Test spécifique supprimé
- ✅ `TEMPLATE_CERAMED.docx` - Template de test
- ✅ `frontend/src/App-old.tsx` - Ancienne version
- ✅ `frontend/src/App-new.tsx` - Version temporaire
- ✅ `REFACTORING.md` - Docs obsolètes
- ✅ `UI_IMPLEMENTATION.md` - Docs obsolètes
- ✅ `UI_IMPROVEMENTS.md` - Docs obsolètes
- ✅ `UI_REDESIGN.md` - Docs obsolètes

### 🎯 Améliorations Qualité Code

#### Backend
- ✅ **Structure modulaire** : app/{core,services,endpoints,utils}
- ✅ **Services séparés** : Un fichier par service
- ✅ **Type hints** : Toutes les fonctions typées
- ✅ **Docstrings** : Documentation PEP 257
- ✅ **Ligne 88 chars max** : Respect flake8/black

#### Frontend
- ✅ **Composants réutilisables** : Layout, Breadcrumb, Workflow
- ✅ **TypeScript strict** : Interfaces pour tous les props
- ✅ **CSS modulaire** : Un fichier CSS par composant
- ✅ **Variables CSS** : theme.css centralisé
- ✅ **Pas de duplication** : Code DRY

---

## 🚧 Prochaines étapes (optionnel)

### Court terme
- [ ] Tests unitaires (pytest pour backend, Jest pour frontend)
- [ ] CI/CD avec GitHub Actions
- [ ] Signature de l'exécutable (certificat de code)

### Moyen terme
- [ ] Base de données SQLite (historique)
- [ ] Export PDF direct (sans LibreOffice)
- [ ] Templates prédéfinis (bibliothèque)

### Long terme
- [ ] Authentification multi-utilisateurs
- [ ] Cloud sync (Dropbox, Google Drive)
- [ ] Version web (SaaS)

---

## ✅ Résumé

**Avant (v0.1)** :
- ❌ Backend monolithique (533 lignes)
- ❌ Pas de preview
- ❌ Structure incohérente
- ❌ Dépendance LibreOffice

**Après (v0.2)** :
- ✅ Backend modulaire (50 lignes main)
- ✅ Preview DOCX native
- ✅ Structure cohérente (`app/`)
- ✅ Aucune dépendance lourde
- ✅ Code minimaliste et maintenable

---

**Version** : 0.2.0  
**Date** : Novembre 2025  
**Auteur** : SmartInvoice Engine Team

