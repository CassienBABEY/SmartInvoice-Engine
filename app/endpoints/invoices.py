"""
Routes pour la gestion des factures.
"""
from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from datetime import datetime

router = APIRouter(tags=["invoices"])


@router.get("/invoices")
def list_invoices():
    """Liste toutes les factures générées."""
    from app.core.config import INVOICES_DIR
    
    invoices = []
    
    for file in INVOICES_DIR.glob("*.docx"):
        if file.is_file():
            stat = file.stat()
            invoices.append({
                "filename": file.name,
                "size": stat.st_size,
                "created": datetime.fromtimestamp(stat.st_ctime).isoformat(),
                "modified": datetime.fromtimestamp(stat.st_mtime).isoformat(),
            })
    
    invoices.sort(key=lambda x: x["modified"], reverse=True)
    
    return {"invoices": invoices, "count": len(invoices)}


@router.get("/invoices/download/{filename}")
def download_invoice(filename: str):
    """Télécharge une facture DOCX."""
    from app.core.config import INVOICES_DIR
    
    file_path = INVOICES_DIR / filename
    
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Facture non trouvée")
    
    return FileResponse(
        path=file_path,
        filename=filename,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    )

@router.get("/invoices/preview/{filename}")
def preview_invoice(filename: str):
    """Génère et retourne une preview PDF d'une facture."""
    from app.services.preview_service import create_pdf_preview
    from fastapi.responses import FileResponse

    try:
        pdf_path = create_pdf_preview(filename)
        return FileResponse(path=pdf_path, media_type="application/pdf")
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Facture non trouvée")
    except Exception as e:
        error_msg = f"Erreur lors de la génération de la preview : {e}"
        raise HTTPException(status_code=500, detail=error_msg)


@router.delete("/invoices/{filename}")
def delete_invoice(filename: str):
    """Supprime une facture."""
    from app.core.config import INVOICES_DIR, BASE_DIR
    
    invoice_path = INVOICES_DIR / filename
    
    if not invoice_path.exists():
        raise HTTPException(status_code=404, detail="Facture non trouvée")

    try:
        invoice_path.unlink()
        
        # Supprimer aussi le PDF en cache s'il existe
        pdf_cache_dir = BASE_DIR / "invoices_pdf"
        pdf_filename = filename.replace(".docx", ".pdf")
        pdf_path = pdf_cache_dir / pdf_filename
        if pdf_path.exists():
            pdf_path.unlink()
        
        return {
            "success": True,
            "message": f"Facture '{filename}' supprimée."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

