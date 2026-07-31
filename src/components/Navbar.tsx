import React, { useState } from 'react';
import { Language, ViewState, SiteSettings } from '../types';
import { translations } from '../data/mockNews';
import { Search, Bookmark, Globe, Menu, X, Shield, Send, Megaphone, Phone, FileText, Info } from 'lucide-react';

interface NavbarProps {
  language: Language;
  onToggleLanguage: () => void;
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  bookmarksCount: number;
  onOpenSearch: () => void;
  siteSettings?: SiteSettings;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onToggleLanguage,
  onNavigate,
  bookmarksCount,
  onOpenSearch,
  siteSettings
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = translations[language];

  const currentDateStr = new Date().toLocaleDateString(
    language === 'bn' ? 'bn-BD' : 'en-US',
    { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  );

  return (
    <>
      {/* Top Bar for Date & Weather (Hidden on Mobile) */}
      <div className="hidden sm:block bg-gray-900 text-gray-300 text-xs py-2 px-4 border-b border-gray-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center space-x-4">
            <span className="font-medium">{currentDateStr}</span>
            <span className="hidden sm:inline text-gray-500">|</span>
            <span className="hidden sm:inline text-red-400 font-semibold">ঢাকা: ৩০°C, বৃষ্টিপাত</span>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => onNavigate({ type: 'submit-news' })}
              className="hover:text-white transition flex items-center space-x-1"
            >
              <Send className="w-3 h-3 text-red-500" />
              <span>{t.submitNewsNav}</span>
            </button>
            <span className="text-gray-600">|</span>
            <button 
              onClick={() => onNavigate({ type: 'advertise' })}
              className="hover:text-white transition flex items-center space-x-1"
            >
              <Megaphone className="w-3 h-3 text-red-500" />
              <span>{t.advertiseNav}</span>
            </button>
            <span className="text-gray-600">|</span>
            <button 
              onClick={() => onNavigate({ type: 'admin-login' })}
              className="hover:text-white transition flex items-center space-x-1 text-red-400 font-medium"
            >
              <Shield className="w-3 h-3" />
              <span>{t.adminLogin}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-gray-200/80 sticky top-0 z-40 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between">
          
          {/* Left: Brand Logo */}
          <div 
            onClick={() => onNavigate({ type: 'home' })}
            className="cursor-pointer flex items-center space-x-3 group"
          >
            {/* Mobile View */}
            <div className="block md:hidden flex items-center space-x-2">
              {siteSettings?.mobileLogoUrl ? (
                <img 
                  src={siteSettings.mobileLogoUrl} 
                  alt="Mobile Logo" 
                  className="w-auto h-auto max-h-9 max-w-[160px] object-contain"
                />
              ) : (
                <>
                  <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center text-white font-black text-base shadow-md shadow-red-200">
                    {siteSettings?.defaultLogoMonogram || '২৪'}
                  </div>
                  <div>
                    <h1 className="text-lg font-black text-gray-900 tracking-tight">
                      {language === 'bn' ? (siteSettings?.siteNameBn || t.siteTitle) : (siteSettings?.siteNameEn || t.siteTitle)}
                    </h1>
                  </div>
                </>
              )}
            </div>

            {/* Desktop View */}
            <div className="hidden md:flex items-center space-x-3">
              {siteSettings?.desktopLogoUrl ? (
                <img 
                  src={siteSettings.desktopLogoUrl} 
                  alt="Desktop Logo" 
                  className="w-auto h-auto max-h-12 max-w-[260px] object-contain"
                />
              ) : (
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-red-200 group-hover:scale-105 transition-transform">
                    {siteSettings?.defaultLogoMonogram || '২৪'}
                  </div>
                  <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight group-hover:text-red-600 transition-colors">
                      {language === 'bn' ? (siteSettings?.siteNameBn || t.siteTitle) : (siteSettings?.siteNameEn || t.siteTitle)}
                    </h1>
                    <p className="text-[11px] text-gray-500 tracking-wide font-semibold">
                      {language === 'bn' ? (siteSettings?.taglineBn || t.tagline) : (siteSettings?.taglineEn || t.tagline)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Actions: Search, Bookmarks, Language Switch, Hamburger Menu */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={onOpenSearch}
              className="hidden sm:flex p-2.5 rounded-xl bg-gray-100/80 text-gray-700 hover:bg-red-50 hover:text-red-600 transition items-center space-x-1.5 px-3.5 text-sm font-semibold border border-transparent hover:border-red-200"
              title="Search"
            >
              <Search className="w-4 h-4" />
              <span>{t.searchButton}</span>
            </button>

            <button
              onClick={() => onNavigate({ type: 'bookmarks' })}
              className="hidden sm:flex relative p-2.5 rounded-xl bg-gray-100/80 text-gray-700 hover:bg-red-50 hover:text-red-600 transition items-center border border-transparent hover:border-red-200"
              title="Bookmarks"
            >
              <Bookmark className="w-4 h-4" />
              {bookmarksCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-md animate-pulse">
                  {bookmarksCount}
                </span>
              )}
            </button>

            <button
              onClick={onToggleLanguage}
              className="bg-red-50 text-red-600 border border-red-200 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold hover:bg-red-600 hover:text-white transition flex items-center space-x-1.5 shadow-sm"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'English' : 'বাংলা'}</span>
            </button>

            {/* Hamburger Menu on Right Side */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2.5 bg-gray-900 text-white hover:bg-red-600 transition rounded-xl shadow-md flex items-center justify-center group"
              aria-label="Open Menu"
              title="Menu"
            >
              <Menu className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Menu (Slides from Left to Right) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Sliding Panel */}
          <div className="relative w-80 max-w-full bg-white h-full shadow-2xl flex flex-col z-10 transform transition-transform animate-in slide-in-from-left duration-300">
            <div className="p-4 bg-red-600 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {siteSettings?.mobileLogoUrl || siteSettings?.desktopLogoUrl ? (
                  <img 
                    src={siteSettings?.mobileLogoUrl || siteSettings?.desktopLogoUrl} 
                    alt="Logo" 
                    className="h-8 max-w-[150px] object-contain bg-white/10 rounded p-1"
                  />
                ) : (
                  <>
                    <div className="w-8 h-8 bg-white text-red-600 rounded flex items-center justify-center font-black">
                      {siteSettings?.defaultLogoMonogram || '২৪'}
                    </div>
                    <span className="font-bold text-lg">
                      {language === 'bn' ? (siteSettings?.siteNameBn || t.siteTitle) : (siteSettings?.siteNameEn || t.siteTitle)}
                    </span>
                  </>
                )}
              </div>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-full hover:bg-red-700 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 px-6 space-y-4">
              <div className="space-y-1">
                <button
                  onClick={() => { onNavigate({ type: 'home' }); setMobileMenuOpen(false); }}
                  className="w-full text-left py-2.5 px-3 rounded-lg hover:bg-red-50 hover:text-red-600 font-semibold text-gray-800 transition flex items-center space-x-3"
                >
                  <Globe className="w-4 h-4 text-red-600" />
                  <span>{language === 'bn' ? 'প্রচ্ছদ (Home)' : 'Home'}</span>
                </button>

                <button
                  onClick={() => { onOpenSearch(); setMobileMenuOpen(false); }}
                  className="w-full text-left py-2.5 px-3 rounded-lg hover:bg-red-50 hover:text-red-600 font-semibold text-gray-800 transition flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <Search className="w-4 h-4 text-red-600" />
                    <span>{t.searchButton}</span>
                  </div>
                </button>

                <button
                  onClick={() => { onNavigate({ type: 'bookmarks' }); setMobileMenuOpen(false); }}
                  className="w-full text-left py-2.5 px-3 rounded-lg hover:bg-red-50 hover:text-red-600 font-semibold text-gray-800 transition flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <Bookmark className="w-4 h-4 text-red-600" />
                    <span>{language === 'bn' ? 'বুকমার্কসমূহ' : 'Bookmarks'}</span>
                  </div>
                  {bookmarksCount > 0 && (
                    <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                      {bookmarksCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => { onNavigate({ type: 'submit-news' }); setMobileMenuOpen(false); }}
                  className="w-full text-left py-2.5 px-3 rounded-lg hover:bg-red-50 hover:text-red-600 font-semibold text-gray-800 transition flex items-center space-x-3"
                >
                  <Send className="w-4 h-4 text-red-600" />
                  <span>{t.submitNewsNav}</span>
                </button>

                <button
                  onClick={() => { onNavigate({ type: 'advertise' }); setMobileMenuOpen(false); }}
                  className="w-full text-left py-2.5 px-3 rounded-lg hover:bg-red-50 hover:text-red-600 font-semibold text-gray-800 transition flex items-center space-x-3"
                >
                  <Megaphone className="w-4 h-4 text-red-600" />
                  <span>{t.advertiseNav}</span>
                </button>
              </div>

              <hr className="border-gray-200" />

              <div className="space-y-1">
                <button
                  onClick={() => { onNavigate({ type: 'static', page: 'about' }); setMobileMenuOpen(false); }}
                  className="w-full text-left py-2 px-3 rounded-lg hover:bg-gray-100 text-gray-700 font-medium transition flex items-center space-x-3"
                >
                  <Info className="w-4 h-4 text-gray-500" />
                  <span>{t.aboutNav}</span>
                </button>
                <button
                  onClick={() => { onNavigate({ type: 'static', page: 'privacy' }); setMobileMenuOpen(false); }}
                  className="w-full text-left py-2 px-3 rounded-lg hover:bg-gray-100 text-gray-700 font-medium transition flex items-center space-x-3"
                >
                  <FileText className="w-4 h-4 text-gray-500" />
                  <span>{t.privacyNav}</span>
                </button>
                <button
                  onClick={() => { onNavigate({ type: 'static', page: 'terms' }); setMobileMenuOpen(false); }}
                  className="w-full text-left py-2 px-3 rounded-lg hover:bg-gray-100 text-gray-700 font-medium transition flex items-center space-x-3"
                >
                  <FileText className="w-4 h-4 text-gray-500" />
                  <span>{t.termsNav}</span>
                </button>
                <button
                  onClick={() => { onNavigate({ type: 'static', page: 'contact' }); setMobileMenuOpen(false); }}
                  className="w-full text-left py-2 px-3 rounded-lg hover:bg-gray-100 text-gray-700 font-medium transition flex items-center space-x-3"
                >
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span>{t.contactNav}</span>
                </button>
              </div>

              <hr className="border-gray-200" />

              <div className="pt-2">
                <button
                  onClick={() => { onNavigate({ type: 'admin-login' }); setMobileMenuOpen(false); }}
                  className="w-full bg-gray-900 text-white py-2.5 rounded-lg font-semibold flex items-center justify-center space-x-2 hover:bg-gray-800 transition shadow"
                >
                  <Shield className="w-4 h-4 text-red-500" />
                  <span>{t.adminLogin}</span>
                </button>
              </div>
            </div>
            
            <div className="p-4 bg-gray-50 border-t border-gray-200 text-center text-xs text-gray-500">
              © {new Date().getFullYear()} {t.siteTitle}. All rights reserved.
            </div>
          </div>
        </div>
      )}
    </>
  );
};
