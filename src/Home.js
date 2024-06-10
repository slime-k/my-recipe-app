// Home.js
import { useEffect, useState } from "react";
import { supabase } from "./supabase";

const Home = () => {
  const [foods, setFoods] = useState([]);
  const [newFood, setNewFood] = useState("");
  const [newExpiryMonth, setNewExpiryMonth] = useState("");
  const [newExpiryDay, setNewExpiryDay] = useState("");
  const [newExpiryYear, setNewExpiryYear] = useState(""); // 追加
  const [newFoodCount, setNewFoodCount] = useState("");
  const [sortBy, setSortBy] = useState("registration"); // registration or expiryDate

  useEffect(() => {
    getFoods();
  }, [sortBy]);

  const getFoods = async () => {
    try {
      let { data: foods, error } = await supabase
        .from("foods")
        .select("*")
        .order(sortBy === "expiryDate" ? "expiry_date" : "food_name", {
          ascending: true,
        });
      if (error) throw error;
      setFoods(foods);
    } catch (error) {
      alert(error.error_description || error.message);
    }
  };

  const addFood = async (e) => {
    e.preventDefault();
    try {
      const formattedExpiryDate = `${newExpiryYear}-${newExpiryMonth.padStart(
        2,
        "0"
      )}-${newExpiryDay.padStart(2, "0")}`;

      const { data, error } = await supabase.from("foods").insert([
        {
          food_name: newFood,
          expiry_date: formattedExpiryDate,
          food_count: newFoodCount,
        },
      ]);
      if (error) throw error;
      setFoods([...foods, ...data]);
      setNewFood("");
      setNewExpiryMonth("");
      setNewExpiryDay("");
      setNewExpiryYear(""); // 追加
      setNewFoodCount("");
    } catch (error) {
      alert(error.error_description || error.message);
    }
  };

  const editFood = async (name, newName, newExpiry, newCount) => {
    try {
      const { data, error } = await supabase
        .from("foods")
        .update({
          food_name: newName,
          expiry_date: newExpiry,
          food_count: newCount,
        })
        .eq("food_name", name);
      if (error) throw error;
      const updatedFoods = foods.map((food) => {
        if (food.food_name === name) {
          return {
            ...food,
            food_name: newName,
            expiry_date: newExpiry,
            food_count: newCount,
          };
        }
        return food;
      });
      setFoods(updatedFoods);
    } catch (error) {
      alert(error.error_description || error.message);
    }
  };

  const deleteFood = async (name) => {
    try {
      const { error } = await supabase
        .from("foods")
        .delete()
        .eq("food_name", name);
      if (error) throw error;
      const filteredFoods = foods.filter((food) => food.food_name !== name);
      setFoods(filteredFoods);
    } catch (error) {
      alert(error.error_description || error.message);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div style={{ width: "100%", padding: "20px" }}>
      <div style={{ marginBottom: "20px" }}>
        <button onClick={signOut}>ログアウト</button>
      </div>
      <div style={{ marginBottom: "20px" }}>
        <h2>食材の登録</h2>
        <form onSubmit={addFood}>
          <input
            type="text"
            placeholder="食材の名前"
            value={newFood}
            onChange={(e) => setNewFood(e.target.value)}
          />
          <select
            value={newExpiryMonth}
            onChange={(e) => setNewExpiryMonth(e.target.value)}
          >
            <option value="">月を選択</option>
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={(i + 1).toString().padStart(2, "0")}>
                {i + 1}
              </option>
            ))}
          </select>
          <select
            value={newExpiryDay}
            onChange={(e) => setNewExpiryDay(e.target.value)}
          >
            <option value="">日を選択</option>
            {[...Array(31)].map((_, i) => (
              <option key={i + 1} value={(i + 1).toString().padStart(2, "0")}>
                {i + 1}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="年"
            value={newExpiryYear}
            onChange={(e) => setNewExpiryYear(e.target.value)}
          />
          <input
            type="text"
            placeholder="個数"
            value={newFoodCount}
            onChange={(e) => setNewFoodCount(e.target.value)}
          />
          <button type="submit">登録</button>
        </form>
      </div>
      <div style={{ marginBottom: "20px" }}>
        <h2>食材一覧</h2>
        <div>
          <label>ソート:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="registration">登録順</option>
            <option value="expiryDate">消費期限順</option>
          </select>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid black" }}>食材の名前</th>
              <th style={{ border: "1px solid black" }}>消費期限</th>
              <th style={{ border: "1px solid black" }}>個数</th>
              <th style={{ border: "1px solid black" }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {foods.map((food, index) => (
              <tr key={index}>
                <td style={{ border: "1px solid black" }}>{food.food_name}</td>
                <td style={{ border: "1px solid black" }}>
                  {food.expiry_date}
                </td>
                <td style={{ border: "1px solid black" }}>{food.food_count}</td>
                <td style={{ border: "1px solid black" }}>
                  <button
                    onClick={() =>
                      editFood(
                        food.food_name,
                        prompt("新しい食材の名前"),
                        `${newExpiryMonth}/${newExpiryDay}/${newExpiryYear}`,
                        prompt("新しい個数")
                      )
                    }
                  >
                    編集
                  </button>
                  <button onClick={() => deleteFood(food.food_name)}>
                    削除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Home;
