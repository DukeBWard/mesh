'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createSession } from './actions';

export default function NewSessionPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sessionUrl, setSessionUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/login');
      return;
    }
    setIsAuthenticated(true);
  }, [router]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setCopied(false);

    const formData = new FormData(event.target);
    const sessionData = {
      name: formData.get('name'),
      language: formData.get('language'),
    };

    try {
      const token = localStorage.getItem('authToken');
      const response = await createSession(sessionData, token);
      const url = `${window.location.origin}/session/${response.id}`;
      setSessionUrl(url);
    } catch (err) {
      setError(err.message);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(sessionUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError('Failed to copy to clipboard');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <h1 className="text-2xl font-bold mb-6">Create New Session</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {sessionUrl ? (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded">
            Session created successfully!
          </div>
          
          <div className="border rounded-lg p-4 bg-gray-50">
            <p className="text-sm text-gray-600 mb-2">Share this link with others:</p>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                readOnly
                value={sessionUrl}
                className="flex-1 p-2 border rounded bg-white"
                onClick={(e) => e.target.select()}
              />
              <button
                onClick={copyToClipboard}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          <button
            onClick={() => router.push(sessionUrl)}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Join Session
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Session Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="My Coding Session"
            />
          </div>

          <div>
            <label htmlFor="language" className="block text-sm font-medium text-gray-700">
              Programming Language
            </label>
            <select
              id="language"
              name="language"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            >
              <option value="">Select a language</option>
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="go">Go</option>
              <option value="java">Java</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Create Session
          </button>
        </form>
      )}
    </div>
  );
} 