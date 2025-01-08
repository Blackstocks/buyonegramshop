import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface LoginRegisterModalProps {
  onClose: () => void;
}

export default function LoginRegisterModal({ onClose }: LoginRegisterModalProps) {
  // Control which form is shown
  const [isRegister, setIsRegister] = useState(false);

  // =========== LOGIN STATES & FUNCTION ===========
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Determine if the identifier is an email or mobile number
      const isEmail = identifier.includes('@');
      let email = identifier;

      if (!isEmail) {
        // If mobile number is used, look up the corresponding email
        const { data, error: lookupError } = await supabase
          .from('profiles')
          .select('email')
          .eq('mobile', identifier)
          .single();

        if (lookupError || !data) {
          throw new Error('User not found');
        }
        email = data.email;
      }

      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password: loginPassword
      });

      if (authError) throw authError;

      // If successful, close modal & navigate to home
      onClose();
      navigate('/');
    } catch (err: any) {
      setLoginError(err.message);
    }
  };

  // =========== REGISTER STATES & FUNCTION ===========
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
  });
  const [registerError, setRegisterError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // First create the auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });
      if (authError) throw authError;

      if (authData.user) {
        // Create the profile
        const { error: profileError } = await supabase.from('profiles').insert([
          {
            id: authData.user.id,
            name: formData.name,
            email: formData.email,
            mobile: formData.mobile,
          },
        ]);
        if (profileError) throw profileError;

        // Sign out the user after registration
        await supabase.auth.signOut();

        // Redirect to login with success message
        // (We'll close the modal, then open again if they want to login)
        onClose();
        navigate('/login');
      }
    } catch (err: any) {
      setRegisterError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ======== MODAL OVERLAY & BLUR BACKGROUND ========
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Prevent closing when clicking inside the modal */}
      <div
        className="relative w-full max-w-md p-6 bg-white rounded-lg shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button (optional) */}
        <button
          onClick={onClose}
          className="absolute text-gray-500 top-2 right-2 hover:text-gray-700"
        >
          ✕
        </button>

        {/* Toggle forms */}
        {!isRegister ? (
          // ========== LOGIN FORM ==========
          <div>
            <h2 className="mb-6 text-2xl font-bold text-center">Login</h2>
            {loginError && (
              <div className="px-4 py-3 mb-4 text-red-700 bg-red-100 border border-red-400 rounded">
                {loginError}
              </div>
            )}
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block mb-2 text-gray-700">
                  Email or Mobile Number
                </label>
                <input
                  type="text"
                  required
                  className="w-full p-2 border rounded"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Enter email or mobile number"
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-700">Password</label>
                <input
                  type="password"
                  required
                  className="w-full p-2 border rounded"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700"
              >
                Login
              </button>
            </form>

            <p className="mt-4 text-sm text-center">
              Don&apos;t have an account?{' '}
              <button
                onClick={() => setIsRegister(true)}
                className="text-indigo-600 hover:underline"
              >
                Register
              </button>
            </p>
          </div>
        ) : (
          // ========== REGISTER FORM ==========
          <div>
            <h2 className="mb-6 text-2xl font-bold text-center">Register</h2>
            {registerError && (
              <div className="px-4 py-3 mb-4 text-red-700 bg-red-100 border border-red-400 rounded">
                {registerError}
              </div>
            )}
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block mb-2 text-gray-700">Name</label>
                <input
                  type="text"
                  required
                  className="w-full p-2 border rounded"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-700">Email</label>
                <input
                  type="email"
                  required
                  className="w-full p-2 border rounded"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-700">Mobile Number</label>
                <input
                  type="tel"
                  required
                  className="w-full p-2 border rounded"
                  value={formData.mobile}
                  onChange={(e) =>
                    setFormData({ ...formData, mobile: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-700">Password</label>
                <input
                  type="password"
                  required
                  className="w-full p-2 border rounded"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Registering...' : 'Register'}
              </button>
            </form>

            <p className="mt-4 text-sm text-center">
              Already have an account?{' '}
              <button
                onClick={() => setIsRegister(false)}
                className="text-indigo-600 hover:underline"
              >
                Login
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
