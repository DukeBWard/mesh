'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';

export default function SessionPage({ params }) {
  const [code, setCode] = useState('// Loading...');
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  useEffect(() => {
    // TODO: Fetch session data from backend
    setCode('// Session ' + id + '\n// Start coding...');
  }, [id]);

  const handleCodeChange = (value) => {
    setCode(value);
    // TODO: Sync changes with backend
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Session: {id}</h1>
          <button
            onClick={() => navigator.clipboard.writeText(window.location.href)}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded"
          >
            Copy Share Link
          </button>
        </div>
        <div className="border rounded-lg overflow-hidden">
          <CodeMirror
            value={code}
            height="600px"
            theme="dark"
            extensions={[javascript()]}
            onChange={handleCodeChange}
            className="text-sm"
          />
        </div>
      </div>
    </main>
  );
} 