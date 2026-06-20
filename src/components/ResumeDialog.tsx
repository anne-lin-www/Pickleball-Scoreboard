import React from 'react'
import type { SetupConfig } from '../screens/SetupScreen.js'

interface Props {
  config: SetupConfig
  onResume: () => void
  onNewGame: () => void
  defaultAction: 'resume' | 'new-game'
}

export function ResumeDialog({ config, onResume, onNewGame, defaultAction }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-base-100 rounded-2xl shadow-xl p-8 mx-4 max-w-sm w-full flex flex-col gap-6">
        <div className="text-center">
          <p className="text-base-content/60 text-sm mb-1">比賽進行中</p>
          <h2 className="text-xl font-bold font-sans">
            {config.teamAName} vs {config.teamBName}
          </h2>
        </div>
        <p className="text-center text-base-content/80">要繼續上一場比賽嗎？</p>
        <div className="flex flex-col gap-3">
          <button
            className="btn btn-primary btn-lg font-sans"
            autoFocus={defaultAction === 'resume'}
            onClick={onResume}
          >
            繼續比賽
          </button>
          <button
            className="btn btn-outline font-sans"
            autoFocus={defaultAction === 'new-game'}
            onClick={onNewGame}
          >
            開新局
          </button>
        </div>
      </div>
    </div>
  )
}
