const sha256 = require("crypto-js/sha256");

module.exports = password => sha256("salut je met du sel sur mon hash zftgvbh" + password + "Bonjour, Ceci est du poivre pour un hash pour du sha256 aueaie").toString();