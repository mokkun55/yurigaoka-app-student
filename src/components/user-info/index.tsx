import { createClient } from "@/utils/supabase/server";

export default async function UserInfo() {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();
  return (
    <div>
      <p>メールアドレス: {user?.user?.email}</p>
      <p>ユーザーID: {user?.user?.id}</p>
      <pre className="text-xs h-40 overflow-y-auto">
        {JSON.stringify(user, null, 2)}
      </pre>
    </div>
  );
}
