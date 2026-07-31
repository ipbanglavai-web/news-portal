import React from 'react';
import { BannerAd, Language } from '../types';
import { Sparkles, ExternalLink } from 'lucide-react';

interface BannerAdComponentProps {
  ads: BannerAd[];
  position: 'header' | 'sidebar' | 'inline' | 'footer';
  language: Language;
  onNavigateToAdvertise?: () => void;
  className?: string;
}

export const BannerAdComponent: React.FC<BannerAdComponentProps> = ({
  ads,
  position,
  language,
  onNavigateToAdvertise,
  className = ''
}) => {
  // Find active ad for this position
  const activeAd = ads.find(ad => ad.position === position && ad.isActive);

  // If no active ad is assigned for this slot, show a placeholder call-to-action
  if (!activeAd) {
    if (position === 'header') {
      return (
        <div className={`w-full flex justify-center my-3 px-2 ${className}`}>
          <div className="w-full max-w-[728px] h-[60px] sm:h-[90px] bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-xl border border-gray-700/60 p-2 sm:p-3 flex items-center justify-between text-white shadow-sm overflow-hidden">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <span className="bg-red-600/30 text-red-400 p-1.5 sm:p-2 rounded-lg shrink-0">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 animate-pulse" />
              </span>
              <div>
                <span className="text-[10px] sm:text-xs text-red-400 font-bold uppercase tracking-wider block">
                  {language === 'bn' ? 'বিজ্ঞাপন স্থান' : 'HEADER AD SLOT (728x90)'}
                </span>
                <p className="text-xs sm:text-sm font-bold truncate">
                  {language === 'bn' ? 'এখানে আপনার পণ্যের বিজ্ঞাপন দিন' : 'Advertise Your Brand Here'}
                </p>
              </div>
            </div>
            {onNavigateToAdvertise && (
              <button
                onClick={onNavigateToAdvertise}
                className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition shadow shrink-0 whitespace-nowrap"
              >
                {language === 'bn' ? 'যোগাযোগ করুন' : 'Book Space'}
              </button>
            )}
          </div>
        </div>
      );
    }

    if (position === 'sidebar') {
      return (
        <div className={`bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-5 text-white text-center shadow-sm border border-gray-700 ${className}`}>
          <div className="inline-flex p-3 bg-red-600/20 text-yellow-400 rounded-full mb-3">
            <Sparkles className="w-6 h-6 animate-bounce" />
          </div>
          <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1">
            {language === 'bn' ? 'সাইডবার বিজ্ঞাপন (300x250)' : 'SIDEBAR AD SLOT (300x250)'}
          </span>
          <h5 className="font-extrabold text-base mb-1">
            {language === 'bn' ? 'আপনার ব্র্যান্ড প্রচার করুন' : 'Promote Your Business'}
          </h5>
          <p className="text-xs text-gray-300 mb-4 leading-relaxed">
            {language === 'bn' ? 'লাখ লাখ পাঠকের কাছে পৌঁছান সহজে।' : 'Reach over a million active readers daily with GIF or JPG ads.'}
          </p>
          {onNavigateToAdvertise && (
            <button 
              onClick={onNavigateToAdvertise} 
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-2.5 rounded-xl shadow transition"
            >
              {language === 'bn' ? 'বিজ্ঞাপন পোস্ট করুন' : 'Place Advertisement'}
            </button>
          )}
        </div>
      );
    }

    if (position === 'inline') {
      return (
        <div className={`w-full my-6 ${className}`}>
          <div className="w-full max-w-[750px] mx-auto h-[80px] sm:h-[100px] bg-gray-100 rounded-2xl border-2 border-dashed border-gray-300 p-3 flex items-center justify-between text-gray-600">
            <div className="flex items-center space-x-3">
              <span className="text-xs bg-gray-200 text-gray-700 font-bold px-2.5 py-1 rounded-md uppercase">
                {language === 'bn' ? 'ইন-আর্টিকেল বিজ্ঞাপন (728x90 / 320x100)' : 'IN-ARTICLE AD (728x90 / 320x100)'}
              </span>
              <p className="text-xs font-semibold hidden sm:block">
                {language === 'bn' ? 'আপনার আকর্ষণীয় GIF বা JPG বিজ্ঞাপন দিন' : 'Showcase your animated GIF or banner ad here'}
              </p>
            </div>
            {onNavigateToAdvertise && (
              <button
                onClick={onNavigateToAdvertise}
                className="bg-gray-800 hover:bg-gray-900 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition"
              >
                {language === 'bn' ? 'বিজ্ঞাপন দিন' : 'Advertise'}
              </button>
            )}
          </div>
        </div>
      );
    }

    // Footer position placeholder
    return (
      <div className={`w-full py-4 bg-gray-900 border-t border-gray-800 ${className}`}>
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-xs text-gray-400">
          <span className="font-semibold">
            {language === 'bn' ? 'ফুটার বিজ্ঞাপন স্থান (970x90 / 320x50)' : 'FOOTER AD SLOT (970x90 / 320x50)'}
          </span>
          {onNavigateToAdvertise && (
            <button onClick={onNavigateToAdvertise} className="text-red-400 hover:underline font-bold">
              {language === 'bn' ? 'বিজ্ঞাপন বুকিং করুন' : 'Book Footer Ad'}
            </button>
          )}
        </div>
      </div>
    );
  }

  // Helper to check if image is GIF or JPG/PNG
  const isGif = activeAd.imageUrl.toLowerCase().includes('.gif');

  // Render Active Ad
  const AdContainer = activeAd.linkUrl ? 'a' : 'div';
  const containerProps = activeAd.linkUrl ? {
    href: activeAd.linkUrl,
    target: '_blank',
    rel: 'noopener noreferrer',
    className: 'group block relative overflow-hidden rounded-2xl shadow-sm border border-gray-200/80 bg-black/5 hover:opacity-98 transition'
  } : {
    className: 'relative overflow-hidden rounded-2xl shadow-sm border border-gray-200/80 bg-black/5'
  };

  if (position === 'header') {
    return (
      <div className={`w-full flex justify-center my-3 px-2 ${className}`}>
        <div className="w-full max-w-[970px] relative">
          <AdContainer {...containerProps}>
            {/* Ad Badge */}
            <div className="absolute top-1.5 left-1.5 z-10 bg-black/70 backdrop-blur-md text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider flex items-center space-x-1">
              <span>{language === 'bn' ? 'বিজ্ঞাপন' : 'AD'}</span>
              {isGif && <span className="bg-yellow-500 text-black px-1 rounded text-[8px]">GIF</span>}
            </div>

            {/* Desktop / Mobile Optimized Image Container */}
            <div className="w-full h-[60px] sm:h-[90px] md:h-[100px] flex items-center justify-center bg-gray-900/5">
              <img
                src={activeAd.imageUrl}
                alt={activeAd.title}
                className="w-full h-full object-cover sm:object-fill rounded-2xl"
                loading="lazy"
                onError={(e) => {
                  // Fallback if image fails
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>

            {activeAd.linkUrl && (
              <div className="absolute bottom-1.5 right-1.5 z-10 bg-black/60 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition">
                <ExternalLink className="w-3.5 h-3.5" />
              </div>
            )}
          </AdContainer>
        </div>
      </div>
    );
  }

  if (position === 'sidebar') {
    return (
      <div className={`w-full ${className}`}>
        <div className="relative">
          <AdContainer {...containerProps}>
            {/* Ad Badge */}
            <div className="absolute top-2 left-2 z-10 bg-black/70 backdrop-blur-md text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider flex items-center space-x-1">
              <span>{language === 'bn' ? 'বিজ্ঞাপন' : 'SPONSORED'}</span>
              {isGif && <span className="bg-yellow-500 text-black px-1 rounded text-[8px]">GIF</span>}
            </div>

            <div className="w-full min-h-[220px] max-h-[300px] sm:min-h-[250px] bg-gray-900/5 flex items-center justify-center">
              <img
                src={activeAd.imageUrl}
                alt={activeAd.title}
                className="w-full h-full object-cover rounded-2xl"
                loading="lazy"
              />
            </div>

            <div className="p-3 bg-white border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-800 line-clamp-1">{activeAd.title}</span>
              {activeAd.linkUrl && (
                <span className="text-[10px] text-red-600 font-bold group-hover:underline flex items-center space-x-0.5 shrink-0 ml-2">
                  <span>{language === 'bn' ? 'দেখুন' : 'Visit'}</span>
                  <ExternalLink className="w-3 h-3" />
                </span>
              )}
            </div>
          </AdContainer>
        </div>
      </div>
    );
  }

  if (position === 'inline') {
    return (
      <div className={`w-full my-6 flex justify-center ${className}`}>
        <div className="w-full max-w-[750px] relative">
          <AdContainer {...containerProps}>
            <div className="absolute top-1.5 left-1.5 z-10 bg-black/70 backdrop-blur-md text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider flex items-center space-x-1">
              <span>{language === 'bn' ? 'বিজ্ঞাপন' : 'SPONSORED'}</span>
              {isGif && <span className="bg-yellow-500 text-black px-1 rounded text-[8px]">GIF</span>}
            </div>

            <div className="w-full h-[80px] sm:h-[120px] bg-gray-900/5 flex items-center justify-center">
              <img
                src={activeAd.imageUrl}
                alt={activeAd.title}
                className="w-full h-full object-cover sm:object-fill rounded-2xl"
                loading="lazy"
              />
            </div>
          </AdContainer>
        </div>
      </div>
    );
  }

  // Footer position active ad
  return (
    <div className={`w-full bg-gray-900 py-3 border-t border-gray-800 flex justify-center ${className}`}>
      <div className="max-w-[970px] w-full px-4 relative">
        <AdContainer {...containerProps}>
          <div className="absolute top-1.5 left-3 z-10 bg-black/80 text-white text-[9px] font-bold px-2 py-0.5 rounded uppercase">
            {language === 'bn' ? 'বিজ্ঞাপন' : 'AD'}
          </div>
          <div className="w-full h-[50px] sm:h-[90px] flex items-center justify-center">
            <img
              src={activeAd.imageUrl}
              alt={activeAd.title}
              className="w-full h-full object-cover sm:object-fill rounded-xl"
              loading="lazy"
            />
          </div>
        </AdContainer>
      </div>
    </div>
  );
};
