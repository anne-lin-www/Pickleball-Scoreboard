import React, { useState } from 'react'
import type { SetupConfig } from './SetupScreen'
import { useLocale } from '../i18n/LocaleContext'
import type { DoublesGame } from '../core/doubles/DoublesGame'
import type { SinglesGame } from '../core/singles/SinglesGame'
import type { TeamId } from '../core/types'
import { deriveViewModel, type PlayerView, type TeamView } from '../core/gameViewModel'

interface Props {
  game: DoublesGame | SinglesGame
  config: SetupConfig
  onReset: (winner: string) => void
}

// Bird's-eye absolute coordinate positioning:
// Top team faces south: their RIGHT side = screen-LEFT, their LEFT = screen-RIGHT
// Bottom team faces north: their LEFT side = screen-LEFT, their RIGHT = screen-RIGHT
function getCourtColumns(team: TeamView, isTopTeam: boolean): [PlayerView | null, PlayerView | null] {
  if (team.players.length === 1) {
    const player = team.players[0] ?? null
    const rightCell: PlayerView | null = player?.side === 'RIGHT' ? player : null
    const leftCell: PlayerView | null = player?.side === 'LEFT' ? player : null
    return isTopTeam ? [rightCell, leftCell] : [leftCell, rightCell]
  }
  const right = team.players.find(p => p.side === 'RIGHT') ?? null
  const left = team.players.find(p => p.side === 'LEFT') ?? null
  return isTopTeam ? [right, left] : [left, right]
}

function PlayerCell({ player, isServer }: { player: PlayerView | null; isServer: boolean }) {
  if (!player) return <div className="flex-1" />
  return (
    <div className="flex flex-col items-center justify-center gap-1 p-2">
      <span className="font-sans text-base md:text-lg font-semibold leading-tight text-center">
        {isServer && <span className="text-accent mr-1">●</span>}
        {player.name}
      </span>
    </div>
  )
}

function getIsServer(player: PlayerView, team: TeamView, isServing: boolean, servingPlayerId: string): boolean {
  if (!isServing) return false
  if (team.players.length === 1) return true
  return player.id === servingPlayerId
}

function CourtHalf({
  team,
  isTopTeam,
  isTopTeamA,
  servingTeamId,
  servingPlayerId,
  tapEnabled,
  onTap,
}: {
  team: TeamView
  isTopTeam: boolean
  isTopTeamA: boolean
  servingTeamId: TeamId
  servingPlayerId: string
  tapEnabled: boolean
  onTap: () => void
}) {
  const isServing = team.id === servingTeamId
  const [screenLeft, screenRight] = getCourtColumns(team, isTopTeam)
  const isTeamA = isTopTeam ? isTopTeamA : !isTopTeamA

  function getServingBg(): string {
    if (!isServing) return 'bg-base-100'
    return isTeamA ? 'bg-primary/10' : 'bg-secondary/10'
  }

  return (
    <div
      className={`flex-1 flex divide-x divide-base-300 ${tapEnabled ? 'cursor-pointer active:opacity-70' : ''} ${getServingBg()}`}
      onClick={tapEnabled ? onTap : undefined}
    >
      <div className="flex-1 flex items-center justify-center">
        <PlayerCell
          player={screenLeft}
          isServer={screenLeft ? getIsServer(screenLeft, team, isServing, servingPlayerId) : false}
        />
      </div>
      <div className="flex-1 flex items-center justify-center">
        <PlayerCell
          player={screenRight}
          isServer={screenRight ? getIsServer(screenRight, team, isServing, servingPlayerId) : false}
        />
      </div>
    </div>
  )
}

export default function GameScreen({ game, config, onReset }: Props) {
  const { t } = useLocale()
  const [viewModel, setViewModel] = useState(() => deriveViewModel(game, config))

  const { topTeam, bottomTeam, servingTeamId, serverNumber, servingPlayerId } = viewModel
  const isTopTeamA = topTeam.id === 'TEAM_A'
  const servingTeam = servingTeamId === topTeam.id ? topTeam : bottomTeam
  const receivingTeam = servingTeamId === topTeam.id ? bottomTeam : topTeam
  const isServingTeamA = servingTeamId === 'TEAM_A'
  const tapEnabled = false

  function handleScore(teamId: TeamId) {
    if (viewModel.mode === 'doubles') {
      ;(game as DoublesGame).winRally(teamId)
    } else {
      ;(game as SinglesGame).winRally(`${teamId}_P1`)
    }
    if (game.getStatus() === 'FINISHED') {
      const updated = deriveViewModel(game, config)
      onReset(updated.winnerName ?? '')
    } else {
      setViewModel(deriveViewModel(game, config))
    }
  }

  function handleUndo() {
    game.undo()
    setViewModel(deriveViewModel(game, config))
  }

  return (
    <div className="min-h-screen bg-base-300 flex flex-col">

      {/* Team name header */}
      <div className="flex justify-between items-center px-4 py-2 bg-base-100 shadow text-sm font-semibold">
        <span className={isTopTeamA ? 'text-primary' : 'text-secondary'}>{topTeam.name}</span>
        <span className="text-xs text-base-content/50">vs</span>
        <span className={isTopTeamA ? 'text-secondary' : 'text-primary'}>{bottomTeam.name}</span>
      </div>

      {/* Court */}
      <div className="flex-1 flex flex-col mx-4 my-3 rounded-xl overflow-hidden border-2 border-base-content/20 shadow-lg" style={{ minHeight: '55vh' }}>
        <CourtHalf
          team={topTeam}
          isTopTeam={true}
          isTopTeamA={isTopTeamA}
          servingTeamId={servingTeamId}
          servingPlayerId={servingPlayerId}
          tapEnabled={tapEnabled}
          onTap={() => handleScore(topTeam.id)}
        />

        {/* Net */}
        <div className="flex items-center justify-center py-1 bg-base-content/80">
          <span className="font-sans text-xs font-bold tracking-widest text-base-100 uppercase">
            {t('net')}
          </span>
        </div>

        <CourtHalf
          team={bottomTeam}
          isTopTeam={false}
          isTopTeamA={isTopTeamA}
          servingTeamId={servingTeamId}
          servingPlayerId={servingPlayerId}
          tapEnabled={tapEnabled}
          onTap={() => handleScore(bottomTeam.id)}
        />
      </div>

      {/* Three-segment score — team-colored */}
      <div className="text-center py-2">
        <div className="inline-flex items-center gap-2 bg-base-100 rounded-2xl px-6 py-3 shadow">
          <span className={`font-sans text-5xl font-black tabular-nums ${isServingTeamA ? 'text-primary' : 'text-secondary'}`}>
            {servingTeam.score}
          </span>
          <span className="text-2xl text-base-content/40 font-light">–</span>
          <span className={`font-sans text-5xl font-black tabular-nums ${isServingTeamA ? 'text-secondary' : 'text-primary'}`}>
            {receivingTeam.score}
          </span>
          <span className="text-2xl text-base-content/40 font-light">–</span>
          <span className="font-sans text-5xl font-black tabular-nums text-accent">
            {serverNumber}
          </span>
        </div>
        <p className="font-sans text-xs text-base-content/40 mt-1">{t('scoreLabel')}</p>
      </div>

      {/* Scoring buttons */}
      <div className="grid grid-cols-2 gap-3 px-4 pb-2">
        <button
          className={`btn btn-lg text-lg font-sans ${isTopTeamA ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => handleScore(topTeam.id)}
        >
          {topTeam.name} +1
        </button>
        <button
          className={`btn btn-lg text-lg font-sans ${isTopTeamA ? 'btn-secondary' : 'btn-primary'}`}
          onClick={() => handleScore(bottomTeam.id)}
        >
          {bottomTeam.name} +1
        </button>
      </div>

      {/* Undo / Reset */}
      <div className="grid grid-cols-2 gap-3 px-4 pb-4">
        <button
          className="btn btn-outline font-sans"
          onClick={handleUndo}
        >
          {t('undo')}
        </button>
        <button
          className="btn btn-outline btn-error font-sans"
          onClick={() => onReset('')}
        >
          {t('reset')}
        </button>
      </div>
    </div>
  )
}
