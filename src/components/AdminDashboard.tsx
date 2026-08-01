import React, { useState, useEffect } from 'react';
import { Article, Category, Language, AdRequest, SubmittedNews, SiteSettings, BannerAd, Moderator, AdminSession } from '../types';
import { translations } from '../data/mockNews';
import { 
  LayoutDashboard, FileText, Globe, Megaphone, Send, Plus, Trash2, Edit, CheckCircle, XCircle, 
  LogOut, Eye, Sparkles, Image, Upload, Check, Info, Monitor, Smartphone, Link as LinkIcon,
  Users, UserPlus, ShieldCheck, ShieldAlert, UserX, Key, Phone, Calendar, BadgeCheck, AlertTriangle, Shield, RotateCcw
} from 'lucide-react';

interface AdminDashboardProps {
  articles: Article[];
  categories: Category[];
  adRequests: AdRequest[];
  bannerAds?: BannerAd[];
  submittedNews: SubmittedNews[];
  siteSettings: SiteSettings;
  language: Language;
  adminSession?: AdminSession;
  moderators?: Moderator[];
  onLogout: () => void;
  onAddArticle: (article: Omit<Article, 'id' | 'viewsCount' | 'likesCount' | 'commentsCount'>) => void;
  onDeleteArticle: (id: string) => void;
  onAddCategory: (cat: { nameBn: string; nameEn: string; slug: string }) => void;
  onDeleteCategory: (id: string) => void;
  onUpdateSiteSettings: (settings: SiteSettings) => void;
  onUpdateAdStatus?: (id: string, status: 'pending' | 'reviewed' | 'approved' | 'rejected') => void;
  onDeleteAdRequest?: (id: string) => void;
  onAddBannerAd?: (ad: Omit<BannerAd, 'id'>) => void;
  onDeleteBannerAd?: (id: string) => void;
  onToggleBannerAd?: (id: string) => void;
  onAddModerator?: (mod: Omit<Moderator, 'id'>) => Promise<void>;
  onUpdateModerator?: (id: string, updates: Partial<Moderator>) => Promise<void>;
  onToggleBanModerator?: (id: string, currentBanStatus: boolean) => Promise<void>;
  onDeleteModerator?: (id: string) => Promise<void>;
  onUpdateArticleViews?: (id: string, viewsCount: number) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  articles,
  categories,
  adRequests,
  bannerAds = [],
  submittedNews,
  siteSettings,
  language,
  adminSession,
  moderators = [],
  onLogout,
  onAddArticle,
  onDeleteArticle,
  onAddCategory,
  onDeleteCategory,
  onUpdateSiteSettings,
  onUpdateAdStatus,
  onDeleteAdRequest,
  onAddBannerAd,
  onDeleteBannerAd,
  onToggleBannerAd,
  onAddModerator,
  onUpdateModerator,
  onToggleBanModerator,
  onDeleteModerator,
  onUpdateArticleViews
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'news' | 'categories' | 'ads' | 'submissions' | 'moderators' | 'settings'>('overview');
  const [adFilter, setAdFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [adSubTab, setAdSubTab] = useState<'banners' | 'requests'>('banners');

  // Permission calculation based on logged in session
  const isSuperAdmin = !adminSession || adminSession.role === 'superadmin';
  const modPerms = adminSession?.moderatorInfo?.permissions;

  const canAccessNews = isSuperAdmin || modPerms?.fullControl || modPerms?.newsManagement;
  const canAccessCategories = isSuperAdmin || modPerms?.fullControl || modPerms?.categoryManagement;
  const canAccessAds = isSuperAdmin || modPerms?.fullControl || modPerms?.adRequests;
  const canAccessSubmissions = isSuperAdmin || modPerms?.fullControl || modPerms?.userSubmissions;
  const canAccessModerators = isSuperAdmin || modPerms?.fullControl;
  const canAccessSettings = isSuperAdmin || modPerms?.fullControl;

  // Moderator Form State
  const [editingModId, setEditingModId] = useState<string | null>(null);
  const [modName, setModName] = useState('');
  const [modDesignation, setModDesignation] = useState('');
  const [modNumber, setModNumber] = useState('');
  const [modNid, setModNid] = useState('');
  const [modDob, setModDob] = useState('');
  const [modGmail, setModGmail] = useState('');
  const [modPassword, setModPassword] = useState('');
  const [modNewPassword, setModNewPassword] = useState('');
  
  // Permissions Checkboxes
  const [permFullControl, setPermFullControl] = useState(false);
  const [permNewsMgmt, setPermNewsMgmt] = useState(true);
  const [permCategoryMgmt, setPermCategoryMgmt] = useState(false);
  const [permAdReq, setPermAdReq] = useState(false);
  const [permUserSub, setPermUserSub] = useState(false);

  const [modSuccessMsg, setModSuccessMsg] = useState('');
  const [modErrorMsg, setModErrorMsg] = useState('');
  const [isModSaving, setIsModSaving] = useState(false);

  // New Banner Ad Form State
  const [adTitle, setAdTitle] = useState('');
  const [adPosition, setAdPosition] = useState<'header' | 'sidebar' | 'inline' | 'footer'>('header');
  const [adImageUrl, setAdImageUrl] = useState(''); // Desktop image URL
  const [adMobileImageUrl, setAdMobileImageUrl] = useState(''); // Mobile image URL
  const [adLinkUrl, setAdLinkUrl] = useState('');
  const [adIsActive, setAdIsActive] = useState(true);
  const [adSuccessMsg, setAdSuccessMsg] = useState(false);
  
  // Settings / Logo state
  const [desktopLogoInput, setDesktopLogoInput] = useState(siteSettings.desktopLogoUrl || '');
  const [mobileLogoInput, setMobileLogoInput] = useState(siteSettings.mobileLogoUrl || '');
  const [footerDesktopLogoInput, setFooterDesktopLogoInput] = useState(siteSettings.footerDesktopLogoUrl || '');
  const [footerMobileLogoInput, setFooterMobileLogoInput] = useState(siteSettings.footerMobileLogoUrl || '');
  const [hamburgerLogoInput, setHamburgerLogoInput] = useState(siteSettings.hamburgerLogoUrl || '');
  const [defaultLogoMonogramInput, setDefaultLogoMonogramInput] = useState(siteSettings.defaultLogoMonogram || '২৪');
  const [siteNameBnInput, setSiteNameBnInput] = useState(siteSettings.siteNameBn || '');
  const [siteNameEnInput, setSiteNameEnInput] = useState(siteSettings.siteNameEn || '');
  const [taglineBnInput, setTaglineBnInput] = useState(siteSettings.taglineBn || '');
  const [taglineEnInput, setTaglineEnInput] = useState(siteSettings.taglineEn || '');
  const [copyrightTextBnInput, setCopyrightTextBnInput] = useState(siteSettings.copyrightTextBn || 'সর্বস্বত্ব সংরক্ষিত।');
  const [copyrightTextEnInput, setCopyrightTextEnInput] = useState(siteSettings.copyrightTextEn || siteSettings.copyrightText || 'All rights reserved.');
  const [copyrightTextInput, setCopyrightTextInput] = useState(siteSettings.copyrightText || 'All rights reserved.');
  const [developerCreditInput, setDeveloperCreditInput] = useState(siteSettings.developerCredit || 'Bangla Media Group');
  const [developerWebsiteUrlInput, setDeveloperWebsiteUrlInput] = useState(siteSettings.developerWebsiteUrl || '');
  const [developerPrefixTextInput, setDeveloperPrefixTextInput] = useState(siteSettings.developerPrefixText || 'Designed & Developed with Professional Standards for');
  
  // Contact & Publisher / Editor State
  const [publisherNameInput, setPublisherNameInput] = useState(siteSettings.publisherName || 'কাজী আশরাফুল ইসলাম');
  const [editorNameInput, setEditorNameInput] = useState(siteSettings.editorName || 'মাহাবুবুর রহমান');
  const [addressInput, setAddressInput] = useState(siteSettings.address || 'কাওরান বাজার, ঢাকা-১২১৫, বাংলাদেশ');
  const [contactPhoneInput, setContactPhoneInput] = useState(siteSettings.contactPhone || '+৮৮০ ৯৬১২ ৩৪০৫৬৭');
  const [contactEmailInput, setContactEmailInput] = useState(siteSettings.contactEmail || 'contact@banglanews24.mock');
  const [facebookUrlInput, setFacebookUrlInput] = useState(siteSettings.facebookUrl || 'https://facebook.com');
  const [youtubeUrlInput, setYoutubeUrlInput] = useState(siteSettings.youtubeUrl || 'https://youtube.com');
  const [instagramUrlInput, setInstagramUrlInput] = useState(siteSettings.instagramUrl || 'https://instagram.com');
  const [twitterUrlInput, setTwitterUrlInput] = useState(siteSettings.twitterUrl || 'https://twitter.com');

  // Static Pages Content State
  const [activeStaticSubTab, setActiveStaticSubTab] = useState<'about' | 'privacy' | 'terms' | 'editorial'>('about');
  const [aboutUsBnInput, setAboutUsBnInput] = useState(
    siteSettings.aboutUsBn || 'বাংলা নিউজ ২৪ হলো বাংলাদেশের অন্যতম শীর্ষস্থানীয় আধুনিক ও নির্ভরযোগ্য অনলাইন নিউজ পোর্টাল। সত্যের সন্ধানে অবিচল থেকে আমরা দেশ ও বিদেশের সর্বশেষ সংবাদ, রাজনীতি, অর্থনীতি, প্রযুক্তি, বিনোদন এবং খেলাধুলার রিয়েল-টাইম আপডেট পরিবেশন করে আসছি।\n\nআমাদের লক্ষ্য হলো বস্তুনিষ্ঠ ও নিরপেক্ষ সাংবাদিকতার মাধ্যমে পাঠকদের কাছে সঠিক তথ্য পৌঁছে দেওয়া এবং একটি সচেতন সমাজ গঠনে ভূমিকা রাখা।'
  );
  const [aboutUsEnInput, setAboutUsEnInput] = useState(
    siteSettings.aboutUsEn || 'Bangla News 24 is one of Bangladesh\'s leading modern and reliable online news portals. Uncompromising in our search for truth, we deliver real-time updates on national and international affairs, politics, economy, technology, entertainment, and sports.\n\nOur mission is to deliver accurate information to readers through objective and neutral journalism and contribute to building a conscious society.'
  );

  const [privacyPolicyBnInput, setPrivacyPolicyBnInput] = useState(
    siteSettings.privacyPolicyBn || 'আমরা আপনার গোপনীয়তাকে সর্বোচ্চ গুরুত্ব দিই। আমাদের ওয়েবসাইটে ভিজিট করার সময় সংগৃহীত তথ্য কেবল ব্যবহারকারীর অভিজ্ঞতা উন্নত করার জন্য ব্যবহৃত হয়। কোনো অবস্থাতেই তৃতীয় পক্ষের কাছে আপনার ব্যক্তিগত তথ্য বিক্রি বা শেয়ার করা হয় না。\n\nআমরা কুকি ব্যবহার করি সাইটের সঠিক পরিবেশন নিশ্চিত করতে এবং কাস্টমাইজড সংবাদ প্রদান করতে।'
  );
  const [privacyPolicyEnInput, setPrivacyPolicyEnInput] = useState(
    siteSettings.privacyPolicyEn || 'We value your privacy immensely. Information collected while visiting our website is used solely to enhance user experience and is never sold or shared with third parties.\n\nWe use standard browser cookies to ensure proper site performance and tailored news content.'
  );

  const [termsBnInput, setTermsBnInput] = useState(
    siteSettings.termsBn || 'বাংলা নিউজ ২৪-এর সমস্ত কন্টেন্ট, টেক্সট, লোগো, এবং ছবি কপিরাইট আইনের আওতাধীন। পূর্বানুমতি ছাড়া এই পোর্টালের কোনো সংবাদ বা ছবি বাণিজ্যিক উদ্দেশ্যে পুনপ্রকাশ বা অনুলিপি করা আইনত দণ্ডনীয়।\n\nআমাদের পোর্টালে মন্তব্য করার সময় মার্জিত ভাষা ও সৌজন্য বজায় রাখার অনুরোধ করা হচ্ছে।'
  );
  const [termsEnInput, setTermsEnInput] = useState(
    siteSettings.termsEn || 'All content, logos, text, and images on Bangla News 24 are protected by copyright laws. Unauthorized commercial redistribution or duplication is strictly prohibited.\n\nUsers are requested to maintain respectful language when submitting public comments.'
  );

  const [editorialPolicyBnInput, setEditorialPolicyBnInput] = useState(
    siteSettings.editorialPolicyBn || 'আমরা সংবাদ পরিবেশনে নির্ভুলতা, ভারসাম্য এবং সত্যনিষ্ঠাকে প্রধান অগ্রাধিকার দেই। কোনো পক্ষপাতিত্ব ছাড়াই ঘটনার পেছনের সত্য তুলে ধরাই আমাদের মূল অঙ্গীকার।\n\nযেকোনো সংবাদের বস্তুনিষ্ঠতা বজায় রাখতে আমরা একাধিক বিশ্বস্ত সূত্র থেকে তথ্য যাচাই নিশ্চিত করি।'
  );
  const [editorialPolicyEnInput, setEditorialPolicyEnInput] = useState(
    siteSettings.editorialPolicyEn || 'We prioritize accuracy, balance, and integrity in reporting. Our core commitment is to uncover the truth behind events without bias.\n\nTo maintain journalistic integrity, we strictly verify information from multiple reliable sources before publication.'
  );

  useEffect(() => {
    if (siteSettings) {
      setDesktopLogoInput(siteSettings.desktopLogoUrl || '');
      setMobileLogoInput(siteSettings.mobileLogoUrl || '');
      setFooterDesktopLogoInput(siteSettings.footerDesktopLogoUrl || '');
      setFooterMobileLogoInput(siteSettings.footerMobileLogoUrl || '');
      setHamburgerLogoInput(siteSettings.hamburgerLogoUrl || '');
      setDefaultLogoMonogramInput(siteSettings.defaultLogoMonogram || '২৪');
      setSiteNameBnInput(siteSettings.siteNameBn || '');
      setSiteNameEnInput(siteSettings.siteNameEn || '');
      setTaglineBnInput(siteSettings.taglineBn || '');
      setTaglineEnInput(siteSettings.taglineEn || '');
      setCopyrightTextBnInput(siteSettings.copyrightTextBn || 'সর্বস্বত্ব সংরক্ষিত।');
      setCopyrightTextEnInput(siteSettings.copyrightTextEn || siteSettings.copyrightText || 'All rights reserved.');
      setCopyrightTextInput(siteSettings.copyrightText || 'All rights reserved.');
      setDeveloperCreditInput(siteSettings.developerCredit || 'Bangla Media Group');
      setDeveloperWebsiteUrlInput(siteSettings.developerWebsiteUrl || '');
      setDeveloperPrefixTextInput(siteSettings.developerPrefixText || 'Designed & Developed with Professional Standards for');
      setPublisherNameInput(siteSettings.publisherName || '');
      setEditorNameInput(siteSettings.editorName || '');
      setAddressInput(siteSettings.address || '');
      setContactPhoneInput(siteSettings.contactPhone || '');
      setContactEmailInput(siteSettings.contactEmail || '');
      setFacebookUrlInput(siteSettings.facebookUrl || 'https://facebook.com');
      setYoutubeUrlInput(siteSettings.youtubeUrl || 'https://youtube.com');
      setInstagramUrlInput(siteSettings.instagramUrl || 'https://instagram.com');
      setTwitterUrlInput(siteSettings.twitterUrl || 'https://twitter.com');
      setAboutUsBnInput(siteSettings.aboutUsBn || '');
      setAboutUsEnInput(siteSettings.aboutUsEn || '');
      setPrivacyPolicyBnInput(siteSettings.privacyPolicyBn || '');
      setPrivacyPolicyEnInput(siteSettings.privacyPolicyEn || '');
      setTermsBnInput(siteSettings.termsBn || '');
      setTermsEnInput(siteSettings.termsEn || '');
      setEditorialPolicyBnInput(siteSettings.editorialPolicyBn || '');
      setEditorialPolicyEnInput(siteSettings.editorialPolicyEn || '');
    }
  }, [siteSettings]);

  const [settingsSuccess, setSettingsSuccess] = useState(false);

  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'navDesktop' | 'navMobile' | 'footerDesktop' | 'footerMobile' | 'hamburger') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          if (target === 'navDesktop') setDesktopLogoInput(reader.result);
          if (target === 'navMobile') setMobileLogoInput(reader.result);
          if (target === 'footerDesktop') setFooterDesktopLogoInput(reader.result);
          if (target === 'footerMobile') setFooterMobileLogoInput(reader.result);
          if (target === 'hamburger') setHamburgerLogoInput(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSiteSettings({
      ...siteSettings,
      desktopLogoUrl: desktopLogoInput,
      mobileLogoUrl: mobileLogoInput,
      footerDesktopLogoUrl: footerDesktopLogoInput,
      footerMobileLogoUrl: footerMobileLogoInput,
      hamburgerLogoUrl: hamburgerLogoInput,
      defaultLogoMonogram: defaultLogoMonogramInput,
      siteNameBn: siteNameBnInput,
      siteNameEn: siteNameEnInput,
      taglineBn: taglineBnInput,
      taglineEn: taglineEnInput,
      copyrightTextBn: copyrightTextBnInput,
      copyrightTextEn: copyrightTextEnInput,
      copyrightText: copyrightTextEnInput || copyrightTextInput,
      developerCredit: developerCreditInput,
      developerWebsiteUrl: developerWebsiteUrlInput,
      developerPrefixText: developerPrefixTextInput,
      publisherName: publisherNameInput,
      editorName: editorNameInput,
      address: addressInput,
      contactPhone: contactPhoneInput,
      contactEmail: contactEmailInput,
      facebookUrl: facebookUrlInput,
      youtubeUrl: youtubeUrlInput,
      instagramUrl: instagramUrlInput,
      twitterUrl: twitterUrlInput,
      aboutUsBn: aboutUsBnInput,
      aboutUsEn: aboutUsEnInput,
      privacyPolicyBn: privacyPolicyBnInput,
      privacyPolicyEn: privacyPolicyEnInput,
      termsBn: termsBnInput,
      termsEn: termsEnInput,
      editorialPolicyBn: editorialPolicyBnInput,
      editorialPolicyEn: editorialPolicyEnInput,
    });
    setSettingsSuccess(true);
    setTimeout(() => setSettingsSuccess(false), 3000);
  };

  const resetModForm = () => {
    setEditingModId(null);
    setModName('');
    setModDesignation('');
    setModNumber('');
    setModNid('');
    setModDob('');
    setModGmail('');
    setModPassword('');
    setModNewPassword('');
    setPermFullControl(false);
    setPermNewsMgmt(true);
    setPermCategoryMgmt(false);
    setPermAdReq(false);
    setPermUserSub(false);
  };

  const handleModeratorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModErrorMsg('');
    setModSuccessMsg('');

    if (!modName || !modDesignation || !modNumber || !modNid || !modDob || !modGmail) {
      setModErrorMsg(language === 'bn' ? 'অনুগ্রহ করে সকল প্রয়োজনীয় ঘর সঠিক তথ্য দিয়ে পূরণ করুন।' : 'Please fill all required fields correctly.');
      return;
    }

    if (!editingModId && !modPassword) {
      setModErrorMsg(language === 'bn' ? 'মডারেটরের লগইন পাসওয়ার্ড দিন।' : 'Password is required for new moderator.');
      return;
    }

    setIsModSaving(true);

    const modPayload: Omit<Moderator, 'id'> = {
      name: modName.trim(),
      designation: modDesignation.trim(),
      number: modNumber.trim(),
      nid: modNid.trim(),
      dateOfBirth: modDob,
      gmail: modGmail.trim().toLowerCase(),
      password: modPassword,
      newPassword: modNewPassword ? modNewPassword.trim() : undefined,
      permissions: {
        fullControl: permFullControl,
        newsManagement: permFullControl ? true : permNewsMgmt,
        categoryManagement: permFullControl ? true : permCategoryMgmt,
        adRequests: permFullControl ? true : permAdReq,
        userSubmissions: permFullControl ? true : permUserSub
      },
      isBanned: false,
      createdBy: isSuperAdmin ? 'Super Admin' : 'Admin'
    };

    try {
      if (editingModId && onUpdateModerator) {
        await onUpdateModerator(editingModId, {
          ...modPayload,
          ...(modNewPassword ? { password: modNewPassword.trim(), newPassword: '' } : {})
        });
        setModSuccessMsg(language === 'bn' ? 'মডারেটর তথ্য ফায়ারবেসে সফলভাবে আপডেট করা হয়েছে!' : 'Moderator updated successfully in Firebase!');
      } else if (onAddModerator) {
        await onAddModerator(modPayload);
        setModSuccessMsg(language === 'bn' ? 'নতুন মডারেটর ফায়ারবেস ডাটাবেসে সফলভাবে যুক্ত হয়েছে!' : 'New moderator created successfully in Firebase!');
      }
      resetModForm();
      setTimeout(() => setModSuccessMsg(''), 4000);
    } catch (err) {
      console.error(err);
      setModErrorMsg(language === 'bn' ? 'ডাটাবেসে সংরক্ষণে সমস্যা হয়েছে।' : 'Error saving moderator to Firebase.');
    } finally {
      setIsModSaving(false);
    }
  };

  const handleEditClick = (mod: Moderator) => {
    setEditingModId(mod.id);
    setModName(mod.name);
    setModDesignation(mod.designation);
    setModNumber(mod.number);
    setModNid(mod.nid);
    setModDob(mod.dateOfBirth);
    setModGmail(mod.gmail);
    setModPassword(mod.password);
    setModNewPassword(mod.newPassword || '');
    setPermFullControl(mod.permissions.fullControl);
    setPermNewsMgmt(mod.permissions.newsManagement);
    setPermCategoryMgmt(mod.permissions.categoryManagement);
    setPermAdReq(mod.permissions.adRequests);
    setPermUserSub(mod.permissions.userSubmissions);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleBan = async (id: string, currentBanStatus: boolean) => {
    if (onToggleBanModerator) {
      try {
        await onToggleBanModerator(id, currentBanStatus);
        setModSuccessMsg(
          currentBanStatus
            ? (language === 'bn' ? 'মডারেটর অ্যাকাউন্টটি আনব্যান করা হয়েছে।' : 'Moderator unbanned successfully.')
            : (language === 'bn' ? 'মডারেটর অ্যাকাউন্টটি ব্যান (Banned) করা হয়েছে।' : 'Moderator banned successfully.')
        );
        setTimeout(() => setModSuccessMsg(''), 4000);
      } catch (e) {
        setModErrorMsg('Ban toggle failed.');
      }
    }
  };

  const handleDeleteMod = async (id: string) => {
    if (window.confirm(language === 'bn' ? 'আপনি কি নিশ্চিত যে এই মডারেটরকে ফায়ারবেস থেকে মুছে ফেলতে চান?' : 'Are you sure you want to delete this moderator from Firebase?')) {
      if (onDeleteModerator) {
        try {
          await onDeleteModerator(id);
          setModSuccessMsg(language === 'bn' ? 'মডারেটর ফায়ারবেস থেকে ডিলিট করা হয়েছে।' : 'Moderator deleted from Firebase.');
          setTimeout(() => setModSuccessMsg(''), 4000);
        } catch (e) {
          setModErrorMsg('Delete failed.');
        }
      }
    }
  };
  
  // Add Article Modal state
  const [showAddArticleModal, setShowAddArticleModal] = useState(false);
  const [titleBn, setTitleBn] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [summaryBn, setSummaryBn] = useState('');
  const [summaryEn, setSummaryEn] = useState('');
  const [contentBn, setContentBn] = useState('');
  const [contentEn, setContentEn] = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || 'desh');
  const [reporterName, setReporterName] = useState('নিজস্ব প্রতিবেদক');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isBreaking, setIsBreaking] = useState(false);
  const [isTrending, setIsTrending] = useState(false);
  const [tagsInput, setTagsInput] = useState('news, bangladesh');

  // Add Category state
  const [newCatBn, setNewCatBn] = useState('');
  const [newCatEn, setNewCatEn] = useState('');
  const [initialViewsInput, setInitialViewsInput] = useState<number>(150);

  const totalViews = articles.reduce((acc, curr) => acc + curr.viewsCount, 0);

  const handleArticleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddArticle({
      titleBn,
      titleEn,
      slug: titleEn.toLowerCase().replace(/[^a-z0-9]+/g, '-') || `news-${Date.now()}`,
      summaryBn,
      summaryEn,
      contentBn,
      contentEn,
      categoryId,
      reporterName,
      publishedAt: new Date().toISOString(),
      imageUrl,
      viewsCount: initialViewsInput,
      isFeatured,
      isBreaking,
      isTrending,
      tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean)
    });
    setShowAddArticleModal(false);
    // Reset form
    setTitleBn('');
    setTitleEn('');
    setSummaryBn('');
    setSummaryEn('');
    setContentBn('');
    setContentEn('');
  };

  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCatBn && newCatEn) {
      onAddCategory({
        nameBn: newCatBn,
        nameEn: newCatEn,
        slug: newCatEn.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      });
      setNewCatBn('');
      setNewCatEn('');
    }
  };

  const handleBannerAdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adTitle && adImageUrl && onAddBannerAd) {
      onAddBannerAd({
        title: adTitle,
        position: adPosition,
        imageUrl: adImageUrl,
        mobileImageUrl: adMobileImageUrl.trim() || undefined,
        linkUrl: adLinkUrl || '#',
        isActive: adIsActive
      });
      setAdTitle('');
      setAdImageUrl('');
      setAdMobileImageUrl('');
      setAdLinkUrl('');
      setAdSuccessMsg(true);
      setTimeout(() => setAdSuccessMsg(false), 3000);
    }
  };

  const handleDesktopImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setAdImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMobileImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setAdMobileImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-gray-900 text-gray-300 flex flex-col justify-between shrink-0">
        <div>
          <div className="p-6 border-b border-gray-800 flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-md shadow-red-900/50">
              {siteSettings?.defaultLogoMonogram || '২৪'}
            </div>
            <div>
              <h3 className="text-white font-bold text-base flex items-center space-x-1">
                <span>{isSuperAdmin ? 'Super Admin' : 'Moderator Panel'}</span>
              </h3>
              <p className="text-xs text-gray-400 font-medium truncate max-w-[150px]">
                {adminSession?.role === 'moderator' && adminSession.moderatorInfo
                  ? `${adminSession.moderatorInfo.name} (${adminSession.moderatorInfo.designation})`
                  : 'Bangla News 24 Admin'}
              </p>
            </div>
          </div>

          <nav className="p-4 space-y-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
                activeTab === 'overview' ? 'bg-red-600 text-white shadow-md' : 'hover:bg-gray-800 text-gray-300'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>{language === 'bn' ? 'ড্যাশবোর্ড ওভারভিউ' : 'Overview'}</span>
            </button>

            {canAccessNews && (
              <button
                onClick={() => setActiveTab('news')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
                  activeTab === 'news' ? 'bg-red-600 text-white shadow-md' : 'hover:bg-gray-800 text-gray-300'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>{language === 'bn' ? 'সংবাদ ব্যবস্থাপনা' : 'News Management'}</span>
              </button>
            )}

            {canAccessCategories && (
              <button
                onClick={() => setActiveTab('categories')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
                  activeTab === 'categories' ? 'bg-red-600 text-white shadow-md' : 'hover:bg-gray-800 text-gray-300'
                }`}
              >
                <Globe className="w-4 h-4" />
                <span>{language === 'bn' ? 'বিভাগসমূহ' : 'Categories'}</span>
              </button>
            )}

            {canAccessAds && (
              <button
                onClick={() => setActiveTab('ads')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
                  activeTab === 'ads' ? 'bg-red-600 text-white shadow-md' : 'hover:bg-gray-800 text-gray-300'
                }`}
              >
                <Megaphone className="w-4 h-4" />
                <span>{language === 'bn' ? 'বিজ্ঞাপন ব্যবস্থাপনা' : 'Ad Management'}</span>
              </button>
            )}

            {canAccessSubmissions && (
              <button
                onClick={() => setActiveTab('submissions')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
                  activeTab === 'submissions' ? 'bg-red-600 text-white shadow-md' : 'hover:bg-gray-800 text-gray-300'
                }`}
              >
                <Send className="w-4 h-4" />
                <span>{language === 'bn' ? 'প্রেরিত সংবাদ' : 'User Submissions'}</span>
              </button>
            )}

            {canAccessModerators && (
              <button
                onClick={() => setActiveTab('moderators')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
                  activeTab === 'moderators' ? 'bg-red-600 text-white shadow-md' : 'hover:bg-gray-800 text-gray-300'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>{language === 'bn' ? 'মডারেটর ব্যবস্থাপনা' : 'Moderator Management'}</span>
                {moderators.length > 0 && (
                  <span className="ml-auto bg-gray-800 text-yellow-400 font-extrabold text-[10px] px-2 py-0.5 rounded-full border border-gray-700">
                    {moderators.length}
                  </span>
                )}
              </button>
            )}

            {canAccessSettings && (
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
                  activeTab === 'settings' ? 'bg-red-600 text-white shadow-md' : 'hover:bg-gray-800 text-gray-300'
                }`}
              >
                <Image className="w-4 h-4" />
                <span>{language === 'bn' ? 'লোগো ও সেটিংস' : 'Logo & Settings'}</span>
              </button>
            )}
          </nav>
        </div>

        <div className="p-4 border-t border-gray-800">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center space-x-2 bg-gray-800 hover:bg-red-600 text-white py-3 rounded-xl text-sm font-bold transition shadow"
          >
            <LogOut className="w-4 h-4" />
            <span>{translations[language].logout}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        
        {/* Settings / Logo Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6 max-w-3xl">
            <h1 className="text-2xl font-extrabold text-gray-900">
              {language === 'bn' ? 'লোগো ও সাইট সেটিংস' : 'Logo & Site Settings'}
            </h1>
            <p className="text-sm text-gray-600">
              {language === 'bn' 
                ? 'ডেস্কটপ এবং মোবাইল সংস্করণের জন্য পেশাদার লোগো ইমেজ ইউআরএল (URL) সেট করুন।' 
                : 'Configure professional logo image URLs for desktop and mobile views.'}
            </p>

            {settingsSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm font-semibold">
                {language === 'bn' ? 'সেটিংস সফলভাবে সংরক্ষিত হয়েছে!' : 'Settings successfully saved!'}
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200 space-y-6">
              
              {/* --- NAVBAR / HEADER LOGOS --- */}
              <div className="border-b border-gray-100 pb-6 space-y-4">
                <h3 className="text-base font-extrabold text-gray-900 flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-red-600"></span>
                  <span>{language === 'bn' ? 'নেভিগেশন বার (হেডার) লোগো' : 'Navbar / Header Logos'}</span>
                </h3>

                {/* Nav Desktop Logo */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-bold text-gray-700">
                      {language === 'bn' ? 'হেডার ডেস্কটপ লোগো (Navbar Desktop Logo)' : 'Navbar Desktop Logo'}
                    </label>
                    <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                      {language === 'bn' ? 'প্রস্তাবিত সাইজ: ২২০px × ৫০px' : 'Recommended: 220px × 50px'}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={desktopLogoInput}
                      onChange={(e) => setDesktopLogoInput(e.target.value)}
                      placeholder="https://... image URL or upload local file"
                      className="flex-1 bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-600 font-medium"
                    />
                    <label className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs px-4 py-2.5 rounded-xl border border-gray-300 cursor-pointer flex items-center justify-center space-x-1.5 transition shrink-0">
                      <Upload className="w-4 h-4 text-red-600" />
                      <span>{language === 'bn' ? 'ফাইল আপলোড' : 'Upload File'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleLogoFileUpload(e, 'navDesktop')}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">
                    {language === 'bn' 
                      ? 'ডেস্কটপ নেভিগেশন বারের জন্য সর্বোচ্চ সাইজ ২২০px × ৫০px (স্বচ্ছ PNG পছন্দনীয়)।' 
                      : 'Recommended size: 220px × 50px for desktop header (Transparent PNG preferred).'}
                  </p>
                  {desktopLogoInput && (
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl flex items-center space-x-3">
                      <span className="text-xs font-semibold text-gray-500">Preview:</span>
                      <img src={desktopLogoInput} alt="Navbar Desktop Preview" className="h-14 object-contain max-w-[280px]" onError={(e) => {(e.target as HTMLElement).style.display = 'none';}} />
                    </div>
                  )}
                </div>

                {/* Nav Mobile Logo */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-bold text-gray-700">
                      {language === 'bn' ? 'হেডার মোবাইল লোগো (Navbar Mobile Logo)' : 'Navbar Mobile Logo'}
                    </label>
                    <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                      {language === 'bn' ? 'প্রস্তাবিত সাইজ: ২০০px × ৬০px' : 'Recommended: 200px × 60px'}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={mobileLogoInput}
                      onChange={(e) => setMobileLogoInput(e.target.value)}
                      placeholder="https://... image URL or upload local file"
                      className="flex-1 bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-600 font-medium"
                    />
                    <label className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs px-4 py-2.5 rounded-xl border border-gray-300 cursor-pointer flex items-center justify-center space-x-1.5 transition shrink-0">
                      <Upload className="w-4 h-4 text-red-600" />
                      <span>{language === 'bn' ? 'ফাইল আপলোড' : 'Upload File'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleLogoFileUpload(e, 'navMobile')}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">
                    {language === 'bn' 
                      ? 'মোবাইল নেভিগেশন বারের জন্য লোগো (স্বচ্ছ PNG পছন্দনীয়)।' 
                      : 'Logo for mobile header (Transparent PNG preferred).'}
                  </p>
                  {mobileLogoInput && (
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl flex items-center space-x-3">
                      <span className="text-xs font-semibold text-gray-500">Preview:</span>
                      <img src={mobileLogoInput} alt="Navbar Mobile Preview" className="h-12 object-contain max-w-[220px]" onError={(e) => {(e.target as HTMLElement).style.display = 'none';}} />
                    </div>
                  )}
                </div>

                {/* Hamburger Menu / Drawer Logo */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-bold text-gray-700">
                      {language === 'bn' ? 'ড্রয়ার / হ্যামবার্গার মেনু লোগো (Hamburger Menu Logo)' : 'Hamburger Menu / Drawer Logo'}
                    </label>
                    <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                      {language === 'bn' ? 'প্রস্তাবিত সাইজ: ২০০px × ৬০px' : 'Recommended: 200px × 60px'}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={hamburgerLogoInput}
                      onChange={(e) => setHamburgerLogoInput(e.target.value)}
                      placeholder="https://... image URL or upload local file"
                      className="flex-1 bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-600 font-medium"
                    />
                    <label className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs px-4 py-2.5 rounded-xl border border-gray-300 cursor-pointer flex items-center justify-center space-x-1.5 transition shrink-0">
                      <Upload className="w-4 h-4 text-red-600" />
                      <span>{language === 'bn' ? 'ফাইল আপলোড' : 'Upload File'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleLogoFileUpload(e, 'hamburger')}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">
                    {language === 'bn' 
                      ? 'হ্যামবার্গার মেনু ড্রয়ারের শীর্ষ অংশের জন্য লোগো (খালি রাখলে হেডার লোগো বা ডিফল্ট ব্যাজ দেখাবে)।' 
                      : 'Logo shown at the top of the mobile navigation drawer (leave blank to fallback to header logo or default badge).'}
                  </p>
                  {hamburgerLogoInput && (
                    <div className="p-3 bg-red-900 border border-red-800 rounded-xl flex items-center space-x-3">
                      <span className="text-xs font-semibold text-red-200">Hamburger Drawer Preview (Red BG):</span>
                      <img src={hamburgerLogoInput} alt="Hamburger Logo Preview" className="h-12 object-contain max-w-[220px] bg-white/10 rounded p-1" onError={(e) => {(e.target as HTMLElement).style.display = 'none';}} />
                    </div>
                  )}
                </div>
              </div>

              {/* --- FOOTER LOGOS --- */}
              <div className="border-b border-gray-100 pb-6 space-y-4">
                <h3 className="text-base font-extrabold text-gray-900 flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-red-600"></span>
                  <span>{language === 'bn' ? 'ফুটার লোগো' : 'Footer Logos'}</span>
                </h3>

                {/* Footer Desktop Logo */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-bold text-gray-700">
                      {language === 'bn' ? 'ফুটার ডেস্কটপ লোগো (Footer Desktop Logo)' : 'Footer Desktop Logo'}
                    </label>
                    <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                      {language === 'bn' ? 'প্রস্তাবিত সাইজ: ৩০০px × ৮০px' : 'Recommended: 300px × 80px'}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={footerDesktopLogoInput}
                      onChange={(e) => setFooterDesktopLogoInput(e.target.value)}
                      placeholder="https://... image URL or upload local file (blank uses Header logo)"
                      className="flex-1 bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-600 font-medium"
                    />
                    <label className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs px-4 py-2.5 rounded-xl border border-gray-300 cursor-pointer flex items-center justify-center space-x-1.5 transition shrink-0">
                      <Upload className="w-4 h-4 text-red-600" />
                      <span>{language === 'bn' ? 'ফাইল আপলোড' : 'Upload File'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleLogoFileUpload(e, 'footerDesktop')}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">
                    {language === 'bn' 
                      ? 'ডেস্কটপ ফুটারের জন্য লোগো (গাঢ় ব্যাকগ্রাউন্ডের জন্য লাইট/সাদা লোগো)।' 
                      : 'Logo for desktop footer (Light/white logo for dark background).'}
                  </p>
                  {footerDesktopLogoInput && (
                    <div className="p-3 bg-gray-900 border border-gray-800 rounded-xl flex items-center space-x-3">
                      <span className="text-xs font-semibold text-gray-400">Footer Desktop Preview (Dark BG):</span>
                      <img src={footerDesktopLogoInput} alt="Footer Desktop Preview" className="h-16 object-contain max-w-[320px]" onError={(e) => {(e.target as HTMLElement).style.display = 'none';}} />
                    </div>
                  )}
                </div>

                {/* Footer Mobile Logo */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-bold text-gray-700">
                      {language === 'bn' ? 'ফুটার মোবাইল লোগো (Footer Mobile Logo)' : 'Footer Mobile Logo'}
                    </label>
                    <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                      {language === 'bn' ? 'প্রস্তাবিত সাইজ: ২৬০px × ৭০px' : 'Recommended: 260px × 70px'}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={footerMobileLogoInput}
                      onChange={(e) => setFooterMobileLogoInput(e.target.value)}
                      placeholder="https://... image URL or upload local file (blank uses Header logo)"
                      className="flex-1 bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-600 font-medium"
                    />
                    <label className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs px-4 py-2.5 rounded-xl border border-gray-300 cursor-pointer flex items-center justify-center space-x-1.5 transition shrink-0">
                      <Upload className="w-4 h-4 text-red-600" />
                      <span>{language === 'bn' ? 'ফাইল আপলোড' : 'Upload File'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleLogoFileUpload(e, 'footerMobile')}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">
                    {language === 'bn' 
                      ? 'মোবাইল ফুটারের জন্য লোগো (গাঢ় ব্যাকগ্রাউন্ডের জন্য লাইট/সাদা লোগো)।' 
                      : 'Logo for mobile footer (Light/white logo for dark background).'}
                  </p>
                  {footerMobileLogoInput && (
                    <div className="p-3 bg-gray-900 border border-gray-800 rounded-xl flex items-center space-x-3">
                      <span className="text-xs font-semibold text-gray-400">Footer Mobile Preview (Dark BG):</span>
                      <img src={footerMobileLogoInput} alt="Footer Mobile Preview" className="h-14 object-contain max-w-[260px]" onError={(e) => {(e.target as HTMLElement).style.display = 'none';}} />
                    </div>
                  )}
                </div>
              </div>

              {/* Default Monogram / Badge Symbol */}
              <div className="pt-2">
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  {language === 'bn' ? 'ডিফল্ট মনোগ্রাম / ব্যাজ চিহ্ন (যেমন: ২৪)' : 'Default Monogram / Badge Symbol (e.g. ২৪)'}
                </label>
                <input
                  type="text"
                  value={defaultLogoMonogramInput}
                  onChange={(e) => setDefaultLogoMonogramInput(e.target.value)}
                  placeholder="২৪"
                  className="w-full md:w-1/2 bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-red-600"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {language === 'bn' ? 'যখন কোনো ছবি লোগো হিসেবে আপলোড করা না থাকে, তখন হেডার ও ফুটারে এই ব্যাজটি প্রদর্শিত হবে।' : 'Shown in header and footer as the fallback badge when no custom image logo is uploaded.'}
                </p>
              </div>

              {/* Site Name Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    {language === 'bn' ? 'সাইটের নাম (বাংলা)' : 'Site Name (Bangla)'}
                  </label>
                  <input
                    type="text"
                    value={siteNameBnInput}
                    onChange={(e) => setSiteNameBnInput(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-red-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    {language === 'bn' ? 'সাইটের নাম (ইংরেজি)' : 'Site Name (English)'}
                  </label>
                  <input
                    type="text"
                    value={siteNameEnInput}
                    onChange={(e) => setSiteNameEnInput(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              {/* Tagline / Subtitle Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    {language === 'bn' ? 'ট্যাগলাইন / হেডার সাবটাইটেল (বাংলা)' : 'Tagline / Header Subtitle (Bangla)'}
                  </label>
                  <input
                    type="text"
                    value={taglineBnInput}
                    onChange={(e) => setTaglineBnInput(e.target.value)}
                    placeholder="যেমন: অনলাইন সংবাদের প্রধান ঠিকানা"
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-red-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    {language === 'bn' ? 'ট্যাগলাইন / হেডার সাবটাইটেল (ইংরেজি)' : 'Tagline / Header Subtitle (English)'}
                  </label>
                  <input
                    type="text"
                    value={taglineEnInput}
                    onChange={(e) => setTaglineEnInput(e.target.value)}
                    placeholder="e.g. The Premier Online News Source"
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              {/* Contact, Editorial & Office Settings */}
              <div className="pt-4 border-t border-gray-200">
                <h4 className="text-base font-bold text-gray-900 mb-3 flex items-center space-x-2">
                  <Phone className="w-5 h-5 text-red-600" />
                  <span>{language === 'bn' ? 'যোগাযোগ, সম্পাদক ও প্রকাশক তথ্য (Office & Editorial Contact)' : 'Office & Editorial Contact Details'}</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      {language === 'bn' ? 'প্রকাশকের নাম' : 'Publisher Name'}
                    </label>
                    <input
                      type="text"
                      value={publisherNameInput}
                      onChange={(e) => setPublisherNameInput(e.target.value)}
                      placeholder="যেমন: কাজী আশরাফুল ইসলাম"
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-red-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      {language === 'bn' ? 'সম্পাদকের নাম' : 'Editor Name'}
                    </label>
                    <input
                      type="text"
                      value={editorNameInput}
                      onChange={(e) => setEditorNameInput(e.target.value)}
                      placeholder="যেমন: মাহাবুবুর রহমান"
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-red-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      {language === 'bn' ? 'অফিস ঠিকানা (Address)' : 'Office Address'}
                    </label>
                    <input
                      type="text"
                      value={addressInput}
                      onChange={(e) => setAddressInput(e.target.value)}
                      placeholder="যেমন: কাওরান বাজার, ঢাকা-১২১৫, বাংলাদেশ"
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-red-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      {language === 'bn' ? 'যোগাযোগের ফোন নম্বর' : 'Contact Phone Number'}
                    </label>
                    <input
                      type="text"
                      value={contactPhoneInput}
                      onChange={(e) => setContactPhoneInput(e.target.value)}
                      placeholder="+৮৮০ ৯৬১২ ৩৪০৫৬৭"
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-red-600"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      {language === 'bn' ? 'অফিসিয়ালি যোগাযোগের ইমেইল' : 'Contact Email Address'}
                    </label>
                    <input
                      type="email"
                      value={contactEmailInput}
                      onChange={(e) => setContactEmailInput(e.target.value)}
                      placeholder="contact@speednews24.com"
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-red-600"
                    />
                  </div>
                </div>

                {/* Social Media Links */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      {language === 'bn' ? 'ফেসবুক পেজ লিংক' : 'Facebook Page URL'}
                    </label>
                    <input
                      type="url"
                      value={facebookUrlInput}
                      onChange={(e) => setFacebookUrlInput(e.target.value)}
                      placeholder="https://facebook.com/yourpage"
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-red-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      {language === 'bn' ? 'ইউটিউব চ্যানেল লিংক' : 'YouTube Channel URL'}
                    </label>
                    <input
                      type="url"
                      value={youtubeUrlInput}
                      onChange={(e) => setYoutubeUrlInput(e.target.value)}
                      placeholder="https://youtube.com/@yourchannel"
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-red-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      {language === 'bn' ? 'ইনস্টাগ্রাম লিংক' : 'Instagram URL'}
                    </label>
                    <input
                      type="url"
                      value={instagramUrlInput}
                      onChange={(e) => setInstagramUrlInput(e.target.value)}
                      placeholder="https://instagram.com/yourhandle"
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-red-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      {language === 'bn' ? 'টুইটার (X) লিংক' : 'Twitter / X URL'}
                    </label>
                    <input
                      type="url"
                      value={twitterUrlInput}
                      onChange={(e) => setTwitterUrlInput(e.target.value)}
                      placeholder="https://twitter.com/yourhandle"
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-red-600"
                    />
                  </div>
                </div>
              </div>

              {/* --- STATIC PAGES & POLICIES EDITOR --- */}
              <div className="pt-6 border-t border-gray-200 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h4 className="text-base font-extrabold text-gray-900 flex items-center space-x-2">
                    <Info className="w-5 h-5 text-red-600" />
                    <span>{language === 'bn' ? 'স্থায়ী পৃষ্ঠা ও পলিসি কন্টেন্ট ব্যবস্থাপনা (Static Pages & Policies)' : 'Static Pages & Policies Content Manager'}</span>
                  </h4>

                  <span className="text-xs font-semibold text-gray-500">
                    {language === 'bn' ? 'পাঠকদের জন্য ওয়েবসাইটের সমস্ত পলিসি এডিট করুন' : 'Edit all public static pages for visitors'}
                  </span>
                </div>

                {/* Sub-tab Selection Header */}
                <div className="flex flex-wrap items-center gap-1.5 p-1 bg-gray-100 rounded-xl border border-gray-200">
                  <button
                    type="button"
                    onClick={() => setActiveStaticSubTab('about')}
                    className={`flex-1 min-w-[120px] text-xs font-extrabold px-3 py-2 rounded-lg transition text-center ${
                      activeStaticSubTab === 'about'
                        ? 'bg-red-600 text-white shadow-xs'
                        : 'text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {language === 'bn' ? '১. আমাদের সম্পর্কে' : '1. About Us'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveStaticSubTab('privacy')}
                    className={`flex-1 min-w-[120px] text-xs font-extrabold px-3 py-2 rounded-lg transition text-center ${
                      activeStaticSubTab === 'privacy'
                        ? 'bg-red-600 text-white shadow-xs'
                        : 'text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {language === 'bn' ? '২. গোপনীয়তা নীতি' : '2. Privacy Policy'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveStaticSubTab('terms')}
                    className={`flex-1 min-w-[120px] text-xs font-extrabold px-3 py-2 rounded-lg transition text-center ${
                      activeStaticSubTab === 'terms'
                        ? 'bg-red-600 text-white shadow-xs'
                        : 'text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {language === 'bn' ? '৩. ব্যবহারের শর্তাবলী' : '3. Terms of Use'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveStaticSubTab('editorial')}
                    className={`flex-1 min-w-[120px] text-xs font-extrabold px-3 py-2 rounded-lg transition text-center ${
                      activeStaticSubTab === 'editorial'
                        ? 'bg-red-600 text-white shadow-xs'
                        : 'text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {language === 'bn' ? '৪. সম্পাদনা নীতি' : '4. Editorial Policy'}
                  </button>
                </div>

                {/* Sub-tab 1: About Us */}
                {activeStaticSubTab === 'about' && (
                  <div className="space-y-4 bg-gray-50/70 p-4 rounded-2xl border border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-800 flex items-center space-x-1.5">
                        <span className="w-2 h-2 rounded-full bg-red-600"></span>
                        <span>{language === 'bn' ? 'আমাদের সম্পর্কে (About Us) কন্টেন্ট' : 'About Us Page Content'}</span>
                      </span>

                      <button
                        type="button"
                        onClick={() => {
                          setAboutUsBnInput('বাংলা নিউজ ২৪ হলো বাংলাদেশের অন্যতম শীর্ষস্থানীয় আধুনিক ও নির্ভরযোগ্য অনলাইন নিউজ পোর্টাল। সত্যের সন্ধানে অবিচল থেকে আমরা দেশ ও বিদেশের সর্বশেষ সংবাদ, রাজনীতি, অর্থনীতি, প্রযুক্তি, বিনোদন এবং খেলাধুলার রিয়েল-টাইম আপডেট পরিবেশন করে আসছি।\n\nআমাদের লক্ষ্য হলো বস্তুনিষ্ঠ ও নিরপেক্ষ সাংবাদিকতার মাধ্যমে পাঠকদের কাছে সঠিক তথ্য পৌঁছে দেওয়া এবং একটি সচেতন সমাজ গঠনে ভূমিকা রাখা।');
                          setAboutUsEnInput('Bangla News 24 is one of Bangladesh\'s leading modern and reliable online news portals. Uncompromising in our search for truth, we deliver real-time updates on national and international affairs, politics, economy, technology, entertainment, and sports.\n\nOur mission is to deliver accurate information to readers through objective and neutral journalism and contribute to building a conscious society.');
                        }}
                        className="text-[11px] text-red-600 hover:text-red-700 font-bold bg-white hover:bg-red-50 px-2.5 py-1 rounded-lg border border-red-200 transition shrink-0"
                      >
                        ⚡ {language === 'bn' ? 'ডিফল্ট তথ্য রিসেট' : 'Reset Default Sample'}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-gray-800 flex items-center justify-between">
                          <span>{language === 'bn' ? 'বাংলা বিবরণ' : 'Bangla Text'}</span>
                          <span className="text-[10px] text-gray-400 font-mono">{aboutUsBnInput.length} chars</span>
                        </label>
                        <textarea
                          rows={6}
                          value={aboutUsBnInput}
                          onChange={(e) => setAboutUsBnInput(e.target.value)}
                          placeholder="বাংলা ভাষায় লিখুন..."
                          className="w-full bg-white border border-gray-300 rounded-xl p-3 text-xs font-medium focus:outline-none focus:border-red-600 leading-relaxed"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-gray-800 flex items-center justify-between">
                          <span>{language === 'bn' ? 'ইংরাজি বিবরণ (English)' : 'English Text'}</span>
                          <span className="text-[10px] text-gray-400 font-mono">{aboutUsEnInput.length} chars</span>
                        </label>
                        <textarea
                          rows={6}
                          value={aboutUsEnInput}
                          onChange={(e) => setAboutUsEnInput(e.target.value)}
                          placeholder="Enter English description..."
                          className="w-full bg-white border border-gray-300 rounded-xl p-3 text-xs font-medium focus:outline-none focus:border-red-600 leading-relaxed"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Sub-tab 2: Privacy Policy */}
                {activeStaticSubTab === 'privacy' && (
                  <div className="space-y-4 bg-gray-50/70 p-4 rounded-2xl border border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-800 flex items-center space-x-1.5">
                        <span className="w-2 h-2 rounded-full bg-red-600"></span>
                        <span>{language === 'bn' ? 'গোপনীয়তা নীতি (Privacy Policy) কন্টেন্ট' : 'Privacy Policy Content'}</span>
                      </span>

                      <button
                        type="button"
                        onClick={() => {
                          setPrivacyPolicyBnInput('আমরা আপনার গোপনীয়তাকে সর্বোচ্চ গুরুত্ব দিই। আমাদের ওয়েবসাইটে ভিজিট করার সময় সংগৃহীত তথ্য কেবল ব্যবহারকারীর অভিজ্ঞতা উন্নত করার জন্য ব্যবহৃত হয়। কোনো অবস্থাতেই তৃতীয় পক্ষের কাছে আপনার ব্যক্তিগত তথ্য বিক্রি বা শেয়ার করা হয় না。\n\nআমরা কুকি ব্যবহার করি সাইটের সঠিক পরিবেশন নিশ্চিত করতে এবং কাস্টমাইজড সংবাদ প্রদান করতে।');
                          setPrivacyPolicyEnInput('We value your privacy immensely. Information collected while visiting our website is used solely to enhance user experience and is never sold or shared with third parties.\n\nWe use standard browser cookies to ensure proper site performance and tailored news content.');
                        }}
                        className="text-[11px] text-red-600 hover:text-red-700 font-bold bg-white hover:bg-red-50 px-2.5 py-1 rounded-lg border border-red-200 transition shrink-0"
                      >
                        ⚡ {language === 'bn' ? 'ডিফল্ট তথ্য রিসেট' : 'Reset Default Sample'}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-gray-800 flex items-center justify-between">
                          <span>{language === 'bn' ? 'বাংলা প্রাইভেসি পলিসি' : 'Bangla Privacy Policy'}</span>
                          <span className="text-[10px] text-gray-400 font-mono">{privacyPolicyBnInput.length} chars</span>
                        </label>
                        <textarea
                          rows={6}
                          value={privacyPolicyBnInput}
                          onChange={(e) => setPrivacyPolicyBnInput(e.target.value)}
                          placeholder="বাংলা প্রাইভেসি পলিসি লিখুন..."
                          className="w-full bg-white border border-gray-300 rounded-xl p-3 text-xs font-medium focus:outline-none focus:border-red-600 leading-relaxed"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-gray-800 flex items-center justify-between">
                          <span>{language === 'bn' ? 'ইংরাজি প্রাইভেসি পলিসি' : 'English Privacy Policy'}</span>
                          <span className="text-[10px] text-gray-400 font-mono">{privacyPolicyEnInput.length} chars</span>
                        </label>
                        <textarea
                          rows={6}
                          value={privacyPolicyEnInput}
                          onChange={(e) => setPrivacyPolicyEnInput(e.target.value)}
                          placeholder="Enter English privacy policy..."
                          className="w-full bg-white border border-gray-300 rounded-xl p-3 text-xs font-medium focus:outline-none focus:border-red-600 leading-relaxed"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Sub-tab 3: Terms of Use */}
                {activeStaticSubTab === 'terms' && (
                  <div className="space-y-4 bg-gray-50/70 p-4 rounded-2xl border border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-800 flex items-center space-x-1.5">
                        <span className="w-2 h-2 rounded-full bg-red-600"></span>
                        <span>{language === 'bn' ? 'ব্যবহারের শর্তাবলী (Terms of Service) কন্টেন্ট' : 'Terms of Service Content'}</span>
                      </span>

                      <button
                        type="button"
                        onClick={() => {
                          setTermsBnInput('বাংলা নিউজ ২৪-এর সমস্ত কন্টেন্ট, টেক্সট, লোগো, এবং ছবি কপিরাইট আইনের আওতাধীন। পূর্বানুমতি ছাড়া এই পোর্টালের কোনো সংবাদ বা ছবি বাণিজ্যিক উদ্দেশ্যে পুনপ্রকাশ বা অনুলিপি করা আইনত দণ্ডনীয়।\n\nআমাদের পোর্টালে মন্তব্য করার সময় মার্জিত ভাষা ও সৌজন্য বজায় রাখার অনুরোধ করা হচ্ছে।');
                          setTermsEnInput('All content, logos, text, and images on Bangla News 24 are protected by copyright laws. Unauthorized commercial redistribution or duplication is strictly prohibited.\n\nUsers are requested to maintain respectful language when submitting public comments.');
                        }}
                        className="text-[11px] text-red-600 hover:text-red-700 font-bold bg-white hover:bg-red-50 px-2.5 py-1 rounded-lg border border-red-200 transition shrink-0"
                      >
                        ⚡ {language === 'bn' ? 'ডিফল্ট তথ্য রিসেট' : 'Reset Default Sample'}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-gray-800 flex items-center justify-between">
                          <span>{language === 'bn' ? 'বাংলা ব্যবহারের শর্তাবলী' : 'Bangla Terms'}</span>
                          <span className="text-[10px] text-gray-400 font-mono">{termsBnInput.length} chars</span>
                        </label>
                        <textarea
                          rows={6}
                          value={termsBnInput}
                          onChange={(e) => setTermsBnInput(e.target.value)}
                          placeholder="বাংলা শর্তাবলী লিখুন..."
                          className="w-full bg-white border border-gray-300 rounded-xl p-3 text-xs font-medium focus:outline-none focus:border-red-600 leading-relaxed"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-gray-800 flex items-center justify-between">
                          <span>{language === 'bn' ? 'ইংরাজি ব্যবহারের শর্তাবলী' : 'English Terms'}</span>
                          <span className="text-[10px] text-gray-400 font-mono">{termsEnInput.length} chars</span>
                        </label>
                        <textarea
                          rows={6}
                          value={termsEnInput}
                          onChange={(e) => setTermsEnInput(e.target.value)}
                          placeholder="Enter English terms..."
                          className="w-full bg-white border border-gray-300 rounded-xl p-3 text-xs font-medium focus:outline-none focus:border-red-600 leading-relaxed"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Sub-tab 4: Editorial Policy */}
                {activeStaticSubTab === 'editorial' && (
                  <div className="space-y-4 bg-gray-50/70 p-4 rounded-2xl border border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-800 flex items-center space-x-1.5">
                        <span className="w-2 h-2 rounded-full bg-red-600"></span>
                        <span>{language === 'bn' ? 'সম্পাদনা নীতি (Editorial Policy) কন্টেন্ট' : 'Editorial Policy Content'}</span>
                      </span>

                      <button
                        type="button"
                        onClick={() => {
                          setEditorialPolicyBnInput('আমরা সংবাদ পরিবেশনে নির্ভুলতা, ভারসাম্য এবং সত্যনিষ্ঠাকে প্রধান অগ্রাধিকার দেই। কোনো পক্ষপাতিত্ব ছাড়াই ঘটনার পেছনের সত্য তুলে ধরাই আমাদের মূল অঙ্গীকার।\n\nযেকোনো সংবাদের বস্তুনিষ্ঠতা বজায় রাখতে আমরা একাধিক বিশ্বস্ত সূত্র থেকে তথ্য যাচাই নিশ্চিত করি।');
                          setEditorialPolicyEnInput('We prioritize accuracy, balance, and integrity in reporting. Our core commitment is to uncover the truth behind events without bias.\n\nTo maintain journalistic integrity, we strictly verify information from multiple reliable sources before publication.');
                        }}
                        className="text-[11px] text-red-600 hover:text-red-700 font-bold bg-white hover:bg-red-50 px-2.5 py-1 rounded-lg border border-red-200 transition shrink-0"
                      >
                        ⚡ {language === 'bn' ? 'ডিফল্ট তথ্য রিসেট' : 'Reset Default Sample'}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-gray-800 flex items-center justify-between">
                          <span>{language === 'bn' ? 'বাংলা সম্পাদনা নীতি' : 'Bangla Editorial Policy'}</span>
                          <span className="text-[10px] text-gray-400 font-mono">{editorialPolicyBnInput.length} chars</span>
                        </label>
                        <textarea
                          rows={6}
                          value={editorialPolicyBnInput}
                          onChange={(e) => setEditorialPolicyBnInput(e.target.value)}
                          placeholder="বাংলা সম্পাদনা নীতি লিখুন..."
                          className="w-full bg-white border border-gray-300 rounded-xl p-3 text-xs font-medium focus:outline-none focus:border-red-600 leading-relaxed"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-gray-800 flex items-center justify-between">
                          <span>{language === 'bn' ? 'ইংরাজি সম্পাদনা নীতি' : 'English Editorial Policy'}</span>
                          <span className="text-[10px] text-gray-400 font-mono">{editorialPolicyEnInput.length} chars</span>
                        </label>
                        <textarea
                          rows={6}
                          value={editorialPolicyEnInput}
                          onChange={(e) => setEditorialPolicyEnInput(e.target.value)}
                          placeholder="Enter English editorial policy..."
                          className="w-full bg-white border border-gray-300 rounded-xl p-3 text-xs font-medium focus:outline-none focus:border-red-600 leading-relaxed"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Copyright & Developer Credit Inputs */}
              <div className="pt-4 border-t border-gray-200">
                <h4 className="text-base font-extrabold text-gray-900 mb-3 flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-red-600"></span>
                  <span>{language === 'bn' ? 'ফুটার কপিরাইট ও ক্রেডিট সেটিংস' : 'Footer Copyright & Credit Settings'}</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      {language === 'bn' ? 'বাংলা কপিরাইট বার্তা' : 'Bangla Copyright Text'}
                    </label>
                    <input
                      type="text"
                      value={copyrightTextBnInput}
                      onChange={(e) => {
                        setCopyrightTextBnInput(e.target.value);
                      }}
                      placeholder="সর্বস্বত্ব সংরক্ষিত।"
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-red-600"
                    />
                    <p className="text-[11px] text-gray-500 mt-1">
                      {language === 'bn' 
                        ? 'টিপস: আপনি "সর্বস্বত্ব সংরক্ষিত।" অথবা "© {year} {siteName}। সর্বস্বত্ব সংরক্ষিত।" ব্যবহার করতে পারেন।' 
                        : 'Tip: You can enter "সর্বস্বত্ব সংরক্ষিত।" or full string with placeholders "{year}" and "{siteName}".'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      {language === 'bn' ? 'English Copyright Text' : 'English Copyright Text'}
                    </label>
                    <input
                      type="text"
                      value={copyrightTextEnInput}
                      onChange={(e) => {
                        setCopyrightTextEnInput(e.target.value);
                        setCopyrightTextInput(e.target.value);
                      }}
                      placeholder="All rights reserved."
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-red-600"
                    />
                    <p className="text-[11px] text-gray-500 mt-1">
                      {language === 'bn' 
                        ? 'টিপস: "All rights reserved." অথবা "© {year} {siteName}. All rights reserved."' 
                        : 'Tip: "All rights reserved." or "© {year} {siteName}. All rights reserved."'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      {language === 'bn' ? 'ডেভেলপার ক্রেডিট প্রিফিক্স টেক্সট' : 'Developer Credit Prefix Text'}
                    </label>
                    <input
                      type="text"
                      value={developerPrefixTextInput}
                      onChange={(e) => setDeveloperPrefixTextInput(e.target.value)}
                      placeholder="Designed & Developed with Professional Standards for"
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-red-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      {language === 'bn' ? 'ডেভেলপার নাম / ব্র্যান্ড ক্রেডিট' : 'Developer Name / Brand Credit'}
                    </label>
                    <input
                      type="text"
                      value={developerCreditInput}
                      onChange={(e) => setDeveloperCreditInput(e.target.value)}
                      placeholder="Bangla Media Group"
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-red-600"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      {language === 'bn' ? 'ডেভেলপার ওয়েবসাইট লিংক' : 'Developer Website URL'}
                    </label>
                    <input
                      type="url"
                      value={developerWebsiteUrlInput}
                      onChange={(e) => setDeveloperWebsiteUrlInput(e.target.value)}
                      placeholder="https://example.com"
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-red-600"
                    />
                  </div>
                </div>

                {/* Live Preview Box */}
                <div className="mt-4 p-4 bg-gray-900 text-gray-300 rounded-xl border border-gray-800 text-xs">
                  <div className="text-[11px] font-bold text-red-400 uppercase tracking-wider mb-2">
                    {language === 'bn' ? 'ফুটার লাইভ প্রিভিউ (Live Footer Copyright Preview)' : 'Live Footer Copyright Preview'}
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-200 font-medium">
                      <span className="text-gray-500 font-mono mr-2">[BN]</span>
                      {(() => {
                        const yr = '২০২৬';
                        const sName = siteNameBnInput || 'স্পিড নিউজ ২৪';
                        const raw = copyrightTextBnInput || 'সর্বস্বত্ব সংরক্ষিত।';
                        const proc = raw.replace(/\{year\}/g, yr).replace(/\{siteName\}/g, sName);
                        return /^[\s]*[©®]|কপিরাইট|Copyright/i.test(proc) ? proc : `© ${yr} ${sName}। ${proc}`;
                      })()}
                    </p>
                    <p className="text-gray-400">
                      <span className="text-gray-500 font-mono mr-2">[EN]</span>
                      {(() => {
                        const yr = '2026';
                        const sName = siteNameEnInput || 'Speed News 24';
                        const raw = copyrightTextEnInput || copyrightTextInput || 'All rights reserved.';
                        const proc = raw.replace(/\{year\}/g, yr).replace(/\{siteName\}/g, sName);
                        return /^[\s]*[©®]|কপিরাইট|Copyright/i.test(proc) ? proc : `© ${yr} ${sName}. ${proc}`;
                      })()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl transition shadow"
                >
                  {language === 'bn' ? 'সেটিংস সংরক্ষণ করুন' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
              {language === 'bn' ? 'অ্যাডমিন ড্যাশবোর্ড ওভারভিউ' : 'Dashboard Overview'}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-gray-400 uppercase">Total Articles</span>
                  <FileText className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-3xl font-black text-gray-900">{articles.length}</h3>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-gray-400 uppercase">Total Readers</span>
                  <Eye className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-3xl font-black text-gray-900">{totalViews.toLocaleString()}</h3>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-gray-400 uppercase">Ad Requests</span>
                  <Megaphone className="w-6 h-6 text-yellow-600" />
                </div>
                <h3 className="text-3xl font-black text-gray-900">{adRequests.length}</h3>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-gray-400 uppercase">User Submissions</span>
                  <Send className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-3xl font-black text-gray-900">{submittedNews.length}</h3>
              </div>
            </div>
          </div>
        )}

        {/* News Management Tab */}
        {activeTab === 'news' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-extrabold text-gray-900">
                {language === 'bn' ? 'সংবাদ ব্যবস্থাপনা' : 'News Management'}
              </h1>
              <button
                onClick={() => setShowAddArticleModal(true)}
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2.5 rounded-xl transition flex items-center space-x-2 text-sm shadow"
              >
                <Plus className="w-4 h-4" />
                <span>{language === 'bn' ? 'নতুন সংবাদ যোগ করুন' : 'Add New Article'}</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-600 uppercase">
                      <th className="p-4">Title</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Reporter</th>
                      <th className="p-4">Views</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {articles.map(art => (
                      <tr key={art.id} className="hover:bg-gray-50 transition">
                        <td className="p-4 font-semibold text-gray-900 max-w-xs truncate">
                          {language === 'bn' ? art.titleBn : art.titleEn}
                        </td>
                        <td className="p-4 text-gray-600">
                          {categories.find(c => c.id === art.categoryId)?.nameBn || art.categoryId}
                        </td>
                        <td className="p-4 text-gray-600">{art.reporterName}</td>
                        <td className="p-4 text-gray-600">
                          <div className="flex items-center space-x-2">
                            <div className="inline-flex items-center space-x-1.5 bg-blue-50 border border-blue-200 text-blue-900 px-2.5 py-1 rounded-lg">
                              <Eye className="w-3.5 h-3.5 text-blue-600" />
                              <span className="font-bold text-sm">{art.viewsCount.toLocaleString(language === 'bn' ? 'bn-BD' : 'en-US')}</span>
                              <span className="text-[11px] font-semibold text-blue-600">({language === 'bn' ? 'আসল ভিউ' : 'Original Views'})</span>
                            </div>
                            {onUpdateArticleViews && (
                              <div className="flex items-center space-x-1">
                                <button
                                  onClick={() => {
                                    const val = prompt(language === 'bn' ? 'আসল পাঠক সংখ্যা (Original Views Count) লিখুন:' : 'Enter original views count:', String(art.viewsCount));
                                    if (val !== null && !isNaN(Number(val))) {
                                      onUpdateArticleViews(art.id, Math.max(0, Number(val)));
                                    }
                                  }}
                                  className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 p-1.5 rounded-lg transition"
                                  title={language === 'bn' ? 'আসল পাঠক সংখ্যা সম্পাদনা করুন' : 'Edit Original Views'}
                                >
                                  <Edit className="w-3.5 h-3.5 text-red-600" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (window.confirm(language === 'bn' ? 'আপনি কি এই সংবাদের পাঠক সংখ্যা শূন্য (0) এ রিসেট করতে চান?' : 'Are you sure you want to reset views count to 0?')) {
                                      onUpdateArticleViews(art.id, 0);
                                    }
                                  }}
                                  className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 p-1.5 rounded-lg transition"
                                  title={language === 'bn' ? 'পাঠক সংখ্যা রিসেট করুন (0)' : 'Reset Views Count (0)'}
                                >
                                  <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => onDeleteArticle(art.id)}
                            className="p-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition"
                            title="Delete Article"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <h1 className="text-2xl font-extrabold text-gray-900">
              {language === 'bn' ? 'বিভাগ ব্যবস্থাপনা' : 'Category Management'}
            </h1>

            <form onSubmit={handleCategorySubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4">
              <input
                type="text"
                placeholder="Category Name (Bangla)"
                required
                value={newCatBn}
                onChange={(e) => setNewCatBn(e.target.value)}
                className="flex-1 bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-600"
              />
              <input
                type="text"
                placeholder="Category Name (English)"
                required
                value={newCatEn}
                onChange={(e) => setNewCatEn(e.target.value)}
                className="flex-1 bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-600"
              />
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition shadow"
              >
                {language === 'bn' ? 'যোগ করুন' : 'Add Category'}
              </button>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {categories.map(cat => (
                <div key={cat.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-gray-900">{cat.nameBn}</h4>
                    <span className="text-xs text-gray-500">{cat.nameEn}</span>
                  </div>
                  <button
                    onClick={() => onDeleteCategory(cat.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ads Management Tab (Banner Ads & Requests) */}
        {activeTab === 'ads' && (
          <div className="space-y-6">
            
            {/* Top Navigation Sub-Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
              <div>
                <h1 className="text-2xl font-extrabold text-gray-900 flex items-center space-x-2">
                  <Megaphone className="w-6 h-6 text-red-600" />
                  <span>{language === 'bn' ? 'বিজ্ঞাপন ব্যবস্থাপনা' : 'Ad Management System'}</span>
                </h1>
                <p className="text-xs text-gray-500 mt-0.5">
                  {language === 'bn' 
                    ? 'সাইটের ব্যানার বিজ্ঞাপন (GIF / JPG) যুক্ত ও পরিবর্তন করুন এবং আবেদনপত্রসমূহ নিয়ন্ত্রণ করুন।' 
                    : 'Manage live GIF/JPG banner ads and review incoming advertiser requests.'}
                </p>
              </div>

              {/* Sub-Tab Selector */}
              <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-xl text-xs font-bold">
                <button
                  onClick={() => setAdSubTab('banners')}
                  className={`px-4 py-2 rounded-lg transition flex items-center space-x-2 ${
                    adSubTab === 'banners'
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{language === 'bn' ? 'লাইভ ব্যানার বিজ্ঞাপন' : 'Live Banner Ads'}</span>
                </button>
                <button
                  onClick={() => setAdSubTab('requests')}
                  className={`px-4 py-2 rounded-lg transition flex items-center space-x-2 ${
                    adSubTab === 'requests'
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Megaphone className="w-4 h-4" />
                  <span>{language === 'bn' ? 'বিজ্ঞাপন আবেদনসমূহ' : 'Ad Requests'}</span>
                  {adRequests.filter(r => r.status === 'pending').length > 0 && (
                    <span className="bg-yellow-400 text-black px-1.5 py-0.5 rounded-full text-[10px]">
                      {adRequests.filter(r => r.status === 'pending').length}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Sub-Tab 1: Live Banner Ads (GIF / JPG / PNG) */}
            {adSubTab === 'banners' && (
              <div className="space-y-8">
                
                {/* Form & Guidelines Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  
                  {/* Left: Add Banner Ad Form (7 cols) */}
                  <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-5">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                      <h3 className="font-extrabold text-lg text-gray-900 flex items-center space-x-2">
                        <Plus className="w-5 h-5 text-red-600" />
                        <span>{language === 'bn' ? 'নতুন ব্যানার বিজ্ঞাপন যুক্ত করুন' : 'Add New Banner Advertisement'}</span>
                      </h3>
                      <span className="text-[11px] font-bold bg-yellow-100 text-yellow-800 px-2.5 py-1 rounded-full">
                        GIF / JPG / PNG Supported
                      </span>
                    </div>

                    {adSuccessMsg && (
                      <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-xl text-xs font-semibold flex items-center space-x-2 animate-fadeIn">
                        <Check className="w-4 h-4 text-green-600" />
                        <span>{language === 'bn' ? 'বিজ্ঞাপন সফলভাবে প্রকাশ করা হয়েছে!' : 'Banner ad published successfully!'}</span>
                      </div>
                    )}

                    <form onSubmit={handleBannerAdSubmit} className="space-y-4">
                      {/* Ad Title */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          {language === 'bn' ? 'বিজ্ঞাপনের শিরোনাম / ক্যাম্পেইনের নাম' : 'Ad Title / Campaign Name'} *
                        </label>
                        <input
                          type="text"
                          required
                          value={adTitle}
                          onChange={(e) => setAdTitle(e.target.value)}
                          placeholder="e.g. Summer Mega Discount Sale (Animated GIF)"
                          className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-600 font-medium"
                        />
                      </div>

                      {/* Ad Position Selection */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">
                            {language === 'bn' ? 'বিজ্ঞাপনের অবস্থান (Position)' : 'Ad Position'} *
                          </label>
                          <select
                            value={adPosition}
                            onChange={(e) => setAdPosition(e.target.value as any)}
                            className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-red-600 font-semibold text-gray-800"
                          >
                            <option value="header">📌 Top Header Banner (728×90 px | Mobile: 320×50 px)</option>
                            <option value="sidebar">📌 Right Sidebar Box (300×250 px Desktop & Mobile)</option>
                            <option value="inline">📌 In-Article Feed (750×200 px | Mobile: 320×100 px)</option>
                            <option value="footer">📌 Bottom Footer Banner (970×90 px | Mobile: 320×50 px)</option>
                          </select>
                        </div>

                        {/* Destination Link */}
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">
                            {language === 'bn' ? 'ল্যান্ডিং পেজ / ওয়েবসাইট লিংক' : 'Destination URL'} *
                          </label>
                          <input
                            type="url"
                            required
                            value={adLinkUrl}
                            onChange={(e) => setAdLinkUrl(e.target.value)}
                            placeholder="https://example.com/promo"
                            className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-red-600 font-medium"
                          />
                        </div>
                      </div>

                      {/* Dual Image Input Grid: Desktop vs Mobile */}
                      <div className="space-y-4 pt-1">
                        {/* 1. Desktop Ad Image */}
                        <div className="bg-blue-50/70 border border-blue-200 p-3.5 rounded-2xl space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-extrabold text-blue-900 flex items-center space-x-1.5">
                              <Monitor className="w-4 h-4 text-blue-600" />
                              <span>{language === 'bn' ? 'ডেক্সটপ ভার্সন বিজ্ঞাপন ছবি (Desktop Ad Image)' : 'Desktop Ad Image (GIF/JPG/PNG)'} *</span>
                            </label>
                            <span className="text-[10px] font-extrabold text-blue-800 bg-blue-100 px-2 py-0.5 rounded-md">
                              {adPosition === 'header' && '728×90 px'}
                              {adPosition === 'sidebar' && '300×250 px'}
                              {adPosition === 'inline' && '750×200 px'}
                              {adPosition === 'footer' && '970×90 px'}
                            </span>
                          </div>

                          <input
                            type="text"
                            required
                            value={adImageUrl}
                            onChange={(e) => setAdImageUrl(e.target.value)}
                            placeholder="https://... desktop image URL (.gif, .jpg, .png)"
                            className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-blue-600 font-medium"
                          />

                          <div className="flex flex-wrap items-center gap-2 pt-0.5">
                            <label className="bg-white hover:bg-gray-100 text-gray-800 font-bold text-xs px-3 py-1.5 rounded-lg border border-gray-300 cursor-pointer flex items-center space-x-1.5 transition shadow-xs">
                              <Upload className="w-3.5 h-3.5 text-blue-600" />
                              <span>{language === 'bn' ? 'ডেক্সটপ ফাইল আপলোড' : 'Upload Desktop File'}</span>
                              <input
                                type="file"
                                accept="image/gif, image/jpeg, image/png, image/webp"
                                onChange={handleDesktopImageFileUpload}
                                className="hidden"
                              />
                            </label>

                            <button
                              type="button"
                              onClick={() => setAdImageUrl('https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHp1MGdzdTZoOGdrZnIxbjFzbXV4MGZxeWVreTVzbnhrOHdtNHUyeCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0HlHFRb4PRI12cwU/giphy.gif')}
                              className="bg-yellow-50 hover:bg-yellow-100 text-yellow-800 border border-yellow-300 text-[11px] font-bold px-2 py-1 rounded-lg transition"
                            >
                              ⚡ Sample GIF
                            </button>

                            <button
                              type="button"
                              onClick={() => setAdImageUrl('https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?auto=format&fit=crop&w=1200&q=80')}
                              className="bg-blue-100 hover:bg-blue-200 text-blue-900 border border-blue-300 text-[11px] font-bold px-2 py-1 rounded-lg transition"
                            >
                              🖼️ Sample JPG
                            </button>
                          </div>
                        </div>

                        {/* 2. Mobile Ad Image */}
                        <div className="bg-emerald-50/70 border border-emerald-200 p-3.5 rounded-2xl space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-extrabold text-emerald-900 flex items-center space-x-1.5">
                              <Smartphone className="w-4 h-4 text-emerald-600" />
                              <span>{language === 'bn' ? 'মোবাইল ভার্সন বিজ্ঞাপন ছবি (Mobile Ad Image)' : 'Mobile Ad Image (Optional)'}</span>
                            </label>
                            <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                              {adPosition === 'header' && '320×50 px'}
                              {adPosition === 'sidebar' && '300×250 px'}
                              {adPosition === 'inline' && '320×100 px'}
                              {adPosition === 'footer' && '320×50 px'}
                            </span>
                          </div>

                          <p className="text-[11px] text-emerald-800 font-semibold">
                            {language === 'bn'
                              ? '💡 ফাঁকা রাখলে ডেক্সটপ ভার্সনের ছবিই মোবাইলে স্বয়ংক্রিয়ভাবে ব্যবহৃত হবে।'
                              : '💡 If left blank, desktop image will automatically be used on mobile devices.'}
                          </p>

                          <input
                            type="text"
                            value={adMobileImageUrl}
                            onChange={(e) => setAdMobileImageUrl(e.target.value)}
                            placeholder="https://... mobile image URL (.gif, .jpg, .png) - Optional"
                            className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-emerald-600 font-medium"
                          />

                          <div className="flex flex-wrap items-center gap-2 pt-0.5">
                            <label className="bg-white hover:bg-gray-100 text-gray-800 font-bold text-xs px-3 py-1.5 rounded-lg border border-gray-300 cursor-pointer flex items-center space-x-1.5 transition shadow-xs">
                              <Upload className="w-3.5 h-3.5 text-emerald-600" />
                              <span>{language === 'bn' ? 'মোবাইল ফাইল আপলোড' : 'Upload Mobile File'}</span>
                              <input
                                type="file"
                                accept="image/gif, image/jpeg, image/png, image/webp"
                                onChange={handleMobileImageFileUpload}
                                className="hidden"
                              />
                            </label>

                            <button
                              type="button"
                              onClick={() => setAdMobileImageUrl('https://images.unsplash.com/photo-1556742049-0a670f4a4591?auto=format&fit=crop&w=600&q=80')}
                              className="bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300 text-[11px] font-bold px-2 py-1 rounded-lg transition"
                            >
                              📱 Mobile Sample
                            </button>

                            {adMobileImageUrl && (
                              <button
                                type="button"
                                onClick={() => setAdMobileImageUrl('')}
                                className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-[11px] font-bold px-2 py-1 rounded-lg transition"
                              >
                                ✕ {language === 'bn' ? 'রিমুভ' : 'Clear'}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Active Toggle & Submit */}
                      <div className="flex items-center justify-between pt-2">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={adIsActive}
                            onChange={(e) => setAdIsActive(e.target.checked)}
                            className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                          />
                          <span className="text-xs font-bold text-gray-800">
                            {language === 'bn' ? 'বিজ্ঞাপনটি সরাসরি চালু রাখুন (Active)' : 'Keep Ad Active Immediately'}
                          </span>
                        </label>

                        <button
                          type="submit"
                          className="bg-red-600 hover:bg-red-700 text-white font-extrabold px-6 py-2.5 rounded-xl text-xs transition shadow-md flex items-center space-x-1.5"
                        >
                          <Plus className="w-4 h-4" />
                          <span>{language === 'bn' ? 'বিজ্ঞাপন যুক্ত করুন' : 'Publish Banner Ad'}</span>
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Right: Recommended Size Guidelines in PX (5 cols) */}
                  <div className="lg:col-span-5 bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6 rounded-2xl shadow-sm border border-gray-700 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center space-x-2 text-yellow-400 font-extrabold text-sm border-b border-gray-700 pb-2 mb-3">
                        <Info className="w-5 h-5 shrink-0" />
                        <span>{language === 'bn' ? 'বিজ্ঞাপনের পিক্সেল সাইজ নির্দেশিকা (Px Dimensions)' : 'Recommended Pixel Sizes (PX)'}</span>
                      </div>
                      
                      <p className="text-xs text-gray-300 mb-4 leading-relaxed">
                        {language === 'bn' 
                          ? 'ডেক্সটপ ও মোবাইল উভয় ভিউতে বিজ্ঞাপন সুন্দরভাবে প্রদর্শনের জন্য নিচের সাইজসমূহ অনুসরণ করুন:' 
                          : 'Adhere to these exact pixel dimensions for crystal clear display across Desktop and Mobile:'}
                      </p>

                      <div className="space-y-3 text-xs">
                        
                        {/* Header Guidelines */}
                        <div className={`p-2.5 rounded-xl border transition ${adPosition === 'header' ? 'bg-red-950/60 border-red-500' : 'bg-gray-800/60 border-gray-700'}`}>
                          <div className="flex items-center justify-between font-bold text-white mb-1">
                            <span className="flex items-center space-x-1 text-red-400">
                              <span>📌 Top Header Banner</span>
                            </span>
                            <span className="text-[10px] bg-red-900/80 text-red-200 px-2 py-0.5 rounded">GIF / JPG</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-300">
                            <div className="flex items-center space-x-1">
                              <Monitor className="w-3.5 h-3.5 text-blue-400" />
                              <span><strong>Desktop:</strong> 728×90 px</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Smartphone className="w-3.5 h-3.5 text-green-400" />
                              <span><strong>Mobile:</strong> 320×50 px</span>
                            </div>
                          </div>
                        </div>

                        {/* Sidebar Guidelines */}
                        <div className={`p-2.5 rounded-xl border transition ${adPosition === 'sidebar' ? 'bg-red-950/60 border-red-500' : 'bg-gray-800/60 border-gray-700'}`}>
                          <div className="flex items-center justify-between font-bold text-white mb-1">
                            <span className="text-yellow-400">📌 Right Sidebar Box</span>
                            <span className="text-[10px] bg-yellow-900/80 text-yellow-200 px-2 py-0.5 rounded">GIF / JPG</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-300">
                            <div className="flex items-center space-x-1">
                              <Monitor className="w-3.5 h-3.5 text-blue-400" />
                              <span><strong>Desktop:</strong> 300×250 px</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Smartphone className="w-3.5 h-3.5 text-green-400" />
                              <span><strong>Mobile:</strong> 300×250 px</span>
                            </div>
                          </div>
                        </div>

                        {/* Inline Guidelines */}
                        <div className={`p-2.5 rounded-xl border transition ${adPosition === 'inline' ? 'bg-red-950/60 border-red-500' : 'bg-gray-800/60 border-gray-700'}`}>
                          <div className="flex items-center justify-between font-bold text-white mb-1">
                            <span className="text-cyan-400">📌 In-Article Banner</span>
                            <span className="text-[10px] bg-cyan-900/80 text-cyan-200 px-2 py-0.5 rounded">GIF / JPG</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-300">
                            <div className="flex items-center space-x-1">
                              <Monitor className="w-3.5 h-3.5 text-blue-400" />
                              <span><strong>Desktop:</strong> 750×200 px</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Smartphone className="w-3.5 h-3.5 text-green-400" />
                              <span><strong>Mobile:</strong> 320×100 px</span>
                            </div>
                          </div>
                        </div>

                        {/* Footer Guidelines */}
                        <div className={`p-2.5 rounded-xl border transition ${adPosition === 'footer' ? 'bg-red-950/60 border-red-500' : 'bg-gray-800/60 border-gray-700'}`}>
                          <div className="flex items-center justify-between font-bold text-white mb-1">
                            <span className="text-purple-400">📌 Bottom Footer Banner</span>
                            <span className="text-[10px] bg-purple-900/80 text-purple-200 px-2 py-0.5 rounded">GIF / JPG</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-300">
                            <div className="flex items-center space-x-1">
                              <Monitor className="w-3.5 h-3.5 text-blue-400" />
                              <span><strong>Desktop:</strong> 970×90 px</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Smartphone className="w-3.5 h-3.5 text-green-400" />
                              <span><strong>Mobile:</strong> 320×50 px</span>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-700/60 text-[11px] text-gray-400 flex items-center justify-between">
                      <span>Format: .gif (Animated), .jpg, .png</span>
                      <span>Max size: 3MB</span>
                    </div>
                  </div>

                </div>

                {/* Live Preview Section */}
                {(adImageUrl || adMobileImageUrl) && (
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                      <h4 className="font-extrabold text-sm text-gray-900 flex items-center space-x-2">
                        <Eye className="w-4 h-4 text-red-600" />
                        <span>{language === 'bn' ? 'বিজ্ঞাপনের রিয়েল-টাইম লাইভ প্রিভিউ' : 'Live Ad Real-time Preview'}</span>
                      </h4>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-gray-500">
                          Position: <strong className="uppercase text-red-600">{adPosition}</strong>
                        </span>
                        <span className="text-[10px] font-extrabold bg-gray-900 text-yellow-400 px-2 py-0.5 rounded-full">
                          {adPosition === 'header' && '728×90 px (Desktop) / 320×50 px (Mobile)'}
                          {adPosition === 'sidebar' && '300×250 px (Desktop & Mobile)'}
                          {adPosition === 'inline' && '750×200 px (Desktop) / 320×100 px (Mobile)'}
                          {adPosition === 'footer' && '970×90 px (Desktop) / 320×50 px (Mobile)'}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                      {/* Desktop Preview Container */}
                      <div className="space-y-1.5">
                        <span className="text-xs font-bold text-gray-700 flex items-center justify-between">
                          <span className="flex items-center space-x-1.5">
                            <Monitor className="w-3.5 h-3.5 text-blue-600" />
                            <span className="font-extrabold text-blue-900">Desktop View</span>
                          </span>
                          <span className="text-[10px] text-gray-400 font-mono">
                            {adPosition === 'header' && '728 × 90 px'}
                            {adPosition === 'sidebar' && '300 × 250 px'}
                            {adPosition === 'inline' && '750 × 200 px'}
                            {adPosition === 'footer' && '970 × 90 px'}
                          </span>
                        </span>
                        <div className="border border-blue-200 rounded-xl overflow-hidden flex items-center justify-center h-[110px] w-full bg-gray-900/90">
                          {adImageUrl ? (
                            <img
                              src={adImageUrl}
                              alt="Live Desktop Ad Preview"
                              className="w-full h-full object-cover shadow-sm"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <span className="text-xs text-gray-500 italic">No Desktop Image Provided</span>
                          )}
                        </div>
                      </div>

                      {/* Mobile Preview Container */}
                      <div className="space-y-1.5">
                        <span className="text-xs font-bold text-gray-700 flex items-center justify-between">
                          <span className="flex items-center space-x-1.5">
                            <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="font-extrabold text-emerald-900">Mobile View</span>
                            {adMobileImageUrl ? (
                              <span className="text-[9px] bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.2 rounded">Custom Asset</span>
                            ) : (
                              <span className="text-[9px] bg-gray-100 text-gray-600 font-bold px-1.5 py-0.2 rounded">Desktop Fallback</span>
                            )}
                          </span>
                          <span className="text-[10px] text-gray-400 font-mono">
                            {adPosition === 'header' && '320 × 50 px'}
                            {adPosition === 'sidebar' && '300 × 250 px'}
                            {adPosition === 'inline' && '320 × 100 px'}
                            {adPosition === 'footer' && '320 × 50 px'}
                          </span>
                        </span>
                        <div className="border border-emerald-200 rounded-xl overflow-hidden flex items-center justify-center h-[110px] max-w-[320px] mx-auto w-full bg-gray-900/90">
                          <img
                            src={adMobileImageUrl || adImageUrl}
                            alt="Live Mobile Ad Preview"
                            className="w-full h-full object-cover shadow-sm"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Table of Active / Inactive Banner Ads */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                    <div>
                      <h3 className="font-extrabold text-lg text-gray-900">
                        {language === 'bn' ? 'সকল ব্যানার বিজ্ঞাপন তালিকা' : 'Active & Saved Banner Ads'}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {language === 'bn' ? 'চলমান বিজ্ঞাপন বন্ধ বা অন করতে টগল করুন।' : 'Toggle status or delete saved ads.'}
                      </p>
                    </div>
                    <span className="text-xs font-bold bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                      Total: {bannerAds.length}
                    </span>
                  </div>

                  {bannerAds.length === 0 ? (
                    <div className="p-10 text-center text-gray-500 space-y-2">
                      <Image className="w-10 h-10 mx-auto text-gray-300" />
                      <p className="font-semibold">{language === 'bn' ? 'কোনো ব্যানার বিজ্ঞাপন সক্রিয় নেই।' : 'No active banner ads created yet.'}</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse min-w-[750px]">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-600 uppercase">
                            <th className="p-4">Ad Images (Desktop & Mobile)</th>
                            <th className="p-4">Campaign Title</th>
                            <th className="p-4">Position</th>
                            <th className="p-4">Dimensions (px)</th>
                            <th className="p-4">Target Link</th>
                            <th className="p-4 text-center">Status</th>
                            <th className="p-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                          {bannerAds.map((ad) => {
                            const isGif = (ad.imageUrl + (ad.mobileImageUrl || '')).toLowerCase().includes('.gif');
                            return (
                              <tr key={ad.id} className="hover:bg-gray-50 transition">
                                <td className="p-4">
                                  <div className="flex items-center space-x-2">
                                    {/* Desktop Thumbnail */}
                                    <div className="relative w-20 h-12 bg-gray-900/90 rounded-lg overflow-hidden border border-blue-300 flex items-center justify-center p-0.5 shrink-0" title="Desktop Image">
                                      <img
                                        src={ad.imageUrl}
                                        alt={ad.title}
                                        className="w-full h-full object-contain"
                                      />
                                      <span className="absolute bottom-0.5 right-0.5 bg-blue-600 text-white font-extrabold text-[7px] px-1 rounded shadow">
                                        🖥️
                                      </span>
                                      {isGif && (
                                        <span className="absolute top-0.5 left-0.5 bg-yellow-400 text-black font-extrabold text-[7px] px-0.5 rounded shadow">
                                          GIF
                                        </span>
                                      )}
                                    </div>

                                    {/* Mobile Thumbnail */}
                                    <div className="relative w-14 h-12 bg-gray-900/90 rounded-lg overflow-hidden border border-emerald-300 flex items-center justify-center p-0.5 shrink-0" title={ad.mobileImageUrl ? "Custom Mobile Image" : "Desktop Image Used as Fallback"}>
                                      <img
                                        src={ad.mobileImageUrl || ad.imageUrl}
                                        alt={`${ad.title} mobile`}
                                        className="w-full h-full object-contain"
                                      />
                                      <span className="absolute bottom-0.5 right-0.5 bg-emerald-600 text-white font-extrabold text-[7px] px-1 rounded shadow">
                                        📱 {ad.mobileImageUrl ? 'Custom' : 'Auto'}
                                      </span>
                                    </div>
                                  </div>
                                </td>
                                <td className="p-4 font-bold text-gray-900 max-w-xs">{ad.title}</td>
                                <td className="p-4">
                                  <span className="capitalize text-xs font-extrabold bg-red-50 text-red-700 px-2.5 py-1 rounded-full border border-red-200">
                                    {ad.position}
                                  </span>
                                </td>
                                <td className="p-4 text-xs font-mono font-bold text-gray-700">
                                  {ad.position === 'header' && (
                                    <div className="space-y-0.5">
                                      <span className="block text-blue-600">🖥️ 728×90 px</span>
                                      <span className="block text-green-600">📱 320×50 px</span>
                                    </div>
                                  )}
                                  {ad.position === 'sidebar' && (
                                    <span className="text-yellow-700">🖥️📱 300×250 px</span>
                                  )}
                                  {ad.position === 'inline' && (
                                    <div className="space-y-0.5">
                                      <span className="block text-blue-600">🖥️ 750×200 px</span>
                                      <span className="block text-green-600">📱 320×100 px</span>
                                    </div>
                                  )}
                                  {ad.position === 'footer' && (
                                    <div className="space-y-0.5">
                                      <span className="block text-blue-600">🖥️ 970×90 px</span>
                                      <span className="block text-green-600">📱 320×50 px</span>
                                    </div>
                                  )}
                                </td>
                                <td className="p-4 text-xs">
                                  <a
                                    href={ad.linkUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-blue-600 hover:underline flex items-center space-x-1 max-w-[180px] truncate"
                                  >
                                    <LinkIcon className="w-3 h-3 shrink-0" />
                                    <span className="truncate">{ad.linkUrl}</span>
                                  </a>
                                </td>
                                <td className="p-4 text-center">
                                  <button
                                    onClick={() => onToggleBannerAd?.(ad.id)}
                                    className={`px-3 py-1 rounded-full text-xs font-extrabold transition shadow-sm ${
                                      ad.isActive
                                        ? 'bg-green-100 text-green-700 border border-green-300 hover:bg-green-200'
                                        : 'bg-gray-100 text-gray-500 border border-gray-300 hover:bg-gray-200'
                                    }`}
                                  >
                                    {ad.isActive ? '🟢 Active' : '⚪ Inactive'}
                                  </button>
                                </td>
                                <td className="p-4 text-right">
                                  {onDeleteBannerAd && (
                                    <button
                                      onClick={() => onDeleteBannerAd(ad.id)}
                                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                      title="Delete Ad"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* Sub-Tab 2: Advertiser Requests List */}
            {adSubTab === 'requests' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-extrabold text-gray-900">
                      {language === 'bn' ? 'বিজ্ঞাপন আবেদনসমূহ' : 'Advertiser Applications'}
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {language === 'bn' ? 'আবেদনসমূহ পর্যালোচনা করে অনুমোদন বা বাতিল করুন।' : 'Review client ad proposals and approve/reject.'}
                    </p>
                  </div>

                  {/* Status Filter Buttons */}
                  <div className="flex items-center space-x-1.5 bg-white p-1.5 rounded-xl border border-gray-200 shadow-sm text-xs font-bold">
                    {(['all', 'pending', 'approved', 'rejected'] as const).map(status => (
                      <button
                        key={status}
                        onClick={() => setAdFilter(status)}
                        className={`px-3 py-1.5 rounded-lg capitalize transition ${
                          adFilter === status
                            ? 'bg-red-600 text-white shadow-sm'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {language === 'bn' ? (
                          status === 'all' ? 'সব' :
                          status === 'pending' ? 'অপেক্ষমাণ' :
                          status === 'approved' ? 'অনুমোদিত' : 'প্রত্যাখ্যাত'
                        ) : status}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  {adRequests.length === 0 ? (
                    <div className="p-12 text-center text-gray-500 space-y-2">
                      <Megaphone className="w-10 h-10 mx-auto text-gray-300" />
                      <p className="font-semibold">{language === 'bn' ? 'কোনো বিজ্ঞাপনের আবেদন পাওয়া যায়নি।' : 'No ad requests found.'}</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse min-w-[700px]">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-600 uppercase">
                            <th className="p-4">Company</th>
                            <th className="p-4">Contact Person</th>
                            <th className="p-4">Phone / Email</th>
                            <th className="p-4">Budget</th>
                            <th className="p-4">Message</th>
                            <th className="p-4 text-center">Status</th>
                            <th className="p-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                          {adRequests
                            .filter(ad => adFilter === 'all' ? true : ad.status === adFilter)
                            .map(ad => (
                              <tr key={ad.id} className="hover:bg-gray-50 transition">
                                <td className="p-4 font-bold text-gray-900">
                                  {ad.companyName}
                                  {ad.website && (
                                    <a 
                                      href={ad.website} 
                                      target="_blank" 
                                      rel="noreferrer" 
                                      className="block text-xs font-normal text-blue-600 hover:underline mt-0.5"
                                    >
                                      {ad.website}
                                    </a>
                                  )}
                                </td>
                                <td className="p-4 text-gray-700 font-medium">{ad.personName}</td>
                                <td className="p-4 text-gray-600 text-xs space-y-0.5">
                                  <div className="font-semibold text-gray-800">{ad.phone}</div>
                                  <div>{ad.email}</div>
                                </td>
                                <td className="p-4 text-red-600 font-bold">{ad.budget}</td>
                                <td className="p-4 text-gray-600 text-xs max-w-xs truncate" title={ad.message}>{ad.message}</td>
                                <td className="p-4 text-center">
                                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${
                                    ad.status === 'approved'
                                      ? 'bg-green-50 text-green-700 border-green-200'
                                      : ad.status === 'rejected'
                                      ? 'bg-red-50 text-red-700 border-red-200'
                                      : ad.status === 'reviewed'
                                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                                      : 'bg-amber-50 text-amber-700 border-amber-200'
                                  }`}>
                                    {ad.status === 'approved' && <CheckCircle className="w-3 h-3 mr-1 text-green-600" />}
                                    {ad.status === 'rejected' && <XCircle className="w-3 h-3 mr-1 text-red-600" />}
                                    {language === 'bn' ? (
                                      ad.status === 'approved' ? 'অনুমোদিত' :
                                      ad.status === 'rejected' ? 'প্রত্যাখ্যাত' :
                                      ad.status === 'reviewed' ? 'পর্যালোচিত' : 'অপেক্ষমাণ'
                                    ) : ad.status.toUpperCase()}
                                  </span>
                                </td>
                                <td className="p-4 text-right">
                                  <div className="flex items-center justify-end space-x-2">
                                    <button
                                      onClick={() => onUpdateAdStatus?.(ad.id, 'approved')}
                                      disabled={ad.status === 'approved'}
                                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1 transition shadow-sm ${
                                        ad.status === 'approved'
                                          ? 'bg-green-100 text-green-400 cursor-not-allowed opacity-60'
                                          : 'bg-green-600 text-white hover:bg-green-700'
                                      }`}
                                      title={language === 'bn' ? 'অনুমোদন করুন' : 'Approve Ad'}
                                    >
                                      <CheckCircle className="w-3.5 h-3.5" />
                                      <span>{language === 'bn' ? 'অনুমোদন' : 'Approve'}</span>
                                    </button>

                                    <button
                                      onClick={() => onUpdateAdStatus?.(ad.id, 'rejected')}
                                      disabled={ad.status === 'rejected'}
                                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1 transition shadow-sm ${
                                        ad.status === 'rejected'
                                          ? 'bg-red-100 text-red-400 cursor-not-allowed opacity-60'
                                          : 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-600 hover:text-white'
                                      }`}
                                      title={language === 'bn' ? 'প্রত্যাখ্যান করুন' : 'Reject Ad'}
                                    >
                                      <XCircle className="w-3.5 h-3.5" />
                                      <span>{language === 'bn' ? 'প্রত্যাখ্যান' : 'Reject'}</span>
                                    </button>

                                    {onDeleteAdRequest && (
                                      <button
                                        onClick={() => onDeleteAdRequest(ad.id)}
                                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                        title="Delete Request"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        )}

        {/* Submissions Tab */}
        {activeTab === 'submissions' && (
          <div className="space-y-6">
            <h1 className="text-2xl font-extrabold text-gray-900">
              {language === 'bn' ? 'প্রেরিত সংবাদসমূহ' : 'User News Submissions'}
            </h1>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              {submittedNews.length === 0 ? (
                <p className="p-8 text-center text-gray-500">No submitted news found.</p>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-600 uppercase">
                      <th className="p-4">Headline</th>
                      <th className="p-4">Reporter</th>
                      <th className="p-4">Location</th>
                      <th className="p-4">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {submittedNews.map(sub => (
                      <tr key={sub.id} className="hover:bg-gray-50 transition">
                        <td className="p-4 font-bold text-gray-900">{sub.headline}</td>
                        <td className="p-4 text-gray-700">{sub.reporterName} ({sub.phone})</td>
                        <td className="p-4 text-gray-600">{sub.location}</td>
                        <td className="p-4 text-gray-600 max-w-xs truncate">{sub.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* Moderator Management Tab */}
        {activeTab === 'moderators' && (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-gray-900 via-gray-900 to-red-950 p-6 md:p-8 rounded-3xl text-white shadow-xl">
              <div>
                <h1 className="text-2xl md:text-3xl font-black flex items-center space-x-3">
                  <Users className="w-8 h-8 text-red-500" />
                  <span>{language === 'bn' ? 'মডারেটর তথ্য ও অ্যাকাউন্ট ব্যবস্থাপনা' : 'Moderator & Staff Management'}</span>
                </h1>
                <p className="text-xs text-gray-300 mt-1">
                  {language === 'bn' 
                    ? 'নতুন মডারেটর যুক্ত করুন, পারমিশন নির্ধারণ করুন এবং ব্যান/আনব্যান ম্যানেজ করুন (ফায়ারবেস ডাটাবেসে সংরক্ষিত)'
                    : 'Add moderators with detailed info, custom permissions & ban accounts in Firebase'}
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 flex items-center space-x-3 self-start md:self-auto">
                <ShieldCheck className="w-6 h-6 text-green-400 shrink-0" />
                <div>
                  <p className="text-[10px] text-gray-300 font-bold uppercase tracking-wider">{language === 'bn' ? 'ফায়ারবেস মডারেটর:' : 'Firebase Staff:'}</p>
                  <p className="text-xl font-black text-white">{moderators.length} <span className="text-xs font-normal text-gray-300">জন</span></p>
                </div>
              </div>
            </div>

            {modSuccessMsg && (
              <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-2xl flex items-center space-x-3 text-sm font-bold shadow-sm">
                <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
                <span>{modSuccessMsg}</span>
              </div>
            )}

            {modErrorMsg && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-2xl flex items-center space-x-3 text-sm font-bold shadow-sm">
                <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
                <span>{modErrorMsg}</span>
              </div>
            )}

            {/* Form: Add or Edit Moderator */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-200 space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                  <UserPlus className="w-5 h-5 text-red-600" />
                  <span>
                    {editingModId 
                      ? (language === 'bn' ? 'মডারেটর তথ্য ও পাসওয়ার্ড আপডেট' : 'Edit Moderator Info & Password')
                      : (language === 'bn' ? 'নতুন মডারেটর যুক্ত করুন' : 'Add New Moderator')}
                  </span>
                </h2>
                {editingModId && (
                  <button
                    type="button"
                    onClick={resetModForm}
                    className="text-xs font-bold text-gray-500 hover:text-red-600 px-3 py-1.5 bg-gray-100 rounded-xl transition"
                  >
                    {language === 'bn' ? 'বাতিল করুন' : 'Cancel Edit'}
                  </button>
                )}
              </div>

              <form onSubmit={handleModeratorSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      {language === 'bn' ? 'মডারেটরের নাম (Name) *' : 'Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={modName}
                      onChange={(e) => setModName(e.target.value)}
                      placeholder="e.g. মোঃ রহিম আহমেদ"
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-600 font-medium"
                    />
                  </div>

                  {/* Designation */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      {language === 'bn' ? 'পদবী (Designation) *' : 'Designation *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={modDesignation}
                      onChange={(e) => setModDesignation(e.target.value)}
                      placeholder="e.g. সিনিয়র নিউজ এডিটর"
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-600 font-medium"
                    />
                  </div>

                  {/* Number */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      {language === 'bn' ? 'মোবাইল নম্বর (Number) *' : 'Phone Number *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={modNumber}
                      onChange={(e) => setModNumber(e.target.value)}
                      placeholder="e.g. 01712345678"
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-600 font-medium"
                    />
                  </div>

                  {/* NID */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      {language === 'bn' ? 'জাতীয় পরিচয়পত্র (NID) *' : 'NID Number *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={modNid}
                      onChange={(e) => setModNid(e.target.value)}
                      placeholder="e.g. 1992123456789"
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-600 font-medium"
                    />
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      {language === 'bn' ? 'জন্ম তারিখ (Date of Birth) *' : 'Date of Birth *'}
                    </label>
                    <input
                      type="date"
                      required
                      value={modDob}
                      onChange={(e) => setModDob(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-600 font-medium"
                    />
                  </div>

                  {/* Gmail / Login Email */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      {language === 'bn' ? 'জিিমেইল / ইমেল (লগইন আইডি) *' : 'Gmail / Login Email *'}
                    </label>
                    <input
                      type="email"
                      required
                      value={modGmail}
                      onChange={(e) => setModGmail(e.target.value)}
                      placeholder="e.g. rahim.news24@gmail.com"
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-600 font-medium"
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      {language === 'bn' ? (editingModId ? 'বর্তমান পাসওয়ার্ড (Password)' : 'লগইন পাসওয়ার্ড (Password) *') : (editingModId ? 'Current Password' : 'Password *')}
                    </label>
                    <input
                      type="text"
                      required={!editingModId}
                      value={modPassword}
                      onChange={(e) => setModPassword(e.target.value)}
                      placeholder="e.g. mod#1234"
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-600 font-medium"
                    />
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      {language === 'bn' ? 'নতুন পাসওয়ার্ড (New Password)' : 'New Password'}
                    </label>
                    <input
                      type="text"
                      value={modNewPassword}
                      onChange={(e) => setModNewPassword(e.target.value)}
                      placeholder={editingModId ? 'নতুন পাসওয়ার্ড দিন (ঐচ্ছিক)' : 'ঐচ্ছিক নতুন পাসওয়ার্ড'}
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-600 font-medium"
                    />
                  </div>
                </div>

                {/* Permissions Selection Box */}
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 space-y-4">
                  <label className="block text-xs font-black text-gray-800 uppercase tracking-wider">
                    {language === 'bn' ? 'পারমিশন নির্বাচন করুন (Moderator Access Control):' : 'Moderator Access Control:'}
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <label className="flex items-center space-x-3 bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm cursor-pointer hover:border-red-400 transition">
                      <input
                        type="checkbox"
                        checked={permFullControl}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setPermFullControl(checked);
                          if (checked) {
                            setPermNewsMgmt(true);
                            setPermCategoryMgmt(true);
                            setPermAdReq(true);
                            setPermUserSub(true);
                          }
                        }}
                        className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                      />
                      <span className="text-sm font-bold text-red-700">
                        {language === 'bn' ? '⚡ ফুল কন্ট্রোল (Full Control)' : '⚡ Full Control'}
                      </span>
                    </label>

                    <label className="flex items-center space-x-3 bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm cursor-pointer hover:border-red-400 transition">
                      <input
                        type="checkbox"
                        checked={permNewsMgmt}
                        onChange={(e) => setPermNewsMgmt(e.target.checked)}
                        className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                      />
                      <span className="text-sm font-medium text-gray-800">
                        {language === 'bn' ? '📰 নিউজ ম্যানেজমেন্ট (News)' : '📰 News Management'}
                      </span>
                    </label>

                    <label className="flex items-center space-x-3 bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm cursor-pointer hover:border-red-400 transition">
                      <input
                        type="checkbox"
                        checked={permCategoryMgmt}
                        onChange={(e) => setPermCategoryMgmt(e.target.checked)}
                        className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                      />
                      <span className="text-sm font-medium text-gray-800">
                        {language === 'bn' ? '🏷️ ক্যাটাগরি কনট্রোল (Categories)' : '🏷️ Category Management'}
                      </span>
                    </label>

                    <label className="flex items-center space-x-3 bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm cursor-pointer hover:border-red-400 transition">
                      <input
                        type="checkbox"
                        checked={permAdReq}
                        onChange={(e) => setPermAdReq(e.target.checked)}
                        className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                      />
                      <span className="text-sm font-medium text-gray-800">
                        {language === 'bn' ? '📢 বিজ্ঞাপন আবেদন ও ব্যানার (Ads)' : '📢 Ad Requests & Banners'}
                      </span>
                    </label>

                    <label className="flex items-center space-x-3 bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm cursor-pointer hover:border-red-400 transition">
                      <input
                        type="checkbox"
                        checked={permUserSub}
                        onChange={(e) => setPermUserSub(e.target.checked)}
                        className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                      />
                      <span className="text-sm font-medium text-gray-800">
                        {language === 'bn' ? '📥 পাঠকের প্রেরিত সংবাদ (Submissions)' : '📥 User Submissions'}
                      </span>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isModSaving}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3.5 rounded-2xl transition shadow-lg shadow-red-200 text-sm flex items-center space-x-2 disabled:opacity-50"
                >
                  <UserPlus className="w-5 h-5" />
                  <span>
                    {isModSaving 
                      ? (language === 'bn' ? 'ফায়ারবেসে সংরক্ষণ হচ্ছে...' : 'Saving to Firebase...') 
                      : editingModId 
                        ? (language === 'bn' ? 'মডারেটর আপডেট করুন' : 'Update Moderator') 
                        : (language === 'bn' ? 'মডারেটর যোগ করুন (Save)' : 'Save Moderator')}
                  </span>
                </button>
              </form>
            </div>

            {/* Moderator List Table */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-200 space-y-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                <Users className="w-5 h-5 text-gray-700" />
                <span>{language === 'bn' ? 'মডারেটর তালিকা (Firebase Database Live)' : 'Firebase Moderators List'}</span>
              </h2>

              {moderators.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-gray-500">
                  <Users className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                  <p className="font-semibold text-sm">
                    {language === 'bn' ? 'এখনো কোনো মডারেটর যুক্ত করা হয়নি।' : 'No moderators added yet.'}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-100 border-b border-gray-200 text-xs font-bold text-gray-700 uppercase">
                        <th className="p-4">মডারেটর নাম ও জিমেইল</th>
                        <th className="p-4">পদবী ও মোবাইল</th>
                        <th className="p-4">NID & জন্ম তারিখ</th>
                        <th className="p-4">পারমিশন</th>
                        <th className="p-4">স্ট্যাটাস</th>
                        <th className="p-4 text-right">অ্যাকশন (Ban/Edit/Delete)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                      {moderators.map((mod) => (
                        <tr key={mod.id} className={`hover:bg-gray-50/80 transition ${mod.isBanned ? 'bg-red-50/50' : ''}`}>
                          <td className="p-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-9 h-9 bg-red-100 text-red-700 rounded-full flex items-center justify-center font-black text-xs shrink-0 border border-red-200">
                                {mod.name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-bold text-gray-900">{mod.name}</p>
                                <p className="text-xs text-gray-500 font-mono">{mod.gmail}</p>
                              </div>
                            </div>
                          </td>

                          <td className="p-4 text-gray-700">
                            <p className="font-bold text-xs text-gray-900">{mod.designation}</p>
                            <p className="text-xs text-gray-500">{mod.number}</p>
                          </td>

                          <td className="p-4 text-gray-600 text-xs">
                            <p><span className="font-semibold text-gray-700">NID:</span> {mod.nid}</p>
                            <p><span className="font-semibold text-gray-700">DOB:</span> {mod.dateOfBirth}</p>
                          </td>

                          <td className="p-4">
                            <div className="flex flex-wrap gap-1 max-w-xs">
                              {mod.permissions.fullControl ? (
                                <span className="bg-red-100 text-red-800 text-[10px] font-black px-2 py-0.5 rounded-full border border-red-200">
                                  ⚡ Full Control
                                </span>
                              ) : (
                                <>
                                  {mod.permissions.newsManagement && (
                                    <span className="bg-blue-50 text-blue-700 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-blue-200">
                                      News
                                    </span>
                                  )}
                                  {mod.permissions.categoryManagement && (
                                    <span className="bg-purple-50 text-purple-700 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-purple-200">
                                      Category
                                    </span>
                                  )}
                                  {mod.permissions.adRequests && (
                                    <span className="bg-amber-50 text-amber-700 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-amber-200">
                                      Ads
                                    </span>
                                  )}
                                  {mod.permissions.userSubmissions && (
                                    <span className="bg-emerald-50 text-emerald-700 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
                                      Submissions
                                    </span>
                                  )}
                                </>
                              )}
                            </div>
                          </td>

                          <td className="p-4">
                            {mod.isBanned ? (
                              <span className="inline-flex items-center space-x-1 bg-red-100 text-red-700 text-xs font-black px-2.5 py-1 rounded-full border border-red-200 shadow-xs">
                                <UserX className="w-3.5 h-3.5" />
                                <span>Banned (নিষিদ্ধ)</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center space-x-1 bg-green-100 text-green-700 text-xs font-black px-2.5 py-1 rounded-full border border-green-200 shadow-xs">
                                <ShieldCheck className="w-3.5 h-3.5" />
                                <span>Active (সক্রিয়)</span>
                              </span>
                            )}
                          </td>

                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              {/* Ban / Unban Button */}
                              <button
                                type="button"
                                onClick={() => handleToggleBan(mod.id, mod.isBanned)}
                                title={mod.isBanned ? 'Unban Moderator' : 'Ban Moderator'}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1 ${
                                  mod.isBanned 
                                    ? 'bg-green-600 hover:bg-green-700 text-white shadow-sm' 
                                    : 'bg-orange-100 hover:bg-orange-600 hover:text-white text-orange-800 border border-orange-200'
                                }`}
                              >
                                {mod.isBanned ? (
                                  <>
                                    <ShieldCheck className="w-3.5 h-3.5" />
                                    <span>Unban</span>
                                  </>
                                ) : (
                                  <>
                                    <UserX className="w-3.5 h-3.5" />
                                    <span>Ban (ব্যান)</span>
                                  </>
                                )}
                              </button>

                              {/* Edit Button */}
                              <button
                                type="button"
                                onClick={() => handleEditClick(mod)}
                                title="Edit Moderator"
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition"
                              >
                                <Edit className="w-4 h-4" />
                              </button>

                              {/* Delete Button */}
                              <button
                                type="button"
                                onClick={() => handleDeleteMod(mod.id)}
                                title="Delete Moderator"
                                className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

      </main>

      {/* Add Article Modal */}
      {showAddArticleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {language === 'bn' ? 'নতুন সংবাদ তৈরি করুন' : 'Create New Article'}
            </h2>

            <form onSubmit={handleArticleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Title (Bangla)</label>
                <input
                  type="text"
                  required
                  value={titleBn}
                  onChange={(e) => setTitleBn(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-600 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Title (English)</label>
                <input
                  type="text"
                  required
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-600 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Category</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-600"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.nameBn} / {c.nameEn}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Reporter Name</label>
                  <input
                    type="text"
                    value={reporterName}
                    onChange={(e) => setReporterName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Image URL</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  {language === 'bn' ? 'প্রাথমিক পাঠক সংখ্যা (Views Count / Original Views)' : 'Initial Views Count (Original Views)'}
                </label>
                <input
                  type="number"
                  min="0"
                  value={initialViewsInput}
                  onChange={(e) => setInitialViewsInput(Number(e.target.value))}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-600 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Summary (Bangla)</label>
                <textarea
                  rows={2}
                  required
                  value={summaryBn}
                  onChange={(e) => setSummaryBn(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Content (Bangla)</label>
                <textarea
                  rows={5}
                  required
                  value={contentBn}
                  onChange={(e) => setContentBn(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:border-red-600"
                />
              </div>

              <div className="flex items-center space-x-6 py-2">
                <label className="flex items-center space-x-2 text-sm font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 text-red-600 rounded"
                  />
                  <span>Featured News</span>
                </label>
                <label className="flex items-center space-x-2 text-sm font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isBreaking}
                    onChange={(e) => setIsBreaking(e.target.checked)}
                    className="w-4 h-4 text-red-600 rounded"
                  />
                  <span>Breaking News</span>
                </label>
                <label className="flex items-center space-x-2 text-sm font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isTrending}
                    onChange={(e) => setIsTrending(e.target.checked)}
                    className="w-4 h-4 text-red-600 rounded"
                  />
                  <span>Trending</span>
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowAddArticleModal(false)}
                  className="px-6 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-bold text-sm hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-red-600 text-white font-bold text-sm hover:bg-red-700 transition shadow"
                >
                  Publish Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
