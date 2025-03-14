"use client";

import "../../../styles/globals.css";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../../utils/supabaseClient";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [newPassword, setNewPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const email = searchParams.get("email");

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    try {
      // Verify OTP code
      const { error: verifyError } = await supabase.auth.verifyOtp({
        token: otpCode,
        type: "recovery",
        email: email,
      });

      if (verifyError) {
        console.error("OTP verification error:", verifyError);
        setError(`${verifyError.message}. The RESET code can only be used once.`);
        setLoading(false);
        return;
      }

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        console.error("Password update error:", updateError);
        setError(updateError.message);
      } else {
        setMessage("Password reset successful! Redirecting...");
        setTimeout(() => {
          router.push("/auth/signin");
        }, 3000);
      }
    } catch (err) {
      console.error("Failed to reset password:", err);
      setError("Failed to reset password.");
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
      <form
        onSubmit={handleResetPassword}
        className="flex flex-col gap-3 w-full max-w-sm bg-white p-4 rounded shadow"
      >
        <input
          type="text"
          placeholder="RESET CODE"
          value={otpCode}
          onChange={(e) => setOtpCode(e.target.value)}
          className="p-2 border rounded w-full"
          required
        />
        <input
          type="password"
          placeholder="NEW PASSWORD (min. 6 characters)"
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
