"use client";
import "../../../styles/globals.css";  
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../../utils/supabaseClient";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const session = supabase.auth.getSession();
    if (!session) {
      setError("Auth session missing! Please try the reset process again.");
    }
  }, []);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError(null);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setError(error.message);
      return;
    }

    setMessage("Password updated! Redirecting to login...");
    setTimeout(() => {
      router.push("/auth/signin");
    }, 3000);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4 bg-gray-100">
      <div className="w-full max-w-sm bg-white p-4 rounded shadow">
        <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>
        <form onSubmit={handleResetPassword} className="flex flex-col gap-3">
          <input
            type="password"
            placeholder="New Password"
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
            Set New Password
          </button>
        </form>
      </div>
    </div>
  );
}

