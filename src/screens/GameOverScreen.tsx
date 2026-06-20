import React from 'react'
import { useLocale } from '../i18n/LocaleContext'

interface Props {
  winner: string
  onRematch: () => void
}

export default function GameOverScreen({ winner, onRematch }: Props) {
  const { t } = useLocale()
  return (
    <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center gap-8 p-6">
      <div className="text-center">
        <p className="font-sans text-base-content/60 text-lg mb-2">{t('winnerLabel')}</p>
        <h1 className="font-sans text-5xl font-black text-primary">{winner}</h1>
      </div>

      <button className="btn btn-primary btn-lg px-10 font-sans" onClick={onRematch}>
        {t('rematch')}
      </button>
    </div>
  )
}
