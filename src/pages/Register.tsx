import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, UserPlus, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Register() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; confirm?: string; terms?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
  const e: typeof errors = {};

  if (!name.trim()) e.name = 'Name is required';
  else if (name.trim().length < 2) {
    e.name = 'Name must be at least 2 characters';
  }

  if (!email) e.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    e.email = 'Enter a valid email';
  }

  if (!password) e.password = 'Password is required';
  else if (password.length < 6) {
    e.password = 'Password must be at least 6 characters';
  }

  if (!confirmPassword) e.confirm = 'Please confirm your password';
  else if (password !== confirmPassword) {
    e.confirm = 'Passwords do not match';
  }

  if (!acceptTerms) {
    e.terms = 'Please accept the terms to continue';
  }

  setErrors(e);
  return Object.keys(e).length === 0;
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    const { error } = await signUp(email, password, name);
    setSubmitting(false);
    if (error) {
      toast(error, 'error');
    } else {
      toast('Account created! Welcome to BhaktiHub.', 'success');
      navigate('/dashboard');
    }
  };

  return (
    <div className="pt-20 lg:pt-24 min-h-screen flex items-center">
      <div className="container-page py-12">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-saffron-gradient flex items-center justify-center mx-auto mb-4 shadow-soft">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h1 className="font-display text-3xl font-bold text-neutral-900">Join BhaktiHub</h1>
            <p className="text-neutral-500 mt-2">Create an account to book devotional artists</p>
          </div>

          <div className="card p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="label-field">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    className={`input-field pl-12 ${errors.name ? 'border-red-400 focus:ring-red-200' : ''}`}
                  />
                </div>
                {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="label-field">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={`input-field pl-12 ${errors.email ? 'border-red-400 focus:ring-red-200' : ''}`}
                  />
                </div>
                {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="label-field">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className={`input-field pl-12 pr-12 ${errors.password ? 'border-red-400 focus:ring-red-200' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="label-field">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className={`input-field pl-12 ${errors.confirm ? 'border-red-400 focus:ring-red-200' : ''}`}
                  />
                </div>
                {errors.confirm && <p className="text-sm text-red-600 mt-1">{errors.confirm}</p>}
              </div>

              <div>
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <button
                    type="button"
                    onClick={() => setAcceptTerms(!acceptTerms)}
                    className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                      acceptTerms ? 'bg-saffron-500 border-saffron-500' : 'border-cream-300'
                    }`}
                  >
                    {acceptTerms && <Check className="w-3.5 h-3.5 text-white" />}
                  </button>
                  <span className="text-sm text-neutral-600">
                    I agree to the{' '}
                   <Link to="/terms-of-service" className="text-saffron-700 font-medium hover:underline">
  Terms of Service
</Link>and{' '}
                   <Link to="/privacy-policy" className="text-saffron-700 font-medium hover:underline">
  Privacy Policy
</Link>
                  </span>
                </label>
                {errors.terms && <p className="text-sm text-red-600 mt-1">{errors.terms}</p>}
              </div>

              <button type="submit" disabled={submitting} className="btn-primary w-full">
                {submitting ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-cream-200 text-center">
              <p className="text-sm text-neutral-500">
                Already have an account?{' '}
                <Link to="/login" className="text-saffron-700 font-semibold hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
