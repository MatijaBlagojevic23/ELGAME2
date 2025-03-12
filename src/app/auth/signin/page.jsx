"use client";
import "../../../styles/globals.css";  
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../utils/supabase";

export default function SignInPage() {
  const [identifier, setIdentifier] = useState(""); // Can be email or username
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    let emailToUse = identifier;

    // Check if the identifier is a username or email
    if (!identifier.includes("@")) {
      const { data, error: userError } = await supabase
        .from("users")
        .select("email")
        .eq("username", identifier)
        .single();

      if (userError || !data) {
        setError("User not found.");
        return;
      }

      emailToUse = data.email; // Use the found email
    }

    // Authenticate with Supabase using the email
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: emailToUse,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      return;
    }

    router.push("/"); // Redirect to home
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Sign In</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full max-w-sm bg-white p-4 rounded shadow">
        <input
          type="text"
          placeholder="Username or Email"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          className="p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 border rounded"
          required
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Sign In
        </button>
      </form>
      <p className="mt-2 text-sm">
        Don't have an account? <a href="/auth/signup" className="text-blue-600">Sign Up</a>
      </p>
    </div>
  );
}
