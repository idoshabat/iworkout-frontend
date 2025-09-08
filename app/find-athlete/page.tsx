'use client'

import { GET, POST } from "../lib/utils";
import { useState } from "react";
import AthleteDisplay from "../components/AthleteDispaly";
import Error from "../components/Error";
import Title from "../components/Title";
import { useUser } from "../lib/UserContext";

export default function FindTrainerPage() {
    const { user } = useUser();
    const [email, setEmail] = useState("");
    const [foundUser, setFoundUser] = useState<any>(null);
    const [athlete, setAthlete] = useState<any>(null);
    const [error, setError] = useState<boolean>(false);
    const [inviting, setInviting] = useState(false);
    const [invited, setInvited] = useState(false);

    async function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        if (!email.trim()) return;

        try {
            const res = await GET(`/users/get-user-by-email/?email=${email}`);
            const foundUser = res.data;
            if (!foundUser.id) {
                setError(true);
                setFoundUser(null);
                return;
            }

            if (foundUser.role === "athlete") {
                // const athleteData = await fetchAthlete(user.id);
                const athleteData = foundUser.athlete_profile;
                setAthlete(athleteData);
            } else {
                setAthlete(null);
            }

            setError(false);
            setFoundUser(foundUser);
            const trainerIds = foundUser?.athlete_profile?.trainers?.map((trainer: any) => trainer.id) || [];
            console.log('Trainer IDs:', trainerIds);
            console.log('User ID',user.id);
            if (trainerIds.includes(user.id)) {
                setInvited(true);
            } else {
                setInvited(false);
            }
        } catch (err) {
            console.error("Error fetching user:", err);
            setFoundUser(null);
            setError(true);
        }
    }

    async function handleInvitation() {
        if (!foundUser) return;
        setInviting(true);

        try {
            const res = await POST(`/users/invitations/send/`, { athlete: foundUser.id });
            if (res.ok) {
                setInvited(true);
            } else {
                // check common error keys
                const errorMessage =
                    res.data?.non_field_errors?.[0] || // DRF's ValidationError
                    res.data?.detail ||                // DRF's PermissionDenied/NotFound
                    "Failed to send invitation";

                alert(errorMessage);
            }
        } catch (err) {
            console.error(err);
            alert("Failed to send invitation");
        } finally {
            setInviting(false);
        }
    }



    return (
        <div className="p-6 max-w-lg mx-auto">
            <Title>Find Trainer</Title>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="flex gap-2 items-center mt-4">
                <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter trainer's email"
                    className="flex-1 border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    Search
                </button>
            </form>

            {/* Result */}
            {foundUser && athlete && (
                <div className="flex flex-col gap-4 mt-6">
                    <AthleteDisplay user={foundUser} />
                    <div className="flex gap-2 flex-wrap">
                        <button
                            onClick={handleInvitation}
                            disabled={inviting || invited}
                            className={`px-4 py-2 rounded-lg text-white transition ${invited
                                ? "bg-green-500 cursor-default"
                                : inviting
                                    ? "bg-yellow-500 cursor-wait"
                                    : "bg-blue-600 hover:bg-blue-700"
                                }`}
                        >
                            {invited ? "Invited" : inviting ? "Inviting..." : "Invite"}
                        </button>
                        <button
                            onClick={() => setFoundUser(null)}
                            className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-400 transition"
                        >
                            Back
                        </button>
                    </div>
                </div>
            )}

            {foundUser && !athlete && (
                <div className="flex flex-col gap-4 mt-6 text-center">
                    <p className="text-gray-600">User is not an athlete</p>
                    <button
                        onClick={() => setFoundUser(null)}
                        className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-400 transition"
                    >
                        Back
                    </button>
                </div>
            )}

            {error && <Error message={"User not found"} />}
        </div>
    );
}
