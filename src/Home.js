// Home.js
import { useState } from "react";
import { supabase } from "./supabase";

const Home = () => {
  const [foodName, setFoodName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [foodCount, setFoodCount] = useState(0);

  const insertData = async () => {
    const { error } = await supabase
      .from('foods')
      .insert([{ food_name: foodName, expiry_date: expiryDate, food_count: foodCount }]);

    if (error) {
      console.error("Error inserting data:", error);
    } else {
      console.log("Data inserted successfully");
    }
  };

  return (
    <div>
      <h1>Home</h1>
      <form onSubmit={(e) => { e.preventDefault(); insertData(); }}>
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