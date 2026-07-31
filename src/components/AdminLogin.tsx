import React, { useState } from 'react';
import { Language, AdminSession } from '../types';
import { translations } from '../data/mockNews';
import { authenticateModeratorWithFirebase } from '../lib/firebase';
import { Shield, Lock, Mail, ArrowLeft, AlertCircle, Loader2, UserCheck } from 'lucide-react';

interface AdminLoginProps {
  language: Language;
  onLoginSuccess: (session: AdminSession) => void;
  onBack: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  language,
  onLoginSuccess,
  onBack
}) => {
  const t = translations[language];
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const cleanEmail = email.trim().toLowerCase();

    // 1. Check Super Admin Credentials
    if (cleanEmail === 'admin@admin.com' && password === 'admin@#') {
      setIsLoading(false);
      onLoginSuccess({ role: 'superadmin' });
      return;
    }

    // 2. Check Firebase Moderator Database
    try {
      const authRes = await authenticateModeratorWithFirebase(cleanEmail, password);
      setIsLoading(false);

      if (authRes.success && authRes.moderator) {
        onLoginSuccess({
          role: 'moderator',
          moderatorInfo: authRes.moderator
        });
      } else if (authRes.errorMsg === 'banned') {
        setError(
          language === 'bn' 
            ? '⚠️ এই মডারেটর অ্যাকাউন্টটি অ্যাডমিন কর্তৃক নিষিদ্ধ (Banned) করা হয়েছে। প্রবেশ নিষিদ্ধ।' 
            : '⚠️ This moderator account has been BANNED by the Admin. Access denied.'
        );
      } else {
        setError(
          language === 'bn' 
            ? 'ভুল ইমেল বা পাসওয়ার্ড! (অ্যাডমিন বা আপনার মডারেটর ইমেল ব্যবহার করুন)' 
            : 'Invalid credentials! (Use Admin or assigned Moderator Gmail/Password)'
        );
      }
    } catch (err) {
      setIsLoading(false);
      setError(
        language === 'bn'
          ? 'সার্ভারে সংযোগ সমস্যা। অনুগ্রহ করে আবার চেষ্টা করুন।'
          : 'Server connection failed. Please try again.'
      );
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 md:p-10 relative overflow-hidden">
        
        {/* Top Header */}
        <button
          onClick={onBack}
          className="absolute top-6 left-6 text-gray-400 hover:text-gray-700 transition"
          title="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="text-center mb-8 pt-4">
          <div className="w-16 h-16 bg-red-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-red-200">
            <Shield className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-gray-900">
            {language === 'bn' ? 'অ্যাডমিন পোর্টাল লগইন' : 'Admin Portal Login'}
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            {language === 'bn' ? 'নিরাপদ ম্যানেজমেন্ট প্যানেলে প্রবেশ করুন' : 'Access secure editorial dashboard'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-3 text-red-700 text-xs">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
              {language === 'bn' ? 'অ্যাডমিন ইমেল' : 'Admin Email'}
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@admin.com"
                className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-red-600 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
              {language === 'bn' ? 'পাসওয়ার্ড' : 'Password'}
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-red-600 font-medium"
              />
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 text-xs text-gray-600 space-y-1">
            <p className="font-bold text-gray-700">Demo Credentials:</p>
            <p>Email: <code className="text-red-600 font-bold">admin@admin.com</code></p>
            <p>Password: <code className="text-red-600 font-bold">admin@#</code></p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-red-200 text-sm flex items-center justify-center space-x-2 disabled:opacity-70"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{language === 'bn' ? 'যাচাই করা হচ্ছে...' : 'Verifying Credentials...'}</span>
              </>
            ) : (
              <span>{language === 'bn' ? 'লগইন করুন' : 'Login to Dashboard'}</span>
            )}
          </button>
        </form>

      </div>
    </div>
  );
};
