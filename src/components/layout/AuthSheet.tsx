'use client';

import { FormEvent, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { getSupabaseClient } from '@/src/lib/supabase/client';

interface AuthSheetProps {
  open: boolean;
  onClose: () => void;
}

export default function AuthSheet({ open, onClose }: AuthSheetProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const handleGoogleSignIn = () => {
    window.location.href = '/auth/google-coming-soon';
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);

    try {
      const supabase = getSupabaseClient();

      if (mode === 'signup') {
        const { error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
        });

        if (signUpError) {
          setError(signUpError.message);
          return;
        }

        setSuccessMessage(
          'Account created. Please check your email to confirm your account.'
        );
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (signInError) {
          setError(signInError.message);
          return;
        }

        onClose();
      }
    } catch (submitError) {
      console.error('Auth submit error:', submitError);
      setError('Unable to complete authentication right now.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(prev => (prev === 'login' ? 'signup' : 'login'));
    setError(null);
    setSuccessMessage(null);
  };

  if (typeof document === 'undefined') return null;
  if (!open) return null;

  const modal = (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md mx-auto p-4 sm:p-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Welcome to Cryptopedia</h2>
            <p className="text-gray-600 mt-2">{mode === 'login' ? 'Login to continue' : 'Create your Cryptopedia account'}</p>
          </div>

          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center gap-3 px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors mb-4"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden>
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-sm text-gray-500">or</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent border-gray-300"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent border-gray-300"
                placeholder="Enter your password"
              />
            </div>

            {error && <div className="text-sm text-red-600">{error}</div>}
            {successMessage && (
              <div className="text-sm text-green-700">{successMessage}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-medium disabled:opacity-50 transition-colors brand-button justify-center"
            >
              {mode === 'login' ? 'Log in' : 'Create account'}
            </button>
          </form>

          <div className="text-center mt-6">
            <button onClick={toggleMode} className="brand-icon hover:opacity-90 text-sm">
              {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Log in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}

