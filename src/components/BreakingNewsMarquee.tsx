import React from 'react';
import { Article, Language } from '../types';
import { Flame } from 'lucide-react';

interface BreakingNewsMarqueeProps {
  articles: Article[];
  language: Language;
  onSelectArticle: (articleId: string) => void;
}

export const BreakingNewsMarquee: React.FC<BreakingNewsMarqueeProps> = ({
  articles,
  language,
  onSelectArticle
}) => {
  const breakingArticles = articles.filter(a => a.isBreaking);

  if (breakingArticles.length === 0) return null;

  return (
    <div className="bg-red-600 text-white py-2.5 px-4 shadow-inner flex items-center overflow-hidden">
      <div className="flex items-center space-x-2 bg-red-700 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider shrink-0 z-10 animate-pulse">
        <Flame className="w-4 h-4" />
        <span>{language === 'bn' ? 'ব্রেকিং নিউজ' : 'BREAKING'}</span>
      </div>
      <div className="overflow-hidden relative w-full ml-4">
        <div className="animate-marquee flex space-x-12 whitespace-nowrap cursor-pointer">
          {breakingArticles.concat(breakingArticles).map((article, idx) => (
            <div
              key={`${article.id}-${idx}`}
              onClick={() => onSelectArticle(article.id)}
              className="inline-flex items-center space-x-2 hover:underline text-sm font-medium"
            >
              <span className="w-1.5 h-1.5 bg-yellow-300 rounded-full"></span>
              <span>{language === 'bn' ? article.titleBn : article.titleEn}</span>
              <span className="text-red-200 text-xs ml-1">
                ({new Date(article.publishedAt).toLocaleTimeString(language === 'bn' ? 'bn-BD' : 'en-US', { hour: '2-digit', minute: '2-digit' })})
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
