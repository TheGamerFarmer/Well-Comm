import sha256 from "crypto-js/sha256";

export function encryptPassword(password: string) : string {
    return sha256("salut je met du sel sur mon hash zftgvbh" + password + "Bonjour, Ceci est du poivre pour un hash pour du sha256 aueaie").toString();
}