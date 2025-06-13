"use client";

import { supabase } from "@/utils/supabase/client";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Logout() {
  useEffect(() => {
    const signOut = async () => {
      await supabase.auth.signOut();
      redirect("/login");
    };
    signOut();
  }, []);
}
