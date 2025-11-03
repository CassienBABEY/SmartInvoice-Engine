"""
Service pour la génération de previews PDF à partir de fichiers DOCX en utilisant LibreOffice.

Cette méthode garantit une fidélité de 100% avec le document original, car elle utilise
le moteur de rendu de LibreOffice, qui est une suite bureautique complète.

Le service inclut un système de cache pour des performances optimales :
- Un PDF n'est généré que si le fichier DOCX original est plus récent que le PDF mis en cache.
- Les PDF générés sont stockés dans un dossier `invoices_pdf/` pour un accès instantané
  lors des requêtes suivantes.
"""
from pathlib import Path
import subprocess
import shutil
from app.core.config import INVOICES_DIR, BASE_DIR

# Création du répertoire de cache pour les PDF au démarrage de l'application.
PDF_CACHE_DIR = BASE_DIR / "invoices_pdf"
PDF_CACHE_DIR.mkdir(exist_ok=True)

def create_pdf_preview(invoice_filename: str) -> Path:
    """
    Crée ou récupère depuis le cache une preview PDF pour une facture DOCX.

    Args:
        invoice_filename (str): Le nom du fichier de la facture (ex: "facture-01.docx").

    Returns:
        Path: Le chemin vers le fichier PDF généré ou mis en cache.

    Raises:
        FileNotFoundError: Si le fichier DOCX de la facture n'est pas trouvé.
        Exception: Si LibreOffice n'est pas installé ou si la conversion échoue.
    """
    docx_path = INVOICES_DIR / invoice_filename
    if not docx_path.exists():
        raise FileNotFoundError(f"Le fichier de facture '{invoice_filename}' n'a pas été trouvé.")

    pdf_filename = docx_path.with_suffix(".pdf").name
    pdf_path = PDF_CACHE_DIR / pdf_filename

    # Vérification du cache : si le PDF existe et est plus récent que le DOCX, on le retourne.
    if pdf_path.exists() and pdf_path.stat().st_mtime > docx_path.stat().st_mtime:
        print(f"CACHE HIT: Retourne le PDF existant pour {invoice_filename}")
        return pdf_path

    print(f"CACHE MISS: Génération du PDF pour {invoice_filename}")
    try:
        # Utilisation de la commande `soffice` qui est l'exécutable de LibreOffice pour le scripting.
        # --headless: pour s'exécuter sans interface graphique.
        # --convert-to pdf: pour spécifier le format de sortie.
        # --outdir: pour spécifier le répertoire de sortie.
        subprocess.run(
            [
                "soffice",
                "--headless",
                "--convert-to",
                "pdf",
                "--outdir",
                str(PDF_CACHE_DIR),
                str(docx_path),
            ],
            check=True,
            timeout=30,  # Un timeout pour éviter que le processus ne reste bloqué indéfiniment.
            capture_output=True,
        )

        if not pdf_path.exists():
            raise Exception("La conversion avec LibreOffice n'a pas produit de fichier PDF.")

        return pdf_path

    except FileNotFoundError:
        # Cette erreur est levée si la commande `soffice` n'est pas trouvée dans le PATH.
        error_message = "LibreOffice n'est pas installé ou pas présent dans le PATH. Installez-le avec 'sudo apt install libreoffice'."
        print(error_message)
        raise Exception(error_message)
    except subprocess.CalledProcessError as e:
        # Cette erreur est levée si LibreOffice retourne un code d'erreur non nul.
        error_details = e.stderr.decode('utf-8')
        print(f"Erreur de conversion PDF avec LibreOffice: {error_details}")
        raise Exception(f"Erreur de conversion PDF : {error_details}")
    except subprocess.TimeoutExpired:
        print("Timeout lors de la conversion PDF avec LibreOffice.")
        raise Exception("La conversion PDF a pris trop de temps.")
