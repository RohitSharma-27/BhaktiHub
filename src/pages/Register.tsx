import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  UserPlus,
  Check,
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Register() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const { toast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
    confirm?: string;
    terms?: string;
  }>({});

  const isValidIndianPhone = (value: string) => {
    const phoneValue = value.trim();

    if (!/^[6-9]\d{9}$/.test(phoneValue)) {
      return false;
    }

    // Reject numbers like 7777777777, 8888888888, etc.
    if (/^(\d)\1{9}$/.test(phoneValue)) {
      return false;
    }

    // Reject obvious test/sequential numbers
    const fakeNumbers = [
      '0123456789',
      '1234567890',
      '0987654321',
      '9876543210',
    ];

    return !fakeNumbers.includes(phoneValue);
  };

  const validate = () => {
    const e: typeof errors = {};

    const trimmedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPhone = phone.trim();

    if (!trimmedName) {
      e.name = 'Name is required';
    } else if (trimmedName.length < 2) {
      e.name = 'Name must be at least 2 characters';
    } else if (trimmedName.length > 60) {
      e.name = 'Name must be less than 60 characters';
    }

    if (!normalizedEmail) {
      e.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(normalizedEmail)) {
      e.email = 'Enter a valid email address';
    }

    if (!normalizedPhone) {
      e.phone = 'Phone number is required';
    } else if (!isValidIndianPhone(normalizedPhone)) {
      e.phone = 'Enter a valid 10-digit mobile number';
    }

    if (!password) {
      e.password = 'Password is required';
    } else if (password.length < 6) {
      e.password = 'Password must be at least 6 characters';
    }

    if (!confirmPassword) {
      e.confirm = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      e.confirm = 'Passwords do not match';
    }

    if (!acceptTerms) {
      e.terms = 'Please accept the terms to continue';
    }

    setErrors(e);

    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setSubmitting(true);

    const { error } = await signUp(
      email.trim(),
      password,
      name.trim(),
      phone.trim()
    );

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

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-saffron-gradient flex items-center justify-center mx-auto mb-4 shadow-soft">
              <UserPlus className="w-8 h-8 text-white" />
            </div>

            <h1 className="font-display text-3xl font-bold text-neutral-900">
              Join BhaktiHub
            </h1>

            <p className="text-neutral-500 mt-2">
              Create an account to book devotional artists
            </p>
          </div>

          {/* Form Card */}
          <div className="card p-8">
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Full Name */}
              <div>
                <label
                  htmlFor="name"
                  className="label-field"
                >
                  Full Name
                </label>

                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />

                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    minLength={2}
                    maxLength={60}
                    className={`input-field pl-12 ${
                      errors.name
                        ? 'border-red-400 focus:ring-red-200'
                        : ''
                    }`}
                  />
                </div>

                {errors.name && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="label-field"
                >
                  Email Address
                </label>

                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    pattern="[^\s@]+@[^\s@]+\.[A-Za-z]{2,}"
                    title="Please enter a valid email address, for example: name@gmail.com"
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

              {/* Phone Number */}
              <div>
                <label
                  htmlFor="phone"
                  className="label-field"
                >
                  Phone Number
                </label>

                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    autoComplete="tel"
                    inputMode="numeric"
                    value={phone}
                    onChange={(e) =>
                      setPhone(
                        e.target.value.replace(/\D/g, '').slice(0, 10)
                      )
                    }
                    placeholder="Enter your 10-digit mobile number"
                    minLength={10}
                    maxLength={10}
                    pattern="[6-9][0-9]{9}"
                    title="Please enter a valid 10-digit Indian mobile number"
                    className={`input-field pl-12 ${
                      errors.phone
                        ? 'border-red-400 focus:ring-red-200'
                        : ''
                    }`}
                  />
                </div>

                {errors.phone && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="label-field"
                >
                  Password
                </label>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    minLength={6}
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
                    aria-label={
                      showPassword
                        ? 'Hide password'
                        : 'Show password'
                    }
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

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="label-field"
                >
                  Confirm Password
                </label>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />

                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(e.target.value)
                    }
                    placeholder="Re-enter password"
                    className={`input-field pl-12 ${
                      errors.confirm
                        ? 'border-red-400 focus:ring-red-200'
                        : ''
                    }`}
                  />
                </div>

                {errors.confirm && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.confirm}
                  </p>
                )}
              </div>

              {/* Terms */}
              <div>
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <button
                    type="button"
                    onClick={() => setAcceptTerms(!acceptTerms)}
                    className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                      acceptTerms
                        ? 'bg-saffron-500 border-saffron-500'
                        : 'border-cream-300'
                    }`}
                    aria-label="Accept terms and privacy policy"
                  >
                    {acceptTerms && (
                      <Check className="w-3.5 h-3.5 text-white" />
                    )}
                  </button>

                  <span className="text-sm text-neutral-600">
                    I agree to the{' '}
                    <Link
                      to="/terms-of-service"
                      className="text-saffron-700 font-medium hover:underline"
                    >
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link
                      to="/privacy-policy"
                      className="text-saffron-700 font-medium hover:underline"
                    >
                      Privacy Policy
                    </Link>
                  </span>
                </label>

                {errors.terms && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.terms}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full"
              >
                {submitting
                  ? 'Creating account...'
                  : 'Create Account'}
              </button>
            </form>

            {/* Login */}
            <div className="mt-6 pt-6 border-t border-cream-200 text-center">
              <p className="text-sm text-neutral-500">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-saffron-700 font-semibold hover:underline"
                >
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