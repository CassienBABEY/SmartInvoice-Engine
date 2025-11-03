"""Tests pour les modèles de données."""
import pytest

from app.core.models import FieldDefinition, FieldType, FormData


def test_field_definition_from_placeholder_text():
    """Test création d'un champ texte."""
    field = FieldDefinition.from_placeholder("company_name")
    assert field.name == "company_name"
    assert field.field_type == FieldType.TEXT
    assert field.has_currency is False


def test_field_definition_from_placeholder_date():
    """Test création d'un champ date."""
    field = FieldDefinition.from_placeholder("date_invoice")
    assert field.name == "date_invoice"
    assert field.field_type == FieldType.DATE


def test_field_definition_from_placeholder_number():
    """Test création d'un champ number."""
    field = FieldDefinition.from_placeholder("number_amount")
    assert field.name == "number_amount"
    assert field.field_type == FieldType.NUMBER


def test_field_definition_from_placeholder_image():
    """Test création d'un champ image."""
    field = FieldDefinition.from_placeholder("img_logo")
    assert field.name == "img_logo"
    assert field.field_type == FieldType.IMAGE


def test_form_data_set_value():
    """Test définition d'une valeur dans un formulaire."""
    form = FormData(template_name="test")
    form.set_value("name", "Test Company")
    assert form.values["name"] == "Test Company"


def test_form_data_set_currency():
    """Test activation de la devise."""
    form = FormData(template_name="test")
    form.set_currency("number_amount", True)
    assert form.currency_fields["number_amount"] is True

