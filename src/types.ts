export type Language = 'bn' | 'en';

export interface Category {
  id: string;
  nameBn: string;
  nameEn: string;
  slug: string;
  iconName?: string;
}

export interface Article {
  id: string;
  titleBn: string;
  titleEn: string;
  slug: string;
  summaryBn: string;
  summaryEn: string;
  contentBn: string;
  contentEn: string;
  categoryId: string;
  reporterName: string;
  publishedAt: string;
  updatedAt?: string;
  imageUrl: string;
  videoUrl?: string;
  viewsCount: number;
  likesCount: number;
  commentsCount: number;
  isFeatured: boolean;
  isBreaking: boolean;
  isTrending: boolean;
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
}

export interface Comment {
  id: string;
  articleId: string;
  authorName: string;
  authorEmail: string;
  content: string;
  createdAt: string;
  isApproved: boolean;
}

export interface AdRequest {
  id: string;
  companyName: string;
  personName: string;
  phone: string;
  email: string;
  website: string;
  budget: string;
  message: string;
  fileName?: string;
  createdAt: string;
  status: 'pending' | 'reviewed' | 'approved' | 'rejected';
}

export interface SubmittedNews {
  id: string;
  reporterName: string;
  phone: string;
  email: string;
  headline: string;
  categoryId: string;
  description: string;
  location: string;
  imageUrl?: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface BannerAd {
  id: string;
  title: string;
  position: 'header' | 'sidebar' | 'footer' | 'inline';
  imageUrl: string;
  linkUrl: string;
  isActive: boolean;
}

export interface ModeratorPermissions {
  fullControl: boolean;
  newsManagement: boolean;
  categoryManagement: boolean;
  adRequests: boolean;
  userSubmissions: boolean;
}

export interface Moderator {
  id: string;
  name: string;
  designation: string;
  number: string;
  nid: string;
  dateOfBirth: string;
  gmail: string;
  password: string;
  newPassword?: string;
  permissions: ModeratorPermissions;
  isBanned: boolean;
  createdAt?: string;
  createdBy?: string;
}

export interface AdminSession {
  role: 'superadmin' | 'moderator';
  moderatorInfo?: Moderator;
}

export interface SiteSettings {
  siteNameBn: string;
  siteNameEn: string;
  taglineBn: string;
  taglineEn: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  facebookUrl: string;
  youtubeUrl: string;
  instagramUrl: string;
  twitterUrl: string;
  maintenanceMode: boolean;
  desktopLogoUrl: string;
  mobileLogoUrl: string;
  footerDesktopLogoUrl?: string;
  footerMobileLogoUrl?: string;
  hamburgerLogoUrl?: string;
  defaultLogoMonogram?: string;
  copyrightText?: string;
  developerCredit?: string;
}

export type ViewState = 
  | { type: 'home' }
  | { type: 'category'; categoryId: string }
  | { type: 'article'; articleId: string }
  | { type: 'search'; query?: string }
  | { type: 'submit-news' }
  | { type: 'advertise' }
  | { type: 'bookmarks' }
  | { type: 'static'; page: 'about' | 'privacy' | 'terms' | 'contact' | 'editorial' | 'sitemap' }
  | { type: 'admin-login' }
  | { type: 'admin-dashboard' };
