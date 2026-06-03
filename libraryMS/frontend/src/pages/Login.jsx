import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = {};
    if (!formData.email.trim()) validationErrors.email = 'Email is required';
    if (!formData.password.trim()) validationErrors.password = 'Password is required';

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    const result = await login(formData.email, formData.password);

    setLoading(false);
    if (result.success) {
      if (location.state?.from === '/catalog' && location.state?.bookId) {
        toast.success('Welcome back! You can now request the book.');
        navigate('/books');
      } else {
        navigate('/dashboard');
      }
    } else {
      setErrors({ form: result.message || 'Login failed. Please try again.' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ak-ebony py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-sm w-full page-enter">
        {/* Header */}
        <div className="text-center mb-7">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-ak-gold rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-ak-ebony" />
            </div>
          </div>
          <h2 className="font-display text-2xl font-semibold text-ak-parchment mb-1">Welcome back</h2>
          <p className="font-body text-[13px] text-ak-gold-dim">Sign in to your library account</p>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <div>
            <label htmlFor="email" className="block font-body text-[10px] font-semibold text-ak-ash uppercase tracking-wider mb-1.5">
              Email address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-ak-dark-text" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className="input pl-10"
                placeholder="amara@library.go.ke"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            {errors.email && <p className="text-ak-terracotta text-xs font-body mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block font-body text-[10px] font-semibold text-ak-ash uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-ak-dark-text" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                className="input pl-10 pr-10"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-ak-dark-text hover:text-ak-ash transition-colors" />
                ) : (
                  <Eye className="h-4 w-4 text-ak-dark-text hover:text-ak-ash transition-colors" />
                )}
              </button>
            </div>
            {errors.password && <p className="text-ak-terracotta text-xs font-body mt-1">{errors.password}</p>}
          </div>

          {/* General form error */}
          {errors.form && <p className="text-ak-terracotta text-xs font-body">{errors.form}</p>}

          {/* Submit Button */}
          <div className="pt-1">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-ak-gold py-3 rounded-ak text-center font-body text-[13px] font-semibold text-ak-ebony hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:hover:scale-100"
            >
              {loading ? <LoadingSpinner size="small" /> : 'Sign In to Library'}
            </button>
          </div>

          {/* Demo Accounts */}
          <div className="bg-ak-mahogany-light border border-ak-mahogany rounded-ak p-4 mt-4">
            <p className="font-body text-xs font-semibold text-ak-warm-text mb-2">Demo Accounts:</p>
            <div className="font-body text-[11px] text-ak-ash space-y-1">
              <p>
                <strong className="text-ak-gold">Admin:</strong> admin@library.com / admin123
              </p>
              <p>
                <strong className="text-ak-gold">User:</strong> user@library.com / user123
              </p>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-5 text-center">
          <p className="font-body text-xs text-ak-dark-text">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-ak-gold hover:text-ak-parchment transition-colors"
            >
              Create one here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
