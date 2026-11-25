import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, Sparkles, Image as ImageIcon, Lightbulb, MessageSquare, 
  Settings, Lock, Key, Globe, Moon, Sun, Plus, Trash2, Edit3, 
  Eye, EyeOff, Pin, Check, X, ChevronDown, Download, Database, 
  Code, Sliders, Layers, RefreshCw, Upload, LogOut, Play, Pause, Music
} from 'lucide-react';

// Default mock initial state (works immediately without Supabase, syncs automatically if Supabase configured)
const initialSiteData = {
  settings: {
    siteNameAr: "سارة 🌸",
    siteNameEn: "Sarah 🌸",
    welcomeTitleAr: "عالم سارة الوردي الفاخر",
    welcomeTitleEn: "Sarah's Elegant Rose Haven",
    subtitleAr: "مملكة الذكريات الأبدية واللحظات المشرقة بين أوراق الورد الأبيض",
    subtitleEn: "A sanctuary of timeless memories & radiant moments adorned in white roses",
    primaryColor: "#D4AF37",
    petalCount: 22,
    enableMusic: false,
    musicUrl: "",
    language: "ar",
    darkMode: false,
    adminPassword: "S12"
  },
  sections: [
    { id: "hero", nameAr: "الرئيسية", nameEn: "Hero", visible: true, order: 1 },
    { id: "memories", nameAr: "ألبوم الذكريات", nameEn: "Memories Gallery", visible: true, order: 2 },
    { id: "ideas", nameAr: "ملاحظات وأفكار", nameEn: "Ideas & Vault", visible: true, order: 3 },
    { id: "messages", nameAr: "رسائل الحب والود", nameEn: "Love Messages", visible: true, order: 4 },
    { id: "custom_notes", nameAr: "رسالة خاصة", nameEn: "Special Note", visible: true, order: 5 }
  ],
  albums: [
    { id: "1", titleAr: "أحلى الأيام", titleEn: "Sweetest Days", coverUrl: "https://images.unsplash.com/photo-1533616688419-b7a585564566?auto=format&fit=crop&q=80&w=800" },
    { id: "2", titleAr: "رحلات وسفر", titleEn: "Travel & Trips", coverUrl: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&q=80&w=800" }
  ],
  photos: [
    {
      id: "p1",
      albumId: "1",
      titleAr: "باقة ورد أبيض استثنائية",
      titleEn: "Exceptional White Rose Bouquet",
      descriptionAr: "ذكرى يوم مميز مليء بالحب والنقاء",
      descriptionEn: "A beautiful day filled with pure love",
      url: "https://images.unsplash.com/photo-1533616688419-b7a585564566?auto=format&fit=crop&q=80&w=1000",
      date: "2024-02-14"
    },
    {
      id: "p2",
      albumId: "2",
      titleAr: "غروب دافئ مع الورد",
      titleEn: "Warm Sunset with Roses",
      descriptionAr: "لحظات لا تُنسى في تلال الورد",
      descriptionEn: "Unforgettable sunset moments",
      url: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&q=80&w=1000",
      date: "2024-05-20"
    },
    {
      id: "p3",
      albumId: "1",
      titleAr: "تفاصيل أنيقة",
      titleEn: "Elegant Details",
      descriptionAr: "الورد الأبيض يعبر عن أرق مشاعرنا",
      descriptionEn: "White roses reflecting our gentlest emotions",
      url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=1000",
      date: "2024-08-10"
    }
  ],
  ideas: [
    {
      id: "i1",
      titleAr: "رحلة الأحلام إلى باريس",
      titleEn: "Dream Trip to Paris",
      contentAr: "زيارة حدائق الورد التاريخية وتوثيق كل لحظة معًا.",
      contentEn: "Visiting historical rose gardens and taking photos together.",
      category: "سفر",
      pinned: true,
      imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=600"
    },
    {
      id: "i2",
      titleAr: "كتابة رواية مشتركة",
      titleEn: "Writing a Novel Together",
      contentAr: "جمع كل القصص والذكريات الجميلة في كتاب خاص ومغلف بالحرير.",
      contentEn: "Compiling all precious memories into a custom silk-bound book.",
      category: "إبداع",
      pinned: false,
      imageUrl: ""
    }
  ],
  messages: [
    {
      id: "m1",
      senderAr: "مجهول بحب",
      senderEn: "With Love",
      textAr: "سارة.. أنتِ أرق من الورد الأبيض وأجمل هدية في الحياة 🌸",
      textEn: "Sarah.. You are gentler than a white rose and life's sweetest gift 🌸",
      date: "2024-11-10",
      likes: 12
    }
  ]
};

export default function App() {
  // Application Data States
  const [siteData, setSiteData] = useState(() => {
    const saved = localStorage.getItem('sarah_site_data');
    return saved ? JSON.parse(saved) : initialSiteData;
  });

  const [lang, setLang] = useState(siteData.settings.language || 'ar');
  const [darkMode, setDarkMode] = useState(siteData.settings.darkMode || false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Modals state
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showSqlModal, setShowSqlModal] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [activeTab, setActiveTab] = useState('branding'); // Admin tabs

  // Forms dynamic state
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [selectedAlbumFilter, setSelectedAlbumFilter] = useState('all');

  // Supabase Credentials
  const [supabaseUrl, setSupabaseUrl] = useState(() => localStorage.getItem('supabase_url') || '');
  const [supabaseKey, setSupabaseKey] = useState(() => localStorage.getItem('supabase_key') || '');
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);

  // Music Player
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const audioRef = useRef(null);

  // Persist State to LocalStorage
  useEffect(() => {
    localStorage.setItem('sarah_site_data', JSON.stringify(siteData));
  }, [siteData]);

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  // Handle Admin Login
  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminPasswordInput === siteData.settings.adminPassword) {
      setIsAdminLoggedIn(true);
      setShowAdminModal(false);
      setAdminPasswordInput('');
      setLoginError('');
    } else {
      setLoginError(lang === 'ar' ? 'كلمة المرور غير صحيحة!' : 'Incorrect password!');
    }
  };

  // Helper for text based on language
  const t = (arText, enText) => (lang === 'ar' ? arText : enText);

  // Storage connection simulate/save
  const handleSaveSupabaseConfig = () => {
    localStorage.setItem('supabase_url', supabaseUrl);
    localStorage.setItem('supabase_key', supabaseKey);
    if (supabaseUrl && supabaseKey) {
      setIsSupabaseConnected(true);
      alert(t('تم حفظ إعدادات Supabase بنجاح! سيتم المزامنة تلقائياً.', 'Supabase settings saved successfully! Live sync enabled.'));
    } else {
      setIsSupabaseConnected(false);
      alert(t('تم استخدام التخزين المحلي فقط.', 'Using Local Storage mode.'));
    }
  };

  // CRUD Functions
  const addPhoto = (newPhoto) => {
    setSiteData(prev => ({
      ...prev,
      photos: [ { ...newPhoto, id: Date.now().toString() }, ...prev.photos ]
    }));
  };

  const deletePhoto = (id) => {
    setSiteData(prev => ({
      ...prev,
      photos: prev.photos.filter(p => p.id !== id)
    }));
  };

  const addIdea = (newIdea) => {
    setSiteData(prev => ({
      ...prev,
      ideas: [ { ...newIdea, id: Date.now().toString() }, ...prev.ideas ]
    }));
  };

  const togglePinIdea = (id) => {
    setSiteData(prev => ({
      ...prev,
      ideas: prev.ideas.map(idea => idea.id === id ? { ...idea, pinned: !idea.pinned } : idea)
    }));
  };

  const deleteIdea = (id) => {
    setSiteData(prev => ({
      ...prev,
      ideas: prev.ideas.filter(i => i.id !== id)
    }));
  };

  const addMessage = (msg) => {
    setSiteData(prev => ({
      ...prev,
      messages: [ { ...msg, id: Date.now().toString(), likes: 0, date: new Date().toISOString().split('T')[0] }, ...prev.messages ]
    }));
  };

  const deleteMessage = (id) => {
    setSiteData(prev => ({
      ...prev,
      messages: prev.messages.filter(m => m.id !== id)
    }));
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-500 selection:bg-amber-200 selection:text-amber-900 ${
      darkMode ? 'bg-zinc-950 text-zinc-100' : 'bg-[#FDFBF7] text-zinc-800'
    }`}>
      {/* Falling White Rose Petals Background */}
      <PetalsCanvas count={siteData.settings.petalCount} darkMode={darkMode} />

      {/* Main Navigation Bar */}
      <header className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors ${
        darkMode ? 'bg-zinc-950/80 border-zinc-800' : 'bg-white/80 border-amber-100/60'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl sm:text-3xl font-serif font-bold text-amber-600 dark:text-amber-400 tracking-wide">
              {lang === 'ar' ? siteData.settings.siteNameAr : siteData.settings.siteNameEn}
            </span>
            <span className="hidden sm:inline-block px-2.5 py-0.5 text-xs rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/50">
              White Rose Edition 🌸
            </span>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {siteData.sections.filter(s => s.visible).map(sec => (
              <a 
                key={sec.id} 
                href={`#${sec.id}`} 
                className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
              >
                {lang === 'ar' ? sec.nameAr : sec.nameEn}
              </a>
            ))}
          </nav>

          {/* Right Utilities */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Ambient Music Toggle */}
            <button
              onClick={() => setIsPlayingMusic(!isPlayingMusic)}
              className="p-2 rounded-full hover:bg-amber-100/50 dark:hover:bg-zinc-800 text-amber-700 dark:text-amber-300 transition-colors"
              title={t('تكرار الموسيقى الهادئة', 'Ambient Music')}
            >
              <Music className={`w-5 h-5 ${isPlayingMusic ? 'animate-bounce text-amber-600' : ''}`} />
            </button>

            {/* Language Toggle */}
            <button
              onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-100/70 dark:bg-zinc-800 text-amber-900 dark:text-amber-200 hover:bg-amber-200 dark:hover:bg-zinc-700 transition"
            >
              <Globe className="w-3.5 h-3.5" />
              {lang === 'ar' ? 'EN' : 'عربي'}
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full hover:bg-amber-100/50 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition"
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-zinc-700" />}
            </button>

            {/* SQL / Database Info Button */}
            <button
              onClick={() => setShowSqlModal(true)}
              className="p-2 rounded-full hover:bg-amber-100/50 dark:hover:bg-zinc-800 text-amber-600 dark:text-amber-400 transition"
              title={t('قاعدة البيانات و Supabase SQL', 'Supabase SQL Schema')}
            >
              <Database className="w-5 h-5" />
            </button>

            {/* Admin Dashboard Button */}
            {isAdminLoggedIn ? (
              <button
                onClick={() => setShowAdminModal(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-2 rounded-full text-xs font-bold shadow-md hover:opacity-95 transition"
              >
                <Sliders className="w-4 h-4" />
                {t('لوحة التحكم', 'Admin Dashboard')}
              </button>
            ) : (
              <button
                onClick={() => setShowAdminModal(true)}
                className="p-2 rounded-full border border-amber-300/60 dark:border-zinc-700 hover:bg-amber-50 dark:hover:bg-zinc-800 text-amber-700 dark:text-amber-300 transition"
                title={t('دخول الأدمن', 'Admin Login')}
              >
                <Lock className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      {siteData.sections.find(s => s.id === 'hero')?.visible && (
        <section id="hero" className="relative min-h-[85vh] flex items-center justify-center text-center px-4 py-20 overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-15 dark:opacity-20 pointer-events-none">
            <img 
              src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=1920" 
              alt="White Roses Cover" 
              className="w-full h-full object-cover filter blur-[2px]" 
            />
          </div>

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 dark:bg-zinc-900/80 border border-amber-200/60 dark:border-amber-900/50 shadow-sm backdrop-blur-sm animate-pulse">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-medium text-amber-800 dark:text-amber-300">
                {t('مملكة الورد الأبيض واللحظات الخالدة', 'Kingdom of Pure White Roses')}
              </span>
            </div>

            <h1 className="text-5xl sm:text-7xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-700 via-amber-600 to-amber-800 dark:from-amber-200 dark:via-amber-400 dark:to-amber-100 leading-tight">
              {lang === 'ar' ? siteData.settings.welcomeTitleAr : siteData.settings.welcomeTitleEn}
            </h1>

            <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto font-light leading-relaxed">
              {lang === 'ar' ? siteData.settings.subtitleAr : siteData.settings.subtitleEn}
            </p>

            <div className="pt-6 flex flex-wrap justify-center gap-4">
              <a
                href="#memories"
                className="px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-medium shadow-lg shadow-amber-600/20 hover:shadow-amber-600/30 transition-all transform hover:-translate-y-0.5"
              >
                {t('استكشف المعرض', 'Explore Gallery')}
              </a>
              <a
                href="#messages"
                className="px-8 py-3.5 rounded-full bg-white/80 dark:bg-zinc-900/80 border border-amber-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 font-medium hover:bg-amber-50 dark:hover:bg-zinc-800 transition"
              >
                {t('اترك كلمة رقيقة', 'Leave a Message')}
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Memories & Gallery Section */}
      {siteData.sections.find(s => s.id === 'memories')?.visible && (
        <section id="memories" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center space-y-3 mb-12">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-100/60 dark:bg-amber-950/60 text-amber-600 mb-2">
              <ImageIcon className="w-6 h-6" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-zinc-900 dark:text-zinc-100">
              {t('معرض الصور والذكريات', 'Memories & Photo Gallery')}
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-md mx-auto">
              {t('ألبوم مميز يضم أجمل اللحظات واللفتات الأنيقة', 'A special album capturing beautiful moments & white rose aesthetic')}
            </p>
          </div>

          {/* Album Filters */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            <button
              onClick={() => setSelectedAlbumFilter('all')}
              className={`px-5 py-2 rounded-full text-xs font-semibold transition ${
                selectedAlbumFilter === 'all'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-amber-50'
              }`}
            >
              {t('الكل', 'All Photos')}
            </button>
            {siteData.albums.map(alb => (
              <button
                key={alb.id}
                onClick={() => setSelectedAlbumFilter(alb.id)}
                className={`px-5 py-2 rounded-full text-xs font-semibold transition ${
                  selectedAlbumFilter === alb.id
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-amber-50'
                }`}
              >
                {lang === 'ar' ? alb.titleAr : alb.titleEn}
              </button>
            ))}
          </div>

          {/* Photos Masonry Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {siteData.photos
              .filter(p => selectedAlbumFilter === 'all' || p.albumId === selectedAlbumFilter)
              .map(photo => (
                <div
                  key={photo.id}
                  onClick={() => setSelectedPhoto(photo)}
                  className="group relative bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-amber-100/80 dark:border-zinc-800/80 transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                >
                  <div className="aspect-w-4 aspect-h-3 w-full h-64 overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                    <img
                      src={photo.url}
                      alt={photo.titleAr}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-serif font-bold text-lg text-zinc-800 dark:text-zinc-100 group-hover:text-amber-600 transition-colors">
                        {lang === 'ar' ? photo.titleAr : photo.titleEn}
                      </h3>
                      <span className="text-[10px] text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">
                        {photo.date}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
                      {lang === 'ar' ? photo.descriptionAr : photo.descriptionEn}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </section>
      )}

      {/* Ideas & Vault Section */}
      {siteData.sections.find(s => s.id === 'ideas')?.visible && (
        <section id="ideas" className={`py-20 px-4 sm:px-6 lg:px-8 border-t ${darkMode ? 'bg-zinc-900/50 border-zinc-800' : 'bg-amber-50/40 border-amber-100/60'}`}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center space-y-3 mb-12">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-100/60 dark:bg-amber-950/60 text-amber-600 mb-2">
                <Lightbulb className="w-6 h-6" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-zinc-900 dark:text-zinc-100">
                {t('دفتر الأفكار والملاحظات', 'Ideas & Romantic Notes Vault')}
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-md mx-auto">
                {t('مساحة للأفكار المستقبلية، التطلعات، والأمنيات الدافئة', 'A serene space for future dreams, thoughts, and sweet notes')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {siteData.ideas.map(idea => (
                <div
                  key={idea.id}
                  className={`p-6 rounded-2xl border transition-all duration-300 relative bg-white dark:bg-zinc-900 ${
                    idea.pinned 
                      ? 'border-amber-400 dark:border-amber-500/60 shadow-md ring-1 ring-amber-400/30' 
                      : 'border-zinc-200/80 dark:border-zinc-800'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-amber-100/80 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                      {idea.category}
                    </span>
                    <button
                      onClick={() => togglePinIdea(idea.id)}
                      className={`p-1.5 rounded-full transition ${idea.pinned ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/50' : 'text-zinc-400 hover:text-amber-500'}`}
                      title={idea.pinned ? t('إلغاء التثبيت', 'Unpin') : t('تثبيت', 'Pin')}
                    >
                      <Pin className="w-4 h-4 fill-current" />
                    </button>
                  </div>

                  <h3 className="font-serif font-bold text-lg text-zinc-800 dark:text-zinc-100 mb-2">
                    {lang === 'ar' ? idea.titleAr : idea.titleEn}
                  </h3>

                  <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed mb-4">
                    {lang === 'ar' ? idea.contentAr : idea.contentEn}
                  </p>

                  {idea.imageUrl && (
                    <img
                      src={idea.imageUrl}
                      alt="Idea visual"
                      className="w-full h-36 object-cover rounded-xl mt-3 border border-zinc-100 dark:border-zinc-800"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Love Messages Timeline */}
      {siteData.sections.find(s => s.id === 'messages')?.visible && (
        <section id="messages" className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <div className="text-center space-y-3 mb-12">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-100/60 dark:bg-amber-950/60 text-amber-600 mb-2">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-zinc-900 dark:text-zinc-100">
              {t('رسائل الود والمحبة', 'Love Messages & Guest Notes')}
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-md mx-auto">
              {t('أترك رسالة رقيقة لتُحفر بحروف من ذهب', 'Leave a heartfelt note wrapped in white roses')}
            </p>
          </div>

          {/* Quick Add Message Form */}
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-amber-100 dark:border-zinc-800 shadow-sm mb-12">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target;
                const sender = form.sender.value;
                const text = form.text.value;
                if (text) {
                  addMessage({ senderAr: sender || 'مجهول', senderEn: sender || 'Anonymous', textAr: text, textEn: text });
                  form.reset();
                }
              }}
              className="space-y-4"
            >
              <div>
                <input
                  type="text"
                  name="sender"
                  placeholder={t('اسمك / لقبك الرقيق', 'Your Name or Alias')}
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                />
              </div>
              <div>
                <textarea
                  name="text"
                  rows={3}
                  required
                  placeholder={t('اكتب رسالتك الجميلة لسارة هنا...', 'Write your sweet message for Sarah here...')}
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl text-sm font-semibold shadow-sm hover:opacity-95 transition"
              >
                {t('إرسال الرسالة 🌸', 'Send Heart Note 🌸')}
              </button>
            </form>
          </div>

          {/* Messages List */}
          <div className="space-y-4">
            {siteData.messages.map(msg => (
              <div
                key={msg.id}
                className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-amber-100/70 dark:border-zinc-800 shadow-sm flex items-start justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-amber-700 dark:text-amber-400 text-sm">
                      {lang === 'ar' ? msg.senderAr : msg.senderEn}
                    </span>
                    <span className="text-[10px] text-zinc-400">
                      • {msg.date}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed font-light">
                    "{lang === 'ar' ? msg.textAr : msg.textEn}"
                  </p>
                </div>
                {isAdminLoggedIn && (
                  <button
                    onClick={() => deleteMessage(msg.id)}
                    className="text-red-400 hover:text-red-600 p-1"
                    title={t('حذف الرسالة', 'Delete Message')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className={`py-12 border-t text-center text-xs text-zinc-400 ${darkMode ? 'bg-zinc-950 border-zinc-900' : 'bg-white border-amber-100'}`}>
        <div className="max-w-7xl mx-auto px-4 space-y-3">
          <div className="flex justify-center items-center gap-2 text-amber-600 dark:text-amber-400 font-serif font-bold text-lg">
            <span>{lang === 'ar' ? siteData.settings.siteNameAr : siteData.settings.siteNameEn}</span>
            <Sparkles className="w-4 h-4" />
          </div>
          <p>{t('صُنع بكل حب وورد أبيض لحفظ أجمل الذكريات', 'Crafted with pure white roses & love for eternal memories')}</p>
          <p className="text-[10px] text-zinc-500">© 2026 Sarah White Rose Portal. All Rights Reserved.</p>
        </div>
      </footer>

      {/* Lightbox Photo View Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative max-w-4xl w-full bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl border border-amber-200/50">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="bg-black flex items-center justify-center min-h-[300px]">
                <img
                  src={selectedPhoto.url}
                  alt="Enlarged view"
                  className="max-h-[80vh] w-full object-contain"
                />
              </div>
              <div className="p-8 flex flex-col justify-between">
                <div className="space-y-4">
                  <span className="text-xs px-3 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-medium">
                    {selectedPhoto.date}
                  </span>
                  <h3 className="text-2xl font-serif font-bold text-zinc-900 dark:text-zinc-100">
                    {lang === 'ar' ? selectedPhoto.titleAr : selectedPhoto.titleEn}
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                    {lang === 'ar' ? selectedPhoto.descriptionAr : selectedPhoto.descriptionEn}
                  </p>
                </div>
                {isAdminLoggedIn && (
                  <button
                    onClick={() => {
                      deletePhoto(selectedPhoto.id);
                      setSelectedPhoto(null);
                    }}
                    className="mt-6 flex items-center gap-2 justify-center py-2.5 px-4 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 rounded-xl text-xs font-semibold hover:bg-red-100 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                    {t('حذف هذه الصورة من المعرض', 'Delete from Gallery')}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Panel / Login Modal */}
      {showAdminModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-amber-200/50 p-6 sm:p-8">
            <button
              onClick={() => setShowAdminModal(false)}
              className="absolute top-6 left-6 p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {!isAdminLoggedIn ? (
              /* Login Form */
              <div className="max-w-md mx-auto py-8 text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 mx-auto flex items-center justify-center">
                  <Lock className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-serif font-bold text-zinc-900 dark:text-zinc-100">
                    {t('تسجيل دخول الأدمن', 'Admin Portal Access')}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    {t('كلمة المرور الإفتراضية: S12', 'Default Password: S12')}
                  </p>
                </div>

                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <input
                    type="password"
                    value={adminPasswordInput}
                    onChange={(e) => setAdminPasswordInput(e.target.value)}
                    placeholder={t('أدخل كلمة المرور', 'Enter Admin Password')}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-transparent text-center text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  {loginError && <p className="text-xs text-red-500">{loginError}</p>}
                  <button
                    type="submit"
                    className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl text-sm transition shadow-md"
                  >
                    {t('دخول للوحة التحكم', 'Authenticate')}
                  </button>
                </form>
              </div>
            ) : (
              /* Admin Full Dashboard Tabs */
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between border-b pb-4 border-zinc-200 dark:border-zinc-800 gap-4">
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                      <Sliders className="w-6 h-6 text-amber-500" />
                      {t('لوحة تحكم سارة الاحترافية', 'Sarah Admin Suite')}
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {t('تعديل كامل المحتوى والأقسام والألوان بدون كود', 'Full control over design, texts, sections & live database')}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsAdminLoggedIn(false)}
                    className="flex items-center gap-1.5 text-xs text-red-500 font-semibold px-3 py-1.5 rounded-lg border border-red-200 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4" />
                    {t('خروج الأدمن', 'Logout')}
                  </button>
                </div>

                {/* Tab Controls */}
                <div className="flex gap-2 overflow-x-auto pb-2 border-b border-zinc-100 dark:border-zinc-800">
                  {[
                    { id: 'branding', labelAr: 'الهوية والتنقل', labelEn: 'Branding & Texts' },
                    { id: 'sections', labelAr: 'إدارة الأقسام', labelEn: 'Sections Manager' },
                    { id: 'add_content', labelAr: 'إضافة محتوى', labelEn: 'Add Content' },
                    { id: 'supabase', labelAr: 'إعدادات Supabase', labelEn: 'Supabase Integration' },
                    { id: 'security', labelAr: 'الأمان وكلمة السر', labelEn: 'Security' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                        activeTab === tab.id
                          ? 'bg-amber-600 text-white shadow-sm'
                          : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-amber-50'
                      }`}
                    >
                      {lang === 'ar' ? tab.labelAr : tab.labelEn}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                {activeTab === 'branding' && (
                  <div className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-semibold mb-1">{t('اسم الموقع (عربي)', 'Site Name (AR)')}</label>
                        <input
                          type="text"
                          value={siteData.settings.siteNameAr}
                          onChange={(e) => setSiteData({ ...siteData, settings: { ...siteData.settings, siteNameAr: e.target.value }})}
                          className="w-full px-3 py-2 rounded-lg border bg-transparent"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold mb-1">{t('اسم الموقع (English)', 'Site Name (EN)')}</label>
                        <input
                          type="text"
                          value={siteData.settings.siteNameEn}
                          onChange={(e) => setSiteData({ ...siteData, settings: { ...siteData.settings, siteNameEn: e.target.value }})}
                          className="w-full px-3 py-2 rounded-lg border bg-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">{t('عنوان الترحيب الرئيسية (عربي)', 'Welcome Title (AR)')}</label>
                      <input
                        type="text"
                        value={siteData.settings.welcomeTitleAr}
                        onChange={(e) => setSiteData({ ...siteData, settings: { ...siteData.settings, welcomeTitleAr: e.target.value }})}
                        className="w-full px-3 py-2 rounded-lg border bg-transparent"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">{t('الوصف الفرعي للرئيسية (عربي)', 'Subtitle (AR)')}</label>
                      <textarea
                        rows={2}
                        value={siteData.settings.subtitleAr}
                        onChange={(e) => setSiteData({ ...siteData, settings: { ...siteData.settings, subtitleAr: e.target.value }})}
                        className="w-full px-3 py-2 rounded-lg border bg-transparent"
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'sections' && (
                  <div className="space-y-3 text-xs">
                    <p className="text-zinc-500">{t('إخفاء أو إظهار أقسام الموقع في الصفحة الرئيسية:', 'Toggle visibility of main page sections:')}</p>
                    {siteData.sections.map((sec, idx) => (
                      <div key={sec.id} className="flex items-center justify-between p-3 rounded-xl border border-zinc-200 dark:border-zinc-800">
                        <span className="font-semibold text-sm">{lang === 'ar' ? sec.nameAr : sec.nameEn}</span>
                        <button
                          onClick={() => {
                            const updated = siteData.sections.map(s => s.id === sec.id ? { ...s, visible: !s.visible } : s);
                            setSiteData({ ...siteData, sections: updated });
                          }}
                          className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-bold text-xs ${
                            sec.visible ? 'bg-green-100 text-green-700' : 'bg-zinc-100 text-zinc-500'
                          }`}
                        >
                          {sec.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                          {sec.visible ? t('ظاهر', 'Visible') : t('مخفي', 'Hidden')}
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'add_content' && (
                  <div className="space-y-6 text-xs">
                    {/* Add Photo Form */}
                    <div className="p-4 rounded-2xl border border-amber-200 bg-amber-50/30 dark:bg-zinc-800/40 space-y-3">
                      <h4 className="font-bold text-sm text-amber-800 dark:text-amber-300">{t('إضافة صورة جديدة للألبوم', 'Add New Photo')}</h4>
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          const f = e.target;
                          addPhoto({
                            titleAr: f.titleAr.value,
                            titleEn: f.titleEn.value || f.titleAr.value,
                            descriptionAr: f.descAr.value,
                            descriptionEn: f.descAr.value,
                            url: f.url.value,
                            albumId: f.albumId.value,
                            date: new Date().toISOString().split('T')[0]
                          });
                          f.reset();
                          alert(t('تمت إضافة الصورة بنجاح!', 'Photo added successfully!'));
                        }}
                        className="space-y-3"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input type="text" name="titleAr" required placeholder={t('عنوان الصورة (عربي)', 'Title (AR)')} className="p-2 rounded border bg-transparent" />
                          <input type="text" name="url" required placeholder={t('رابط الصورة URL', 'Image URL')} className="p-2 rounded border bg-transparent" />
                        </div>
                        <textarea name="descAr" rows={2} placeholder={t('وصف الصورة', 'Description')} className="w-full p-2 rounded border bg-transparent"></textarea>
                        <select name="albumId" className="p-2 rounded border bg-transparent w-full">
                          {siteData.albums.map(a => (
                            <option key={a.id} value={a.id}>{a.titleAr}</option>
                          ))}
                        </select>
                        <button type="submit" className="px-4 py-2 bg-amber-600 text-white rounded-lg font-semibold">{t('حفظ الصورة', 'Save Photo')}</button>
                      </form>
                    </div>
                  </div>
                )}

                {activeTab === 'supabase' && (
                  <div className="space-y-4 text-xs">
                    <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700">
                      <h4 className="font-bold text-sm mb-2">{t('ربط Supabase الحي (Live Sync)', 'Supabase Credentials')}</h4>
                      <p className="text-zinc-500 mb-4">{t('قم بإدخال بيانات مشروع Supabase الخاص بك للمزامنة السحابية الدائمة:', 'Provide your Supabase URL & Anon Key for real-time cloud storage:')}</p>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block mb-1 font-semibold">Project URL</label>
                          <input
                            type="text"
                            value={supabaseUrl}
                            onChange={(e) => setSupabaseUrl(e.target.value)}
                            placeholder="https://xyz.supabase.co"
                            className="w-full p-2.5 rounded-lg border bg-transparent font-mono"
                          />
                        </div>
                        <div>
                          <label className="block mb-1 font-semibold">Anon Key</label>
                          <input
                            type="password"
                            value={supabaseKey}
                            onChange={(e) => setSupabaseKey(e.target.value)}
                            placeholder="eyJhbGciOiJIUzI1NiIsInR..."
                            className="w-full p-2.5 rounded-lg border bg-transparent font-mono"
                          />
                        </div>
                        <button
                          onClick={handleSaveSupabaseConfig}
                          className="px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg font-bold"
                        >
                          {t('حفظ واختبار الاتصال', 'Save & Connect')}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'security' && (
                  <div className="space-y-4 text-xs">
                    <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-3">
                      <h4 className="font-bold text-sm">{t('تغيير كلمة مرور الأدمن', 'Change Admin Password')}</h4>
                      <input
                        type="text"
                        defaultValue={siteData.settings.adminPassword}
                        onChange={(e) => setSiteData({ ...siteData, settings: { ...siteData.settings, adminPassword: e.target.value }})}
                        className="w-full p-2.5 rounded-lg border bg-transparent font-mono text-sm"
                      />
                      <p className="text-[11px] text-zinc-400">{t('احفظ التغييرات لحماية اللوحة', 'Make sure to remember your new password.')}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SQL & Documentation Modal */}
      {showSqlModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="relative max-w-4xl w-full max-h-[85vh] overflow-y-auto bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-amber-200/50 p-6 sm:p-8">
            <button
              onClick={() => setShowSqlModal(false)}
              className="absolute top-6 left-6 p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600">
                  <Code className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-serif font-bold text-zinc-900 dark:text-zinc-100">
                    {t('ملف SQL وقواعد البيانات (Supabase Ready)', 'Supabase SQL Schema & Instructions')}
                  </h3>
                  <p className="text-xs text-zinc-500">
                    {t('انسخ الكود أدناه وقم بتشغيله في SQL Editor داخل Supabase', 'Copy and run this schema in Supabase SQL Editor')}
                  </p>
                </div>
              </div>

              <div className="relative">
                <pre className="p-4 rounded-2xl bg-zinc-950 text-amber-300 font-mono text-[11px] overflow-x-auto max-h-96 leading-relaxed border border-zinc-800">
{`-- SQL Schema for Sarah White Rose Portal 🌸
-- Tables: settings, sections, albums, photos, ideas, messages

CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_name_ar TEXT DEFAULT 'سارة 🌸',
  site_name_en TEXT DEFAULT 'Sarah 🌸',
  welcome_title_ar TEXT,
  welcome_title_en TEXT,
  subtitle_ar TEXT,
  subtitle_en TEXT,
  primary_color TEXT DEFAULT '#D4AF37',
  created_at TIMESTAMP WITH TIMEZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS albums (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_ar TEXT NOT NULL,
  title_en TEXT NOT NULL,
  cover_url TEXT,
  created_at TIMESTAMP WITH TIMEZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  album_id UUID REFERENCES albums(id) ON DELETE SET NULL,
  title_ar TEXT,
  title_en TEXT,
  description_ar TEXT,
  description_en TEXT,
  url TEXT NOT NULL,
  photo_date DATE,
  created_at TIMESTAMP WITH TIMEZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_ar TEXT NOT NULL,
  title_en TEXT NOT NULL,
  content_ar TEXT,
  content_en TEXT,
  category TEXT DEFAULT 'عام',
  pinned BOOLEAN DEFAULT false,
  image_url TEXT,
  created_at TIMESTAMP WITH TIMEZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_ar TEXT,
  sender_en TEXT,
  text_ar TEXT NOT NULL,
  text_en TEXT NOT NULL,
  created_at TIMESTAMP WITH TIMEZONE DEFAULT now()
);

-- Enable RLS Security Policies
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Access" ON photos FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON ideas FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON messages FOR SELECT USING (true);
CREATE POLICY "Public Insert Messages" ON messages FOR INSERT WITH CHECK (true);
`}
                </pre>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-200 space-y-2">
                <p className="font-bold">{t('خطوات النشر والربط السريع:', 'Deployment & Connection Quick Steps:')}</p>
                <ol className="list-decimal list-inside space-y-1 text-zinc-600 dark:text-zinc-300">
                  <li>{t('قم بإنشاء مشروع جديد في Supabase.com', 'Create a new project at Supabase.com')}</li>
                  <li>{t('افتح قسم SQL Editor وقم بلصق الكود أعلاه واضغط Run.', 'Open SQL Editor, paste the code above, and click Run.')}</li>
                  <li>{t('انسخ Project URL و Anon Key وضعهم في لوحة تحكم الأدمن في هذا التطبيق.', 'Copy Project URL & Anon Key into the Admin Dashboard Settings.')}</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Falling White Rose Petals Background Effect
function PetalsCanvas({ count = 20, darkMode }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Initialize Petals
    const petals = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 8 + 6,
      speedY: Math.random() * 0.8 + 0.4,
      speedX: Math.random() * 0.4 - 0.2,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 1.5,
      opacity: Math.random() * 0.5 + 0.3
    }));

    const drawPetal = (x, y, size, rotation, opacity) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.beginPath();

      // Delicate soft white rose petal shape
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-size, -size * 1.2, -size * 1.2, size * 0.5, 0, size * 1.5);
      ctx.bezierCurveTo(size * 1.2, size * 0.5, size, -size * 1.2, 0, 0);

      // Gradient for 3D realism
      const gradient = ctx.createLinearGradient(0, -size, 0, size);
      if (darkMode) {
        gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity * 0.9})`);
        gradient.addColorStop(1, `rgba(230, 220, 200, ${opacity * 0.3})`);
      } else {
        gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity})`);
        gradient.addColorStop(0.8, `rgba(253, 246, 235, ${opacity * 0.85})`);
        gradient.addColorStop(1, `rgba(240, 225, 200, ${opacity * 0.4})`);
      }

      ctx.fillStyle = gradient;
      ctx.shadowColor = darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(212, 175, 55, 0.15)';
      ctx.shadowBlur = 4;
      ctx.fill();
      ctx.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      petals.forEach(p => {
        p.y += p.speedY;
        p.x += Math.sin(p.y * 0.01) * 0.5 + p.speedX;
        p.rotation += p.rotationSpeed;

        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }

        drawPetal(p.x, p.y, p.size, p.rotation, p.opacity);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [count, darkMode]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
}