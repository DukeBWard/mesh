'use server';

export async function login(email, password) {
  try {
    const response = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error('Login failed: ' + error.message);
  }
}

export async function signup(email, username, password) {
  try {
    const response = await fetch('http://localhost:8080/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, username, password }),
    });

    if (!response.ok) {
      throw new Error('Signup failed');
    }

    const data = await response.json();
    
    return data;
  } catch (error) {
    throw new Error('Signup failed: ' + error.message);
  }
}
