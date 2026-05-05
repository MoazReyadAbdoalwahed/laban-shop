import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from './locales/en.json';
import arTranslations from './locales/ar.json';

const resources = {
    en: {
        translation: enTranslations
    },
    ar: {
        translation: arTranslations
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: localStorage.getItem('language') || 'ar',
        fallbackLng: 'ar',
        interpolation: {
            escapeValue: false
        }
    });

const setDocumentDirection = (lang: string) => {
    const dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
};

// Set on initial load
setDocumentDirection(i18n.language);

// Set on every language change
i18n.on('languageChanged', setDocumentDirection);

export default i18n;
