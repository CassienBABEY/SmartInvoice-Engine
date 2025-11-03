"""Configuration de l'application."""
from pathlib import Path

# Base directories
BASE_DIR = Path(__file__).parent.parent.parent
TEMPLATES_DIR = BASE_DIR / "templates"
FORMS_DIR = BASE_DIR / "forms"
INVOICES_DIR = BASE_DIR / "invoices"

# Création des dossiers s'ils n'existent pas
TEMPLATES_DIR.mkdir(exist_ok=True)
FORMS_DIR.mkdir(exist_ok=True)
INVOICES_DIR.mkdir(exist_ok=True)

# Patterns
FIELD_PATTERN = r"\{\{([^}]+)\}\}"

# Field prefixes
PREFIX_IMAGE = "img_"
PREFIX_IMAGE_ALT = "image_"
PREFIX_DATE = "date_"
PREFIX_NUMBER = "number_"

# Date format
DATE_FORMAT = "DD/MM/YYYY"

