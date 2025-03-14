'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import LoginPage from './login/page';

export default function Home() {
  const router = useRouter();
  const [code, setCode] = useState('// Start coding here...');

  const createSession = async () => {
    const sessionId = Math.random().toString(36).substring(2, 8);
    // TODO: Save session to backend
    router.push(`/session/${sessionId}`);
  };

  return (
    <LoginPage></LoginPage>
  );
}
