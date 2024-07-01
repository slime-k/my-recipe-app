import { useEffect, useState } from "react";
import Home from "./Home";
import Login from "./Login";
import { supabase } from "./supabase";

const App = () => {
  const [session, setSession] = useState(null);

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      console.log(session);
    };

    getSession();

    supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
    });
  }, []);

  return <div>{session ? <Home /> : <Login />}</div>;
};

export default App;
