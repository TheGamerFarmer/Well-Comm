export async function fetchWithCert(url: string, options: any = {}) {
    const fetchOptions = { ...options };

    // On n'utilise l'agent HTTPS que si on est côté serveur (Node.js)
    if (typeof window === 'undefined') {
        try {
            // Utilisation de require() dynamique pour empêcher Webpack d'importer ces modules côté client
            const https = require("https");
            const fs = require("fs");
            const path = require("path");

            const certPath = path.join(process.cwd(), "/etc/ssl/certs/selfsigned.crt");

            if (fs.existsSync(certPath)) {
                fetchOptions.agent = new https.Agent({
                    ca: fs.readFileSync(certPath),
                    rejectUnauthorized: false // Permet d'ignorer les erreurs de nom d'hôte sur IP
                });
            }
        } catch (err) {
            // Si les modules ou le fichier ne sont pas disponibles, on continue sans agent
            console.warn("Agent HTTPS non chargé (environnement non-Node ou certificat manquant)");
        }
    }

    // Le cast 'as any' est nécessaire car l'interface Fetch standard ne connaît pas la propriété 'agent'
    return fetch(url, fetchOptions as any);
}