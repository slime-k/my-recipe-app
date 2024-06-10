// signupHandler.js

// Initialize Express server and Supabase admin client
const express = require("express");
const { createClient } = require("@supabase/supabase-js");
const app = express();
app.use(express.json());
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Endpoint to handle user signup on the backend
app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  try {
    const { user, error } = await supabaseAdmin.auth.signUp(
      {
        email,
        password,
      },
      { disableEmailConfirmation: true }
    ); // Disable email confirmation
    if (error) throw error;
    res.status(200).send({ message: "User created successfully", user });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
