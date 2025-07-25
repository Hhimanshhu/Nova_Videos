'use client';
import { useState } from 'react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    setLoading(false);

    if (res.ok) {
      setSubmitted(true);
    } else {
      alert('Error sending reset email.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white dark:bg-gray-900 shadow rounded">
      <h2 className="text-2xl font-bold mb-4 text-center">Forgot Password</h2>

      {submitted ? (
        <p className="text-green-600 text-center">Reset email sent! Please check your inbox.</p>
      ) : (
        <form onSubmit={handleReset} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border p-2 rounded"
          /> 
          <button
            type="submit"
            disabled={loading}
            className="bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
      )}
    </div>
  );
}
