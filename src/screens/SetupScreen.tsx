import React, { useState } from 'react'
import type { TeamId } from '../core/types.js'

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
}

interface Props {
  onStart: (config: SetupConfig) => void
}

export default function SetupScreen({ onStart }: Props) {
  const [mode, setMode] = useState<GameMode>('doubles')
  const [topTeamId, setTopTeamId] = useState<TeamId>('TEAM_A')
  const [teamAName, setTeamAName] = useState('Team A')
  const [teamBName, setTeamBName] = useState('Team B')
  const [teamAPlayer1, setTeamAPlayer1] = useState('Player 1')
  const [teamAPlayer2, setTeamAPlayer2] = useState('Player 2')
  const [teamBPlayer1, setTeamBPlayer1] = useState('Player 1')
  const [teamBPlayer2, setTeamBPlayer2] = useState('Player 2')
  const [firstServingTeam, setFirstServingTeam] = useState<TeamId>('TEAM_A')

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
    })
  }

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="card bg-base-100 shadow-xl w-full max-w-md">
        <div className="card-body gap-4">
          <h1 className="card-title text-2xl justify-center">Pickleball Scoreboard</h1>

          {/* Mode selection */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">遊戲模式</span>
            </label>
            <div className="join w-full">
              <button
                className={`btn join-item flex-1 ${mode === 'doubles' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setMode('doubles')}
              >
                雙打
              </button>
              <button
                className={`btn join-item flex-1 ${mode === 'singles' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setMode('singles')}
              >
                單打
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
              placeholder="Team A 名稱"
            />
            <input
              className="input input-bordered input-sm"
              value={teamAPlayer1}
              onChange={e => setTeamAPlayer1(e.target.value)}
              placeholder="球員 1 名稱"
            />
            {mode === 'doubles' && (
              <input
                className="input input-bordered input-sm"
                value={teamAPlayer2}
                onChange={e => setTeamAPlayer2(e.target.value)}
                placeholder="球員 2 名稱"
              />
            )}
          </div>

          <div className="divider my-0" />

          {/* Team B */}
          <div className="form-control gap-2">
            <input
              className="input input-bordered font-semibold"
              value={teamBName}
              onChange={e => setTeamBName(e.target.value)}
              placeholder="Team B 名稱"
            />
            <input
              className="input input-bordered input-sm"
              value={teamBPlayer1}
              onChange={e => setTeamBPlayer1(e.target.value)}
              placeholder="球員 1 名稱"
            />
            {mode === 'doubles' && (
              <input
                className="input input-bordered input-sm"
                value={teamBPlayer2}
                onChange={e => setTeamBPlayer2(e.target.value)}
                placeholder="球員 2 名稱"
              />
            )}
          </div>

          <div className="divider my-0" />

          {/* First serving team */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">首先發球</span>
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

          {/* Court orientation */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">球場方向（上半場）</span>
            </label>
            <div className="join w-full">
              <button
                className={`btn join-item flex-1 ${topTeamId === 'TEAM_A' ? 'btn-accent' : 'btn-outline'}`}
                onClick={() => setTopTeamId('TEAM_A')}
              >
                {teamAName} 在上
              </button>
              <button
                className={`btn join-item flex-1 ${topTeamId === 'TEAM_B' ? 'btn-accent' : 'btn-outline'}`}
                onClick={() => setTopTeamId('TEAM_B')}
              >
                {teamBName} 在上
              </button>
            </div>
          </div>

          <div className="card-actions mt-2">
            <button className="btn btn-primary btn-lg w-full" onClick={handleStart}>
              開始比賽
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
