//Login.jp
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "./supabase";

const Login = () => {
  const [isLogin, setIsLogin] = useState(false); // 初期状態をサインアップモードに設定
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleAuth = async (data) => {
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });
        if (error) throw error;
      } else {
        const { data: signUpData, error } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            data: { username: data.username },
          },
        });
        if (error) throw error;
        if (signUpData.user) {
          setRegistrationSuccess(true);
        }
      }
    } catch (error) {
      if (error.message === "Email not confirmed") {
        alert("メールアドレスの確認が必要です。メールを確認してください。");
      } else {
        alert(error.error_description || error.message);
      }
    }
  };

  useEffect(() => {
    if (registrationSuccess) {
      setIsLogin(true); // サインアップが成功したら、ログインモードに切り替える
    }
  }, [registrationSuccess]);

  return (
    <div>
      <h1>{isLogin ? "ログイン" : "サインアップ"}</h1>
      <form onSubmit={handleSubmit(handleAuth)}>
        {!isLogin && (
          <div>
            <label>ユーザー名:</label>
            <input
              {...register("username", { required: "ユーザー名は必須です" })}
            />
            {errors.username && <p>{errors.username.message}</p>}
          </div>
        )}
        <div>
          <label>メールアドレス:</label>
          <input
            {...register("email", { required: "メールアドレスは必須です" })}
          />
          {errors.email && <p>{errors.email.message}</p>}
        </div>
        <div>
          <label>パスワード:</label>
          <input
            type="password"
            {...register("password", { required: "パスワードは必須です" })}
          />
          {errors.password && <p>{errors.password.message}</p>}
        </div>
        <button type="submit">{isLogin ? "ログイン" : "サインアップ"}</button>
      </form>
      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "サインアップはこちら" : "ログインはこちら"}
      </button>
    </div>
  );
};

export default Login;
