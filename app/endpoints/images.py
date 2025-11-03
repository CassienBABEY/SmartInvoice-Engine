"""
Routes pour la gestion des images.
"""
from fastapi import APIRouter, HTTPException, UploadFile, File
from pathlib import Path

router = APIRouter(tags=["images"])


@router.get("/images")
def list_images():
    """Liste toutes les images disponibles."""
    from app.core.config import BASE_DIR
    
    images_dir = BASE_DIR / "assets" / "images"
    images_dir.mkdir(parents=True, exist_ok=True)
    
    images = [f.name for f in images_dir.glob("*") if f.is_file() 
              and f.suffix.lower() in [".png", ".jpg", ".jpeg", ".gif", ".webp"]]
    
    return {"images": images}


@router.post("/images/upload")
async def upload_image(file: UploadFile = File(...)):
    """Upload une nouvelle image."""
    from app.core.config import BASE_DIR
    
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Le fichier doit être une image")
    
    images_dir = BASE_DIR / "assets" / "images"
    images_dir.mkdir(parents=True, exist_ok=True)
    
    file_path = images_dir / file.filename
    
    try:
        content = await file.read()
        with open(file_path, "wb") as f:
            f.write(content)
        
        return {"success": True, "filename": file.filename}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/images/{filename}")
def delete_image(filename: str):
    """Supprime une image."""
    from app.core.config import BASE_DIR
    
    images_dir = BASE_DIR / "assets" / "images"
    file_path = images_dir / filename
    
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Image non trouvée")
    
    try:
        file_path.unlink()
        return {"success": True, "message": f"Image {filename} supprimée"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

