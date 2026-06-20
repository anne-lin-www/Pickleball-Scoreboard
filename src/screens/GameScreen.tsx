import React from 'react'
import type { SetupConfig } from './SetupScreen'
import { mockDoublesState, type MockPlayer, type MockTeam } from '../mock/gameState'

interface Props {
  config: SetupConfig
  onReset: (winner: string) => void
}

// Bird's-eye absolute coordinate positioning:
// Top team faces south (toward the net/bottom of screen):
//   their RIGHT side = screen-LEFT, their LEFT side = screen-RIGHT
// Bottom team faces north (toward the net/top of screen):
//   their LEFT side = screen-LEFT, their RIGHT side = screen-RIGHT
//
// This matches the visual reality of an operator standing at the bottom team's baseline.
function getCourtColumns(team: MockTeam, isTopTeam: boolean): [MockPlayer, MockPlayer] {
  const right = team.players.find(p => p.currentSide === 'RIGHT')!
  const left = team.players.find(p => p.currentSide === 'LEFT')!
  // Top team: RIGHT player on screen-left, LEFT player on screen-right
  // Bottom team: LEFT player on screen-left, RIGHT player on screen-right
  return isTopTeam ? [right, left] : [left, right]
}

function PlayerCell({
  player,
  isServer,
}: {
  player: MockPlayer
  isServer: boolean
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 p-2">
      <span className="text-base md:text-lg font-semibold leading-tight text-center">
        {isServer && <span className="text-warning mr-1">●</span>}
        {player.name}
      </span>
    </div>
  )
}

function CourtHalf({
  team,
  isTopTeam,
  servingTeamId,
  serverNumber,
  tapEnabled,
  onTap,
}: {
  team: MockTeam
  isTopTeam: boolean
  servingTeamId: string
  serverNumber: 1 | 2
  tapEnabled: boolean
  onTap: () => void
}) {
  const isServing = team.id === servingTeamId
  const [screenLeft, screenRight] = getCourtColumns(team, isTopTeam)

  function getIsServer(player: MockPlayer): boolean {
    if (!isServing) return false
    // Server number 1 = anchor player (isStartingRight), server 2 = the other
    const anchorId = team.players.find(p => p.isStartingRight)?.id
    return serverNumber === 1 ? player.id === anchorId : player.id !== anchorId
  }

  return (
    <div
      className={`flex-1 flex divide-x divide-base-300 ${tapEnabled ? 'cursor-pointer active:opacity-70' : ''} ${isServing ? 'bg-base-200' : 'bg-base-100'}`}
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
  const state = mockDoublesState
  const topTeam = state.topTeam
  const bottomTeam = state.bottomTeam

  const servingTeam = state.servingTeamId === topTeam.id ? topTeam : bottomTeam
  const receivingTeam = state.servingTeamId === topTeam.id ? bottomTeam : topTeam

  const tapEnabled = state.tapCourtEnabled

  return (
    <div className="min-h-screen bg-base-300 flex flex-col">

      {/* Team name header */}
      <div className="flex justify-between items-center px-4 py-2 bg-base-100 shadow text-sm font-semibold">
        <span>{topTeam.name}</span>
        <span className="text-xs text-base-content/50">vs</span>
        <span>{bottomTeam.name}</span>
      </div>

      {/* Court */}
      <div className="flex-1 flex flex-col mx-4 my-3 rounded-xl overflow-hidden border-2 border-base-content/20 shadow-lg" style={{ minHeight: '55vh' }}>
        {/* Top half */}
        <CourtHalf
          team={topTeam}
          isTopTeam={true}
          servingTeamId={state.servingTeamId}
          serverNumber={state.serverNumber}
          tapEnabled={tapEnabled}
          onTap={() => console.log(`${topTeam.name} scores`)}
        />

        {/* Net */}
        <div className="flex items-center justify-center py-1 bg-base-content/80">
          <span className="text-xs font-bold tracking-widest text-base-100 uppercase">NET</span>
        </div>

        {/* Bottom half */}
        <CourtHalf
          team={bottomTeam}
          isTopTeam={false}
          servingTeamId={state.servingTeamId}
          serverNumber={state.serverNumber}
          tapEnabled={tapEnabled}
          onTap={() => console.log(`${bottomTeam.name} scores`)}
        />
      </div>

      {/* Three-segment score */}
      <div className="text-center py-2">
        <div className="inline-flex items-center gap-2 bg-base-100 rounded-2xl px-6 py-3 shadow">
          <span className="text-5xl font-black tabular-nums">{servingTeam.score}</span>
          <span className="text-2xl text-base-content/40 font-light">–</span>
          <span className="text-5xl font-black tabular-nums">{receivingTeam.score}</span>
          <span className="text-2xl text-base-content/40 font-light">–</span>
          <span className="text-5xl font-black tabular-nums">{state.serverNumber}</span>
        </div>
        <p className="text-xs text-base-content/40 mt-1">發球方 – 接球方 – 發球序號</p>
      </div>

      {/* Fixed scoring buttons */}
      <div className="grid grid-cols-2 gap-3 px-4 pb-2">
        <button
          className="btn btn-success btn-lg text-lg"
          onClick={() => console.log(`${topTeam.name} +1`)}
        >
          {topTeam.name} +1
        </button>
        <button
          className="btn btn-success btn-lg text-lg"
          onClick={() => console.log(`${bottomTeam.name} +1`)}
        >
          {bottomTeam.name} +1
        </button>
      </div>

      {/* Undo / Reset */}
      <div className="grid grid-cols-2 gap-3 px-4 pb-4">
        <button
          className="btn btn-outline btn-warning"
          onClick={() => console.log('undo')}
        >
          ↩ Undo
        </button>
        <button
          className="btn btn-outline btn-error"
          onClick={() => onReset(topTeam.name)}
        >
          Reset
        </button>
      </div>
    </div>
  )
}
