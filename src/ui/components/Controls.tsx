import styles from './Controls.module.css'

type Props = {
  gameOver: boolean
  labels: {
    undo: string
    newGame: string
  }
  teamLabels: {
    A: string
    B: string
  }
  onNewGame: () => void
  onScore: (team: 'A' | 'B') => void
  onUndo: () => void
}

export function Controls({
  gameOver,
  labels,
  teamLabels,
  onNewGame,
  onScore,
  onUndo,
}: Props) {
  if (gameOver) {
    return (
      <div className={styles.controls}>
        <button type="button" className={styles.newGameButton} onClick={onNewGame}>
          {labels.newGame}
        </button>
      </div>
    )
  }

  return (
    <div className={styles.controls}>
      <button type="button" className={styles.undoButton} onClick={onUndo}>
        ↩ {labels.undo}
      </button>
      <button type="button" className={styles.teamAButton} onClick={() => onScore('A')}>
        +{teamLabels.A}
      </button>
      <button type="button" className={styles.teamBButton} onClick={() => onScore('B')}>
        +{teamLabels.B}
      </button>
    </div>
  )
}
