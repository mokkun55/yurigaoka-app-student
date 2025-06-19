"use client";

import InputLabel from "@/_components/ui/input-label";
import { BaseInput } from "@/_components/ui/input/base-input";
import { Button } from "@/_components/ui/button";

export default function StudentAuthPage() {
  return (
    <div className="flex flex-col gap-4 w-[300px] content-center">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-2xl font-bold">寮生認証が必要です</h1>
        <p className="text-(--sub-text)">
          先生から伝えられた
          <br />
          招待コードを入力してください
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <InputLabel label="招待コード">
          <BaseInput placeholder="例: JJXRUJN6" />
        </InputLabel>
        <Button
          onClick={() => {
            // TODO 実装する
            alert("認証する");
          }}
        >
          認証する
        </Button>
      </div>
    </div>
  );
}
