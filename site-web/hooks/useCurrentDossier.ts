// hooks/useCurrentDossier.ts
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
                    { credentials: "include" } // inclut le cookie httpOnly
                );

                if (res.status === 204) {
                    setCurrentDossier(null);
                } else if (res.ok) {
                    const recordId = await res.json();
                    setCurrentDossier(recordId);
                } else {
                    setCurrentDossier(null);
                }
            } catch (err) {
                console.error(err);
                setCurrentDossier(null);
            } finally {
                setLoading(false);
            }
        };

        fetchCurrent().then();
    }, [userName]);

    return { currentDossier, loading };
}
