import { useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../services/auth/useAuth";

export default function ForgotPassword() {
  const { org } = useParams();
  const { forgotPassword } = useAuth(); // ✅ useAuth function
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await forgotPassword(email); // ✅ call context function
      setMessage(res.detail || "Password reset instructions sent to your email.");
    } catch (err) {
      setError(err.message || "Something went wrong. Try again later.");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Forgot Password
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Enter your email to reset password for <span className="font-medium text-gray-800">{org}</span>
        </p>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-md hover:bg-indigo-700 transition"
          >
            Reset Password
          </button>

          {message && <p className="text-center text-green-600 mt-3">{message}</p>}
          {error && <p className="text-center text-red-600 mt-3">{error}</p>}
        </form>
      </div>
    </div>
  );
}