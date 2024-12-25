import React, { useState } from 'react';
import { Loader2, ArrowLeft } from 'lucide-react';
import { resetPassword } from '../../lib/auth';
import { cn } from '../../lib/utils';

interface ForgotPasswordFormProps {
  onBack: () => void;
}

export function ForgotPasswordForm({ onBack }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const response = await resetPassword(email);

    if (response.success) {
      setSuccess(true);
    } else {
      setError(response.error);
    }

    setLoading(false);
  };

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
      <button
        onClick={onBack}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to login
      </button>

      <div className="text-center">
        <h2 className="text-4xl font-bold mb-2">Reset Password</h2>
        <p className="text-lg text-gray-500 mb-8">
          {success
            ? "Check your email for password reset instructions"
            : "Enter your email to receive reset instructions"}
        </p>
      </div>

      {!success && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="reset-email" className="block text-base font-medium text-gray-700 mb-2">
              Email address
            </label>
            <input
              id="reset-email"
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
              "Send Reset Instructions"
            )}
          </button>
        </form>
      )}

      {success && (
        <div className="text-center">
          <p className="text-gray-600 mb-6">
            We've sent password reset instructions to your email address. Please check your inbox and follow the link to reset your password.
          </p>
          <button
            onClick={onBack}
            className="text-indigo-600 hover:text-indigo-500 font-medium"
          >
            Return to login
          </button>
        </div>
      )}
    </div>
  );
}