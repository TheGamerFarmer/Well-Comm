export default async function logUser(userName: string, hashPassWord: string) : Promise<boolean | undefined> {
    try {
        const response = await fetch("http://localhost:8080/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: 'include',
            body: JSON.stringify({
                userName: userName,
                password: hashPassWord,
            }),
        });

        return response.ok;
    } catch (err) {
        console.error(err);
    }
}