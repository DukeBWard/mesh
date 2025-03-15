'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login, signup } from './actions';

export default function LoginPage() {
    // track if sign up or login
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (event) => {
    // normal form submissions refreshes, no good
    event.preventDefault();
    setError('');

    const formData = new FormData(event.target);
    const email = formData.get('email');
    const password = formData.get('password');
    
    try {
      if (isLogin) {
        const data = await login(email, password);
        // Store the auth token if returned
        if (data.token) {
          localStorage.setItem('authToken', data.token);
        }
        // Redirect to new session page after successful login
        router.push('/session/new');
      } else {
        const username = formData.get('username');
        await signup(email, username, password);
      }

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-700">{isLogin ? 'Login' : 'Sign Up'}</h2>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 text-slate-700 px-3 py-2"
            />
          </div>

          {!isLogin && (
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="mt-1 block w-full rounded-md border border-gray-300 text-slate-700 px-3 py-2"
              />
            </div>
          )}

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 text-slate-700 px-3 py-2"
            />
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <div className="text-center">
          <button
          // this is where isLogin is set 
          // condition ? valueIfTrue : valueIfFalse
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            {isLogin ? 'Need an account? Sign up' : 'Already have an account? Login'}
          </button>
        </div>
      </div>
    </div>
  );
}
