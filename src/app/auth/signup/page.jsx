"use client";
import "../../../styles/globals.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../utils/supabase";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    // Sign up user
    const { user, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    // Insert user data into 'users' table
    const { error: insertError } = await supabase
      .from("users")
      .insert([
        {
          user_id: user.id,  // Use the user ID from authentication
          email: email,
          username: username, // Insert username
        },
      ]);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    // Show confirmation message
    setMessage("Check your email to confirm your account!");

    // Redirect after delay
    setTimeout(() => {
      router.push("/auth/signin");
    }, 3000); // 3 seconds delay
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
