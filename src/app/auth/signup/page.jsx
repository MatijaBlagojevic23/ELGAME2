"use client";
import "../../../styles/globals.css";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../utils/supabase";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState(""); // Add username state
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null); // Add state for the success message
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create the user in Supabase Auth
    const { user, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    // Add username to the users table
    const { error: updateError } = await supabase
      .from('users')
      .update({ username })
      .eq('id', user.id);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    // Display the success message
    setMessage("Check your email to confirm your account!");

    // After a short delay, redirect to the sign-in page
    setTimeout(() => {
      router.push("/auth/signin"); // Redirect to sign-in page
    }, 2000); // 2 seconds delay for the message to show
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full max-w-sm bg-white p-4 rounded shadow">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="p-2 border rounded"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          Sign Up
        </button>
      </form>
      {message && (
        <p className="mt-4 text-green-500 text-sm">{message}</p>
      )}
      <p className="mt-2 text-sm">
        Already have an account?{" "}
        <a href="/auth/signin" className="text-blue-600 hover:underline">
          Sign In
        </a>
      </p>
    </div>
  );
}
