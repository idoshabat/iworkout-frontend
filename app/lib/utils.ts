let baseURL = "https://iworkout-back.onrender.com"

export async function GET(url: string) {
    const URL = `${baseURL}${url}`;
    console.log('Fetching:', URL);
    const response = await fetch(URL, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    console.log('Response:', response);
    return response;
}
