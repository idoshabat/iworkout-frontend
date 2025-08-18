'use client'
import { GET } from "@/app/lib/utils";
import { useEffect, useState } from "react";

export default function Home() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    GET("/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        {/* Spinner */}
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-4">
      {users.length > 0 ? (
        users.map((user) => (
          <div key={user.id} className="mb-4 p-2 border rounded-lg">
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No users found.</p>
      )}
    </div>
  );
}
