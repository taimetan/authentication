import { useState } from "react";
import { motion } from "motion/react";
import { LoaderIcon, LucideLock, LucideMail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/Input";
import { useAuthStore } from "../../stores/useAuthStore";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, error, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/");
      toast.success("Login succesfully!");
    } catch (error) {
      return error;
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full bg-gray-800/50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
    >
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-6 text-center bg-linear-to-r from-pink-400 to-rose-500 text-transparent bg-clip-text">
          Welcome Back
        </h2>

        <form action="" onSubmit={handleLogin}>
          <Input
            icon={LucideMail}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            icon={LucideLock}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-red-500 font-semibold mt-2">{error}</p>}
          <div className="flex justify-start items-center mb-6">
            <Link
              to="/forgot-password"
              className="text-sm text-pink-500 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <motion.button
            className="w-full py-3 px-4 bg-linear-to-r from-pink-500 to-rose-600 text-white 
						font-bold rounded-lg shadow-lg hover:from-pink-600
						hover:to-rose-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2
						 focus:ring-offset-gray-900 transition duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <LoaderIcon className="size-6 animate-spin mx-auto" />
            ) : (
              "Login"
            )}
          </motion.button>
        </form>
      </div>
      <div className="px-8 py-4 bg-gray-900/50 flex justify-center">
        <p className="text-gray-400 text-sm">
          Don't have an account?{" "}
          <Link to="/signup" className="text-pink-500 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default LoginPage;
