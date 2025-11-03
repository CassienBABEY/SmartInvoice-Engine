"""
Service pour la gestion des valeurs par défaut des formulaires.
"""
from pathlib import Path
from typing import Dict, Any
import json

from app.core.config import FORMS_DIR


def get_defaults_path(template_name: str) -> Path:
    """
    Retourne le chemin du fichier de valeurs par défaut.

    Args:
        template_name (str): Nom du template.

    Returns:
        Path: Chemin du fichier JSON des valeurs par défaut.
    """
    return FORMS_DIR / f"{template_name}_defaults.json"


def load_defaults(template_name: str) -> Dict[str, Any]:
    """
    Charge les valeurs par défaut d'un template.

    Args:
        template_name (str): Nom du template.

    Returns:
        Dict[str, Any]: Dictionnaire des valeurs par défaut.
    """
    defaults_path = get_defaults_path(template_name)

    if not defaults_path.exists():
        return {}

    with open(defaults_path, "r", encoding="utf-8") as f:
        return json.load(f)


def save_defaults(template_name: str, defaults: Dict[str, Any]) -> None:
    """
    Sauvegarde les valeurs par défaut d'un template.

    Args:
        template_name (str): Nom du template.
        defaults (Dict[str, Any]): Dictionnaire des valeurs par défaut.
    """
    defaults_path = get_defaults_path(template_name)

    with open(defaults_path, "w", encoding="utf-8") as f:
        json.dump(defaults, f, ensure_ascii=False, indent=2)


def update_field_default(
    template_name: str, field_name: str, value: str, remember: bool
) -> None:
    """
    Met à jour la valeur par défaut d'un champ.

    Args:
        template_name (str): Nom du template.
        field_name (str): Nom du champ.
        value (str): Valeur à mémoriser.
        remember (bool): Si True, mémorise la valeur. Si False, la supprime.
    """
    defaults = load_defaults(template_name)

    if remember:
        defaults[field_name] = {"value": value, "remember": True}
    else:
        defaults.pop(field_name, None)

    save_defaults(template_name, defaults)


def delete_field_default(template_name: str, field_name: str) -> None:
    """
    Supprime la valeur par défaut d'un champ.

    Args:
        template_name (str): Nom du template.
        field_name (str): Nom du champ.
    """
    defaults = load_defaults(template_name)
    defaults.pop(field_name, None)
    save_defaults(template_name, defaults)

