import React from 'react';
import { Article, Category, Language } from '../types';
import { Clock, Eye, Bookmark, Share2, X } from 'lucide-react';

interface NewsCardProps {
  article: Article;
  categories: Category[];
  language: Language;
  onSelectArticle: (id: string) => void;
  onSelectCategory: (catId: string) => void;
  isBookmarked: boolean;
  onToggleBookmark: (article: Article, e: React.MouseEvent) => void;
  variant?: 'featured' | 'standard' | 'compact';
  onDismiss?: (e: React.MouseEvent) => void;
}

export const NewsCard: React.FC<NewsCardProps> = ({
  article,
  categories,
  language,
  onSelectArticle,
  onSelectCategory,
  isBookmarked,
  onToggleBookmark,
  variant = 'standard',
  onDismiss
}) => {
  const category = categories.find(c => c.id === article.categoryId);

  const formattedDate = new Date(article.publishedAt).toLocaleDateString(
    language === 'bn' ? 'bn-BD' : 'en-US',
    { month: 'short', day: 'numeric', year: 'numeric' }
  );

  if (variant === 'featured') {
    return (
      <div 
        onClick={() => onSelectArticle(article.id)}
        className="group relative bg-white rounded-xl overflow-hidden border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col md:flex-row"
      >
        {onDismiss && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDismiss(e);
            }}
            className="absolute top-3 right-3 z-10 p-2 bg-black/60 hover:bg-black/80 text-white rounded-full transition shadow-lg backdrop-blur-sm"
            title={language === 'bn' ? 'বন্ধ করুন' : 'Close'}
          >
            <X className="w-4 h-4" />
          </button>
        )}
        <div className="md:w-3/5 relative overflow-hidden aspect-video md:aspect-auto md:min-h-[300px]">
          <img 
            src={article.imageUrl} 
            alt={language === 'bn' ? article.titleBn : article.titleEn}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
          {category && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelectCategory(category.id);
              }}
              className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-red-600 text-white text-[10px] sm:text-xs font-semibold px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full uppercase tracking-wider shadow hover:bg-red-700 transition"
            >
              {language === 'bn' ? category.nameBn : category.nameEn}
            </button>
          )}
        </div>
        <div className="md:w-2/5 p-4 sm:p-6 flex flex-col justify-between bg-white">
          <div>
            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
              <span className="flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{formattedDate}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Eye className="w-3.5 h-3.5" />
                <span>{article.viewsCount.toLocaleString(language === 'bn' ? 'bn-BD' : 'en-US')}</span>
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 group-hover:text-red-600 transition-colors leading-snug mb-3 line-clamp-3">
              {language === 'bn' ? article.titleBn : article.titleEn}
            </h2>
            <p className="text-gray-600 text-sm line-clamp-3 mb-4 leading-relaxed">
              {language === 'bn' ? article.summaryBn : article.summaryEn}
            </p>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
            <span className="text-xs font-semibold text-gray-700">
              {article.reporterName}
            </span>
            <button
              onClick={(e) => onToggleBookmark(article, e)}
              className={`p-2 rounded-full transition ${
                isBookmarked 
                  ? 'bg-red-100 text-red-600' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title={isBookmarked ? 'Bookmarked' : 'Bookmark'}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div 
        onClick={() => onSelectArticle(article.id)}
        className="group flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition cursor-pointer border-b border-gray-100 last:border-none"
      >
        <img 
          src={article.imageUrl} 
          alt="" 
          className="w-20 h-20 object-cover rounded-lg shrink-0 group-hover:opacity-95"
          referrerPolicy="no-referrer"
        />
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-gray-900 group-hover:text-red-600 transition line-clamp-2 leading-snug mb-1">
            {language === 'bn' ? article.titleBn : article.titleEn}
          </h4>
          <div className="flex items-center text-xs text-gray-500 space-x-2">
            <span>{formattedDate}</span>
            <span>•</span>
            <span className="flex items-center space-x-0.5">
              <Eye className="w-3 h-3" />
              <span>{article.viewsCount}</span>
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={() => onSelectArticle(article.id)}
      className="group bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between"
    >
      <div>
        <div className="relative aspect-video overflow-hidden">
          <img 
            src={article.imageUrl} 
            alt="" 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
          {category && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelectCategory(category.id);
              }}
              className="absolute top-3 left-3 bg-red-600 text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow hover:bg-red-700 transition"
            >
              {language === 'bn' ? category.nameBn : category.nameEn}
            </button>
          )}
        </div>
        <div className="p-3 sm:p-4">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
            <span className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{formattedDate}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Eye className="w-3 h-3" />
              <span>{article.viewsCount}</span>
            </span>
          </div>
          <h3 className="text-sm sm:text-base font-bold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2 leading-snug mb-1.5 sm:mb-2">
            {language === 'bn' ? article.titleBn : article.titleEn}
          </h3>
          <p className="text-gray-600 text-xs line-clamp-2 leading-relaxed">
            {language === 'bn' ? article.summaryBn : article.summaryEn}
          </p>
        </div>
      </div>
      <div className="px-3 sm:px-4 pb-3 sm:pb-4 pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
        <span className="font-medium text-gray-700 truncate max-w-[70%]">
          {article.reporterName}
        </span>
        <button
          onClick={(e) => onToggleBookmark(article, e)}
          className={`p-1.5 rounded-full transition ${
            isBookmarked 
              ? 'bg-red-100 text-red-600' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          title={isBookmarked ? 'Bookmarked' : 'Bookmark'}
        >
          <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
        </button>
      </div>
    </div>
  );
};
