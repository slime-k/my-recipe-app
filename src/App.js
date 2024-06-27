//App.js
import { useEffect, useState } from "react";
import Home from "./Home";
import Login from "./Login";
import { supabase } from "./supabase";

const App = () => {
  const [session, setSession] = useState(null);

  useEffect(() => {
    // セッションを取得する非同期関数
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      console.log(session); // セッション情報をコンソールに表示
    };

    // セッション取得を実行
    getSession();

    // 認証状態が変化した時にセッションを更新
    supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
    });
  }, []);

  const handleInsert = async () => {
    try {
      const { error } = await supabase
        .from("your_table_name") // ここにインサートするテーブル名を指定
        .insert([{ column1: "value1", column2: "value2" }]); // ここにインサートするデータを指定

      if (error) {
        throw error;
      }

      alert("インサートが成功しました！");
    } catch (error) {
      alert("インサートに失敗しました: " + error.message);
    }
  };

  return (
    <div>
      {session ? (
        <div>
          <Home />
          <button onClick={handleInsert}>Insert</button>
        </div>
      ) : (
        <Login />
      )}
    </div>
  );
};

export default App;
