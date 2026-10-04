import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../../context/SocketContext';
import { apiFetch } from '../../lib/api';

export default function AuthModal({ isOpen, onClose, defaultIsLogin = true }) {
    const [isLogin, setIsLogin] = useState(defaultIsLogin);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [busy, setBusy] = useState(false);
    const { login } = useSocket();
    const navigate = useNavigate();
    useEffect(() => { setIsLogin(defaultIsLogin); setError(''); setPassword(''); }, [defaultIsLogin, isOpen]);
    if (!isOpen) return null;
    const submit = async (event) => {
        event.preventDefault(); setError(''); setBusy(true);
        try {
            const response = await apiFetch(`/api/auth/${isLogin ? 'login' : 'register'}`, {
                method: 'POST', body: JSON.stringify({ username, password }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Sign-in failed');
            login(data); setPassword(''); onClose(); navigate('/dashboard');
        } catch (err) { setError(err.message); }
        finally { setBusy(false); }
    };
    return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
        <section role="dialog" aria-modal="true" aria-labelledby="auth-title" className="w-full max-w-md rounded-2xl bg-gray-900 p-8 text-white">
            <button onClick={onClose} aria-label="Close sign in" className="float-right">✕</button>
            <h2 id="auth-title" className="text-2xl mb-6">{isLogin ? 'Sign in' : 'Create an account'}</h2>
            <form onSubmit={submit} className="space-y-4">
                <label className="block">Username
                    <input required autoComplete="username" pattern="[a-zA-Z0-9_]{3,32}" minLength={3} maxLength={32} value={username} onChange={e => setUsername(e.target.value)} className="block w-full bg-gray-800 rounded p-3" />
                </label>
                <p className="text-sm text-gray-400">3–32 letters, digits or underscores.</p>
                <label className="block">Password
                    <input required type="password" autoComplete={isLogin ? 'current-password' : 'new-password'} minLength={12} maxLength={128} value={password} onChange={e => setPassword(e.target.value)} className="block w-full bg-gray-800 rounded p-3" />
                </label>
                <p className="text-sm text-gray-400">Use 12–128 characters.</p>
                {error && <p role="alert" className="text-red-400">{error}</p>}
                <button disabled={busy} className="w-full rounded bg-blue-600 p-3">{busy ? 'Please wait…' : isLogin ? 'Sign in' : 'Create account'}</button>
                <button type="button" disabled={busy} onClick={() => { setIsLogin(!isLogin); setError(''); }} className="text-blue-300">{isLogin ? 'Create an account' : 'Already registered? Sign in'}</button>
            </form>
        </section>
    </div>;
}
