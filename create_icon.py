"""
Script pour convertir logo.png en logo.ico pour Windows.
Nécessite Pillow: pip install pillow
"""
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("❌ Pillow non installé. Installation...")
    import subprocess
    import sys

    subprocess.check_call([sys.executable, "-m", "pip", "install", "pillow"])
    from PIL import Image


def create_windows_icon():
    """Crée un fichier .ico multi-résolutions depuis logo.png."""
    logo_path = Path("logo.png")

    if not logo_path.exists():
        print("❌ logo.png introuvable")
        return False

    print("🎨 Création de l'icône Windows...")

    # Charger l'image
    img = Image.open(logo_path)

    # Convertir en RGBA si nécessaire
    if img.mode != "RGBA":
        img = img.convert("RGBA")

    # Tailles standard pour les icônes Windows
    sizes = [(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)]

    # Créer les images redimensionnées
    icons = []
    for size in sizes:
        resized = img.resize(size, Image.Resampling.LANCZOS)
        icons.append(resized)

    # Sauvegarder en .ico
    ico_path = Path("logo.ico")
    icons[0].save(
        ico_path,
        format="ICO",
        sizes=sizes,
        append_images=icons[1:],
    )

    print(f"✅ Icône créée : {ico_path}")
    print(f"   Tailles : {', '.join(f'{w}x{h}' for w, h in sizes)}")
    return True


if __name__ == "__main__":
    create_windows_icon()

