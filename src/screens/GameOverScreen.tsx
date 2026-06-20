import React from 'react'

interface Props {
  winner: string
  onRematch: () => void
}

export default function GameOverScreen({ winner, onRematch }: Props) {
  return (
    <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center gap-8 p-6">
      <div className="text-center">
        <p className="text-base-content/60 text-lg mb-2">勝利隊伍</p>
        <h1 className="text-5xl font-black text-primary">{winner}</h1>
      </div>

      <button className="btn btn-primary btn-lg px-10" onClick={onRematch}>
        Rematch
      </button>
    </div>
  )
}
