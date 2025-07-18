import React, { useState } from "react";
import { Heart, Eye, EyeOff, Mail, Lock, User as UserIcon } from "lucide-react";

/**
 * Polished Authentication Form with clean UI and login/signup toggle.
 * Tailwind CSS required.
 */
const AuthForm = ({ onAuth }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const err = {};
    if (!formData.email) err.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) err.email = "Invalid email";
    if (!formData.password) err.password = "Password is required";
    if (!isLogin) {
      if (!formData.name) err.name = "Name is required";
      if (!formData.confirmPassword) err.confirmPassword = "Confirm your password";
      if (formData.password !== formData.confirmPassword) err.confirmPassword = "Passwords do not match";
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleChange = (e) => {
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: null });
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    // Simulate an API call
    setTimeout(() => {
      setSubmitting(false);
      const user = {
        name: formData.name || "User",
        email: formData.email,
        role: "admin",
      };
      if (onAuth) onAuth(user);
    }, 900);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-2xl w-full max-w-md pt-8 px-7 pb-7 border border-gray-100">
        <div className="flex flex-col items-center mb-7">
          <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg mb-2">
            <Heart className="text-white" size={38} />
          </div>
          <span className="text-2xl font-extrabold text-gray-800 tracking-tight">Donation<span className="text-pink-500">Hub</span></span>
          <span className="text-gray-500 mt-1 font-medium text-sm">Making a difference together</span>
        </div>
        <div className="mt-2 flex justify-center mb-6">
          <button
            className={`w-1/2 py-2 rounded-l-lg text-sm font-semibold transition-all duration-200 ${
              isLogin ? "bg-indigo-600 text-white shadow" : "bg-gray-50 text-gray-600"
            }`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={`w-1/2 py-2 rounded-r-lg text-sm font-semibold transition-all duration-200 ${
              !isLogin ? "bg-indigo-600 text-white shadow" : "bg-gray-50 text-gray-600"
            }`}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>
        <form className="space-y-5" onSubmit={handleSubmit} autoComplete="off">
          {!isLogin && (
            <div>
              <label className="block font-medium text-sm text-gray-700 mb-1">Name</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input
                  name="name"
                  type="text"
                  className={`pl-10 input input-bordered w-full py-2 rounded-lg border ${
                    errors.name ? "border-red-300" : "border-gray-300"
                  } focus:border-indigo-400`}
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full name"
                />
              </div>
              {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
            </div>
          )}
          <div>
            <label className="block font-medium text-sm text-gray-700 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input
                name="email"
                type="email"
                className={`pl-10 input input-bordered w-full py-2 rounded-lg border ${
                  errors.email ? "border-red-300" : "border-gray-300"
                } focus:border-indigo-400`}
                value={formData.email}
                onChange={handleChange}
                placeholder="you@email.com"
              />
            </div>
            {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="block font-medium text-sm text-gray-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                className={`pl-10 pr-10 input input-bordered w-full py-2 rounded-lg border ${
                  errors.password ? "border-red-300" : "border-gray-300"
                } focus:border-indigo-400`}
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute right-3 top-2.5 text-gray-400"
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
          </div>
          {!isLogin && (
            <div>
              <label className="block font-medium text-sm text-gray-700 mb-1">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input
                  name="confirmPassword"
                  type="password"
                  className={`pl-10 input input-bordered w-full py-2 rounded-lg border ${
                    errors.confirmPassword ? "border-red-300" : "border-gray-300"
                  } focus:border-indigo-400`}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Retype password"
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-600 mt-1">{errors.confirmPassword}</p>
              )}
            </div>
          )}
          <button
            type="submit"
            className={`w-full py-2 rounded-lg font-semibold text-white transition bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-pink-500 hover:to-indigo-500 shadow ${
              submitting && "opacity-60 cursor-not-allowed"
            }`}
            disabled={submitting}
          >
            {submitting ? (
              <span>
                <svg className="animate-spin h-5 w-5 inline mr-2" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  ></path>
                </svg>
                Please wait...
              </span>
            ) : isLogin ? (
              "Login"
            ) : (
              "Create Account"
            )}
          </button>
        </form>
        <div className="text-center mt-7">
          <span className="text-sm text-gray-600">
            {isLogin ? "Don't have an account?" : "Already registered?"}{" "}
            <button
              className="font-medium text-indigo-600 hover:underline"
              onClick={() => setIsLogin((v) => !v)}
            >
              {isLogin ? "Sign up" : "Login"}
            </button>
          </span>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
