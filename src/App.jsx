import { useState, useEffect } from 'react'
import confetti from 'canvas-confetti'
import html2canvas from 'html2canvas'
import SetupScreen from './components/SetupScreen'
import BingoGrid from './components/BingoGrid'
import RewardCard from './components/RewardCard'
import CelebrationModal from './components/CelebrationModal'
import './index.css'

function App() {
  const [config, setConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('bingoConfig')
      return saved ? JSON.parse(saved) : null
    } catch (e) { return null }
  })

  const [goals, setGoals] = useState(() => {
    try {
      const saved = localStorage.getItem('bingoGoals')
      return saved ? JSON.parse(saved) : []
    } catch (e) { return [] }
  })
  const [mode, setMode] = useState(() => {
    return localStorage.getItem('bingoMode') || 'setup'
  })
  const [completedLines, setCompletedLines] = useState(() => {
    return parseInt(localStorage.getItem('bingoCompletedLines') || '0', 10)
  })
  const [isRewardClaimed, setIsRewardClaimed] = useState(() => {
    return localStorage.getItem('bingoRewardClaimed') === 'true'
  })

  // Modal State
  const [showCelebration, setShowCelebration] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [confirmCallback, setConfirmCallback] = useState(null)
  const [confirmMessage, setConfirmMessage] = useState('')

  // Helper to trigger confirm
  const requestConfirm = (message, onConfirm) => {
    setConfirmMessage(message)
    setConfirmCallback(() => onConfirm)
    setShowConfirm(true)
  }

  const handleConfirmAction = () => {
    if (confirmCallback) confirmCallback()
    setShowConfirm(false)
    setConfirmCallback(null)
  }

  // Persist data
  useEffect(() => {
    if (config) localStorage.setItem('bingoConfig', JSON.stringify(config))
  }, [config])

  useEffect(() => {
    localStorage.setItem('bingoGoals', JSON.stringify(goals))
  }, [goals])

  useEffect(() => {
    localStorage.setItem('bingoMode', mode)
  }, [mode])

  useEffect(() => {
    localStorage.setItem('bingoRewardClaimed', isRewardClaimed.toString())
  }, [isRewardClaimed])

  // Check for Bingo
  useEffect(() => {
    if (mode === 'play' && config && goals.length > 0) {
      checkBingo(goals, config.gridSize)
    }
  }, [goals, mode, config])

  const checkBingo = (currentGoals, size) => {
    const lines = []

    // Rows
    for (let i = 0; i < size; i++) {
      const row = currentGoals.slice(i * size, (i + 1) * size)
      if (row.every(g => g.completed)) lines.push(`row-${i}`)
    }
    // Cols
    for (let i = 0; i < size; i++) {
      let colComplete = true
      for (let j = 0; j < size; j++) {
        const idx = i + j * size;
        if (!currentGoals[idx] || !currentGoals[idx].completed) colComplete = false
      }
      if (colComplete) lines.push(`col-${i}`)
    }

    // Diagonals
    if (Array.from({ length: size }).every((_, i) => currentGoals[i * size + i]?.completed)) lines.push('d1')
    if (Array.from({ length: size }).every((_, i) => currentGoals[i * size + (size - 1 - i)]?.completed)) lines.push('d2')

    const prevLinesCount = completedLines

    if (lines.length > prevLinesCount) {
      triggerConfetti()
    }

    setCompletedLines(lines.length)
    localStorage.setItem('bingoCompletedLines', lines.length.toString())
  }

  const triggerConfetti = () => {
    const duration = 3000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    const random = (min, max) => Math.random() * (max - min) + min

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: random(0.1, 0.3), y: Math.random() - 0.2 } }))
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: random(0.7, 0.9), y: Math.random() - 0.2 } }))
    }, 250)
  }

  const handleStartSetup = (newConfig) => {
    setConfig(newConfig)
    const initialGoals = Array(newConfig.gridSize * newConfig.gridSize).fill(null).map((_, i) => ({
      id: i,
      text: '',
      completed: false,
      icon: null
    }))
    setGoals(initialGoals)
    setMode('setup')
  }

  const handleUpdateGoal = (index, text, icon) => {
    const newGoals = [...goals]
    newGoals[index] = { ...newGoals[index], text, icon: icon || newGoals[index].icon }
    setGoals(newGoals)
  }

  const handleRandomize = () => {
    const newGoals = [...goals]
    for (let i = newGoals.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newGoals[i], newGoals[j]] = [newGoals[j], newGoals[i]];
    }
    setGoals(newGoals)
  }

  const handleFinishSetup = () => {
    requestConfirm('Are you ready to start? You cannot change grid size after this.', () => {
      setMode('play')
      setCompletedLines(0)
      localStorage.setItem('bingoCompletedLines', '0')
    })
  }

  const handleToggleComplete = (index) => {
    if (mode !== 'play') return
    const newGoals = [...goals]
    newGoals[index] = { ...newGoals[index], completed: !newGoals[index].completed }
    setGoals(newGoals)
  }

  const handleClaimReward = () => {
    setIsRewardClaimed(true)
    setShowCelebration(true)
    triggerConfetti()
  }

  const handleExportBingo = async () => {
    const element = document.getElementById('bingo-board-area');
    if (!element) return;
    try {
      const canvas = await html2canvas(element, {
        backgroundColor: '#F8F9F3',
        scale: 2, // Higher quality
      });
      const link = document.createElement('a');
      link.download = `bingo-${config.title || 'quest'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Export failed', err);
      alert('Failed to export image.');
    }
  }

  const resetBingo = () => {
    requestConfirm('This will delete your current bingo. Are you sure?', () => {
      setConfig(null)
      setGoals([])
      setMode('setup')
      setIsRewardClaimed(false)
      setShowCelebration(false)
      localStorage.clear()
    })
  }

  const calculateProgress = () => {
    if (!goals.length) return 0
    const completed = goals.filter(g => g.completed).length
    return Math.round((completed / goals.length) * 100)
  }

  return (
    <div className="app-container arcade-theme">
      <header className="app-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900 }}>GOAL BINGO</h1>
        {config && (
          <button onClick={resetBingo} className="retro-btn" style={{ padding: '0.4rem 0.8rem', fontSize: '0.7rem' }}>
            RESET QUEST
          </button>
        )}
      </header>

      <main>
        {!config ? (
          <SetupScreen onStart={handleStartSetup} />
        ) : (
          <div id="bingo-board-area" style={{ padding: '1rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{config.title}</h2>
              <p style={{ color: '#666', marginBottom: '1rem', fontSize: '0.9rem' }}>
                {config.startDate} ~ {config.endDate}
              </p>

              {config.reward && (
                <RewardCard
                  reward={config.reward}
                  isUnlocked={completedLines > 0}
                  isClaimed={isRewardClaimed}
                  onClaim={handleClaimReward}
                  completedLines={completedLines}
                />
              )}

              {mode === 'play' && (
                <div style={{ marginTop: '1rem' }}>
                  <div className="retro-box" style={{ width: '100%', height: '12px', background: '#eee', overflow: 'hidden', marginBottom: '0.5rem' }}>
                    <div
                      style={{
                        width: `${calculateProgress()}%`,
                        height: '100%',
                        background: 'var(--arcade-mint)',
                        transition: 'width 0.5s ease'
                      }}
                    />
                  </div>
                  <p style={{ fontWeight: 800, fontSize: '0.9rem' }}>{calculateProgress()}% QUEST COMPLETE</p>
                </div>
              )}
            </div>

            <BingoGrid
              size={config.gridSize}
              goals={goals}
              onUpdateGoal={handleUpdateGoal}
              onToggleComplete={handleToggleComplete}
              mode={mode}
              onFinishSetup={handleFinishSetup}
            />

            {mode === 'play' && (
              <div style={{ marginTop: '2rem' }}>
                <button className="retro-btn" onClick={handleExportBingo}>
                  📸 SHARE BINGO (IMAGE)
                </button>
              </div>
            )}

            {mode === 'setup' && (
              <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                <button onClick={handleRandomize} className="retro-btn" style={{ background: '#f0f0f0' }}>
                  🔀 SHUFFLE CELLS
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="arcade-modal-overlay">
          <div className="arcade-modal-content">
            <h3 style={{ marginTop: 0, marginBottom: '1rem', fontWeight: 900 }}>ARE YOU SURE?</h3>
            <p style={{ marginBottom: '2rem', color: '#555' }}>{confirmMessage}</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button className="retro-btn" style={{ background: '#ccc' }} onClick={() => setShowConfirm(false)}>NO</button>
              <button className="retro-btn" onClick={handleConfirmAction}>YES!</button>
            </div>
          </div>
        </div>
      )}

      {/* Celebration Modal */}
      {showCelebration && (
        <CelebrationModal
          reward={config?.reward}
          onClose={() => setShowCelebration(false)}
        />
      )}
    </div>
  )
}

export default App
