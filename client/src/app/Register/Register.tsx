import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Eye, EyeOff, Mail, Lock, User, Building, ChevronDown } from 'lucide-react';
import type { Variants } from 'framer-motion'
import { motion, AnimatePresence } from 'framer-motion';
import { serverUrl } from '@/utils';
import { useMemo } from 'react';
import { createAvatar } from '@dicebear/core';
import { thumbs } from '@dicebear/collection';
import userStore from '@/store/userStore';
import Registerpic from '../../assets/RegisterPic.jpg';
import Loginillus from '../../assets/loginillus.svg';
import { Link } from 'react-router-dom';
import Logo from '../../../src/assets/logo.svg';

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

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const formVariants: Variants = {
    hidden: { x: -50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const imageVariants: Variants = {
    hidden: { x: 50, opacity: 0, scale: 0.9 },
    visible: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const buttonVariants: Variants = {
    idle: { scale: 1 },
    hover: {
      scale: 1.02,
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.98 }
  };

  const dropdownVariants: Variants = {
    closed: {
      opacity: 0,
      scale: 0.95,
      y: -10,
      transition: { duration: 0.2 }
    },
    open: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.2, ease: "easeOut" }
    }
  };

  const pgCardVariants: Variants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  return (
    <motion.div
      className="min-h-screen flex"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Left Side - Form */}
      <motion.div
        className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8"
        style={{ backgroundImage: 'radial-gradient(292.12% 100% at 50% 0%, #F9F7F5 0%, #FFF8F1 21.63%, #FFE4C9 45.15%, #FFE9C9 67.31%,#FFFAF3 100%)' }}
        variants={formVariants}
      >
        <div className="max-w-md w-full">
          <motion.div
            className="bg-white/50 rounded-2xl border border-transparent shadow-lg p-6 sm:p-8"
            whileHover={{
              boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
              transition: { duration: 0.3 }
            }}
          >
            {/* Header */}
            <motion.div
              className="text-center mb-8"
              variants={itemVariants}
            >
              <div className="flex mb-10 items-center space-x-2">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <img src={Logo} alt="Logo" />
                </div>
                <span className="text-gray-900 font-semibold text-lg">Echo</span>
              </div>
              <motion.h2
                className="text-2xl sm:text-3xl font-bold text-gray-900"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                Create Account
              </motion.h2>
              <motion.p
                className="text-gray-600 mt-2 text-sm sm:text-base"
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                Create an account to start your community journey
              </motion.p>
            </motion.div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-red-600 text-sm">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <motion.form
              onSubmit={handleSubmit}
              className="space-y-6"
              variants={itemVariants}
            >
              {/* Role Selection - Custom Dropdown */}
              <motion.div variants={itemVariants}>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                  I am a
                </label>
                <div className="relative">
                  <motion.button
                    type="button"
                    onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#FF4500] focus:border-transparent transition-colors bg-white"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div className="flex items-center">
                      <motion.div
                        animate={{
                          color: formData.role ? '#FF4500' : '#9CA3AF',
                          transition: { duration: 0.2 }
                        }}
                      >
                        {formData.role === 'PG_OWNER' ? (
                          <Building className="h-5 w-5 mr-3" />
                        ) : (
                          <User className="h-5 w-5 mr-3" />
                        )}
                      </motion.div>
                      <span className="text-gray-700">
                        {roleOptions.find(opt => opt.value === formData.role)?.label}
                      </span>
                    </div>
                    <motion.div
                      animate={{
                        rotate: isRoleDropdownOpen ? 180 : 0,
                        transition: { duration: 0.2 }
                      }}
                    >
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    </motion.div>
                  </motion.button>

                  <AnimatePresence>
                    {isRoleDropdownOpen && (
                      <motion.div
                        className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-2xl shadow-lg z-10"
                        variants={dropdownVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                      >
                        {roleOptions.map((option, index) => (
                          <motion.button
                            key={option.value}
                            type="button"
                            onClick={() => handleRoleChange(option.value as 'PG_OWNER' | 'RESIDENT')}
                            className={`w-full px-4 py-4 text-left hover:bg-orange-50 transition-colors ${formData.role === option.value ? 'bg-orange-100 text-[#FF4500]' : 'text-gray-700'
                              } ${index === 0 ? 'rounded-t-2xl' : ''} ${index === roleOptions.length - 1 ? 'rounded-b-2xl' : ''}`}
                            whileHover={{ backgroundColor: '#FFF7ED', x: 4 }}
                            whileTap={{ scale: 0.98 }}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{
                              opacity: 1,
                              x: 0,
                              transition: { delay: index * 0.1, duration: 0.2 }
                            }}
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
                          </motion.button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Name Field */}
              <motion.div variants={itemVariants}>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <motion.div
                  className="relative"
                >
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <motion.div
                      animate={{
                        color: formData.name ? '#FF4500' : '#9CA3AF',
                        transition: { duration: 0.2 }
                      }}
                    >
                      <User className="h-5 w-5" />
                    </motion.div>
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
                </motion.div>
              </motion.div>

              {/* Email Field */}
              <motion.div variants={itemVariants}>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <motion.div
                  className="relative"
                >
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <motion.div
                      animate={{
                        color: formData.email ? '#FF4500' : '#9CA3AF',
                        transition: { duration: 0.2 }
                      }}
                    >
                      <Mail className="h-5 w-5" />
                    </motion.div>
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
                </motion.div>
              </motion.div>

              {/* PG Code Field (only for residents) */}
              <AnimatePresence>
                {formData.role === 'RESIDENT' && (
                  <motion.div
                    variants={itemVariants}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{
                      opacity: 1,
                      height: 'auto',
                      transition: { duration: 0.4, ease: "easeOut" }
                    }}
                    exit={{
                      opacity: 0,
                      height: 0,
                      transition: { duration: 0.3 }
                    }}
                  >
                    <label htmlFor="pgCode" className="block text-sm font-medium text-gray-700 mb-2">
                      PG Code
                    </label>
                    <motion.div
                      className="relative"
                    >
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <motion.div
                          animate={{
                            color: formData.pgCode ? '#FF4500' : '#9CA3AF',
                            transition: { duration: 0.2 }
                          }}
                        >
                          <Building className="h-5 w-5" />
                        </motion.div>
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
                        <motion.div
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <motion.div
                            className="rounded-full h-4 w-4 border-b-2 border-orange-600"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
                        </motion.div>
                      )}
                    </motion.div>

                    {/* PG Community Info */}
                    <AnimatePresence>
                      {pgCommunity && (
                        <motion.div
                          className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg"
                          variants={pgCardVariants}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                        >
                          <div className="flex items-center">
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.2, type: "spring" }}
                            >
                              <Building className="h-5 w-5 text-green-600 mr-2" />
                            </motion.div>
                            <div>
                              <p className="text-sm font-medium text-green-800">{pgCommunity.name}</p>
                              <p className="text-xs text-green-600">{pgCommunity.address}</p>
                              <p className="text-xs text-green-600">
                                Owner: {pgCommunity.owner.name}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Password Field */}
              <motion.div variants={itemVariants}>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <motion.div
                  className="relative"
                >
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <motion.div
                      animate={{
                        color: formData.password ? '#FF4500' : '#9CA3AF',
                        transition: { duration: 0.2 }
                      }}
                    >
                      <Lock className="h-5 w-5" />
                    </motion.div>
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
                  <motion.button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <motion.div
                      animate={{
                        rotate: showPassword ? 180 : 0,
                        transition: { duration: 0.3 }
                      }}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </motion.div>
                  </motion.button>
                </motion.div>
              </motion.div>

              {/* Confirm Password Field */}
              <motion.div variants={itemVariants}>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <motion.div
                  className="relative"
                >
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <motion.div
                      animate={{
                        color: formData.confirmPassword ? '#FF4500' : '#9CA3AF',
                        transition: { duration: 0.2 }
                      }}
                    >
                      <Lock className="h-5 w-5" />
                    </motion.div>
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
                  <motion.button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <motion.div
                      animate={{
                        rotate: showConfirmPassword ? 180 : 0,
                        transition: { duration: 0.3 }
                      }}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </motion.div>
                  </motion.button>
                </motion.div>
              </motion.div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading || (formData.role === 'RESIDENT' && !pgCommunity)}
                className="w-full font-semibold text-white transition duration-200 px-4 py-3 rounded-[16px]"
                style={{
                  border: '1px solid #FFF',
                  background: 'linear-gradient(180deg, #FFAB7E 1.09%, #FF955C 18.47%, #FF8B4E 28.25%, #FF610D 47.26%, #FF610D 70.08%, #FF955C 93.44%, #FFAB7E 111.91%)',
                  boxShadow: '1px 3px 6.1px 0 rgba(0, 0, 0, 0.20)',
                }}
                variants={buttonVariants}
                initial="idle"
                whileHover="hover"
                whileTap="tap"
              >
                <AnimatePresence mode="wait">
                  {loading ? (
                    <motion.div
                      className="flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      key="loading"
                    >
                      <motion.div
                        className="rounded-full h-4 w-4 border-b-2 border-white mr-2"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      Creating account...
                    </motion.div>
                  ) : (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      key="signup"
                    >
                      Create {formData.role === 'PG_OWNER' ? 'PG Owner' : 'Resident'} Account
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.form>

            {/* Footer */}
            <motion.div
              className="mt-6 text-center"
              variants={itemVariants}
            >
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <motion.button
                  onClick={onSwitchToLogin}
                  className="font-semibold text-[#FF703C] hover:text-[#E03E00] transition duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link to="/login"> Login here</Link>
                </motion.button>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Side - Image */}
      <motion.div
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
        style={{ backgroundImage: 'radial-gradient(292.12% 100% at 50% 0%, #F9F7F5 0%, #FFF8F1 21.63%, #FFE4C9 45.15%, #FFE9C9 67.31%,#FFFAF3 100%)' }}
        variants={imageVariants}
      >
        <motion.img
          src={Registerpic}
          alt="Register"
          className="w-full h-[940px] object-cover p-5 rounded-[32px]"
          whileHover={{
            scale: 1.02,
            transition: { duration: 0.4 }
          }}
        />
        <motion.img
          src={Loginillus}
          alt="Login Illustration"
          className="absolute top-1/2 left-1/2 w-[400px] h-[400px] object-contain transform -translate-x-1/2 -translate-y-1/2"
          initial={{
            opacity: 0,
            y: 50,
            rotate: -10
          }}
          animate={{
            opacity: 1,
            y: 0,
            rotate: 0,
            transition: {
              delay: 0.5,
              duration: 0.8,
              ease: "easeOut"
            }
          }}
          whileHover={{
            y: -10,
            rotate: 5,
            transition: { duration: 0.3 }
          }}
        />
      </motion.div>
    </motion.div>
  );
};

export default Signup;