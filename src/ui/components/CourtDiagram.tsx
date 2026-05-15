import { getCourtLayout, getServerPlayer } from '../../core/rotation'
import type { GameState, Player } from '../../core/types'
import styles from './CourtDiagram.module.css'

type TeamLabels = {
  A: string
  B: string
}

type Props = {
  labels: {
    server: string
    sideLeft: string
    sideRight: string
  }
  state: GameState
  teamLabels: TeamLabels
  onScore: (team: 'A' | 'B') => void
}

const playerToneClass = (state: GameState, serverId: string, player: Player): string => {
  if (player.team !== state.servingTeam) {
    return styles.receivingTeam
  }

  if (player.id === serverId) {
    return styles.currentServer
  }

  return styles.supportingServer
}

const positionClass = (position: 'even' | 'odd' | 'center'): string => {
  switch (position) {
    case 'odd':
      return styles.positionOdd
    case 'even':
      return styles.positionEven
    default:
      return styles.positionCenter
  }
}

export function CourtDiagram({ labels, state, teamLabels, onScore }: Props) {
  const layout = getCourtLayout(state)
  const server = getServerPlayer(state)

  const renderPlayer = (player: Player | null, position: 'even' | 'odd' | 'center') => {
    if (!player) {
      return null
    }

    const isServer = player.id === server.id

    return (
      <button
        key={player.id}
        type="button"
        className={[
          styles.player,
          positionClass(position),
          playerToneClass(state, server.id, player),
        ].join(' ')}
        onClick={() => onScore(player.team)}
        aria-label={`${player.name} scores for ${teamLabels[player.team]}`}
      >
        <span className={styles.playerCircle}>{player.name}</span>
        {isServer ? <span className={styles.serverBadge}>{labels.server}</span> : null}
      </button>
    )
  }

  if (state.settings.mode === 'singles') {
    const aPlayer = state.players.find((player) => player.team === 'A') ?? null
    const bPlayer = state.players.find((player) => player.team === 'B') ?? null

    return (
      <section className={styles.court}>
        <div className={styles.teamHalf}>
          <span className={styles.teamName}>{teamLabels.A}</span>
          {renderPlayer(aPlayer, 'center')}
        </div>
        <div className={styles.net}>
          <span>NET</span>
        </div>
        <div className={styles.teamHalf}>
          <span className={styles.teamName}>{teamLabels.B}</span>
          {renderPlayer(bPlayer, 'center')}
        </div>
      </section>
    )
  }

  return (
    <section className={styles.court}>
      <div className={styles.teamHalf}>
        <div className={styles.sideLabels}>
          <span>{labels.sideLeft}</span>
          <span>{teamLabels.A}</span>
          <span>{labels.sideRight}</span>
        </div>
        {renderPlayer(layout.topLeft, 'odd')}
        {renderPlayer(layout.topRight, 'even')}
      </div>
      <div className={styles.net}>
        <span>NET</span>
      </div>
      <div className={styles.teamHalf}>
        <div className={styles.sideLabels}>
          <span>{labels.sideLeft}</span>
          <span>{teamLabels.B}</span>
          <span>{labels.sideRight}</span>
        </div>
        {renderPlayer(layout.bottomLeft, 'odd')}
        {renderPlayer(layout.bottomRight, 'even')}
      </div>
    </section>
  )
}
