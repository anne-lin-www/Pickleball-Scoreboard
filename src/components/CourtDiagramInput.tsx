import React from 'react'
import type { TeamId } from '../core/types.js'
import { useLocale } from '../i18n/LocaleContext.js'

export interface CourtDiagramInputState {
  teamAName: string
  teamBName: string
  teamAPlayer1: string
  teamAPlayer2: string
  teamBPlayer1: string
  teamBPlayer2: string
  topTeamId: TeamId
  firstServingTeam: TeamId
}

interface CourtDiagramInputProps extends CourtDiagramInputState {
  onChange: (patch: Partial<CourtDiagramInputState>) => void
}

export default function CourtDiagramInput({
  teamAName, teamBName,
  teamAPlayer1, teamAPlayer2,
  teamBPlayer1, teamBPlayer2,
  topTeamId, firstServingTeam,
  onChange,
}: CourtDiagramInputProps) {
  const { t } = useLocale()

  const bottomTeamId: TeamId = topTeamId === 'TEAM_A' ? 'TEAM_B' : 'TEAM_A'

  const topTeamName = topTeamId === 'TEAM_A' ? teamAName : teamBName
  const topPlayer1  = topTeamId === 'TEAM_A' ? teamAPlayer1 : teamBPlayer1
  const topPlayer2  = topTeamId === 'TEAM_A' ? teamAPlayer2 : teamBPlayer2
  const botTeamName = topTeamId === 'TEAM_A' ? teamBName : teamAName
  const botPlayer1  = topTeamId === 'TEAM_A' ? teamBPlayer1 : teamAPlayer1
  const botPlayer2  = topTeamId === 'TEAM_A' ? teamBPlayer2 : teamAPlayer2

  function setTopTeamName(v: string) {
    onChange(topTeamId === 'TEAM_A' ? { teamAName: v } : { teamBName: v })
  }
  function setTopPlayer1(v: string) {
    onChange(topTeamId === 'TEAM_A' ? { teamAPlayer1: v } : { teamBPlayer1: v })
  }
  function setTopPlayer2(v: string) {
    onChange(topTeamId === 'TEAM_A' ? { teamAPlayer2: v } : { teamBPlayer2: v })
  }
  function setBotTeamName(v: string) {
    onChange(topTeamId === 'TEAM_A' ? { teamBName: v } : { teamAName: v })
  }
  function setBotPlayer1(v: string) {
    onChange(topTeamId === 'TEAM_A' ? { teamBPlayer1: v } : { teamAPlayer1: v })
  }
  function setBotPlayer2(v: string) {
    onChange(topTeamId === 'TEAM_A' ? { teamBPlayer2: v } : { teamAPlayer2: v })
  }

  const topServing = firstServingTeam === topTeamId

  function handleHalfClick(e: React.MouseEvent<HTMLDivElement>, teamId: TeamId) {
    if ((e.target as HTMLElement).tagName === 'INPUT') return
    onChange({ firstServingTeam: teamId })
  }

  const halfBase = 'p-3 min-h-[120px] cursor-pointer transition-colors'
  const topClass  = `${halfBase} ${topServing ? 'bg-secondary/10' : 'bg-base-100'}`
  const botClass  = `${halfBase} ${!topServing ? 'bg-secondary/10' : 'bg-base-100'}`

  return (
    <div className="border border-base-300 rounded-box overflow-hidden">
      {/* Top half */}
      <div className={topClass} onClick={e => handleHalfClick(e, topTeamId)}>
        <input
          className="input input-bordered input-sm w-full font-semibold mb-2"
          value={topTeamName}
          onChange={e => setTopTeamName(e.target.value)}
          placeholder={t('teamName')}
        />
        <div className="grid grid-cols-2 gap-1 text-xs text-base-content/50 mb-1">
          <span className="text-center">{t('player1Label')}</span>
          <span className="text-center">{t('player2Label')}</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <input
            className="input input-bordered input-sm w-full"
            value={topPlayer1}
            onChange={e => setTopPlayer1(e.target.value)}
            placeholder={t('player1')}
          />
          <input
            className="input input-bordered input-sm w-full"
            value={topPlayer2}
            onChange={e => setTopPlayer2(e.target.value)}
            placeholder={t('player2')}
          />
        </div>
      </div>

      {/* Net divider */}
      <div className="bg-base-300 text-center text-xs font-semibold py-1 text-base-content/60 select-none">
        {t('net')}
      </div>

      {/* Bottom half */}
      <div className={botClass} onClick={e => handleHalfClick(e, bottomTeamId)}>
        <div className="grid grid-cols-2 gap-1 text-xs text-base-content/50 mb-1">
          <span className="text-center">{t('player1Label')}</span>
          <span className="text-center">{t('player2Label')}</span>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <input
            className="input input-bordered input-sm w-full"
            value={botPlayer1}
            onChange={e => setBotPlayer1(e.target.value)}
            placeholder={t('player1')}
          />
          <input
            className="input input-bordered input-sm w-full"
            value={botPlayer2}
            onChange={e => setBotPlayer2(e.target.value)}
            placeholder={t('player2')}
          />
        </div>
        <input
          className="input input-bordered input-sm w-full font-semibold"
          value={botTeamName}
          onChange={e => setBotTeamName(e.target.value)}
          placeholder={t('teamName')}
        />
      </div>
    </div>
  )
}
