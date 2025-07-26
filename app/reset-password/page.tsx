'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get('token');


  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
  if (!token) {
    alert('Invalid or expired reset link');
    router.push('/login');
  }
}, [token, router]);


  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      alert('Passwords do not match');
      return;
    }

    setLoading(true);

    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    });

    setLoading(false);

    if (res.ok) {
      setDone(true);
    } else {
      const err = await res.json();
      alert(err.error || 'Reset failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white dark:bg-gray-900 shadow rounded">
      <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>

      {done ? (
        <p className="text-green-600 text-center">✅ Password updated! Please <a className="text-blue-500 underline" href="/login">login</a>.</p>
      ) : (
        <form onSubmit={handleReset} className="flex flex-col gap-4">
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border p-2 rounded"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            className="border p-2 rounded"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      )}
    </div>
  );
}
