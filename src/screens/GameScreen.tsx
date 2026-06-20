import React from 'react'
import type { SetupConfig } from './SetupScreen'
import { mockDoublesState, type MockPlayer, type MockTeam } from '../mock/gameState'
import { useLocale } from '../i18n/LocaleContext'

interface Props {
  config: SetupConfig
  onReset: (winner: string) => void
}

// Bird's-eye absolute coordinate positioning:
// Top team faces south: their RIGHT side = screen-LEFT, their LEFT = screen-RIGHT
// Bottom team faces north: their LEFT side = screen-LEFT, their RIGHT = screen-RIGHT
function getCourtColumns(team: MockTeam, isTopTeam: boolean): [MockPlayer, MockPlayer] {
  const right = team.players.find(p => p.currentSide === 'RIGHT')!
  const left = team.players.find(p => p.currentSide === 'LEFT')!
  return isTopTeam ? [right, left] : [left, right]
}

function PlayerCell({ player, isServer }: { player: MockPlayer; isServer: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 p-2">
      <span className="font-sans text-base md:text-lg font-semibold leading-tight text-center">
        {isServer && <span className="text-accent mr-1">●</span>}
        {player.name}
      </span>
    </div>
  )
}

function CourtHalf({
  team,
  isTopTeam,
  isTopTeamA,
  servingTeamId,
  serverNumber,
  tapEnabled,
  onTap,
}: {
  team: MockTeam
  isTopTeam: boolean
  isTopTeamA: boolean
  servingTeamId: string
  serverNumber: 1 | 2
  tapEnabled: boolean
  onTap: () => void
}) {
  const isServing = team.id === servingTeamId
  const [screenLeft, screenRight] = getCourtColumns(team, isTopTeam)

  // Determine if this half belongs to Team A or Team B for color theming
  const isTeamA = isTopTeam ? isTopTeamA : !isTopTeamA

  function getServingBg(): string {
    if (!isServing) return 'bg-base-100'
    return isTeamA ? 'bg-primary/10' : 'bg-secondary/10'
  }

  function getIsServer(player: MockPlayer): boolean {
    if (!isServing) return false
    const anchorId = team.players.find(p => p.isStartingRight)?.id
    return serverNumber === 1 ? player.id === anchorId : player.id !== anchorId
  }

  return (
    <div
      className={`flex-1 flex divide-x divide-base-300 ${tapEnabled ? 'cursor-pointer active:opacity-70' : ''} ${getServingBg()}`}
      onClick={tapEnabled ? onTap : undefined}
    >
      <div className="flex-1 flex items-center justify-center">
        <PlayerCell player={screenLeft} isServer={getIsServer(screenLeft)} />
      </div>
      <div className="flex-1 flex items-center justify-center">
        <PlayerCell player={screenRight} isServer={getIsServer(screenRight)} />
      </div>
    </div>
  )
}

export default function GameScreen({ config, onReset }: Props) {
  const { t } = useLocale()
  const state = mockDoublesState
  const topTeam = state.topTeam
  const bottomTeam = state.bottomTeam

  // Determine which team is Team A to drive theming
  const isTopTeamA = topTeam.id === 'TEAM_A'

  const servingTeam = state.servingTeamId === topTeam.id ? topTeam : bottomTeam
  const receivingTeam = state.servingTeamId === topTeam.id ? bottomTeam : topTeam
  const isServingTeamA = servingTeam.id === 'TEAM_A'

  const tapEnabled = state.tapCourtEnabled

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
          servingTeamId={state.servingTeamId}
          serverNumber={state.serverNumber}
          tapEnabled={tapEnabled}
          onTap={() => console.log(`${topTeam.name} scores`)}
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
          servingTeamId={state.servingTeamId}
          serverNumber={state.serverNumber}
          tapEnabled={tapEnabled}
          onTap={() => console.log(`${bottomTeam.name} scores`)}
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
            {state.serverNumber}
          </span>
        </div>
        <p className="font-sans text-xs text-base-content/40 mt-1">{t('scoreLabel')}</p>
      </div>

      {/* Scoring buttons */}
      <div className="grid grid-cols-2 gap-3 px-4 pb-2">
        <button
          className={`btn btn-lg text-lg font-sans ${isTopTeamA ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => console.log(`${topTeam.name} +1`)}
        >
          {topTeam.name} +1
        </button>
        <button
          className={`btn btn-lg text-lg font-sans ${isTopTeamA ? 'btn-secondary' : 'btn-primary'}`}
          onClick={() => console.log(`${bottomTeam.name} +1`)}
        >
          {bottomTeam.name} +1
        </button>
      </div>

      {/* Undo / Reset */}
      <div className="grid grid-cols-2 gap-3 px-4 pb-4">
        <button
          className="btn btn-outline font-sans"
          onClick={() => console.log('undo')}
        >
          {t('undo')}
        </button>
        <button
          className="btn btn-outline btn-error font-sans"
          onClick={() => onReset(topTeam.name)}
        >
          {t('reset')}
        </button>
      </div>
    </div>
  )
}
