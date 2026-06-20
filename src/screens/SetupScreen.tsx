import React, { useState } from 'react'
import type { TeamId } from '../core/types.js'
import { useLocale } from '../i18n/LocaleContext'
import { ThemeToggle } from '../components/ThemeToggle'
import { LangToggle } from '../components/LangToggle'

type GameMode = 'doubles' | 'singles'

export interface SetupConfig {
  mode: GameMode
  topTeamId: TeamId
  teamAName: string
  teamBName: string
  teamAPlayer1: string
  teamAPlayer2: string
  teamBPlayer1: string
  teamBPlayer2: string
  firstServingTeam: TeamId
  gamesCount: 1 | 3
}

interface Props {
  onStart: (config: SetupConfig) => void
}

export default function SetupScreen({ onStart }: Props) {
  const { t } = useLocale()
  const [mode, setMode] = useState<GameMode>('doubles')
  const [topTeamId, setTopTeamId] = useState<TeamId>('TEAM_A')
  const [teamAName, setTeamAName] = useState('Team A')
  const [teamBName, setTeamBName] = useState('Team B')
  const [teamAPlayer1, setTeamAPlayer1] = useState('Player 1')
  const [teamAPlayer2, setTeamAPlayer2] = useState('Player 2')
  const [teamBPlayer1, setTeamBPlayer1] = useState('Player 1')
  const [teamBPlayer2, setTeamBPlayer2] = useState('Player 2')
  const [firstServingTeam, setFirstServingTeam] = useState<TeamId>('TEAM_A')
  const [gamesCount, setGamesCount] = useState<1 | 3>(1)

  function handleStart() {
    onStart({
      mode,
      topTeamId,
      teamAName,
      teamBName,
      teamAPlayer1,
      teamAPlayer2,
      teamBPlayer1,
      teamBPlayer2,
      firstServingTeam,
      gamesCount,
    })
  }

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="card bg-base-100 shadow-xl w-full max-w-md">
        <div className="card-body gap-4">

          {/* Header with toggles */}
          <div className="flex items-center justify-between">
            <h1 className="card-title text-xl">Pickleball Scoreboard</h1>
            <div className="flex items-center gap-1">
              <LangToggle />
              <ThemeToggle />
            </div>
          </div>

          {/* Mode selection */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">{t('gameMode')}</span>
            </label>
            <div className="join w-full">
              <button
                className={`btn join-item flex-1 ${mode === 'doubles' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setMode('doubles')}
              >
                {t('doublesMode')}
              </button>
              <button
                className={`btn join-item flex-1 ${mode === 'singles' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setMode('singles')}
              >
                {t('singlesMode')}
              </button>
            </div>
          </div>

          <div className="divider my-0" />

          {/* Team A */}
          <div className="form-control gap-2">
            <input
              className="input input-bordered font-semibold"
              value={teamAName}
              onChange={e => setTeamAName(e.target.value)}
              placeholder={`${t('teamName')} A`}
            />
            <div className="flex items-center gap-2">
              {mode === 'doubles' && (
                <span className="label-text text-xs text-base-content/60 w-1/3 shrink-0">{t('player1Label')}</span>
              )}
              <input
                className={`input input-bordered input-sm ${mode === 'doubles' ? 'w-2/3' : 'w-full'}`}
                value={teamAPlayer1}
                onChange={e => setTeamAPlayer1(e.target.value)}
                placeholder={t('player1')}
              />
            </div>
            {mode === 'doubles' && (
              <div className="flex items-center gap-2">
                <span className="label-text text-xs text-base-content/60 w-1/3 shrink-0">{t('player2Label')}</span>
                <input
                  className="input input-bordered input-sm w-2/3"
                  value={teamAPlayer2}
                  onChange={e => setTeamAPlayer2(e.target.value)}
                  placeholder={t('player2')}
                />
              </div>
            )}
          </div>

          <div className="divider my-0" />

          {/* Team B */}
          <div className="form-control gap-2">
            <input
              className="input input-bordered font-semibold"
              value={teamBName}
              onChange={e => setTeamBName(e.target.value)}
              placeholder={`${t('teamName')} B`}
            />
            <div className="flex items-center gap-2">
              {mode === 'doubles' && (
                <span className="label-text text-xs text-base-content/60 w-1/3 shrink-0">{t('player1Label')}</span>
              )}
              <input
                className={`input input-bordered input-sm ${mode === 'doubles' ? 'w-2/3' : 'w-full'}`}
                value={teamBPlayer1}
                onChange={e => setTeamBPlayer1(e.target.value)}
                placeholder={t('player1')}
              />
            </div>
            {mode === 'doubles' && (
              <div className="flex items-center gap-2">
                <span className="label-text text-xs text-base-content/60 w-1/3 shrink-0">{t('player2Label')}</span>
                <input
                  className="input input-bordered input-sm w-2/3"
                  value={teamBPlayer2}
                  onChange={e => setTeamBPlayer2(e.target.value)}
                  placeholder={t('player2')}
                />
              </div>
            )}
          </div>

          <div className="divider my-0" />

          {/* First serving team */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">{t('firstServe')}</span>
            </label>
            <div className="join w-full">
              <button
                className={`btn join-item flex-1 ${firstServingTeam === 'TEAM_A' ? 'btn-secondary' : 'btn-outline'}`}
                onClick={() => setFirstServingTeam('TEAM_A')}
              >
                {teamAName}
              </button>
              <button
                className={`btn join-item flex-1 ${firstServingTeam === 'TEAM_B' ? 'btn-secondary' : 'btn-outline'}`}
                onClick={() => setFirstServingTeam('TEAM_B')}
              >
                {teamBName}
              </button>
            </div>
            {mode === 'doubles' && (
              <p className="text-xs text-base-content/50 mt-1">
                {t('initialServer').replace('{team}', firstServingTeam === 'TEAM_A' ? teamAName : teamBName)}
              </p>
            )}
          </div>

          {/* Court orientation */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">{t('courtOrientation')}</span>
            </label>
            <div className="join w-full">
              <button
                className={`btn join-item flex-1 ${topTeamId === 'TEAM_A' ? 'btn-accent' : 'btn-outline'}`}
                onClick={() => setTopTeamId('TEAM_A')}
              >
                {teamAName} {t('topTeam')}
              </button>
              <button
                className={`btn join-item flex-1 ${topTeamId === 'TEAM_B' ? 'btn-accent' : 'btn-outline'}`}
                onClick={() => setTopTeamId('TEAM_B')}
              >
                {teamBName} {t('topTeam')}
              </button>
            </div>
          </div>

          {/* Games count */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">{t('gamesCount')}</span>
            </label>
            <div className="join w-full">
              <button
                className={`btn join-item flex-1 ${gamesCount === 1 ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setGamesCount(1)}
              >
                {t('oneGame')}
              </button>
              <button
                className={`btn join-item flex-1 ${gamesCount === 3 ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setGamesCount(3)}
              >
                {t('bestOfThree')}
              </button>
            </div>
          </div>

          <div className="card-actions mt-2">
            <button className="btn btn-primary btn-lg w-full" onClick={handleStart}>
              {t('startGame')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
