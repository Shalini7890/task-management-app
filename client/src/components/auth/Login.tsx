import React, { useState } from 'react';
import { LoginData } from '../../types';
import { loginUser } from '../../services/api';


interface LoginProps {
    onSuccess: (token: string, user: any) => void;
    onSwitchToRegister: () => void;
}

export const Login: React.FC<LoginProps> = ({ onSuccess, onSwitchToRegister }) => {
    const [formData, setFormData] = useState<LoginData>({
        email: '',
        password: ''
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await loginUser(formData);
            localStorage.setItem('token', response.token);
            onSuccess(response.token, response.user);
        }
        catch (error: any) {
            setError(error.response?.data?.message || 'Login failed');
        }
        finally {
            setLoading(false);
        }

    }

    return (
        <div className='min-h-screen flex bg-gray-50 items-center justify-center'>
            <div className="max-w-md w-full space-y-8 px-4 py-8 md:px-8 ">
                <div>
                    <h2 className='text-3xl font-bold text-center text-gray-900'>Sign in to your account</h2>
                </div>
                <form className='mt-8 space-y-6 ' onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                            {error}
                        </div>
                    )}
                    <div className='space-y-4'>
                        <div>
                            <label className='block text-sm font-medium text-gray-700'> Email address</label>
                            <input className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                type='email' name='email' placeholder='Enter your email' required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}></input>
                        </div>
                        <div>
                            <label className='block text-sm font-medium text-gray-700'> Password</label>
                            <div className='relative'>
                            <input className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                type= {showPassword? "text" :"password"} name='password' placeholder='Enter your password' required value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })}></input>
                                {/* ✅ Eye toggle button */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 top-1 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    // Eye slash icon (hide password)
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    // Eye icon (show password)
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
                                </div>
                        </div>
                        <div>
                            <button className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                type='submit' name='submit' disabled={loading} >{loading ? 'Signing in... ' : 'Sign In'}</button>
                        </div>
                    </div>
                    <div className="text-center">
                        <span className="text-sm text-gray-600">
                            Don't have an account?{' '}
                            <button
                                type="button"
                                onClick={onSwitchToRegister}
                                className="font-medium text-blue-600 hover:text-blue-500"
                            >
                                Sign up
                            </button>
                        </span>
                    </div>

                </form>
            </div>

        </div>
    )
}