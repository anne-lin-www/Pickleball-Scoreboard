import React from 'react'
import { useLocale } from '../i18n/LocaleContext'

export function LangToggle() {
  const { locale, setLocale } = useLocale()
  return (
    <button
      className="btn btn-ghost btn-sm px-2 font-semibold text-xs"
      onClick={() => setLocale(locale === 'zh-TW' ? 'en' : 'zh-TW')}
      aria-label="切換語言"
    >
      {locale === 'zh-TW' ? '繁中' : 'EN'}
    </button>
  )
}
