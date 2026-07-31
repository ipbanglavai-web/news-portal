import React from 'react';
import { Article, Category, Language } from '../types';
import { NewsCard } from './NewsCard';
import { Bookmark, ArrowLeft } from 'lucide-react';

interface BookmarksViewProps {
  bookmarkedIds: string[];
  articles: Article[];
  categories: Category[];
  language: Language;
  onSelectArticle: (id: string) => void;
  onSelectCategory: (catId: string | null) => void;
  onToggleBookmark: (article: Article, e: React.MouseEvent) => void;
  onBack: () => void;
}

export const BookmarksView: React.FC<BookmarksViewProps> = ({
  bookmarkedIds,
  articles,
  categories,
  language,
  onSelectArticle,
  onSelectCategory,
  onToggleBookmark,
  onBack
}) => {
  const bookmarkedArticles = articles.filter(a => bookmarkedIds.includes(a.id));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <button
        onClick={onBack}
        className="inline-flex items-center space-x-2 text-sm font-semibold text-gray-700 hover:text-red-600 mb-6 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{language === 'bn' ? 'প্রচ্ছদে ফিরে যান' : 'Back to Home'}</span>
      </button>

      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 mb-8 flex items-center space-x-4">
        <div className="w-12 h-12 bg-red-600 text-white rounded-xl flex items-center justify-center shadow-md">
          <Bookmark className="w-6 h-6 fill-current" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {language === 'bn' ? 'সংরক্ষিত সংবাদসমূহ' : 'Bookmarked Articles'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {bookmarkedArticles.length} {language === 'bn' ? 'টি সংবাদ সংরক্ষিত আছে' : 'articles saved'}
          </p>
        </div>
      </div>

      {bookmarkedArticles.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-gray-100 shadow-sm">
          <Bookmark className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-base">
            {language === 'bn' ? 'আপনার কোনো সংবাদ সংরক্ষিত নেই।' : 'No bookmarked articles found.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarkedArticles.map(art => (
            <NewsCard
              key={art.id}
              article={art}
              categories={categories}
              language={language}
              onSelectArticle={onSelectArticle}
              onSelectCategory={onSelectCategory}
              isBookmarked={true}
              onToggleBookmark={onToggleBookmark}
              variant="standard"
            />
          ))}
        </div>
      )}
    </div>
  );
};
