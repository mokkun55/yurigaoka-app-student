"use client";

import { Button } from "@/components/ui/button";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const handleGoogleLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:3003/api/auth/callback",
      },
    });
    router.push("/");
  };

  const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      console.error(error);
    } else {
      router.push("/");
    }
  };

  const handleStaffLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email: "staff@ktc.ac.jp",
      password: "staff",
    });

    if (error) {
      console.error(error);
    } else {
      router.push("/");
    }
  };

  return (
    <div className="flex flex-col gap-2 items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">検証用ログインページ</h1>
      <Button onClick={handleGoogleLogin}>googleでログイン</Button>
      <Button onClick={handleStaffLogin}>スタッフログイン</Button>
      <form onSubmit={handleEmailLogin} className="flex flex-col gap-2">
        <input type="email" name="email" placeholder="メールアドレス" />
        <input type="password" name="password" placeholder="パスワード" />
        <Button type="submit">メールアドレスでログイン</Button>
      </form>
    </div>
  );
}
