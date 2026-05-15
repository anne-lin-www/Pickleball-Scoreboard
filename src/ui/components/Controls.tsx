import styles from './Controls.module.css'

type Props = {
  gameOver: boolean
  canHandOut: boolean
  labels: {
    undo: string
    newGame: string
    handOut: string
  }
  teamLabels: {
    A: string
    B: string
  }
  onNewGame: () => void
  onHandOut: () => void
  onScore: (team: 'A' | 'B') => void
  onUndo: () => void
}

export function Controls({
  gameOver,
  canHandOut,
  labels,
  teamLabels,
  onNewGame,
  onHandOut,
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
      {canHandOut ? (
        <button type="button" className={styles.undoButton} onClick={onHandOut}>
          {labels.handOut}
        </button>
      ) : null}
      <button type="button" className={styles.teamAButton} onClick={() => onScore('A')}>
        +{teamLabels.A}
      </button>
      <button type="button" className={styles.teamBButton} onClick={() => onScore('B')}>
        +{teamLabels.B}
      </button>
    </div>
  )
}
