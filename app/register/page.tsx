'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession(); 
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

    useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/dashboard'); // ✅ Replace to avoid back button return
    }
  }, [status, router]);

  const isStrongPassword = (pwd: string) => {
    return (
      /[a-z]/.test(pwd) &&
      /[A-Z]/.test(pwd) &&
      /\d/.test(pwd) &&
      /[^A-Za-z0-9]/.test(pwd) &&
      pwd.length >= 6
    );
  };

  const handleInitialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) return toast.error('Passwords do not match');
    if (!isStrongPassword(password)) return toast.error('Password is too weak');

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) return toast.error(data.error || 'Failed to send OTP');

      setShowOtpModal(true);
      toast.success('OTP sent to your email');
    } catch (err) {
      toast.error('Failed to send OTP');
    }
  };

  const handleOtpVerification = async () => {
    if (!otp) return toast.error('Enter the OTP');

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();
      if (!res.ok) return toast.error(data.error || 'OTP verification failed');

      // ✅ OTP is valid, proceed to register
      const registerRes = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const regData = await registerRes.json();
      if (!registerRes.ok) return toast.error(regData.error || 'Registration failed');

      toast.success('Registered successfully');
      router.push('/login');
    } catch (err) {
      toast.error('Something went wrong');
    } finally {
      setShowOtpModal(false);
    }
  };

  if (status === 'loading') return <p className="text-center mt-10">Checking session...</p>;
  
  return (
    <div className="p-4 max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>

      <form onSubmit={handleInitialSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded"
          required
        />
        {/* Password Strength Indicator */}
          <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">
            <ul className="list-disc list-inside space-y-1">
              <li className={/[a-z]/.test(password) ? 'text-green-600' : 'text-gray-500'}>
                At least one lowercase letter
              </li>
              <li className={/[A-Z]/.test(password) ? 'text-green-600' : 'text-gray-500'}>
                At least one uppercase letter
              </li>
              <li className={/\d/.test(password) ? 'text-green-600' : 'text-gray-500'}>
                At least one number
              </li>
              <li className={/[^A-Za-z0-9]/.test(password) ? 'text-green-600' : 'text-gray-500'}>
                At least one special character
              </li>
              <li className={password.length >= 6 ? 'text-green-600' : 'text-gray-500'}>
                Minimum 6 characters
              </li>
            </ul>
            {password.length > 0 && (
              <p className={`text-sm font-semibold ${isStrongPassword(password) ? 'text-green-600' : 'text-red-500'}`}>
                {isStrongPassword(password) ? '✅ Strong password' : '❌ Weak password'}
              </p>
            )}

          </div>
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="border p-2 rounded"
          required
        />
 

        <button
          type="submit"
          disabled={loading}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          {loading ? 'Sending OTP...' : 'Register'}
        </button>
      </form>

      {/* OTP Modal */}
      {showOtpModal && (
  <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-[#1e1e2e] p-6 rounded-xl shadow-xl max-w-sm w-full text-white">
      <h3 className="text-lg font-semibold mb-4 text-center">Enter the OTP sent to your email</h3>

      {/* Centered OTP input blocks */}
      <div className="flex justify-center gap-3 mb-6">
        {[...Array(6)].map((_, idx) => (
          <input
            key={idx}
            type="text"
            inputMode="numeric"
            maxLength={1}
            id={`otp-${idx}`}
            value={otp[idx] || ''}
            className="w-12 h-14 text-center text-2xl font-semibold text-white bg-[#101010] border border-gray-700 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-150"
            onChange={(e) => {
              const val = e.target.value.replace(/\D/, '');
              if (!val) return;

              const newOtp = otp.split('');
              newOtp[idx] = val;
              setOtp(newOtp.join(''));

              const next = document.getElementById(`otp-${idx + 1}`);
              if (next) (next as HTMLInputElement).focus();
            }}
            onKeyDown={(e) => {
              if (e.key === 'Backspace') {
                const newOtp = otp.split('');
                newOtp[idx] = '';
                setOtp(newOtp.join(''));

                if (idx > 0 && !otp[idx]) {
                  const prev = document.getElementById(`otp-${idx - 1}`);
                  if (prev) (prev as HTMLInputElement).focus();
                }
              }
            }}
          />
        ))}
      </div>

      {/* Action Buttons - left & right aligned */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => setShowOtpModal(false)}
          className="px-4 py-2 text-gray-300 border border-gray-600 rounded hover:bg-[#2a2a2a] transition"
        >
          Cancel
        </button>
        <button
          onClick={handleOtpVerification}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Verify & Register
        </button>
      </div>
    </div>
  </div>
)}


    </div>
  );
};

export default RegisterPage;

// 'use client';
// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import toast from 'react-hot-toast';

// const RegisterPage = () => {
//   const router = useRouter();

//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [otp, setOtp] = useState('');
//   const [showOtpModal, setShowOtpModal] = useState(false);

//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [loading, setLoading] = useState(false);

//   const isStrongPassword = (pwd: string) => {
//     return (
//       /[a-z]/.test(pwd) &&
//       /[A-Z]/.test(pwd) &&
//       /\d/.test(pwd) &&
//       /[^A-Za-z0-9]/.test(pwd) &&
//       pwd.length >= 6
//     );
//   };

//   const handleInitialSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (password !== confirmPassword) return toast.error('Passwords do not match');
//     if (!isStrongPassword(password)) return toast.error('Password is too weak');

//     try {
//       const res = await fetch('/api/auth/send-otp', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email }),
//       });

//       const data = await res.json();
//       if (!res.ok) return toast.error(data.error || 'Failed to send OTP');

//       setShowOtpModal(true);
//       toast.success('OTP sent to your email');
//     } catch (err) {
//       toast.error('Failed to send OTP');
//     }
//   };

//   const handleOtpVerification = async () => {
//     if (!otp) return toast.error('Enter the OTP');

//     try {
//       const res = await fetch('/api/auth/verify-otp', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, otp }),
//       });

//       const data = await res.json();
//       if (!res.ok) return toast.error(data.error || 'OTP verification failed');

//       // ✅ OTP is valid, proceed to register
//       const registerRes = await fetch('/api/auth/register', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ name, email, password }),
//       });

//       const regData = await registerRes.json();
//       if (!registerRes.ok) return toast.error(regData.error || 'Registration failed');

//       toast.success('Registered successfully');
//       router.push('/login');
//     } catch (err) {
//       toast.error('Something went wrong');
//     } finally {
//       setShowOtpModal(false);
//     }
//   };

//   return (
//     <div className="p-4 max-w-md mx-auto mt-10">
//       <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>

//       <form onSubmit={handleInitialSubmit} className="flex flex-col gap-3">
//         <input
//           type="text"
//           placeholder="Full Name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           className="border p-2 rounded"
//           required
//         />
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="border p-2 rounded"
//           required
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="border p-2 rounded"
//           required
//         />
//         {/* Password Strength Indicator */}
//           <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">
//             <ul className="list-disc list-inside space-y-1">
//               <li className={/[a-z]/.test(password) ? 'text-green-600' : 'text-gray-500'}>
//                 At least one lowercase letter
//               </li>
//               <li className={/[A-Z]/.test(password) ? 'text-green-600' : 'text-gray-500'}>
//                 At least one uppercase letter
//               </li>
//               <li className={/\d/.test(password) ? 'text-green-600' : 'text-gray-500'}>
//                 At least one number
//               </li>
//               <li className={/[^A-Za-z0-9]/.test(password) ? 'text-green-600' : 'text-gray-500'}>
//                 At least one special character
//               </li>
//               <li className={password.length >= 6 ? 'text-green-600' : 'text-gray-500'}>
//                 Minimum 6 characters
//               </li>
//             </ul>
//             {password.length > 0 && (
//               <p className={`text-sm font-semibold ${isStrongPassword(password) ? 'text-green-600' : 'text-red-500'}`}>
//                 {isStrongPassword(password) ? '✅ Strong password' : '❌ Weak password'}
//               </p>
//             )}

//           </div>
//         <input
//           type="password"
//           placeholder="Confirm Password"
//           value={confirmPassword}
//           onChange={(e) => setConfirmPassword(e.target.value)}
//           className="border p-2 rounded"
//           required
//         />
 

//         <button
//           type="submit"
//           disabled={loading}
//           className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
//         >
//           {loading ? 'Sending OTP...' : 'Register'}
//         </button>
//       </form>

//       {/* OTP Modal */}
//       {showOtpModal && (
//   <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50">
//     <div className="bg-[#1e1e2e] p-6 rounded-xl shadow-xl max-w-sm w-full text-white">
//       <h3 className="text-lg font-semibold mb-4 text-center">Enter the OTP sent to your email</h3>

//       {/* Centered OTP input blocks */}
//       <div className="flex justify-center gap-3 mb-6">
//         {[...Array(6)].map((_, idx) => (
//           <input
//             key={idx}
//             type="text"
//             inputMode="numeric"
//             maxLength={1}
//             id={`otp-${idx}`}
//             value={otp[idx] || ''}
//             className="w-12 h-14 text-center text-2xl font-semibold text-white bg-[#101010] border border-gray-700 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-150"
//             onChange={(e) => {
//               const val = e.target.value.replace(/\D/, '');
//               if (!val) return;

//               const newOtp = otp.split('');
//               newOtp[idx] = val;
//               setOtp(newOtp.join(''));

//               const next = document.getElementById(`otp-${idx + 1}`);
//               if (next) (next as HTMLInputElement).focus();
//             }}
//             onKeyDown={(e) => {
//               if (e.key === 'Backspace') {
//                 const newOtp = otp.split('');
//                 newOtp[idx] = '';
//                 setOtp(newOtp.join(''));

//                 if (idx > 0 && !otp[idx]) {
//                   const prev = document.getElementById(`otp-${idx - 1}`);
//                   if (prev) (prev as HTMLInputElement).focus();
//                 }
//               }
//             }}
//           />
//         ))}
//       </div>

//       {/* Action Buttons - left & right aligned */}
//       <div className="flex justify-between items-center">
//         <button
//           onClick={() => setShowOtpModal(false)}
//           className="px-4 py-2 text-gray-300 border border-gray-600 rounded hover:bg-[#2a2a2a] transition"
//         >
//           Cancel
//         </button>
//         <button
//           onClick={handleOtpVerification}
//           className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
//         >
//           Verify & Register
//         </button>
//       </div>
//     </div>
//   </div>
// )}


//     </div>
//   );
// };

// export default RegisterPage;