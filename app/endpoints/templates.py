"""
Routes pour la gestion des templates.
"""
from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel
from typing import Any

from app.services.template_service import load_template, save_template
from app.services.form_service import save_form
from app.services.generator_service import generate_invoice
from app.core.models import FormData

router = APIRouter(tags=["templates"])


@router.get("/templates")
def list_templates():
    """Liste tous les templates disponibles."""
    from app.core.config import TEMPLATES_DIR

    templates = [
        f.stem for f in TEMPLATES_DIR.glob("*.docx") if f.is_file()
    ]
    return {"templates": templates}


@router.get("/forms/{template_name}")
def get_template_fields(template_name: str):
    """Récupère les champs d'un template."""
    try:
        template = load_template(template_name)
        fields = [
            {
                "name": field.name,
                "type": field.field_type.value,
                "has_currency": field.has_currency,
            }
            for field in template.fields
        ]
        return {"template_name": template.name, "fields": fields}
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Template non trouvé")


class GenerateInvoiceRequest(BaseModel):
    template_name: str
    form_data: dict[str, Any]
    currency_fields: dict[str, bool] = {}
    output_filename: str | None = None


@router.post("/generate")
def generate(request: GenerateInvoiceRequest):
    """Génère une facture depuis un template."""
    try:
        template = load_template(request.template_name)
        
        form = FormData(
            template_name=request.template_name,
            values=request.form_data,
            currency_fields=request.currency_fields,
        )
        
        save_form(form)
        
        from app.core.config import INVOICES_DIR
        
        output_path = None
        if request.output_filename:
            filename = request.output_filename
            if not filename.endswith(".docx"):
                filename += ".docx"
            output_path = INVOICES_DIR / filename
        
        output_path = generate_invoice(request.template_name, form, output_path)
        
        return {
            "success": True,
            "output_path": str(output_path),
            "filename": output_path.name,
        }
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Template non trouvé")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/templates/upload")
async def upload_template(file: UploadFile = File(...)):
    """Upload un nouveau template DOCX."""
    from app.core.config import TEMPLATES_DIR
    
    if not file.filename or not file.filename.endswith(".docx"):
        raise HTTPException(
            status_code=400,
            detail="Le fichier doit être un document DOCX"
        )

    file_path = TEMPLATES_DIR / file.filename

    try:
        with open(file_path, "wb") as f:
            f.write(await file.read())
        return {"success": True, "filename": file.filename}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/templates/{template_name}")
def delete_template(template_name: str):
    """Supprime un template."""
    from app.core.config import TEMPLATES_DIR, FORMS_DIR
    
    template_path = TEMPLATES_DIR / f"{template_name}.docx"
    
    if not template_path.exists():
        raise HTTPException(status_code=404, detail="Template non trouvé")

    try:
        template_path.unlink()
        
        # Supprimer aussi le form JSON associé s'il existe
        form_path = FORMS_DIR / f"{template_name}.json"
        if form_path.exists():
            form_path.unlink()
        
        return {
            "success": True,
            "message": f"Template '{template_name}' supprimé."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

