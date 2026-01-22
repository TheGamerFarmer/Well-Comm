#!/bin/bash

# Récupérer le chemin du dossier où se trouve le script
ROOT_DIR=$(pwd)

# 1. Lancer le Backend
echo "[1/2] Démarrage du Backend (Sortie vers backend.log)..."
cd "$ROOT_DIR/backend/WellComm/" || exit
nohup ./mvnw spring-boot:run > "$ROOT_DIR/backend.log" 2>&1 &

# 2. Lancer le Frontend
echo "[2/2] Installation et démarrage du Frontend (Sortie vers frontend.log)..."
cd "$ROOT_DIR/site-web/" || exit
# On lance l'install en clair pour voir si elle réussit, puis le run en arrière-plan
npm install
nohup npm run dev > "$ROOT_DIR/frontend.log" 2>&1 &

echo "-------------------------------------------------------"
echo "Les serveurs sont lancés !"
echo "- Backend : tail -f backend.log"
echo "- Frontend : tail -f frontend.log"
echo "-------------------------------------------------------"
