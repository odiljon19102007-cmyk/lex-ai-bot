import React, { createContext, useContext, useEffect, useState } from 'react';

export interface TelegramUser {
  id?: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
}

interface TelegramContextType {
  isInsideTelegram: boolean;
  tg: any | null;
  user: TelegramUser;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  language: 'uz' | 'ru';
  setLanguage: (lang: 'uz' | 'ru') => void;
  haptic: (type?: 'light' | 'medium' | 'heavy' | 'selection' | 'success' | 'error' | 'warning') => void;
  fontSize: 'sm' | 'md' | 'lg';
  setFontSize: (size: 'sm' | 'md' | 'lg') => void;
}

const TelegramContext = createContext<TelegramContextType | undefined>(undefined);

export const TelegramProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isInsideTelegram, setIsInsideTelegram] = useState(false);
  const [tg, setTg] = useState<any>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [language, setLanguage] = useState<'uz' | 'ru'>('uz');
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [user, setUser] = useState<TelegramUser>({
    id: 123456789,
    first_name: 'Huquqiy',
    last_name: 'Foydalanuvchi',
    username: 'huquq_user',
    language_code: 'uz',
  });

  useEffect(() => {
    const webApp = (window as any).Telegram?.WebApp;
    const isTg = Boolean(
      (webApp && (
        (webApp.initData && webApp.initData.length > 0) ||
        webApp.initDataUnsafe?.user ||
        (webApp.platform && webApp.platform !== 'unknown')
      )) ||
      window.location.hash.includes('tgWebAppData') ||
      window.location.search.includes('tgWebAppPlatform') ||
      window.location.search.includes('mode=miniapp') ||
      window.location.search.includes('tma=true')
    );

    if (isTg) {
      setIsInsideTelegram(true);
      if (webApp) {
        setTg(webApp);
        try {
          webApp.ready?.();
          webApp.expand?.();
          if (webApp.colorScheme === 'light' || webApp.colorScheme === 'dark') {
            setTheme(webApp.colorScheme);
          }
          if (webApp.initDataUnsafe?.user) {
            const u = webApp.initDataUnsafe.user;
            setUser({
              id: u.id,
              first_name: u.first_name,
              last_name: u.last_name,
              username: u.username,
              language_code: u.language_code,
              photo_url: u.photo_url,
            });
            if (u.language_code === 'ru') {
              setLanguage('ru');
            }
          }
        } catch (e) {
          console.warn("Telegram WebApp initialization notice:", e);
        }
      }
    } else {
      // Standalone web preview fallback
      setIsInsideTelegram(false);
    }
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const haptic = (type: 'light' | 'medium' | 'heavy' | 'selection' | 'success' | 'error' | 'warning' = 'light') => {
    try {
      if (tg?.HapticFeedback) {
        if (type === 'selection') {
          tg.HapticFeedback.selectionChanged();
        } else if (type === 'success' || type === 'error' || type === 'warning') {
          tg.HapticFeedback.notificationOccurred(type);
        } else {
          tg.HapticFeedback.impactOccurred(type);
        }
      }
    } catch (e) {}
  };

  return (
    <TelegramContext.Provider
      value={{
        isInsideTelegram,
        tg,
        user,
        theme,
        toggleTheme,
        language,
        setLanguage,
        haptic,
        fontSize,
        setFontSize,
      }}
    >
      {children}
    </TelegramContext.Provider>
  );
};

export const useTelegram = () => {
  const context = useContext(TelegramContext);
  if (!context) {
    throw new Error('useTelegram must be used within a TelegramProvider');
  }
  return context;
};
