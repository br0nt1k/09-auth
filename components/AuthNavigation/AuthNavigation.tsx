"use client";

import Link from "next/link";
import css from "./AuthNavigation.module.css";
import { logoutUser } from "@/lib/api/clientApi";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";

const AuthNavigation = () => {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  const clearSsAuthenticated = useAuthStore(
    (state) => state.clearIsAuthenticated
  );

  const handleLogOut = async () => {
    await logoutUser();
    clearSsAuthenticated();
    router.replace("/sign-in");
  };

  return isAuthenticated ? (
    <>
      <li className={css.navigationItem}>
        <Link href="/profile" prefetch={false} className={css.navigationLink}>
          Profile
        </Link>
      </li>
      <li className={css.navigationItem}>
        <p className={css.userEmail}>{user?.username}</p>
        <button onClick={handleLogOut} className={css.logoutButton}>
          Logout
        </button>
      </li>
    </>
  ) : (
    <>
      <li className={css.navigationItem}>
        <Link href="/sign-in" prefetch={false} className={css.navigationLink}>
          Login
        </Link>
      </li>
      <li className={css.navigationItem}>
        <Link href="/sign-up" prefetch={false} className={css.navigationLink}>
          Sign up
        </Link>
      </li>
    </>
  );
};

export default AuthNavigation;
