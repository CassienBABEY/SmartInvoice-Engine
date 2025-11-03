"""
Script de build pour créer l'application Windows SmartInvoice Engine.

Ce script :
1. Build le frontend React avec Vite
2. Package le backend Python avec PyInstaller
3. Combine les deux dans un seul dossier de distribution

Usage:
    python build_windows.py
"""
import os
import shutil
import subprocess
import sys
from pathlib import Path


def run_command(cmd: list[str], cwd: Path = None) -> bool:
    """Execute une commande et retourne True si succès."""
    try:
        result = subprocess.run(
            cmd, cwd=cwd, check=True, capture_output=True, text=True
        )
        print(result.stdout)
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Erreur: {e.stderr}")
        return False


def clean_build_dirs():
    """Nettoie les dossiers de build précédents."""
    print("🧹 Nettoyage des builds précédents...")
    dirs_to_clean = ["dist", "build", "frontend/dist"]
    for d in dirs_to_clean:
        path = Path(d)
        if path.exists():
            shutil.rmtree(path)
            print(f"  ✓ {d} supprimé")


def build_frontend():
    """Build le frontend React avec Vite."""
    print("\n📦 Build du frontend React...")
    frontend_dir = Path("frontend")

    if not frontend_dir.exists():
        print("❌ Dossier frontend/ introuvable")
        return False

    # Install dependencies
    print("  → Installation des dépendances npm...")
    if not run_command(["npm", "install"], cwd=frontend_dir):
        return False

    # Build
    print("  → Build du frontend...")
    if not run_command(["npm", "run", "build"], cwd=frontend_dir):
        return False

    print("  ✓ Frontend buildé avec succès")
    return True


def build_backend():
    """Build le backend Python avec PyInstaller."""
    print("\n📦 Build du backend Python...")

    # Vérifier que PyInstaller est installé
    try:
        import PyInstaller
    except ImportError:
        print("❌ PyInstaller non installé. Installation...")
        if not run_command([sys.executable, "-m", "pip", "install", "pyinstaller"]):
            return False

    # Build avec PyInstaller
    print("  → Package du backend avec PyInstaller...")
    if not run_command(["pyinstaller", "build.spec", "--clean"]):
        return False

    print("  ✓ Backend packagé avec succès")
    return True


def create_distribution():
    """Crée le dossier de distribution final."""
    print("\n📦 Création du package de distribution...")

    dist_dir = Path("dist/SmartInvoiceEngine")
    if not dist_dir.exists():
        print(f"❌ Dossier {dist_dir} introuvable")
        return False

    # Copier le frontend buildé
    frontend_dist = Path("frontend/dist")
    frontend_target = dist_dir / "frontend"

    if frontend_dist.exists():
        print("  → Copie du frontend...")
        shutil.copytree(frontend_dist, frontend_target)
        print("  ✓ Frontend copié")
    else:
        print("⚠️  Frontend dist/ introuvable, skip")

    # Créer les dossiers de données
    print("  → Création des dossiers de données...")
    data_dirs = ["forms", "invoices", "invoices_pdf"]
    for d in data_dirs:
        (dist_dir / d).mkdir(exist_ok=True)
    print("  ✓ Dossiers créés")

    # Copier le logo
    logo = Path("logo.png")
    if logo.exists():
        shutil.copy(logo, dist_dir / "logo.png")
        print("  ✓ Logo copié")

    # Créer un fichier de version
    version_file = dist_dir / "VERSION.txt"
    version_file.write_text("SmartInvoice Engine v0.2.0\n", encoding="utf-8")

    print("  ✓ Distribution créée avec succès")
    return True


def create_launcher():
    """Crée un script de lancement simplifié."""
    print("\n📝 Création du launcher...")

    dist_dir = Path("dist/SmartInvoiceEngine")
    launcher_path = dist_dir / "SmartInvoice.bat"

    launcher_content = """@echo off
title SmartInvoice Engine
echo ====================================
echo    SmartInvoice Engine v0.2.0
echo ====================================
echo.
echo Demarrage du serveur backend...
start /B SmartInvoiceEngine.exe
timeout /t 3 /nobreak >nul
echo.
echo Ouverture de l'application...
start http://localhost:8000
echo.
echo Le serveur tourne sur http://localhost:8000
echo Fermez cette fenetre pour arreter le serveur.
echo.
pause
"""

    launcher_path.write_text(launcher_content, encoding="utf-8")
    print("  ✓ Launcher créé")
    return True


def main():
    """Fonction principale."""
    print("=" * 60)
    print("  SmartInvoice Engine - Build Windows")
    print("=" * 60)

    # Vérifier qu'on est dans le bon dossier
    if not Path("app").exists() or not Path("frontend").exists():
        print("❌ Ce script doit être exécuté à la racine du projet")
        return 1

    # 1. Nettoyage
    clean_build_dirs()

    # 2. Build frontend
    if not build_frontend():
        print("\n❌ Échec du build frontend")
        return 1

    # 3. Build backend
    if not build_backend():
        print("\n❌ Échec du build backend")
        return 1

    # 4. Créer la distribution
    if not create_distribution():
        print("\n❌ Échec de la création de la distribution")
        return 1

    # 5. Créer le launcher
    if not create_launcher():
        print("\n⚠️  Launcher non créé, mais build OK")

    print("\n" + "=" * 60)
    print("  ✅ Build terminé avec succès !")
    print("=" * 60)
    print(f"\n📁 Distribution créée dans: dist/SmartInvoiceEngine/")
    print("\nPour créer l'installateur, exécutez:")
    print("  iscc installer.iss")
    print()

    return 0


if __name__ == "__main__":
    sys.exit(main())

