import React from 'react';
import { Category, Language } from '../types';
import { Globe, Landmark, TrendingUp, Trophy, Film, BookOpen, Cpu, HeartPulse, Briefcase, Coffee, Video, Flag } from 'lucide-react';

interface CategoryCarouselProps {
  categories: Category[];
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  language: Language;
}

const getCategoryIcon = (iconName?: string) => {
  switch (iconName) {
    case 'Flag': return <Flag className="w-4 h-4" />;
    case 'Landmark': return <Landmark className="w-4 h-4" />;
    case 'Globe': return <Globe className="w-4 h-4" />;
    case 'TrendingUp': return <TrendingUp className="w-4 h-4" />;
    case 'Trophy': return <Trophy className="w-4 h-4" />;
    case 'Film': return <Film className="w-4 h-4" />;
    case 'BookOpen': return <BookOpen className="w-4 h-4" />;
    case 'Cpu': return <Cpu className="w-4 h-4" />;
    case 'HeartPulse': return <HeartPulse className="w-4 h-4" />;
    case 'Briefcase': return <Briefcase className="w-4 h-4" />;
    case 'Coffee': return <Coffee className="w-4 h-4" />;
    case 'Video': return <Video className="w-4 h-4" />;
    default: return <Globe className="w-4 h-4" />;
  }
};

export const CategoryCarousel: React.FC<CategoryCarouselProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
  language
}) => {
  return (
    <div className="bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm sticky top-[73px] z-30 transition-all">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center space-x-2 py-2.5 overflow-x-auto scrollbar-none no-scrollbar">
          <button
            onClick={() => onSelectCategory(null)}
            className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-200 flex items-center space-x-1.5 shadow-sm ${
              selectedCategoryId === null
                ? 'bg-red-600 text-white shadow-md shadow-red-200 scale-105'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
            }`}
          >
            <span className="tracking-wide">{language === 'bn' ? 'সকল খবর' : 'All News'}</span>
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategoryId === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 flex items-center space-x-2 shadow-sm ${
                  isSelected
                    ? 'bg-red-600 text-white shadow-md shadow-red-200 scale-105'
                    : 'bg-gray-100/80 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                }`}
              >
                <span className={isSelected ? 'text-white' : 'text-red-600'}>
                  {getCategoryIcon(cat.iconName)}
                </span>
                <span className="tracking-wide">{language === 'bn' ? cat.nameBn : cat.nameEn}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
