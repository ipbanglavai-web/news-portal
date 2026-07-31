import React, { useState } from 'react';
import { Article, Category, Language } from '../types';
import { NewsCard } from './NewsCard';
import { translations } from '../data/mockNews';
import { Search, ArrowLeft } from 'lucide-react';

interface SearchViewProps {
  initialQuery?: string;
  articles: Article[];
  categories: Category[];
  language: Language;
  onSelectArticle: (id: string) => void;
  onSelectCategory: (catId: string | null) => void;
  bookmarkedIds: string[];
  onToggleBookmark: (article: Article, e: React.MouseEvent) => void;
  onBack: () => void;
}

export const SearchView: React.FC<SearchViewProps> = ({
  initialQuery = '',
  articles,
  categories,
  language,
  onSelectArticle,
  onSelectCategory,
  bookmarkedIds,
  onToggleBookmark,
  onBack
}) => {
  const [query, setQuery] = useState(initialQuery);
  const t = translations[language];

  const searchResults = articles.filter(art => {
    const q = query.toLowerCase();
    return (
      art.titleBn.toLowerCase().includes(q) ||
      art.titleEn.toLowerCase().includes(q) ||
      art.summaryBn.toLowerCase().includes(q) ||
      art.summaryEn.toLowerCase().includes(q) ||
      art.tags.some(tag => tag.toLowerCase().includes(q))
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <button
        onClick={onBack}
        className="inline-flex items-center space-x-2 text-sm font-semibold text-gray-700 hover:text-red-600 mb-6 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t.backToHome}</span>
      </button>

      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{t.searchTitle}</h1>
        <div className="relative">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-12 pr-4 py-3 text-base focus:outline-none focus:border-red-600 font-medium"
          />
        </div>
      </div>

      <div className="mb-4 text-sm text-gray-500 font-medium">
        {searchResults.length} {language === 'bn' ? 'টি ফলাফল পাওয়া গেছে' : 'results found'}
      </div>

      {searchResults.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-gray-100 shadow-sm">
          <p className="text-gray-500 text-base">{t.noResults}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {searchResults.map(art => (
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
  );
};
