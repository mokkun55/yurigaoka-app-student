"use client";

import React from "react";
import { supabase } from "@/utils/supabase/client";

export default function LoginPage() {
  const handleGoogleLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:3003/api/auth/callback",
      },
    });
    if (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">ログイン</h1>

        <h2 className="text-lg font-semibold mb-2">Googleでログイン</h2>
        <form>
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition"
          >
            Googleでログイン
          </button>
        </form>
      </div>
    </div>
  );
}
