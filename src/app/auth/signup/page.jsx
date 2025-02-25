"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../../utils/supabase";
import { useAuth } from "../../../context/AuthContext"; // Import useAuth

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { originalPage, setOriginalPage } = useAuth(); // Use AuthContext

  useEffect(() => {
    const page = searchParams.get("originalPage");
    if (page) {
      setOriginalPage(page);
    }
  }, [searchParams, setOriginalPage]);

  const handleSignUp = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      router.push(originalPage || "/auth/signin");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">Sign Up</h1>
      <form onSubmit={handleSignUp} className="mt-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded mb-2"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded mb-2"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
          Sign Up
        </button>
      </form>
    </div>
  );
}
