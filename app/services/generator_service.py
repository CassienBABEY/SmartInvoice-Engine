"""Service de génération de factures."""
from datetime import datetime
from pathlib import Path

from app.core.config import INVOICES_DIR
from app.core.models import FieldDefinition, FieldType, FormData
from app.services.template_service import load_template
from app.utils.docx_parser import insert_image_in_docx, replace_placeholders


def format_number_value(
    value: str, use_currency: bool, currency_symbol: str = "€"
) -> str:
    """
    Formate une valeur numérique avec ou sans devise.

    Args:
        value: Valeur numérique en string
        use_currency: Afficher la devise
        currency_symbol: Symbole de la devise

    Returns:
        Valeur formatée
    """
    try:
        num = float(value)
        formatted = f"{num:,.2f}".replace(",", " ")

        if use_currency:
            return f"{formatted} {currency_symbol}"
        return formatted
    except ValueError:
        return value


def format_date_value(value: str) -> str:
    """
    Valide et formate une date au format DD/MM/YYYY.

    Args:
        value: Date en string

    Returns:
        Date formatée ou valeur originale si invalide
    """
    try:
        # Essayer de parser la date
        dt = datetime.strptime(value, "%d/%m/%Y")
        return dt.strftime("%d/%m/%Y")
    except ValueError:
        return value


def generate_invoice(
    template_name: str,
    form_data: FormData,
    output_path: Path | None = None,
) -> Path:
    """
    Génère une facture depuis un template et des données de formulaire.

    Args:
        template_name: Nom du template
        form_data: Données du formulaire
        output_path: Chemin de sortie (optionnel, auto-généré sinon)

    Returns:
        Chemin vers la facture générée
    """
    template = load_template(template_name)

    # Générer le nom de fichier par défaut
    if output_path is None:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"invoice_{template_name}_{timestamp}.docx"
        output_path = INVOICES_DIR / filename

    # Préparer les remplacements
    replacements = {}
    image_fields = []

    for field in template.fields:
        field_name = field.name
        value = form_data.values.get(field_name, "")

        if field.field_type == FieldType.IMAGE:
            # Garder les champs image pour traitement séparé
            if value:
                image_fields.append((field_name, value))
        elif field.field_type == FieldType.DATE:
            replacements[field_name] = format_date_value(value)
        elif field.field_type == FieldType.NUMBER:
            use_currency = form_data.currency_fields.get(field_name, False)
            replacements[field_name] = format_number_value(value, use_currency)
        else:
            replacements[field_name] = str(value)

    # Remplacer les champs texte/date/number
    replace_placeholders(template.docx_path, replacements, output_path)

    # Traiter les images
    from app.core.config import BASE_DIR
    
    for field_name, image_path in image_fields:
        img_path = Path(image_path)
        
        # Si le chemin n'existe pas, essayer dans assets/images/
        if not img_path.exists():
            # Essayer avec juste le nom du fichier dans assets/images/
            assets_path = BASE_DIR / "assets" / "images" / Path(image_path).name
            if assets_path.exists():
                img_path = assets_path
        
        if img_path.exists():
            # Créer un fichier temporaire pour chaque insertion d'image
            temp_output = output_path.parent / f"temp_{output_path.name}"
            insert_image_in_docx(
                output_path, img_path, field_name, temp_output
            )
            # Remplacer le fichier original
            temp_output.replace(output_path)
        else:
            # Log si l'image n'est pas trouvée (sera visible dans les logs API)
            print(f"⚠️  Image non trouvée: {image_path}")

    return output_path


def generate_invoice_filename(template_name: str, suffix: str = "") -> str:
    """
    Génère un nom de fichier pour une facture.

    Args:
        template_name: Nom du template
        suffix: Suffixe optionnel

    Returns:
        Nom de fichier généré
    """
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    if suffix:
        return f"invoice_{template_name}_{suffix}_{timestamp}.docx"
    return f"invoice_{template_name}_{timestamp}.docx"

