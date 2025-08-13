import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Eye, EyeOff, Mail, Lock, User, Building, UserPlus, ChevronDown } from 'lucide-react';
import { serverUrl } from '@/utils';
import { useMemo } from 'react';
import { createAvatar } from '@dicebear/core';
import { thumbs } from '@dicebear/collection';
import userStore from '@/store/userStore';
import Spline from '@splinetool/react-spline';

interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'PG_OWNER' | 'RESIDENT';
  pgCode?: string;
  profilePicture?: string;
}

interface PgCommunity {
  id: string;
  name: string;
  address: string;
  pgCode: string;
  owner: {
    name: string;
    email: string;
  };
  _count: {
    residents: number;
  };
}

interface SignupProps {
  onSignupSuccess?: (user: any) => void;
  onSwitchToLogin?: () => void;
}

const Signup: React.FC<SignupProps> = ({ onSignupSuccess, onSwitchToLogin }) => {
  const [formData, setFormData] = useState<SignupFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'PG_OWNER',
    pgCode: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pgCommunity, setPgCommunity] = useState<PgCommunity | null>(null);
  const [searchingPg, setSearchingPg] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const { setUser } = userStore();

  const roleOptions = [
    { value: 'PG_OWNER', label: 'PG Owner', description: 'Manage and oversee PG communities' },
    { value: 'RESIDENT', label: 'Resident', description: 'Live in and interact with PG community' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');

    // Reset PG community when role changes
    if (name === 'role') {
      setPgCommunity(null);
      setFormData(prev => ({ ...prev, pgCode: '' }));
    }
  };

  const handleRoleChange = (roleValue: 'PG_OWNER' | 'RESIDENT') => {
    setFormData(prev => ({
      ...prev,
      role: roleValue,
      pgCode: roleValue === 'PG_OWNER' ? '' : prev.pgCode
    }));
    setIsRoleDropdownOpen(false);
    setPgCommunity(null);
    if (error) setError('');
  };

  const searchPgCommunity = async (pgCode: string) => {
    if (!pgCode || pgCode.length < 3) {
      setPgCommunity(null);
      return;
    }

    setSearchingPg(true);
    try {
      const response = await axios.get(`${serverUrl}/pg-community/code/${pgCode}`, {
        withCredentials: true,
      });
      setPgCommunity(response.data.data);
      setError('');
    } catch (err: any) {
      setPgCommunity(null);
      if (err.response?.status === 404) {
        setError('PG Community not found with this code');
      }
    } finally {
      setSearchingPg(false);
    }
  };

  const avatar = useMemo(() => {
    return createAvatar(thumbs, {
      size: 128,
    }).toDataUri();
  }, []);

  // Debounced PG search
  useEffect(() => {
    if (formData.role === 'RESIDENT' && formData.pgCode) {
      const timeoutId = setTimeout(() => {
        searchPgCommunity(formData.pgCode!);
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [formData.pgCode, formData.role]);

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    if (formData.role === 'RESIDENT' && !formData.pgCode) {
      setError('PG Code is required for residents');
      return false;
    }
    if (formData.role === 'RESIDENT' && !pgCommunity) {
      setError('Please enter a valid PG Code');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const signupData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        profilePicture: avatar,
        ...(formData.role === 'RESIDENT' && { pgCode: formData.pgCode })
      };

      const response = await axios.post(`${serverUrl}/auth/signup`, signupData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const { data } = response.data;

      setUser(data)

      // Call success callback
      if (onSignupSuccess) {
        onSignupSuccess(data);
      }

      // Redirect based on role
      if (data.role === 'PG_OWNER') {
        window.location.href = '/dashboard/owner';
      } else {
        window.location.href = '/dashboard/resident';
      }

    } catch (err: any) {
      console.error('Signup error:', err);
      const errorMessage = err.response?.data?.message || 'Signup failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8" style={{ backgroundImage: 'radial-gradient(292.12% 100% at 50% 0%, #F9F7F5 0%, #FFF8F1 21.63%, #FFE4C9 45.15%, #FFE9C9 67.31%,#FFFAF3 100%)' }}>
      <div className="max-w-md w-full">
        <div className="bg-white/50 rounded-2xl border border-transparent shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">

            <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
            <p className="text-gray-500  mt-2">Create an account to start your community journey</p>
            <div className="flex justify-center items-center h-[160px] sm:h-[223px] mt-6 mx-auto relative">
              <Spline scene="../../../../../public/spline.spline" />

              {/* Overlay div to disable interaction */}
              <div className="absolute inset-0 z-10" style={{ cursor: 'default' }}></div>
            </div>
          </div>
        

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Role Selection - Custom Dropdown */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
              I am a
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#FF4500] focus:border-transparent transition-colors bg-white"
              >
                <div className="flex items-center">
                  {formData.role === 'PG_OWNER' ? (
                    <Building className="h-5 w-5 text-gray-400 mr-3" />
                  ) : (
                    <User className="h-5 w-5 text-gray-400 mr-3" />
                  )}
                  <span className="text-gray-700">
                    {roleOptions.find(opt => opt.value === formData.role)?.label}
                  </span>
                </div>
                <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${isRoleDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isRoleDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-2xl shadow-lg z-10">
                  {roleOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleRoleChange(option.value as 'PG_OWNER' | 'RESIDENT')}
                      className={`w-full px-4 py-4 text-left hover:bg-orange-50 transition-colors ${formData.role === option.value ? 'bg-orange-100 text-[#FF4500]' : 'text-gray-700'
                        } ${option.value === roleOptions[0].value ? 'rounded-t-2xl' : ''} ${option.value === roleOptions[roleOptions.length - 1].value ? 'rounded-b-2xl' : ''}`}
                    >
                      <div className="flex items-start">
                        {option.value === 'PG_OWNER' ? (
                          <Building className="h-5 w-5 mt-0.5 mr-3 flex-shrink-0" />
                        ) : (
                          <User className="h-5 w-5 mt-0.5 mr-3 flex-shrink-0" />
                        )}
                        <div>
                          <div className="font-medium">{option.label}</div>
                          <div className="text-sm text-gray-500 mt-1">{option.description}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF4500] focus:border-transparent transition duration-200 bg-white"
                placeholder="Enter your full name"
              />
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF4500] focus:border-transparent transition duration-200 bg-white"
                placeholder="Enter your email"
              />
            </div>
          </div>

          {/* PG Code Field (only for residents) */}
          {formData.role === 'RESIDENT' && (
            <div>
              <label htmlFor="pgCode" className="block text-sm font-medium text-gray-700 mb-2">
                PG Code
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="pgCode"
                  name="pgCode"
                  type="text"
                  required
                  value={formData.pgCode}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF4500] focus:border-transparent transition duration-200 bg-white"
                  placeholder="Enter PG code"
                />
                {searchingPg && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-600"></div>
                  </div>
                )}
              </div>
              {/* PG Community Info */}
              {pgCommunity && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <Building className="h-5 w-5 text-green-600 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-green-800">{pgCommunity.name}</p>
                      <p className="text-xs text-green-600">{pgCommunity.address}</p>
                      <p className="text-xs text-green-600">
                        Owner: {pgCommunity.owner.name}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={handleInputChange}
                className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF4500] focus:border-transparent transition duration-200 bg-white"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF4500] focus:border-transparent transition duration-200 bg-white"
                placeholder="Confirm your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || (formData.role === 'RESIDENT' && !pgCommunity)}
            className="font-semibold  text-white transition duration-200 px-4 py-2 rounded-[16px]"
            style={{
              border: '1px solid #FFF',
              background: 'linear-gradient(180deg, #FFAB7E 1.09%, #FF955C 18.47%, #FF8B4E 28.25%, #FF610D 47.26%, #FF610D 70.08%, #FF955C 93.44%, #FFAB7E 111.91%)',
              boxShadow: '1px 3px 6.1px 0 rgba(0, 0, 0, 0.20)',
            }}
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating account...
              </div>
            ) : (
              `Create ${formData.role === 'PG_OWNER' ? 'PG Owner' : 'Resident'} Account`
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              className="font-semibold text-orange-600 hover:text-orange-500 transition duration-200"
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
    </div >
  );
};

export default Signup;