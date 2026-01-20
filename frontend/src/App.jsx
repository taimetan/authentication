import FloatingShape from "./components/FloatingShape";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/auth/SignupPage";
import LoginPage from "./pages/auth/LoginPage";
import EmailVerificaionPage from "./pages/auth/EmailVerificaionPage";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./stores/useAuthStore";
import { useEffect } from "react";
import LoadingSpinner from "./components/LoadingSpinner";
import {
  ProtectedRoute,
  RedirectAuthenticatedUser,
  VerifyEmailRoute,
} from "./libs/ProtectionsRoute";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";

function App() {
  const { isCheckingAuth, checkAuth } = useAuthStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  if (isCheckingAuth) return <LoadingSpinner />;
  return (
    <div className="min-h-screen bg-linear-to-br from-fuchsia-900 via-pink-900 to-rose-900 flex items-center justify-center relative overflow-hidden">
      <FloatingShape
        color="bg-pink-500"
        size="w-64 h-64"
        top="-5%"
        left="10%"
        delay={0}
      />
      <FloatingShape
        color="bg-rose-500"
        size="w-48 h-48"
        top="70%"
        left="80%"
        delay={5}
      />
      <FloatingShape
        color="bg-fuchsia-500"
        size="w-32 h-32"
        top="40%"
        left="-10%"
        delay={2}
      />
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <RedirectAuthenticatedUser>
              <SignUpPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/login"
          element={
            <RedirectAuthenticatedUser>
              <LoginPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/verify-email"
          element={
            <VerifyEmailRoute>
              <EmailVerificaionPage />
            </VerifyEmailRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <RedirectAuthenticatedUser>
              <ForgotPasswordPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/reset-password/:token"
          element={
            <RedirectAuthenticatedUser>
              <ResetPasswordPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
