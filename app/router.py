"""
Router principal - Charge tous les endpoints.
"""
from fastapi import APIRouter

from app.endpoints import templates, images, invoices, defaults

# Router principal
api_router = APIRouter()

# Inclure tous les endpoints
api_router.include_router(templates.router)
api_router.include_router(images.router)
api_router.include_router(invoices.router)
api_router.include_router(defaults.router)

