import { useState } from 'react'

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
        { label: '🎁 Gift', value: 'Buy something I want' }
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
        <div className="setup-card">
            <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '2rem', textAlign: 'center' }}>START YOUR QUEST</h2>

            <form onSubmit={handleSubmit} className="setup-form">
                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <label style={{ textAlign: 'left' }}>QUEST TITLE</label>
                    <input
                        type="text"
                        placeholder="e.g., Summer Fitness Quest"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="retro-input"
                    />
                </div>

                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <label style={{ textAlign: 'left' }}>QUEST REWARD</label>
                    <input
                        type="text"
                        placeholder="e.g., Weekend Getaway"
                        value={reward}
                        onChange={(e) => setReward(e.target.value)}
                        className="retro-input"
                    />
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', justifyContent: 'space-between' }}>
                        {rewardSuggestions.map((sug) => (
                            <button
                                key={sug.label}
                                type="button"
                                className="retro-btn"
                                style={{
                                    flex: 1,
                                    padding: '0.4rem 0.3rem',
                                    fontSize: '0.7rem',
                                    textAlign: 'center',
                                    whiteSpace: 'nowrap'
                                }}
                                onClick={() => setReward(sug.value)}
                            >
                                {sug.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                    <label style={{ textAlign: 'left' }}>DURATION</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {['week', 'month', 'year', 'custom'].map(unit => (
                            <button
                                key={unit}
                                type="button"
                                className="retro-btn"
                                style={{
                                    flex: 1,
                                    padding: '0.5rem',
                                    background: durationUnit === unit ? 'var(--arcade-yellow)' : '#eee',
                                    fontSize: '0.8rem',
                                    textAlign: 'center'
                                }}
                                onClick={() => handleDurationChange(unit)}
                            >
                                {unit === 'week' ? '1 WEEK' : unit === 'month' ? '1 MONTH' : unit === 'year' ? '1 YEAR' : 'CUSTOM'}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="form-group" style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ textAlign: 'left' }}>START DATE</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={handleStartDateChange}
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={{ textAlign: 'left' }}>END DATE</label>
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

                <div className="form-group" style={{ marginBottom: '2rem' }}>
                    <label style={{ textAlign: 'left' }}>GRID DIFFICULTY</label>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        {[3, 4, 5].map(size => (
                            <button
                                key={size}
                                type="button"
                                className={`retro-btn ${gridSize === size ? '' : 'inactive'}`}
                                style={{
                                    flex: 1,
                                    background: gridSize === size ? 'var(--arcade-yellow)' : '#eee',
                                    textAlign: 'center'
                                }}
                                onClick={() => setGridSize(size)}
                            >
                                {size}x{size}
                            </button>
                        ))}
                    </div>
                </div>

                <button type="submit" className="retro-btn" style={{ width: '100%', fontSize: '1.2rem', padding: '1rem', textAlign: 'center' }}>
                    CREATE BINGO QUEST!
                </button>
            </form>
        </div>
    )
}

export default SetupScreen
