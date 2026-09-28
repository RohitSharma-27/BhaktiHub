import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Login() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const e: typeof errors = {};

    if (!email) {
      e.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      e.email = 'Enter a valid email';
    }

    if (!password) {
      e.password = 'Password is required';
    } else if (password.length < 6) {
      e.password = 'Password must be at least 6 characters';
    }

    setErrors(e);

    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setSubmitting(true);

    const { error } = await signIn(email, password);

    setSubmitting(false);

    if (error) {
      toast(error, 'error');
      return;
    }

    toast('Welcome back to SankirtanHub!', 'success');

    if (email.trim().toLowerCase() === 'admin@SankirtanHub.com') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="pt-20 lg:pt-24 min-h-screen flex items-center">
      <div className="container-page py-12">
        <div className="max-w-md mx-auto">

          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-saffron-gradient flex items-center justify-center mx-auto mb-4 shadow-soft">
              <LogIn className="w-8 h-8 text-white" />
            </div>

            <h1 className="font-display text-3xl font-bold text-neutral-900">
              Welcome Back
            </h1>

            <p className="text-neutral-500 mt-2">
              Sign in to manage your bookings and favorites
            </p>
          </div>

          <div className="card p-8">
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Email */}
              <div>
                <label className="label-field">
                  Email Address
                </label>

                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={`input-field pl-12 ${
                      errors.email
                        ? 'border-red-400 focus:ring-red-200'
                        : ''
                    }`}
                  />
                </div>

                {errors.email && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="label-field">
                  Password
                </label>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />

                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`input-field pl-12 pr-12 ${
                      errors.password
                        ? 'border-red-400 focus:ring-red-200'
                        : ''
                    }`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {errors.password && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full"
              >
                {submitting ? 'Signing in...' : 'Sign In'}
              </button>

            </form>

            <div className="mt-6 pt-6 border-t border-cream-200 text-center">
              <p className="text-sm text-neutral-500">
                New to SankirtanHub?{' '}

                <Link
                  to="/register"
                  className="text-saffron-700 font-semibold hover:underline"
                >
                  Create an account
                </Link>
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}