"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { FaHome } from "react-icons/fa";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  // Check if user is already signed in
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
      router.push(user.isAdmin ? `/admin/${user.id}` : `/user/${user.id}`);
    }
  }, []);

  // Validation functions
  const validateEmail = (val: string) => {
    if (!val.trim()) return "Email is required.";
    if (!/^[A-Za-z]+@[A-Za-z]+\.[A-Za-z]{2,}$/.test(val))
      return "Invalid email format.";
    return "";
  };

  const validatePassword = (val: string) => {
    if (!val) return "Password is required.";
    if (val.length < 4) return "Password must be at least 4 characters.";
    return "";
  };

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      email: validateEmail(email),
      password: validatePassword(password),
    };
    setErrors(newErrors);

    if (Object.values(newErrors).some((err) => err !== "")) return;

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const user = await res.json();
        localStorage.setItem("authToken", user.token);
        localStorage.setItem("currentUser", JSON.stringify(user));
        router.push(user.isAdmin ? `/admin/${user.id}` : `/user/${user.id}`);
      } else {
        const err = await res.json();
        alert("Error: " + err.error);
      }
    } catch (err) {
      console.error(err);
      alert("Server error. Please try again.");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 p-6 relative">
      {/* Home Icon */}
      <Link
        href="/"
        className="absolute top-6 left-6 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 z-50"
      >
        <FaHome size={24} />
      </Link>

      <div className="w-full max-w-md bg-gray-100 dark:bg-gray-800 p-8 rounded-2xl shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100 text-center">
          Login
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email */}
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors({ ...errors, email: validateEmail(e.target.value) });
              }}
              className={`w-full border ${
                errors.email ? "border-red-500" : "border-gray-300 dark:border-gray-700"
              } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-3 rounded focus:outline-none focus:ring-2 ${
                errors.email ? "focus:ring-red-500" : "focus:ring-blue-500"
              }`}
              required
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors({ ...errors, password: validatePassword(e.target.value) });
              }}
              className={`w-full border ${
                errors.password ? "border-red-500" : "border-gray-300 dark:border-gray-700"
              } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-3 rounded focus:outline-none focus:ring-2 ${
                errors.password ? "focus:ring-red-500" : "focus:ring-blue-500"
              }`}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
            </button>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-lg font-semibold transition-colors"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600 dark:text-gray-400">
          Don’t have an account?{" "}
          <Link
            href="/signup"
            className="text-blue-700 dark:text-blue-400 font-semibold hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </main>
  );
}
