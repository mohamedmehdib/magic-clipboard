"use client";

import { useEffect, useState } from "react";
import supabase from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function UpdatePassword() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) throw error;

      setMessage("Password updated successfully!");
      setTimeout(() => router.push("/sign-in"), 2000);
    } catch (error) {
      if (error instanceof Error) {
        setMessage(error.message || "Something went wrong. Please try again.");
      } else {
        setMessage("An unknown error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const validateToken = async () => {
      const { error } = await supabase.auth.getSession();
      if (error) {
        setMessage("Invalid or expired token.");
      }
    };
    validateToken();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-2 text-white">
      <div className="bg-black border-4 p-8 m-4 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4">Update Password</h1>
        {message && (
          <p className="text-center text-sm mb-4 text-green-600">{message}</p>
        )}
        <form onSubmit={handleUpdatePassword}>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium">
              New Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 border rounded mt-1 bg-black"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
