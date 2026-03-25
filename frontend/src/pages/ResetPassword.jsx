import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../services/auth/useAuth";

export default function ResetPassword() {
  const { org, uid, token } = useParams(); // uid and token from URL
  const navigate = useNavigate();
  const { resetPassword } = useAuth(); // ✅ useAuth function

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await resetPassword({ uid, token, password }); // ✅ call context function
      setMessage(res.detail || "Password reset successful. You can now login.");
      
      // Optionally redirect to login page after a short delay
      setTimeout(() => navigate(`/${org}/login`), 3000);
    } catch (err) {
      setError(err.message || "Failed to reset password");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Reset Password
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Set a new password for <span className="font-medium text-gray-800">{org}</span>
        </p>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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