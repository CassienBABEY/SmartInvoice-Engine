"""
Script de test pour vérifier que le build est fonctionnel.

Usage:
    python test_build.py [dist_directory]
"""
import sys
from pathlib import Path


def test_build_structure(dist_dir: Path) -> bool:
    """Vérifie que la structure du build est correcte."""
    print("🔍 Vérification de la structure du build...")

    required_files = [
        "SmartInvoiceEngine.exe",
        "SmartInvoice.bat",
        "logo.png",
        "VERSION.txt",
    ]

    required_dirs = [
        "frontend",
        "templates",
        "forms",
        "invoices",
        "invoices_pdf",
        "assets/images",
    ]

    all_ok = True

    # Vérifier les fichiers
    for file in required_files:
        file_path = dist_dir / file
        if file_path.exists():
            print(f"  ✓ {file}")
        else:
            print(f"  ✗ {file} - MANQUANT")
            all_ok = False

    # Vérifier les dossiers
    for directory in required_dirs:
        dir_path = dist_dir / directory
        if dir_path.exists() and dir_path.is_dir():
            print(f"  ✓ {directory}/")
        else:
            print(f"  ✗ {directory}/ - MANQUANT")
            all_ok = False

    return all_ok


def test_frontend_build(dist_dir: Path) -> bool:
    """Vérifie que le frontend a été buildé correctement."""
    print("\n🔍 Vérification du build frontend...")

    frontend_dir = dist_dir / "frontend"
    if not frontend_dir.exists():
        print("  ✗ Dossier frontend/ manquant")
        return False

    index_html = frontend_dir / "index.html"
    if not index_html.exists():
        print("  ✗ index.html manquant")
        return False

    assets_dir = frontend_dir / "assets"
    if not assets_dir.exists() or not any(assets_dir.iterdir()):
        print("  ✗ Dossier assets/ vide ou manquant")
        return False

    print("  ✓ Frontend buildé correctement")
    return True


def test_version_file(dist_dir: Path) -> bool:
    """Vérifie le fichier de version."""
    print("\n🔍 Vérification du fichier de version...")

    version_file = dist_dir / "VERSION.txt"
    if not version_file.exists():
        print("  ✗ VERSION.txt manquant")
        return False

    content = version_file.read_text(encoding="utf-8")
    if "SmartInvoice Engine" not in content:
        print("  ✗ VERSION.txt invalide")
        return False

    print(f"  ✓ Version : {content.strip()}")
    return True


def test_launcher(dist_dir: Path) -> bool:
    """Vérifie le launcher Windows."""
    print("\n🔍 Vérification du launcher...")

    launcher = dist_dir / "SmartInvoice.bat"
    if not launcher.exists():
        print("  ✗ SmartInvoice.bat manquant")
        return False

    content = launcher.read_text(encoding="utf-8")
    required_lines = [
        "SmartInvoiceEngine.exe",
        "http://localhost:8000",
    ]

    for line in required_lines:
        if line not in content:
            print(f"  ✗ Ligne manquante dans le launcher : {line}")
            return False

    print("  ✓ Launcher valide")
    return True


def estimate_size(dist_dir: Path) -> None:
    """Estime la taille de la distribution."""
    print("\n📊 Estimation de la taille...")

    total_size = 0
    for file in dist_dir.rglob("*"):
        if file.is_file():
            total_size += file.stat().st_size

    size_mb = total_size / (1024 * 1024)
    print(f"  Taille totale : {size_mb:.2f} MB")

    if size_mb > 500:
        print("  ⚠️  La distribution est volumineuse (> 500 MB)")
    else:
        print("  ✓ Taille raisonnable")


def main():
    """Fonction principale."""
    print("=" * 60)
    print("  SmartInvoice Engine - Test du Build")
    print("=" * 60)

    # Déterminer le dossier de distribution
    if len(sys.argv) > 1:
        dist_dir = Path(sys.argv[1])
    else:
        dist_dir = Path("dist/SmartInvoiceEngine")

    if not dist_dir.exists():
        print(f"\n❌ Dossier de distribution introuvable : {dist_dir}")
        print("\nUsage:")
        print("  python test_build.py [dist_directory]")
        print("\nExemple:")
        print("  python test_build.py dist/SmartInvoiceEngine")
        return 1

    print(f"\n📁 Répertoire testé : {dist_dir.absolute()}\n")

    # Exécuter les tests
    tests = [
        ("Structure", test_build_structure),
        ("Frontend", test_frontend_build),
        ("Version", test_version_file),
        ("Launcher", test_launcher),
    ]

    results = []
    for test_name, test_func in tests:
        try:
            result = test_func(dist_dir)
            results.append((test_name, result))
        except Exception as e:
            print(f"\n❌ Erreur lors du test {test_name} : {e}")
            results.append((test_name, False))

    # Estimation de la taille
    estimate_size(dist_dir)

    # Résumé
    print("\n" + "=" * 60)
    print("  Résumé des Tests")
    print("=" * 60)

    all_passed = True
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"  {status} : {test_name}")
        if not result:
            all_passed = False

    print("=" * 60)

    if all_passed:
        print("\n✅ Tous les tests sont passés !")
        print("\nÉtapes suivantes :")
        print("  1. Testez manuellement : double-cliquez sur SmartInvoice.bat")
        print("  2. Créez l'installateur : iscc installer.iss")
        print("  3. Testez l'installateur sur une machine Windows propre")
        return 0
    else:
        print("\n❌ Certains tests ont échoué.")
        print("Vérifiez les erreurs ci-dessus et relancez le build.")
        return 1


if __name__ == "__main__":
    sys.exit(main())

