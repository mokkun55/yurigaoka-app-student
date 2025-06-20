import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";

export function useAuth() {
  const router = useRouter();

  const signOut = async () => {
    await supabase.auth.signOut();
    // cookieを削除
    document.cookie =
      "is_registered=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/login");
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:3003/api/auth/callback",
      },
    });
    if (error) {
      return error;
    }
    router.push("/");
  };

  const getUser = async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error) {
      // エラーが発生した場合はログインしていないとみなす
      // console.error(error);
      return null;
    }
    return user;
  };

  // TODO 後で消す
  const signInWithEmail = async (email: string, password: string) => {
    await supabase.auth.signInWithPassword({ email, password });
    router.push("/");
  };

  // TODO 後で消す
  const signInWithStaff = async () => {
    await supabase.auth.signInWithPassword({
      email: "staff@ktc.ac.jp",
      password: "staff",
    });
    router.push("/");
  };

  return {
    signOut,
    signInWithGoogle,
    signInWithEmail,
    signInWithStaff,
    getUser,
  };
}
