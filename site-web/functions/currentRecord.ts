export async function getCurrentDossier(userName: string) {
    const res = await fetch(
        `http://localhost:8080/api/${userName}/records/current-record`,
        { credentials: "include" }
    );

    if (res.status === 204) return null;
    if (!res.ok) throw new Error("Impossible de récupérer le dossier courant");

    return res.json(); // recordId
}
