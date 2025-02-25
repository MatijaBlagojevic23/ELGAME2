"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../utils/supabase";
import { useAuth } from "../../../context/AuthContext";
import dynamic from "next/dynamic";

const useSearchParams = dynamic(() => import("next/navigation").then(mod => mod.useSearchParams), { ssr: false });

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();
  const { originalPage, setOriginalPage } = useAuth();

  const SearchParamsWrapper = () => {
    const searchParams = useSearchParams();

    useEffect(() => {
      const page = searchParams.get("originalPage");
      if (page) {
        setOriginalPage(page);
      }
    }, [searchParams, setOriginalPage]);

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      router.push(originalPage || "/");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4 bg-gray-100">
      <Suspense fallback={<div>Loading...</div>}>
        <SearchParamsWrapper />
      </Suspense>
      <h1 className="text-2xl font-bold mb-4">Sign In</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full max-w-sm bg-white p-4 rounded shadow">
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
          Sign In
        </button>
      </form>
    </div>
  );
}
