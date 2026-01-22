#!/bin/bash

# Créer le dossier logs s'il n'existe pas
mkdir -p logs

# Fonction pour arrêter les processus
cleanup() {
    echo ""
    echo "Arrêt de l'application..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

echo "Démarrage de WellComm..."


echo "Lancement du backend..."
java -jar deploy/wellcomm-backend.jar --spring.config.location=file:./application.properties > logs/backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend démarré (PID: $BACKEND_PID) - Logs: logs/backend.log"


echo "Attente du démarrage du backend..."
sleep 5


echo "Lancement du frontend..."
npx serve -s deploy/frontend -l 3000 > logs/frontend.log 2>&1 &
FRONTEND_PID=$!
echo "Frontend démarré (PID: $FRONTEND_PID) - Logs: logs/frontend.log"

echo ""
echo "=========================================="
echo "Application démarrée !"
echo "=========================================="
echo "Backend : http://localhost:8080"
echo "Frontend : http://localhost:3000"
echo ""
echo "Logs disponibles dans :"
echo "  - logs/backend.log"
echo "  - logs/frontend.log"
echo ""
echo "Pour arrêter l'application, appuyez sur Ctrl+C"

trap cleanup SIGINT SIGTERM

wait
