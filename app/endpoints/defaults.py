"""
Routes pour la gestion des valeurs par défaut des formulaires.
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.defaults_service import (
    load_defaults,
    save_defaults,
    update_field_default,
)

router = APIRouter(tags=["defaults"])


@router.get("/defaults/{template_name}")
def get_defaults(template_name: str):
    """Récupère les valeurs par défaut d'un template."""
    try:
        defaults = load_defaults(template_name)
        return {"template_name": template_name, "defaults": defaults}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


class UpdateDefaultRequest(BaseModel):
    field_name: str
    value: str
    remember: bool


@router.post("/defaults/{template_name}")
def update_default(template_name: str, request: UpdateDefaultRequest):
    """Met à jour une valeur par défaut."""
    try:
        update_field_default(
            template_name, request.field_name, request.value, request.remember
        )
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


class SaveAllDefaultsRequest(BaseModel):
    defaults: dict


@router.put("/defaults/{template_name}")
def save_all_defaults(template_name: str, request: SaveAllDefaultsRequest):
    """Sauvegarde toutes les valeurs par défaut d'un template."""
    try:
        save_defaults(template_name, request.defaults)
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

