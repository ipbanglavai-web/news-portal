import React from 'react';
import { Article, Category, Language } from '../types';
import { NewsCard } from './NewsCard';
import { Globe, ArrowLeft } from 'lucide-react';

interface CategoryViewProps {
  categoryId: string;
  categories: Category[];
  articles: Article[];
  language: Language;
  onSelectArticle: (id: string) => void;
  onSelectCategory: (catId: string | null) => void;
  bookmarkedIds: string[];
  onToggleBookmark: (article: Article, e: React.MouseEvent) => void;
}

export const CategoryView: React.FC<CategoryViewProps> = ({
  categoryId,
  categories,
  articles,
  language,
  onSelectArticle,
  onSelectCategory,
  bookmarkedIds,
  onToggleBookmark
}) => {
  const category = categories.find(c => c.id === categoryId);
  const filteredArticles = articles.filter(a => a.categoryId === categoryId);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Category Header */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => onSelectCategory(null)}
            className="text-xs text-red-600 font-bold mb-3 flex items-center space-x-1 hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'সকল খবর ফিরে যান' : 'Back to All News'}</span>
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-red-600 text-white rounded-xl flex items-center justify-center shadow-md shadow-red-200">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
                {category ? (language === 'bn' ? category.nameBn : category.nameEn) : categoryId}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {filteredArticles.length} {language === 'bn' ? 'টি সংবাদ পাওয়া গেছে' : 'articles found'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {filteredArticles.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-gray-100 shadow-sm">
          <p className="text-gray-500 text-base">
            {language === 'bn' ? 'এই বিভাগে বর্তমানে কোনো সংবাদ নেই।' : 'No articles found in this category.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map(art => (
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
