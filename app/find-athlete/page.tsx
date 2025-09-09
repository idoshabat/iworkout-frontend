'use client'

import { GET, POST } from "../lib/utils";
import { useState } from "react";
import AthleteDisplay from "../components/AthleteDispaly";
import Error from "../components/Error";
import Title from "../components/Title";
import { useUser } from "../lib/UserContext";
import Toast from "../components/Toast"; // 👈 import Toast

export default function FindAthletePage() {
    const { user } = useUser();
    const [email, setEmail] = useState("");
    const [foundUser, setFoundUser] = useState<any>(null);
    const [athlete, setAthlete] = useState<any>(null);
    const [error, setError] = useState<boolean>(false);
    const [inviting, setInviting] = useState(false);
    const [invited, setInvited] = useState(false);

    // Toast state
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
    const [isToastVisible, setIsToastVisible] = useState(false);

    const showToast = (message: string, type: "success" | "error") => {
        setToast({ message, type });
        setIsToastVisible(true);
    };

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
                const athleteData = foundUser.athlete_profile;
                setAthlete(athleteData);
            } else {
                setAthlete(null);
            }

            setError(false);
            setFoundUser(foundUser);

            const trainerIds = foundUser?.athlete_profile?.trainers?.map((trainer: any) => trainer.id) || [];
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
                showToast("Invitation sent successfully ✅", "success");
            } else {
                const errorMessage =
                    res.data?.non_field_errors?.[0] ||
                    res.data?.detail ||
                    "Failed to send invitation";
                showToast(errorMessage, "error");
            }
        } catch (err) {
            console.error(err);
            showToast("Failed to send invitation", "error");
        } finally {
            setInviting(false);
        }
    }

    return (
        <div className="p-6 max-w-lg mx-auto">
            <Title>Find Athlete</Title>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="flex gap-2 items-center mt-4">
                <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter athlete's email"
                    className="flex-1 border border-gray-700 px-3 py-2 rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
                <button type="submit" className="neon-btn-blue">
                    Search
                </button>
            </form>

            {/* Result */}
            {foundUser && athlete && (
                <div className="flex flex-col gap-4 mt-6 neon-card">
                    <AthleteDisplay user={foundUser} />
                    <div className="flex gap-2 flex-wrap">
                        <button
                            onClick={handleInvitation}
                            disabled={inviting || invited}
                            className={`px-4 py-2 rounded-lg font-semibold transition ${
                                invited
                                    ? "neon-btn-green cursor-default"
                                    : inviting
                                    ? "neon-btn-yellow cursor-wait"
                                    : "neon-btn-blue"
                            }`}
                        >
                            {invited ? "Invited" : inviting ? "Inviting..." : "Invite"}
                        </button>
                        <button
                            onClick={() => setFoundUser(null)}
                            className="px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition font-semibold"
                        >
                            Back
                        </button>
                    </div>
                </div>
            )}

            {foundUser && !athlete && (
                <div className="flex flex-col gap-4 mt-6 text-center neon-card">
                    <p className="text-gray-300">User is not an athlete</p>
                    <button
                        onClick={() => setFoundUser(null)}
                        className="px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition font-semibold"
                    >
                        Back
                    </button>
                </div>
            )}

            {error && <Error message={"User not found"} />}

            {/* Toast */}
            <Toast
                message={toast?.message || ""}
                type={toast?.type || "success"}
                isVisible={isToastVisible}
                onClose={() => setIsToastVisible(false)}
            />

            {/* Neon Styles */}
            <style jsx>{`
                .neon-card {
                    background: #111;
                    border: 1px solid rgba(0, 255, 247, 0.3);
                    border-radius: 1rem;
                    padding: 1.5rem;
                    box-shadow: 0 0 15px rgba(0, 255, 247, 0.2), 0 0 25px rgba(110, 0, 255, 0.2);
                    transition: transform 0.2s, box-shadow 0.2s;
                }
                .neon-card:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 0 25px rgba(0, 255, 247, 0.4), 0 0 35px rgba(110, 0, 255, 0.4);
                }
                .neon-btn-blue {
                    background: linear-gradient(90deg, #6e00ff, #00fff7);
                    color: white;
                    font-weight: 600;
                    text-align: center;
                    box-shadow: 0 0 8px #6e00ff, 0 0 12px #00fff7;
                    transition: transform 0.2s, box-shadow 0.2s;
                    padding: 0.5rem 1.5rem;
                    border-radius: 0.75rem;
                }
                .neon-btn-blue:hover {
                    transform: scale(1.05);
                    box-shadow: 0 0 15px #6e00ff, 0 0 25px #00fff7;
                }
                .neon-btn-yellow {
                    background: linear-gradient(90deg, #FFD700, #FFA500);
                    color: black;
                    box-shadow: 0 0 8px #FFD700, 0 0 12px #FFA500;
                }
                .neon-btn-green {
                    background: linear-gradient(90deg, #00ff7f, #00c851);
                    color: black;
                    box-shadow: 0 0 8px #00ff7f, 0 0 12px #00c851;
                }
            `}</style>
        </div>
    );
}
