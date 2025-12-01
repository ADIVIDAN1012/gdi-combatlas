import React, { useState, useEffect } from 'react';
import { CombatlasLogoIcon, UserIcon, EmailIcon, ShieldCheckIcon } from './icons';

interface LoginScreenProps {
    onLogin: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);

    // Clear messages when switching modes
    useEffect(() => {
        setMessage(null);
        setFormData({ username: '', email: '', password: '', confirmPassword: '' });
    }, [isLoginMode]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const hashPassword = async (password: string): Promise<string> => {
        try {
            if (window.crypto && window.crypto.subtle) {
                const msgBuffer = new TextEncoder().encode(password);
                const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            } else {
                // Fallback for non-secure contexts (e.g. LAN)
                console.warn("Secure context not available. Using fallback hashing.");
                let hash = 0;
                for (let i = 0; i < password.length; i++) {
                    const char = password.charCodeAt(i);
                    hash = ((hash << 5) - hash) + char;
                    hash = hash & hash; // Convert to 32bit integer
                }
                return 'insecure_' + Math.abs(hash).toString(16);
            }
        } catch (e) {
            console.error("Hashing failed", e);
            return 'error_' + password; // Should not happen, but prevents crash
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        try {
            const { username, password } = formData;

            // 1. Check Hardcoded Admin (Backdoor)
            if ((username.toLowerCase() === 'admin' || username.toLowerCase() === 'user') && 
                (password === 'JAIHIND' || password === 'jaihind')) {
                onLogin();
                return;
            }

            // 2. Check Local Storage "Database"
            const existingUsers = JSON.parse(localStorage.getItem('combatlas_users') || '[]');
            const hashedPassword = await hashPassword(password);
            
            const user = existingUsers.find((u: any) => 
                u.username.toLowerCase() === username.toLowerCase() && u.password === hashedPassword
            );

            if (user) {
                onLogin();
            } else {
                setMessage({ type: 'error', text: 'ACCESS DENIED. INVALID CREDENTIALS.' });
            }
        } catch (error) {
            console.error("Login error:", error);
            setMessage({ type: 'error', text: 'SYSTEM ERROR. PLEASE RETRY.' });
        }
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        try {
            const { username, email, password, confirmPassword } = formData;

            // Basic Validation
            if (!username || !email || !password) {
                setMessage({ type: 'error', text: 'ALL FIELDS MANDATORY FOR CLEARANCE.' });
                return;
            }

            if (password !== confirmPassword) {
                setMessage({ type: 'error', text: 'PASSWORD MISMATCH. SECURITY PROTOCOL FAILED.' });
                return;
            }

            // Check if user exists
            const existingUsers = JSON.parse(localStorage.getItem('combatlas_users') || '[]');
            if (existingUsers.some((u: any) => u.username.toLowerCase() === username.toLowerCase())) {
                setMessage({ type: 'error', text: 'OPERATIVE ID ALREADY REGISTERED.' });
                return;
            }

            // Save new user with HASHED password
            const hashedPassword = await hashPassword(password);
            const newUser = { username, email, password: hashedPassword };
            localStorage.setItem('combatlas_users', JSON.stringify([...existingUsers, newUser]));

            setMessage({ type: 'success', text: 'CLEARANCE GRANTED. PLEASE AUTHENTICATE.' });
            
            // Switch to login mode after short delay
            setTimeout(() => {
                setIsLoginMode(true);
                setFormData({ username: '', email: '', password: '', confirmPassword: '' }); // Clear form for security
                setMessage({ type: 'success', text: 'ACCOUNT CREATED. ENTER CREDENTIALS.' });
            }, 1500);
        } catch (error) {
            console.error("Sign up error:", error);
            setMessage({ type: 'error', text: 'REGISTRATION FAILED. CONTACT ADMIN.' });
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-grid-cyan-500/[0.05]"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
            
            <div className="relative z-10 w-full max-w-md">
                <div className="bg-gray-900/90 backdrop-blur-xl border-2 border-cyan-500/30 rounded-xl shadow-2xl shadow-cyan-900/40 p-6 md:p-8">
                    
                    {/* Header */}
                    <div className="flex flex-col items-center mb-6">
                        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center border-2 border-cyan-400/50 shadow-[0_0_20px_rgba(34,211,238,0.2)] mb-3 animate-pulse">
                            <CombatlasLogoIcon className="w-10 h-10 text-cyan-400" />
                        </div>
                        <h1 className="text-2xl font-bold text-cyan-400 tracking-[0.2em] text-center">COMBATLAS</h1>
                        <p className="text-[10px] text-cyan-600 mt-1 tracking-widest uppercase">Indian Defense Network</p>
                        <p className="text-[9px] text-gray-500 mt-2 tracking-widest border border-gray-700 px-2 py-0.5 rounded-sm">
                            INITIATIVE BY <span className="text-cyan-500 font-bold">GDI</span>
                        </p>
                    </div>

                    {/* Mode Toggles */}
                    <div className="flex border-b border-cyan-500/20 mb-6">
                        <button 
                            onClick={() => setIsLoginMode(true)}
                            className={`flex-1 pb-2 text-xs font-bold tracking-wider transition-colors uppercase ${
                                isLoginMode ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-500 hover:text-gray-300'
                            }`}
                        >
                            Access Terminal
                        </button>
                        <button 
                            onClick={() => setIsLoginMode(false)}
                            className={`flex-1 pb-2 text-xs font-bold tracking-wider transition-colors uppercase ${
                                !isLoginMode ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-500 hover:text-gray-300'
                            }`}
                        >
                            Request Clearance
                        </button>
                    </div>

                    {/* Warning Banner */}
                    <div className={`border rounded p-3 mb-6 text-center transition-colors ${
                        message?.type === 'success' 
                            ? 'bg-green-900/20 border-green-500/30 text-green-400' 
                            : 'bg-red-900/20 border-red-500/30 text-red-400'
                    }`}>
                        <p className="text-xs font-bold tracking-wider">
                            {message ? message.text : (isLoginMode ? 'RESTRICTED ACCESS' : 'ENCRYPTION PROTOCOL')}
                        </p>
                        {!message && (
                            <p className={`text-[10px] mt-1 opacity-70`}>
                                {isLoginMode ? 'AUTHORIZED PERSONNEL ONLY' : 'SECURE REGISTRATION'}
                            </p>
                        )}
                    </div>

                    {/* Forms */}
                    <form onSubmit={isLoginMode ? handleLogin : handleSignUp} className="space-y-4">
                        <div>
                            <label className="flex items-center text-xs text-cyan-300/70 uppercase tracking-wider mb-1">
                                <UserIcon className="w-3 h-3 mr-1" /> Operative ID
                            </label>
                            <input 
                                type="text" 
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                className="w-full bg-gray-800/50 border border-cyan-500/30 rounded p-3 text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all text-sm"
                                placeholder="Enter Username"
                            />
                        </div>

                        {!isLoginMode && (
                             <div>
                                <label className="flex items-center text-xs text-cyan-300/70 uppercase tracking-wider mb-1">
                                    <EmailIcon className="w-3 h-3 mr-1" /> Secure Email
                                </label>
                                <input 
                                    type="email" 
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full bg-gray-800/50 border border-cyan-500/30 rounded p-3 text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all text-sm"
                                    placeholder="Enter Email"
                                />
                            </div>
                        )}

                        <div>
                            <label className="flex items-center text-xs text-cyan-300/70 uppercase tracking-wider mb-1">
                                <ShieldCheckIcon className="w-3 h-3 mr-1" /> Access Code
                            </label>
                            <input 
                                type="password" 
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className="w-full bg-gray-800/50 border border-cyan-500/30 rounded p-3 text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all text-sm"
                                placeholder="Enter Password"
                            />
                        </div>

                        {!isLoginMode && (
                             <div>
                                <label className="flex items-center text-xs text-cyan-300/70 uppercase tracking-wider mb-1">
                                    <ShieldCheckIcon className="w-3 h-3 mr-1" /> Confirm Code
                                </label>
                                <input 
                                    type="password" 
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    className="w-full bg-gray-800/50 border border-cyan-500/30 rounded p-3 text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all text-sm"
                                    placeholder="Repeat Password"
                                />
                            </div>
                        )}

                        <button 
                            type="submit"
                            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded border border-cyan-400/50 shadow-[0_0_15px_rgba(8,145,178,0.4)] hover:shadow-[0_0_25px_rgba(34,211,238,0.6)] transition-all duration-300 mt-6 uppercase tracking-wider text-sm"
                        >
                            {isLoginMode ? 'Initialize System' : 'Submit Clearance'}
                        </button>
                    </form>

                    <div className="mt-6 pt-4 border-t border-cyan-500/10 text-center">
                         <p className="text-gray-500 text-[10px]">
                            {isLoginMode ? (
                                <>NO CLEARANCE? <button onClick={() => setIsLoginMode(false)} className="text-cyan-400 hover:text-cyan-300 ml-1 underline">REGISTER ID</button></>
                            ) : (
                                <>ALREADY AUTHORIZED? <button onClick={() => setIsLoginMode(true)} className="text-cyan-400 hover:text-cyan-300 ml-1 underline">LOGIN TERMINAL</button></>
                            )}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};