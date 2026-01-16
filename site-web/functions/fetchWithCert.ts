export async function fetchWithCert(url: string, options: any = {}) {
    const fetchOptions = { ...options };

     if (typeof window === 'undefined') {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
         try {
            const fs = require("fs");
            const path = require("path");
            const certPath = path.join("/etc/ssl/certs/selfsigned.crt");
            
            if (!fs.existsSync(certPath)) {
                 console.warn(`[SSL] Certificat absent: ${certPath}`);
            }
        } catch (e) {
         }
    }

    return fetch(url, fetchOptions);
}
