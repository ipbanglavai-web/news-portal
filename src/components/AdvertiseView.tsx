import React, { useState } from 'react';
import { Language } from '../types';
import { translations } from '../data/mockNews';
import { Megaphone, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface AdvertiseViewProps {
  language: Language;
  onBack: () => void;
  onSubmitAdRequest: (data: any) => void;
}

export const AdvertiseView: React.FC<AdvertiseViewProps> = ({
  language,
  onBack,
  onSubmitAdRequest
}) => {
  const t = translations[language];
  const [companyName, setCompanyName] = useState('');
  const [personName, setPersonName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [budget, setBudget] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitAdRequest({
      companyName,
      personName,
      phone,
      email,
      website,
      budget,
      message
    });
    setSubmitted(true);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <button
        onClick={onBack}
        className="inline-flex items-center space-x-2 text-sm font-semibold text-gray-700 hover:text-red-600 mb-6 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t.backToHome}</span>
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10">
        <div className="flex items-center space-x-3 mb-6 border-b border-gray-100 pb-4">
          <div className="w-10 h-10 bg-red-600 text-white rounded-xl flex items-center justify-center font-bold">
            <Megaphone className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t.advertiseTitle}</h1>
            <p className="text-xs text-gray-500">
              {language === 'bn' ? 'আপনার কোম্পানির বিজ্ঞাপন আমাদের পোর্টালে প্রচারের জন্য আবেদন করুন।' : 'Submit your request to promote your brand or company on our news portal.'}
            </p>
          </div>
        </div>

        {submitted ? (
          <div className="bg-green-50 border border-green-200 text-green-800 p-8 rounded-2xl text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto" />
            <h3 className="text-xl font-bold">{language === 'bn' ? 'আবেদন সফলভাবে জমা হয়েছে!' : 'Application Submitted Successfully!'}</h3>
            <p className="text-sm text-green-700">
              {language === 'bn' ? 'আমাদের মার্কেটিং টিম খুব শীঘ্রই আপনার সাথে যোগাযোগ করবে।' : 'Our marketing team will contact you shortly.'}
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-4 bg-green-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow hover:bg-green-700 transition"
            >
              {language === 'bn' ? 'নতুন আবেদন' : 'Submit Another'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  {language === 'bn' ? 'কোম্পানির নাম' : 'Company Name'} *
                </label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-600"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">{t.name} *</label>
                <input
                  type="text"
                  required
                  value={personName}
                  onChange={(e) => setPersonName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">{t.phone} *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-600"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">{t.email} *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  {language === 'bn' ? 'ওয়েবসাইট (যদি থাকে)' : 'Website (Optional)'}
                </label>
                <input
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-600"
                  placeholder="https://"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  {language === 'bn' ? 'আনুমানিক বাজেট (টাকা)' : 'Estimated Budget'} *
                </label>
                <input
                  type="text"
                  required
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-600"
                  placeholder="e.g. 50,000 BDT"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">{t.message} *</label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl p-4 text-sm focus:outline-none focus:border-red-600"
                placeholder={language === 'bn' ? 'বিজ্ঞাপন সংক্রান্ত আপনার চাহিদা লিখুন...' : 'Write your advertising requirements...'}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-red-200 text-base"
            >
              {t.submitButton}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
