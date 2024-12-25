import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { signIn, signUp } from '../../lib/auth';
import { cn } from '../../lib/utils';
import { validatePassword } from '../../lib/validation';
import { ForgotPasswordForm } from './ForgotPasswordForm';

export function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError(null);
    setPasswordError(null);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    
    if (isSignUp && newPassword) {
      const validation = validatePassword(newPassword);
      setPasswordError(validation.message || null);
    } else {
      setPasswordError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSignUp) {
      const validation = validatePassword(password);
      if (!validation.isValid) {
        setPasswordError(validation.message || 'Invalid password');
        return;
      }
    }
    
    setLoading(true);
    setError(null);

    const response = await (isSignUp ? signUp(email, password) : signIn(email, password));

    if (response.success) {
      navigate('/dashboard');
    } else {
      setError(response.error);
      if (response.error?.includes('Please sign in instead')) {
        setIsSignUp(false);
      }
    }
    setLoading(false);
  };

  if (showForgotPassword) {
    return <ForgotPasswordForm onBack={() => setShowForgotPassword(false)} />;
  }

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-2">Get Started</h2>
        <p className="text-lg text-gray-500 mb-8">
          {isSignUp ? 'Welcome to BlogSpace - Let\'s create your account' : 'Welcome back to BlogSpace'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8">
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-base font-medium text-gray-700 mb-2">
              Email address
            </label>
            <div className="mt-1">
              <input
                autoComplete="email"
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={cn(
                  "block w-full rounded-lg border shadow-sm py-3.5 px-4",
                  "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500",
                  "text-base bg-white transition-colors duration-200",
                  "border-gray-300 hover:border-gray-400"
                )}
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="password" className="block text-base font-medium text-gray-700">
              Password
              </label>
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
              >
                Forgot?
              </button>
            </div>
            <div className="mt-1">
              <input
                autoComplete={isSignUp ? "new-password" : "current-password"}
                id="password"
                type="password"
                required
                value={password}
                onChange={handlePasswordChange}
                className={cn(
                  "block w-full rounded-lg border shadow-sm py-3.5 px-4",
                  "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500",
                  "text-base bg-white transition-colors duration-200",
                  "hover:border-gray-400",
                  passwordError ? "border-red-300" : "border-gray-300"
                )}
                minLength={6}
                placeholder={isSignUp ? "Create a password" : "Enter your password"}
              />
            </div>
            {passwordError && (
              <p className="mt-1 text-sm text-red-500 min-h-[20px]">{passwordError}</p>
            )}
          </div>
        </div>

        {error && (
          <div className="text-red-500 text-sm mt-6 p-3 bg-red-50 rounded-lg border border-red-100" role="alert">
            {error}
          </div>
        )}

        <div className="mt-8 space-y-4">
          <button
            type="submit"
            disabled={loading}
            className={cn(
              "w-full h-12 flex justify-center items-center gap-2 py-3 px-4",
              "border border-transparent rounded-md shadow-sm",
              "text-sm font-medium text-white",
              isSignUp ? "bg-emerald-600 hover:bg-emerald-700" : "bg-indigo-600 hover:bg-indigo-700",
              "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
              "transition-colors duration-200",
              loading && "opacity-50 cursor-not-allowed"
            )}
          >
            {loading ? (
              <div className="h-5 w-5 flex items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
            ) : (
              isSignUp ? "Sign up" : "Sign in"
            )}
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-500">
              {isSignUp ? "Already have an account? " : "Need an account? "}
              <button
                type="button"
                onClick={toggleMode}
                className="text-indigo-600 hover:text-indigo-500 font-medium transition-colors duration-200"
              >
                {isSignUp ? "Log in" : "Sign up"}
              </button>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}