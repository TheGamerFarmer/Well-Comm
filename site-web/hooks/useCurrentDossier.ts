import { useEffect, useState } from "react";

export function useCurrentDossier(userName: string | null) {
    const [currentDossier, setCurrentDossier] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userName) return;

        const fetchCurrent = async () => {
            try {
                const res = await fetch(
                    `http://localhost:8080/api/${userName}/records/current-record`,
                    {   method: "GET",
                        credentials: "include" }
                );

                if (res.status === 204) {
                    setCurrentDossier(null);
                } else if (res.ok) {
                    setCurrentDossier(await res.json());
                }
            } catch (e) {
                console.error(e);
                setCurrentDossier(null);
            } finally {
                setLoading(false);
            }
        };

        fetchCurrent();
    }, [userName]);

    return { currentDossier, loading };
}
