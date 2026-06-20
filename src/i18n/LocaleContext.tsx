import React, { createContext, useContext, useState } from 'react'
import { STRINGS, type Locale, type Strings } from './strings'

interface LocaleContextValue {
  locale: Locale
  setLocale: (l: Locale) => void
  t: (key: keyof Strings) => string
}

const STORAGE_KEY = 'pb-locale'
const DEFAULT_LOCALE: Locale = 'zh-TW'

function isValidLocale(v: string | null): v is Locale {
  return v === 'zh-TW' || v === 'en'
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const stored = localStorage.getItem(STORAGE_KEY)
  const initial: Locale = isValidLocale(stored) ? stored : DEFAULT_LOCALE

  const [locale, setLocaleState] = useState<Locale>(initial)

  function setLocale(l: Locale) {
    localStorage.setItem(STORAGE_KEY, l)
    setLocaleState(l)
  }

  function t(key: keyof Strings): string {
    return STRINGS[locale][key]
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider')
  return ctx
}
