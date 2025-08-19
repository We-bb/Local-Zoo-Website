"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { FaHome } from "react-icons/fa";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const validateName = (val: string) => {
    if (!val.trim()) return "Name is required.";
    if (/\d/.test(val)) return "Name cannot contain numbers.";
    if (/\s{2,}/.test(val)) return "Name cannot contain extra spaces.";
    return "";
  };

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

  const validateConfirmPassword = (val: string) => {
    if (!val) return "Please confirm your password.";
    if (val !== password) return "Passwords do not match.";
    return "";
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      name: validateName(name),
      email: validateEmail(email),
      password: validatePassword(password),
      confirmPassword: validateConfirmPassword(confirmPassword),
    };
    setErrors(newErrors);

    if (Object.values(newErrors).some((err) => err !== "")) return;

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert("Error: " + err.error);
        return;
      }

      alert("User registered successfully!");
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setErrors({ name: "", email: "", password: "", confirmPassword: "" });

      router.push("/login");
    } catch (err) {
      console.error(err);
      alert("Server error. Please try again.");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 p-6 relative">
      {/* Home icon in top-left */}
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center space-x-1 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
      >
        <FaHome size={24} />
        <span className="hidden sm:inline font-semibold"></span>
      </Link>

      <div className="w-full max-w-md bg-gray-100 dark:bg-gray-800 p-8 rounded-2xl shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100 text-center">
          Sign Up
        </h1>

        <form onSubmit={handleSignUp} className="space-y-4">
          {/* Name */}
          <div>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrors({ ...errors, name: validateName(e.target.value) });
              }}
              className={`w-full border ${
                errors.name
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 dark:border-gray-700 focus:ring-blue-500"
              } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-3 rounded focus:outline-none focus:ring-2`}
              required
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

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
                errors.email
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 dark:border-gray-700 focus:ring-blue-500"
              } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-3 rounded focus:outline-none focus:ring-2`}
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
                setErrors({
                  ...errors,
                  password: validatePassword(e.target.value),
                });
              }}
              className={`w-full border ${
                errors.password
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 dark:border-gray-700 focus:ring-blue-500"
              } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-3 rounded focus:outline-none focus:ring-2`}
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

          {/* Confirm Password */}
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setErrors({
                  ...errors,
                  confirmPassword: validateConfirmPassword(e.target.value),
                });
              }}
              className={`w-full border ${
                errors.confirmPassword
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 dark:border-gray-700 focus:ring-blue-500"
              } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-3 rounded focus:outline-none focus:ring-2`}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              {showConfirmPassword ? (
                <EyeOffIcon size={20} />
              ) : (
                <EyeIcon size={20} />
              )}
            </button>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-lg font-semibold transition-colors"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-blue-700 dark:text-blue-400 font-semibold hover:underline"
          >
            Back to Login
          </Link>
        </p>
      </div>
    </main>
  );
}
