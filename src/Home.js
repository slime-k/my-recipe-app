import { useState } from "react";
import { supabase } from "./supabase";

const Home = () => {
  const [foodName, setFoodName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [foodCount, setFoodCount] = useState(0);

  const insertData = async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(); // 現在のユーザーを取得
    if (userError) {
      alert("ユーザー情報の取得に失敗しました: " + userError.message);
      return;
    }

    if (!user) {
      alert("ユーザーがログインしていません");
      return;
    }

    try {
      const { error } = await supabase.from("foods").insert([
        {
          user_id: user.id, // user_idを追加
          food_name: foodName,
          expiry_date: expiryDate,
          food_count: foodCount,
        },
      ]);

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
      <h1>Home</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          insertData();
        }}
      >
        <input
          type="text"
          placeholder="Food Name"
          value={foodName}
          onChange={(e) => setFoodName(e.target.value)}
        />
        <input
          type="date"
          placeholder="Expiry Date"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
        />
        <input
          type="number"
          placeholder="Food Count"
          value={foodCount}
          onChange={(e) => setFoodCount(parseInt(e.target.value))}
        />
        <button type="submit">Insert</button>
      </form>
    </div>
  );
};

export default Home;
