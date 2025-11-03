.PHONY: install lint format test clean setup api install-libreoffice

setup:
	poetry install

install-libreoffice:
	@echo "📦 Installation de LibreOffice (requis pour la preview PDF)..."
	sudo apt-get update && sudo apt-get install -y libreoffice
	@echo "✅ LibreOffice installé avec succès !"

install:
	poetry install --no-dev

lint:
	poetry run flake8 app/ tests/
	poetry run ruff check app/ tests/

format:
	poetry run black app/ tests/

test:
	poetry run pytest tests/ -v

clean:
	@echo "🧹 Nettoyage des fichiers Python temporaires..."
	find . -type d -name __pycache__ -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete
	rm -rf .pytest_cache .ruff_cache
	@echo "✓ Nettoyage Python terminé"

clean-data:
	@echo "🗑️  Nettoyage des données (templates, forms, invoices)..."
	rm -f templates/*.docx
	rm -f forms/*.json
	rm -f invoices/*.docx
	rm -rf invoices_pdf/
	@echo "✓ Données nettoyées (fichiers .gitkeep préservés)"

clean-all: clean clean-data
	@echo "🧹 Nettoyage complet..."
	rm -rf frontend/node_modules
	rm -rf frontend/dist
	@echo "✓ Nettoyage complet terminé"

# Lance l'API backend
api:
	poetry run uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# Lance le frontend (dev)
frontend:
	cd frontend && npm run dev

# Build complet
build-icon:
	python create_icon.py

build-windows: build-icon
	python build_windows.py

build-installer: build-windows
	@echo "📦 Création de l'installateur Windows..."
	@echo "⚠️  Assurez-vous qu'Inno Setup est installé"
	@echo "Commande à exécuter manuellement: iscc installer.iss"

test-build:
	python test_build.py dist/SmartInvoiceEngine

# Commandes de développement
dev:
	@echo "🚀 Lancement de l'environnement de développement..."
	@echo "Backend: http://localhost:8000"
	@echo "Frontend: http://localhost:5173"
	@make -j2 api frontend
