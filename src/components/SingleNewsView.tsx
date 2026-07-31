import React, { useState, useEffect } from 'react';
import { Article, Category, Language, Comment } from '../types';
import { translations } from '../data/mockNews';
import { Clock, Eye, Share2, Bookmark, Printer, MessageSquare, ThumbsUp, Send, Check, ArrowLeft, Facebook, Twitter, Linkedin } from 'lucide-react';

interface SingleNewsViewProps {
  articleId: string;
  articles: Article[];
  categories: Category[];
  language: Language;
  onSelectArticle: (id: string) => void;
  onSelectCategory: (catId: string) => void;
  isBookmarked: boolean;
  onToggleBookmark: (article: Article, e: React.MouseEvent) => void;
  onBack: () => void;
  comments: Comment[];
  onAddComment: (comment: Omit<Comment, 'id' | 'createdAt' | 'isApproved'>) => void;
}

export const SingleNewsView: React.FC<SingleNewsViewProps> = ({
  articleId,
  articles,
  categories,
  language,
  onSelectArticle,
  onSelectCategory,
  isBookmarked,
  onToggleBookmark,
  onBack,
  comments,
  onAddComment
}) => {
  const article = articles.find(a => a.id === articleId) || articles[0];
  const category = categories.find(c => c.id === article?.categoryId);
  const t = translations[language];

  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [copied, setCopied] = useState(false);
  const [authorName, setAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [commentText, setCommentText] = useState('');
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      if (totalHeight > 0) {
        setScrollProgress((currentScroll / totalHeight) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!article) return <div>Article not found</div>;

  const formattedDate = new Date(article.publishedAt).toLocaleDateString(
    language === 'bn' ? 'bn-BD' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }
  );

  const articleComments = comments.filter(c => c.articleId === article.id && c.isApproved);
  const relatedArticles = articles.filter(a => a.categoryId === article.categoryId && a.id !== article.id).slice(0, 3);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authorName.trim() && commentText.trim()) {
      onAddComment({
        articleId: article.id,
        authorName,
        authorEmail: authorEmail || 'no-email@mock',
        content: commentText
      });
      setAuthorName('');
      setAuthorEmail('');
      setCommentText('');
      alert(language === 'bn' ? 'আপনার মন্তব্য সফলভাবে জমা দেওয়া হয়েছে!' : 'Your comment has been submitted successfully!');
    }
  };

  const fontSizeClass = {
    normal: 'text-lg leading-relaxed',
    large: 'text-xl leading-relaxed',
    xlarge: 'text-2xl leading-relaxed'
  }[fontSize];

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <div 
          className="h-full bg-red-600 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-6">
        
        {/* Back Button */}
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-sm font-semibold text-gray-700 hover:text-red-600 mb-6 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.backToHome}</span>
        </button>

        {/* Article Header Card */}
        <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-6 md:p-10 mb-8">
          
          {/* Category & Date */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            {category && (
              <button
                onClick={() => onSelectCategory(category.id)}
                className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow hover:bg-red-700 transition"
              >
                {language === 'bn' ? category.nameBn : category.nameEn}
              </button>
            )}
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span className="flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{formattedDate}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Eye className="w-3.5 h-3.5" />
                <span>{article.viewsCount} {t.views}</span>
              </span>
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-6">
            {language === 'bn' ? article.titleBn : article.titleEn}
          </h1>

          {/* Reporter Info & Font Size Adjuster */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-y border-gray-100 mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-sm">
                {article.reporterName.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-900">{article.reporterName}</h4>
                <p className="text-xs text-gray-500">{t.reporter}</p>
              </div>
            </div>

            {/* Font Resizer */}
            <div className="flex items-center space-x-2 text-xs font-semibold text-gray-600">
              <span>{language === 'bn' ? 'ফন্ট সাইজ:' : 'Font Size:'}</span>
              <button 
                onClick={() => setFontSize('normal')}
                className={`px-2.5 py-1 rounded border ${fontSize === 'normal' ? 'bg-red-600 text-white border-red-600' : 'bg-gray-50 border-gray-200'}`}
              >
                A
              </button>
              <button 
                onClick={() => setFontSize('large')}
                className={`px-2.5 py-1 rounded border ${fontSize === 'large' ? 'bg-red-600 text-white border-red-600' : 'bg-gray-50 border-gray-200'}`}
              >
                A+
              </button>
              <button 
                onClick={() => setFontSize('xlarge')}
                className={`px-2.5 py-1 rounded border ${fontSize === 'xlarge' ? 'bg-red-600 text-white border-red-600' : 'bg-gray-50 border-gray-200'}`}
              >
                A++
              </button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="rounded-xl overflow-hidden mb-8 shadow-md">
            <img 
              src={article.imageUrl} 
              alt="" 
              className="w-full h-auto max-h-[500px] object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Article Body Content */}
          <div className={`text-gray-800 space-y-6 ${fontSizeClass} whitespace-pre-line mb-10`}>
            {language === 'bn' ? article.contentBn : article.contentEn}
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-8 pt-6 border-t border-gray-100">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tags:</span>
              {article.tags.map((tag, idx) => (
                <span key={idx} className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full font-medium">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Action Toolbar (Share, Bookmark, Print) */}
          <div className="bg-gray-50 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 border border-gray-200">
            <div className="flex items-center space-x-2">
              <button
                onClick={(e) => onToggleBookmark(article, e)}
                className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition ${
                  isBookmarked 
                    ? 'bg-red-600 text-white shadow-md' 
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                <span>{isBookmarked ? t.bookmarked : t.bookmark}</span>
              </button>

              <button
                onClick={handleCopyLink}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 transition"
              >
                {copied ? <Check className="w-4 h-4 text-green-600" /> : <Share2 className="w-4 h-4" />}
                <span>{copied ? t.linkCopied : t.copyLink}</span>
              </button>

              <button
                onClick={handlePrint}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 transition"
              >
                <Printer className="w-4 h-4" />
                <span>{t.print}</span>
              </button>
            </div>

            {/* Social Share icons */}
            <div className="flex items-center space-x-2">
              <a 
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} 
                target="_blank" 
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center hover:opacity-90 transition"
                title="Share on Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a 
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}`} 
                target="_blank" 
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-sky-500 text-white flex items-center justify-center hover:opacity-90 transition"
                title="Share on Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

        </article>

        {/* Related News Section */}
        {relatedArticles.length > 0 && (
          <div className="mb-10">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
              <span className="w-2.5 h-6 bg-red-600 rounded-sm"></span>
              <span>{t.relatedNews}</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map(art => (
                <div 
                  key={art.id}
                  onClick={() => onSelectArticle(art.id)}
                  className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition cursor-pointer p-4 flex flex-col justify-between"
                >
                  <div>
                    <img src={art.imageUrl} alt="" className="w-full h-36 object-cover rounded-lg mb-3" referrerPolicy="no-referrer" />
                    <h4 className="font-bold text-sm text-gray-900 line-clamp-2 hover:text-red-600 transition">
                      {language === 'bn' ? art.titleBn : art.titleEn}
                    </h4>
                  </div>
                  <span className="text-[11px] text-gray-400 mt-2 block">
                    {new Date(art.publishedAt).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Comments Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-red-600" />
            <span>{t.comments} ({articleComments.length})</span>
          </h3>

          {/* Comment Form */}
          <form onSubmit={handleCommentSubmit} className="space-y-4 mb-8 bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h4 className="font-bold text-sm text-gray-800">
              {language === 'bn' ? 'আপনার মন্তব্য জানান' : 'Leave a Comment'}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder={t.name}
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                required
                className="bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-red-600"
              />
              <input
                type="email"
                placeholder={t.email}
                value={authorEmail}
                onChange={(e) => setAuthorEmail(e.target.value)}
                className="bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-red-600"
              />
            </div>
            <textarea
              rows={3}
              placeholder={t.leaveComment}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              required
              className="w-full bg-white border border-gray-300 rounded-lg p-4 text-sm focus:outline-none focus:border-red-600"
            />
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded-lg text-sm transition shadow"
            >
              {t.submitComment}
            </button>
          </form>

          {/* Comments List */}
          <div className="space-y-4">
            {articleComments.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-6">
                {language === 'bn' ? 'কোনো মন্তব্য নেই। প্রথম মন্তব্যকারী হোন!' : 'No comments yet. Be the first to comment!'}
              </p>
            ) : (
              articleComments.map(c => (
                <div key={c.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-gray-900">{c.authorName}</span>
                    <span className="text-xs text-gray-400">
                      {new Date(c.createdAt).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US')}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm">{c.content}</p>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
