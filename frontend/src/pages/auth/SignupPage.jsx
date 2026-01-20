import { motion } from "motion/react";
import Input from "../../components/Input";
import { LoaderIcon, LucideLock, LucideMail, LucideUser } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PasswordStrengthMeter from "../../components/PasswordStrengthMeter.jsx";
import { useAuthStore } from "../../stores/useAuthStore.js";

const SignupPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { signup, error, isLoading } = useAuthStore();
  const handleSignUp = async (e) => {
    e.preventDefault();
    // Handle sign-up logic here
    try {
      await signup( firstName, lastName, email, password);
      navigate("/verify-email");
    } catch (error) {
      console.log(error);
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
          Create Account
        </h2>
        <form action="POST" onSubmit={handleSignUp}>
          <div className="grid grid-cols-2 gap-4">
            <Input
              icon={LucideUser}
              type="text"
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <Input
              icon={LucideUser}
              type="text"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
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
            placeholder='Password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-red-500 font-semibold mt-2">{error}</p>}
          <PasswordStrengthMeter password={password} />

          <motion.button
            className="mt-5 w-full py-3 px-4 bg-linear-to-r from-pink-500 to-rose-600 text-white 
						font-bold rounded-lg shadow-lg hover:from-pink-600
						hover:to-rose-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2
						 focus:ring-offset-gray-900 transition duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? <LoaderIcon className=' animate-spin mx-auto' size={24} /> : "Sign Up"}
          </motion.button>
        </form>
      </div>
      <div className="px-8 py-4 bg-gray-900/50 flex justify-center">
        <p className="text-gray-400 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-pink-500 hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default SignupPage;
