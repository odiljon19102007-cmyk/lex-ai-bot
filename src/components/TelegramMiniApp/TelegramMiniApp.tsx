import React, { useState } from 'react';
import { 
  Scale, Home, MessageSquare, BookOpen, FileText, 
  User, Moon, Sun, ArrowLeft, Smartphone, Monitor,
  Sparkles, ExternalLink, ShieldCheck, ChevronLeft,
  Calculator, Briefcase, GraduationCap, Settings as SettingsIcon
} from 'lucide-react';
import { TelegramProvider, useTelegram } from './TelegramContext';
import { DashboardView } from './DashboardView';
import { LegalAIChatView } from './LegalAIChatView';
import { LawCatalogView } from './LawCatalogView';
import { ArticleSearchView } from './ArticleSearchView';
import { DocumentDraftingView } from './DocumentDraftingView';
import { CaseAnalysisView } from './CaseAnalysisView';
import { LawComparisonView } from './LawComparisonView';
import { MibView } from './MibView';
import { GuideView } from './GuideView';
import { SettingsProfileView } from './SettingsProfileView';
import { ImageLegalSolverView } from './ImageLegalSolverView';
import { LegalCalculatorsView } from './LegalCalculatorsView';
import { LegalCaseManagerView } from './LegalCaseManagerView';
import { LegalAcademyView } from './LegalAcademyView';
import { AdminDashboardView } from './AdminDashboardView';
import { CyberDefenseView } from './CyberDefenseView';
import { LegalIqCertificateView } from './LegalIqCertificateView';

const MiniAppContent: React.FC = () => {
  const { theme, toggleTheme, haptic, isInsideTelegram, language } = useTelegram();
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [activeBottomTab, setActiveBottomTab] = useState<string>('home');
  const [initialAIQuery, setInitialAIQuery] = useState<string | undefined>(undefined);
  const [isPhoneFrame, setIsPhoneFrame] = useState<boolean>(!isInsideTelegram);

  const isDark = theme === 'dark';

  const navigateTo = (view: string, query?: string) => {
    haptic('medium');
    setCurrentView(view);
    if (query) setInitialAIQuery(query);

    // Sync bottom tab
    if (view === 'dashboard') setActiveBottomTab('home');
    else if (view === 'ai') setActiveBottomTab('ai');
    else if (view === 'codes' || view === 'article_search') setActiveBottomTab('codes');
    else if (view === 'docs' || view === 'case_analysis' || view === 'compare' || view === 'mib' || view === 'image_solver') setActiveBottomTab('docs');
    else if (view === 'settings' || view === 'guide' || view === 'admin') setActiveBottomTab('profile');
  };

  const handleBottomTabClick = (tabId: string) => {
    haptic('light');
    setActiveBottomTab(tabId);
    if (tabId === 'home') setCurrentView('dashboard');
    else if (tabId === 'ai') setCurrentView('ai');
    else if (tabId === 'codes') setCurrentView('codes');
    else if (tabId === 'docs') setCurrentView('docs');
    else if (tabId === 'profile') setCurrentView('settings');
  };

  const renderActiveView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView onNavigate={navigateTo} />;
      case 'ai':
        return (
          <LegalAIChatView 
            initialQuery={initialAIQuery} 
            onClearInitialQuery={() => setInitialAIQuery(undefined)} 
          />
        );
      case 'codes':
        return (
          <LawCatalogView 
            onSelectArticle={(query) => navigateTo('ai', query)} 
          />
        );
      case 'article_search':
        return <ArticleSearchView />;
      case 'image_solver':
        return <ImageLegalSolverView onBackToDashboard={() => navigateTo('dashboard')} />;
      case 'calculators':
        return <LegalCalculatorsView />;
      case 'case_manager':
        return <LegalCaseManagerView />;
      case 'academy':
        return <LegalAcademyView />;
      case 'admin':
        return <AdminDashboardView />;
      case 'docs':
        return <DocumentDraftingView />;
      case 'case_analysis':
        return <CaseAnalysisView />;
      case 'compare':
        return <LawComparisonView />;
      case 'mib':
        return <MibView />;
      case 'guide':
        return <GuideView />;
      case 'settings':
        return <SettingsProfileView />;
      case 'cyber_shield':
        return <CyberDefenseView />;
      case 'legal_iq':
        return <LegalIqCertificateView />;
      default:
        return <DashboardView onNavigate={navigateTo} />;
    }
  };

  const getPageTitle = () => {
    switch (currentView) {
      case 'dashboard': return 'LexAI 2.0';
      case 'ai': return 'Huquqiy AI';
      case 'codes': return 'Qonunchilik bazasi';
      case 'article_search': return 'Modda qidirish';
      case 'image_solver': return 'Rasm & Test Yechish';
      case 'calculators': return 'Huquqiy Kalkulyatorlar';
      case 'case_manager': return 'Shaxsiy Ishlar';
      case 'academy': return 'Huquqiy Akademiya';
      case 'admin': return 'Admin Paneli';
      case 'cyber_shield': return 'Kiberhimoya & Karta Firibgarligi';
      case 'legal_iq': return 'Huquqiy IQ Sertifikati';
      case 'docs': return 'Hujjat tayyorlash';
      case 'case_analysis': return 'Kazus tahlili';
      case 'compare': return 'Qonunlarni solishtirish';
      case 'mib': return 'MIB bo‘limi';
      case 'guide': return 'Foydalanish qo‘llanmasi';
      case 'settings': return 'Sozlamalar';
      default: return 'LexAI 2.0';
    }
  };

  return (
    <div className={`w-full min-h-screen transition-colors duration-200 ${
      isDark ? 'bg-[#060a17] text-slate-100' : 'bg-slate-100 text-slate-800'
    } flex flex-col items-center justify-start`}>
      {/* Top Device & Mode Switcher Bar (Only in browser view) */}
      {!isInsideTelegram && (
        <div className="w-full bg-[#0a1128] text-white border-b border-indigo-950 px-4 py-2.5 flex items-center justify-between text-xs sticky top-0 z-50 shadow-md">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-extrabold tracking-tight text-amber-400">
              Huquq Sphere
            </span>
            <span className="hidden sm:inline text-slate-400">|</span>
            <span className="hidden sm:inline text-slate-300">
              Telegram Mini App (TMA) &amp; Mobil Platforma
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsPhoneFrame(!isPhoneFrame)}
              className="px-2.5 py-1 rounded-lg bg-indigo-900/60 hover:bg-indigo-800 border border-indigo-700/60 text-slate-200 hover:text-white flex items-center gap-1.5 transition cursor-pointer"
              title="Qobiqni almashtirish"
            >
              {isPhoneFrame ? (
                <>
                  <Monitor className="w-3.5 h-3.5 text-sky-400" />
                  <span className="hidden sm:inline">Keng Ko'rinish</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Mobil Smartfon Ko'rinishi</span>
                </>
              )}
            </button>

            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-lg bg-indigo-900/60 hover:bg-indigo-800 border border-indigo-700/60 text-slate-200 hover:text-white transition cursor-pointer"
              title="Mavzuni o'zgartirish"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-amber-300" />}
            </button>
          </div>
        </div>
      )}

      {/* Main Container: Mobile Frame or Full Responsive */}
      <div className={`w-full transition-all duration-300 ${
        isPhoneFrame && !isInsideTelegram
          ? 'max-w-[440px] my-4 rounded-[40px] shadow-2xl border-4 border-slate-800 bg-[#070d1d] overflow-hidden min-h-[820px] relative'
          : 'max-w-4xl mx-auto px-3 sm:px-6 py-4'
      }`}>
        {/* Mobile Header Bar */}
        <div className={`px-4 py-3 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md border-b ${
          isDark 
            ? 'bg-[#070d1d]/90 border-indigo-900/40 text-white' 
            : 'bg-white/90 border-slate-200 text-slate-900'
        }`}>
          <div className="flex items-center space-x-2">
            {currentView !== 'dashboard' && (
              <button
                onClick={() => navigateTo('dashboard')}
                className={`p-1.5 rounded-xl border transition cursor-pointer ${
                  isDark ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-slate-100 text-slate-700 border-slate-300'
                }`}
                title="Orqaga"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-bold shadow-xs">
                <Scale className="w-4 h-4 text-slate-950" />
              </div>
              <h1 className="font-extrabold text-sm sm:text-base tracking-tight truncate max-w-[180px]">
                {getPageTitle()}
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              ● Lex.uz 2026
            </span>
          </div>
        </div>

        {/* View Content Area */}
        <div className="p-3 sm:p-4">
          {renderActiveView()}
        </div>

        {/* Mobile Bottom Navigation Bar: 5 Tabs */}
        <nav className={`fixed bottom-0 left-0 right-0 z-40 border-t backdrop-blur-xl ${
          isPhoneFrame && !isInsideTelegram
            ? 'absolute rounded-b-[36px]'
            : ''
        } ${
          isDark 
            ? 'bg-[#0a1226]/95 border-indigo-900/60 text-slate-400' 
            : 'bg-white/95 border-slate-200 text-slate-500'
        }`}>
          <div className={`max-w-md mx-auto grid grid-cols-5 py-2 px-2`}>
            {/* 1. Bosh sahifa */}
            <button
              onClick={() => handleBottomTabClick('home')}
              className={`flex flex-col items-center justify-center py-1 transition cursor-pointer ${
                activeBottomTab === 'home'
                  ? 'text-amber-400 font-bold'
                  : 'hover:text-slate-200'
              }`}
            >
              <Home className={`w-5 h-5 ${activeBottomTab === 'home' ? 'scale-110 text-amber-400' : ''}`} />
              <span className="text-[10px] mt-1 font-medium">Bosh sahifa</span>
            </button>

            {/* 2. AI */}
            <button
              onClick={() => handleBottomTabClick('ai')}
              className={`flex flex-col items-center justify-center py-1 transition cursor-pointer ${
                activeBottomTab === 'ai'
                  ? 'text-amber-400 font-bold'
                  : 'hover:text-slate-200'
              }`}
            >
              <MessageSquare className={`w-5 h-5 ${activeBottomTab === 'ai' ? 'scale-110 text-amber-400' : ''}`} />
              <span className="text-[10px] mt-1 font-medium">Huquqiy AI</span>
            </button>

            {/* 3. Qonunchilik */}
            <button
              onClick={() => handleBottomTabClick('codes')}
              className={`flex flex-col items-center justify-center py-1 transition cursor-pointer ${
                activeBottomTab === 'codes'
                  ? 'text-amber-400 font-bold'
                  : 'hover:text-slate-200'
              }`}
            >
              <BookOpen className={`w-5 h-5 ${activeBottomTab === 'codes' ? 'scale-110 text-amber-400' : ''}`} />
              <span className="text-[10px] mt-1 font-medium">Qonunlar</span>
            </button>

            {/* 4. Hujjatlar */}
            <button
              onClick={() => handleBottomTabClick('docs')}
              className={`flex flex-col items-center justify-center py-1 transition cursor-pointer ${
                activeBottomTab === 'docs'
                  ? 'text-amber-400 font-bold'
                  : 'hover:text-slate-200'
              }`}
            >
              <FileText className={`w-5 h-5 ${activeBottomTab === 'docs' ? 'scale-110 text-amber-400' : ''}`} />
              <span className="text-[10px] mt-1 font-medium">Hujjatlar</span>
            </button>

            {/* 5. Profil */}
            <button
              onClick={() => handleBottomTabClick('profile')}
              className={`flex flex-col items-center justify-center py-1 transition cursor-pointer ${
                activeBottomTab === 'profile'
                  ? 'text-amber-400 font-bold'
                  : 'hover:text-slate-200'
              }`}
            >
              <User className={`w-5 h-5 ${activeBottomTab === 'profile' ? 'scale-110 text-amber-400' : ''}`} />
              <span className="text-[10px] mt-1 font-medium">Profil</span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
};

export const TelegramMiniApp: React.FC = () => {
  return (
    <TelegramProvider>
      <MiniAppContent />
    </TelegramProvider>
  );
};
