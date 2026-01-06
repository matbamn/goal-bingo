import { useState } from 'react'
import { PixelIcon } from '../assets/Icons'

function BingoGrid({ size, goals, onUpdateGoal, onToggleComplete, mode, onFinishSetup }) {
    const [editingIndex, setEditingIndex] = useState(null)
    const [editText, setEditText] = useState('')
    const [selectedIcon, setSelectedIcon] = useState(null)

    const availableIcons = [
        { name: 'Shoe' },
        { name: 'Book' },
        { name: 'Apple' },
        { name: 'Coffee' },
        { name: 'Heart' },
        { name: 'Star' },
        { name: 'Medal' },
        { name: 'Sun' },
        { name: 'Gift' }
    ]

    const handleCellClick = (index) => {
        if (mode === 'setup') {
            setEditingIndex(index)
            setEditText(goals[index]?.text || '')
            setSelectedIcon(goals[index]?.icon || 'Star')
        } else if (mode === 'play') {
            if (goals[index]?.text) {
                onToggleComplete(index)
            }
        }
    }

    const saveGoal = () => {
        if (editingIndex !== null) {
            onUpdateGoal(editingIndex, editText, selectedIcon)
            setEditingIndex(null)
            setEditText('')
            setSelectedIcon(null)
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            saveGoal()
        }
    }

    const isAllFilled = goals.every(g => g.text && g.text.trim() !== '')



    return (
        <div className="bingo-board-container">
            <div
                className="bingo-grid"
                style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
            >
                {goals.map((goal, index) => (
                    <div
                        key={index}
                        className={`bingo-cell retro-box ${!goal.text ? 'empty' : ''} ${goal.completed ? 'completed' : ''}`}
                        onClick={() => handleCellClick(index)}
                    >
                        {goal.completed && <div className="bingo-badge">BINGO!</div>}
                        <div className="cell-icon">
                            <PixelIcon name={goal.icon || 'Star'} size={32} />
                        </div>
                        <span className="cell-text">{goal.text || (mode === 'setup' ? '+' : '')}</span>
                    </div>
                ))}
            </div>

            {mode === 'setup' && (
                <div style={{ marginTop: '2rem' }}>
                    <button
                        className="retro-btn"
                        style={{ width: '100%', padding: '1.2rem', fontSize: '1.1rem' }}
                        onClick={onFinishSetup}
                        disabled={!isAllFilled}
                    >
                        COMPLETE SETUP & START QUEST!
                    </button>
                    {!isAllFilled && <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.5rem' }}>* Fill all cells to start</p>}
                </div>
            )}

            {editingIndex !== null && (
                <div className="arcade-modal-overlay" onClick={() => setEditingIndex(null)}>
                    <div className="arcade-modal-content" onClick={e => e.stopPropagation()}>
                        <h3 style={{ marginBottom: '1rem', fontWeight: 900 }}>SET CELL GOAL</h3>

                        <div className="form-group">
                            <label>CELL GOAL DESCRIPTION</label>
                            <textarea
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="What is your task?"
                                autoFocus
                                style={{
                                    width: '100%', height: '80px', padding: '10px',
                                    border: '4px solid var(--arcade-border)', fontFamily: 'inherit',
                                    fontSize: '16px'
                                }}
                            />
                        </div>

                        <div className="form-group" style={{ marginTop: '1rem' }}>
                            <label>PICK AN ICON</label>
                            <div className="icon-grid-picker">
                                {availableIcons.map(icon => (
                                    <div
                                        key={icon.name}
                                        className={`icon-option retro-box ${selectedIcon === icon.name ? 'selected' : ''}`}
                                        onClick={() => setSelectedIcon(icon.name)}
                                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px' }}
                                    >
                                        <PixelIcon name={icon.name} size={24} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                            <button className="retro-btn" style={{ background: '#ccc', flex: 1 }} onClick={() => setEditingIndex(null)}>CANCEL</button>
                            <button className="retro-btn" style={{ flex: 1 }} onClick={saveGoal}>SAVE</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default BingoGrid
