const forbiddenChars = ["\\", ";", "\"", "'", "#", "/", "<", ">", "&", "-", "?", "."];

export function sanitize(string: string) : string {
    forbiddenChars.forEach(char => {
        string = string.replace(char, "\\" + char);
    })

    return string;
}