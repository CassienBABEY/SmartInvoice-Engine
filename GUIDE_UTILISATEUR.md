# 📘 Guide Utilisateur - SmartInvoice Engine

## 🚀 Démarrage Rapide

### Installation

1. Double-cliquez sur `SmartInvoice-Setup-0.2.0.exe`
2. Suivez les étapes de l'assistant d'installation
3. Cochez "Créer un raccourci bureau" pour un accès rapide
4. Cliquez sur "Installer"

### Premier Lancement

1. Double-cliquez sur l'icône **SmartInvoice Engine** sur votre bureau
2. Une fenêtre noire s'ouvre (serveur backend) - **NE LA FERMEZ PAS**
3. Votre navigateur s'ouvre automatiquement sur l'application
4. L'application est prête à l'emploi !

> **Note** : Si le navigateur ne s'ouvre pas automatiquement, allez sur http://localhost:8000

## 📄 Créer Votre Premier Template

### Étape 1 : Préparer le Template DOCX

Ouvrez Microsoft Word ou LibreOffice Writer et créez un document avec des **placeholders** (champs à remplir).

**Syntaxe des placeholders :**

| Type | Syntaxe | Exemple | Description |
|------|---------|---------|-------------|
| **Texte** | `{{nom_du_champ}}` | `{{client_name}}` | Texte simple |
| **Date** | `{{date_nom}}` | `{{date_invoice}}` | Format DD/MM/YYYY |
| **Nombre** | `{{number_nom}}` | `{{number_total}}` | Nombre (avec option €) |
| **Image** | `{{img_nom}}` ou `{{image_nom}}` | `{{img_logo}}` | Insertion d'image |

**Exemple de template :**

```
=====================================
       FACTURE N° {{number_invoice}}
=====================================

Date : {{date_invoice}}
Client : {{client_name}}
Adresse : {{client_address}}

-------------------------------------
Description            Montant
-------------------------------------
{{service_description}}
                       {{number_amount}} €

-------------------------------------
TOTAL HT :             {{number_total_ht}} €
TVA (20%) :            {{number_tva}} €
TOTAL TTC :            {{number_total_ttc}} €

Logo entreprise :
{{img_logo}}
```

### Étape 2 : Sauvegarder le Template

1. Enregistrez votre document : `facture_entreprise.docx`
2. Dans SmartInvoice Engine, allez sur **TEMPLATES**
3. Cliquez sur la carte **"Nouveau template"**
4. Sélectionnez votre fichier `facture_entreprise.docx`
5. Le template apparaît maintenant dans la liste !

## 🖊️ Générer une Facture

### Méthode 1 : Depuis la page HOME

1. Cliquez sur le grand bouton **"Générer une facture"**
2. Sélectionnez un template
3. Remplissez le formulaire
4. Cliquez sur **"Générer"**

### Méthode 2 : Depuis la page GENERATE

1. Cliquez sur **GENERATE** dans la barre latérale
2. **Étape 1** : Choisissez un template
3. **Étape 2** : Remplissez les champs
   - **Dates** : Les `/` s'ajoutent automatiquement (tapez `01122024` → `01/12/2024`)
   - **Nombres** : Cochez "Devise" pour ajouter le symbole €
   - **Images** : Sélectionnez dans la liste ou uploadez une nouvelle image
4. **Étape 3** : Preview et téléchargement
   - Aperçu PDF dans l'application
   - Boutons de téléchargement DOCX et PDF

### Mémoriser des Valeurs

Pour gagner du temps sur les valeurs récurrentes (nom d'entreprise, TVA, etc.) :

1. Remplissez un champ
2. Cliquez sur le **cadenas** 🔒 à droite du champ
3. La valeur sera pré-remplie la prochaine fois que vous utiliserez ce template

## 🖼️ Gérer les Images

### Ajouter des Images

**Méthode 1 : Depuis le formulaire**
1. Dans un champ image, cliquez sur l'icône **Upload** (↑)
2. Sélectionnez votre image (PNG, JPG, etc.)
3. L'image apparaît automatiquement dans la liste

**Méthode 2 : Copie manuelle**
1. Copiez vos images dans : `C:\Program Files\SmartInvoice Engine\assets\images\`
2. Rechargez le formulaire pour voir les nouvelles images

### Utiliser une Image

1. Dans le formulaire, repérez le champ image (ex: `img_logo`)
2. Sélectionnez l'image dans le menu déroulant
3. L'image sera insérée dans la facture générée

## 📁 Gérer les Templates

### Voir tous les Templates

1. Cliquez sur **TEMPLATES** dans la barre latérale
2. Tous vos templates s'affichent sous forme de cartes

### Utiliser un Template

1. Cliquez sur la carte du template
2. Vous êtes redirigé vers la page GENERATE avec le template pré-sélectionné

### Supprimer un Template

1. Cliquez sur l'icône **poubelle** 🗑️ en haut à droite de la carte
2. Confirmez la suppression

## 📊 Consulter vos Factures

### Page FACTURES

1. Cliquez sur **FACTURES** dans la barre latérale
2. Toutes vos factures générées s'affichent

### Preview d'une Facture

1. Cliquez sur une facture dans la liste
2. Une fenêtre s'ouvre avec l'aperçu PDF
3. Boutons disponibles :
   - **Télécharger DOCX** : Version Word éditable
   - **Télécharger PDF** : Version PDF finalisée

### Supprimer une Facture

1. Cliquez sur l'icône **poubelle** 🗑️ à droite de la facture
2. Confirmez la suppression

## ⚙️ Paramètres

Cliquez sur **PARAMS** pour voir :
- Statut du serveur (🟢 Connecté)
- Version de l'application
- Statistiques d'utilisation (à venir)

## 🔧 Dépannage

### L'application ne démarre pas

1. Vérifiez que le port 8000 n'est pas utilisé par une autre application
2. Fermez complètement SmartInvoice (fenêtre noire incluse)
3. Relancez depuis le raccourci bureau

### Le navigateur ne s'ouvre pas

Ouvrez manuellement votre navigateur et allez sur : http://localhost:8000

### Les images ne s'affichent pas

1. Vérifiez que l'image est au format PNG, JPG, JPEG, GIF ou WEBP
2. Vérifiez que l'image est dans `assets\images\`
3. Rechargez la page

### Les dates sont invalides

Le format attendu est **DD/MM/YYYY** :
- ✅ Valide : `01/12/2024`, `31/12/2024`
- ❌ Invalide : `2024-12-01`, `12/01/2024` (format US), `32/01/2024` (jour inexistant)

### La preview PDF ne fonctionne pas

L'application nécessite **LibreOffice** pour générer les PDF.

**Installation de LibreOffice :**
1. Téléchargez LibreOffice : https://www.libreoffice.org/download/download/
2. Installez-le (version standard)
3. Redémarrez SmartInvoice Engine

**Note** : Les factures DOCX sont toujours générées, même sans LibreOffice.

### Erreur "Port 8000 already in use"

Une autre instance de SmartInvoice est déjà en cours :
1. Recherchez l'icône dans la barre des tâches
2. Fermez la fenêtre noire (serveur backend)
3. Ou redémarrez votre ordinateur

## 🔒 Sécurité et Données

### Où sont stockées mes données ?

Toutes vos données sont stockées **localement** sur votre ordinateur :

```
C:\Program Files\SmartInvoice Engine\
├── templates\           # Vos templates DOCX
├── forms\               # Définitions de formulaires
├── invoices\            # Factures générées (DOCX)
├── invoices_pdf\        # Aperçus PDF (cache)
└── assets\images\       # Vos images
```

### Sauvegarde de vos Données

Pour sauvegarder vos templates et factures :
1. Ouvrez `C:\Program Files\SmartInvoice Engine\`
2. Copiez les dossiers `templates\`, `invoices\`, et `assets\` sur une clé USB ou un cloud

### Restauration après Réinstallation

1. Réinstallez SmartInvoice Engine
2. Copiez vos dossiers sauvegardés dans `C:\Program Files\SmartInvoice Engine\`
3. Relancez l'application

## 📞 Besoin d'Aide ?

- **Email** : support@smartinvoice.com
- **GitHub** : [Issues](https://github.com/yourusername/SmartInvoice-Engine/issues)
- **Documentation** : Voir README.md et BUILD_INSTRUCTIONS.md

## 💡 Astuces et Raccourcis

### Productivité

1. **Mémoriser les valeurs communes** : Activez le cadenas 🔒 pour vos champs récurrents (nom, TVA, etc.)
2. **Nommer vos factures** : Utilisez un schéma cohérent : `Facture-[Client]-[Date]`
3. **Templates multiples** : Créez plusieurs templates pour différents types de clients/services

### Placeholders Recommandés

Pour une facture complète, utilisez :

**Informations générales :**
- `{{number_invoice}}` : Numéro de facture
- `{{date_invoice}}` : Date d'émission
- `{{date_due}}` : Date d'échéance

**Client :**
- `{{client_name}}` : Nom du client
- `{{client_address}}` : Adresse
- `{{client_vat}}` : Numéro de TVA

**Montants :**
- `{{number_total_ht}}` : Total HT
- `{{number_tva}}` : Montant TVA
- `{{number_total_ttc}}` : Total TTC

**Entreprise :**
- `{{company_name}}` : Nom de votre entreprise
- `{{company_address}}` : Adresse
- `{{img_logo}}` : Logo

---

**Bonne facturation ! 🎉**

