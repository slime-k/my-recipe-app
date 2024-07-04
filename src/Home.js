import { useState, useEffect } from "react";
import { supabase } from "./supabase";

const Home = () => {
  const [foodName, setFoodName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [foodCount, setFoodCount] = useState(0);
  const [foodList, setFoodList] = useState([]);
  const [editingFood, setEditingFood] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  useEffect(() => {
    fetchFoodList();
  }, []);

  const fetchFoodList = async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError) {
      alert("ユーザー情報の取得に失敗しました: " + userError.message);
      return;
    }

    if (!user) {
      alert("ユーザーがログインしていません");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("foods")
        .select("*")
        .eq("user_id", user.id);

      if (error) throw error;
      setFoodList(data.map((item, index) => ({ ...item, order: index + 1 })));
    } catch (error) {
      alert("データの取得に失敗しました: " + error.message);
    }
  };

  const insertData = async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      alert("ユーザー情報の取得に失敗しました");
      return;
    }

    try {
      const { error } = await supabase.from("foods").insert([
        {
          user_id: user.id,
          food_name: foodName,
          expiry_date: expiryDate,
          food_count: foodCount,
        },
      ]);

      if (error) throw error;
      alert("データを追加しました");
      fetchFoodList();
      resetForm();
    } catch (error) {
      alert("データの追加に失敗しました: " + error.message);
    }
  };

  const deleteFood = async (record_id) => {
    if (!record_id) {
      console.error("Invalid record_id for deletion");
      return;
    }
    try {
      const { error } = await supabase
        .from("foods")
        .delete()
        .eq("record_id", record_id);
      if (error) throw error;
      alert("データを削除しました");
      fetchFoodList();
    } catch (error) {
      alert("データの削除に失敗しました: " + error.message);
    }
  };

  const startEditing = (food) => {
    setEditingFood(food);
    setFoodName(food.food_name);
    setExpiryDate(food.expiry_date);
    setFoodCount(food.food_count);
  };

  const updateFood = async () => {
    if (!editingFood || !editingFood.record_id) {
      console.error("Invalid record_id for update");
      return;
    }
    try {
      const { error } = await supabase
        .from("foods")
        .update({
          food_name: foodName,
          expiry_date: expiryDate,
          food_count: foodCount,
        })
        .eq("record_id", editingFood.record_id);

      if (error) throw error;
      alert("データを更新しました");
      fetchFoodList();
      resetForm();
    } catch (error) {
      alert("データの更新に失敗しました: " + error.message);
    }
  };

  const resetForm = () => {
    setEditingFood(null);
    setFoodName("");
    setExpiryDate("");
    setFoodCount(0);
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      alert("ログアウトしました");
    } catch (error) {
      alert("ログアウトに失敗しました: " + error.message);
    }
  };

  const sortedFoodList = [...foodList].sort((a, b) => {
    if (sortConfig.key === null) return 0;
    const direction = sortConfig.direction === "ascending" ? 1 : -1;
    if (a[sortConfig.key] < b[sortConfig.key]) return -1 * direction;
    if (a[sortConfig.key] > b[sortConfig.key]) return 1 * direction;
    return 0;
  });

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  return (
    <div>
      <h1>Home</h1>
      <button onClick={handleLogout}>ログアウト</button>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          editingFood ? updateFood() : insertData();
        }}
      >
        <input
          type="text"
          placeholder="食品名"
          value={foodName}
          onChange={(e) => setFoodName(e.target.value)}
        />
        <input
          type="date"
          placeholder="賞味期限"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
        />
        <input
          type="number"
          placeholder="数量"
          value={foodCount}
          onChange={(e) => setFoodCount(Number(e.target.value))}
        />
        <button type="submit">{editingFood ? "更新" : "追加"}</button>
        {editingFood && (
          <button type="button" onClick={resetForm}>
            キャンセル
          </button>
        )}
      </form>

      <h2>登録済みの食品一覧</h2>
      <div>
        <button onClick={() => requestSort("order")}>登録順でソート</button>
        <button onClick={() => requestSort("food_name")}>食品名でソート</button>
        <button onClick={() => requestSort("expiry_date")}>
          賞味期限でソート
        </button>
        <button onClick={() => requestSort("food_count")}>数量でソート</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>登録順</th>
            <th>食品名</th>
            <th>賞味期限</th>
            <th>数量</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {sortedFoodList.map((food) => (
            <tr key={food.record_id}>
              <td>{food.order}</td>
              <td>{food.food_name}</td>
              <td>{food.expiry_date}</td>
              <td>{food.food_count}</td>
              <td>
                <button onClick={() => startEditing(food)}>編集</button>
                <button onClick={() => deleteFood(food.record_id)}>削除</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Home;
