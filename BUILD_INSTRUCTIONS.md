# SmartInvoice Engine - Instructions de Build

## 📋 Prérequis

### Pour le développement
- Python 3.10+
- Node.js 18+ et npm
- Poetry (gestionnaire de dépendances Python)

### Pour créer l'installateur Windows
- PyInstaller (`pip install pyinstaller`)
- Inno Setup 6+ ([télécharger ici](https://jrsoftware.org/isdl.php))
- LibreOffice (pour la conversion DOCX → PDF)

## 🏗️ Build de l'Application

### Étape 1 : Préparation de l'environnement

```bash
# Installer les dépendances Python
poetry install

# Installer les dépendances frontend
cd frontend
npm install
cd ..
```

### Étape 2 : Build automatique

```bash
# Exécuter le script de build (crée dist/SmartInvoiceEngine/)
python build_windows.py
```

Ce script effectue automatiquement :
1. ✅ Nettoyage des builds précédents
2. ✅ Build du frontend React (Vite)
3. ✅ Package du backend Python (PyInstaller)
4. ✅ Copie du frontend buildé dans la distribution
5. ✅ Création des dossiers de données
6. ✅ Création du launcher Windows (.bat)

### Étape 3 : Création de l'installateur

```bash
# Compiler l'installateur avec Inno Setup
iscc installer.iss
```

L'installateur sera créé dans `installer_output/SmartInvoice-Setup-0.2.0.exe`

## 📦 Structure de la Distribution

```
dist/SmartInvoiceEngine/
├── SmartInvoiceEngine.exe       # Backend (API FastAPI)
├── SmartInvoice.bat             # Launcher Windows
├── logo.png                     # Logo de l'application
├── frontend/                    # Frontend React buildé
│   ├── index.html
│   └── assets/
├── templates/                   # Templates DOCX
├── assets/                      # Images et ressources
│   └── images/
├── forms/                       # Définitions de formulaires (JSON)
├── invoices/                    # Factures générées (DOCX)
└── invoices_pdf/                # Previews PDF (cache)
```

## 🚀 Utilisation de l'Installateur

### Installation
1. Double-cliquer sur `SmartInvoice-Setup-0.2.0.exe`
2. Suivre les étapes de l'assistant d'installation
3. Choisir le dossier d'installation (par défaut : `C:\Program Files\SmartInvoice Engine`)
4. Créer les raccourcis (bureau, menu démarrer)
5. Lancer l'application

### Lancement
- **Depuis le bureau** : Double-cliquer sur l'icône SmartInvoice Engine
- **Depuis le menu démarrer** : Chercher "SmartInvoice Engine"
- **Manuel** : Exécuter `SmartInvoice.bat` dans le dossier d'installation

### Désinstallation
- **Via Windows** : Paramètres → Applications → SmartInvoice Engine → Désinstaller
- **Via le menu démarrer** : SmartInvoice Engine → Désinstaller

## 🛠️ Build Manuel (Avancé)

### Backend uniquement

```bash
# Avec PyInstaller
pyinstaller build.spec --clean
```

### Frontend uniquement

```bash
cd frontend
npm run build
cd ..
```

## 📝 Notes Importantes

### Antivirus
PyInstaller peut déclencher des faux positifs avec certains antivirus.
Pour contourner ce problème :
1. Signer l'exécutable avec un certificat de code
2. Soumettre l'exécutable aux éditeurs d'antivirus (VirusTotal, etc.)

### LibreOffice
L'application nécessite LibreOffice pour la conversion DOCX → PDF.
Si LibreOffice n'est pas installé :
- La génération d'invoices fonctionnera (DOCX)
- La preview PDF ne sera pas disponible

Installation recommandée : [LibreOffice Portable](https://www.libreoffice.org/download/portable-versions/)

## 🔧 Personnalisation

### Changer le logo
Remplacer `logo.png` (recommandé : 256x256px, PNG transparent)

### Modifier la version
1. `pyproject.toml` → version
2. `app/main.py` → version dans FastAPI
3. `installer.iss` → MyAppVersion
4. `build_windows.py` → version dans VERSION.txt

### Ajouter des dépendances
1. Backend : `poetry add <package>`
2. Frontend : `cd frontend && npm install <package>`
3. Rebuild : `python build_windows.py`

## 🐛 Dépannage

### Erreur : "Module not found"
→ Ajouter le module dans `hiddenimports` de `build.spec`

### Erreur : "Frontend not found"
→ Vérifier que `npm run build` s'est exécuté correctement

### L'exécutable ne démarre pas
→ Tester avec `console=True` dans `build.spec` pour voir les erreurs

### L'installateur ne se compile pas
→ Vérifier que tous les chemins dans `installer.iss` existent

## 📞 Support

Pour toute question ou problème :
- GitHub Issues : [lien vers repo]
- Documentation : [lien vers docs]
- Email : support@smartinvoice.com

