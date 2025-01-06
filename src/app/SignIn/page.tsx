'use client';

import { useState, useEffect, useCallback } from 'react';
import supabase from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleSignIn = useCallback(async () => {
    setLoading(true);
    setErrorMessage('');

    try {
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError || !authData) {
        setErrorMessage("Invalid email or password. Please try again.");
        setLoading(false);
        return;
      }


      if (rememberMe) {
        localStorage.setItem('email', email);
        localStorage.setItem('password', password);
      } else {
        localStorage.removeItem('email');
        localStorage.removeItem('password');
      }

      router.push('/');
    } catch (error) {
      console.error("Unexpected error:", error);
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [email, password, rememberMe, router]);

  useEffect(() => {
    const storedEmail = localStorage.getItem('email');
    const storedPassword = localStorage.getItem('password');
    if (storedEmail && storedPassword) {
      setEmail(storedEmail);
      setPassword(storedPassword);
    }
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-black text-white">
      <div className="p-8 bg-black border-2 rounded-lg w-80">
        <h2 className="text-2xl font-semibold mb-4">Sign In</h2>
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border bg-black mb-4 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border bg-black mb-4 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
            className="mr-2"
          />
          <label htmlFor="rememberMe" className="text-sm">Remember Me</label>
        </div>
        <button
          onClick={handleSignIn}
          className={`w-full py-2 bg-blue-500 rounded ${loading ? 'opacity-50' : ''}`}
          disabled={loading}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>

        {errorMessage && (
          <p className="mt-4 text-red-500 text-sm">{errorMessage}</p>
        )}

        <div className="mt-4 text-center">
          <p className="text-sm">
            Don&apos;t have an account?{' '}
            <a href="/SignUp" className="text-blue-500 hover:underline">
              Sign Up
            </a>
          </p>
        </div>
        <div className="mt-2 text-center">
          <p className="text-sm">
            Don&apos;t Remeber your password ?{' '}
            <a href="/Reset" className="text-red-500 hover:underline">
              Reset
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
