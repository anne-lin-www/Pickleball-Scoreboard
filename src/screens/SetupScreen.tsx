import React, { useState } from 'react'
import type { TeamId } from '../core/types.js'
import { useLocale } from '../i18n/LocaleContext'
import { ThemeToggle } from '../components/ThemeToggle'
import { LangToggle } from '../components/LangToggle'
import CourtDiagramInput, { type CourtDiagramInputState } from '../components/CourtDiagramInput'

type GameMode = 'doubles' | 'singles'
type InputMode = 'form' | 'diagram'

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
  onMidGame: () => void
}

export default function SetupScreen({ onStart, onMidGame }: Props) {
  const { t } = useLocale()
  const [mode, setMode] = useState<GameMode>('doubles')
  const [inputMode, setInputMode] = useState<InputMode>('form')
  const [topTeamId, setTopTeamId] = useState<TeamId>('TEAM_A')
  const [teamAName, setTeamAName] = useState('Team A')
  const [teamBName, setTeamBName] = useState('Team B')
  const [teamAPlayer1, setTeamAPlayer1] = useState('')
  const [teamAPlayer2, setTeamAPlayer2] = useState('')
  const [teamBPlayer1, setTeamBPlayer1] = useState('')
  const [teamBPlayer2, setTeamBPlayer2] = useState('')
  const [firstServingTeam, setFirstServingTeam] = useState<TeamId>('TEAM_A')
  const [gamesCount, setGamesCount] = useState<1 | 3>(1)

  function handleDiagramChange(patch: Partial<CourtDiagramInputState>) {
    if ('teamAName' in patch) setTeamAName(patch.teamAName!)
    if ('teamBName' in patch) setTeamBName(patch.teamBName!)
    if ('teamAPlayer1' in patch) setTeamAPlayer1(patch.teamAPlayer1!)
    if ('teamAPlayer2' in patch) setTeamAPlayer2(patch.teamAPlayer2!)
    if ('teamBPlayer1' in patch) setTeamBPlayer1(patch.teamBPlayer1!)
    if ('teamBPlayer2' in patch) setTeamBPlayer2(patch.teamBPlayer2!)
    if ('topTeamId' in patch) setTopTeamId(patch.topTeamId!)
    if ('firstServingTeam' in patch) setFirstServingTeam(patch.firstServingTeam!)
  }

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

  const showDiagram = mode === 'doubles' && inputMode === 'diagram'
  const showForm = !showDiagram

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

          {/* Game mode selection */}
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

          {/* Input mode toggle — Doubles only */}
          {mode === 'doubles' && (
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">{t('setupInputMode')}</span>
              </label>
              <div className="join w-full">
                <button
                  className={`btn join-item flex-1 ${inputMode === 'form' ? 'btn-secondary' : 'btn-outline'}`}
                  onClick={() => setInputMode('form')}
                >
                  {t('formMode')}
                </button>
                <button
                  className={`btn join-item flex-1 ${inputMode === 'diagram' ? 'btn-secondary' : 'btn-outline'}`}
                  onClick={() => setInputMode('diagram')}
                >
                  {t('diagramMode')}
                </button>
              </div>
            </div>
          )}

          <div className="divider my-0" />

          {/* Court diagram input */}
          {showDiagram && (
            <CourtDiagramInput
              teamAName={teamAName}
              teamBName={teamBName}
              teamAPlayer1={teamAPlayer1}
              teamAPlayer2={teamAPlayer2}
              teamBPlayer1={teamBPlayer1}
              teamBPlayer2={teamBPlayer2}
              topTeamId={topTeamId}
              firstServingTeam={firstServingTeam}
              onChange={handleDiagramChange}
            />
          )}

          {/* Form mode: Team A */}
          {showForm && (
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
                  placeholder={t('playerNamePlaceholder')}
                />
              </div>
              {mode === 'doubles' && (
                <>
                  <div className="flex items-center gap-2">
                    <span className="label-text text-xs text-base-content/60 w-1/3 shrink-0">{t('player2Label')}</span>
                    <input
                      className="input input-bordered input-sm w-2/3"
                      value={teamAPlayer2}
                      onChange={e => setTeamAPlayer2(e.target.value)}
                      placeholder={t('playerNamePlaceholder')}
                    />
                  </div>
                  {firstServingTeam === 'TEAM_A' && (
                    <p className="text-xs text-base-content/50 -mt-1 pl-[calc(33.333%+0.5rem)]">
                      {t('initialServer').replace('{team}', teamAName)}
                    </p>
                  )}
                </>
              )}
            </div>
          )}

          {showForm && <div className="divider my-0" />}

          {/* Form mode: Team B */}
          {showForm && (
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
                  placeholder={t('playerNamePlaceholder')}
                />
              </div>
              {mode === 'doubles' && (
                <>
                  <div className="flex items-center gap-2">
                    <span className="label-text text-xs text-base-content/60 w-1/3 shrink-0">{t('player2Label')}</span>
                    <input
                      className="input input-bordered input-sm w-2/3"
                      value={teamBPlayer2}
                      onChange={e => setTeamBPlayer2(e.target.value)}
                      placeholder={t('playerNamePlaceholder')}
                    />
                  </div>
                  {firstServingTeam === 'TEAM_B' && (
                    <p className="text-xs text-base-content/50 -mt-1 pl-[calc(33.333%+0.5rem)]">
                      {t('initialServer').replace('{team}', teamBName)}
                    </p>
                  )}
                </>
              )}
            </div>
          )}

          {showForm && <div className="divider my-0" />}

          {/* First serving team — form mode only */}
          {showForm && (
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
            </div>
          )}

          {/* Court orientation — form mode only */}
          {showForm && (
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
          )}

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

          <div className="card-actions mt-2 flex-col gap-2">
            <button className="btn btn-primary btn-lg w-full" onClick={handleStart}>
              {t('startGame')}
            </button>
            <div className="flex flex-col items-center gap-1 w-full">
              <span className="text-xs text-base-content/50">{t('midGamePrompt')}</span>
              <button className="btn btn-outline btn-sm w-full" onClick={onMidGame}>
                {t('midGameCta')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
