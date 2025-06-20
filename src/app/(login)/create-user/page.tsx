"use client";

import { useState } from "react";
import InputLabel from "@/_components/ui/input-label";
import { BaseInput } from "@/_components/ui/input/base-input";
import { BaseSelect } from "@/_components/ui/input/base-select";
import SectionTitle from "@/_components/ui/section-title";
import { Button } from "@/_components/ui/button";

export default function RegisterPage() {
  // 寮生認証のフラグ
  const [isAuth, setIsAuth] = useState(false);

  if (!isAuth) {
    return (
      <div className="flex flex-col gap-4 w-full content-center justify-center">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-2xl font-bold">寮生認証が必要です</h1>
          <p className="text-(--sub-text)">
            先生から伝えられた
            <br />
            招待コードを入力してください
          </p>
        </div>

        <div className="flex flex-col gap-4 mx-12">
          <InputLabel label="招待コード">
            <BaseInput placeholder="例: JJXRUJN6" />
          </InputLabel>
          <Button
            onClick={() => {
              // TODO 実装する
              alert("認証する");
              // 認証成功したらフラグをtrueにする
              setIsAuth(true);
            }}
          >
            認証する
          </Button>
        </div>
      </div>
    );
  }

  if (isAuth) {
    return (
      <div className="w-full h-full flex flex-col ">
        {/* ヘッダー */}
        <div className="flex flex-col gap-1 text-center my-3">
          <h1 className="text-2xl font-bold">ようこそ百合が丘サポートへ</h1>
          <p className="text-(--sub-text)">はじめに初期設定をしてください</p>
        </div>

        <div className="mb-4">
          <SectionTitle title="あなたの情報" />
          <div className="flex flex-col gap-4">
            <InputLabel label="氏名">
              <BaseInput placeholder="例: 山田太郎" />
            </InputLabel>
            <InputLabel label="学年・クラス">
              <BaseSelect
                placeholder="学年・クラスを選択"
                options={[
                  { label: "1年1組", value: "1-1" },
                  { label: "1年2組", value: "1-2" },
                  { label: "1年3組", value: "1-3" },
                  { label: "1年4組", value: "1-4" },
                  { label: "1年5組", value: "1-5" },
                  { label: "2年1組", value: "2-1" },
                  { label: "2年2組", value: "2-2" },
                  { label: "2年3組", value: "2-3" },
                  { label: "2年4組", value: "2-4" },
                  { label: "2年5組", value: "2-5" },
                  { label: "3年I組", value: "3-I" },
                  { label: "3年M組", value: "3-M" },
                  { label: "3年E組", value: "3-E" },
                  { label: "3年CA組", value: "3-CA" },
                  // 指導寮生はどうにかする
                  { label: "指導寮生", value: "leader" },
                ]}
              />
            </InputLabel>
            <InputLabel label="部屋番号">
              <BaseInput placeholder="例: 2001" type="number" />
            </InputLabel>
            <InputLabel label="保護者氏名">
              <BaseInput placeholder="例: 山田花子" />
            </InputLabel>
          </div>
        </div>

        <div>
          <SectionTitle title="帰省先の情報" />
          <p className="text-(--sub-text) text-sm mb-4">
            よく使う帰省先(実家など)を登録してください。 後から編集できます。
          </p>
          <div className="flex flex-col gap-4">
            <InputLabel label="登録名">
              <BaseInput placeholder="例: 実家" />
            </InputLabel>
            <InputLabel label="住所">
              <BaseInput placeholder="例: 大阪府大阪市中央区" />
            </InputLabel>
            <InputLabel label="電話番号(ハイフン無し)">
              <BaseInput
                placeholder="例: 09012345678"
                type="tel"
                pattern="[0-9]{10}"
              />
            </InputLabel>
          </div>
        </div>

        <Button
          className="w-full mt-4"
          onClick={() => {
            // TODO 実装する
            alert("登録する");
          }}
        >
          登録する
        </Button>
      </div>
    );
  }
}
