import React, { useState } from 'react';
import { Category, Language } from '../types';
import { translations } from '../data/mockNews';
import { Send, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface SubmitNewsViewProps {
  categories: Category[];
  language: Language;
  onBack: () => void;
  onSubmitNews: (data: { reporterName: string; phone: string; email: string; headline: string; categoryId: string; description: string; location: string }) => void;
}

export const SubmitNewsView: React.FC<SubmitNewsViewProps> = ({
  categories,
  language,
  onBack,
  onSubmitNews
}) => {
  const t = translations[language];
  const [reporterName, setReporterName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [headline, setHeadline] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || 'desh');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitNews({
      reporterName,
      phone,
      email,
      headline,
      categoryId,
      description,
      location
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
            <Send className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t.submitNewsTitle}</h1>
            <p className="text-xs text-gray-500">
              {language === 'bn' ? 'আপনার এলাকার গুরুত্বপূর্ণ খবর বা তথ্য আমাদের সাথে শেয়ার করুন।' : 'Share important news or updates from your local area with us.'}
            </p>
          </div>
        </div>

        {submitted ? (
          <div className="bg-green-50 border border-green-200 text-green-800 p-8 rounded-2xl text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto" />
            <h3 className="text-xl font-bold">{language === 'bn' ? 'সংবাদ সফলভাবে জমা হয়েছে!' : 'News Submitted Successfully!'}</h3>
            <p className="text-sm text-green-700">{t.successSubmit}</p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-4 bg-green-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow hover:bg-green-700 transition"
            >
              {language === 'bn' ? 'আরেকটি সংবাদ জমা দিন' : 'Submit Another'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">{t.name} *</label>
                <input
                  type="text"
                  required
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-600"
                  placeholder={language === 'bn' ? 'আপনার নাম' : 'Your name'}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">{t.phone} *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-600"
                  placeholder="01XXXXXXXXX"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">{t.email}</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-600"
                  placeholder="example@domain.com"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">{t.location} *</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-600"
                  placeholder={language === 'bn' ? 'যেমন: ঢাকা, চট্টগ্রাম' : 'e.g., Dhaka, Sylhet'}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">{t.headline} *</label>
                <input
                  type="text"
                  required
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-600"
                  placeholder={language === 'bn' ? 'খবরের মূল শিরোনাম' : 'News headline'}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">{language === 'bn' ? 'বিভাগ' : 'Category'} *</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-600"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {language === 'bn' ? cat.nameBn : cat.nameEn}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">{t.message} *</label>
              <textarea
                rows={5}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl p-4 text-sm focus:outline-none focus:border-red-600"
                placeholder={language === 'bn' ? 'খবরের বিস্তারিত বিবরণ এখানে লিখুন...' : 'Write detailed news description here...'}
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
