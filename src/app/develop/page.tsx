"use client";

import { Button } from "@/_components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DevelopPage() {
  const { signOut, getUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getUser();
      setUser(userData);
    };
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="m-3 flex flex-col gap-4">
      <h1 className="text-2xl font-bold">開発用ページ</h1>

      {/* ログイン情報 */}
      <div>
        <p>
          ログイン情報:
          <span className="font-bold">
            {user ? "ログイン中" : "ログインしていません"}
          </span>
        </p>
        <p>初回登録完了: </p>
        {user && (
          <>
            <p>ユーザーID: {user.id}</p>
            <pre className="h-40 overflow-y-auto text-xs">
              {JSON.stringify(user, null, 2)}
            </pre>
            <Button
              fullWidth
              className="mt-2"
              variant="destructive"
              onClick={() => signOut()}
            >
              ログアウト
            </Button>
          </>
        )}
        <Button
          fullWidth
          className="mt-2"
          onClick={() => router.push("/develop/login")}
        >
          開発者ログインページへ
        </Button>
      </div>
    </div>
  );
}
