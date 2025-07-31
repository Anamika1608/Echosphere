// import { useState } from 'react';

// const Register = () => {
//   const [userType, setUserType] = useState('resident');
//   const [fullName, setFullName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     setIsLoading(true);
    
//     console.log(`Simulating registration for user type: ${userType}`);
    
//     // Simulate API call
//     setTimeout(() => {
//       setIsLoading(false);
//       // Show success message or redirect
//       alert(`Account created successfully! Redirecting to ${userType} dashboard...`);
//     }, 2000);
//   };

//   return (
//     <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden">
//       {/* Background with gradient */}
//       <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-orange-100"></div>
      
//       {/* Decorative elements */}
//       <div className="absolute top-10 right-10 w-32 h-32 bg-orange-100 rounded-full opacity-30 blur-xl"></div>
//       <div className="absolute bottom-20 left-20 w-40 h-40 bg-orange-200 rounded-full opacity-20 blur-2xl"></div>
//       <div className="absolute top-1/3 right-20 w-20 h-20 bg-orange-300 rounded-full opacity-10 blur-lg"></div>

//       <div className="relative z-10 w-full max-w-md">
//         {/* Header section */}
//         <div className="text-center mb-8">
//           <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl mb-6 shadow-lg">
//             <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
//             </svg>
//           </div>
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">Join our community</h1>
//           <p className="text-gray-600">Create your account to get started</p>
//         </div>

//         {/* Register Card */}
//         <div className="border-0 shadow-2xl shadow-orange-500/10 bg-white/70 backdrop-blur-sm rounded-2xl">
//           <div className="p-8">
//             <div className="space-y-6">
//               {/* User Type Selection */}
//               <div className="space-y-3">
//                 <label className="text-sm font-medium text-gray-700">I am signing up as a...</label>
//                 <div className="grid grid-cols-2 gap-3">
//                   <button
//                     type="button"
//                     onClick={() => setUserType('resident')}
//                     className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 ${
//                       userType === 'resident'
//                         ? 'border-orange-500 bg-orange-50 text-orange-700'
//                         : 'border-gray-200 bg-white/50 text-gray-600 hover:border-gray-300 hover:bg-white/70'
//                     }`}
//                   >
//                     <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
//                     </svg>
//                     <span className="font-medium">Resident</span>
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => setUserType('owner')}
//                     className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 ${
//                       userType === 'owner'
//                         ? 'border-orange-500 bg-orange-50 text-orange-700'
//                         : 'border-gray-200 bg-white/50 text-gray-600 hover:border-gray-300 hover:bg-white/70'
//                     }`}
//                   >
//                     <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
//                     </svg>
//                     <span className="font-medium">Owner</span>
//                   </button>
//                 </div>
//               </div>

//               {/* Full Name Field */}
//               <div className="space-y-2">
//                 <label htmlFor="full-name" className="text-sm font-medium text-gray-700">
//                   Full Name
//                 </label>
//                 <div className="relative">
//                   <input
//                     id="full-name"
//                     type="text"
//                     value={fullName}
//                     onChange={(e) => setFullName(e.target.value)}
//                     placeholder="Enter your full name"
//                     className="w-full pl-12 pr-4 h-12 bg-white/50 border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 rounded-xl outline-none transition-all duration-200"
//                     required
//                   />
//                   <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                   </svg>
//                 </div>
//               </div>

//               {/* Email Field */}
//               <div className="space-y-2">
//                 <label htmlFor="email" className="text-sm font-medium text-gray-700">
//                   Email address
//                 </label>
//                 <div className="relative">
//                   <input
//                     id="email"
//                     type="email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     placeholder="Enter your email"
//                     className="w-full pl-12 pr-4 h-12 bg-white/50 border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 rounded-xl outline-none transition-all duration-200"
//                     required
//                   />
//                   <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
//                   </svg>
//                 </div>
//               </div>

//               {/* Password Field */}
//               <div className="space-y-2">
//                 <label htmlFor="password" className="text-sm font-medium text-gray-700">
//                   Password
//                 </label>
//                 <div className="relative">
//                   <input
//                     id="password"
//                     type="password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     placeholder="Create a strong password"
//                     className="w-full pl-12 pr-4 h-12 bg-white/50 border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 rounded-xl outline-none transition-all duration-200"
//                     required
//                   />
//                   <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//                   </svg>
//                 </div>
//                 <div className="text-xs text-gray-500 mt-1">
//                   Must be at least 8 characters with numbers and letters
//                 </div>
//               </div>

//               {/* Terms and Conditions */}
//               <div className="flex items-start space-x-2">
//                 <input
//                   id="terms"
//                   type="checkbox"
//                   className="mt-1 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
//                   required
//                 />
//                 <label htmlFor="terms" className="text-sm text-gray-600 leading-5">
//                   I agree to the{' '}
//                   <a href="#" className="text-orange-600 hover:text-orange-700 font-medium">
//                     Terms of Service
//                   </a>{' '}
//                   and{' '}
//                   <a href="#" className="text-orange-600 hover:text-orange-700 font-medium">
//                     Privacy Policy
//                   </a>
//                 </label>
//               </div>

//               {/* Submit Button */}
//               <button
//                 type="submit"
//                 onClick={handleSubmit}
//                 disabled={isLoading || !fullName || !email || !password}
//                 className="w-full h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/25 transition-all duration-200 hover:shadow-xl hover:shadow-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {isLoading ? (
//                   <div className="flex items-center justify-center gap-2">
//                     <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                     </svg>
//                     Creating Account...
//                   </div>
//                 ) : (
//                   'Create Account'
//                 )}
//               </button>

//               {/* Divider */}
//               <div className="relative">
//                 <div className="absolute inset-0 flex items-center">
//                   <span className="w-full border-t border-gray-200" />
//                 </div>
//                 <div className="relative flex justify-center text-xs uppercase">
//                   <span className="bg-white px-2 text-gray-500">Or sign up with</span>
//                 </div>
//               </div>

//               {/* Social Registration */}
//               <div className="grid grid-cols-2 gap-3">
//                 <button
//                   type="button"
//                   className="h-12 flex items-center justify-center border border-gray-200 hover:bg-gray-50 rounded-xl transition-colors duration-200"
//                 >
//                   <svg className="w-5 h-5" viewBox="0 0 24 24">
//                     <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
//                     <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
//                     <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
//                     <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
//                   </svg>
//                   <span className="ml-2">Google</span>
//                 </button>
//                 <button
//                   type="button"
//                   className="h-12 flex items-center justify-center border border-gray-200 hover:bg-gray-50 rounded-xl transition-colors duration-200"
//                 >
//                   <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
//                     <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
//                   </svg>
//                   <span className="ml-2">Twitter</span>
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Login link */}
//         <div className="text-center mt-6">
//           <p className="text-gray-600">
//             Already have an account?{' '}
//             <a 
//               href="/login" 
//               className="font-semibold text-orange-600 hover:text-orange-700 transition-colors"
//             >
//               Sign in here
//             </a>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Register;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Eye, EyeOff, Mail, Lock, User, Building, UserPlus, Search } from 'lucide-react';
import { serverUrl } from '@/utils';
import { useMemo } from 'react';
import { createAvatar } from '@dicebear/core';
import { thumbs } from '@dicebear/collection';
import userStore from '@/store/userStore';

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

  const { setUser, user } = userStore()


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

  const searchPgCommunity = async (pgCode: string) => {
    if (!pgCode || pgCode.length < 3) {
      setPgCommunity(null);
      return;
    }

    setSearchingPg(true);
    try {
      const response = await axios.get(`http://localhost:3000/pg-community/${pgCode}`, {
        withCredentials: true,
      });
      setPgCommunity(response.data);
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

      // console.log("user after signing up", response.data)

      setUser(data)

      // console.log("auth.user", auth.user)


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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              <UserPlus className="w-8 h-8 text-indigo-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
            <p className="text-gray-600 mt-2">Join our PG management platform</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                I am a
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
              >
                <option value="PG_OWNER">PG Owner</option>
                <option value="RESIDENT">Resident</option>
              </select>
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
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
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
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
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
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                    placeholder="Enter PG code"
                  />
                  {searchingPg && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
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
                          Owner: {pgCommunity.owner.name} • {pgCommunity._count.residents} residents
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
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
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
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
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
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
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
                className="font-medium text-indigo-600 hover:text-indigo-500 transition duration-200"
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
