"use client";

import React, { useState } from "react";
import { supabase } from "@/utils/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    if (error) {
      console.error(error);
    }
  };

  const handleSignup = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });
    if (error) {
      console.error(error);
    }
  };

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
        <h2 className="text-lg font-semibold mb-2">
          メールでログイン / サインアップ
        </h2>
        <form className="space-y-4 mb-6" onSubmit={handleLogin}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email:
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={handleEmailChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password:
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={handlePasswordChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="flex space-x-2">
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition"
            >
              Log in
            </button>
            <button
              type="button"
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition"
              onClick={handleSignup}
            >
              Sign up
            </button>
          </div>
        </form>

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
