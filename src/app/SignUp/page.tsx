"use client";

import { useState } from "react";
import supabase from "@/lib/supabaseClient";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignUp = async () => {
    setError("");
    setSuccess("");
    if (!validateEmail(email)) {
      setError("Invalid email format");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });

      if (signUpError) {
        setError(`SignUp Error: ${signUpError.message}`);
        setLoading(false);
        return;
      }

      const { error: insertError } = await supabase.from("users").insert([
        { email },
      ]);

      if (insertError) {
        setError(`User Insert Error: ${insertError.message}`);
        setLoading(false);
        return;
      }

      setSuccess("Sign up successful! Please check your email for verification.");
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black">
      <div className="p-8 bg-black rounded-lg w-80 border-2">
        <h2 className="text-2xl text-white font-semibold mb-4">Sign Up</h2>
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
        {success && <div className="text-green-500 text-sm mb-4">{success}</div>}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border mb-4 rounded bg-black text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-label="Email"
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border mb-4 rounded bg-black text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-label="Password"
        />

        <button
          onClick={handleSignUp}
          className={`w-full py-2 text-white rounded ${
            loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
          }`}
          disabled={loading}
          aria-disabled={loading}
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
      </div>
    </div>
  );
};

export default SignUp;