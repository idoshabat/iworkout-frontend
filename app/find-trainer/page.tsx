"use client";

import { useState } from "react";
import { GET, POST } from "../lib/utils";
import AthleteDisplay from "../components/AthleteDispaly";
import Error from "../components/Error";
import Title from "../components/Title";
import Toast from "../components/Toast";
import { useUser } from "../lib/UserContext";

export default function FindTrainerPage() {
    const { user } = useUser();
    const [email, setEmail] = useState("");
    const [foundUser, setFoundUser] = useState<any>(null);
    const [error, setError] = useState<boolean>(false);
    const [inviting, setInviting] = useState(false);
    const [invited, setInvited] = useState(false);

    // ✅ Searching state
    const [searching, setSearching] = useState(false);

    // Toast state
    const [toast, setToast] = useState<{
        message: string;
        type: "success" | "error";
        isVisible: boolean;
    }>({ message: "", type: "success", isVisible: false });

    function showToast(message: string, type: "success" | "error" = "success") {
        setToast({ message, type, isVisible: true });
    }

    async function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        if (!email.trim()) return;

        setSearching(true); // ✅ start searching

        try {
            const res = await GET(`/users/get-user-by-email/?email=${email}`);
            const foundUser = res.data;
            if (!foundUser.id) {
                setError(true);
                setFoundUser(null);
                return;
            }

            if (foundUser.role !== "trainer") {
                setError(true);
                setFoundUser(null);
                return;
            }

            setError(false);
            setFoundUser(foundUser);

            // check connection
            const athletesIds =
                foundUser?.trainer_profile?.athletes?.map((athlete: any) => athlete.id) ||
                [];
            if (athletesIds.includes(user.id)) {
                setInvited(true);
            } else {
                setInvited(false);
            }
        } catch (err) {
            console.error("Error fetching user:", err);
            setFoundUser(null);
            setError(true);
            showToast("Failed to search trainer", "error");
        } finally {
            setSearching(false); // ✅ stop searching
        }
    }

    async function handleInvitation() {
        if (!foundUser) return;
        setInviting(true);

        try {
            const res = await POST(`/users/invitations/send/`, {
                trainer: foundUser.id,
            });
            if (res.ok) {
                setInvited(true);
                showToast("Invitation sent!", "success");
            } else {
                const data = res.data;
                showToast(
                    data.error ||
                    data.message ||
                    data.non_field_errors?.[0] ||
                    "Failed to send invitation",
                    "error"
                );
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
            <Title>Find Trainer</Title>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="flex gap-2 items-center mt-4">
                <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter trainer's email"
                    className="flex-1 border border-gray-700 px-3 py-2 rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
                <button
                    type="submit"
                    className={`neon-btn-light flex items-center gap-2 ${searching ? "opacity-70 cursor-wait" : ""
                        }`}
                    disabled={searching}
                >
                    {searching && (
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    )}
                    {searching ? "Searching..." : "Search"}
                </button>
            </form>

            {/* Result */}
            {foundUser && !searching && (
                <div className="flex flex-col gap-4 mt-6 neon-card">
                    <AthleteDisplay user={foundUser} />
                    <div className="flex gap-2 flex-wrap">
                        <button
                            onClick={handleInvitation}
                            disabled={inviting || invited}
                            className={`px-4 py-2 rounded-lg font-semibold transition ${invited
                                    ? "neon-btn-green cursor-wait"
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

            {error && !searching && <Error message={"Trainer not found"} />}

            {/* Toast */}
            <Toast
                message={toast.message}
                type={toast.type}
                isVisible={toast.isVisible}
                onClose={() => setToast({ ...toast, isVisible: false })}
            />


        </div>
    );
}
