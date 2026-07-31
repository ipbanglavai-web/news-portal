import React, { useState } from 'react';
import { Article, Category, Language, BannerAd } from '../types';
import { NewsCard } from './NewsCard';
import { BannerAdComponent } from './BannerAdComponent';
import { translations } from '../data/mockNews';
import { Flame, ArrowRight, Sparkles, X } from 'lucide-react';

interface HomeViewProps {
  articles: Article[];
  categories: Category[];
  language: Language;
  onSelectArticle: (id: string) => void;
  onSelectCategory: (catId: string) => void;
  bookmarkedIds: string[];
  onToggleBookmark: (article: Article, e: React.MouseEvent) => void;
  bannerAds?: BannerAd[];
  onNavigateToAdvertise?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  articles,
  categories,
  language,
  onSelectArticle,
  onSelectCategory,
  bookmarkedIds,
  onToggleBookmark,
  bannerAds = [],
  onNavigateToAdvertise
}) => {
  const t = translations[language];

  const [dismissedFeatured, setDismissedFeatured] = useState(false);

  // Get 5 Featured Articles (fill up if less than 5)
  let rawFeatured = articles.filter(a => a.isFeatured);
  if (rawFeatured.length < 5) {
    const extra = articles.filter(a => !rawFeatured.some(f => f.id === a.id)).slice(0, 5 - rawFeatured.length);
    rawFeatured = [...rawFeatured, ...extra];
  }
  const featuredArticles = !dismissedFeatured ? rawFeatured.slice(0, 5) : [];

  const trendingArticles = articles.filter(a => a.isTrending).slice(0, 5);
  const remainingArticles = articles.filter(a => !featuredArticles.some(f => f.id === a.id));

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 space-y-8">
      
      {/* Top Header Banner Ad */}
      <BannerAdComponent
        ads={bannerAds}
        position="header"
        language={language}
        onNavigateToAdvertise={onNavigateToAdvertise}
      />

      {/* Featured Section & Trending Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Featured Section (2 Cols on lg) */}
        <div className="lg:col-span-2 space-y-4">
          
          <div className="flex items-center justify-between border-b border-gray-200 pb-2">
            <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-red-600 fill-red-100" />
              <span>{language === 'bn' ? 'প্রধান সংবাদসমূহ (Featured Stories)' : 'Featured Stories'}</span>
            </h2>
            {featuredArticles.length > 0 && (
              <button
                onClick={() => setDismissedFeatured(true)}
                className="text-xs text-gray-400 hover:text-red-600 flex items-center space-x-1 transition"
                title={language === 'bn' ? 'বন্ধ করুন' : 'Hide'}
              >
                <X className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'লুকান' : 'Hide'}</span>
              </button>
            )}
          </div>

          {featuredArticles.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center flex flex-col items-center justify-center min-h-[250px]">
              <p className="text-gray-500 mb-3 text-sm">
                {language === 'bn' ? 'প্রধান সংবাদ বন্ধ করা হয়েছে।' : 'Featured stories closed.'}
              </p>
              <button
                onClick={() => setDismissedFeatured(false)}
                className="bg-red-50 hover:bg-red-100 text-red-600 font-semibold text-xs px-4 py-2 rounded-xl transition"
              >
                {language === 'bn' ? 'পুনরায় দেখান' : 'Show Again'}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* 1st Major Story (Big Hero Card for both Mobile & Desktop) */}
              {featuredArticles[0] && (
                <NewsCard
                  article={featuredArticles[0]}
                  categories={categories}
                  language={language}
                  onSelectArticle={onSelectArticle}
                  onSelectCategory={onSelectCategory}
                  isBookmarked={bookmarkedIds.includes(featuredArticles[0].id)}
                  onToggleBookmark={onToggleBookmark}
                  variant="featured"
                />
              )}

              {/* 2nd to 5th Featured Stories (Grid Layout) */}
              {featuredArticles.length > 1 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                  {featuredArticles.slice(1, 5).map((art) => (
                    <NewsCard
                      key={art.id}
                      article={art}
                      categories={categories}
                      language={language}
                      onSelectArticle={onSelectArticle}
                      onSelectCategory={onSelectCategory}
                      isBookmarked={bookmarkedIds.includes(art.id)}
                      onToggleBookmark={onToggleBookmark}
                      variant="standard"
                    />
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Sidebar: Trending & Active Sidebar Ad */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center space-x-2 pb-3 mb-4 border-b border-gray-100 text-red-600 font-bold">
              <Flame className="w-5 h-5 fill-red-100" />
              <h3 className="text-base uppercase tracking-wide">
                {language === 'bn' ? 'সর্বাধিক পঠিত / ট্রেন্ডিং' : 'Trending & Most Read'}
              </h3>
            </div>
            <div className="space-y-1">
              {trendingArticles.map((art, idx) => (
                <div 
                  key={art.id}
                  onClick={() => onSelectArticle(art.id)}
                  className="group flex items-start space-x-3 p-2.5 rounded-xl hover:bg-gray-50 transition cursor-pointer"
                >
                  <span className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 group-hover:text-red-600 transition line-clamp-2 leading-snug">
                      {language === 'bn' ? art.titleBn : art.titleEn}
                    </h4>
                    <span className="text-[11px] text-gray-400 mt-1 block">
                      {art.viewsCount} {language === 'bn' ? 'বার পঠিত' : 'views'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Sidebar Banner Ad */}
          <BannerAdComponent
            ads={bannerAds}
            position="sidebar"
            language={language}
            onNavigateToAdvertise={onNavigateToAdvertise}
          />
        </div>

      </div>

      {/* Latest News Grid (Top 5 Recent News) */}
      <div>
        <div className="flex items-center justify-between mb-4 sm:mb-6 border-b border-gray-200 pb-3">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center space-x-2">
            <span className="w-2.5 h-6 bg-red-600 rounded-sm"></span>
            <span>{t.latestNews}</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {remainingArticles.slice(0, 5).map((art) => (
            <NewsCard
              key={art.id}
              article={art}
              categories={categories}
              language={language}
              onSelectArticle={onSelectArticle}
              onSelectCategory={onSelectCategory}
              isBookmarked={bookmarkedIds.includes(art.id)}
              onToggleBookmark={onToggleBookmark}
              variant="standard"
            />
          ))}
        </div>
      </div>

      {/* Inline Banner Ad */}
      <BannerAdComponent
        ads={bannerAds}
        position="inline"
        language={language}
        onNavigateToAdvertise={onNavigateToAdvertise}
      />

      {/* Category Sections (e.g., দেশ, অর্থনীতি, খেলাধুলা, প্রযুক্তি) */}
      {['desh', 'economy', 'sports', 'technology'].map((catId) => {
        const cat = categories.find(c => c.id === catId);
        const catArticles = articles.filter(a => a.categoryId === catId);
        if (!cat || catArticles.length === 0) return null;

        return (
          <div key={catId} className="pt-2 sm:pt-4">
            <div className="flex items-center justify-between mb-4 sm:mb-6 border-b border-gray-200 pb-3">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center space-x-2">
                <span className="w-2.5 h-6 bg-red-600 rounded-sm"></span>
                <span>{language === 'bn' ? cat.nameBn : cat.nameEn}</span>
              </h2>
              <button
                onClick={() => onSelectCategory(cat.id)}
                className="text-red-600 hover:text-red-700 text-sm font-semibold flex items-center space-x-1 group"
              >
                <span>{t.viewMore}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {catArticles.slice(0, 4).map((art) => (
                <NewsCard
                  key={art.id}
                  article={art}
                  categories={categories}
                  language={language}
                  onSelectArticle={onSelectArticle}
                  onSelectCategory={onSelectCategory}
                  isBookmarked={bookmarkedIds.includes(art.id)}
                  onToggleBookmark={onToggleBookmark}
                  variant="standard"
                />
              ))}
            </div>
          </div>
        );
      })}

    </div>
  );
};


