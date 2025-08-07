'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import toast from 'react-hot-toast';


const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        toast.error(res.error || "Login failed");
        setLoading(false);
        return;
      }

      router.push('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      toast.error('An error occurred during login');
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="border p-2 rounded"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="border p-2 rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <p className="text-right text-sm">
  <a href="/forgot-password" className="text-red-500 hover:underline">
    Forgot Password?
  </a>
</p>


      <p className="mt-4 text-center">
        Don't have an account?{' '}
        <a href="/register" className="text-red-500 hover:underline">
           Sign Up
        </a>
      </p>
    </div>
  );
};

export default LoginPage;

