"""Service de gestion des templates de factures."""
import shutil
from pathlib import Path

from app.core.config import FORMS_DIR, TEMPLATES_DIR
from app.core.models import FieldDefinition, InvoiceTemplate
from app.utils.docx_parser import find_placeholders


def extract_fields(docx_path: Path) -> list[FieldDefinition]:
    """
    Extrait les champs d'un template DOCX.

    Args:
        docx_path: Chemin vers le fichier DOCX

    Returns:
        Liste des définitions de champs
    """
    placeholders = find_placeholders(docx_path)
    return [FieldDefinition.from_placeholder(p) for p in placeholders]


def save_template(docx_path: Path, template_name: str) -> InvoiceTemplate:
    """
    Sauvegarde un template dans le dossier templates/.

    Args:
        docx_path: Chemin vers le fichier DOCX source
        template_name: Nom du template (sans extension)

    Returns:
        InvoiceTemplate créé
    """
    if not docx_path.exists():
        raise FileNotFoundError(f"Template file not found: {docx_path}")

    # Copier le template
    dest_path = TEMPLATES_DIR / f"{template_name}.docx"
    shutil.copy2(docx_path, dest_path)

    # Extraire les champs
    fields = extract_fields(dest_path)

    template = InvoiceTemplate(
        name=template_name, docx_path=dest_path, fields=fields
    )

    return template


def load_template(template_name: str) -> InvoiceTemplate:
    """
    Charge un template existant.

    Args:
        template_name: Nom du template

    Returns:
        InvoiceTemplate chargé

    Raises:
        FileNotFoundError: Si le template n'existe pas
    """
    docx_path = TEMPLATES_DIR / f"{template_name}.docx"

    if not docx_path.exists():
        raise FileNotFoundError(f"Template not found: {template_name}")

    fields = extract_fields(docx_path)

    return InvoiceTemplate(
        name=template_name, docx_path=docx_path, fields=fields
    )


def list_templates() -> list[str]:
    """
    Liste tous les templates disponibles.

    Returns:
        Liste des noms de templates
    """
    return [f.stem for f in TEMPLATES_DIR.glob("*.docx")]


def delete_template(template_name: str) -> None:
    """
    Supprime un template et son formulaire associé.

    Args:
        template_name: Nom du template à supprimer
    """
    docx_path = TEMPLATES_DIR / f"{template_name}.docx"
    form_path = FORMS_DIR / f"{template_name}.json"

    if docx_path.exists():
        docx_path.unlink()

    if form_path.exists():
        form_path.unlink()

