import React, { useState, useEffect } from 'react';
import { Language, ViewState, Article, Category, Comment, AdRequest, SubmittedNews, SiteSettings, BannerAd, Moderator, AdminSession } from './types';
import { categories as initialCategories, initialArticles, translations, initialAdRequests, bannerAds as initialBannerAds } from './data/mockNews';
import { 
  subscribeToModerators, 
  addModeratorToFirebase, 
  updateModeratorInFirebase, 
  toggleBanModeratorInFirebase, 
  deleteModeratorFromFirebase,
  fetchSiteSettingsFromFirebase,
  saveSiteSettingsToFirebase,
  subscribeToSiteSettings
} from './lib/firebase';
import { Navbar } from './components/Navbar';
import { BreakingNewsMarquee } from './components/BreakingNewsMarquee';
import { CategoryCarousel } from './components/CategoryCarousel';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { CategoryView } from './components/CategoryView';
import { SingleNewsView } from './components/SingleNewsView';
import { SearchView } from './components/SearchView';
import { SubmitNewsView } from './components/SubmitNewsView';
import { AdvertiseView } from './components/AdvertiseView';
import { BookmarksView } from './components/BookmarksView';
import { StaticPageView } from './components/StaticPageView';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { Search } from 'lucide-react';

const getViewStateFromUrl = (): ViewState => {
  if (typeof window === 'undefined') return { type: 'home' };

  const searchParams = new URLSearchParams(window.location.search);
  const articleId = searchParams.get('article');
  if (articleId) return { type: 'article', articleId };

  const categoryId = searchParams.get('category');
  if (categoryId) return { type: 'category', categoryId };

  const searchQuery = searchParams.get('search');
  if (searchQuery) return { type: 'search', query: searchQuery };

  const view = searchParams.get('view');
  if (view === 'bookmarks') return { type: 'bookmarks' };
  if (view === 'submit-news') return { type: 'submit-news' };
  if (view === 'advertise') return { type: 'advertise' };
  if (view === 'admin-login') return { type: 'admin-login' };
  if (view === 'admin-dashboard') return { type: 'admin-dashboard' };

  const hash = window.location.hash.replace('#', '');
  if (hash.startsWith('article=')) {
    return { type: 'article', articleId: hash.replace('article=', '') };
  }
  if (hash.startsWith('category=')) {
    return { type: 'category', categoryId: hash.replace('category=', '') };
  }

  // Restore saved view from localStorage if available
  const savedView = localStorage.getItem('bn_news_current_view');
  if (savedView) {
    try {
      const parsed = JSON.parse(savedView);
      if (parsed && parsed.type) return parsed;
    } catch (e) {
      // ignore
    }
  }

  return { type: 'home' };
};

export default function App() {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('bn_news_lang');
    return (saved === 'en' || saved === 'bn') ? saved : 'bn';
  });

  const [currentView, setCurrentView] = useState<ViewState>(getViewStateFromUrl);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(() => {
    const initialView = getViewStateFromUrl();
    return initialView.type === 'category' ? initialView.categoryId : null;
  });

  const [adminSession, setAdminSession] = useState<AdminSession | null>(() => {
    const saved = localStorage.getItem('bn_news_admin_session');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });
  const [moderators, setModerators] = useState<Moderator[]>([]);

  const [articles, setArticles] = useState<Article[]>(() => {
    const saved = localStorage.getItem('bn_news_articles');
    return saved ? JSON.parse(saved) : initialArticles;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('bn_news_categories');
    return saved ? JSON.parse(saved) : initialCategories;
  });

  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('bn_news_bookmarks');
    return saved ? JSON.parse(saved) : [];
  });

  const [comments, setComments] = useState<Comment[]>(() => {
    const saved = localStorage.getItem('bn_news_comments');
    return saved ? JSON.parse(saved) : [
      { id: 'c-1', articleId: 'art-1', authorName: 'রফিকুল ইসলাম', authorEmail: 'rafiq@mock.com', content: 'খুব চমৎকার ও সময়োপযোগী প্রতিবেদন। দেশের অর্থনীতি নিয়ে এমন ইতিবাচক খবর আরও আসুক।', createdAt: '2026-07-30T11:00:00Z', isApproved: true }
    ];
  });

  const [adRequests, setAdRequests] = useState<AdRequest[]>(() => {
    const saved = localStorage.getItem('bn_news_ads');
    return saved ? JSON.parse(saved) : initialAdRequests;
  });

  const [bannerAds, setBannerAds] = useState<BannerAd[]>(() => {
    const saved = localStorage.getItem('bn_news_banner_ads');
    return saved ? JSON.parse(saved) : initialBannerAds;
  });

  const [submittedNews, setSubmittedNews] = useState<SubmittedNews[]>(() => {
    const saved = localStorage.getItem('bn_news_submissions');
    return saved ? JSON.parse(saved) : [];
  });

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('bn_news_admin_auth') === 'true';
  });

  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem('bn_news_settings');
    return saved ? JSON.parse(saved) : {
      siteNameBn: 'বাংলা নিউজ ২৪',
      siteNameEn: 'Bangla News 24',
      taglineBn: 'সত্যের সন্ধানে অবিচল',
      taglineEn: 'Uncompromising in Search of Truth',
      contactEmail: 'contact@banglanews24.example',
      contactPhone: '+880 1700 000000',
      address: 'কাওরান বাজার, ঢাকা-১২১৫, বাংলাদেশ',
      facebookUrl: 'https://facebook.com',
      youtubeUrl: 'https://youtube.com',
      instagramUrl: 'https://instagram.com',
      twitterUrl: 'https://twitter.com',
      maintenanceMode: false,
      desktopLogoUrl: '',
      mobileLogoUrl: '',
      footerDesktopLogoUrl: '',
      footerMobileLogoUrl: '',
      hamburgerLogoUrl: '',
      defaultLogoMonogram: '২৪',
      copyrightText: 'All rights reserved.',
      developerCredit: 'Bangla Media Group'
    };
  });

  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQueryInput, setSearchQueryInput] = useState('');

  useEffect(() => {
    localStorage.setItem('bn_news_settings', JSON.stringify(siteSettings));
    saveSiteSettingsToFirebase(siteSettings).catch(err => console.error('Failed to save site settings to Firebase:', err));
  }, [siteSettings]);

  useEffect(() => {
    // Fetch initial site settings from Firebase
    fetchSiteSettingsFromFirebase().then(remoteSettings => {
      if (remoteSettings && remoteSettings.siteNameBn) {
        setSiteSettings(remoteSettings);
        localStorage.setItem('bn_news_settings', JSON.stringify(remoteSettings));
      }
    }).catch(err => console.error('Failed to fetch site settings from Firebase:', err));

    // Subscribe to real-time site settings updates
    const unsubscribeSettings = subscribeToSiteSettings((remoteSettings) => {
      if (remoteSettings && remoteSettings.siteNameBn) {
        setSiteSettings(remoteSettings);
        localStorage.setItem('bn_news_settings', JSON.stringify(remoteSettings));
      }
    });

    return () => unsubscribeSettings();
  }, []);

  useEffect(() => {
    localStorage.setItem('bn_news_lang', language);
  }, [language]);

  useEffect(() => {
    const unsubscribe = subscribeToModerators((mods) => {
      setModerators(mods);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem('bn_news_articles', JSON.stringify(articles));
  }, [articles]);

  useEffect(() => {
    localStorage.setItem('bn_news_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('bn_news_bookmarks', JSON.stringify(bookmarkedIds));
  }, [bookmarkedIds]);

  useEffect(() => {
    localStorage.setItem('bn_news_comments', JSON.stringify(comments));
  }, [comments]);

  useEffect(() => {
    localStorage.setItem('bn_news_ads', JSON.stringify(adRequests));
  }, [adRequests]);

  useEffect(() => {
    localStorage.setItem('bn_news_banner_ads', JSON.stringify(bannerAds));
  }, [bannerAds]);

  useEffect(() => {
    localStorage.setItem('bn_news_submissions', JSON.stringify(submittedNews));
  }, [submittedNews]);

  useEffect(() => {
    localStorage.setItem('bn_news_admin_auth', isAdminAuthenticated ? 'true' : 'false');
    if (adminSession && isAdminAuthenticated) {
      localStorage.setItem('bn_news_admin_session', JSON.stringify(adminSession));
    } else {
      localStorage.removeItem('bn_news_admin_session');
    }
  }, [isAdminAuthenticated, adminSession]);

  useEffect(() => {
    if (currentView) {
      localStorage.setItem('bn_news_current_view', JSON.stringify(currentView));
    }
  }, [currentView]);

  // Keep moderator session in sync or logout if banned
  useEffect(() => {
    if (isAdminAuthenticated && adminSession?.role === 'moderator' && adminSession.moderatorInfo) {
      const currentMod = moderators.find(
        m => m.id === adminSession.moderatorInfo?.id || m.gmail === adminSession.moderatorInfo?.gmail
      );
      if (currentMod) {
        if (currentMod.isBanned) {
          setIsAdminAuthenticated(false);
          setAdminSession(null);
          localStorage.removeItem('bn_news_admin_auth');
          localStorage.removeItem('bn_news_admin_session');
          setCurrentView({ type: 'home' });
        } else {
          setAdminSession(prev => prev ? { ...prev, moderatorInfo: currentMod } : null);
        }
      }
    }
  }, [moderators]);

  // Sync state to URL address bar
  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.delete('article');
    url.searchParams.delete('category');
    url.searchParams.delete('search');
    url.searchParams.delete('view');

    if (currentView.type === 'article') {
      url.searchParams.set('article', currentView.articleId);
    } else if (currentView.type === 'category') {
      url.searchParams.set('category', currentView.categoryId);
    } else if (currentView.type === 'search') {
      url.searchParams.set('search', currentView.query);
    } else if (currentView.type !== 'home') {
      url.searchParams.set('view', currentView.type);
    }

    const newUrl = url.pathname + url.search;
    const currentUrl = window.location.pathname + window.location.search;
    if (currentUrl !== newUrl) {
      window.history.pushState({ view: currentView }, '', newUrl);
    }
  }, [currentView]);

  // Handle browser back / forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const view = getViewStateFromUrl();
      setCurrentView(view);
      if (view.type === 'category') {
        setSelectedCategoryId(view.categoryId);
      } else {
        setSelectedCategoryId(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'bn' ? 'en' : 'bn');
  };

  const handleToggleBookmark = (article: Article, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarkedIds(prev => 
      prev.includes(article.id) 
        ? prev.filter(id => id !== article.id)
        : [...prev, article.id]
    );
  };

  const handleSelectArticle = (id: string) => {
    // Increment view count
    setArticles(prev => prev.map(a => a.id === id ? { ...a, viewsCount: a.viewsCount + 1 } : a));
    setCurrentView({ type: 'article', articleId: id });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategory = (catId: string | null) => {
    setSelectedCategoryId(catId);
    if (catId === null) {
      setCurrentView({ type: 'home' });
    } else {
      setCurrentView({ type: 'category', categoryId: catId });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQueryInput.trim()) {
      setSearchModalOpen(false);
      setCurrentView({ type: 'search', query: searchQueryInput });
      setSearchQueryInput('');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 font-sans">
      
      {/* Top Navbar */}
      <Navbar
        language={language}
        onToggleLanguage={toggleLanguage}
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          if (view.type === 'home') setSelectedCategoryId(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        bookmarksCount={bookmarkedIds.length}
        onOpenSearch={() => setSearchModalOpen(true)}
        siteSettings={siteSettings}
      />

      {/* Breaking News Marquee */}
      {(currentView.type === 'home' || currentView.type === 'category') && (
        <BreakingNewsMarquee
          articles={articles}
          language={language}
          onSelectArticle={handleSelectArticle}
        />
      )}

      {/* Category Horizontal Carousel */}
      {currentView.type !== 'admin-dashboard' && currentView.type !== 'admin-login' && (
        <CategoryCarousel
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={handleSelectCategory}
          language={language}
        />
      )}

      {/* Main Content Render */}
      <div className="flex-1">
        {currentView.type === 'home' && (
          <HomeView
            articles={articles}
            categories={categories}
            language={language}
            onSelectArticle={handleSelectArticle}
            onSelectCategory={handleSelectCategory}
            bookmarkedIds={bookmarkedIds}
            onToggleBookmark={handleToggleBookmark}
            bannerAds={bannerAds}
            onNavigateToAdvertise={() => setCurrentView({ type: 'advertise' })}
          />
        )}

        {currentView.type === 'category' && (
          <CategoryView
            categoryId={currentView.categoryId}
            categories={categories}
            articles={articles}
            language={language}
            onSelectArticle={handleSelectArticle}
            onSelectCategory={handleSelectCategory}
            bookmarkedIds={bookmarkedIds}
            onToggleBookmark={handleToggleBookmark}
          />
        )}

        {currentView.type === 'article' && (
          <SingleNewsView
            articleId={currentView.articleId}
            articles={articles}
            categories={categories}
            language={language}
            onSelectArticle={handleSelectArticle}
            onSelectCategory={handleSelectCategory}
            isBookmarked={bookmarkedIds.includes(currentView.articleId)}
            onToggleBookmark={handleToggleBookmark}
            onBack={() => setCurrentView({ type: 'home' })}
            comments={comments}
            onAddComment={(newComment) => {
              setComments(prev => [
                { ...newComment, id: `comm-${Date.now()}`, createdAt: new Date().toISOString(), isApproved: true },
                ...prev
              ]);
            }}
          />
        )}

        {currentView.type === 'search' && (
          <SearchView
            initialQuery={currentView.query}
            articles={articles}
            categories={categories}
            language={language}
            onSelectArticle={handleSelectArticle}
            onSelectCategory={handleSelectCategory}
            bookmarkedIds={bookmarkedIds}
            onToggleBookmark={handleToggleBookmark}
            onBack={() => setCurrentView({ type: 'home' })}
          />
        )}

        {currentView.type === 'submit-news' && (
          <SubmitNewsView
            categories={categories}
            language={language}
            onBack={() => setCurrentView({ type: 'home' })}
            onSubmitNews={(data) => {
              setSubmittedNews(prev => [
                { ...data, id: `sub-${Date.now()}`, createdAt: new Date().toISOString(), status: 'pending' },
                ...prev
              ]);
            }}
          />
        )}

        {currentView.type === 'advertise' && (
          <AdvertiseView
            language={language}
            onBack={() => setCurrentView({ type: 'home' })}
            onSubmitAdRequest={(data) => {
              setAdRequests(prev => [
                { ...data, id: `ad-${Date.now()}`, createdAt: new Date().toISOString(), status: 'pending' },
                ...prev
              ]);
            }}
          />
        )}

        {currentView.type === 'bookmarks' && (
          <BookmarksView
            bookmarkedIds={bookmarkedIds}
            articles={articles}
            categories={categories}
            language={language}
            onSelectArticle={handleSelectArticle}
            onSelectCategory={handleSelectCategory}
            onToggleBookmark={handleToggleBookmark}
            onBack={() => setCurrentView({ type: 'home' })}
          />
        )}

        {currentView.type === 'static' && (
          <StaticPageView
            page={currentView.page}
            language={language}
            onBack={() => setCurrentView({ type: 'home' })}
          />
        )}

        {currentView.type === 'admin-login' && (
          <AdminLogin
            language={language}
            onLoginSuccess={(session) => {
              setAdminSession(session);
              setIsAdminAuthenticated(true);
              setCurrentView({ type: 'admin-dashboard' });
            }}
            onBack={() => setCurrentView({ type: 'home' })}
          />
        )}

        {currentView.type === 'admin-dashboard' && (
          isAdminAuthenticated ? (
            <AdminDashboard
              articles={articles}
              categories={categories}
              adRequests={adRequests}
              bannerAds={bannerAds}
              submittedNews={submittedNews}
              siteSettings={siteSettings}
              language={language}
              adminSession={adminSession || undefined}
              moderators={moderators}
              onLogout={() => {
                setIsAdminAuthenticated(false);
                setAdminSession(null);
                localStorage.removeItem('bn_news_admin_auth');
                localStorage.removeItem('bn_news_admin_session');
                const homeView: ViewState = { type: 'home' };
                localStorage.setItem('bn_news_current_view', JSON.stringify(homeView));
                setCurrentView(homeView);
              }}
              onAddArticle={(newArt) => {
                const articleWithId: Article = {
                  ...newArt,
                  id: `art-${Date.now()}`,
                  viewsCount: newArt.viewsCount ?? 150,
                  likesCount: 0,
                  commentsCount: 0
                };
                setArticles(prev => [articleWithId, ...prev]);
              }}
              onUpdateArticleViews={(id, viewsCount) => {
                setArticles(prev => prev.map(a => a.id === id ? { ...a, viewsCount } : a));
              }}
              onDeleteArticle={(id) => {
                setArticles(prev => prev.filter(a => a.id !== id));
              }}
              onAddCategory={(cat) => {
                const newCat: Category = {
                  ...cat,
                  id: `cat-${Date.now()}`,
                  iconName: 'Globe'
                };
                setCategories(prev => [...prev, newCat]);
              }}
              onDeleteCategory={(id) => {
                setCategories(prev => prev.filter(c => c.id !== id));
              }}
              onUpdateSiteSettings={(settings) => {
                setSiteSettings(settings);
              }}
              onUpdateAdStatus={(id, status) => {
                setAdRequests(prev => prev.map(ad => ad.id === id ? { ...ad, status } : ad));
              }}
              onDeleteAdRequest={(id) => {
                setAdRequests(prev => prev.filter(ad => ad.id !== id));
              }}
              onAddBannerAd={(newAd) => {
                const adWithId: BannerAd = {
                  ...newAd,
                  id: `banner-${Date.now()}`
                };
                setBannerAds(prev => [adWithId, ...prev]);
              }}
              onDeleteBannerAd={(id) => {
                setBannerAds(prev => prev.filter(ad => ad.id !== id));
              }}
              onToggleBannerAd={(id) => {
                setBannerAds(prev => prev.map(ad => ad.id === id ? { ...ad, isActive: !ad.isActive } : ad));
              }}
              onAddModerator={async (mod) => {
                await addModeratorToFirebase(mod);
              }}
              onUpdateModerator={async (id, updates) => {
                await updateModeratorInFirebase(id, updates);
              }}
              onToggleBanModerator={async (id, currentBan) => {
                await toggleBanModeratorInFirebase(id, currentBan);
              }}
              onDeleteModerator={async (id) => {
                await deleteModeratorFromFirebase(id);
              }}
            />
          ) : (
            <AdminLogin
              language={language}
              onLoginSuccess={(session) => {
                setAdminSession(session);
                setIsAdminAuthenticated(true);
              }}
              onBack={() => setCurrentView({ type: 'home' })}
            />
          )
        )}
      </div>

      {/* Search Modal Popup */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl relative">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <Search className="w-5 h-5 text-red-600" />
              <span>{language === 'bn' ? 'সংবাদ খুঁজুন' : 'Search News'}</span>
            </h3>
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <input
                type="text"
                autoFocus
                value={searchQueryInput}
                onChange={(e) => setSearchQueryInput(e.target.value)}
                placeholder={translations[language].searchPlaceholder}
                className="flex-1 bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-red-600 font-medium"
              />
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl transition shadow"
              >
                {translations[language].searchButton}
              </button>
            </form>
            <button
              onClick={() => setSearchModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-sm font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      {currentView.type !== 'admin-dashboard' && currentView.type !== 'admin-login' && (
        <Footer
          language={language}
          siteSettings={siteSettings}
          onNavigate={(view) => {
            setCurrentView(view);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          bannerAds={bannerAds}
        />
      )}

    </div>
  );
}
