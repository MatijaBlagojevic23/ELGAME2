"use client";

import { signIn } from "next-auth/react";

export default function SignInPage() {
  const handleSignIn = async () => {
    await signIn("credentials", {
      callbackUrl: "/", // Redirect after login
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">Sign In</h1>
      <button
        onClick={handleSignIn}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Sign In
      </button>
    </div>
  );
}
