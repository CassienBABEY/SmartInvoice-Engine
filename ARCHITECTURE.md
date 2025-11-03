# 🏗️ Architecture SmartInvoice Engine

## 📂 Structure du projet

```
SmartInvoice-Engine/
├── app/                    # Core business logic
│   ├── core/              # Config + models
│   ├── services/          # Business logic
│   └── utils/             # Utilities (DOCX parsing)
│
├── backend-api/           # API REST (FastAPI)
│   ├── main.py           # App FastAPI (minimal)
│   └── routers/          # Endpoints (appellent les services)
│       ├── templates.py  # /templates, /forms, /generate
│       ├── images.py     # /images
│       └── invoices.py   # /invoices
│
├── frontend/             # Interface React
│   └── src/
│       ├── components/   # Composants UI
│       └── App.tsx      # App principale
│
├── templates/            # Templates DOCX
├── forms/               # Définitions JSON
├── invoices/            # Factures générées
└── assets/images/       # Images pour les factures
```

---

## 🎯 Principes de design

### 1. **Séparation des responsabilités**

**Endpoints (routers/)** :
- Gèrent les requêtes/réponses HTTP
- Valident les inputs (Pydantic)
- Appellent les services
- **Ne contiennent AUCUNE logique métier**

**Services (app/services/)** :
- Contiennent toute la logique métier
- Manipulent les données
- Gèrent les erreurs métier
- Indépendants de FastAPI

**Exemple :**
```python
# ❌ MAU VAIS (logique dans l'endpoint)
@router.get("/invoices")
def list_invoices():
    invoices = []
    for file in INVOICES_DIR.glob("*.docx"):
        stat = file.stat()
        invoices.append({...})
    return {"invoices": invoices}

# ✅ BON (logique dans le service)
@router.get("/invoices")
def list_invoices():
    from app.services.invoice_service import get_all_invoices
    return get_all_invoices()
```

### 2. **Code minimaliste**

- **Pas de sur-ingénierie**
- **Pas de dépendances lourdes** (LibreOffice, etc.)
- **Fonctionnalités essentielles uniquement**

### 3. **Maintenabilité**

- **1 fichier = 1 responsabilité**
- **Noms explicites**
- **Docstrings sur toutes les fonctions**

---

## 📍 Routes API

### Templates & Génération

```
GET  /templates                    Liste les templates
GET  /forms/{template_name}        Récupère les champs d'un template
POST /generate                     Génère une facture
```

### Images

```
GET    /images                     Liste les images
POST   /images/upload              Upload une image
DELETE /images/{filename}          Supprime une image
```

### Factures

```
GET /invoices                      Liste les factures
GET /invoices/download/{filename}  Télécharge une facture
```

---

## 🔄 Flux de génération

```
1. Frontend → POST /generate
   ↓
2. Router (templates.py) → valide la requête
   ↓
3. Service (template_service.py) → charge le template
   ↓
4. Service (generator_service.py) → génère le DOCX
   ↓
5. Router → retourne le résultat
   ↓
6. Frontend → affiche le succès
```

---

## 💡 Décisions techniques

### Pourquoi pas de conversion PDF ?

**Problème :** LibreOffice est lourd (~500MB) pour une simple conversion.

**Alternatives évaluées :**
- ❌ `python-docx` : Ne peut PAS convertir en PDF
- ❌ `docx2pdf` : Windows uniquement
- ❌ `pypandoc` : Nécessite Pandoc (autre grosse dépendance)
- ❌ `unoconv` : Utilise LibreOffice en arrière-plan
- ✅ **Solution actuelle** : Téléchargement Word uniquement (simple et efficace)

**Comment font les grosses boîtes ?**

1. **Services cloud** :
   - Google Docs API
   - Microsoft Graph API
   - Conversion déléguée au cloud

2. **Génération directe en PDF** :
   - `reportlab` (Python)
   - `weasyprint` (HTML → PDF)
   - **Mais** : nécessite de réécrire toute la logique de templates

3. **Preview** :
   - Screenshot de la première page (PNG)
   - Miniature générée avec `ImageMagick` ou `ghostscript`
   - Viewer JavaScript (PDF.js)

**Notre choix** : Rester simple avec Word uniquement.

---

## 🚀 Améliorations futures

### Court terme
- [ ] Créer un service `invoice_service.py` pour déplacer la logique de `routers/invoices.py`
- [ ] Ajouter des tests unitaires pour les services
- [ ] Valider les noms de fichiers (sécurité)

### Moyen terme
- [ ] Génération directe en PDF avec `weasyprint` (sans LibreOffice)
- [ ] Miniatures des factures (screenshot première page)
- [ ] API pour supprimer des factures

### Long terme
- [ ] Historique des factures (base de données)
- [ ] Authentification utilisateur
- [ ] Multi-templates par utilisateur

---

## 📖 Guide du développeur

### Ajouter une nouvelle route

1. **Créer l'endpoint** dans `backend-api/routers/`
2. **Créer le service** dans `app/services/` (si logique métier)
3. **Importer dans** `main.py`

**Exemple :**
```python
# 1. routers/customers.py
from fastapi import APIRouter
router = APIRouter(tags=["customers"])

@router.get("/customers")
def list_customers():
    from app.services.customer_service import get_all_customers
    return get_all_customers()

# 2. app/services/customer_service.py
def get_all_customers():
    # Logique métier ici
    return {"customers": [...]}

# 3. main.py
from routers import customers
app.include_router(customers.router)
```

### Modifier un service existant

**Fichiers concernés :**
- `app/services/template_service.py` → Gestion templates
- `app/services/form_service.py` → Gestion formulaires
- `app/services/generator_service.py` → Génération factures

**Règle d'or :** Ne JAMAIS mettre de logique métier dans les routers.

---

## ⚙️ Configuration

Toute la configuration est dans `app/core/config.py` :

```python
BASE_DIR = Path(__file__).parent.parent.parent
TEMPLATES_DIR = BASE_DIR / "templates"
FORMS_DIR = BASE_DIR / "forms"
INVOICES_DIR = BASE_DIR / "invoices"
```

**Ne JAMAIS hardcoder de chemins dans le code.**

---

## 🧹 Maintenance

### Nettoyage
```bash
make clean        # Nettoie les fichiers Python temporaires
make clean-data   # Nettoie les données (templates, factures)
make clean-all    # Nettoyage complet
```

### Linting
```bash
make lint         # Vérifie le code
make format       # Formate le code
```

---

## 📝 Conventions de code

### Nommage
- **Fichiers** : `snake_case.py`
- **Classes** : `PascalCase`
- **Fonctions** : `snake_case()`
- **Variables** : `snake_case`

### Docstrings
```python
def generate_invoice(template_name: str, form_data: dict) -> Path:
    """
    Génère une facture depuis un template.
    
    Args:
        template_name: Nom du template à utiliser
        form_data: Données du formulaire
    
    Returns:
        Chemin vers la facture générée
    
    Raises:
        FileNotFoundError: Si le template n'existe pas
    """
    ...
```

---

**Version** : 0.2.0  
**Date** : Novembre 2025  
**Auteur** : SmartInvoice Engine Team

