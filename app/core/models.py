"""Modèles de données pour l'application."""
from enum import Enum
from pathlib import Path
from typing import Any

from pydantic import BaseModel, Field


class FieldType(str, Enum):
    """Types de champs supportés."""

    TEXT = "text"
    IMAGE = "image"
    DATE = "date"
    NUMBER = "number"


class FieldDefinition(BaseModel):
    """Définition d'un champ de formulaire."""

    name: str
    field_type: FieldType
    has_currency: bool = False

    @staticmethod
    def from_placeholder(placeholder: str) -> "FieldDefinition":
        """
        Crée une définition de champ depuis un placeholder.

        Args:
            placeholder: Le nom du champ (ex: 'img_logo', 'image_logo', 'date_invoice')

        Returns:
            FieldDefinition avec le type approprié
        """
        from app.core.config import (
            PREFIX_DATE,
            PREFIX_IMAGE,
            PREFIX_IMAGE_ALT,
            PREFIX_NUMBER,
        )

        # Détection image : img_ ou commence par "image"
        if placeholder.startswith(PREFIX_IMAGE) or placeholder.startswith(
            "image"
        ):
            return FieldDefinition(name=placeholder, field_type=FieldType.IMAGE)
        elif placeholder.startswith(PREFIX_DATE):
            return FieldDefinition(name=placeholder, field_type=FieldType.DATE)
        elif placeholder.startswith(PREFIX_NUMBER):
            return FieldDefinition(name=placeholder, field_type=FieldType.NUMBER)
        else:
            return FieldDefinition(name=placeholder, field_type=FieldType.TEXT)


class InvoiceTemplate(BaseModel):
    """Représentation d'un template de facture."""

    name: str
    docx_path: Path
    fields: list[FieldDefinition]


class FormData(BaseModel):
    """Données d'un formulaire rempli."""

    template_name: str
    values: dict[str, Any] = Field(default_factory=dict)
    currency_fields: dict[str, bool] = Field(default_factory=dict)

    def set_value(self, field_name: str, value: Any) -> None:
        """
        Définit la valeur d'un champ.

        Args:
            field_name: Nom du champ
            value: Valeur du champ
        """
        self.values[field_name] = value

    def set_currency(self, field_name: str, use_currency: bool) -> None:
        """
        Définit si un champ number doit afficher une devise.

        Args:
            field_name: Nom du champ
            use_currency: True pour afficher une devise
        """
        self.currency_fields[field_name] = use_currency

