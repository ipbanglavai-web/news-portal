import React from 'react';
import { Language, ViewState } from '../types';
import { translations } from '../data/mockNews';
import { ArrowLeft, Mail, Phone, MapPin } from 'lucide-react';

interface StaticPageViewProps {
  page: 'about' | 'privacy' | 'terms' | 'contact' | 'editorial' | 'sitemap';
  language: Language;
  onBack: () => void;
}

export const StaticPageView: React.FC<StaticPageViewProps> = ({ page, language, onBack }) => {
  const t = translations[language];

  const getPageTitle = () => {
    switch (page) {
      case 'about': return language === 'bn' ? 'আমাদের সম্পর্কে' : 'About Us';
      case 'privacy': return language === 'bn' ? 'গোপনীয়তা নীতি' : 'Privacy Policy';
      case 'terms': return language === 'bn' ? 'শর্তাবলী' : 'Terms & Conditions';
      case 'contact': return language === 'bn' ? 'যোগাযোগ' : 'Contact Us';
      case 'editorial': return language === 'bn' ? 'সম্পাদনা নীতি' : 'Editorial Policy';
      case 'sitemap': return language === 'bn' ? 'সাইটম্যাপ' : 'Sitemap';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={onBack}
        className="inline-flex items-center space-x-2 text-sm font-semibold text-gray-700 hover:text-red-600 mb-6 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t.backToHome}</span>
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-6 border-b border-gray-100 pb-4">
          {getPageTitle()}
        </h1>

        {page === 'about' && (
          <div className="space-y-4 text-gray-700 leading-relaxed text-base">
            <p>
              {language === 'bn' 
                ? 'বাংলা নিউজ ২৪ হলো বাংলাদেশের অন্যতম শীর্ষস্থানীয় আধুনিক ও নির্ভরযোগ্য অনলাইন নিউজ পোর্টাল। সত্যের সন্ধানে অবিচল থেকে আমরা দেশ ও বিদেশের সর্বশেষ সংবাদ, রাজনীতি, অর্থনীতি, প্রযুক্তি, বিনোদন এবং খেলাধুলার রিয়েল-টাইম আপডেট পরিবেশন করে আসছি।' 
                : 'Bangla News 24 is one of Bangladesh\'s leading modern and reliable online news portals. Uncompromising in our search for truth, we deliver real-time updates on national and international affairs, politics, economy, technology, entertainment, and sports.'}
            </p>
            <p>
              {language === 'bn'
                ? 'আমাদের লক্ষ্য হলো বস্তুনিষ্ঠ ও নিরপেক্ষ সাংবাদিকতার মাধ্যমে পাঠকদের কাছে সঠিক তথ্য পৌঁছে দেওয়া এবং একটি সচেতন সমাজ গঠনে ভূমিকা রাখা।'
                : 'Our mission is to deliver accurate information to readers through objective and neutral journalism and contribute to building a conscious society.'}
            </p>
          </div>
        )}

        {page === 'privacy' && (
          <div className="space-y-4 text-gray-700 leading-relaxed text-base">
            <h3 className="font-bold text-lg text-gray-900">{language === 'bn' ? 'তথ্য সংগ্রহ ও সুরক্ষা' : 'Data Collection & Security'}</h3>
            <p>
              {language === 'bn'
                ? 'আমরা আপনার গোপনীয়তাকে সর্বোচ্চ গুরুত্ব দিই। আমাদের ওয়েবসাইটে ভিজিট করার সময় সংগৃহীত তথ্য কেবল ব্যবহারকারীর অভিজ্ঞতা উন্নত করার জন্য ব্যবহৃত হয়। কোনো অবস্থাতেই তৃতীয় পক্ষের কাছে আপনার ব্যক্তিগত তথ্য বিক্রি করা হয় না।'
                : 'We value your privacy immensely. Information collected while visiting our website is used solely to enhance user experience and is never sold to third parties.'}
            </p>
          </div>
        )}

        {page === 'terms' && (
          <div className="space-y-4 text-gray-700 leading-relaxed text-base">
            <h3 className="font-bold text-lg text-gray-900">{language === 'bn' ? 'ব্যবহারের শর্তাবলী' : 'Terms of Use'}</h3>
            <p>
              {language === 'bn'
                ? 'বাংলা নিউজ ২৪-এর সমস্ত কন্টেন্ট, লোগো, এবং ছবি কপিরাইট আইনের আওতাধীন। পূর্বানুমতি ছাড়া পোর্টালের কোনো সংবাদ বা ছবি বাণিজ্যিক উদ্দেশ্যে ব্যবহার করা আইনত দণ্ডনীয়।'
                : 'All content, logos, and images on Bangla News 24 are protected by copyright laws. Unauthorized commercial use of any content is strictly prohibited.'}
            </p>
          </div>
        )}

        {page === 'contact' && (
          <div className="space-y-6 text-gray-700 leading-relaxed text-base">
            <p>{language === 'bn' ? 'যেকোনো প্রয়োজনে আমাদের সাথে যোগাযোগ করুন:' : 'Get in touch with us for any inquiries:'}</p>
            <div className="space-y-4 bg-gray-50 p-6 rounded-xl border border-gray-200">
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-red-600 shrink-0" />
                <span>কাওরান বাজার, ঢাকা-১২১৫, বাংলাদেশ</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-red-600 shrink-0" />
                <span>+৮৮০ ৯৬১২ ৩৪০৫৬৭</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-red-600 shrink-0" />
                <span>contact@banglanews24.mock</span>
              </div>
            </div>
          </div>
        )}

        {page === 'editorial' && (
          <div className="space-y-4 text-gray-700 leading-relaxed text-base">
            <h3 className="font-bold text-lg text-gray-900">{language === 'bn' ? 'আমাদের সম্পাদনা নীতি' : 'Our Editorial Standards'}</h3>
            <p>
              {language === 'bn'
                ? 'আমরা সংবাদ পরিবেশনে নির্ভুলতা, ভারসাম্য এবং সত্যনিষ্ঠাকে প্রধান অগ্রাধিকার দেই। কোনো পক্ষপাতিত্ব ছাড়াই ঘটনার পেছনের সত্য তুলে ধরাই আমাদের মূল অঙ্গীকার।'
                : 'We prioritize accuracy, balance, and integrity in reporting. Our core commitment is to uncover the truth behind events without bias.'}
            </p>
          </div>
        )}

        {page === 'sitemap' && (
          <div className="space-y-4 text-gray-700 leading-relaxed text-base">
            <h3 className="font-bold text-lg text-gray-900">{language === 'bn' ? 'সাইটম্যাপ নির্দেশিকা' : 'Sitemap Directory'}</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>প্রচ্ছদ (Home)</li>
              <li>দেশ, রাজনীতি, আন্তর্জাতিক, অর্থনীতি, খেলাধুলা</li>
              <li>প্রযুক্তি, বিনোদন, শিক্ষা, স্বাস্থ্য, চাকরি</li>
              <li>সংবাদ জমা দিন ও বিজ্ঞাপন</li>
            </ul>
          </div>
        )}

      </div>
    </div>
  );
};
