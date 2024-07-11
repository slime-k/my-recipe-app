//Login.js
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "./supabase";

const Login = () => {
  const [isLogin, setIsLogin] = useState(false);
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
        alert(
          "メールアドレスの確認が必要です。メールボックスを確認し、確認リンクをクリックしてください。"
        );
      } else {
        alert(error.error_description || error.message);
      }
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        setIsLogin(true);
        setRegistrationSuccess(false);
      }
    };
    checkSession();
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <div>
        <h1>{isLogin ? "ログイン" : "登録"}</h1>
      </div>
      {registrationSuccess && (
        <div style={{ color: "green", marginBottom: "16px" }}>
          登録が完了しました！メールを確認し、メールアドレスを確認してください。
        </div>
      )}
      <div>
        <form onSubmit={handleSubmit(handleAuth)}>
          {!isLogin && (
            <div style={{ marginBottom: "16px" }}>
              <input
                type="text"
                placeholder="ユーザー名"
                {...register("username", {
                  required: "ユーザー名は必須です",
                  minLength: {
                    value: 2,
                    message: "ユーザー名は2文字以上で入力してください",
                  },
                })}
              />
              {errors.username && <p>{errors.username.message}</p>}
            </div>
          )}
          <div style={{ marginBottom: "16px" }}>
            <input
              type="email"
              placeholder="Email"
              {...register("email", {
                required: "メールアドレスは必須です",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(jp)$/,
                  message:
                    "有効なメールアドレスを入力してください (.jp で終わるもの)",
                },
              })}
            />
            {errors.email && <p>{errors.email.message}</p>}
          </div>
          <div style={{ marginBottom: "16px" }}>
            <input
              type="password"
              placeholder="Password"
              {...register("password", {
                required: "パスワードは必須です",
                minLength: {
                  value: 8,
                  message: "パスワードは8文字以上で入力してください",
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
                  message:
                    "パスワードは大文字、小文字、数字を含む必要があります",
                },
              })}
            />
            {errors.password && <p>{errors.password.message}</p>}
          </div>
          <div style={{ marginBottom: "16px" }}>
            <span onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? "登録" : "ログイン"}モードへ切り替える
            </span>
          </div>
          <div>
            <button type="submit">{isLogin ? "ログイン" : "登録"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;