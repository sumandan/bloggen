import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { updatePassword } from '../../lib/auth';
import { cn } from '../../lib/utils';
import { validatePassword } from '../../lib/validation';

export function ResetPasswordForm() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate password
    const validation = validatePassword(password);
    if (!validation.isValid) {
      setError(validation.message || 'Invalid password');
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError(null);

    const response = await updatePassword(password);

    if (response.success) {
      navigate('/');
    } else {
      setError(response.error);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-2">Reset Password</h2>
          <p className="text-lg text-gray-500 mb-8">
            Enter your new password below
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="new-password" className="block text-base font-medium text-gray-700 mb-2">
              New Password
            </label>
            <input
              id="new-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={cn(
                "block w-full rounded-lg border shadow-sm py-3.5 px-4",
                "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500",
                "text-base bg-white transition-colors duration-200",
                "border-gray-300 hover:border-gray-400"
              )}
              placeholder="Enter your new password"
            />
          </div>

          <div>
            <label htmlFor="confirm-password" className="block text-base font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              id="confirm-password"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={cn(
                "block w-full rounded-lg border shadow-sm py-3.5 px-4",
                "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500",
                "text-base bg-white transition-colors duration-200",
                "border-gray-300 hover:border-gray-400"
              )}
              placeholder="Confirm your new password"
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm p-3 bg-red-50 rounded-lg border border-red-100" role="alert">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={cn(
              "w-full h-12 flex justify-center items-center gap-2 py-3 px-4",
              "border border-transparent rounded-md shadow-sm",
              "text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700",
              "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
              "transition-colors duration-200",
              loading && "opacity-50 cursor-not-allowed"
            )}
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              "Reset Password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}