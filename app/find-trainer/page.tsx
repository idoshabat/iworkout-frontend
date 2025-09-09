"use client";

import { useState } from "react";
import { GET, POST } from "../lib/utils";
import AthleteDisplay from "../components/AthleteDispaly";
import Error from "../components/Error";
import Title from "../components/Title";
import Toast from "../components/Toast"; // 👈 import toast

export default function FindTrainerPage() {
  const [email, setEmail] = useState("");
  const [foundUser, setFoundUser] = useState<any>(null);
  const [error, setError] = useState<boolean>(false);
  const [inviting, setInviting] = useState(false);
  const [invited, setInvited] = useState(false);

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

    try {
      const res = await GET(`/users/get-user-by-email/?email=${email}`);
      const user = res.data;
      if (!user.id) {
        setError(true);
        setFoundUser(null);
        return;
      }

      if (user.role !== "trainer") {
        setError(true);
        setFoundUser(null);
        return;
      }

      setError(false);
      setFoundUser(user);

      // check if already invited
      if (
        foundUser?.athlete_profile?.trainers?.some(
          (trainer: any) => trainer.id === user.id
        )
      ) {
        setInvited(true);
      } else {
        setInvited(false);
      }
    } catch (err) {
      console.error("Error fetching user:", err);
      setFoundUser(null);
      setError(true);
      showToast("Failed to search trainer", "error");
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
        console.log("Error sending invitation:", data.non_field_errors?.[0]);
        showToast(
          data.error || data.message || data.non_field_errors?.[0] || "Failed to send invitation",
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
        <button type="submit" className="neon-btn">
          Search
        </button>
      </form>

      {/* Result */}
      {foundUser && (
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

      {error && <Error message={"Trainer not found"} />}

      {/* Toast */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />

      {/* Neon styles */}
      <style jsx>{`
        .neon-card {
          background: #111;
          border: 1px solid rgba(0, 255, 247, 0.3);
          border-radius: 1rem;
          padding: 1.5rem;
          box-shadow: 0 0 15px rgba(0, 255, 247, 0.2),
            0 0 25px rgba(110, 0, 255, 0.2);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .neon-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 0 25px rgba(0, 255, 247, 0.4),
            0 0 35px rgba(110, 0, 255, 0.4);
        }
        .neon-btn {
          display: inline-block;
          padding: 0.5rem 1.5rem;
          border-radius: 0.75rem;
          background: linear-gradient(90deg, #6e00ff, #00fff7);
          color: white;
          font-weight: 600;
          text-align: center;
          box-shadow: 0 0 10px rgba(110, 0, 255, 0.6),
            0 0 20px rgba(0, 255, 247, 0.6);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .neon-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 0 15px rgba(110, 0, 255, 0.8),
            0 0 25px rgba(0, 255, 247, 0.8);
        }
        .neon-btn-blue {
          background: linear-gradient(90deg, #6e00ff, #00fff7);
          color: white;
          font-weight: 600;
          box-shadow: 0 0 8px #6e00ff, 0 0 12px #00fff7;
        }
        .neon-btn-yellow {
          background: linear-gradient(90deg, #ffd700, #ffa500);
          color: black;
          box-shadow: 0 0 8px #ffd700, 0 0 12px #ffa500;
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
