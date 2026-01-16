import https from "https";
import fs from "fs";

// On définit l'agent pour Node.js
const httpsAgent = typeof window === 'undefined' ? new https.Agent({
    ca: fs.readFileSync("/etc/ssl/certs/selfsigned.crt"),
    rejectUnauthorized: false
}) : null;

export async function fetchWithCert(url: string, options: any = {}) {
    const fetchOptions = {
        ...options,
        ...(httpsAgent ? { agent: httpsAgent } : {})
    };

    return fetch(url, fetchOptions as any);
}