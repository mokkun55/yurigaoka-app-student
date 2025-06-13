"use client";

import { supabase } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    fetchUser();
  }, []);

  return (
    <div>
      <h1>hello next + supabase</h1>
      <p>{user?.email}</p>
      <button onClick={() => supabase.auth.signOut()}>Sign out</button>
    </div>
  );
}
