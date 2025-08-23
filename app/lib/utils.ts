const BASE_URL = "https://iworkout-back.onrender.com"

export async function GET(url: string) {
    const URL = `${BASE_URL}${url}`;
    console.log('Fetching:', URL);
    const response = await fetch(URL, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include", // important for cookies
    });
    console.log('Response status:', response.status);
    const responseData = await response.json().catch(() => ({})); // parse JSON safely
    console.log('Response data:', responseData);
    return responseData;
}

export async function POST(url: string, body: any) {
    const URL = `${BASE_URL}${url}`;
    console.log('Posting to:', URL);
    const response = await fetch(URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        credentials: "include", // important for cookies
    });
    const responseData = await response.json().catch(() => ({})); // parse JSON safely
    console.log('Response data::', responseData);
    return response;
}

export async function login(email: string, password: string) {
    const res = await fetch(`${BASE_URL}/users/login/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",   // ✅ THIS is the key

    });

    // parse JSON only once
    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.detail || "Login failed");
    }

    return data; // data.user and data.detail are available here
}


export async function logout() {
    await fetch(`${BASE_URL}/users/logout/`, {
        method: "POST",
        credentials: "include",
    });
    window.location.href = "/";
}

export async function getCurrentUser() {
    const res = await fetch(`${BASE_URL}/users/me/`, {
        method: "GET",
        credentials: "include", // <--- important: tells browser to send cookies
    });

    if (!res.ok) {
        console.log('Error fetching user:', await res.json());
        throw new Error("Not authenticated" + res.statusText);
    }

    return await res.json(); // returns the user object
}

export async function fetchAthlete(userId: string) {
    const data = await GET(`/users/athletes/${userId}`);
    return data;
    // const responseData = await data.json().catch(() => ({})); // parse JSON safely
    // return responseData;
};

export async function fetchTrainer(userId: string) {
    const data = await GET(`/users/trainers/${userId}`);
    const responseData = await data.json().catch(() => ({})); // parse JSON safely
    return responseData;
}
