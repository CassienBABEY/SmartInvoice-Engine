"""Service de gestion des formulaires."""
import json
from pathlib import Path

from app.core.config import FORMS_DIR
from app.core.models import FieldDefinition, FormData


def create_form(template_name: str, fields: list[FieldDefinition]) -> FormData:
    """
    Crée un formulaire vide à partir des champs d'un template.

    Args:
        template_name: Nom du template
        fields: Liste des champs du template

    Returns:
        FormData initialisé
    """
    form = FormData(template_name=template_name)

    # Initialiser les valeurs par défaut
    for field in fields:
        form.set_value(field.name, "")
        if field.field_type.value == "number":
            form.set_currency(field.name, False)

    return form


def save_form(form_data: FormData) -> None:
    """
    Sauvegarde un formulaire dans forms/.

    Args:
        form_data: Données du formulaire à sauvegarder
    """
    form_path = FORMS_DIR / f"{form_data.template_name}.json"

    with open(form_path, "w", encoding="utf-8") as f:
        json.dump(form_data.model_dump(), f, indent=2, ensure_ascii=False)


def load_form(template_name: str) -> FormData:
    """
    Charge un formulaire existant.

    Args:
        template_name: Nom du template

    Returns:
        FormData chargé

    Raises:
        FileNotFoundError: Si le formulaire n'existe pas
    """
    form_path = FORMS_DIR / f"{template_name}.json"

    if not form_path.exists():
        raise FileNotFoundError(f"Form not found: {template_name}")

    with open(form_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    return FormData(**data)


def form_exists(template_name: str) -> bool:
    """
    Vérifie si un formulaire existe.

    Args:
        template_name: Nom du template

    Returns:
        True si le formulaire existe
    """
    form_path = FORMS_DIR / f"{template_name}.json"
    return form_path.exists()


def update_form_field(
    template_name: str, field_name: str, value: str, use_currency: bool = False
) -> FormData:
    """
    Met à jour un champ spécifique d'un formulaire.

    Args:
        template_name: Nom du template
        field_name: Nom du champ à mettre à jour
        value: Nouvelle valeur
        use_currency: Si True, active l'affichage devise pour number

    Returns:
        FormData mis à jour
    """
    form = load_form(template_name)
    form.set_value(field_name, value)

    if field_name.startswith("number_"):
        form.set_currency(field_name, use_currency)

    save_form(form)
    return form

