'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/authContext';
import { X, Eye, EyeOff, Loader } from 'lucide-react';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignupSuccess: () => void;
  onSwitchToLogin: () => void;
}

export default function SignupModal({
  isOpen,
  onClose,
  onSignupSuccess,
  onSwitchToLogin,
}: SignupModalProps) {
  const { signup, isLoading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsSubmitting(true);

    try {
      await signup(email, password, name);
      onSignupSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 p-8 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#999999] hover:text-[#1A1A1A] transition-colors"
          aria-label="Close signup modal"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-black text-[#1A1A1A]">Create Account</h2>
          <p className="text-sm text-[#666666] mt-1">Join Maeme's for faster checkout</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div>
            <label className="block text-xs font-semibold text-[#1A1A1A] mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              placeholder="John Smith"
              className="w-full px-4 py-3 border border-[#E8E0D5] rounded-lg focus:outline-none focus:border-[#99041e] transition-colors"
              required
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-xs font-semibold text-[#1A1A1A] mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              placeholder="you@example.com"
              className="w-full px-4 py-3 border border-[#E8E0D5] rounded-lg focus:outline-none focus:border-[#99041e] transition-colors"
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-semibold text-[#1A1A1A] mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-[#E8E0D5] rounded-lg focus:outline-none focus:border-[#99041e] transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999999] hover:text-[#1A1A1A]"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p className="text-xs text-[#999999] mt-1">At least 6 characters</p>
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block text-xs font-semibold text-[#1A1A1A] mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError('');
                }}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-[#E8E0D5] rounded-lg focus:outline-none focus:border-[#99041e] transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999999] hover:text-[#1A1A1A]"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-[#FFF5F5] border border-[#FFE5E5] rounded-lg">
              <p className="text-sm text-[#99041e]">{error}</p>
            </div>
          )}

          {/* Signup Button */}
          <button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="w-full bg-[#99041e] text-white py-3 rounded-lg font-black hover:bg-[#7f0318] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader size={18} className="animate-spin" />
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>

          {/* Divider */}
          <div className="relative py-4">
            <div className="absolute inset-x-0 top-1/2 h-px bg-[#E8E0D5]" />
            <div className="relative flex justify-center">
              <span className="px-2 bg-white text-xs text-[#999999]">Or</span>
            </div>
          </div>

          {/* Login Link */}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="w-full py-3 rounded-lg border-2 border-[#99041e] text-[#99041e] font-semibold hover:bg-[#FFF5F5] transition-colors"
          >
            Already Have an Account?
          </button>
        </form>

        {/* Terms */}
        <p className="text-xs text-[#999999] text-center mt-6">
          By creating an account, you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  );
}
