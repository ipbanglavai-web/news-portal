import React, { useState } from 'react';
import { Language, ViewState, BannerAd, SiteSettings } from '../types';
import { translations } from '../data/mockNews';
import { BannerAdComponent } from './BannerAdComponent';
import { Mail, Phone, MapPin, Facebook, Youtube, Instagram, Twitter, CheckCircle2, Send, User, FileText } from 'lucide-react';

interface FooterProps {
  language: Language;
  onNavigate: (view: ViewState) => void;
  bannerAds?: BannerAd[];
  siteSettings?: SiteSettings;
}

export const Footer: React.FC<FooterProps> = ({ language, onNavigate, bannerAds = [], siteSettings }) => {
  const t = translations[language];
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-gray-900 text-gray-300 pt-8 pb-12 border-t border-gray-800">
      {/* Footer Banner Ad */}
      <BannerAdComponent
        ads={bannerAds}
        position="footer"
        language={language}
        onNavigateToAdvertise={() => onNavigate({ type: 'advertise' })}
        className="mb-8"
      />

      <div className="max-w-7xl mx-auto px-4">
        
        {/* Newsletter Subscription Banner */}
        <div className="bg-gradient-to-r from-red-900 to-gray-800 rounded-2xl p-8 mb-12 shadow-xl border border-red-800/50 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
              {t.subscribeNewsletter}
            </h3>
            <p className="text-gray-300 text-sm">
              {language === 'bn' 
                ? 'প্রতিদিনের বাছাই করা শীর্ষ খবর ও ব্রেকিং আপডেট সরাসরি আপনার ইমেলে পান।' 
                : 'Get top daily headlines and breaking updates delivered straight to your inbox.'}
            </p>
          </div>
          <form onSubmit={handleSubscribe} className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
            {subscribed ? (
              <div className="bg-green-600 text-white px-6 py-3 rounded-xl flex items-center space-x-2 font-medium text-sm">
                <CheckCircle2 className="w-5 h-5" />
                <span>{t.subscribeSuccess}</span>
              </div>
            ) : (
              <>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.enterEmail}
                  required
                  className="bg-gray-900/80 border border-gray-700 text-white placeholder-gray-400 px-4 py-3 rounded-xl focus:outline-none focus:border-red-500 text-sm min-w-[280px]"
                />
                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl transition flex items-center justify-center space-x-2 text-sm shadow-lg shadow-red-900/40"
                >
                  <Send className="w-4 h-4" />
                  <span>{language === 'bn' ? 'সাবস্ক্রাইব' : 'Subscribe'}</span>
                </button>
              </>
            )}
          </form>
        </div>

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Column */}
          <div>
            <div className="mb-4">
              {/* Footer Mobile Logo */}
              {siteSettings?.footerMobileLogoUrl && (
                <div className="block md:hidden">
                  <img 
                    src={siteSettings.footerMobileLogoUrl} 
                    alt="Footer Mobile Logo" 
                    className="w-auto h-auto max-h-20 max-w-[320px] object-contain drop-shadow-sm"
                  />
                </div>
              )}

              {/* Footer Desktop Logo */}
              {siteSettings?.footerDesktopLogoUrl && (
                <div className="hidden md:block">
                  <img 
                    src={siteSettings.footerDesktopLogoUrl} 
                    alt="Footer Desktop Logo" 
                    className="w-auto h-auto max-h-28 max-w-[440px] object-contain drop-shadow-sm"
                  />
                </div>
              )}

              {/* Default Monogram & Title if custom footer logos missing */}
              {(!siteSettings?.footerMobileLogoUrl && !siteSettings?.footerDesktopLogoUrl) && (
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-red-900/50">
                    {siteSettings?.defaultLogoMonogram || '২৪'}
                  </div>
                  <span className="text-3xl font-black text-white tracking-tight">
                    {language === 'bn' ? (siteSettings?.siteNameBn || t.siteTitle) : (siteSettings?.siteNameEn || t.siteTitle)}
                  </span>
                </div>
              )}
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              {language === 'bn' 
                ? 'সত্যের সন্ধানে অবিচল থেকে আমরা প্রকাশ করি নিরপেক্ষ ও বস্তুনিষ্ঠ সংবাদ। দেশের প্রতিটি কোণ থেকে সর্বশেষ আপডেট জানতে আমাদের সাথেই থাকুন।' 
                : 'Uncompromising in the search for truth, we bring you objective and authentic news updates from across the nation.'}
            </p>
            <div className="flex items-center space-x-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-gray-800 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-gray-800 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition">
                <Youtube className="w-4 h-4" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-gray-800 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-gray-800 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 border-b border-gray-800 pb-2">
              {language === 'bn' ? 'গুরুত্বপূর্ণ লিংক' : 'Important Links'}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => onNavigate({ type: 'static', page: 'about' })} className="hover:text-red-500 transition">
                  {t.aboutNav}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate({ type: 'static', page: 'editorial' })} className="hover:text-red-500 transition">
                  {language === 'bn' ? 'সম্পাদনা নীতি' : 'Editorial Policy'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate({ type: 'static', page: 'privacy' })} className="hover:text-red-500 transition">
                  {t.privacyNav}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate({ type: 'static', page: 'terms' })} className="hover:text-red-500 transition">
                  {t.termsNav}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate({ type: 'submit-news' })} className="hover:text-red-500 transition">
                  {t.submitNewsNav}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate({ type: 'advertise' })} className="hover:text-red-500 transition">
                  {t.advertiseNav}
                </button>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 border-b border-gray-800 pb-2">
              {language === 'bn' ? 'প্রধান বিভাগসমূহ' : 'Main Categories'}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><button onClick={() => onNavigate({ type: 'category', categoryId: 'desh' })} className="hover:text-red-500 transition">দেশ</button></li>
              <li><button onClick={() => onNavigate({ type: 'category', categoryId: 'politics' })} className="hover:text-red-500 transition">রাজনীতি</button></li>
              <li><button onClick={() => onNavigate({ type: 'category', categoryId: 'international' })} className="hover:text-red-500 transition">আন্তর্জাতিক</button></li>
              <li><button onClick={() => onNavigate({ type: 'category', categoryId: 'economy' })} className="hover:text-red-500 transition">অর্থনীতি</button></li>
              <li><button onClick={() => onNavigate({ type: 'category', categoryId: 'sports' })} className="hover:text-red-500 transition">খেলাধুলা</button></li>
              <li><button onClick={() => onNavigate({ type: 'category', categoryId: 'technology' })} className="hover:text-red-500 transition">প্রযুক্তি</button></li>
            </ul>
          </div>

          {/* Contact Office */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 border-b border-gray-800 pb-2">
              {language === 'bn' ? 'যোগাযোগ ও অফিস' : 'Office & Contact'}
            </h4>
            <ul className="space-y-3 text-sm text-gray-400">
              {siteSettings?.publisherName && (
                <li className="flex items-start space-x-3">
                  <User className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <span>{language === 'bn' ? 'প্রকাশক: ' : 'Publisher: '}<strong className="text-gray-200">{siteSettings.publisherName}</strong></span>
                </li>
              )}
              {siteSettings?.editorName && (
                <li className="flex items-start space-x-3">
                  <FileText className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <span>{language === 'bn' ? 'সম্পাদক: ' : 'Editor: '}<strong className="text-gray-200">{siteSettings.editorName}</strong></span>
                </li>
              )}
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <span>{siteSettings?.address || 'কাওরান বাজার, ঢাকা-১২১৫, বাংলাদেশ'}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-red-500 shrink-0" />
                <span>{siteSettings?.contactPhone || '+৮৮০ ৯৬১২ ৩৪০৫৬৭'}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-red-500 shrink-0" />
                <span>{siteSettings?.contactEmail || 'contact@banglanews24.mock'}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} {language === 'bn' ? (siteSettings?.siteNameBn || t.siteTitle) : (siteSettings?.siteNameEn || t.siteTitle)}. {siteSettings?.copyrightText || 'All rights reserved.'}</p>
          <p className="flex flex-wrap items-center gap-x-1 gap-y-1">
            <span>{siteSettings?.developerPrefixText ?? 'Designed & Developed with Professional Standards for'}</span>
            {siteSettings?.developerWebsiteUrl ? (
              <a
                href={siteSettings.developerWebsiteUrl.startsWith('http') ? siteSettings.developerWebsiteUrl : `https://${siteSettings.developerWebsiteUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-500 font-bold hover:underline hover:text-red-400 transition"
              >
                {siteSettings?.developerCredit || 'Bangla Media Group'}
              </a>
            ) : (
              <span className="text-red-500 font-bold">{siteSettings?.developerCredit || 'Bangla Media Group'}</span>
            )}
          </p>
        </div>
      </div>
    </footer>
  );
};
