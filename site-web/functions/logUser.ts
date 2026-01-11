export default async (userName: string, hashPassWord: string) => {
    try {
        const response = await fetch("http://localhost:8080/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userName: userName,
                password: hashPassWord,
            }),
        });

        return  response.ok;
    } catch (err) {
        console.error(err);
    }
}