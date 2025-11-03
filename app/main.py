"""
SmartInvoice Engine - API Backend

Point d'entrée de l'application.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from app.router import api_router

# ============================================================================
# APPLICATION
# ============================================================================

app = FastAPI(
    title="SmartInvoice Engine",
    description="Génération de factures depuis templates DOCX",
    version="0.2.0",
)

# CORS (frontend local)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclure les routes
app.include_router(api_router)

# ============================================================================
# ROUTE RACINE
# ============================================================================

@app.get("/")
def root():
    """Point d'entrée de l'API."""
    return {
        "name": "SmartInvoice Engine",
        "version": "0.2.0",
        "status": "running",
    }

# ============================================================================
# POINT D'ENTRÉE
# ============================================================================

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)

