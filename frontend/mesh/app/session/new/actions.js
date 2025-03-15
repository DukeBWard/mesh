'use server';

export async function createSession(sessionData, token) {
  try {
    const response = await fetch('http://localhost:8080/api/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(sessionData),
    });

    if (!response.ok) {
      throw new Error('Failed to create session');
    }

    return response.json();
  } catch (error) {
    throw new Error('Failed to create session: ' + error.message);
  }
} 