import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useGamePersistence, STORAGE_KEY, SESSION_KEY } from './useGamePersistence.js'

function makeMockStorage() {
  const store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value }),
    removeItem: vi.fn((key: string) => { delete store[key] }),
    clear: vi.fn(() => { Object.keys(store).forEach(k => delete store[k]) }),
  }
}

describe('useGamePersistence — loadPersistedState', () => {
  let storage: ReturnType<typeof makeMockStorage>

  beforeEach(() => {
    storage = makeMockStorage()
    vi.stubGlobal('localStorage', storage)
  })

  it('returns null when localStorage has no entry', () => {
    const { loadPersistedState } = useGamePersistence()
    expect(loadPersistedState()).toBeNull()
  })

  it('returns parsed object when localStorage has valid JSON', () => {
    const data = { config: { mode: 'singles' }, game: { type: 'singles' } }
    storage.setItem(STORAGE_KEY, JSON.stringify(data))
    const { loadPersistedState } = useGamePersistence()
    expect(loadPersistedState()).toEqual(data)
  })

  it('returns null and clears key when JSON is corrupted', () => {
    storage.setItem(STORAGE_KEY, 'not-valid-json{{{')
    const { loadPersistedState } = useGamePersistence()
    expect(loadPersistedState()).toBeNull()
    expect(storage.removeItem).toHaveBeenCalledWith(STORAGE_KEY)
  })
})

describe('useGamePersistence — saveGameState', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', makeMockStorage())
  })

  it('silently fails when localStorage.setItem throws', () => {
    const throwingStorage = makeMockStorage()
    throwingStorage.setItem.mockImplementation(() => { throw new Error('QuotaExceededError') })
    vi.stubGlobal('localStorage', throwingStorage)
    const { saveGameState } = useGamePersistence()
    const fakeConfig = { mode: 'singles' } as never
    const fakeGame = { serialize: () => ({ type: 'singles' }) } as never
    expect(() => saveGameState(fakeConfig, fakeGame)).not.toThrow()
  })
})

describe('useGamePersistence — clearGameState', () => {
  let storage: ReturnType<typeof makeMockStorage>
  let session: ReturnType<typeof makeMockStorage>

  beforeEach(() => {
    storage = makeMockStorage()
    session = makeMockStorage()
    vi.stubGlobal('localStorage', storage)
    vi.stubGlobal('sessionStorage', session)
  })

  it('removes the key so loadPersistedState returns null after clear', () => {
    storage.setItem(STORAGE_KEY, JSON.stringify({ config: {}, game: {} }))
    const { clearGameState, loadPersistedState } = useGamePersistence()
    clearGameState()
    expect(storage.removeItem).toHaveBeenCalledWith(STORAGE_KEY)
    expect(loadPersistedState()).toBeNull()
  })

  it('clears sessionStorage flag when clearGameState is called', () => {
    const { clearGameState } = useGamePersistence()
    clearGameState()
    expect(session.removeItem).toHaveBeenCalledWith(SESSION_KEY)
  })
})

describe('useGamePersistence — session detection', () => {
  let session: ReturnType<typeof makeMockStorage>

  beforeEach(() => {
    vi.stubGlobal('localStorage', makeMockStorage())
    session = makeMockStorage()
    vi.stubGlobal('sessionStorage', session)
  })

  it('markSessionActive sets sessionStorage flag', () => {
    const { markSessionActive } = useGamePersistence()
    markSessionActive()
    expect(session.setItem).toHaveBeenCalledWith(SESSION_KEY, '1')
  })

  it('isSessionActive returns true when flag is set', () => {
    session.setItem(SESSION_KEY, '1')
    const { isSessionActive } = useGamePersistence()
    expect(isSessionActive()).toBe(true)
  })

  it('isSessionActive returns false when flag is absent', () => {
    const { isSessionActive } = useGamePersistence()
    expect(isSessionActive()).toBe(false)
  })

  it('saveGameState writes JSON containing a numeric savedAt field', () => {
    const storage = makeMockStorage()
    vi.stubGlobal('localStorage', storage)
    const before = Date.now()
    const { saveGameState } = useGamePersistence()
    const fakeConfig = { mode: 'singles' } as never
    const fakeGame = { serialize: () => ({ type: 'singles' }) } as never
    saveGameState(fakeConfig, fakeGame)
    const written = JSON.parse(storage.setItem.mock.calls[0]![1]!)
    expect(typeof written.savedAt).toBe('number')
    expect(written.savedAt).toBeGreaterThanOrEqual(before)
  })

  it('isSessionActive returns false when sessionStorage throws', () => {
    const brokenSession = makeMockStorage()
    brokenSession.getItem.mockImplementation(() => { throw new Error('SecurityError') })
    vi.stubGlobal('sessionStorage', brokenSession)
    const { isSessionActive } = useGamePersistence()
    expect(isSessionActive()).toBe(false)
  })

  it('markSessionActive silently fails when sessionStorage throws', () => {
    const brokenSession = makeMockStorage()
    brokenSession.setItem.mockImplementation(() => { throw new Error('SecurityError') })
    vi.stubGlobal('sessionStorage', brokenSession)
    const { markSessionActive } = useGamePersistence()
    expect(() => markSessionActive()).not.toThrow()
  })
})
