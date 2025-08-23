'use client'
import Button from "../components/Button";
import { GET , POST } from "../lib/utils";
import { useState } from "react";
import AthleteDisplay from "../components/AthleteDispaly";
import Error from "../components/Error";
import { set } from "react-hook-form";
import { fetchTrainer , fetchAthlete } from "../lib/utils";
import Title from "../components/Title";

export default function FindTrainerPage() {
    const [email, setEmail] = useState("");
    const [foundUser, setFoundUser] = useState<any>(null);
    const [athlete, setAthlete] = useState<any>(null);
    const [error, setError] = useState<boolean>(false);

    async function handleSearch(e: React.FormEvent) {
        e.preventDefault(); // prevent page refresh
        if (!email.trim()) return;

        try {
            const user = await GET(`/users/get-user-by-email/?email=${email}`);
            if (!user.id) {
                setError(true);
                setFoundUser(null);
                return;
            }
            if (user.role === "athlete") {
                const athleteData = await fetchAthlete(user.id);
                setAthlete(athleteData);
            }
            else {
                setAthlete(null);
            }
            setError(false);
            console.log("user", user);
            setFoundUser(user);
        } catch (err) {
            console.error("Error fetching user:", err);
            setFoundUser(null);
        }
    }

    async function handleInvitation() {
        // Logic to handle sending an invitation to the found user
        const res = await POST(`/users/invitations/send/`, {"athlete" : foundUser.id});
        if (res.ok) {
            console.log("Invitation sent successfully");
        } else {
            const errorData = await res.json();
            console.error("Error sending invitation:", errorData.error || errorData.message || errorData);
        }
    }

    return (
        <div className="p-4">
            <Title>Find User</Title>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="flex gap-2 items-center">
                <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter user email"
                    className="border px-2 py-1 rounded flex-1"
                />
                <Button type="submit" onClick={() => { }}>Search</Button>
            </form>

            {/* Result */}
            {foundUser && athlete && (
                <div className="flex flex-col max-w-1/3 mt-4 mx-auto">
                    <AthleteDisplay user={foundUser} />
                    <Button onClick={handleInvitation}>Invite</Button>
                    <Button onClick={() => setFoundUser(null)}>Back</Button>
                </div>
            )}

            {foundUser && !athlete && (
                <div className="flex flex-col max-w-1/3 mt-4 mx-auto">
                    <p>User is not an athlete</p>
                    <Button onClick={() => setFoundUser(null)}>Back</Button>
                </div>
            )}

            {error && <Error message={"User not found"} />}
        </div>
    );
}
