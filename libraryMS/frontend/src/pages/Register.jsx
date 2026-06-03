import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    // Clear error for this field
    if (errors[e.target.name]) {
      setErrors(prev => ({
        ...prev,
        [e.target.name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    const { confirmPassword, ...registrationData } = formData;
    const result = await register(registrationData);
    
    if (result.success) {
      navigate('/dashboard');
    }
    setLoading(false);
  };

  const InputField = ({ id, name, type = 'text', label, placeholder, icon: Icon, value, error, showToggle, isVisible, onToggle }) => (
    <div>
      <label htmlFor={id} className="block font-body text-[10px] font-semibold text-ak-ash uppercase tracking-wider mb-1.5">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Icon className="h-4 w-4 text-ak-dark-text" />
          </div>
        )}
        <input
          id={id}
          name={name}
          type={showToggle ? (isVisible ? 'text' : 'password') : type}
          className={`input ${Icon ? 'pl-10' : ''} ${showToggle ? 'pr-10' : ''} ${error ? 'border-ak-terracotta focus:ring-ak-terracotta focus:border-ak-terracotta' : ''}`}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
        />
        {showToggle && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={onToggle}
          >
            {isVisible ? (
              <EyeOff className="h-4 w-4 text-ak-dark-text hover:text-ak-ash transition-colors" />
            ) : (
              <Eye className="h-4 w-4 text-ak-dark-text hover:text-ak-ash transition-colors" />
            )}
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-xs font-body text-ak-terracotta">{error}</p>}
    </div>
  );

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
          <h2 className="font-display text-2xl font-semibold text-ak-parchment mb-1">
            Create account
          </h2>
          <p className="font-body text-[13px] text-ak-gold-dim">
            Join the Akosombo library system
          </p>
        </div>

        {/* Form */}
        <form className="space-y-3.5" onSubmit={handleSubmit}>
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-3">
            <InputField
              id="firstName" name="firstName" label="First Name" placeholder="First name"
              icon={User} value={formData.firstName} error={errors.firstName}
            />
            <InputField
              id="lastName" name="lastName" label="Last Name" placeholder="Last name"
              value={formData.lastName} error={errors.lastName}
            />
          </div>

          <InputField
            id="username" name="username" label="Username" placeholder="Choose a username"
            icon={User} value={formData.username} error={errors.username}
          />

          <InputField
            id="email" name="email" type="email" label="Email Address" placeholder="Enter your email"
            icon={Mail} value={formData.email} error={errors.email}
          />

          <InputField
            id="password" name="password" label="Password" placeholder="Choose a password"
            icon={Lock} value={formData.password} error={errors.password}
            showToggle isVisible={showPassword} onToggle={() => setShowPassword(!showPassword)}
          />

          <InputField
            id="confirmPassword" name="confirmPassword" label="Confirm Password" placeholder="Confirm your password"
            icon={Lock} value={formData.confirmPassword} error={errors.confirmPassword}
            showToggle isVisible={showConfirmPassword} onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
          />

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-ak-gold py-3 rounded-ak text-center font-body text-[13px] font-semibold text-ak-ebony hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:hover:scale-100"
            >
              {loading ? <LoadingSpinner size="small" /> : 'Create account'}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-5 text-center">
          <p className="font-body text-xs text-ak-dark-text">
            Already have an account?{' '}
            <Link 
              to="/login" 
              className="text-ak-gold hover:text-ak-parchment transition-colors"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;