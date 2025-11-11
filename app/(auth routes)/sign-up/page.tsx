"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import css from "./SignUpPage.module.css";
import { getMe, registerUser, UserRequest } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

const SignUpPage = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const { setIsAuthenticated, setUser } = useAuthStore.getState();

  const handleSubmit = async (formData: FormData) => {
    try {
      const registerValues: UserRequest = {
        email: String(formData.get("email")),
        password: String(formData.get("password")),
      };
      await registerUser(registerValues);
      setIsAuthenticated(true);
      const user = await getMe();
      setUser(user);
      router.push("/profile");
    } catch (error) {
      setError("Register failed. Please check your credentials.");
      console.error("Register failed", error);
    }
  };

  return (
    <main className={css.mainContent}>
      <h1 className={css.formTitle}>Sign up</h1>
      <form className={css.form} action={handleSubmit}>
        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            className={css.input}
            required
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            className={css.input}
            required
          />
        </div>

        <div className={css.actions}>
          <button type="submit" className={css.submitButton}>
            Register
          </button>
        </div>

        <p className={css.error}>{error}</p>
      </form>
    </main>
  );
};

export default SignUpPage;
