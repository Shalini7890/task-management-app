import React, { useState } from 'react';
import { RegisterData } from '../../types';
import { registerUser } from '../../services/api';


interface RegisterProps {
    onSuccess: (token: string, user: any) => void;
    onSwitchToLogin: () => void;
}

export const Register: React.FC<RegisterProps> = ({onSuccess, onSwitchToLogin}) => {

    const [formData, setFormData] = useState<RegisterData>({
    name: '',
    email: '',
    password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await registerUser(formData);
            localStorage.setItem('token', response.token);
            onSuccess(response.token, response.user);
        }
        catch (error: any) {
            setError(error.response?.data?.message || 'Registration failed');
        }
        finally {
            setLoading(false);
        }

    }
    return(<div className='min-h-screen flex bg-gray-50 items-center justify-center'>
            <div className="max-w-md w-full space-y-8 px-4 py-8 md:px-8 ">
                <div>
                    <h2 className='text-3xl font-bold text-center text-gray-900'>Sign up your account</h2>
                </div>
                <form className='mt-8 space-y-6 ' onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                            {error}
                        </div>
                    )}
                    <div className='space-y-4'>
                        <div>
                            <label className='block text-sm font-medium text-gray-700'> Name</label>
                            <input className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                type='name' name='name' placeholder='Enter your name' required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}></input>
                        </div>
                        <div>
                            <label className='block text-sm font-medium text-gray-700'> Email address</label>
                            <input className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                type='email' name='email' placeholder='Enter your email' required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}></input>
                        </div>
                        <div>
                            <label className='block text-sm font-medium text-gray-700'> Password</label>
                            <input className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                type='password' name='password' placeholder='Enter your password' required value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })}></input>
                        </div>
                        <div>
                            <button className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                type='submit' name='submit' disabled={loading} >{loading ? 'Creating account... ' : 'Sign Up'}</button>
                        </div>
                    </div>
                    <div className="text-center">
                        <span className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <button
                                type="button"
                                onClick={onSwitchToLogin}
                                className="font-medium text-blue-600 hover:text-blue-500"
                            >
                                Sign in
                            </button>
                        </span>
                    </div>

                </form>
            </div>

        </div>)
}