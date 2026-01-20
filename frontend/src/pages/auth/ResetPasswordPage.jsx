import { useState } from "react";
import { motion } from "motion/react";
import { useNavigate, useParams } from "react-router-dom";
import { Lock } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "../../stores/useAuthStore";
import Input from "../../components/Input";

const ResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { resetPassword, error, isLoading, message } = useAuthStore();

  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // if (newPassword !== confirmPassword) {
    //   alert("Passwords do not match");
    //   return;
    // }
    try {
      await resetPassword(token, newPassword, confirmPassword);

      toast.success(
        "Password reset successfully, redirecting to login page...",
      );
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error(error);
    //   toast.error(error.message || "Error resetting password");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
    >
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-6 text-center bg-linear-to-r from-pink-400 to-rose-500 text-transparent bg-clip-text">
          Reset Password
        </h2>

        <form onSubmit={handleSubmit}>
          <Input
            icon={Lock}
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <Input
            icon={Lock}
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          {message && <p className="text-pink-500 text-sm mb-4">{message}</p>}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 px-4 bg-linear-to-r from-pink-500 to-rose-600 text-white font-bold rounded-lg shadow-lg hover:from-pink-600 hover:to-rose-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Resetting..." : "Set New Password"}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};
export default ResetPasswordPage;
