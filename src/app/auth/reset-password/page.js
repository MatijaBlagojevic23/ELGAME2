"use client";

import "../../../styles/globals.css";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "../../../utils/supabaseClient";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = searchParams.get("access_token");
    if (token) {
      supabase.auth.setSession({
        access_token: token,
        refresh_token: searchParams.get("refresh_token"),
      }).then(({ error }) => {
        if (error) {
          console.error("Failed to set session:", error);
          setError("Failed to set session.");
        }
      });
    }
  }, [searchParams]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    const token = searchParams.get("access_token");
    if (!token) {
      setError("Auth session missing or invalid.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage("Password reset successful! Redirecting...");
      setTimeout(() => {
        router.push("/auth/signin"); // Redirect to login page
      }, 3000);
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
      <form onSubmit={handleResetPassword} className="flex flex-col gap-3 w-full max-w-sm bg-white p-4 rounded shadow">
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="p-2 border rounded w-full"
          required
        />
        <button
          type="submit"
          className="p-2 bg-blue-500 text-white rounded mt-2 w-full"
          disabled={loading}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {message && <p className="mt-4 text-green-500">{message}</p>}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
