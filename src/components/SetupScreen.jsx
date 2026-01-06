import { useState } from 'react'
import './SetupScreen.css'

function SetupScreen({ onStart }) {
    const [title, setTitle] = useState('')
    const [reward, setReward] = useState('')
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0])
    const [endDate, setEndDate] = useState('')
    const [durationUnit, setDurationUnit] = useState('custom')
    const [gridSize, setGridSize] = useState(3)

    const rewardSuggestions = [
        { label: '🍰 Snack', value: 'Delicious snack break' },
        { label: '🎮 Gaming', value: '1 hour of gaming' },
        { label: '🎬 Movie', value: 'Watch a movie tonight' },
        { label: '☕ Coffee', value: 'Fancy coffee date' },
        { label: '🎁 Gift', value: 'Buy something I want' },
        { label: '✈️ Travel', value: 'Weekend Trip' }
    ]

    const handleDurationChange = (unit) => {
        setDurationUnit(unit)
        if (unit === 'custom') return

        const start = new Date(startDate)
        let end = new Date(start)

        if (unit === 'week') {
            end.setDate(start.getDate() + 7)
        } else if (unit === 'month') {
            end.setMonth(start.getMonth() + 1)
        } else if (unit === 'year') {
            end.setFullYear(start.getFullYear() + 1)
        }

        setEndDate(end.toISOString().split('T')[0])
    }

    const handleStartDateChange = (e) => {
        const newStart = e.target.value
        setStartDate(newStart)
        if (durationUnit !== 'custom') {
            const start = new Date(newStart)
            let end = new Date(start)
            if (durationUnit === 'week') end.setDate(start.getDate() + 7)
            else if (durationUnit === 'month') end.setMonth(start.getMonth() + 1)
            else if (durationUnit === 'year') end.setFullYear(start.getFullYear() + 1)
            setEndDate(end.toISOString().split('T')[0])
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!title || !endDate || !reward) {
            alert('Please fill in all fields (Title, Reward, Date)')
            return
        }
        onStart({ title, reward, startDate, endDate, gridSize })
    }

    return (
        <div className="setup-container setup-card">
            <h2 className="setup-title">START YOUR QUEST</h2>

            <form onSubmit={handleSubmit} className="setup-form">
                <div className="form-group">
                    <label>QUEST TITLE</label>
                    <input
                        type="text"
                        placeholder="e.g., Summer Fitness Quest"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="retro-input"
                    />
                </div>

                <div className="form-group">
                    <label>QUEST REWARD</label>
                    <input
                        type="text"
                        placeholder="e.g., Weekend Getaway"
                        value={reward}
                        onChange={(e) => setReward(e.target.value)}
                        className="retro-input"
                    />
                    <div className="suggestion-buttons">
                        {rewardSuggestions.map((sug) => (
                            <button
                                key={sug.label}
                                type="button"
                                className="retro-btn suggestion-btn"
                                onClick={() => setReward(sug.value)}
                            >
                                {sug.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="form-group">
                    <label>DURATION</label>
                    <div className="duration-buttons">
                        {['week', 'month', 'year', 'custom'].map(unit => (
                            <button
                                key={unit}
                                type="button"
                                className={`retro-btn duration-btn ${durationUnit === unit ? '' : 'inactive'}`}
                                onClick={() => handleDurationChange(unit)}
                            >
                                {unit === 'week' ? '1 WEEK' : unit === 'month' ? '1 MONTH' : unit === 'year' ? '1 YEAR' : 'CUSTOM'}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="date-inputs">
                    <div className="date-input-group">
                        <label>START DATE</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={handleStartDateChange}
                        />
                    </div>
                    <div className="date-input-group">
                        <label>END DATE</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => {
                                setEndDate(e.target.value)
                                setDurationUnit('custom')
                            }}
                            disabled={durationUnit !== 'custom'}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>GRID DIFFICULTY</label>
                    <div className="duration-buttons">
                        {[3, 4].map(size => (
                            <button
                                key={size}
                                type="button"
                                className={`retro-btn duration-btn ${gridSize === size ? '' : 'inactive'}`}
                                onClick={() => setGridSize(size)}
                            >
                                {size}x{size}
                            </button>
                        ))}
                    </div>
                </div>

                <button type="submit" className="retro-btn submit-btn">
                    CREATE BINGO QUEST!
                </button>
            </form>
        </div>
    )
}

export default SetupScreen
