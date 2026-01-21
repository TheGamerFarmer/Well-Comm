export async function useCurrentDossier(): Promise<number | null> {
    const userId = localStorage.getItem('activeRecordId');

    if (userId) {
        return Number(userId);
    }

    return null;
}