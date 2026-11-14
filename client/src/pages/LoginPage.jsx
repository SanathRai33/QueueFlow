import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/layout/AuthLayout';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email.trim() || !password) {
            setError('Enter your email and password');
            return;
        }

        setSubmitting(true);
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Could not login, try again');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AuthLayout title="Welcome back" subtitle="Login to manage your queues">
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="rounded-lg bg-red-50 text-red-600 text-sm px-3 py-2">{error}</div>
                )}

                <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-brand focus:ring-2 focus:ring-indigo-100"
                        placeholder="you@example.com"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-brand focus:ring-2 focus:ring-indigo-100"
                        placeholder="Your password"
                    />
                </div>

                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded-lg bg-brand hover:bg-brand-dark text-white font-medium py-2.5 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {submitting ? 'Logging in...' : 'Login'}
                </button>
            </form>

            <p className="mt-6 text-sm text-slate-500 text-center">
                New here?{' '}
                <Link to="/register" className="text-brand font-medium hover:underline">
                    Create an account
                </Link>
            </p>
        </AuthLayout>
    );
};

export default LoginPage;