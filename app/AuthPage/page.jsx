'use client';
import { useappstore } from '../store';
import { useState } from 'react';
import { LogIn, UserPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';

const AuthPage = () => {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const {userinfo,setuserinfo}=useappstore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const { name, email, phone, password } = formData;

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const payload = isLogin ? { email, password } : { name, email, phone, password };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setuserinfo(data.user);

      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      // Store token in localStorage or cookies
      if (data.token) {
        localStorage.setItem('token', data.token);
      }

      // Redirect user based on their role
      if (data.user) {
        switch(data.user.role) {
          case 'tailor':
            router.push('/tailor/dashboard');
            break;
          case 'delivery':
            router.push('/delivery/dashboard');
            break;
          default:
            router.push('/');
        }
      } else {
        // For login where we might not return full user data
        router.push('/dashboard');
      }

    } catch (error) {
      setLoading(false);
      setErrorMsg(error.message);
      console.error('Authentication error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-pearl flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-navy text-pearl p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">
              {isLogin ? 'Welcome Back!' : 'Create Account'}
            </h2>
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="flex items-center gap-1 text-gold hover:text-gold/80 transition"
            >
              {isLogin ? (
                <>
                  <UserPlus size={18} />
                  <span>Sign Up</span>
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  <span>Login</span>
                </>
              )}
            </button>
          </div>
          <p className="mt-2 text-pearl/80">
            {isLogin ? 'Login to manage your orders' : 'Join now'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-medium text-navy mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  className="w-full px-4 py-3 border rounded-lg"
                  required
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-navy mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              className="w-full px-4 py-3 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-navy mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={isLogin ? 'Enter password' : 'Create password'}
              className="w-full px-4 py-3 border rounded-lg"
              required
              minLength={6}
            />
          </div>

          {!isLogin && (
            <div className="flex items-start">
              <input 
                type="checkbox" 
                id="terms" 
                className="mt-1 rounded text-gold" 
                required 
              />
              <label htmlFor="terms" className="ml-2 text-sm text-navy/80">
                I agree to the <a href="#" className="text-gold hover:underline">Terms</a> and{' '}
                <a href="#" className="text-gold hover:underline">Privacy Policy</a>
              </label>
            </div>
          )}

          {errorMsg && (
            <p className="text-red-500 text-sm">{errorMsg}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-navy text-pearl py-3 rounded-lg font-bold hover:bg-navy/90 transition disabled:opacity-70"
          >
            {loading ? 'Please wait...' : isLogin ? 'Login' : 'Sign Up'}
          </button>

          {isLogin && (
            <div className="text-center text-sm text-navy/80">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className="text-gold font-medium hover:underline"
              >
                Sign up
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AuthPage;